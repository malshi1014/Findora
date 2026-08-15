/**
 * Maps each Sri Lankan district to its list of towns.
 * Used to filter the nearest town dropdown based on the selected district.
 */
export const DISTRICT_TOWNS = {
  Colombo: [
    "Angoda", "Athurugiriya", "Avissawella", "Battaramulla", "Boralesgamuwa",
    "Colombo", "Dehiwala", "Hanwella", "Homagama", "Kaduwela", "Kahathuduwa",
    "Kesbewa", "Kohuwala", "Kolonnawa", "Kosgama", "Kottawa", "Kotte",
    "Maharagama", "Malabe", "Meegoda", "Moratuwa", "Mount Lavinia", "Nawala",
    "Nugegoda", "Padukka", "Pannipitiya", "Piliyandala", "Rajagiriya", "Ranala",
    "Ratmalana", "Talawatugoda", "Wellampitiya"
  ],
  Gampaha: [
    "Attanagalla", "Biyagama", "Delgoda", "Divulapitiya", "Dompe", "Ekala",
    "Gampaha", "Ganemulla", "Ja-Ela", "Kadawatha", "Kandana", "Katunayake",
    "Kelaniya", "Kiribathgoda", "Kirindiwela", "Kotadeniyawa", "Minuwangoda",
    "Mirigama", "Negombo", "Nittambuwa", "Peliyagoda", "Ragama", "Seeduwa",
    "Veyangoda", "Wattala", "Walasmulla"
  ],
  Kalutara: [
    "Agalawatta", "Aluthgama", "Bandaragama", "Beruwala", "Bulathsinhala",
    "Dodangoda", "Horana", "Ingiriya", "Kalutara", "Mathugama", "Panadura",
    "Payagala", "Wadduwa", "Walallawita"
  ],
  Kandy: [
    "Akurana", "Alawatugoda", "Ambatenna", "Digana", "Galagedara", "Gampola",
    "Gelioya", "Hasalaka", "Kadugannawa", "Kandy", "Katugastota", "Kundasale",
    "Madawala", "Menikhinna", "Nawalapitiya", "Peradeniya", "Pilimathalawa",
    "Pussellawa", "Teldeniya", "Ulapane", "Wattegama"
  ],
  Matale: [
    "Dambulla", "Galewela", "Laggala", "Matale", "Nalanda", "Naula",
    "Palapathwela", "Rattota", "Sigiriya", "Ukuwela", "Yatawatta"
  ],
  "Nuwara Eliya": [
    "Agarapatana", "Ambewela", "Bogawantalawa", "Ginigathena", "Hakgala",
    "Hatton", "Kotagala", "Kotmale", "Maskeliya", "Nanu Oya", "Nuwara Eliya",
    "Pundaluoya", "Ragala", "Ramboda", "Talawakele", "Walapane"
  ],
  Galle: [
    "Ahangama", "Ahungalla", "Ambalangoda", "Baddegama", "Bentota", "Elpitiya",
    "Galle", "Hikkaduwa", "Imaduwa", "Karapitiya", "Karandeniya", "Koggala",
    "Kosgoda", "Nagoda", "Niaagama", "Pitigala", "Rathgama", "Talgaswela",
    "Udugama", "Wanduramba", "Yakkalamulla"
  ],
  Matara: [
    "Akuressa", "Deniyaya", "Dikwella", "Gandara", "Hakmana", "Kamburupitiya",
    "Kekanadurra", "Kirimatiyana", "Kotapola", "Matara", "Mirissa", "Morawaka",
    "Mulatiyana", "Pasgoda", "Thihagoda", "Weligama", "Welleratota"
  ],
  Hambantota: [
    "Ambalantota", "Angunakolapelessa", "Beliatta", "Hambantota", "Kataragama",
    "Katuwana", "Lunugamvehera", "Middeniya", "Ranna", "Tangalle",
    "Tissamaharama", "Walasmulla", "Weeraketiya"
  ],
  Jaffna: [
    "Chavakachcheri", "Chunnakam", "Delft", "Jaffna", "Karainagar",
    "Karaveddy", "Kayts", "Kopay", "Manipay", "Maruthankerney", "Nallur",
    "Point Pedro", "Tellippalai", "Vaddukoddai", "Valvettithurai", "Velanai"
  ],
  Kilinochchi: [
    "Akkarayankulam", "Iranamadu", "Kandarawalai", "Kilinochchi", "Pallai",
    "Pooneryn", "Tharmapuram"
  ],
  Mannar: [
    "Adampan", "Madhu", "Manthai", "Mannar", "Murunkan", "Nanaddan",
    "Pesalai", "Talaimannar"
  ],
  Vavuniya: [
    "Cheddikulam", "Kanagarayankulam", "Nedunkeni", "Omanthai", "Vavuniya"
  ],
  Mullaitivu: [
    "Mullaitivu", "Mulliyawalai", "Oddusuddan", "Puthukkudiyiruppu",
    "Thunukkai", "Visvamadu"
  ],
  Batticaloa: [
    "Araipattai", "Batticaloa", "Chenkalady", "Eravur", "Kaluwanchikudy",
    "Kattankudy", "Kiran", "Kokkadichcholai", "Oddamavadi", "Pasikuda",
    "Valaichchenai"
  ],
  Ampara: [
    "Akkaraipattu", "Ampara", "Central Camp", "Damana", "Dehiattakandiya",
    "Kalmunai", "Karaitivu", "Lahugala", "Maha Oya", "Nintavur", "Pottuvil",
    "Samanthurai", "Uhana"
  ],
  Trincomalee: [
    "Gomarankadawala", "Kantalai", "Kinniya", "Kuchchaveli", "Mutur",
    "Nilaveli", "Siripura", "Thampalakamam", "Trincomalee"
  ],
  Kurunegala: [
    "Alawwa", "Bingiriya", "Dandagamuwa", "Galamuwa", "Giriulla", "Hettipola",
    "Ibbagamuwa", "Katupotha", "Kuliyapitiya", "Kurunegala", "Mawathagama",
    "Narammala", "Nikaweratiya", "Pannala", "Polgahawela", "Wariyapola"
  ],
  Puttalam: [
    "Anamaduwa", "Chilaw", "Dankotuwa", "Eluvaitivu", "Kalpitiya",
    "Karuwalagaswewa", "Mahawewa", "Marawila", "Mundel", "Nattandiya",
    "Nawagattegama", "Puttalam", "Vankalai", "Wennappuwa"
  ],
  Anuradhapura: [
    "Anuradhapura", "Bulnewa", "Eppawala", "Galenbindunuwewa", "Galnewa",
    "Habarana", "Horowpothana", "Ipalogama", "Kahatagasdigiliya",
    "Kebithigollawa", "Kekirawa", "Medawachchiya", "Mihintale",
    "Nochchiyagama", "Padaviya", "Rambewa", "Talawa", "Thambuttegama",
    "Tirappane"
  ],
  Polonnaruwa: [
    "Dimbulagala", "Elahera", "Hingurakgoda", "Jayanthipura", "Lankapura",
    "Medirigiriya", "Minneriya", "Palugaswewa", "Polonnaruwa",
    "Thamankaduwa", "Welikanda"
  ],
  Badulla: [
    "Badulla", "Bandarawela", "Beragala", "Diyatalawa", "Ella", "Haldummulla",
    "Hali-Ela", "Haputale", "Kandaketiya", "Lunugala", "Mahiyanganaya",
    "Meegahakiula", "Passara", "Riddhimaliyadda", "Uva Paranagama", "Welimada"
  ],
  Monaragala: [
    "Bibile", "Buttala", "Kataragama", "Madulla", "Medagama", "Monaragala",
    "Okchampitiya", "Siyambalanduwa", "Tanamalwila", "Wellawaya"
  ],
  Ratnapura: [
    "Ayagama", "Balangoda", "Eheliyagoda", "Embilipitiya", "Godakawela",
    "Kahawatta", "Kalawana", "Kuruwita", "Nivitigala", "Opanayaka",
    "Pelmadulla", "Rakwana", "Ratnapura", "Weligepola"
  ],
  Kegalle: [
    "Aranayaka", "Bulathkohupitiya", "Dehiowita", "Deraniyagala",
    "Galigamuwa", "Hemmathagama", "Karawanella", "Kegalle", "Kitulgala",
    "Mawanella", "Rambukkana", "Ruwanwella", "Yatiyantota"
  ]
};
