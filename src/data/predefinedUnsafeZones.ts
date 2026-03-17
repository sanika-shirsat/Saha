export interface UnsafeZone {
  lat: number;
  lng: number;
  radius: number;
  name: string;
}

export const predefinedUnsafeZones: UnsafeZone[] = [
  // Navi Mumbai Zones (existing)
  { lat: 19.077, lng: 72.998, radius: 150, name: "Vashi Railway Station" },
  { lat: 19.075, lng: 73.004, radius: 150, name: "Inorbit Mall Vashi" },
  { lat: 19.072, lng: 73.004, radius: 150, name: "Raghuleela Mall Vashi" },
  { lat: 19.074, lng: 73.002, radius: 150, name: "Vashi Seaface / Mini Seashore" },
  { lat: 19.074, lng: 73.002, radius: 150, name: "Vashi Bus Depot" },
  { lat: 19.030, lng: 73.029, radius: 150, name: "CBD Belapur Railway Station" },
  { lat: 19.030, lng: 73.029, radius: 150, name: "Belapur CBD Sakal Bhavan Junction" },
  { lat: 19.033, lng: 73.025, radius: 150, name: "Nerul Railway Station" },
  { lat: 19.035, lng: 73.026, radius: 150, name: "Sanpada Railway Station" },
  { lat: 19.038, lng: 73.023, radius: 150, name: "Juinagar Railway Station" },
  { lat: 19.041, lng: 73.020, radius: 150, name: "Seawoods–Darave / Seawoods Grand Central" },
  { lat: 19.072, lng: 73.009, radius: 150, name: "Palm Beach Road Vashi Flyover" },
  { lat: 19.078, lng: 72.997, radius: 150, name: "Turbhe Bus Stand" },
  { lat: 19.138, lng: 73.025, radius: 150, name: "Airoli Bridge Entry" },
  { lat: 19.039, lng: 73.125, radius: 150, name: "Kharghar Railway Station" },
  { lat: 19.041, lng: 73.123, radius: 150, name: "Kharghar Central Park" },
  { lat: 19.045, lng: 73.128, radius: 150, name: "Kharghar Hills Sector 35" },
  { lat: 19.017, lng: 73.083, radius: 150, name: "Taloja MIDC" },
  { lat: 19.018, lng: 73.087, radius: 150, name: "Taloja Road Junction" },
  { lat: 19.019, lng: 73.089, radius: 150, name: "Taloja Phase II Pendhar" },
  { lat: 18.990, lng: 73.029, radius: 150, name: "Panvel Railway Station" },
  { lat: 18.991, lng: 73.030, radius: 150, name: "Panvel Bus Depot" },
  { lat: 18.987, lng: 73.035, radius: 150, name: "Kalamboli Signal" },
  { lat: 18.986, lng: 73.034, radius: 150, name: "Kalamboli MIDC" },
  { lat: 19.090, lng: 73.010, radius: 150, name: "Koparkhairane Sector Market" },
  { lat: 19.100, lng: 73.013, radius: 150, name: "Ghansoli Railway Station" },
  { lat: 19.102, lng: 73.015, radius: 150, name: "Rabale MIDC" },
  { lat: 19.138, lng: 73.025, radius: 150, name: "Airoli MIDC" },
  { lat: 19.041, lng: 73.020, radius: 150, name: "Seawoods Station Road" },
  { lat: 19.075, lng: 73.004, radius: 150, name: "Inorbit Mall Basement" },
  { lat: 19.067, lng: 73.005, radius: 150, name: "Digha Talao Market" },
  { lat: 19.027, lng: 73.029, radius: 150, name: "Khandeshwar Railway Station" },
  { lat: 18.993, lng: 73.034, radius: 150, name: "Mamnoli Ganapati Lane" },
  { lat: 19.045, lng: 73.128, radius: 150, name: "Sion–Panvel Highway Kharghar" },
  { lat: 19.038, lng: 73.023, radius: 150, name: "Juinagar Sector 25" },
  { lat: 19.041, lng: 73.020, radius: 150, name: "Seawoods Flyover" },
  { lat: 19.077, lng: 72.998, radius: 150, name: "Vashi Railway Footbridge" },
  { lat: 19.078, lng: 72.997, radius: 150, name: "Turbhe–Vashi Industrial Area" },
  { lat: 19.031, lng: 73.029, radius: 150, name: "CIDCO Exhibition Centre" },
  { lat: 19.039, lng: 73.019, radius: 150, name: "Sagar Vihar Seawoods" },
  { lat: 19.030, lng: 73.029, radius: 150, name: "NMMC Head Office Belapur" },
  { lat: 19.041, lng: 73.123, radius: 150, name: "Palm Beach Road Kharghar" },
  { lat: 19.040, lng: 73.124, radius: 150, name: "CIDCO Park Sector 36" },
  { lat: 19.041, lng: 73.020, radius: 150, name: "Seawoods Residences" },
  { lat: 19.038, lng: 73.023, radius: 150, name: "Juinagar Auto Stand" },
  { lat: 19.078, lng: 72.997, radius: 150, name: "Turbhe Railway Station" },
  { lat: 18.989, lng: 73.030, radius: 150, name: "APMC Market" },
  { lat: 18.990, lng: 73.029, radius: 150, name: "Old Panvel Market" },
  { lat: 19.041, lng: 73.123, radius: 150, name: "CIDCO Kharghar Sector 20" },
  { lat: 19.041, lng: 73.124, radius: 150, name: "Palm Beach Road Sanpada" },
  // Mumbai Zones
  { lat: 18.940, lng: 72.835, radius: 150, name: "Chhatrapati Shivaji Maharaj Terminus (CSMT)" },
  { lat: 18.920, lng: 72.820, radius: 150, name: "Churchgate Station" },
  { lat: 18.940, lng: 72.820, radius: 150, name: "Marine Drive" },
  { lat: 18.922, lng: 72.830, radius: 150, name: "Gateway of India" },
  { lat: 18.910, lng: 72.820, radius: 150, name: "Colaba Causeway" },
  { lat: 18.952, lng: 72.825, radius: 150, name: "Girgaon Chowpatty" },
  { lat: 18.960, lng: 72.835, radius: 150, name: "Crawford Market" },
  { lat: 18.978, lng: 72.833, radius: 150, name: "Byculla Station" },
  { lat: 18.982, lng: 72.830, radius: 150, name: "Chinchpokli Station" },
  { lat: 18.976, lng: 72.825, radius: 150, name: "Mumbai Central Station" },
  { lat: 18.982, lng: 72.828, radius: 150, name: "Mahalaxmi Station" },
  { lat: 18.992, lng: 72.825, radius: 150, name: "Lower Parel Station" },
  { lat: 19.010, lng: 72.840, radius: 150, name: "Dadar Station" },
  { lat: 19.000, lng: 72.850, radius: 150, name: "Dharavi 60 Feet Road" },
  { lat: 19.020, lng: 72.830, radius: 150, name: "Mahim Causeway" },
  { lat: 18.5204, lng: 73.8567, radius: 200, name: "Shivajinagar Bus Stand" },
  { lat: 18.5319, lng: 73.8766, radius: 150, name: "Pune Railway Station" },
  { lat: 18.5330, lng: 73.8430, radius: 100, name: "FC Road, Crowded Evening" },
  { lat: 18.5168, lng: 73.8565, radius: 120, name: "Koregaon Park Lane 6" },
  { lat: 18.5205, lng: 73.8480, radius: 150, name: "Deccan Gymkhana Street" },
  { lat: 18.5550, lng: 73.8900, radius: 200, name: "Pimpri Industrial Area" },
  { lat: 18.5680, lng: 73.8050, radius: 150, name: "Bhosari Flyover Dark Street" },
  // -------------------- Thane --------------------
  { lat: 19.2183, lng: 72.9781, radius: 180, name: "Thane Railway Station" },
  { lat: 19.2210, lng: 72.9785, radius: 150, name: "Thane Bus Depot" },
  { lat: 19.2195, lng: 72.9770, radius: 150, name: "Viviana Mall Car Parking" },
  { lat: 19.2160, lng: 72.9775, radius: 100, name: "Upvan Lake Parking Area" },
  { lat: 19.2340, lng: 72.9750, radius: 120, name: "Thane West Market" },
  // -------------------- Nashik --------------------
  { lat: 19.9975, lng: 73.7898, radius: 150, name: "Nashik Road Railway Station" },
  { lat: 19.9972, lng: 73.7905, radius: 100, name: "Panchavati Crowded Area" },
  { lat: 19.9965, lng: 73.7910, radius: 120, name: "Trimbakeshwar Road Dark Street" },
  { lat: 19.9890, lng: 73.7800, radius: 180, name: "Mahatma Gandhi Chowk Market" },
  // -------------------- Aurangabad --------------------
  { lat: 19.8762, lng: 75.3433, radius: 150, name: "Aurangabad Railway Station" },
  { lat: 19.8765, lng: 75.3240, radius: 120, name: "Himayat Bagh Entry" },
  { lat: 19.8800, lng: 75.3260, radius: 200, name: "Bibi Ka Maqbara Outer Road" },
  { lat: 19.8830, lng: 75.3300, radius: 150, name: "Aurangabad Old City Market" },
  // -------------------- Kolhapur --------------------
  { lat: 16.7050, lng: 74.2433, radius: 150, name: "Kolhapur City Bus Stand" },
  { lat: 16.7060, lng: 74.2420, radius: 120, name: "Shahu Market Lane" },
  { lat: 16.7100, lng: 74.2450, radius: 100, name: "Ichalkaranji Road Dark Street" },
  // -------------------- Nagpur --------------------
  { lat: 21.1458, lng: 79.0882, radius: 180, name: "Nagpur Railway Station" },
  { lat: 21.1470, lng: 79.0900, radius: 120, name: "Futala Lake Road" },
  { lat: 21.1460, lng: 79.0890, radius: 150, name: "Nagpur City Police HQ vicinity" },
  { lat: 21.1400, lng: 79.0800, radius: 100, name: "Sitabuldi Market" },
  // -------------------- Solapur --------------------
  { lat: 17.6599, lng: 75.9064, radius: 150, name: "Solapur Railway Station" },
  { lat: 17.6620, lng: 75.9050, radius: 120, name: "Solapur City Market" },
  // -------------------- Amravati --------------------
  { lat: 20.9333, lng: 77.7500, radius: 150, name: "Amravati Railway Station" },
  { lat: 20.9360, lng: 77.7520, radius: 120, name: "Balaji Temple Street" },
  // -------------------- Akola --------------------
  { lat: 20.7019, lng: 77.0043, radius: 150, name: "Akola Railway Station" },
  { lat: 20.7030, lng: 77.0050, radius: 100, name: "Akola Main Market" },
  // -------------------- Jalgaon --------------------
  { lat: 21.0076, lng: 75.5628, radius: 150, name: "Jalgaon Railway Station" },
  { lat: 21.0085, lng: 75.5610, radius: 120, name: "Jalgaon City Market" },
  // -------------------- Raigad District --------------------
  { lat: 18.9900, lng: 73.2000, radius: 200, name: "Alibaug Jetty / Crowded Ferry Area" },
  { lat: 18.9330, lng: 73.1800, radius: 150, name: "Revdanda Beach Entrance" },
  // -------------------- Latur --------------------
  { lat: 18.4080, lng: 76.5690, radius: 120, name: "Latur Railway Station" },
  { lat: 18.4070, lng: 76.5700, radius: 100, name: "Latur City Market" },
  // -------------------- Satara --------------------
  { lat: 17.6800, lng: 73.9900, radius: 120, name: "Satara Railway Station" },
  { lat: 17.6820, lng: 73.9880, radius: 100, name: "Satara Main Market" },
  { lat: 19.0650, lng: 72.8850, radius: 120, name: "Chembur Industrial Area" },
  { lat: 19.0700, lng: 72.9000, radius: 100, name: "Govandi Railway Station Surroundings" },
  { lat: 19.0950, lng: 72.9050, radius: 150, name: "Mankhurd Bus Depot" },
  { lat: 19.0800, lng: 72.8700, radius: 120, name: "Kurla East Lanes" },
  { lat: 19.0850, lng: 72.8650, radius: 150, name: "Sion Industrial Streets" },
  { lat: 19.0300, lng: 72.8500, radius: 100, name: "Cotton Green Railway Yard" },
  { lat: 19.0200, lng: 72.8400, radius: 120, name: "Wadala East Lanes" },
  { lat: 19.0400, lng: 72.8300, radius: 150, name: "Mazgaon Inner Lanes" },
  // Pune
  { lat: 18.5250, lng: 73.8550, radius: 100, name: "Shaniwar Peth Dark Lanes" },
  { lat: 18.5350, lng: 73.8600, radius: 150, name: "Fergusson College Road Isolated Areas" },
  { lat: 18.5400, lng: 73.8650, radius: 120, name: "Swargate Bus Stop Surroundings" },
  { lat: 18.5500, lng: 73.8700, radius: 100, name: "Kasba Peth Inner Lanes" },
  { lat: 18.5650, lng: 73.8800, radius: 150, name: "Bopodi Industrial Streets" },
  { lat: 18.5200, lng: 73.8450, radius: 120, name: "Sadashiv Peth Alleyways" },
  { lat: 18.5300, lng: 73.8500, radius: 100, name: "Parvati Hills Back Lanes" },
  // Thane & Navi Mumbai
  { lat: 19.2300, lng: 72.9750, radius: 150, name: "Kalwa Railway Station Surroundings" },
  { lat: 19.2250, lng: 72.9800, radius: 120, name: "Mumbra Dark Streets" },
  { lat: 19.2150, lng: 72.9770, radius: 100, name: "Hiranandani Estate Night Lanes" },
  { lat: 19.2280, lng: 72.9800, radius: 150, name: "Kopri Market Area" },
  // Nashik
  { lat: 19.9900, lng: 73.7800, radius: 150, name: "Old Nashik Market Lanes" },
  { lat: 19.9950, lng: 73.7850, radius: 120, name: "Shivaji Chowk Inner Lanes" },
  { lat: 19.9980, lng: 73.7900, radius: 100, name: "Gangapur Road Isolated Streets" },
  // Nagpur
  { lat: 21.1400, lng: 79.0900, radius: 150, name: "Ramdaspeth Inner Lanes" },
  { lat: 21.1450, lng: 79.0850, radius: 120, name: "Sitabuldi Night Streets" },
  { lat: 21.1500, lng: 79.0920, radius: 100, name: "Futala Lake Outer Streets" },
  // Aurangabad
  { lat: 19.8800, lng: 75.3200, radius: 150, name: "CIDCO Market Lanes" },
  { lat: 19.8850, lng: 75.3280, radius: 120, name: "New Bus Stand Surroundings" },
  // Kolhapur
  { lat: 16.7055, lng: 74.2435, radius: 120, name: "Koparde Market Lanes" },
  { lat: 16.7100, lng: 74.2470, radius: 100, name: "Shivaji Circle Isolated Streets" },
  // Solapur
  { lat: 17.6610, lng: 75.9060, radius: 120, name: "Uran Islampura Streets" },
  { lat: 17.6625, lng: 75.9045, radius: 100, name: "Solapur Market Area Lanes" },
  // Amravati
  { lat: 20.9350, lng: 77.7510, radius: 100, name: "Civil Lines Inner Streets" },
  // Raigad
  { lat: 18.9850, lng: 73.2050, radius: 150, name: "Rewas Jetty Isolated Area" },
  // Latur
  { lat: 18.4050, lng: 76.5680, radius: 100, name: "Station Road Inner Lanes" },
  // Satara
  { lat: 17.6820, lng: 73.9850, radius: 120, name: "Patil Market Alleyways" },
  // Additional cities
  // Nashik outskirts
  { lat: 19.9700, lng: 73.7900, radius: 150, name: "Sinnar Industrial Zone" },
  { lat: 19.9750, lng: 73.7920, radius: 120, name: "Pandav Lanes" },
  // Pune outskirts
  { lat: 18.5550, lng: 73.8800, radius: 150, name: "Chinchwad Dark Streets" },
  { lat: 18.5700, lng: 73.8200, radius: 120, name: "Bhosari Industrial Alleys" },
  // Nagpur outskirts
  { lat: 21.1500, lng: 79.0950, radius: 150, name: "Wardhaman Nagar Streets" },
  // Kolhapur outskirts
  { lat: 16.7150, lng: 74.2500, radius: 100, name: "Ichalkaranji Lane Streets" },
  // Aurangabad outskirts
  { lat: 19.8900, lng: 75.3350, radius: 150, name: "Kailashnagar Dark Lanes" },
  // Raigad outskirts
  { lat: 18.9400, lng: 73.1850, radius: 150, name: "Murud Jetty Area" },
  // Latur outskirts
  { lat: 18.4100, lng: 76.5700, radius: 100, name: "Hingoli Road Lanes" },
  // Additional Thane/Navi Mumbai
  { lat: 19.2250, lng: 72.9750, radius: 150, name: "Wagle Estate Industrial Zone" },
  { lat: 19.2300, lng: 72.9800, radius: 120, name: "Majiwada Back Lanes" },
  // Pune more
  { lat: 18.5200, lng: 73.8500, radius: 150, name: "Camp Area Alleyways" },
  { lat: 18.5250, lng: 73.8600, radius: 120, name: "Shivajinagar Inner Lanes" }
];