// Disease Prediction Module
class DiseasePrediction {
    constructor() {
        this.symptoms = [];
        this.commonSymptoms = [];
        this.selectedSymptoms = [];
        this.isModelTrained = false;
        this.maxSymptomsAllowed = 10; // Increased from 7 to 10 maximum symptoms

        // DOM elements
        this.symptomSearch = document.getElementById('symptomSearch');
        this.symptomSuggestions = document.getElementById('symptomSuggestions');
        this.selectedSymptomsContainer = document.getElementById('selectedSymptoms');
        this.symptomForm = document.getElementById('symptomForm');
        this.symptomsCheckboxContainer = document.getElementById('symptomsCheckboxContainer');
        this.symptomCounter = document.getElementById('symptomCounter');
        this.useHealthRecordsCheckbox = document.getElementById('useHealthRecords');

        this.loadingPrediction = document.getElementById('loadingPrediction');
        this.noPrediction = document.getElementById('noPrediction');
        this.predictionOutput = document.getElementById('predictionOutput');

        this.predictedDisease = document.getElementById('predictedDisease');
        this.confidenceLevel = document.getElementById('confidenceLevel');
        this.confidencePercent = document.getElementById('confidencePercent');
        this.diseaseDescription = document.getElementById('diseaseDescription');
        this.diseasePrecautions = document.getElementById('diseasePrecautions');
        this.diseaseSeverity = document.getElementById('diseaseSeverity');
        this.alternativeDiseases = document.getElementById('alternativeDiseases');

        // Symptom categories for better organization
        this.symptomCategories = {
            'Pain & Discomfort': ['headache', 'chest_pain', 'abdominal_pain', 'back_pain', 'joint_pain', 'neck_pain', 'knee_pain', 'muscle_pain', 'belly_pain', 'stomach_pain'],
            'Digestive Issues': ['vomiting', 'nausea', 'diarrhoea', 'indigestion', 'constipation', 'stomach_bleeding', 'acidity', 'loss_of_appetite'],
            'Respiratory': ['cough', 'breathlessness', 'runny_nose', 'phlegm', 'congestion', 'sinus_pressure', 'mucoid_sputum'],
            'Fever & Infection': ['high_fever', 'mild_fever', 'chills', 'sweating', 'shivering'],
            'Skin & Appearance': ['yellowish_skin', 'skin_rash', 'itching', 'swelling', 'red_spots_over_body', 'dischromic_patches'],
            'Vision & Eyes': ['blurred_and_distorted_vision', 'redness_of_eyes', 'watering_from_eyes', 'visual_disturbances'],
            'Neurological': ['dizziness', 'lethargy', 'fatigue', 'weakness', 'restlessness', 'loss_of_balance', 'unsteadiness'],
            'General Symptoms': ['weight_loss', 'weight_gain', 'swelled_lymph_nodes', 'malaise', 'weakness_in_limbs', 'excessive_hunger']
        };

        // Bind event handlers
        this.bindEvents();
    }

    // Initialize the module
    async init() {
        // Check if symptoms are cached in localStorage
        const cachedSymptoms = localStorage.getItem('cachedSymptoms');
        const cachedCommonSymptoms = localStorage.getItem('cachedCommonSymptoms');

        if (cachedSymptoms && cachedCommonSymptoms) {
            // Use cached symptoms
            this.symptoms = JSON.parse(cachedSymptoms);
            this.commonSymptoms = JSON.parse(cachedCommonSymptoms);
        } else {
            // Fetch symptoms from data service
            this.symptoms = dataService.getSymptoms();
            this.commonSymptoms = dataService.getCommonSymptoms(100);

            // Cache symptoms in localStorage
            localStorage.setItem('cachedSymptoms', JSON.stringify(this.symptoms));
            localStorage.setItem('cachedCommonSymptoms', JSON.stringify(this.commonSymptoms));
        }

        // Apply any saved settings
        this.loadSavedSettings();

        // Render symptom checkboxes
        this.renderSymptomCheckboxes();

        // Add CSS for toast notifications if needed
        this.addToastStyles();
    }

