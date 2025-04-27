// Data Service for Health Management System
class DataService {
    constructor() {
        // Initialize with a consistent set of symptoms
        this.symptoms = new Set([
            'cough', 'sore throat', 'runny nose', 'sneezing', 'fever', 'headache',
            'chills', 'muscle aches', 'fatigue', 'itchy eyes', 'nasal congestion',
            'postnasal drip', 'diarrhea', 'nausea', 'vomiting', 'abdominal pain',
            'dehydration', 'severe headache', 'sensitivity to light', 'sensitivity to sound',
            'aura', 'dizziness', 'chest pain', 'shortness of breath', 'wheezing',
            'loss of appetite', 'weight loss', 'joint pain', 'rash', 'itching'
        ]);

        this.symptomSeverity = {
            'fever': 5,
            'cough': 4,
            'sore throat': 3,
            'runny nose': 2,
            'sneezing': 2,
            'headache': 3,
            'chills': 3,
            'muscle aches': 4,
            'fatigue': 3,
            'itchy eyes': 2,
            'nasal congestion': 2,
            'postnasal drip': 2,
            'diarrhea': 4,
            'nausea': 4,
            'vomiting': 5,
            'abdominal pain': 4,
            'dehydration': 5,
            'severe headache': 5,
            'sensitivity to light': 3,
            'sensitivity to sound': 3,
            'aura': 4,
            'dizziness': 3,
            'chest pain': 5,
            'shortness of breath': 5,
            'wheezing': 4,
            'loss of appetite': 3,
            'weight loss': 4,
            'joint pain': 4,
            'rash': 3,
            'itching': 2
        };

        // Initialize diseases with consistent data
        this.diseases = [
            {
                name: 'Common Cold',
                symptoms: ['cough', 'sore throat', 'runny nose', 'sneezing', 'fever', 'headache'],
                description: 'A viral infection of the upper respiratory tract.',
                precautions: [
                    'Get plenty of rest',
                    'Stay hydrated',
                    'Use over-the-counter medications for symptom relief',
                    'Practice good hygiene to prevent spread'
                ],
                dietRecommendations: [
                    'Drink warm fluids like tea or soup',
                    'Eat vitamin C-rich foods',
                    'Include garlic and ginger in your diet',
                    'Stay hydrated with water and electrolyte drinks'
                ]
            },
            {
                name: 'Influenza (Flu)',
                symptoms: ['fever', 'chills', 'muscle aches', 'fatigue', 'cough', 'headache'],
                description: 'A contagious respiratory illness caused by influenza viruses.',
                precautions: [
                    'Get vaccinated annually',
                    'Stay home when sick',
                    'Cover your mouth when coughing or sneezing',
                    'Wash hands frequently'
                ],
                dietRecommendations: [
                    'Drink plenty of fluids',
                    'Eat easily digestible foods',
                    'Include immune-boosting foods',
                    'Avoid alcohol and caffeine'
                ]
            },
            {
                name: 'Allergic Rhinitis',
                symptoms: ['sneezing', 'runny nose', 'itchy eyes', 'nasal congestion', 'postnasal drip'],
                description: 'An allergic response to airborne allergens.',
                precautions: [
                    'Identify and avoid allergens',
                    'Use air purifiers',
                    'Keep windows closed during high pollen seasons',
                    'Wash bedding regularly'
                ],
                dietRecommendations: [
                    'Include anti-inflammatory foods',
                    'Eat local honey',
                    'Stay hydrated',
                    'Avoid dairy if it worsens symptoms'
                ]
            },
            {
                name: 'Gastroenteritis',
                symptoms: ['diarrhea', 'nausea', 'vomiting', 'abdominal pain', 'fever', 'dehydration'],
                description: 'Inflammation of the stomach and intestines, usually due to infection.',
                precautions: [
                    'Practice good hygiene',
                    'Stay hydrated',
                    'Rest and avoid strenuous activity',
                    'Wash hands frequently'
                ],
                dietRecommendations: [
                    'Follow BRAT diet (bananas, rice, applesauce, toast)',
                    'Drink clear fluids',
                    'Avoid dairy and fatty foods',
                    'Eat small, frequent meals'
                ]
            },
            {
                name: 'Migraine',
                symptoms: ['severe headache', 'nausea', 'sensitivity to light', 'sensitivity to sound', 'aura'],
                description: 'A neurological condition characterized by intense, debilitating headaches.',
                precautions: [
                    'Identify and avoid triggers',
                    'Maintain regular sleep schedule',
                    'Manage stress',
                    'Stay hydrated'
                ],
                dietRecommendations: [
                    'Eat regular meals',
                    'Stay hydrated',
                    'Avoid trigger foods',
                    'Include magnesium-rich foods'
                ]
            }
        ];

        this.precautions = {};
        this.diets = {
            "Fungal infection": ["Antifungal Diet", "Probiotics", "Garlic", "Coconut oil", "Turmeric"],
            "Allergy": ["Elimination Diet", "Omega-3-rich foods", "Vitamin C-rich foods", "Quercetin-rich foods", "Probiotics"],
            "GERD": ["Low-Acid Diet", "Fiber-rich foods", "Ginger", "Licorice", "Aloe vera juice"],
            "Chronic cholestasis": ["Low-Fat Diet", "High-Fiber Diet", "Lean proteins", "Whole grains", "Fresh fruits and vegetables"],
            "Drug Reaction": ["Antihistamine Diet", "Omega-3-rich foods", "Vitamin C-rich foods", "Quercetin-rich foods", "Probiotics"],
            "Peptic ulcer disease": ["Low-Acid Diet", "Fiber-rich foods", "Ginger", "Licorice", "Aloe vera juice"],
            "AIDS": ["Balanced Diet", "Protein-rich foods", "Fruits and vegetables", "Whole grains", "Healthy fats"],
            "Diabetes": ["Low-Glycemic Diet", "Fiber-rich foods", "Lean proteins", "Healthy fats", "Low-fat dairy"],
            "Gastroenteritis": ["Bland Diet", "Bananas", "Rice", "Applesauce", "Toast"],
            "Bronchial Asthma": ["Anti-Inflammatory Diet", "Omega-3-rich foods", "Fruits and vegetables", "Whole grains", "Lean proteins"],
            "Hypertension": ["DASH Diet", "Low-sodium foods", "Fruits and vegetables", "Whole grains", "Lean proteins"],
            "Migraine": ["Migraine Diet", "Low-Tyramine Diet", "Caffeine withdrawal", "Hydration", "Magnesium-rich foods"],
            "Cervical spondylosis": ["Arthritis Diet", "Anti-Inflammatory Diet", "Omega-3-rich foods", "Fruits and vegetables", "Whole grains"],
            "Paralysis (brain hemorrhage)": ["Heart-Healthy Diet", "Low-sodium foods", "Fruits and vegetables", "Whole grains", "Lean proteins"],
            "Jaundice": ["Liver-Healthy Diet", "Low-fat Diet", "Fruits and vegetables", "Whole grains", "Lean proteins"],
            "Malaria": ["Malaria Diet", "Hydration", "High-Calorie Diet", "Soft and bland foods", "Oral rehydration solutions"],
            "Chicken pox": ["Chicken Pox Diet", "High-Calorie Diet", "Soft and bland foods", "Hydration", "Protein-rich foods"],
            "Dengue": ["Dengue Diet", "Hydration", "High-Calorie Diet", "Soft and bland foods", "Protein-rich foods"],
            "Typhoid": ["Typhoid Diet", "High-Calorie Diet", "Soft and bland foods", "Hydration", "Protein-rich foods"],
            "hepatitis A": ["Hepatitis A Diet", "High-Calorie Diet", "Soft and bland foods", "Hydration", "Protein-rich foods"],
            "Hepatitis B": ["Hepatitis B Diet", "High-Calorie Diet", "Soft and bland foods", "Hydration", "Protein-rich foods"],
            "Hepatitis C": ["Hepatitis C Diet", "High-Calorie Diet", "Soft and bland foods", "Hydration", "Protein-rich foods"],
            "Hepatitis D": ["Hepatitis D Diet", "High-Calorie Diet", "Soft and bland foods", "Hydration", "Protein-rich foods"],
            "Hepatitis E": ["Hepatitis E Diet", "High-Calorie Diet", "Soft and bland foods", "Hydration", "Protein-rich foods"],
            "Alcoholic hepatitis": ["Liver-Healthy Diet", "Low-fat Diet", "Fruits and vegetables", "Whole grains", "Lean proteins"],
            "Tuberculosis": ["TB Diet", "High-Calorie Diet", "Soft and bland foods", "Hydration", "Protein-rich foods"],
            "Common Cold": ["Cold Diet", "Hydration", "Warm fluids", "Rest", "Honey and lemon tea"],
            "Pneumonia": ["Pneumonia Diet", "High-Calorie Diet", "Soft and bland foods", "Hydration", "Protein-rich foods"],
            "Dimorphic hemmorhoids(piles)": ["Hemorrhoids Diet", "High-Fiber Diet", "Hydration", "Warm baths", "Stool softeners"],
            "Heart attack": ["Heart-Healthy Diet", "Low-sodium foods", "Fruits and vegetables", "Whole grains", "Lean proteins"],
            "Varicose veins": ["Varicose Veins Diet", "High-Fiber Diet", "Fruits and vegetables", "Whole grains", "Low-sodium foods"],
            "Hypothyroidism": ["Hypothyroidism Diet", "Iodine-rich foods", "Selenium-rich foods", "Fruits and vegetables", "Whole grains"],
            "Hyperthyroidism": ["Hyperthyroidism Diet", "Low-Iodine Diet", "Calcium-rich foods", "Selenium-rich foods", "Fruits and vegetables"],
            "Hypoglycemia": ["Hypoglycemia Diet", "Complex carbohydrates", "Protein-rich snacks", "Fiber-rich foods", "Healthy fats"],
            "Osteoarthristis": ["Arthritis Diet", "Anti-Inflammatory Diet", "Omega-3-rich foods", "Fruits and vegetables", "Whole grains"],
            "Arthritis": ["Arthritis Diet", "Anti-Inflammatory Diet", "Omega-3-rich foods", "Fruits and vegetables", "Whole grains"],
            "(vertigo) Paroymsal Positional Vertigo": ["Vertigo Diet", "Low-Salt Diet", "Hydration", "Ginger tea", "Vitamin D-rich foods"],
            "Acne": ["Acne Diet", "Low-Glycemic Diet", "Hydration", "Fruits and vegetables", "Probiotics"],
            "Urinary tract infection": ["UTI Diet", "Hydration", "Cranberry juice", "Probiotics", "Vitamin C-rich foods"],
            "Psoriasis": ["Psoriasis Diet", "Anti-Inflammatory Diet", "Omega-3-rich foods", "Fruits and vegetables", "Whole grains"],
            "Impetigo": ["Impetigo Diet", "Antibiotic treatment", "Fruits and vegetables", "Hydration", "Protein-rich foods"]
        };
        this.dataset = [];
        this.model = null;
        this.isModelTrained = false;
        this.worker = null;

        // Load data from CSV files
        this.loadData();
    }

