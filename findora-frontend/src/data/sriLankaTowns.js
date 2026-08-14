const rawTowns = [
  // Western Province - Colombo
  "Angoda", "Athurugiriya", "Avissawella", "Battaramulla", "Boralesgamuwa", "Colombo", "Dehiwala", "Hanwella", "Homagama", "Kaduwela", "Kahathuduwa", "Kesbewa", "Kohuwala", "Kolonnawa", "Kosgama", "Kottawa", "Kotte", "Maharagama", "Malabe", "Meegoda", "Moratuwa", "Mount Lavinia", "Nawala", "Nugegoda", "Padukka", "Pannipitiya", "Piliyandala", "Rajagiriya", "Ranala", "Ratmalana", "Talawatugoda", "Wellampitiya",
  
  // Western Province - Gampaha
  "Attanagalla", "Biyagama", "Delgoda", "Divulapitiya", "Dompe", "Ekala", "Gampaha", "Ganemulla", "Ja-Ela", "Kadawatha", "Kandana", "Katunayake", "Kelaniya", "Kiribathgoda", "Kirindiwela", "Kotadeniyawa", "Minuwangoda", "Mirigama", "Negombo", "Nittambuwa", "Peliyagoda", "Ragama", "Seeduwa", "Veyangoda", "Wattala", "Walasmulla",

  // Western Province - Kalutara
  "Agalawatta", "Aluthgama", "Bandaragama", "Beruwala", "Bulathsinhala", "Dodangoda", "Horana", "Ingiriya", "Kalutara", "Mathugama", "Panadura", "Payagala", "Wadduwa", "Walallawita",

  // Central Province - Kandy
  "Akurana", "Alawatugoda", "Ambatenna", "Digana", "Galagedara", "Gampola", "Gelioya", "Hasalaka", "Kadugannawa", "Kandy", "Katugastota", "Kundasale", "Madawala", "Menikhinna", "Nawalapitiya", "Peradeniya", "Pilimathalawa", "Pussellawa", "Teldeniya", "Ulapane", "Wattegama",

  // Central Province - Matale
  "Dambulla", "Galewela", "Laggala", "Matale", "Nalanda", "Naula", "Palapathwela", "Rattota", "Sigiriya", "Ukuwela", "Yatawatta",

  // Central Province - Nuwara Eliya
  "Agarapatana", "Ambewela", "Bogawantalawa", "Ginigathena", "Hakgala", "Hatton", "Kotagala", "Kotmale", "Maskeliya", "Nanu Oya", "Nuwara Eliya", "Pundaluoya", "Ragala", "Ramboda", "Talawakele", "Walapane",

  // Southern Province - Galle
  "Ahangama", "Ahungalla", "Ambalangoda", "Baddegama", "Bentota", "Elpitiya", "Galle", "Hikkaduwa", "Imaduwa", "Karapitiya", "Karandeniya", "Koggala", "Kosgoda", "Nagoda", "Niaagama", "Pitigala", "Rathgama", "Talgaswela", "Udugama", "Wanduramba", "Yakkalamulla",

  // Southern Province - Matara
  "Akuressa", "Deniyaya", "Dikwella", "Gandara", "Hakmana", "Kamburupitiya", "Kekanadurra", "Kirimatiyana", "Kotapola", "Matara", "Mirissa", "Morawaka", "Mulatiyana", "Pasgoda", "Thihagoda", "Weligama", "Welleratota",

  // Southern Province - Hambantota
  "Ambalantota", "Angunakolapelessa", "Beliatta", "Hambantota", "Kataragama", "Katuwana", "Lunugamvehera", "Middeniya", "Ranna", "Tangalle", "Tissamaharama", "Walasmulla", "Weeraketiya",

  // Northern Province - Jaffna
  "Chavakachcheri", "Chunnakam", "Delft", "Jaffna", "Karainagar", "Karaveddy", "Kayts", "Kopay", "Manipay", "Maruthankerney", "Nallur", "Point Pedro", "Tellippalai", "Vaddukoddai", "Valvettithurai", "Velanai",

  // Northern Province - Kilinochchi
  "Akkarayankulam", "Iranamadu", "Kandarawalai", "Kilinochchi", "Pallai", "Pooneryn", "Tharmapuram",

  // Northern Province - Mannar
  "Adampan", "Madhu", "Manthai", "Mannar", "Murunkan", "Nanaddan", "Pesalai", "Talaimannar",

  // Northern Province - Vavuniya
  "Cheddikulam", "Kanagarayankulam", "Nedunkeni", "Omanthai", "Vavuniya",

  // Northern Province - Mullaitivu
  "Mullaitivu", "Mulliyawalai", "Oddusuddan", "Puthukkudiyiruppu", "Thunukkai", "Visvamadu",

  // Eastern Province - Batticaloa
  "Araipattai", "Batticaloa", "Chenkalady", "Eravur", "Kaluwanchikudy", "Kattankudy", "Kiran", "Kokkadichcholai", "Oddamavadi", "Pasikuda", "Valaichchenai",

  // Eastern Province - Ampara
  "Akkaraipattu", "Ampara", "Central Camp", "Damana", "Dehiattakandiya", "Kalmunai", "Karaitivu", "Lahugala", "Maha Oya", "Nintavur", "Pottuvil", "Samanthurai", "Uhana",

  // Eastern Province - Trincomalee
  "Gomarankadawala", "Kantalai", "Kinniya", "Kuchchaveli", "Mutur", "Nilaveli", "Siripura", "Thampalakamam", "Trincomalee",

  // North Western Province - Kurunegala
  "Alawwa", "Bingiriya", "Dandagamuwa", "Galamuwa", "Giriulla", "Hettipola", "Ibbagamuwa", "Katupotha", "Kuliyapitiya", "Kurunegala", "Mawathagama", "Narammala", "Nikaweratiya", "Pannala", "Polgahawela", "Wariyapola",

  // North Western Province - Puttalam
  "Anamaduwa", "Chilaw", "Dankotuwa", "Eluvaitivu", "Kalpitiya", "Karuwalagaswewa", "Mahawewa", "Marawila", "Mundel", "Nattandiya", "Nawagattegama", "Puttalam", "Vankalai", "Wennappuwa",

  // North Central Province - Anuradhapura
  "Anuradhapura", "Bulnewa", "Eppawala", "Galenbindunuwewa", "Galnewa", "Habarana", "Horowpothana", "Ipalogama", "Kahatagasdigiliya", "Kebithigollawa", "Kekirawa", "Medawachchiya", "Mihintale", "Nochchiyagama", "Padaviya", "Rambewa", "Talawa", "Thambuttegama", "Tirappane",

  // North Central Province - Polonnaruwa
  "Dimbulagala", "Elahera", "Hingurakgoda", "Jayanthipura", "Lankapura", "Medirigiriya", "Minneriya", "Palugaswewa", "Polonnaruwa", "Thamankaduwa", "Welikanda",

  // Uva Province - Badulla
  "Badulla", "Bandarawela", "Beragala", "Diyatalawa", "Ella", "Haldummulla", "Hali-Ela", "Haputale", "Kandaketiya", "Lunugala", "Mahiyanganaya", "Meegahakiula", "Passara", "Riddhimaliyadda", "Uva Paranagama", "Welimada",

  // Uva Province - Monaragala
  "Bibile", "Buttala", "Kataragama", "Madulla", "Medagama", "Monaragala", "Okchampitiya", "Siyambalanduwa", "Tanamalwila", "Wellawaya",

  // Sabaragamuwa Province - Ratnapura
  "Ayagama", "Balangoda", "Eheliyagoda", "Embilipitiya", "Godakawela", "Kahawatta", "Kalawana", "Kuruwita", "Nivitigala", "Opanayaka", "Pelmadulla", "Rakwana", "Ratnapura", "Weligepola",

  // Sabaragamuwa Province - Kegalle
  "Aranayaka", "Bulathkohupitiya", "Dehiowita", "Deraniyagala", "Galigamuwa", "Hemmathagama", "Karawanella", "Kegalle", "Kitulgala", "Mawanella", "Rambukkana", "Ruwanwella", "Yatiyantota"
];

const sriLankaTowns = [...new Set(rawTowns)].sort((a, b) => a.localeCompare(b));

export default sriLankaTowns;