    // Bind event handlers
    bindEvents() {
        // Form submission
        if (this.symptomForm) {
            this.symptomForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.predictDisease();
            });
        }

        // Save results button
        const saveResultBtn = document.getElementById('saveResultBtn');
        if (saveResultBtn) {
            saveResultBtn.addEventListener('click', () => this.saveResultToRecords());
        }

        // Symptom search
        const symptomSearchInput = document.getElementById('symptomSearchInput');
        if (symptomSearchInput) {
            symptomSearchInput.addEventListener('input', (e) => {
                this.filterSymptoms(e.target.value);
            });
        }
    }

    // Filter symptoms based on search input
    filterSymptoms(searchText) {
        const checkboxes = document.querySelectorAll('.symptom-checkbox');
        if (!checkboxes.length) return;

        const searchTerm = searchText.toLowerCase();

        checkboxes.forEach(checkbox => {
            const label = checkbox.querySelector('label');
            const symptomText = label.textContent.toLowerCase();

            if (symptomText.includes(searchTerm) || searchTerm === '') {
                checkbox.style.display = 'flex';
            } else {
                checkbox.style.display = 'none';
            }
        });
    }

    // Get category for a symptom
    getSymptomCategory(symptom) {
        for (const [category, symptoms] of Object.entries(this.symptomCategories)) {
            if (symptoms.includes(symptom)) {
                return category;
            }
        }
        return 'Other';
    }

    // Render symptom checkboxes
    renderSymptomCheckboxes() {
        if (!this.symptomsCheckboxContainer) return;

        // Clear container
        this.symptomsCheckboxContainer.innerHTML = '';

        // Create header with counter
        const counterHeader = document.createElement('div');
        counterHeader.className = 'symptom-counter';
        counterHeader.innerHTML = `
            <span>Select symptoms (maximum ${this.maxSymptomsAllowed}):</span>
            <span id="symptomCounter">0/${this.maxSymptomsAllowed} selected</span>
        `;
        this.symptomsCheckboxContainer.appendChild(counterHeader);
        this.symptomCounter = document.getElementById('symptomCounter');

        // Add search input for symptoms
        const searchBox = document.createElement('div');
        searchBox.className = 'symptom-search-box';
        searchBox.innerHTML = `
            <i class="fas fa-search"></i>
            <input type="text" id="symptomSearchInput" placeholder="Search symptoms...">
        `;
        this.symptomsCheckboxContainer.appendChild(searchBox);

        // Create scrollable container for checkboxes
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'symptoms-scroll-container';

        // Group symptoms by category
        const categorizedSymptoms = {};
        this.commonSymptoms.forEach(symptom => {
            const category = this.getSymptomCategory(symptom);
            if (!categorizedSymptoms[category]) {
                categorizedSymptoms[category] = [];
            }
            categorizedSymptoms[category].push(symptom);
        });

        // Create accordion for each category
        for (const [category, symptoms] of Object.entries(categorizedSymptoms).sort()) {
            // Create category section
            const categorySection = document.createElement('div');
            categorySection.className = 'symptom-category';

            // Create category header
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'symptom-category-header';
            categoryHeader.innerHTML = `
                <span>${category}</span>
                <i class="fas fa-chevron-down"></i>
            `;
            categorySection.appendChild(categoryHeader);

            // Create symptom grid for this category
            const categoryGrid = document.createElement('div');
            categoryGrid.className = 'symptoms-grid';

            // Add symptom checkboxes for this category
            symptoms.forEach(symptom => {
                const checkboxDiv = document.createElement('div');
                checkboxDiv.className = 'symptom-checkbox';

                const id = `symptom-${symptom.replace(/\s+/g, '-')}`;

                checkboxDiv.innerHTML = `
                    <input type="checkbox" id="${id}" value="${symptom}" class="symptom-select" ${this.selectedSymptoms.includes(symptom) ? 'checked' : ''}>
                    <label for="${id}">${symptom.replace(/_/g, ' ')}</label>
                `;

                categoryGrid.appendChild(checkboxDiv);

                // Add event listener
                const checkbox = checkboxDiv.querySelector('input');
                checkbox.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        // Check if max symptoms reached
                        if (this.selectedSymptoms.length >= this.maxSymptomsAllowed) {
                            e.target.checked = false;
                            this.showToast(`You can select maximum ${this.maxSymptomsAllowed} symptoms`, 'error');
                            return;
                        }

                        this.selectedSymptoms.push(symptom);
                    } else {
                        this.selectedSymptoms = this.selectedSymptoms.filter(s => s !== symptom);
                    }

                    // Update counter
                    this.updateSymptomCounter();
                });
            });

            // Add grid to category section
            categorySection.appendChild(categoryGrid);

            // Add toggle functionality to category header
            categoryHeader.addEventListener('click', () => {
                categoryGrid.classList.toggle('collapsed');
                categoryHeader.querySelector('i').classList.toggle('fa-chevron-down');
                categoryHeader.querySelector('i').classList.toggle('fa-chevron-right');
            });

            // Add category section to scrollable container
            scrollContainer.appendChild(categorySection);
        }

        // Add scrollable container to main container
        this.symptomsCheckboxContainer.appendChild(scrollContainer);

        // Update counter initially
        this.updateSymptomCounter();
    }

    // Update symptom counter
    updateSymptomCounter() {
        if (this.symptomCounter) {
            this.symptomCounter.textContent = `${this.selectedSymptoms.length}/${this.maxSymptomsAllowed} selected`;
        }
    }

    // Predict disease based on selected symptoms
    async predictDisease() {
        if (this.selectedSymptoms.length === 0) {
            this.showToast('Please select at least one symptom', 'error');
            return;
        }

        // Show loading state
        this.loadingPrediction.classList.remove('hidden');
        this.noPrediction.classList.add('hidden');
        this.predictionOutput.classList.add('hidden');

        try {
            // Get relevant health records if option is checked
            const healthRecords = this.useHealthRecordsCheckbox && this.useHealthRecordsCheckbox.checked ?
                auth.getHealthRecords() : [];

            // Make prediction using data service
            const prediction = await dataService.predictDisease(
                this.selectedSymptoms,
                healthRecords
            );

            // Update prediction display
            this.updatePredictionDisplay(prediction);

            // Hide loading state, show prediction
            this.loadingPrediction.classList.add('hidden');
            this.noPrediction.classList.add('hidden');
            this.predictionOutput.classList.remove('hidden');
        } catch (error) {
            console.error('Error predicting disease:', error);
            this.showToast('Error making prediction. Please try again.', 'error');

            // Hide loading state, show no prediction
            this.loadingPrediction.classList.add('hidden');
            this.noPrediction.classList.remove('hidden');
            this.predictionOutput.classList.add('hidden');
        }
    }

    // Update the confidence level bar and percentage dynamically
    updatePredictionDisplay(prediction) {
        // Ensure all required DOM elements exist before updating
        const requiredElements = {
            predictedDisease: this.predictedDisease,
            confidenceLevel: this.confidenceLevel,
            confidencePercent: this.confidencePercent,
            diseasePrecautions: this.diseasePrecautions,
            alternativeDiseases: this.alternativeDiseases
        };

        const missingElements = Object.entries(requiredElements).filter(([key, el]) => !el);
        if (missingElements.length > 0) {
            console.error('Missing DOM elements:', missingElements.map(([key]) => key));
            return;
        }

        // Update predicted disease
        this.predictedDisease.textContent = prediction.disease;

        // Calculate and update confidence level
        const confidence = Math.min(100, Math.round(prediction.confidence * 100)); // Ensure confidence is a percentage
        this.confidenceLevel.style.width = `${confidence}%`;
        this.confidencePercent.textContent = `${confidence}%`;

        // Set confidence bar color based on confidence value
        if (confidence > 75) {
            this.confidenceLevel.style.backgroundColor = 'var(--success-color)';
        } else if (confidence > 50) {
            this.confidenceLevel.style.backgroundColor = 'var(--warning-color)';
        } else {
            this.confidenceLevel.style.backgroundColor = 'var(--danger-color)';
        }

        // Update precautions
        this.diseasePrecautions.innerHTML = '';
        if (prediction.precautions && prediction.precautions.length > 0) {
            prediction.precautions.forEach(precaution => {
                const li = document.createElement('li');
                li.textContent = precaution;
                this.diseasePrecautions.appendChild(li);
            });
        } else {
            this.diseasePrecautions.textContent = 'No precautions available.';
        }

        // Remove diet recommendations from the disease prediction display
        const predictionElement = document.getElementById('prediction');
        if (predictionElement) {
            const dietSection = predictionElement.querySelector('.diet-recommendations');
            if (dietSection) {
                dietSection.remove();
            }
        }

        // Update alternative diseases
        this.alternativeDiseases.innerHTML = '';
        if (prediction.alternatives && prediction.alternatives.length > 0) {
            prediction.alternatives.forEach(alt => {
                const probability = Math.round(alt.probability * 100);
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="disease-name">${alt.disease}</span>
                    <div class="alt-confidence">
                        <div class="alt-confidence-bar">
                            <div class="alt-confidence-level" style="width: ${probability}%; background-color: ${probability > 50 ? 'var(--warning-color)' : 'var(--medium-gray)'}"></div>
                        </div>
                        <span class="alt-confidence-percent">${probability}%</span>
                    </div>
                `;
                this.alternativeDiseases.appendChild(li);
            });
        } else {
            this.alternativeDiseases.innerHTML = '<li>No other likely diseases found</li>';
        }
    }

    // Save prediction result to health records
    saveResultToRecords() {
        if (!auth.isLoggedIn) {
            this.showToast('Please log in to save results', 'error');
            return;
        }

        if (!this.predictedDisease.textContent || this.predictedDisease.textContent === 'Unknown') {
            this.showToast('No prediction to save', 'error');
            return;
        }

        // Create a new health record with the prediction
        const record = {
            date: new Date().toISOString().split('T')[0],
            recordType: 'routine',
            bloodPressure: '-',
            heartRate: '-',
            temperature: '-',
            weight: '-',
            symptoms: this.selectedSymptoms.join(', '),
            notes: `Disease prediction: ${this.predictedDisease.textContent} (${this.confidencePercent.textContent} confidence)`
        };

        try {
            // Save record using auth service
            auth.saveHealthRecord(record);

            // Show success message
            this.showToast('Prediction saved to health records', 'success');

            // Update records view if on that page
            if (window.healthRecords) {
                window.healthRecords.init();
            }
        } catch (error) {
            console.error('Error saving prediction:', error);
            this.showToast('Error saving prediction', 'error');
        }
    }

    // Load saved settings
    loadSavedSettings() {
        const savedSettings = localStorage.getItem('healthtrackPredictionSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);

            // Set use health records option
            if (settings.useHealthRecords !== undefined && this.useHealthRecordsCheckbox) {
                this.useHealthRecordsCheckbox.checked = settings.useHealthRecords;
            }

            // Set max symptoms allowed
            if (settings.maxSymptomsAllowed) {
                this.maxSymptomsAllowed = settings.maxSymptomsAllowed;
            }
        }
    }

    // Save settings
    saveSettings() {
        const settings = {
            useHealthRecords: this.useHealthRecordsCheckbox ? this.useHealthRecordsCheckbox.checked : true,
            maxSymptomsAllowed: this.maxSymptomsAllowed
        };

        localStorage.setItem('healthtrackPredictionSettings', JSON.stringify(settings));
    }

    // Add toast notification styles
    addToastStyles() {
        // Check if styles already exist
        if (document.getElementById('toast-styles')) return;

        // Create style element
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
            }
            
            .toast {
                background-color: white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border-radius: 8px;
                margin-top: 10px;
                overflow: hidden;
                animation: toast-in 0.3s ease-in-out;
            }
            
            .toast-content {
                display: flex;
                align-items: center;
                padding: 12px 15px;
            }
            
            .toast i {
                margin-right: 10px;
                font-size: 1.2rem;
            }
            
            .toast-success i {
                color: var(--success-color);
            }
            
            .toast-error i {
                color: var(--danger-color);
            }
            
            .toast-info i {
                color: var(--info-color);
            }
            
            .toast-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0 10px;
                color: var(--dark-gray);
            }
            
            .symptoms-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 10px;
                margin-top: 15px;
            }
            
            .symptom-checkbox {
                display: flex;
                align-items: center;
                padding: 8px 12px;
                background-color: #f8f9fa;
                border-radius: 4px;
                transition: background-color 0.2s;
            }
            
            .symptom-checkbox:hover {
                background-color: #e9ecef;
            }
            
            .symptom-checkbox input {
                margin-right: 8px;
            }
            
            .symptom-checkbox label {
                cursor: pointer;
                text-transform: capitalize;
                font-size: 0.9rem;
            }
            
            .symptom-counter {
                display: flex;
                justify-content: space-between;
                font-weight: bold;
                padding: 10px 0;
                border-bottom: 1px solid #dee2e6;
            }
            
            .severity-indicator {
                display: inline-block;
                padding: 5px 10px;
                border-radius: 4px;
                color: white;
                font-weight: bold;
                margin-bottom: 10px;
            }
            
            .severity-mild {
                background-color: var(--success-color);
            }
            
            .severity-moderate {
                background-color: var(--warning-color);
            }
            
            .severity-severe {
                background-color: var(--danger-color);
            }
            
            @keyframes toast-in {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;

        // Add to document
        document.head.appendChild(style);
    }

    // Show toast message
    showToast(message, type = 'info') {
        // Check if toast container exists
        let toastContainer = document.querySelector('.toast-container');

        // Create container if it doesn't exist
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">×</button>
        `;

        // Add to container
        toastContainer.appendChild(toast);

        // Add event listener to close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.remove();
        });

        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Initialize symptoms checkboxes
    initSymptomsCheckboxes() {
        const container = document.getElementById('symptomsCheckboxContainer');
        container.innerHTML = '';

        // Get symptoms from data service and sort alphabetically
        const symptoms = dataService.getSymptoms().sort((a, b) => a.localeCompare(b));

        // Create a grid layout for checkboxes
        const grid = document.createElement('div');
        grid.className = 'symptoms-grid';

        symptoms.forEach(symptom => {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'symptom-checkbox';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `prediction-symptom-${symptom}`;
            checkbox.value = symptom;
            checkbox.name = 'prediction-symptoms';

            const label = document.createElement('label');
            label.htmlFor = `prediction-symptom-${symptom}`;
            label.textContent = symptom;

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            grid.appendChild(checkboxContainer);
        });

        container.appendChild(grid);

        // Add search functionality
        const searchBox = document.createElement('div');
        searchBox.className = 'search-box';
        searchBox.innerHTML = `
            <i class="fas fa-search"></i>
            <input type="text" id="symptomSearch" placeholder="Search symptoms...">
        `;
        container.insertBefore(searchBox, grid);

        // Add search event listener
        const searchInput = document.getElementById('symptomSearch');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const checkboxes = container.querySelectorAll('.symptom-checkbox');

            checkboxes.forEach(checkbox => {
                const label = checkbox.querySelector('label');
                const symptom = label.textContent.toLowerCase();
                checkbox.style.display = symptom.includes(searchTerm) ? 'flex' : 'none';
            });
        });
    }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance
    window.diseasePrediction = new DiseasePrediction();
});