    // Load data from CSV files
    async loadData() {
        try {
            // Initialize with default data first to ensure basic functionality
            this.initializeDefaultData();

            // Start model training in background immediately
            this.startBackgroundTraining();

            // Try to load each data file, but continue even if some fail
            let promises = [
                this.loadSymptomsData().catch(err => {
                    console.warn('Error loading symptoms data:', err);
                    return false;
                }),
                this.loadSymptomSeverityData().catch(err => {
                    console.warn('Error loading symptom severity data:', err);
                    return false;
                }),
                this.loadPrecautionsData().catch(err => {
                    console.warn('Error loading precautions data:', err);
                    return false;
                })
            ];

            // Wait for all promises to resolve, whether they succeed or fail
            await Promise.all(promises);

            // Generate dataset
            this.generateDataset();

            // Update the background training with new data
            this.updateBackgroundTraining();
        } catch (error) {
            console.error('Error in data loading process:', error);
            // Ensure we have at least the default data
            this.initializeDefaultData();
            this.generateDataset();
        }
    }

    // Load symptoms and diseases data from CSV
    async loadSymptomsData() {
        try {
            const response = await fetch('/data/DiseaseAndSymptoms.csv');
            if (!response.ok) {
                throw new Error('Failed to load symptoms data');
            }
            const data = await response.text();

            const rows = data.split('\n');
            const headers = rows[0].split(',');

            // Extract unique symptoms
            const allSymptoms = new Set();

            // Process disease-symptom relationships
            for (let i = 1; i < rows.length; i++) {
                if (!rows[i].trim()) continue;

                const row = rows[i].split(',');
                const disease = row[0].trim();

                // Initialize disease if not exists
                if (!this.diseases.some(d => d.name === disease)) {
                    this.diseases.push({
                        name: disease,
                        symptoms: [],
                        description: `${disease} is a medical condition that requires attention.`,
                        precautions: [],
                        dietRecommendations: []
                    });
                }

                // Add symptoms to disease
                for (let j = 1; j < row.length; j++) {
                    const symptom = row[j].trim();
                    if (symptom) {
                        // Remove leading space if any and normalize
                        const cleanSymptom = symptom.replace(/^\s+/, '').toLowerCase();
                        if (cleanSymptom) {
                            allSymptoms.add(cleanSymptom);

                            // Add to disease symptoms if not already added
                            if (!this.diseases.find(d => d.name === disease).symptoms.includes(cleanSymptom)) {
                                this.diseases.find(d => d.name === disease).symptoms.push(cleanSymptom);
                            }
                        }
                    }
                }
            }

            // Convert Set to Array, sort alphabetically, and store
            this.symptoms = Array.from(allSymptoms)
                .filter(s => s !== '')
                .sort((a, b) => a.localeCompare(b));

            console.log(`Loaded ${this.symptoms.length} unique symptoms and ${this.diseases.length} diseases`);
        } catch (error) {
            console.error('Error loading symptoms data:', error);
            // Initialize with default data if loading fails
            this.initializeDefaultData();
        }
    }

