// Predefined anatomical content used by the "Quick-fill" button in the
// Add Specimen form. This lets the presenter demonstrate how a specimen can
// be added quickly without typing everything by hand.

export interface OrganContent {
  organ: string
  name: string
  systemCategory: string
  preservationMethod: string
  description: string
  functions: string
  clinicalRelevance: string
  imageUrl?: string
  additionalNotes?: string
}

export const organContent: OrganContent[] = [
  {
    organ: 'Heart',
    name: 'Human Heart',
    systemCategory: 'Cardiovascular System',
    preservationMethod: '10% Formalin',
    description:
      'A preserved adult human heart opened longitudinally to display all four chambers. The right atrium and ventricle are seen with the tricuspid valve, while the left ventricle shows its characteristically thick myocardium. Coronary vessels are visible on the epicardial surface. A classic teaching specimen of internal cardiac anatomy.',
    functions:
      '• Pumps deoxygenated blood to the lungs via the pulmonary circuit\n• Delivers oxygenated blood to the systemic circulation via the aorta\n• Cardiac valves ensure one-way flow across the chambers\n• Coronary circulation supplies the myocardium itself\n• Intrinsic pacemaker (SA node) initiates and coordinates the heartbeat',
    clinicalRelevance:
      '• Myocardial infarction results from occlusion of a coronary artery\n• Rheumatic heart disease commonly affects the mitral valve\n• Left ventricular hypertrophy is a key finding in hypertension\n• Heart failure correlates with dilated, thin-walled ventricles',
    imageUrl: '/demo-images/heart-diagram.jpg',
  },
  {
    organ: 'Lungs',
    name: 'Right and Left Lungs',
    systemCategory: 'Respiratory System',
    preservationMethod: '10% Formalin',
    description:
      'A block of both lungs with the trachea and main bronchi in continuity. The left lung shows a cardiac notch and a single oblique fissure, while the right lung displays its three lobes. The visceral pleura is smooth and glistening.',
    functions:
      '• Gas exchange occurs across the alveolar-capillary membrane\n• Right lung has three lobes; left lung has two with a cardiac notch\n• Bronchi divide progressively into bronchioles and alveoli\n• Surfactant reduces alveolar surface tension to prevent collapse',
    clinicalRelevance:
      '• Right main bronchus is wider and more vertical — common site of inhaled foreign body\n• Bronchogenic carcinoma most often arises in major bronchi\n• Emphysema shows over-inflated, hyperlucent lung tissue\n• Tuberculosis cavitation is a classic gross finding in India',
  },
  {
    organ: 'Kidney',
    name: 'Right Kidney with Ureter',
    systemCategory: 'Urinary System',
    preservationMethod: '10% Formalin',
    description:
      'A bisected right kidney showing the outer dark cortex and inner medullary pyramids. Renal columns extend between the pyramids, and papillae project into the renal pelvis. The attached ureter is seen as a thick-walled tube descending from the hilum.',
    functions:
      '• Filters blood to form urine in the nephrons\n• Reabsorbs water, electrolytes and nutrients along the tubules\n• Renin release regulates blood pressure\n• Erythropoietin production stimulates red cell formation',
    clinicalRelevance:
      '• Renal calculi (stones) commonly lodge in the ureter causing colic\n• Hydronephrosis results from ureteric obstruction\n• Chronic kidney disease shows a shrunken, granular kidney\n• Renal cell carcinoma arises in the cortex',
  },
  {
    organ: 'Brain',
    name: 'Human Brain — Mid-Sagittal Section',
    systemCategory: 'Nervous System',
    preservationMethod: '10% Formalin',
    description:
      'A mid-sagittal section of an adult brain displaying the corpus callosum, septum pellucidum, third ventricle, midbrain, pons, medulla and cerebellum. The cerebellar folia are distinct, and the cerebral cortex shows the grey-white matter pattern.',
    functions:
      '• Corpus callosum connects the two cerebral hemispheres\n• Midbrain, pons and medulla form the brainstem\n• Medulla contains respiratory and cardiac centres\n• Cerebellum coordinates movement and posture',
    clinicalRelevance:
      '• Brainstem lesions cause cranial nerve and long-tract signs\n• Cerebellar disease produces ataxia and nystagmus\n• Hydrocephalus results from CSF pathway obstruction\n• Intraventricular haemorrhage is common in premature infants',
  },
  {
    organ: 'Liver',
    name: 'Liver with Gallbladder',
    systemCategory: 'Digestive System',
    preservationMethod: '10% Formalin',
    description:
      'A whole liver with the gallbladder attached to its visceral surface. The right and left lobes are separated by the falciform ligament remnant, and the porta hepatis is visible with the hepatic artery, portal vein and bile duct.',
    functions:
      '• Produces bile for fat digestion and absorption\n• Metabolizes carbohydrates, proteins and fats\n• Synthesizes albumin, clotting factors and cholesterol\n• Detoxifies drugs, alcohol and metabolic waste',
    clinicalRelevance:
      '• Cirrhosis produces a shrunken, nodular liver with portal hypertension\n• Gallstones commonly obstruct the bile duct causing jaundice\n• Hepatocellular carcinoma often arises on a background of cirrhosis\n• Amoebic liver abscess is a common complication in India',
  },
  {
    organ: 'Stomach',
    name: 'Stomach with Duodenum',
    systemCategory: 'Digestive System',
    preservationMethod: '10% Formalin',
    description:
      'An opened stomach with the pylorus and first part of the duodenum. Rugal folds are prominent along the greater curvature, flattening toward the pyloric antrum. The pyloric sphincter is preserved at the gastroduodenal junction.',
    functions:
      '• Stores and mechanically mixes food with gastric secretions\n• Secretes hydrochloric acid and pepsin for protein digestion\n• Intrinsic factor enables vitamin B12 absorption\n• Pyloric sphincter controls gastric emptying',
    clinicalRelevance:
      '• Peptic ulcer commonly involves the pyloric antrum or duodenum\n• Gastric carcinoma often arises near the lesser curvature\n• H. pylori infection is the leading cause of gastritis and ulcers\n• Hematemesis and melena indicate upper GI bleeding',
  },
  {
    organ: 'Spleen',
    name: 'Spleen',
    systemCategory: 'Lymphatic & Immune System',
    preservationMethod: '10% Formalin',
    description:
      'A whole spleen with a smooth dark red capsule, a notched superior border and the hilum on the visceral surface. The characteristic white pulp and red pulp pattern is visible on section.',
    functions:
      '• Filters blood, removing old and damaged red cells\n• Initiates immune responses against blood-borne pathogens\n• Red pulp stores platelets and iron\n• Serves as a reservoir of blood during haemorrhage',
    clinicalRelevance:
      '• Splenomegaly occurs in malaria, typhoid and cirrhosis\n• Ruptured spleen causes life-threatening intra-abdominal bleeding\n• Hereditary spherocytosis causes splenic sequestration of red cells\n• Leukaemia and lymphoma cause massive splenic enlargement',
  },
  {
    organ: 'Thyroid',
    name: 'Thyroid Gland with Trachea',
    systemCategory: 'Endocrine System',
    preservationMethod: '10% Formalin',
    description:
      'The thyroid gland with both lobes connected by the isthmus, draped over the trachea. The gland is firm with a reddish-brown cut surface. The relation of the lobes to the trachea and larynx is clearly demonstrated.',
    functions:
      '• Produces thyroxine (T4) and triiodothyronine (T3)\n• Regulates basal metabolic rate and heat production\n• Calcitonin lowers blood calcium levels\n• Iodine uptake is required for hormone synthesis',
    clinicalRelevance:
      '• Goitre from iodine deficiency is endemic in parts of India\n• Graves disease causes thyrotoxicosis with exophthalmos\n• Hashimoto thyroiditis is the commonest cause of hypothyroidism\n• Thyroid nodules require evaluation for malignancy',
  },
  {
    organ: 'Eye',
    name: 'Eyeball (Hemisected)',
    systemCategory: 'Special Senses',
    preservationMethod: '10% Formalin',
    description:
      'A hemisected eyeball displaying the cornea, iris, lens, ciliary body, vitreous cavity and the retina at the back. The optic disc is faintly visible where the optic nerve exits.',
    functions:
      '• Cornea refracts and transmits light into the eye\n• Iris regulates light entry through the pupil\n• Lens focuses light onto the retina by changing shape\n• Retina converts light into neural signals',
    clinicalRelevance:
      '• Cataract is opacification of the lens — leading cause of blindness\n• Glaucoma results from raised intraocular pressure\n• Diabetic retinopathy affects retinal vessels and vision\n• Retinal detachment causes a sudden loss of vision',
  },
  {
    organ: 'Femur',
    name: 'Proximal Femur',
    systemCategory: 'Musculoskeletal System',
    preservationMethod: 'Dry Preservation',
    description:
      'A dry bone specimen of the proximal right femur showing the head, neck, greater and lesser trochanters, and the intertrochanteric crest. The angle of inclination between neck and shaft is clearly visible.',
    functions:
      '• Transmits body weight from the pelvis to the shaft\n• Head articulates with the acetabulum at the hip joint\n• Trochanters provide attachment for gluteal muscles\n• Neck connects head to shaft at approximately 125 degrees',
    clinicalRelevance:
      '• Femoral neck fracture is common in elderly with osteoporosis\n• Intracapsular fracture risks avascular necrosis of the head\n• Hip fracture is a major cause of morbidity after falls\n• Trochanteric fractures heal better due to good blood supply',
  },
]

export function findOrganContent(organName: string): OrganContent | null {
  const query = organName.trim().toLowerCase()
  if (!query) return null
  return (
    organContent.find((c) => c.organ.toLowerCase() === query) ??
    organContent.find((c) => c.organ.toLowerCase().startsWith(query)) ??
    organContent.find((c) => query.includes(c.organ.toLowerCase())) ??
    null
  )
}
