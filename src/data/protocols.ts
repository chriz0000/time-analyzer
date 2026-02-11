export type Category =
  | "Sleep"
  | "Exercise"
  | "Nutrition"
  | "Stress"
  | "Supplementation"
  | "Cold/Heat Exposure";

export type Goal =
  | "lifespan"
  | "energy"
  | "sleep"
  | "body_composition"
  | "mental_clarity";

export type FitnessLevel = "beginner" | "intermediate" | "advanced";

export interface Protocol {
  id: string;
  name: string;
  category: Category;
  timeRequired: number; // minutes per day
  equipment: string;
  costPerMonth: number;
  difficulty: FitnessLevel;
  evidenceStrength: number; // 1-10
  outcomes: string[];
  description: string;
  citation: string;
  goalAlignment: Record<Goal, number>; // 1-10 per goal
  timeOfDay: "morning" | "afternoon" | "evening" | "flexible";
}

export const protocols: Protocol[] = [
  {
    id: "cold-shower",
    name: "Cold Shower Finish",
    category: "Cold/Heat Exposure",
    timeRequired: 3,
    equipment: "None",
    costPerMonth: 0,
    difficulty: "beginner",
    evidenceStrength: 8,
    outcomes: ["29% fewer sick days", "200-300% norepinephrine increase", "Improved mood"],
    description:
      "End your normal shower with 2-3 minutes of cold water. Triggers norepinephrine release, boosts immune function, and increases brown fat activation.",
    citation: "Buijze et al., 2016 (n=3,018); Shevchuk, 2008",
    goalAlignment: { lifespan: 6, energy: 9, sleep: 5, body_composition: 6, mental_clarity: 8 },
    timeOfDay: "morning",
  },
  {
    id: "zone-2-walking",
    name: "Zone 2 Brisk Walking",
    category: "Exercise",
    timeRequired: 30,
    equipment: "None",
    costPerMonth: 0,
    difficulty: "beginner",
    evidenceStrength: 10,
    outcomes: ["80% lower all-cause mortality (top quartile)", "Improved cardiovascular health"],
    description:
      "Walk briskly at a pace where you can talk but not sing. Top quartile cardio fitness has a larger mortality reduction effect than quitting smoking.",
    citation: "Mandsager et al., 2018, JAMA Network Open",
    goalAlignment: { lifespan: 10, energy: 8, sleep: 7, body_composition: 7, mental_clarity: 6 },
    timeOfDay: "afternoon",
  },
  {
    id: "time-restricted-eating",
    name: "Time-Restricted Eating (10hr Window)",
    category: "Nutrition",
    timeRequired: 0,
    equipment: "None",
    costPerMonth: 0,
    difficulty: "beginner",
    evidenceStrength: 8,
    outcomes: ["-3% body weight", "-11% LDL cholesterol", "-5/8 mmHg blood pressure"],
    description:
      "Eat all meals within a 10-hour window (e.g. 8am-6pm). No calorie counting or special foods required — just timing.",
    citation: "Wilkinson et al., 2020, Cell Metabolism",
    goalAlignment: { lifespan: 8, energy: 7, sleep: 6, body_composition: 9, mental_clarity: 6 },
    timeOfDay: "flexible",
  },
  {
    id: "morning-sunlight",
    name: "Morning Sunlight Exposure",
    category: "Sleep",
    timeRequired: 15,
    equipment: "None",
    costPerMonth: 0,
    difficulty: "beginner",
    evidenceStrength: 8,
    outcomes: ["Circadian rhythm reset", "Natural vitamin D synthesis", "30-45 min faster sleep onset"],
    description:
      "Get 10-20 minutes of direct sunlight within 1 hour of waking. Sets your circadian clock and triggers natural vitamin D production.",
    citation: "Huberman, 2021; Wright et al., 2013",
    goalAlignment: { lifespan: 6, energy: 8, sleep: 10, body_composition: 3, mental_clarity: 7 },
    timeOfDay: "morning",
  },
  {
    id: "sleep-consistency",
    name: "Sleep Schedule Consistency",
    category: "Sleep",
    timeRequired: 0,
    equipment: "None",
    costPerMonth: 0,
    difficulty: "beginner",
    evidenceStrength: 9,
    outcomes: ["-13% mortality per hour restored", "22% more deep sleep"],
    description:
      "Wake at the same time +/- 30 minutes every day (including weekends). Keep room at 65-68F. No caffeine after noon.",
    citation: "2020 Scientific Reports; Multiple sleep studies",
    goalAlignment: { lifespan: 9, energy: 9, sleep: 10, body_composition: 5, mental_clarity: 8 },
    timeOfDay: "evening",
  },
  {
    id: "bodyweight-training",
    name: "Bodyweight Resistance Training",
    category: "Exercise",
    timeRequired: 30,
    equipment: "None",
    costPerMonth: 0,
    difficulty: "beginner",
    evidenceStrength: 9,
    outcomes: ["23% lower all-cause mortality", "31% lower cancer mortality"],
    description:
      "Push-ups, squats, lunges, and planks 3x/week. Muscle-strengthening activity has independent mortality benefits from cardio.",
    citation: "Stamatakis et al., 2018, JAMA Oncology (n=80,306)",
    goalAlignment: { lifespan: 9, energy: 8, sleep: 6, body_composition: 10, mental_clarity: 6 },
    timeOfDay: "afternoon",
  },
  {
    id: "hot-bath",
    name: "Hot Bath / Heat Exposure",
    category: "Cold/Heat Exposure",
    timeRequired: 20,
    equipment: "Bathtub",
    costPerMonth: 0,
    difficulty: "beginner",
    evidenceStrength: 8,
    outcomes: ["40% lower all-cause mortality (4-7x/week)", "63% lower sudden cardiac death"],
    description:
      "20-minute hot bath at 104F (40C), 4-7 times per week. Triggers heat shock protein response similar to sauna.",
    citation: "Laukkanen et al., 2015; Faulkner, 2017",
    goalAlignment: { lifespan: 9, energy: 5, sleep: 8, body_composition: 4, mental_clarity: 6 },
    timeOfDay: "evening",
  },
  {
    id: "meditation",
    name: "Mindfulness Meditation",
    category: "Stress",
    timeRequired: 10,
    equipment: "None",
    costPerMonth: 0,
    difficulty: "beginner",
    evidenceStrength: 7,
    outcomes: ["Reduced cortisol", "Lower inflammation", "Improved telomere length"],
    description:
      "10 minutes of focused breathing or guided meditation. Reduces chronic stress response and lowers systemic inflammation.",
    citation: "Epel et al., 2009; Black et al., 2015",
    goalAlignment: { lifespan: 7, energy: 6, sleep: 8, body_composition: 3, mental_clarity: 10 },
    timeOfDay: "morning",
  },
  {
    id: "social-connection",
    name: "Daily Social Connection",
    category: "Stress",
    timeRequired: 15,
    equipment: "None",
    costPerMonth: 0,
    difficulty: "beginner",
    evidenceStrength: 9,
    outcomes: ["50% increased survival probability", "Effect > quitting smoking"],
    description:
      "Meaningful conversation with a friend, family member, or community member. Strong social ties have a larger effect on mortality than exercise or obesity interventions.",
    citation: "Holt-Lunstad, 2010 (n=308,849)",
    goalAlignment: { lifespan: 9, energy: 7, sleep: 5, body_composition: 2, mental_clarity: 8 },
    timeOfDay: "flexible",
  },
  {
    id: "creatine",
    name: "Creatine Monohydrate (5g/day)",
    category: "Supplementation",
    timeRequired: 1,
    equipment: "None",
    costPerMonth: 12,
    difficulty: "beginner",
    evidenceStrength: 9,
    outcomes: ["Muscle & brain benefits", "Improved mitochondrial function", "Neuroprotection"],
    description:
      "5g daily of creatine monohydrate. One of the most researched supplements — benefits muscle, brain, and mitochondrial function.",
    citation: "Multiple meta-analyses; Rawson & Venezia, 2011",
    goalAlignment: { lifespan: 7, energy: 8, sleep: 4, body_composition: 8, mental_clarity: 7 },
    timeOfDay: "flexible",
  },
  {
    id: "vitamin-d3",
    name: "Vitamin D3 + K2 Supplementation",
    category: "Supplementation",
    timeRequired: 1,
    equipment: "None",
    costPerMonth: 12,
    difficulty: "beginner",
    evidenceStrength: 9,
    outcomes: ["25% lower mortality (if deficient)", "Bone health", "Immune function"],
    description:
      "1,000-4,000 IU/day of D3 with K2. ~65% of adults are deficient. Critical for immune function, bone health, and overall mortality.",
    citation: "USPSTF review; Multiple RCTs",
    goalAlignment: { lifespan: 8, energy: 6, sleep: 5, body_composition: 4, mental_clarity: 5 },
    timeOfDay: "morning",
  },
  {
    id: "omega-3",
    name: "Omega-3 Fish Oil (2g EPA+DHA)",
    category: "Supplementation",
    timeRequired: 1,
    equipment: "None",
    costPerMonth: 25,
    difficulty: "beginner",
    evidenceStrength: 9,
    outcomes: ["35% lower cardiac mortality", "Reduced inflammation", "Brain health"],
    description:
      "2g combined EPA+DHA daily. Reduces systemic inflammation and has strong evidence for cardiovascular and brain health.",
    citation: "VITAL trial subgroup analysis",
    goalAlignment: { lifespan: 9, energy: 6, sleep: 5, body_composition: 5, mental_clarity: 8 },
    timeOfDay: "morning",
  },
  {
    id: "magnesium",
    name: "Magnesium Glycinate",
    category: "Supplementation",
    timeRequired: 1,
    equipment: "None",
    costPerMonth: 15,
    difficulty: "beginner",
    evidenceStrength: 8,
    outcomes: ["Improved sleep quality", "Muscle recovery", "Stress reduction"],
    description:
      "200-400mg magnesium glycinate before bed. Supports 300+ enzymatic reactions, improves sleep quality, and aids muscle recovery.",
    citation: "Abbasi et al., 2012; Multiple studies",
    goalAlignment: { lifespan: 6, energy: 7, sleep: 9, body_composition: 5, mental_clarity: 6 },
    timeOfDay: "evening",
  },
  {
    id: "hiit",
    name: "High-Intensity Interval Training",
    category: "Exercise",
    timeRequired: 20,
    equipment: "None",
    costPerMonth: 0,
    difficulty: "intermediate",
    evidenceStrength: 8,
    outcomes: ["VO2max improvement", "Metabolic boost", "Time-efficient fitness"],
    description:
      "20 minutes of alternating high/low intensity intervals, 2-3x/week. Significantly improves VO2max, the strongest predictor of longevity.",
    citation: "Helgerud et al., 2007; Gibala et al., 2012",
    goalAlignment: { lifespan: 8, energy: 9, sleep: 6, body_composition: 9, mental_clarity: 7 },
    timeOfDay: "afternoon",
  },
  {
    id: "protein-optimization",
    name: "Protein Timing & Quality",
    category: "Nutrition",
    timeRequired: 10,
    equipment: "None",
    costPerMonth: 40,
    difficulty: "intermediate",
    evidenceStrength: 7,
    outcomes: ["Muscle protein synthesis", "Satiety", "Body composition"],
    description:
      "1.6g/kg/day protein distributed across meals, emphasizing leucine-rich sources. Supports muscle maintenance and metabolic health.",
    citation: "Morton et al., 2018; Phillips, 2014",
    goalAlignment: { lifespan: 6, energy: 7, sleep: 4, body_composition: 10, mental_clarity: 5 },
    timeOfDay: "flexible",
  },
  {
    id: "sauna",
    name: "Sauna Sessions (4x/week)",
    category: "Cold/Heat Exposure",
    timeRequired: 20,
    equipment: "Sauna access",
    costPerMonth: 30,
    difficulty: "beginner",
    evidenceStrength: 9,
    outcomes: ["40% lower all-cause mortality", "65% lower dementia risk"],
    description:
      "20-minute sauna at 174F (79C), 4-7x/week. 20-year Finnish study showed dramatic reductions in cardiovascular death and dementia.",
    citation: "Laukkanen et al., 2015 (n=2,315, 20yr follow-up)",
    goalAlignment: { lifespan: 10, energy: 6, sleep: 7, body_composition: 5, mental_clarity: 7 },
    timeOfDay: "evening",
  },
  {
    id: "gratitude-journaling",
    name: "Gratitude Journaling",
    category: "Stress",
    timeRequired: 5,
    equipment: "Journal/phone",
    costPerMonth: 0,
    difficulty: "beginner",
    evidenceStrength: 6,
    outcomes: ["Reduced stress hormones", "Better sleep", "Improved well-being"],
    description:
      "Write 3 things you're grateful for each evening. Shifts stress response and has measurable effects on cortisol and sleep quality.",
    citation: "Emmons & McCullough, 2003",
    goalAlignment: { lifespan: 5, energy: 6, sleep: 7, body_composition: 2, mental_clarity: 8 },
    timeOfDay: "evening",
  },
  {
    id: "strength-training",
    name: "Gym-Based Strength Training",
    category: "Exercise",
    timeRequired: 45,
    equipment: "Gym membership",
    costPerMonth: 30,
    difficulty: "intermediate",
    evidenceStrength: 9,
    outcomes: ["14% lower all-cause mortality", "Sarcopenia prevention", "Metabolic health"],
    description:
      "Compound lifts (squat, deadlift, bench, rows) 3x/week. After age 40, muscle mass becomes the #1 predictor of longevity. Grip strength predicts mortality better than blood pressure.",
    citation: "Stamatakis et al., 2022, BJSM (n=99,713)",
    goalAlignment: { lifespan: 9, energy: 9, sleep: 7, body_composition: 10, mental_clarity: 6 },
    timeOfDay: "afternoon",
  },
  {
    id: "blood-work",
    name: "Quarterly Blood Work",
    category: "Nutrition",
    timeRequired: 5,
    equipment: "Lab access",
    costPerMonth: 38,
    difficulty: "beginner",
    evidenceStrength: 8,
    outcomes: ["Biomarker tracking", "Early detection", "Protocol optimization"],
    description:
      "Track key biomarkers every 3 months: 25(OH)D, Omega-3 index, HbA1c, hs-CRP, lipid panel, RBC Magnesium. Enables data-driven protocol adjustments.",
    citation: "Evidence-based preventive medicine",
    goalAlignment: { lifespan: 8, energy: 5, sleep: 4, body_composition: 5, mental_clarity: 4 },
    timeOfDay: "morning",
  },
  {
    id: "breathwork",
    name: "Box Breathing / Breathwork",
    category: "Stress",
    timeRequired: 5,
    equipment: "None",
    costPerMonth: 0,
    difficulty: "beginner",
    evidenceStrength: 7,
    outcomes: ["Parasympathetic activation", "Reduced anxiety", "HRV improvement"],
    description:
      "5 minutes of 4-4-4-4 box breathing. Activates the parasympathetic nervous system, reduces cortisol, and improves heart rate variability.",
    citation: "Ma et al., 2017; Zaccaro et al., 2018",
    goalAlignment: { lifespan: 5, energy: 7, sleep: 7, body_composition: 2, mental_clarity: 9 },
    timeOfDay: "morning",
  },
];