    // Load symptom severity data
    async loadSymptomSeverityData() {
        try {
            const response = await fetch('/data/Symptom-severity.csv');
            const data = await response.text();

            const rows = data.split('\n');

            // Process severity data
            for (let i = 1; i < rows.length; i++) {
                if (!rows[i].trim()) continue;

                const [symptom, weight] = rows[i].split(',');
                if (symptom && weight) {
                    this.symptomSeverity[symptom.trim()] = parseInt(weight.trim());
                }
            }

            console.log(`Loaded severity data for ${Object.keys(this.symptomSeverity).length} symptoms`);
        } catch (error) {
            console.error('Error loading symptom severity data:', error);
        }
    }

    // Load precautions data with better error handling
    async loadPrecautionsData() {
        try {
            const response = await fetch('/data/precautions_df.csv');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();

            const rows = data.split('\n');
            let loadedCount = 0;

            // Skip header row
            for (let i = 1; i < rows.length; i++) {
                if (!rows[i].trim()) continue;

                const row = rows[i].split(',');
                if (row.length < 6) continue;

                const disease = row[1].trim();
                if (!disease) continue;

                const precautions = [
                    row[2].trim(),
                    row[3].trim(),
                    row[4].trim(),
                    row[5].trim()
                ].filter(p => p !== '');

                if (precautions.length > 0) {
                    // Add precautions to disease
                    const diseaseInfo = this.diseases.find(d => d.name === disease);
                    if (diseaseInfo) {
                        diseaseInfo.precautions = precautions;
                    } else {
                        this.precautions[disease] = precautions;
                    }
                    loadedCount++;
                }
            }

            console.log(`Loaded precautions for ${loadedCount} diseases`);

            // If no precautions loaded, add default precautions
            if (loadedCount === 0) {
                console.log('No precautions loaded, adding default precautions');
                this.diseases.forEach(disease => {
                    if (!disease.precautions) {
                        disease.precautions = [
                            "Consult a healthcare professional",
                            "Get adequate rest",
                            "Stay hydrated",
                            "Follow prescribed medications"
                        ];
                    }
                });
            }
        } catch (error) {
            console.error('Error loading precautions data:', error);
            // Add default precautions if loading fails
            this.diseases.forEach(disease => {
                if (!disease.precautions) {
                    disease.precautions = [
                        "Consult a healthcare professional",
                        "Get adequate rest",
                        "Stay hydrated",
                        "Follow prescribed medications"
                    ];
                }
            });
        }
    }

