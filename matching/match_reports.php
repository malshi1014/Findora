<?php

header("Content-Type: application/json");

// Accept both GET and POST so admin can trigger matching without CSRF token.
if (!in_array($_SERVER["REQUEST_METHOD"], ["GET", "POST"], true)) {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit();
}

include __DIR__ . "/../config/db.php";

/*
=====================================================
  FINDORA MATCHING ENGINE v3 (Improved)
  Improved Scoring Breakdown (100 points total):
  Category                 = 15
  Location (hierarchical)  = 20
  Date (decay)             = 15
  Unique Identifiers       = 30  (independent from description)
  Title similarity         =  5
  Description similarity   = 15
  -----------------------------------
  Total                    = 100

  Default threshold        = 60 (for testing)
  Confidence Levels:
    90-100 => Strong Match
    80-89  => Possible Match
    < 80   => No Match (not stored)
=====================================================
*/

$threshold = 60; // Adjusted for better match discovery during development

// ── Text processing helpers ─────────────────────────────────────────────────

function tokenizeText($text) {
    if (empty(trim($text))) return [];

    $text = strtolower($text);
    $text = preg_replace("/[^a-z0-9\s]/", " ", $text);
    $words = preg_split("/\s+/", trim($text), -1, PREG_SPLIT_NO_EMPTY);

    $stopWords = [
        "the", "and", "or", "a", "an", "is", "are", "was", "were",
        "in", "on", "at", "near", "with", "to", "of", "for", "from",
        "this", "that", "it", "my", "has", "have", "he", "she", "they",
        "found", "lost", "item", "one", "some", "its", "also", "very",
        "while", "walking", "down", "street", "yesterday", "evening"
    ];

    $result = [];
    foreach ($words as $word) {
        $word = trim($word);
        $hasDigit = preg_match('/\d/', $word);
        if ($word !== "" && !in_array($word, $stopWords) && (strlen($word) > 1 || $hasDigit)) {
            $result[] = $word;
        }
    }
    return $result;
}

function createVector($words) {
    $vector = [];
    foreach ($words as $word) {
        $vector[$word] = ($vector[$word] ?? 0) + 1;
    }
    return $vector;
}

function cosineSimilarity($text1, $text2) {
    if (empty(trim((string)$text1)) || empty(trim((string)$text2))) return 0.0;

    $words1 = tokenizeText($text1);
    $words2 = tokenizeText($text2);

    if (count($words1) === 0 || count($words2) === 0) return 0.0;

    $v1 = createVector($words1);
    $v2 = createVector($words2);

    $dot = 0.0;
    $mag1 = 0.0;
    $mag2 = 0.0;

    foreach ($v1 as $w => $c) {
        if (isset($v2[$w])) $dot += $c * $v2[$w];
        $mag1 += $c * $c;
    }
    foreach ($v2 as $c) {
        $mag2 += $c * $c;
    }

    if ($mag1 == 0 || $mag2 == 0) return 0.0;
    return $dot / (sqrt($mag1) * sqrt($mag2));
}

// ── Hard compatibility check ─────────────────────────────────────────────────

function isHardRejected($lost, $found) {
    $lDate = $lost["lost_date"] ?? "";
    $fDate = $found["found_date"] ?? "";

    if (empty($lDate) || empty($fDate)) return false;

    $lt = strtotime($lDate);
    $ft = strtotime($fDate);

    if ($lt === false || $ft === false) return false;

    // Found strictly before lost is logically impossible
    return ($ft < $lt);
}

// ── Scoring functions ────────────────────────────────────────────────────────

function scoreCategory($lost, $found) {
    $lCat = strtolower(trim($lost["category"] ?? ""));
    $fCat = strtolower(trim($found["category"] ?? ""));

    if (empty($lCat) || empty($fCat)) return 0;

    // Normalize basic differences
    if (strpos($lCat, $fCat) !== false || strpos($fCat, $lCat) !== false) {
        return 15;
    }
    return 0;
}

function scoreLocation($lost, $found) {
    $lDistrict = strtolower(trim($lost["district"] ?? ""));
    $fDistrict = strtolower(trim($found["district"] ?? ""));

    $lLoc = strtolower(trim($lost["location"] ?? "")) . " " . strtolower(trim($lost["nearest_town"] ?? ""));
    $fLoc = strtolower(trim($found["location"] ?? "")) . " " . strtolower(trim($found["nearest_town"] ?? ""));

    if (!empty($lDistrict) && !empty($fDistrict) && $lDistrict !== $fDistrict) {
        return 0; // Different district
    }

    $locSim = cosineSimilarity($lLoc, $fLoc);

    if ($locSim >= 0.70) {
        return 20;
    } elseif ($locSim >= 0.30) {
        return 15;
    } elseif ($lDistrict === $fDistrict && !empty($lDistrict)) {
        return 10;
    }
    return 5;
}

