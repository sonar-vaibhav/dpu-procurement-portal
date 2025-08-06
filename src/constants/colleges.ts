export interface College {
  college_name: string;
  campus_location: string;
  address: string;
  contact: string;
  email: string;
}

export const COLLEGES: College[] = [
  {
    "college_name": "Dr. D. Y. Patil Institute of Technology",
    "campus_location": "Pimpri",
    "address": "Sant Tukaram Nagar, Pimpri, Pune - 411018",
    "contact": "+91-20-27805298 / 27805299, Mob: +91-7767015941 / 7767015942",
    "email": "info.engg@dypvp.edu.in"
  },
  {
    "college_name": "Dr. D. Y. Patil Institute of Pharmaceutical Sciences & Research",
    "campus_location": "Pimpri",
    "address": "Sant Tukaram Nagar, Pimpri, Pune - 411018",
    "contact": "+91-20-67116417 / 27805292 / 27805293",
    "email": "info.pharmacy@dypvp.edu.in"
  },
  {
    "college_name": "Dr. D.Y. Patil Arts, Commerce & Science College",
    "campus_location": "Pimpri",
    "address": "Sant Tukaram Nagar, Pimpri, Pune - 411018",
    "contact": "+91-20-67116410, Mob: +91-8956597191 / 8956597192",
    "email": "info.acs@dypvp.edu.in"
  },
  {
    "college_name": "Dr. D.Y. Patil Arts, Commerce & Science Women's College",
    "campus_location": "Pimpri",
    "address": "Sant Tukaram Nagar, Pimpri, Pune - 411018",
    "contact": "+91-20-27805882",
    "email": "info.acsw@dypvp.edu.in"
  },
  {
    "college_name": "Dr. D. Y. Patil Institute of Management & Research",
    "campus_location": "Pimpri",
    "address": "Sant Tukaram Nagar, Pimpri, Pune - 411018",
    "contact": "Mob: +91-9326696266 / 7768820203",
    "email": "info.imr@dypvp.edu.in"
  },
  {
    "college_name": "Dr. D. Y. Patil Law College",
    "campus_location": "Pimpri",
    "address": "Behind YCM hospital, Sant Tukaram Nagar, Pimpri, Pune - 411018",
    "contact": "+91-20-27805896 / 67116423, Mob: +91-7498543933",
    "email": "info.law@dypvp.edu.in"
  },
  {
    "college_name": "Dr. D. Y. Patil College of Education",
    "campus_location": "Pimpri",
    "address": "Near Hindustan-Antibiotics, Pimpri, Pune - 411018",
    "contact": "+91-20-67116435 / 27805893, Mob: +91-75885559",
    "email": "info.coed@dypvp.edu.in"
  },
  {
    "college_name": "Dr. D. Y. Patil Institute of Nursing Education",
    "campus_location": "Pimpri",
    "address": "Sant Tukaram Nagar, Pimpri, Pune - 411018",
    "contact": "+91-20-27805889 / 90 / 67116427 / 28",
    "email": "info.nursing@dypvp.edu.in"
  },
  {
    "college_name": "Dr. D. Y. Patil Public School",
    "campus_location": "Pimpri",
    "address": "Sant Tukaram Nagar, Pimpri, Pune - 411018",
    "contact": "+91-20-27805891 / 92 / 67116426, Mob: +91-9370254560",
    "email": "info.publicschool@dypvp.edu.in"
  },
  {
    "college_name": "Dr. D. Y. Patil Arts, Commerce & Science College",
    "campus_location": "Akurdi",
    "address": "Sector No.27-A, Near Lokmanya Hospital, Nigdi Pradhikaran, Akurdi, Pune - 411044",
    "contact": "+91-20-27650313",
    "email": "info.pacs@dypvp.edu.in"
  },
  {
    "college_name": "Dr. D. Y. Patil Science & Computer Science College",
    "campus_location": "Akurdi",
    "address": "Sector No.27-A, Near Lokmanya Hospital, Nigdi Pradhikaran, Akurdi, Pune - 411044",
    "contact": "+91-20-27650313",
    "email": "info.scs@dypvp.edu.in"
  },
  {
    "college_name": "Dr. D. Y. Patil College of Education (B. Ed.)",
    "campus_location": "Akurdi",
    "address": "Sector No.27-A, Near Lokmanya Hospital, Nigdi Pradhikaran, Akurdi, Pune - 411044",
    "contact": "+91-20-27420229 / 27650313",
    "email": "info.pcoed@dypvp.edu.in"
  },
  {
    "college_name": "Dr. D. Y. Patil Institute of Hotel Management & Catering Technology",
    "campus_location": "Tathawade",
    "address": "Tathawade, Pune - 411033",
    "contact": "+91-20-67919499, Mob: +91-9511792117",
    "email": "info.hmct@dypvp.edu.in"
  },
  {
    "college_name": "Dr. D. Y. Patil Unitech Arts, Commerce and Science College",
    "campus_location": "Tathawade",
    "address": "Sr.No.138, 1/2 Jeevan Nagar, Behind Sharayu Toyota, Tathawade, Pune - 411033",
    "contact": "Mob: +91-8275465968",
    "email": "info.tacs@dypvp.edu.in"
  },
  {
    "college_name": "Unitech B-School",
    "campus_location": "Tathawade",
    "address": "Jeevan Nagar, Tathawade, Pune - 411033",
    "contact": "Mob: +91-9890084555 / 8806618555",
    "email": "info.unitech@dpu.edu.in"
  },
  {
    "college_name": "Dr. D. Y. Patil B-School",
    "campus_location": "Tathawade",
    "address": "Sr. No. 87-88, Bengaluru-Mumbai Express Bypass, Tathawade, Pune - 411033",
    "contact": "+91-20-67919470, Mob: +91-8806652555",
    "email": "info.bschool@dpu.edu.in"
  }
];

// Helper function to get college names only
export const getCollegeNames = (): string[] => {
  return COLLEGES.map(college => college.college_name);
};

// Helper function to get college by name
export const getCollegeByName = (collegeName: string): College | undefined => {
  return COLLEGES.find(college => college.college_name === collegeName);
};

// Helper function to get colleges by campus location
export const getCollegesByCampus = (campusLocation: string): College[] => {
  return COLLEGES.filter(college => college.campus_location === campusLocation);
}; 