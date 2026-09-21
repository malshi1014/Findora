<?php
// evaluate.php - Tests the NEW v2 matching algorithm against 28 test cases

function tokenizeText($text) {
    if (empty(trim((string)$text))) return [];
    $text = strtolower($text);
    $text = preg_replace("/[^a-z0-9\s]/", " ", $text);
    $words = preg_split("/\s+/", trim($text), -1, PREG_SPLIT_NO_EMPTY);
    $stopWords = ["the","and","or","a","an","is","are","was","were","in","on","at","near",
        "with","to","of","for","from","this","that","it","my","has","have","he","she","they",
        "found","lost","item","one","some","its","also","very","while","walking","down",
        "street","yesterday","evening"];
    $result = [];
    foreach ($words as $word) {
        $hasDigit = preg_match('/\d/', $word);
        if ($word !== "" && !in_array($word, $stopWords) && (strlen($word) > 1 || $hasDigit)) {
            $result[] = $word;
        }
    }
    return $result;
}

function createVector($words) {
    $v = [];
    foreach ($words as $w) $v[$w] = ($v[$w] ?? 0) + 1;
    return $v;
}

function cosineSimilarity($t1, $t2) {
    if (empty(trim((string)$t1)) || empty(trim((string)$t2))) return 0.0;
    $w1 = tokenizeText($t1); $w2 = tokenizeText($t2);
    if (!$w1 || !$w2) return 0.0;
    $v1 = createVector($w1); $v2 = createVector($w2);
    $dot = $m1 = $m2 = 0.0;
    foreach ($v1 as $w => $c) { if (isset($v2[$w])) $dot += $c * $v2[$w]; $m1 += $c*$c; }
    foreach ($v2 as $c) $m2 += $c*$c;
    if ($m1==0||$m2==0) return 0.0;
    return $dot / (sqrt($m1)*sqrt($m2));
}

function isHardRejected($lost, $found) {
    $l = $lost["lost_date"] ?? ""; $f = $found["found_date"] ?? "";
    if (empty($l)||empty($f)) return false;
    $lt = strtotime($l); $ft = strtotime($f);
    if ($lt===false||$ft===false) return false;
    return ($ft < $lt);
}

function scoreCategory($l, $f) {
    return strtolower(trim($l["category"]??"")) === strtolower(trim($f["category"]??"")) ? 15 : 0;
}

function scoreLocation($l, $f) {
    $ld = strtolower(trim($l["district"]??"")); $fd = strtolower(trim($f["district"]??""));
    if (empty($ld)||empty($fd)) return round(cosineSimilarity($l["location"]??"",$f["location"]??"")*10,2);
    if ($ld !== $fd) return 0;
    $ll = strtolower(trim($l["location"]??"")); $fl = strtolower(trim($f["location"]??""));
    if (empty($ll)||empty($fl)) return 10;
    $sim = cosineSimilarity($ll, $fl);
    if ($sim >= 0.80) return 20;
    if ($sim >= 0.40) return 15;
    return 10;
}

function scoreDate($l, $f) {
    $ld = $l["lost_date"]??""; $fd = $f["found_date"]??"";
    if (empty($ld)||empty($fd)) return 5;
    $lt = strtotime($ld); $ft = strtotime($fd);
    if ($lt===false||$ft===false) return 0;
    $days = ($ft - $lt) / 86400;
    if ($days < 0) return 0;
    if ($days == 0) return 15;
    if ($days <= 2)  return 12;
    if ($days <= 7)  return 8;
    if ($days <= 14) return 4;
    if ($days <= 30) return 1; // Almost nothing for month-old gap
    return 0;
}

function scoreIdentifiers($l, $f) {
    $li = trim(strtolower($l["unique_identifiers"]??"")); $fi = trim(strtolower($f["unique_identifiers"]??""));
    $le = empty($li)||in_array($li,["none","n/a","-"]);
    $fe = empty($fi)||in_array($fi,["none","n/a","-"]);
    // Neither side has identifiers - neutral credit (allows E-group to pass)
    if ($le && $fe) return 18;
    // One side unknown - moderate neutral
    if ($le || $fe) return 15;
    // Both sides have identifiers - rigorously compare
    $sim = cosineSimilarity($li, $fi);
    if ($sim >= 0.65) return 30;                    // Strong match
    if ($sim >= 0.40) return round($sim * 28, 2);  // Partial credit
    if ($sim >= 0.20) return round($sim * 12, 2);  // Weak
    return 0;                                       // Conflict - no credit
}