function scoreDate($lost, $found) {
    $lDate = $lost["lost_date"] ?? "";
    $fDate = $found["found_date"] ?? "";

    if (empty($lDate) || empty($fDate)) return 5;

    $lt = strtotime($lDate);
    $ft = strtotime($fDate);

    if ($lt === false || $ft === false) return 5;

    $days = ($ft - $lt) / 86400;

    if ($days < 0) return 0;
    if ($days == 0) return 15;
    if ($days <= 3)  return 12;
    if ($days <= 10)  return 8;
    if ($days <= 30) return 4;
    return 0;
}

function normalizeIdentifier($id) {
    $id = strtolower(trim($id));
    $id = preg_replace("/[^a-z0-9]/", "", $id);
    return $id;
}

function scoreIdentifiers($lost, $found, &$debugInfo) {
    $lIdRaw = trim(strtolower($lost["unique_identifiers"] ?? ""));
    $fIdRaw = trim(strtolower($found["unique_identifiers"] ?? ""));

    $lEmpty = empty($lIdRaw) || in_array($lIdRaw, ["none", "n/a", "-", "no", "unknown"]);
    $fEmpty = empty($fIdRaw) || in_array($fIdRaw, ["none", "n/a", "-", "no", "unknown"]);

    if ($lEmpty && $fEmpty) {
        $debugInfo["identifier_note"] = "Neither side has identifiers";
        return 15;
    }
    if ($lEmpty || $fEmpty) {
        $debugInfo["identifier_note"] = "One side has no identifier";
        return 15;
    }

    $lIdNorm = normalizeIdentifier($lIdRaw);
    $fIdNorm = normalizeIdentifier($fIdRaw);

    // Check for exact substring match (e.g. imei 356789123456789 inside imei356789123456789)
    if (strlen($lIdNorm) > 5 && strpos($fIdNorm, $lIdNorm) !== false) {
        $debugInfo["identifier_note"] = "Exact identifier match";
        return 30;
    }
    if (strlen($fIdNorm) > 5 && strpos($lIdNorm, $fIdNorm) !== false) {
        $debugInfo["identifier_note"] = "Exact identifier match";
        return 30;
    }

    $sim = cosineSimilarity($lIdRaw, $fIdRaw);
    $debugInfo["identifier_similarity"] = round($sim, 3);

    if ($sim >= 0.50) {
        $debugInfo["identifier_note"] = "Identifiers match well";
        return 30;
    }
    if ($sim >= 0.25) {
        $debugInfo["identifier_note"] = "Identifiers partially match";
        return round($sim * 28, 2);
    }

    $debugInfo["identifier_note"] = "CONFLICT: Identifiers disagree";
    return 0;
}

function scoreTitle($lost, $found) {
    $sim = cosineSimilarity($lost["title"] ?? "", $found["title"] ?? "");
    return round($sim * 5, 2);
}

function scoreDescription($lost, $found) {
    $lText = trim(($lost["title"] ?? "") . " " . ($lost["description"] ?? ""));
    $fText = trim(($found["title"] ?? "") . " " . ($found["description"] ?? ""));

    $sim = cosineSimilarity($lText, $fText);
    return round($sim * 15, 2);
}

function confidenceLevel($score) {
    if ($score >= 90) return "Strong Match";
    if ($score >= 80) return "Possible Match";
    return "Weak Match";
}

// ── Main scoring function ────────────────────────────────────────────────────