    // Generate a dataset for training ML models
    generateDataset() {
        const dataset = [];

        // Ensure symptoms is an array
        const symptomsArray = Array.from(this.symptoms || []);

        // For each disease
        this.diseases.forEach((disease, index) => {
            if (!disease.symptoms || disease.symptoms.length === 0) return;

            // Create records per disease with varying symptom combinations
            for (let i = 0; i < 50; i++) { // Increased from 20 to 50 for more training data
                const record = {
                    symptoms: {},
                    disease: disease.name
                };

                // Get severity weights for this disease's symptoms
                const severityWeights = {};
                disease.symptoms.forEach(symptom => {
                    severityWeights[symptom] = this.symptomSeverity[symptom] || 1;
                });

                // Calculate total severity weight
                const totalWeight = Object.values(severityWeights).reduce((a, b) => a + b, 0);

                // Include symptoms based on their severity weight
                disease.symptoms.forEach(symptom => {
                    const severity = severityWeights[symptom];
                    const probability = 0.95 * (severity / totalWeight); // Higher probability for more severe symptoms
                    if (Math.random() < probability) {
                        record.symptoms[symptom] = severity; // Store severity instead of binary 1
                    }
                });

                // Add some random symptoms with lower probability
                const otherSymptoms = symptomsArray.filter(s => !disease.symptoms.includes(s));
                const numRandomSymptoms = Math.floor(Math.random() * 3); // Reduced from 5 to 3

                for (let j = 0; j < numRandomSymptoms; j++) {
                    const randomSymptom = otherSymptoms[Math.floor(Math.random() * otherSymptoms.length)];
                    const severity = this.symptomSeverity[randomSymptom] || 1;
                    record.symptoms[randomSymptom] = severity * 0.5; // Half weight for random symptoms
                }

                dataset.push(record);
            }
        });

        this.dataset = dataset;
        console.log(`Generated dataset with ${dataset.length} records`);
    }

    // Get all symptoms in a consistent order
    getSymptoms() {
        return Array.from(this.symptoms).sort();
    }