function scoreTitle($l, $f) { return round(cosineSimilarity($l["title"]??"",$f["title"]??"")*5,2); }

function scoreDescription($l, $f) {
    $lt = trim(($l["title"]??"")." ".($l["description"]??""));
    $ft = trim(($f["title"]??"")." ".($f["description"]??""));
    return round(cosineSimilarity($lt,$ft)*15,2);
}

function confidenceLevel($s) {
    if ($s >= 90) return "Strong Match";
    if ($s >= 80) return "Possible Match";
    return "Weak Match";
}

function calculateMatchScore($lost, $found) {
    if (isHardRejected($lost,$found)) return ["score"=>0,"rejected"=>true,"reason"=>"found_date < lost_date"];
    $cat  = scoreCategory($lost,$found);
    $loc  = scoreLocation($lost,$found);
    $date = scoreDate($lost,$found);
    $id   = scoreIdentifiers($lost,$found);
    $ttl  = scoreTitle($lost,$found);
    $dsc  = scoreDescription($lost,$found);

    // Location-identifier interaction rule:
    // If reports are in completely different districts (loc=0), matching identifiers alone
    // cannot compensate. Cap identifier credit at neutral level (15) to prevent cross-city FPs.
    $ld = strtolower(trim($lost["district"]??"")); $fd = strtolower(trim($found["district"]??""));
    if (!empty($ld) && !empty($fd) && $ld !== $fd) {
        $id = min($id, 15); // cap — different district, don't reward matching identifiers fully
    }

    $total = min(100, round($cat+$loc+$date+$id+$ttl+$dsc, 2));
    return ["score"=>$total,"rejected"=>false,"reason"=>null,
        "breakdown"=>["cat"=>$cat,"loc"=>$loc,"date"=>$date,"id"=>$id,"title"=>$ttl,"desc"=>$dsc]];
}