function calculateMatchScore($lost, $found) {
    $debug = [];

    if (isHardRejected($lost, $found)) {
        return [
            "score"         => 0,
            "confidence"    => "No Match",
            "breakdown"     => [],
            "rejected"      => true,
            "reject_reason" => "found_date is before lost_date"
        ];
    }

    $catScore   = scoreCategory($lost, $found);
    $locScore   = scoreLocation($lost, $found);
    $dateScore  = scoreDate($lost, $found);
    $idScore    = scoreIdentifiers($lost, $found, $debug);
    $titleScore = scoreTitle($lost, $found);
    $descScore  = scoreDescription($lost, $found);

    $total = $catScore + $locScore + $dateScore + $idScore + $titleScore + $descScore;
    $total = min(100, round($total, 2));

    $breakdown = [
        "category"    => ["score" => $catScore,   "max" => 15],
        "location"    => ["score" => $locScore,   "max" => 20],
        "date"        => ["score" => $dateScore,  "max" => 15],
        "identifiers" => ["score" => $idScore,    "max" => 30, "note" => $debug["identifier_note"] ?? "", "similarity" => $debug["identifier_similarity"] ?? null],
        "title"       => ["score" => $titleScore, "max" => 5],
        "description" => ["score" => $descScore,  "max" => 15],
    ];

    return [
        "score"         => $total,
        "confidence"    => confidenceLevel($total),
        "breakdown"     => $breakdown,
        "rejected"      => false,
        "reject_reason" => null
    ];
}

// ── Main matching loop ───────────────────────────────────────────────────────

try {
    $lostReports  = [];
    $foundReports = [];

    $lostQuery = $conn->query("SELECT * FROM lost_report WHERE status IN ('pending', 'active')");
    while ($row = $lostQuery->fetch_assoc()) {
        $lostReports[] = $row;
    }

    $foundQuery = $conn->query("SELECT * FROM found_report WHERE status IN ('pending', 'active')");
    while ($row = $foundQuery->fetch_assoc()) {
        $foundReports[] = $row;
    }

    $possibleMatches = [];
    $rejectedCount   = 0;
    $belowThresholdCount = 0;
    $matchesCreated = 0;
    $matchesUpdated = 0;
    $diagnostics = [];
    $pairsEvaluated = 0;

    foreach ($lostReports as $lost) {
        foreach ($foundReports as $found) {
            $pairsEvaluated++;
            $result = calculateMatchScore($lost, $found);

            if ($result["rejected"]) {
                $rejectedCount++;
                continue;
            }

            $score      = $result["score"];
            $confidence = $result["confidence"];

            if ($score < $threshold) {
                $belowThresholdCount++;
                if (count($diagnostics) < 100) { // Limit debug output
                    $diagnostics[] = [
                        "lost_report_id" => $lost["report_id"],
                        "found_report_id" => $found["report_id"],
                        "score" => $score,
                        "breakdown" => $result["breakdown"]
                    ];
                }
                continue;
            }

            // High score - process match
            $check = $conn->prepare("
                SELECT match_id, status
                FROM matches
                WHERE lost_report_id = ? AND found_report_id = ?
                LIMIT 1
            ");
            $check->bind_param("ii", $lost["report_id"], $found["report_id"]);
            $check->execute();
            $checkResult = $check->get_result();

            if ($checkResult->num_rows === 0) {
                $insert = $conn->prepare("
                    INSERT INTO matches (lost_report_id, found_report_id, similarity_score, status)
                    VALUES (?, ?, ?, 'pending')
                ");
                $insert->bind_param("iid", $lost["report_id"], $found["report_id"], $score);
                $insert->execute();
                $matchId = $insert->insert_id;
                $matchesCreated++;
            } else {
                $existing = $checkResult->fetch_assoc();
                $matchId  = $existing["match_id"];

                // Only update score, do not reset status to 'pending' if it was 'verified' or 'completed'
                $update = $conn->prepare("
                    UPDATE matches
                    SET similarity_score = ?
                    WHERE match_id = ?
                ");
                $update->bind_param("di", $score, $matchId);
                $update->execute();
                $matchesUpdated++;
            }

            $possibleMatches[] = [
                "match_id"         => $matchId,
                "lost_report_id"   => $lost["report_id"],
                "found_report_id"  => $found["report_id"],
                "lost_title"       => $lost["title"],
                "found_title"      => $found["title"],
                "category"         => $lost["category"],
                "district"         => $lost["district"],
                "similarity_score" => $score,
                "confidence"       => $confidence,
                "status"           => "pending"
            ];
        }
    }

    echo json_encode([
        "status"              => "success",
        "message"             => "Matching process completed",
        "threshold_used"      => $threshold,
        "total_lost_reports"  => count($lostReports),
        "total_found_reports" => count($foundReports),
        "pairs_evaluated"     => $pairsEvaluated,
        "hard_rejected"       => $rejectedCount,
        "below_threshold"     => $belowThresholdCount,
        "matches_created"     => $matchesCreated,
        "matches_updated"     => $matchesUpdated,
        "matches"             => $possibleMatches,
        "diagnostics"         => $diagnostics
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status"  => "error",
        "message" => "Matching process failed",
        "error"   => $e->getMessage()
    ]);
}
?>
