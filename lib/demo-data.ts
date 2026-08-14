export interface DemoSpecimenSeed {
  name: string
  systemCategory: string
  specimenNumber: string
  organ: string
  sex?: string
  age?: string
  preservationMethod: string
  jarSize?: string
  collectionDate?: string
  donorInfo?: string
  description: string
  functions: string
  clinicalRelevance: string
  imageUrl?: string
  specimenPhotoUrl?: string
  additionalNotes?: string
}

// Single Heart specimen for the offline demonstration. Images were provided
// by the college (Heart1.jpg -> heart-photo.jpg, Heart2.jpg -> heart-diagram.jpg).
export const demoSpecimens: DemoSpecimenSeed[] = [
  {
    name: 'Human Heart',
    systemCategory: 'Cardiovascular System',
    specimenNumber: 'ANT-CVS-001',
    organ: 'Heart',
    sex: 'Male',
    age: '52 years',
    preservationMethod: '10% Formalin',
    jarSize: '30 × 20 × 15 cm',
    collectionDate: '2019',
    donorInfo: 'Donated body, anonymized',
    description:
      'A preserved adult human heart opened longitudinally to display all four chambers. The right atrium and ventricle are seen with the tricuspid valve, while the left ventricle shows its characteristically thick myocardium. Coronary vessels are visible on the epicardial surface with mild atheromatous changes. The specimen is a classic teaching example of internal cardiac anatomy for first-year dissection hall demonstrations.',
    functions:
      '• Pumps deoxygenated blood to the lungs via the pulmonary circuit\n• Delivers oxygenated blood to the systemic circulation via the aorta\n• Right heart receives systemic venous return; left heart ejects to the body\n• Cardiac valves ensure one-way flow across the chambers\n• Coronary circulation supplies the myocardium itself\n• Intrinsic pacemaker (SA node) initiates and coordinates the heartbeat',
    clinicalRelevance:
      '• Myocardial infarction results from occlusion of a coronary artery\n• Rheumatic heart disease commonly affects the mitral valve\n• Congenital defects such as VSD and ASD are seen on chamber inspection\n• Left ventricular hypertrophy is a key finding in hypertension\n• Pericardial effusion compresses the heart (cardiac tamponade)\n• Heart failure correlates with dilated, thin-walled ventricles',
    imageUrl: '/demo-images/heart-diagram.jpg',
    specimenPhotoUrl: '/demo-images/heart-photo.jpg',
    additionalNotes:
      'Specimen photographed before aortic root trimming. Valve leaflets preserved intact for demonstration.',
  },
]

export const demoAdmin = {
  email: 'admin@anatomy.edu.in',
  password: 'password123',
  name: 'Anatomy Dept Admin',
}

export const demoSiteSettings = {
  functionsHeading: 'Physiological Functions',
  clinicalRelevanceHeading: 'Clinical Relevance',
  specimenDetailsHeading: 'Specimen Details',
  donorInformationHeading: 'Donor Information (Anonymized)',
  additionalNotesHeading: 'Additional Notes',
  showImages: true,
  showFunctions: true,
  showClinicalRelevance: true,
  showSpecimenDetails: true,
  showDonorInformation: true,
  showAdditionalNotes: true,
  showFooter: true,
}
