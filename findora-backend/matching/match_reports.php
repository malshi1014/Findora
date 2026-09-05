<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? ''; if ($origin === 'https://findora.freehosting.dev' || $origin === 'http://localhost:5173') { header('Access-Control-Allow-Origin: ' . $origin); } header('Access-Control-Allow-Headers: Content-Type'); header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); header('Content-Type: application/json');
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

include __DIR__ . "/../config/db.php";

/*
Score breakdown:
Category match              = 20
District match              = 15
Location similarity         = 10
Date closeness              = 15
Unique identifiers match    = 25
Description vector similarity = 15
Total                       = 100
Threshold                   = 75
*/

$threshold = 75;

/* Convert text into clean keywords */
function tokenizeText($text) {
    $text = strtolower($text);
    $text = preg_replace("/[^a-z0-9\s]/", " ", $text);
    $words = preg_split("/\s+/", $text);

    $stopWords = array(
        "the", "and", "or", "a", "an", "is", "are", "was", "were",
        "in", "on", "at", "near", "with", "to", "of", "for", "from",
        "this", "that", "it", "my", "has", "have"
    );

    $cleanWords = array();

    foreach ($words as $word) {
        $word = trim($word);

        if ($word !== "" && strlen($word) > 1 && !in_array($word, $stopWords)) {
            $cleanWords[] = $word;
        }
    }

    return $cleanWords;
}

/* Create word frequency vector */
function createVector($words) {
    $vector = array();

    foreach ($words as $word) {
        if (!isset($vector[$word])) {
            $vector[$word] = 0;
        }
        $vector[$word]++;
    }

    return $vector;
}

/* Calculate cosine similarity between two texts */
function cosineSimilarity($text1, $text2) {
    if (empty($text1) || empty($text2)) {
        return 0;
    }

    $words1 = tokenizeText($text1);
    $words2 = tokenizeText($text2);

    if (count($words1) === 0 || count($words2) === 0) {
        return 0;
    }

    $vector1 = createVector($words1);
    $vector2 = createVector($words2);

    $dotProduct = 0;
    $magnitude1 = 0;
    $magnitude2 = 0;

    foreach ($vector1 as $word => $count) {
        if (isset($vector2[$word])) {
            $dotProduct += $count * $vector2[$word];
        }
        $magnitude1 += $count * $count;
    }

    foreach ($vector2 as $count) {
        $magnitude2 += $count * $count;
    }

    if ($magnitude1 == 0 || $magnitude2 == 0) {
        return 0;
    }

    return $dotProduct / (sqrt($magnitude1) * sqrt($magnitude2));
}

/* Date closeness score */
function dateScore($lostDate, $foundDate) {
    if (empty($lostDate) || empty($foundDate)) {
        return 0;
    }

    $lost = strtotime($lostDate);
    $found = strtotime($foundDate);

    if ($lost === false || $found === false) {
        return 0;
    }

    $daysDifference = abs(($found - $lost) / (60 * 60 * 24));

    if ($daysDifference == 0) {
        return 15;
    } else if ($daysDifference <= 3) {
        return 10;
    } else if ($daysDifference <= 7) {
        return 5;
    }

    return 0;
}

/* Hybrid matching score */
function calculateMatchScore($lost, $found) {
    $score = 0;

    // 1. Category match - 20
    if (strtolower($lost["category"]) === strtolower($found["category"])) {
        $score += 20;
    }

    // 2. District match - 15
    if (!empty($lost["district"]) && !empty($found["district"])) {
        if (strtolower($lost["district"]) === strtolower($found["district"])) {
            $score += 15;
        }
    }

    // 3. Location similarity - 10
    $locationSimilarity = cosineSimilarity($lost["location"], $found["location"]);
    $score += round($locationSimilarity * 10, 2);

    // 4. Date closeness - 15
    $score += dateScore($lost["lost_date"], $found["found_date"]);

    // 5. Unique identifier similarity - 25
    $uniqueSimilarity = cosineSimilarity($lost["unique_identifiers"], $found["unique_identifiers"]);
    $score += round($uniqueSimilarity * 25, 2);

    // 6. Description/title vector similarity - 15
    $lostText = $lost["title"] . " " . $lost["description"] . " " . $lost["unique_identifiers"];
    $foundText = $found["title"] . " " . $found["description"] . " " . $found["unique_identifiers"];

    $descriptionSimilarity = cosineSimilarity($lostText, $foundText);
    $score += round($descriptionSimilarity * 15, 2);

    if ($score > 100) {
        $score = 100;
    }

    return round($score, 2);
}

try {
    $lostReports = array();
    $foundReports = array();

    $lostQuery = $conn->query("
        SELECT *
        FROM lost_report
        WHERE status IN ('pending', 'active')
    ");

    while ($row = $lostQuery->fetch_assoc()) {
        $lostReports[] = $row;
    }

    $foundQuery = $conn->query("
        SELECT *
        FROM found_report
        WHERE status IN ('pending', 'active')
    ");

    while ($row = $foundQuery->fetch_assoc()) {
        $foundReports[] = $row;
    }

    $possibleMatches = array();

    foreach ($lostReports as $lost) {
        foreach ($foundReports as $found) {
            $score = calculateMatchScore($lost, $found);

            if ($score >= $threshold) {
                // Check duplicate match
                $check = $conn->prepare("
                    SELECT match_id
                    FROM matches
                    WHERE lost_report_id = ? AND found_report_id = ?
                    LIMIT 1
                ");

                $check->bind_param("ii", $lost["report_id"], $found["report_id"]);
                $check->execute();
                $checkResult = $check->get_result();

                if ($checkResult->num_rows === 0) {
                    $insert = $conn->prepare("
                        INSERT INTO matches
                        (lost_report_id, found_report_id, similarity_score, status)
                        VALUES (?, ?, ?, 'pending')
                    ");

                    $insert->bind_param(
                        "iid",
                        $lost["report_id"],
                        $found["report_id"],
                        $score
                    );

                    $insert->execute();
                    $matchId = $insert->insert_id;
                } else {
                    $existing = $checkResult->fetch_assoc();
                    $matchId = $existing["match_id"];

                    $update = $conn->prepare("
                        UPDATE matches
                        SET similarity_score = ?
                        WHERE match_id = ? AND status = 'pending'
                    ");

                    $update->bind_param("di", $score, $matchId);
                    $update->execute();
                }

                $possibleMatches[] = array(
                    "match_id" => $matchId,
                    "lost_report_id" => $lost["report_id"],
                    "found_report_id" => $found["report_id"],
                    "lost_title" => $lost["title"],
                    "found_title" => $found["title"],
                    "category" => $lost["category"],
                    "district" => $lost["district"],
                    "similarity_score" => $score,
                    "status" => "pending"
                );
            }
        }
    }

    echo json_encode(array(
        "status" => "success",
        "message" => "Matching process completed",
        "threshold" => $threshold,
        "total_matches_found" => count($possibleMatches),
        "matches" => $possibleMatches
    ));

} catch (Exception $e) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Matching process failed",
        "error" => $e->getMessage()
    ));
}
?>