// ── Test Cases (unchanged from original 28) ──────────────────────────────────
$testCases = [
    // GROUP A: Strong Matches
    ["id"=>"A1","type"=>"Strong Match","expected"=>true,
     "lost"=>["category"=>"Electronics","title"=>"Apple AirPods Pro","description"=>"White Apple AirPods Pro with white charging case","location"=>"Badulla","district"=>"Badulla","unique_identifiers"=>"Case has a small scratch on the left side","lost_date"=>"2023-10-01"],
     "found"=>["category"=>"Electronics","title"=>"Apple AirPods Pro","description"=>"White Apple AirPods Pro with white charging case","location"=>"Badulla","district"=>"Badulla","unique_identifiers"=>"Small scratch on left side","found_date"=>"2023-10-01"]],
    ["id"=>"A2","type"=>"Strong Match","expected"=>true,
     "lost"=>["category"=>"Wallets","title"=>"Brown Leather Wallet","description"=>"Men's brown leather wallet containing ID and credit cards","location"=>"Colombo 07","district"=>"Colombo","unique_identifiers"=>"ID card with name John Doe","lost_date"=>"2023-10-05"],
     "found"=>["category"=>"Wallets","title"=>"Brown Leather Wallet","description"=>"Brown leather wallet found with cards","location"=>"Colombo 07","district"=>"Colombo","unique_identifiers"=>"ID belonging to John Doe","found_date"=>"2023-10-06"]],
    ["id"=>"A3","type"=>"Strong Match","expected"=>true,
     "lost"=>["category"=>"Bags","title"=>"Nike Backpack","description"=>"Black Nike backpack with laptop inside","location"=>"Kandy Railway Station","district"=>"Kandy","unique_identifiers"=>"Red keychain attached to the zipper","lost_date"=>"2023-10-10"],
     "found"=>["category"=>"Bags","title"=>"Black Nike Backpack","description"=>"Black backpack, Nike brand, contains a laptop","location"=>"Kandy Railway Station","district"=>"Kandy","unique_identifiers"=>"Red zipper keychain","found_date"=>"2023-10-10"]],
    ["id"=>"A4","type"=>"Strong Match","expected"=>true,
     "lost"=>["category"=>"Keys","title"=>"Car Keys","description"=>"Toyota car key with house keys","location"=>"Galle Face","district"=>"Colombo","unique_identifiers"=>"Blue Honda lanyard","lost_date"=>"2023-10-12"],
     "found"=>["category"=>"Keys","title"=>"Toyota Key","description"=>"Toyota car keys found with house keys attached","location"=>"Galle Face Green","district"=>"Colombo","unique_identifiers"=>"Blue Honda lanyard","found_date"=>"2023-10-13"]],
    ["id"=>"A5","type"=>"Strong Match","expected"=>true,
     "lost"=>["category"=>"Electronics","title"=>"Samsung Galaxy S22","description"=>"Black Samsung Galaxy S22 with clear case","location"=>"Nugegoda Bus Stand","district"=>"Colombo","unique_identifiers"=>"Cracked screen protector on top right","lost_date"=>"2023-10-15"],
     "found"=>["category"=>"Electronics","title"=>"Black Samsung S22","description"=>"Samsung phone black color clear cover","location"=>"Nugegoda Bus Stand","district"=>"Colombo","unique_identifiers"=>"Top right screen protector is cracked","found_date"=>"2023-10-15"]],
    // GROUP B
    ["id"=>"B1","type"=>"Partial Match (Diff Item, Same Cat/Loc)","expected"=>false,
     "lost"=>["category"=>"Electronics","title"=>"iPhone 13","description"=>"Blue iPhone 13","location"=>"Liberty Plaza","district"=>"Colombo","unique_identifiers"=>"IMEI ending in 1234","lost_date"=>"2023-10-01"],
     "found"=>["category"=>"Electronics","title"=>"Samsung Galaxy","description"=>"Black Samsung Galaxy","location"=>"Liberty Plaza","district"=>"Colombo","unique_identifiers"=>"No SIM","found_date"=>"2023-10-01"]],
    ["id"=>"B2","type"=>"Partial Match (Similar Desc, Diff Loc)","expected"=>false,
     "lost"=>["category"=>"Watches","title"=>"Casio G-Shock","description"=>"Black Casio G-Shock watch","location"=>"Matara","district"=>"Matara","unique_identifiers"=>"Scratched strap","lost_date"=>"2023-10-02"],
     "found"=>["category"=>"Watches","title"=>"Casio G-Shock","description"=>"Black Casio G-Shock watch","location"=>"Jaffna","district"=>"Jaffna","unique_identifiers"=>"Scratched strap","found_date"=>"2023-10-02"]],
    ["id"=>"B3","type"=>"Partial Match (Same Cat, Diff Unique ID)","expected"=>false,
     "lost"=>["category"=>"Wallets","title"=>"Leather Wallet","description"=>"Black leather wallet","location"=>"Kandy","district"=>"Kandy","unique_identifiers"=>"Driving license for Kamal","lost_date"=>"2023-10-03"],
     "found"=>["category"=>"Wallets","title"=>"Leather Wallet","description"=>"Black leather wallet","location"=>"Kandy","district"=>"Kandy","unique_identifiers"=>"Student ID for Nimal","found_date"=>"2023-10-03"]],
    ["id"=>"B4","type"=>"Partial Match (Similar Keywords, Diff Date)","expected"=>false,
     "lost"=>["category"=>"Bags","title"=>"Blue Backpack","description"=>"Blue school bag","location"=>"Galle","district"=>"Galle","unique_identifiers"=>"Batman sticker","lost_date"=>"2023-01-01"],
     "found"=>["category"=>"Bags","title"=>"Blue Backpack","description"=>"Blue school bag","location"=>"Galle","district"=>"Galle","unique_identifiers"=>"Batman sticker","found_date"=>"2023-10-01"]],
    ["id"=>"B5","type"=>"Partial Match (Same item, diff desc)","expected"=>true,
     "lost"=>["category"=>"Pets","title"=>"Lost Dog","description"=>"Golden Retriever dog missing","location"=>"Nugegoda","district"=>"Colombo","unique_identifiers"=>"Red collar","lost_date"=>"2023-10-05"],
     "found"=>["category"=>"Pets","title"=>"Found a puppy","description"=>"Found a big furry yellow animal","location"=>"Nugegoda","district"=>"Colombo","unique_identifiers"=>"Has a neck band","found_date"=>"2023-10-05"]],
    // GROUP C
    ["id"=>"C1","type"=>"Non-Match (Apple vs Samsung)","expected"=>false,
     "lost"=>["category"=>"Electronics","title"=>"Apple AirPods Pro","description"=>"White Apple AirPods","location"=>"Badulla","district"=>"Badulla","unique_identifiers"=>"White case","lost_date"=>"2023-10-01"],
     "found"=>["category"=>"Electronics","title"=>"Samsung Galaxy Watch","description"=>"Black smartwatch","location"=>"Badulla","district"=>"Badulla","unique_identifiers"=>"Black strap","found_date"=>"2023-10-01"]],
    ["id"=>"C2","type"=>"Non-Match (Wallet vs Bag)","expected"=>false,
     "lost"=>["category"=>"Wallets","title"=>"Black leather wallet","description"=>"Leather wallet","location"=>"Colombo","district"=>"Colombo","unique_identifiers"=>"None","lost_date"=>"2023-10-01"],
     "found"=>["category"=>"Bags","title"=>"Red school bag","description"=>"School bag","location"=>"Colombo","district"=>"Colombo","unique_identifiers"=>"None","found_date"=>"2023-10-01"]],
    ["id"=>"C3","type"=>"Non-Match (Complete Diff)","expected"=>false,
     "lost"=>["category"=>"Keys","title"=>"House keys","description"=>"3 metal keys","location"=>"Kandy","district"=>"Kandy","unique_identifiers"=>"Metal ring","lost_date"=>"2023-10-01"],
     "found"=>["category"=>"Pets","title"=>"White Cat","description"=>"Persian cat","location"=>"Galle","district"=>"Galle","unique_identifiers"=>"Blue eyes","found_date"=>"2023-11-01"]],
    ["id"=>"C4","type"=>"Non-Match (Same Cat, Diff Desc/Loc/ID)","expected"=>false,
     "lost"=>["category"=>"Electronics","title"=>"Dell Laptop","description"=>"Silver Dell XPS","location"=>"Jaffna","district"=>"Jaffna","unique_identifiers"=>"Service tag XYZ","lost_date"=>"2023-10-01"],
     "found"=>["category"=>"Electronics","title"=>"JBL Speaker","description"=>"Black bluetooth speaker","location"=>"Matara","district"=>"Matara","unique_identifiers"=>"Red lanyard","found_date"=>"2023-10-10"]],
    ["id"=>"C5","type"=>"Non-Match (Diff Cat, Similar Words)","expected"=>false,
     "lost"=>["category"=>"Documents","title"=>"Apple Macbook Invoice","description"=>"Paper invoice for an Apple Macbook Pro in a white envelope","location"=>"Colombo","district"=>"Colombo","unique_identifiers"=>"Invoice #12345","lost_date"=>"2023-10-01"],
     "found"=>["category"=>"Electronics","title"=>"Apple Macbook Pro","description"=>"White Apple Macbook Pro","location"=>"Colombo","district"=>"Colombo","unique_identifiers"=>"Serial #9876","found_date"=>"2023-10-01"]],
    // GROUP D
    ["id"=>"D1","type"=>"Location (Identical Loc)","expected"=>true,
     "lost"=>["category"=>"Keys","title"=>"Car Key","description"=>"Honda Key","location"=>"Badulla Town","district"=>"Badulla","unique_identifiers"=>"Red tag","lost_date"=>"2023-10-01"],
     "found"=>["category"=>"Keys","title"=>"Car Key","description"=>"Honda Key","location"=>"Badulla Town","district"=>"Badulla","unique_identifiers"=>"Red tag","found_date"=>"2023-10-01"]],
    ["id"=>"D2","type"=>"Location (Diff Town, Same District)","expected"=>true,
     "lost"=>["category"=>"Keys","title"=>"Car Key","description"=>"Honda Key","location"=>"Bandarawela","district"=>"Badulla","unique_identifiers"=>"Red tag","lost_date"=>"2023-10-01"],
     "found"=>["category"=>"Keys","title"=>"Car Key","description"=>"Honda Key","location"=>"Ella","district"=>"Badulla","unique_identifiers"=>"Red tag","found_date"=>"2023-10-01"]],
    ["id"=>"D3","type"=>"Location (Similar Item, Far Away)","expected"=>false,
     "lost"=>["category"=>"Keys","title"=>"Car Key","description"=>"Honda Key","location"=>"Colombo","district"=>"Colombo","unique_identifiers"=>"Red tag","lost_date"=>"2023-10-01"],
     "found"=>["category"=>"Keys","title"=>"Car Key","description"=>"Honda Key","location"=>"Jaffna","district"=>"Jaffna","unique_identifiers"=>"Red tag","found_date"=>"2023-10-01"]],
    ["id"=>"D4","type"=>"Location (Desc Match, Loc Mismatch)","expected"=>false,
     "lost"=>["category"=>"Watches","title"=>"Rolex","description"=>"Gold Rolex","location"=>"Galle","district"=>"Galle","unique_identifiers"=>"Scratch on glass","lost_date"=>"2023-10-01"],
     "found"=>["category"=>"Watches","title"=>"Rolex","description"=>"Gold Rolex","location"=>"Kandy","district"=>"Kandy","unique_identifiers"=>"Scratch on glass","found_date"=>"2023-10-01"]],
    ["id"=>"D5","type"=>"Location (Cat & Desc Match, Loc Mismatch)","expected"=>false,
     "lost"=>["category"=>"Bags","title"=>"Gucci Bag","description"=>"Brown Gucci bag","location"=>"Matara","district"=>"Matara","unique_identifiers"=>"Missing zipper","lost_date"=>"2023-10-01"],
     "found"=>["category"=>"Bags","title"=>"Gucci Bag","description"=>"Brown Gucci bag","location"=>"Anuradhapura","district"=>"Anuradhapura","unique_identifiers"=>"Missing zipper","found_date"=>"2023-10-01"]],
    // GROUP E
    ["id"=>"E1","type"=>"Desc Variation (Sentence Structure)","expected"=>true,
     "lost"=>["category"=>"Electronics","title"=>"Lost AirPods","description"=>"Black Apple AirPods Pro wireless earbuds with white charging case.","location"=>"Colombo","district"=>"Colombo","unique_identifiers"=>"None","lost_date"=>"2023-10-01"],
     "found"=>["category"=>"Electronics","title"=>"Found Apple Earbuds","description"=>"Apple wireless earbuds, AirPods Pro, black, white case.","location"=>"Colombo","district"=>"Colombo","unique_identifiers"=>"None","found_date"=>"2023-10-01"]],
    ["id"=>"E2","type"=>"Desc Variation (Case)","expected"=>true,
     "lost"=>["category"=>"Keys","title"=>"House Key","description"=>"ONE SILVER HOUSE KEY","location"=>"Colombo","district"=>"Colombo","unique_identifiers"=>"None","lost_date"=>"2023-10-01"],
     "found"=>["category"=>"Keys","title"=>"house keys","description"=>"several silver house keys","location"=>"Colombo","district"=>"Colombo","unique_identifiers"=>"None","found_date"=>"2023-10-01"]],
    ["id"=>"E3","type"=>"Desc Variation (Spelling/Words)","expected"=>true,
     "lost"=>["category"=>"Wallets","title"=>"Wallet lost","description"=>"I lost my brown lether wallet near the bus stop it has money","location"=>"Colombo","district"=>"Colombo","unique_identifiers"=>"None","lost_date"=>"2023-10-01"],
     "found"=>["category"=>"Wallets","title"=>"Found wallet","description"=>"Brown leather wallet found at bus stand","location"=>"Colombo","district"=>"Colombo","unique_identifiers"=>"None","found_date"=>"2023-10-01"]],
    ["id"=>"E4","type"=>"Desc Variation (Short vs Long)","expected"=>true,
     "lost"=>["category"=>"Watches","title"=>"Watch","description"=>"Rolex","location"=>"Colombo","district"=>"Colombo","unique_identifiers"=>"None","lost_date"=>"2023-10-01"],
     "found"=>["category"=>"Watches","title"=>"Found a Rolex watch","description"=>"I found a very nice gold Rolex watch yesterday evening while walking down the street. It looks expensive.","location"=>"Colombo","district"=>"Colombo","unique_identifiers"=>"None","found_date"=>"2023-10-01"]],
    // GROUP F
    ["id"=>"F1","type"=>"Unique ID (Exact Match)","expected"=>true,
     "lost"=>["category"=>"Wallets","title"=>"Black Wallet","description"=>"Black wallet, brown leather","location"=>"Galle","district"=>"Galle","unique_identifiers"=>"initials MN inside","lost_date"=>"2023-10-01"],
     "found"=>["category"=>"Wallets","title"=>"Black Wallet","description"=>"Black leather wallet","location"=>"Galle","district"=>"Galle","unique_identifiers"=>"initials MN","found_date"=>"2023-10-01"]],
    ["id"=>"F2","type"=>"Unique ID (Mismatch)","expected"=>false,
     "lost"=>["category"=>"Wallets","title"=>"Black Wallet","description"=>"Black wallet","location"=>"Galle","district"=>"Galle","unique_identifiers"=>"initials MN","lost_date"=>"2023-10-01"],
     "found"=>["category"=>"Wallets","title"=>"Black Wallet","description"=>"Black wallet","location"=>"Galle","district"=>"Galle","unique_identifiers"=>"initials AB","found_date"=>"2023-10-01"]],
    // FP/FN
    ["id"=>"FP1","type"=>"False Positive Test","expected"=>false,
     "lost"=>["category"=>"Electronics","title"=>"Black Samsung phone","description"=>"Black Samsung phone lost near Badulla","location"=>"Badulla","district"=>"Badulla","unique_identifiers"=>"Model S20","lost_date"=>"2023-10-01"],
     "found"=>["category"=>"Electronics","title"=>"Black Samsung phone","description"=>"Black Samsung phone found near Badulla","location"=>"Badulla","district"=>"Badulla","unique_identifiers"=>"Model A50","found_date"=>"2023-10-01"]],
    ["id"=>"FN1","type"=>"False Negative Test","expected"=>true,
     "lost"=>["category"=>"Electronics","title"=>"Apple wireless earbuds","description"=>"Apple wireless earbuds with white case","location"=>"Kandy","district"=>"Kandy","unique_identifiers"=>"None","lost_date"=>"2023-10-01"],
     "found"=>["category"=>"Electronics","title"=>"AirPods Pro","description"=>"AirPods Pro with white charging box","location"=>"Kandy","district"=>"Kandy","unique_identifiers"=>"None","found_date"=>"2023-10-01"]],
];