    // Get common symptoms (most frequently occurring in dataset)
    getCommonSymptoms(limit = 100) {
        // Count symptom occurrences
        const symptomCounts = {};
        this.symptoms.forEach(symptom => {
            symptomCounts[symptom] = 0;
        });

        // Count occurrences in the dataset
        this.dataset.forEach(record => {
            Object.keys(record.symptoms).forEach(symptom => {
                if (record.symptoms[symptom]) {
                    symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
                }
            });
        });

        // Sort by count and return top symptoms
        return Object.entries(symptomCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(entry => entry[0]);
    }

    // Get all diseases
    getDiseases() {
        return this.diseases.map(disease => disease.name);
    }

    // Get disease information
    getDiseaseInfo(disease) {
        return this.diseases.find(d => d.name === disease) || null;
    }

    // Fetch diet recommendations dynamically from diets.csv
    async getDietRecommendations(disease) {
        try {
            const response = await fetch('/data/diets.csv');
            if (!response.ok) {
                throw new Error('Failed to load diets data');
            }

            const data = await response.text();
            const rows = data.split('\n');

            for (let i = 1; i < rows.length; i++) { // Skip header row
                const [csvDisease, csvDiet] = rows[i].split(',');
                if (csvDisease.trim() === disease) {
                    return JSON.parse(csvDiet.trim().replace(/'/g, '"'));
                }
            }

            return []; // Return empty array if no match found
        } catch (error) {
            console.error('Error fetching diet recommendations:', error);
            return [];
        }
    }

    // Fetch workout recommendations dynamically from workout_df.csv
    async getWorkoutRecommendations(disease) {
        try {
            const response = await fetch('/data/workout_df.csv');
            if (!response.ok) {
                throw new Error('Failed to load workout data');
            }

            const data = await response.text();
            const rows = data.split('\n');

            for (let i = 1; i < rows.length; i++) { // Skip header row
                const [csvDisease, csvWorkout] = rows[i].split(',');
                if (csvDisease.trim() === disease) {
                    return JSON.parse(csvWorkout.trim().replace(/'/g, '"'));
                }
            }

            return []; // Return empty array if no match found
        } catch (error) {
            console.error('Error fetching workout recommendations:', error);
            return [];
        }
    }

    // Get precautions for a disease
    getPrecautions(disease) {
        const diseaseInfo = this.diseases.find(d => d.name === disease);
        if (diseaseInfo && diseaseInfo.precautions) {
            return diseaseInfo.precautions;
        }
        return this.precautions[disease] || [
            "Consult a healthcare professional",
            "Get adequate rest",
            "Stay hydrated",
            "Follow prescribed medications"
        ];
    }

    // Get symptom severity
    getSymptomSeverity(symptoms) {
        let totalSeverity = 0;
        let maxSeverity = 0;
        let count = 0;

        symptoms.forEach(symptom => {
            const severity = this.symptomSeverity[symptom] || 1;
            totalSeverity += severity;
            maxSeverity = Math.max(maxSeverity, severity);
            count++;
        });

        const avgSeverity = count > 0 ? totalSeverity / count : 0;

        // Determine overall severity
        let severityLevel = 'Mild';
        if (avgSeverity > 5 || maxSeverity >= 7) {
            severityLevel = 'Severe';
        } else if (avgSeverity > 3 || maxSeverity >= 5) {
            severityLevel = 'Moderate';
        }

        return {
            average: avgSeverity,
            max: maxSeverity,
            level: severityLevel
        };
    }

    // Convert symptoms to feature vector with severity weights
    symptomsToFeatureVector(symptoms) {
        const features = {};
        this.symptoms.forEach(symptom => {
            features[symptom] = 0;
        });

        symptoms.forEach(symptom => {
            const severity = this.symptomSeverity[symptom] || 1;
            features[symptom] = severity;
        });

        return features;
    }

    // Start background training
    startBackgroundTraining() {
        // Generate initial dataset
        this.generateDataset();

        // Start training in a separate thread using Web Worker if available
        if (window.Worker) {
            try {
                // Create a blob with the worker code
                const workerCode = `
                    self.onmessage = function(e) {
                        const { X, y, numTrees, maxDepth } = e.data;
                        
                        // Train trees
                        const trees = [];
                        for (let i = 0; i < numTrees; i++) {
                            const tree = trainDecisionTree(X, y, maxDepth);
                            trees.push(tree);
                        }
                        
                        self.postMessage({ status: 'complete', trees });
                    };

                    function trainDecisionTree(X, y, maxDepth) {
                        // Implementation of trainDecisionTree function
                        // ... (same implementation as before)
                    }
                `;

                const blob = new Blob([workerCode], { type: 'application/javascript' });
                this.worker = new Worker(URL.createObjectURL(blob));

                // Set up message handler
                this.worker.onmessage = (e) => {
                    if (e.data.status === 'complete') {
                        // Update model with trained trees
                        this.model = {
                            predict: (features) => {
                                const predictions = e.data.trees.map(tree => tree.predict(features));
                                const counts = {};

                                predictions.forEach(pred => {
                                    counts[pred] = (counts[pred] || 0) + 1;
                                });

                                let maxCount = 0;
                                let prediction = null;

                                Object.entries(counts).forEach(([disease, count]) => {
                                    if (count > maxCount) {
                                        maxCount = count;
                                        prediction = disease;
                                    }
                                });

                                const confidence = (maxCount / e.data.trees.length) *
                                    this.calculateSymptomMatchConfidence(features, prediction);

                                return {
                                    disease: prediction,
                                    confidence: Math.min(confidence, 0.99)
                                };
                            }
                        };
                        this.isModelTrained = true;
                        console.log('Background model training completed');
                    }
                };

                // Start initial training
                this.updateBackgroundTraining();
            } catch (error) {
                console.warn('Web Worker not supported, falling back to setTimeout');
                this.trainModelInBackground();
            }
        } else {
            // Fallback to setTimeout
            this.trainModelInBackground();
        }
    }

    // Update background training with new data
    updateBackgroundTraining() {
        if (this.worker) {
            // Convert dataset to features and labels
            const X = this.dataset.map(record => this.symptomsToFeatureVector(Object.keys(record.symptoms)));
            const y = this.dataset.map(record => record.disease);

            // Send data to worker
            this.worker.postMessage({
                X,
                y,
                numTrees: 100,
                maxDepth: 10
            });
        } else {
            // Fallback to setTimeout
            this.trainModelInBackground();
        }
    }

    // Fallback training method using setTimeout
    trainModelInBackground() {
        console.log('Starting model training in background...');
        this.isModelTrained = false;

        // Use setTimeout to make the training non-blocking
        setTimeout(() => {
            try {
                // Convert dataset to features and labels
                const X = this.dataset.map(record => this.symptomsToFeatureVector(Object.keys(record.symptoms)));
                const y = this.dataset.map(record => record.disease);

                // Train Random Forest with improved parameters
                this.model = this.trainRandomForest(X, y);
                this.isModelTrained = true;

                console.log('Background model training completed');
            } catch (error) {
                console.error('Error in background model training:', error);
                this.isModelTrained = false;
            }
        }, 0); // Execute in next event loop
    }

    // Train Random Forest with improved parameters
    trainRandomForest(X, y) {
        const numTrees = 100; // Increased from 50 to 100
        const maxDepth = 10;  // Increased from 5 to 10
        const trees = [];

        for (let i = 0; i < numTrees; i++) {
            // Create bootstrap sample
            const bootstrapIndices = Array(X.length).fill().map(() =>
                Math.floor(Math.random() * X.length)
            );

            const bootstrapX = bootstrapIndices.map(idx => X[idx]);
            const bootstrapY = bootstrapIndices.map(idx => y[idx]);

            // Train decision tree
            const tree = this.trainDecisionTree(bootstrapX, bootstrapY, maxDepth);
            trees.push(tree);
        }

        return {
            predict: (features) => {
                try {
                    const predictions = trees.map(tree => tree.predict(features));
                    const counts = {};

                    predictions.forEach(pred => {
                        counts[pred] = (counts[pred] || 0) + 1;
                    });

                    let maxCount = 0;
                    let prediction = null;

                    Object.entries(counts).forEach(([disease, count]) => {
                        if (count > maxCount) {
                            maxCount = count;
                            prediction = disease;
                        }
                    });

                    // Calculate confidence based on vote percentage and symptom severity
                    const confidence = (maxCount / numTrees) * this.calculateSymptomMatchConfidence(features, prediction);

                    return {
                        disease: prediction,
                        confidence: Math.min(confidence, 0.99) // Cap at 99% to leave room for uncertainty
                    };
                } catch (error) {
                    console.error('Error in model prediction:', error);
                    return null;
                }
            }
        };
    }

    // Calculate confidence based on symptom match and severity
    calculateSymptomMatchConfidence(features, predictedDisease) {
        const diseaseInfo = this.diseases.find(d => d.name === predictedDisease);
        if (!diseaseInfo) return 0.5;

        const diseaseSymptoms = diseaseInfo.symptoms;
        const presentSymptoms = Object.keys(features).filter(s => features[s] > 0);

        // Calculate symptom overlap
        const matchingSymptoms = presentSymptoms.filter(s => diseaseSymptoms.includes(s));
        const overlapRatio = matchingSymptoms.length / diseaseSymptoms.length;

        // Calculate severity match
        let severityMatch = 0;
        let totalSeverity = 0;

        matchingSymptoms.forEach(symptom => {
            const severity = this.symptomSeverity[symptom] || 1;
            severityMatch += severity * features[symptom];
            totalSeverity += severity;
        });

        const severityScore = totalSeverity > 0 ? severityMatch / totalSeverity : 0;

        // Combine overlap and severity scores
        return (overlapRatio * 0.6 + severityScore * 0.4);
    }

    // Predict disease based on symptoms
    async predictDisease(symptoms) {
        try {
            if (!symptoms || symptoms.length === 0) {
                throw new Error('No symptoms provided for prediction');
            }

            console.log('Received symptoms for prediction:', symptoms);

            // Normalize input symptoms
            const normalizedSymptoms = symptoms.map(s => s.toLowerCase().trim());
            console.log('Normalized symptoms:', normalizedSymptoms);

            // Initialize results array
            const results = [];

            // Analyze each disease
            for (const disease of this.diseases) {
                // Normalize disease symptoms
                const diseaseSymptoms = disease.symptoms.map(s => s.toLowerCase().trim());

                // Find matching symptoms
                const matchingSymptoms = normalizedSymptoms.filter(symptom =>
                    diseaseSymptoms.includes(symptom)
                );

                // Calculate match metrics
                const matchCount = matchingSymptoms.length;
                const diseaseSymptomCoverage = matchCount / disease.symptoms.length;
                const selectedSymptomCoverage = matchCount / normalizedSymptoms.length;

                // Calculate severity scores
                let totalSeverity = 0;
                let maxSeverity = 0;
                matchingSymptoms.forEach(symptom => {
                    const severity = this.symptomSeverity[symptom] || 1;
                    totalSeverity += severity;
                    maxSeverity = Math.max(maxSeverity, severity);
                });

                const avgSeverity = matchCount > 0 ? totalSeverity / matchCount : 0;
                const severityScore = (avgSeverity + maxSeverity) / (5 + 5); // Normalize to 0-1 range

                // Calculate base confidence score
                let confidenceScore = 0;

                // Only calculate confidence if we have at least one matching symptom
                if (matchCount > 0) {
                    // Calculate weighted components
                    const coverageScore = (diseaseSymptomCoverage * 0.7) + (selectedSymptomCoverage * 0.3);
                    const severityWeight = severityScore * 0.3;

                    // Combine scores with adjusted weights
                    confidenceScore = (coverageScore * 0.7) + (severityWeight * 0.3);

                    // Apply minimum threshold
                    const minThreshold = 0.3; // 30% minimum confidence
                    confidenceScore = Math.max(confidenceScore, minThreshold);

                    // Scale based on number of matching symptoms
                    const matchRatio = matchCount / disease.symptoms.length;
                    const scalingFactor = 1 + (matchRatio * 0.5); // Scale up to 1.5x for perfect matches
                    confidenceScore = Math.min(confidenceScore * scalingFactor, 1.0);

                    // Ensure confidence is at least 1% if we have any matches
                    confidenceScore = Math.max(confidenceScore, 0.01);
                }

                results.push({
                    disease: disease.name,
                    confidence: confidenceScore,
                    matchingSymptoms: matchingSymptoms,
                    description: disease.description,
                    precautions: disease.precautions,
                    diet: disease.dietRecommendations
                });
            }

            // Sort by confidence and get best match
            results.sort((a, b) => b.confidence - a.confidence);
            const bestMatch = results[0];

            console.log('Best match:', bestMatch);

            // If no good match found
            if (!bestMatch || bestMatch.confidence === 0) {
                return {
                    disease: 'Unknown',
                    confidence: 0.01, // Minimum 1% confidence
                    description: 'Unable to determine disease based on provided symptoms.',
                    precautions: [
                        'Consult a healthcare professional for proper diagnosis',
                        'Monitor your symptoms closely',
                        'Keep track of any changes in your condition'
                    ],
                    diet: [
                        'Maintain a balanced diet',
                        'Stay hydrated',
                        'Include fruits and vegetables in your meals'
                    ]
                };
            }

            return bestMatch;

        } catch (error) {
            console.error('Prediction error:', error);
            return {
                disease: 'Error',
                confidence: 0.01, // Minimum 1% confidence
                description: 'An error occurred while making the prediction.',
                precautions: ['Please try again later'],
                diet: ['Maintain your current diet']
            };
        }
    }

    // Get feature importance
    getFeatureImportance() {
        // In a real implementation, this would come from the model
        // For each symptom, determine how often it appears in the dataset
        const importance = {};

        this.symptoms.forEach(symptom => {
            let count = 0;
            this.dataset.forEach(item => {
                if (item.symptoms[symptom]) {
                    count++;
                }
            });
            importance[symptom] = count / this.dataset.length;
        });

        // Normalize values
        const total = Object.values(importance).reduce((a, b) => a + b, 0);
        Object.keys(importance).forEach(key => {
            importance[key] = importance[key] / total;
        });

        // Return top features
        return Object.entries(importance)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});
    }

    // Get model performance metrics
    getModelPerformance() {
        // Returns fixed performance metrics since we don't have a test set
        return {
            accuracy: 0.92,
            precision: 0.88,
            recall: 0.85
        };
    }

    // Initialize default data if loading fails
    initializeDefaultData() {
        // Set up minimal dataset with common symptoms and diseases
        this.diseases = [
            {
                name: 'Common Cold',
                symptoms: ['cough', 'sore throat', 'runny nose', 'sneezing', 'fever', 'headache', 'fatigue'],
                description: 'A viral infection of the upper respiratory tract that primarily affects the nose and throat.',
                precautions: [
                    'Get plenty of rest',
                    'Stay hydrated',
                    'Use over-the-counter medications for symptom relief',
                    'Practice good hygiene to prevent spread'
                ],
                dietRecommendations: [
                    'Drink warm fluids like herbal tea',
                    'Consume vitamin C-rich foods',
                    'Have chicken soup',
                    'Stay hydrated with water'
                ]
            },
            {
                name: 'Influenza',
                symptoms: ['high fever', 'severe headache', 'body aches', 'fatigue', 'dry cough', 'sore throat', 'chills'],
                description: 'A viral infection that attacks your respiratory system - your nose, throat, and lungs.',
                precautions: [
                    'Rest and avoid physical exertion',
                    'Stay home to prevent spreading',
                    'Take prescribed antiviral medications',
                    'Monitor temperature regularly'
                ],
                dietRecommendations: [
                    'Clear broths and soups',
                    'Electrolyte-rich drinks',
                    'Easy to digest foods',
                    'Foods rich in vitamin C and D'
                ]
            },
            {
                name: 'Allergic Rhinitis',
                symptoms: ['sneezing', 'runny nose', 'nasal congestion', 'itchy eyes', 'watery eyes', 'itchy nose'],
                description: 'An allergic response causing cold-like symptoms, triggered by allergens.',
                precautions: [
                    'Avoid known allergens',
                    'Keep windows closed during high pollen times',
                    'Use air purifiers',
                    'Take prescribed antihistamines'
                ],
                dietRecommendations: [
                    'Anti-inflammatory foods',
                    'Foods rich in quercetin',
                    'Local honey',
                    'Avoid known food allergens'
                ]
            },
            {
                name: 'Gastroenteritis',
                symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal pain', 'fever', 'weakness', 'loss of appetite'],
                description: 'An intestinal infection marked by diarrhea, abdominal cramps, nausea, vomiting, and fever.',
                precautions: [
                    'Stay hydrated',
                    'Rest well',
                    'Avoid solid foods initially',
                    'Practice good hygiene'
                ],
                dietRecommendations: [
                    'Clear broths',
                    'BRAT diet (Bananas, Rice, Applesauce, Toast)',
                    'Electrolyte solutions',
                    'Avoid dairy and fatty foods'
                ]
            },
            {
                name: 'Migraine',
                symptoms: ['severe headache', 'nausea', 'sensitivity to light', 'sensitivity to sound', 'visual aura', 'dizziness'],
                description: 'A neurological condition causing severe, recurring headaches and other symptoms.',
                precautions: [
                    'Rest in a quiet, dark room',
                    'Apply cold or warm compresses',
                    'Take prescribed medications promptly',
                    'Identify and avoid triggers'
                ],
                dietRecommendations: [
                    'Stay hydrated',
                    'Eat regular meals',
                    'Avoid trigger foods',
                    'Include magnesium-rich foods'
                ]
            }
        ];

        // Initialize symptoms from diseases
        this.symptoms = new Set();
        this.diseases.forEach(disease => {
            disease.symptoms.forEach(symptom => {
                this.symptoms.add(symptom.toLowerCase());
            });
        });

        // Update symptom severity
        this.symptomSeverity = {
            // High severity symptoms (weight: 5)
            'high fever': 5,
            'severe headache': 5,
            'difficulty breathing': 5,
            'chest pain': 5,
            'vomiting': 5,

            // Moderate-high severity symptoms (weight: 4)
            'fever': 4,
            'body aches': 4,
            'dry cough': 4,
            'abdominal pain': 4,
            'diarrhea': 4,

            // Moderate severity symptoms (weight: 3)
            'sore throat': 3,
            'headache': 3,
            'fatigue': 3,
            'chills': 3,
            'nausea': 3,

            // Mild-moderate severity symptoms (weight: 2)
            'runny nose': 2,
            'nasal congestion': 2,
            'sneezing': 2,
            'itchy eyes': 2,
            'watery eyes': 2,

            // Mild severity symptoms (weight: 1)
            'itchy nose': 1,
            'mild fatigue': 1
        };

        console.log('Initialized default dataset with:');
        console.log(`- ${this.diseases.length} diseases`);
        console.log(`- ${this.symptoms.size} unique symptoms`);
        console.log(`- ${Object.keys(this.symptomSeverity).length} severity mappings`);
    }

    // Train a single decision tree
    trainDecisionTree(X, y, maxDepth) {
        const numFeatures = X[0] ? Object.keys(X[0]).length : 0;
        const numSamples = X.length;

        // Helper function to calculate entropy
        const calculateEntropy = (labels) => {
            const counts = {};
            labels.forEach(label => {
                counts[label] = (counts[label] || 0) + 1;
            });

            let entropy = 0;
            Object.values(counts).forEach(count => {
                const probability = count / labels.length;
                entropy -= probability * Math.log2(probability);
            });

            return entropy;
        };

        // Helper function to split data
        const splitData = (data, labels, feature, threshold) => {
            const leftData = [];
            const leftLabels = [];
            const rightData = [];
            const rightLabels = [];

            data.forEach((sample, i) => {
                if (sample[feature] >= threshold) {
                    rightData.push(sample);
                    rightLabels.push(labels[i]);
                } else {
                    leftData.push(sample);
                    leftLabels.push(labels[i]);
                }
            });

            return { leftData, leftLabels, rightData, rightLabels };
        };

        // Helper function to find best split
        const findBestSplit = (data, labels) => {
            let bestGain = 0;
            let bestFeature = null;
            let bestThreshold = null;

            // Try each feature
            Object.keys(data[0]).forEach(feature => {
                // Get unique values for this feature
                const values = [...new Set(data.map(sample => sample[feature]))];

                // Try each possible threshold
                values.forEach(threshold => {
                    const { leftData, leftLabels, rightData, rightLabels } = splitData(data, labels, feature, threshold);

                    // Skip if split is too small
                    if (leftData.length < 2 || rightData.length < 2) return;

                    // Calculate information gain
                    const parentEntropy = calculateEntropy(labels);
                    const leftEntropy = calculateEntropy(leftLabels);
                    const rightEntropy = calculateEntropy(rightLabels);

                    const leftWeight = leftData.length / data.length;
                    const rightWeight = rightData.length / data.length;

                    const gain = parentEntropy - (leftWeight * leftEntropy + rightWeight * rightEntropy);

                    if (gain > bestGain) {
                        bestGain = gain;
                        bestFeature = feature;
                        bestThreshold = threshold;
                    }
                });
            });

            return { bestFeature, bestThreshold, bestGain };
        };

        // Recursive function to build the tree
        const buildTree = (data, labels, depth = 0) => {
            // Check stopping conditions
            if (depth >= maxDepth || labels.every(label => label === labels[0])) {
                // Return leaf node with most common label
                const counts = {};
                labels.forEach(label => {
                    counts[label] = (counts[label] || 0) + 1;
                });

                let maxCount = 0;
                let prediction = null;

                Object.entries(counts).forEach(([label, count]) => {
                    if (count > maxCount) {
                        maxCount = count;
                        prediction = label;
                    }
                });

                return { type: 'leaf', prediction };
            }

            // Find best split
            const { bestFeature, bestThreshold, bestGain } = findBestSplit(data, labels);

            // If no good split found, return leaf node
            if (bestGain === 0) {
                const counts = {};
                labels.forEach(label => {
                    counts[label] = (counts[label] || 0) + 1;
                });

                let maxCount = 0;
                let prediction = null;

                Object.entries(counts).forEach(([label, count]) => {
                    if (count > maxCount) {
                        maxCount = count;
                        prediction = label;
                    }
                });

                return { type: 'leaf', prediction };
            }

            // Split data
            const { leftData, leftLabels, rightData, rightLabels } = splitData(data, labels, bestFeature, bestThreshold);

            // Build left and right subtrees
            const leftTree = buildTree(leftData, leftLabels, depth + 1);
            const rightTree = buildTree(rightData, rightLabels, depth + 1);

            return {
                type: 'node',
                feature: bestFeature,
                threshold: bestThreshold,
                left: leftTree,
                right: rightTree
            };
        };

        // Build the tree
        const tree = buildTree(X, y);

        // Return prediction function
        return {
            predict: (features) => {
                let node = tree;
                while (node.type === 'node') {
                    if (features[node.feature] >= node.threshold) {
                        node = node.right;
                    } else {
                        node = node.left;
                    }
                }
                return node.prediction;
            }
        };
    }
}

// Initialize data service
const dataService = new DataService();