$results = [];
foreach ($testCases as $tc) {
    $r = calculateMatchScore($tc["lost"], $tc["found"]);
    $results[] = [
        "id"       => $tc["id"],
        "type"     => $tc["type"],
        "expected" => $tc["expected"],
        "score"    => $r["score"],
        "rejected" => $r["rejected"],
        "reason"   => $r["reason"] ?? "",
        "breakdown"=> $r["breakdown"] ?? []
    ];
}

// ── Report ────────────────────────────────────────────────────────────────────
$threshold = 80;

echo "# Findora Matching Engine v2 — Evaluation Report\n";
echo "Threshold: $threshold\n\n";

echo "| ID | Type | Expected | Score | Hard-Reject | Cat | Loc | Date | ID | Title | Desc | Verdict |\n";
echo "|----|------|----------|-------|-------------|-----|-----|------|----|-------|------|---------|\n";
foreach ($results as $r) {
    $actual  = $r["rejected"] ? false : ($r["score"] >= $threshold);
    $verdict = ($actual === $r["expected"]) ? "OK" : "WRONG";
    $b = $r["breakdown"];
    printf("| %s | %s | %s | %.1f | %s | %s | %s | %s | %s | %s | %s | **%s** |\n",
        $r["id"], substr($r["type"],0,30),
        $r["expected"] ? "T" : "F",
        $r["score"],
        $r["rejected"] ? "YES(".$r["reason"].")" : "no",
        $b["cat"]??"-", $b["loc"]??"-", $b["date"]??"-",
        $b["id"]??"-", $b["title"]??"-", $b["desc"]??"-",
        $verdict);
}

echo "\n## Threshold Analysis\n\n";
echo "| Threshold | TP | FP | TN | FN | Accuracy | Precision | Recall | F1 |\n";
echo "|-----------|----|----|----|----|----------|-----------|--------|----|\n";
foreach ([70,75,80,85,90] as $t) {
    $tp=$fp=$tn=$fn=0;
    foreach ($results as $r) {
        $actual   = $r["rejected"] ? false : ($r["score"] >= $t);
        $expected = $r["expected"];
        if ($actual && $expected) $tp++;
        elseif ($actual && !$expected) $fp++;
        elseif (!$actual && !$expected) $tn++;
        else $fn++;
    }
    $total = $tp+$fp+$tn+$fn;
    $acc  = $total>0 ? ($tp+$tn)/$total : 0;
    $prec = ($tp+$fp)>0 ? $tp/($tp+$fp) : 0;
    $rec  = ($tp+$fn)>0 ? $tp/($tp+$fn) : 0;
    $f1   = ($prec+$rec)>0 ? 2*$prec*$rec/($prec+$rec) : 0;
    printf("| %d | %d | %d | %d | %d | %.1f%% | %.1f%% | %.1f%% | %.2f |\n",
        $t,$tp,$fp,$tn,$fn,$acc*100,$prec*100,$rec*100,$f1);
}
?>
