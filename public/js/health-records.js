// Health Records Module - Using sample data instead of MongoDB backend
class HealthRecords {
    constructor() {
        this.records = [];
        this.currentRecord = null;

        // Load saved data from localStorage during initialization
        this.loadDataFromLocalStorage();

        // Only generate dummy data if no saved records exist
        if (this.records.length === 0) {
            this.records = this.generateSampleRecords();
        }

        // DOM elements
        this.recordsTable = document.getElementById('healthRecordsTable');
        this.recordFormModal = document.getElementById('recordFormModal');
        this.recordForm = document.getElementById('healthRecordForm');
        this.recordFormTitle = document.getElementById('recordFormTitle');
        this.recordIdInput = document.getElementById('recordId');
        this.searchInput = document.getElementById('searchRecords');
        this.recordTypeFilter = document.getElementById('recordTypeFilter');

        // Initialize dataService
        this.dataService = new DataService();

        // Bind event handlers
        this.bindEvents();
    }

    // Save data to localStorage
    saveDataToLocalStorage() {
        try {
            const loggedInUser = window.auth ? window.auth.getCurrentUser() : null;
            const storageKey = loggedInUser ? `healthRecords_${loggedInUser.username}` : 'guestHealthRecords';
            localStorage.setItem(storageKey, JSON.stringify(this.records));
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
        }
    }

    // Load data from localStorage
    loadDataFromLocalStorage() {
        try {
            const loggedInUser = window.auth ? window.auth.getCurrentUser() : null;
            const storageKey = loggedInUser ? `healthRecords_${loggedInUser.username}` : 'guestHealthRecords';
            const savedData = localStorage.getItem(storageKey);
            this.records = savedData ? JSON.parse(savedData) : [];
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
            this.records = [];
        }
    }

    // Load records for the logged-in user
    loadRecordsForUser() {
        try {
            const loggedInUser = window.auth ? window.auth.getCurrentUser() : null;
            if (!loggedInUser) {
                this.records = [];
                return;
            }

            const allRecords = JSON.parse(localStorage.getItem('healthRecords')) || [];
            this.records = allRecords.filter(record => record.username === loggedInUser.username);
        } catch (error) {
            console.error('Error loading records for user:', error);
            this.records = [];
        }
    }

    // Save records with user identification
    saveRecordsToStorage() {
        try {
            const loggedInUser = window.auth ? window.auth.getCurrentUser() : null;
            if (!loggedInUser) {
                console.warn('No logged-in user found. Saving records as guest.');
                const guestRecords = JSON.parse(localStorage.getItem('guestHealthRecords')) || [];
                const updatedGuestRecords = [...guestRecords, ...this.records];
                localStorage.setItem('guestHealthRecords', JSON.stringify(updatedGuestRecords));
                return;
            }

            const allRecords = JSON.parse(localStorage.getItem('healthRecords')) || [];
            const otherUsersRecords = allRecords.filter(record => record.username !== loggedInUser.username);

            // Add current user's records
            const updatedRecords = [...otherUsersRecords, ...this.records.map(record => ({
                ...record,
                username: loggedInUser.username
            }))];

            localStorage.setItem('healthRecords', JSON.stringify(updatedRecords));
        } catch (error) {
            console.error('Error saving records to storage:', error);
            this.showToast('Error saving records', 'error');
        }
    }

    // Load records from local storage during initialization
    loadRecordsFromStorage() {
        try {
            const allRecords = JSON.parse(localStorage.getItem('healthRecords')) || [];
            this.records = allRecords;
        } catch (error) {
            console.error('Error loading records from storage:', error);
            this.records = [];
        }
    }

    // Initialize health records
    async init() {
        try {
            // Show loading state
            if (this.recordsTable) {
                this.recordsTable.innerHTML = '<tr><td colspan="8" class="loading-state">Loading health records...</td></tr>';
            }

            // Render records
            this.renderRecords();
        } catch (error) {
            console.error('Error initializing health records:', error);
            if (this.recordsTable) {
                this.recordsTable.innerHTML = '<tr><td colspan="8" class="error-state">Error loading health records. Please try again.</td></tr>';
            }
        }
    }

    // Generate sample health records
    generateSampleRecords() {
        const today = new Date();
        const records = [];

        // Generate up to 10 records over the past 2 months
        for (let i = 0; i < 10; i++) {
            const recordDate = new Date();
            recordDate.setDate(today.getDate() - (i * 6)); // Every 6 days

            records.push({
                id: `record-${i}`,
                date: recordDate.toISOString().split('T')[0],
                age: Math.floor(20 + Math.random() * 40).toString(), // 20-60
                recordType: i % 2 === 0 ? 'routine' : 'monthly',
                bloodPressure: `${Math.floor(110 + Math.random() * 20)}/${Math.floor(70 + Math.random() * 15)}`, // 110-130/70-85
                heartRate: Math.floor(65 + Math.random() * 20).toString(), // 65-85
                temperature: (97.5 + Math.random() * 1.5).toFixed(1), // 97.5-99.0
                weight: (65 + Math.random() * 10).toFixed(1) // 65-75
            });
        }

        return records;
    }

    // Bind event handlers
    bindEvents() {
        // Add record button
        const addRecordBtn = document.getElementById('addRecordBtn');
        if (addRecordBtn) {
            addRecordBtn.addEventListener('click', () => this.showAddRecordForm());
        }

        // Close modal button
        const closeModalBtn = document.querySelector('.modal .close');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.hideModal());
        }

        // Cancel button
        const cancelBtn = document.getElementById('cancelRecord');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideModal());
        }

        // Form submission
        if (this.recordForm) {
            this.recordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveRecord();
            });
        }

        // Search input
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => this.filterRecords());
        }

        // Record type filter
        if (this.recordTypeFilter) {
            this.recordTypeFilter.addEventListener('change', () => this.filterRecords());
        }
    }

    // Render all records
    renderRecords() {
        if (!this.recordsTable) return;

        // Clear the table
        this.recordsTable.innerHTML = '';

        // Add table headers
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>Date</th>
            <th>Type</th>
            <th>Blood Pressure</th>
            <th>Heart Rate</th>
            <th>Temperature</th>
            <th>Weight</th>
            <th>Age</th>
            <th>Actions</th>
        `;
        this.recordsTable.appendChild(headerRow);

        // Limit the number of records displayed to 10-20
        const limitedRecords = this.records.slice(0, 20);

        // Render each record
        limitedRecords.forEach(record => {
            this.recordsTable.appendChild(this.createRecordRow(record));
        });

        // Show a message if no records are available
        if (limitedRecords.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="8" class="empty-state">
                    <i class="fas fa-notes-medical"></i>
                    <p>No health records found. Add a new record to get started.</p>
                </td>
            `;
            this.recordsTable.appendChild(emptyRow);
        }
    }

    // Create a table row for a record
    createRecordRow(record) {
        const row = document.createElement('tr');

        // Format date
        const formattedDate = this.formatDisplayDate(record.date);

        // Use _id from MongoDB or fallback to id
        const recordId = record._id || record.id;

        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${record.recordType === 'routine' ? 'Routine Check' : 'Monthly Check'}</td>
            <td>${record.bloodPressure || '-'}</td>
            <td>${record.heartRate ? `${record.heartRate} BPM` : '-'}</td>
            <td>${record.temperature ? `${record.temperature} °F` : '-'}</td>
            <td>${record.weight ? `${record.weight} kg` : '-'}</td>
            <td>${record.age || '-'}</td>
            <td>
                <button class="btn btn-secondary btn-sm edit-record" data-id="${recordId}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm delete-record" data-id="${recordId}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        // Add event listeners to buttons
        const editBtn = row.querySelector('.edit-record');
        const deleteBtn = row.querySelector('.delete-record');

        editBtn.addEventListener('click', () => this.showEditRecordForm(recordId));
        deleteBtn.addEventListener('click', () => this.deleteRecord(recordId));

        return row;
    }

    // Format date for display
    formatDisplayDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    // Show form to add a new record
    async showAddRecordForm() {
        // Reset form
        this.recordForm.reset();
        this.recordIdInput.value = '';
        this.currentRecord = null;

        // Set current date
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        document.getElementById('recordDate').value = formattedDate;

        // Remove any existing symptom sections
        const existingSymptomSections = document.querySelectorAll('.symptoms-section');
        existingSymptomSections.forEach(section => section.remove());

        // Create symptoms section container
        const symptomsSection = document.createElement('div');
        symptomsSection.className = 'symptoms-section';
        symptomsSection.style.marginBottom = '20px';

        // Create symptom counter
        const symptomCounter = document.createElement('div');
        symptomCounter.className = 'symptom-counter';
        symptomCounter.innerHTML = `
            <span>Select symptoms (maximum 10):</span>
            <span id="symptomCounter">0/10 selected</span>
        `;
        symptomsSection.appendChild(symptomCounter);

        // Create symptom search box
        const symptomSearchBox = document.createElement('div');
        symptomSearchBox.className = 'symptom-search-box';
        symptomSearchBox.innerHTML = `
            <i class="fas fa-search"></i>
            <input type="text" id="symptomSearchInput" placeholder="Search symptoms...">
        `;
        symptomsSection.appendChild(symptomSearchBox);

        // Create scrollable container for symptoms
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'symptoms-scroll-container';
        scrollContainer.style.maxHeight = '400px';
        scrollContainer.style.overflowY = 'auto';
        scrollContainer.style.border = '1px solid #ddd';
        scrollContainer.style.borderRadius = '4px';
        scrollContainer.style.padding = '10px';
        scrollContainer.style.backgroundColor = '#fff';

        // Create a grid container for better alignment
        const gridContainer = document.createElement('div');
        gridContainer.className = 'symptom-grid';
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
        gridContainer.style.gap = '10px';

        // Fetch symptoms dynamically from dataService
        const symptoms = this.dataService.getSymptoms();

        // Add symptoms dynamically
        symptoms.forEach(symptom => {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'symptom-checkbox';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `symptom-${symptom.replace(/\s+/g, '_').toLowerCase()}`;
            checkbox.value = symptom;
            checkbox.className = 'symptom-select';

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = symptom;

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            gridContainer.appendChild(checkboxContainer);
        });

        scrollContainer.appendChild(gridContainer);
        symptomsSection.appendChild(scrollContainer);

        // Add symptoms section to form
        const form = document.getElementById('healthRecordForm');
        form.appendChild(symptomsSection);

        // Add event listener to update symptom counter
        const symptomCheckboxes = document.querySelectorAll('.symptom-select');
        const symptomCounterElement = document.getElementById('symptomCounter');

        symptomCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const selectedCount = document.querySelectorAll('.symptom-select:checked').length;
                symptomCounterElement.textContent = `${selectedCount}/10 selected`;
            });
        });

        // Ensure only one predict disease button exists
        const existingPredictButton = document.getElementById('predictDiseaseButton');
        if (existingPredictButton) {
            existingPredictButton.remove();
        }

        // Add predict disease button
        const predictButton = document.createElement('button');
        predictButton.type = 'button';
        predictButton.id = 'predictDiseaseButton';
        predictButton.className = 'btn btn-primary';
        predictButton.style.marginTop = '20px';
        predictButton.innerHTML = '<i class="fas fa-diagnoses"></i> Predict Disease';
        predictButton.addEventListener('click', async () => {
            // Ensure at least one symptom is selected before analyzing
            const selectedSymptoms = Array.from(document.querySelectorAll('.symptom-select:checked')).map(checkbox => checkbox.value);
            if (selectedSymptoms.length === 0) {
                this.showToast('Please select at least one symptom', 'error');
                return;
            }

            try {
                const prediction = await this.dataService.predictDisease(selectedSymptoms);

                // Display prediction result
                const resultContainer = document.createElement('div');
                resultContainer.className = 'prediction-result';
                resultContainer.style.marginTop = '20px';
                resultContainer.style.padding = '15px';
                resultContainer.style.border = '1px solid #ddd';
                resultContainer.style.borderRadius = '4px';
                resultContainer.style.backgroundColor = '#f8f9fa';

                resultContainer.innerHTML = `
                    <h3>Predicted Disease: ${prediction.disease}</h3>
                    <p>Confidence: ${Math.round(prediction.confidence * 100)}%</p>
                `;

                // Ensure precautions and diet recommendations are displayed in the prediction result
                const precautions = prediction.precautions || [];
                const dietRecommendations = prediction.diet || [];

                if (precautions.length > 0) {
                    resultContainer.innerHTML += `
                        <h4>Precautions:</h4>
                        <ul>${precautions.map(p => `<li>${p}</li>`).join('')}</ul>
                    `;
                } else {
                    resultContainer.innerHTML += `
                        <h4>Precautions:</h4>
                        <p>No specific precautions available.</p>
                    `;
                }

                if (dietRecommendations.length > 0) {
                    resultContainer.innerHTML += `
                        <h4>Diet Recommendations:</h4>
                        <ul>${dietRecommendations.map(diet => `<li>${diet}</li>`).join('')}</ul>
                    `;
                } else {
                    resultContainer.innerHTML += `
                        <h4>Diet Recommendations:</h4>
                        <p>No specific diet recommendations available.</p>
                    `;
                }

                // Remove existing result container if any
                const existingResultContainer = document.querySelector('.prediction-result');
                if (existingResultContainer) {
                    existingResultContainer.remove();
                }

                // Append result container to the form
                form.appendChild(resultContainer);
            } catch (error) {
                console.error('Error predicting disease:', error);
                this.showToast('Error predicting disease. Please try again.', 'error');
            }
        });

        // Append predict button to the form
        form.appendChild(predictButton);

        // Show modal
        this.recordFormModal.classList.remove('hidden');
    }

    // Show form to edit an existing record
    showEditRecordForm(recordId) {
        // Find record
        const record = this.records.find(r => (r._id === recordId || r.id === recordId));
        if (!record) {
            this.showToast('Record not found', 'error');
            return;
        }

        // Set current record
        this.currentRecord = record;

        // Fill form with record data
        this.recordIdInput.value = record._id || record.id;

        // Helper function to safely set input value
        const setInputValue = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = value || '';
            }
        };

        // Set form values
        setInputValue('recordDate', record.date);
        setInputValue('recordType', record.recordType);
        setInputValue('bloodPressureInput', record.bloodPressure);
        setInputValue('heartRateInput', record.heartRate);
        setInputValue('temperatureInput', record.temperature);
        setInputValue('weightInput', record.weight);
        setInputValue('symptomsInput', record.symptoms || '');
        setInputValue('notesInput', record.notes || '');

        // Set form title
        this.recordFormTitle.textContent = 'Edit Health Record';

        // Show modal
        this.recordFormModal.classList.remove('hidden');
    }

    // Hide modal
    hideModal() {
        this.recordFormModal.classList.add('hidden');
    }

    // Save record
    async saveRecord() {
        try {
            // Get form data
            const formData = {
                date: document.getElementById('recordDate').value,
                age: document.getElementById('ageInput').value,
                recordType: document.getElementById('recordType').value,
                bloodPressure: document.getElementById('bloodPressureInput').value,
                heartRate: document.getElementById('heartRateInput').value,
                temperature: document.getElementById('temperatureInput').value,
                weight: document.getElementById('weightInput').value,
                symptoms: Array.from(document.querySelectorAll('.symptom-select:checked')).map(checkbox => checkbox.value),
                predictedDisease: null,
                dietRecommendations: []
            };

            // Validate required fields
            if (!formData.date || !formData.age || !formData.bloodPressure || !formData.heartRate ||
                !formData.temperature || !formData.weight) {
                throw new Error('Please fill all required fields');
            }

            let message = '';

            // Editing existing record
            if (this.recordIdInput.value) {
                const recordIndex = this.records.findIndex(r => r.id === this.recordIdInput.value);
                if (recordIndex !== -1) {
                    // Update existing record
                    this.records[recordIndex] = {
                        ...this.records[recordIndex],
                        ...formData
                    };
                    message = 'Record updated successfully';
                }
            } else {
                // Add new record with a unique ID
                const newRecord = {
                    id: `record-${Date.now()}`,
                    ...formData
                };
                this.records.unshift(newRecord); // Add to the top of the list
                message = 'Record added successfully';
            }

            // Keep only the latest 10 records
            this.records = this.records.slice(0, 10);

            // Save to localStorage
            this.saveDataToLocalStorage();

            // Hide modal
            this.hideModal();

            // Re-render records
            this.renderRecords();

            // Show success message only once
            if (message) {
                this.showToast(message, 'success');
            }
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    // Delete record
    async deleteRecord(recordId) {
        try {
            // Remove the record from the records array
            this.records = this.records.filter(record => record.id !== recordId);

            // Save the updated records to localStorage
            this.saveDataToLocalStorage();

            // Re-render the records table
            this.renderRecords();

            // Show success message
            this.showToast('Record deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting record:', error);
            this.showToast('Error deleting record. Please try again.', 'error');
        }
    }

    // Filter records based on search and type
    filterRecords() {
        if (!this.recordsTable) return;

        const searchTerm = this.searchInput.value.toLowerCase();
        const recordType = this.recordTypeFilter.value;

        // Filter records
        let filteredRecords = this.records;

        // Filter by type
        if (recordType !== 'all') {
            filteredRecords = filteredRecords.filter(r => r.recordType === recordType);
        }

        // Filter by search term
        if (searchTerm) {
            filteredRecords = filteredRecords.filter(r => {
                return (
                    r.date.includes(searchTerm) ||
                    r.recordType.includes(searchTerm) ||
                    r.bloodPressure.toString().includes(searchTerm) ||
                    r.heartRate.toString().includes(searchTerm) ||
                    r.temperature.toString().includes(searchTerm) ||
                    r.weight.toString().includes(searchTerm) ||
                    (r.symptoms && r.symptoms.toLowerCase().includes(searchTerm)) ||
                    (r.notes && r.notes.toLowerCase().includes(searchTerm))
                );
            });
        }

        // Clear table
        this.recordsTable.innerHTML = '';

        // Sort records by date (newest first)
        const sortedRecords = [...filteredRecords].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        // Render filtered records
        sortedRecords.forEach(record => {
            this.recordsTable.appendChild(this.createRecordRow(record));
        });

        // Show message if no records
        if (sortedRecords.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="8" class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>No records found matching your search criteria.</p>
                </td>
            `;
            this.recordsTable.appendChild(emptyRow);
        }
    }

    // Update recent checkups on dashboard
    updateRecentCheckups(records) {
        const recentCheckups = document.getElementById('recentCheckups');
        if (!recentCheckups) return;

        // Clear container
        recentCheckups.innerHTML = '';

        // Add records
        records.forEach(record => {
            const recordDate = new Date(record.date);
            const formattedDate = recordDate.toLocaleDateString();

            const checkupItem = document.createElement('div');
            checkupItem.className = 'checkup-item';
            checkupItem.innerHTML = `
                <div class="checkup-date">
                    <span class="day">${recordDate.getDate()}</span>
                    <span class="month">${recordDate.toLocaleString('default', { month: 'short' })}</span>
                </div>
                <div class="checkup-details">
                    <h4>${record.recordType === 'routine' ? 'Routine Check' : 'Monthly Check'}</h4>
                    <p>BP: ${record.bloodPressure} | HR: ${record.heartRate} BPM</p>
                </div>
            `;
            recentCheckups.appendChild(checkupItem);
        });

        // Show message if no records
        if (records.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <i class="fas fa-calendar-check"></i>
                <p>No recent check-ups found.</p>
            `;
            recentCheckups.appendChild(emptyState);
        }
    }

    // Show toast message
    showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            toastContainer.style.position = 'fixed';
            toastContainer.style.top = '20px';
            toastContainer.style.right = '20px';
            toastContainer.style.zIndex = '1000';
            document.body.appendChild(toastContainer);
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.backgroundColor = type === 'error' ? '#dc3545' : '#28a745';
        toast.style.color = 'white';
        toast.style.padding = '15px 20px';
        toast.style.borderRadius = '4px';
        toast.style.marginBottom = '10px';
        toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.justifyContent = 'space-between';
        toast.style.minWidth = '300px';

        // Add message
        const messageSpan = document.createElement('span');
        messageSpan.textContent = message;
        toast.appendChild(messageSpan);

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.color = 'white';
        closeButton.style.fontSize = '20px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '0 5px';
        closeButton.onclick = () => toast.remove();
        toast.appendChild(closeButton);

        // Add to container
        toastContainer.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Render symptom checkboxes with improved UI
    renderSymptomCheckboxes() {
        const container = document.getElementById('symptomCheckboxes');
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        // Create a scrollable container for symptoms
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'symptom-scroll-container';
        scrollContainer.style.maxHeight = '300px';
        scrollContainer.style.overflowY = 'auto';
        scrollContainer.style.padding = '10px';
        scrollContainer.style.border = '1px solid #ddd';
        scrollContainer.style.borderRadius = '4px';
        scrollContainer.style.backgroundColor = '#f9f9f9';

        // Create a grid container for better alignment
        const gridContainer = document.createElement('div');
        gridContainer.className = 'symptom-grid';
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
        gridContainer.style.gap = '10px';
        gridContainer.style.padding = '5px';

        // Add search input
        const searchContainer = document.createElement('div');
        searchContainer.style.marginBottom = '10px';
        searchContainer.style.position = 'sticky';
        searchContainer.style.top = '0';
        searchContainer.style.backgroundColor = '#f9f9f9';
        searchContainer.style.padding = '5px';
        searchContainer.style.zIndex = '1';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search symptoms...';
        searchInput.className = 'form-control';
        searchInput.style.marginBottom = '10px';
        searchInput.addEventListener('input', (e) => this.filterSymptoms(e.target.value));

        searchContainer.appendChild(searchInput);
        scrollContainer.appendChild(searchContainer);
        scrollContainer.appendChild(gridContainer);
        container.appendChild(scrollContainer);

        // Add symptoms to grid
        this.filteredSymptoms.forEach(symptom => {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'symptom-checkbox-container';
            checkboxContainer.style.display = 'flex';
            checkboxContainer.style.alignItems = 'center';
            checkboxContainer.style.padding = '5px';
            checkboxContainer.style.borderRadius = '4px';
            checkboxContainer.style.backgroundColor = '#fff';
            checkboxContainer.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `symptom-${symptom}`;
            checkbox.value = symptom;
            checkbox.className = 'form-check-input';
            checkbox.style.marginRight = '8px';

            const label = document.createElement('label');
            label.htmlFor = `symptom-${symptom}`;
            label.textContent = symptom;
            label.className = 'form-check-label';
            label.style.flex = '1';
            label.style.cursor = 'pointer';
            label.style.userSelect = 'none';

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            gridContainer.appendChild(checkboxContainer);

            // Add event listener
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    this.selectedSymptoms.add(symptom);
                } else {
                    this.selectedSymptoms.delete(symptom);
                }
                this.updateSelectedSymptomsDisplay();
            });
        });

        // Add CSS for scrollbar styling
        const style = document.createElement('style');
        style.textContent = `
            .symptom-scroll-container::-webkit-scrollbar {
                width: 8px;
            }
            .symptom-scroll-container::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
            }
            .symptom-scroll-container::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 4px;
            }
            .symptom-scroll-container::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
            .symptom-checkbox-container:hover {
                background-color: #f0f0f0;
            }
        `;
        document.head.appendChild(style);
    }

    // Filter symptoms based on search input
    filterSymptoms(searchTerm) {
        this.filteredSymptoms = this.symptoms.filter(symptom =>
            symptom.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderSymptomCheckboxes();
    }

    // Update the display of selected symptoms
    updateSelectedSymptomsDisplay() {
        const container = document.getElementById('selectedSymptoms');
        if (!container) return;

        container.innerHTML = '';

        if (this.selectedSymptoms.size === 0) {
            container.textContent = 'No symptoms selected';
            container.style.color = '#6c757d';
            container.style.fontStyle = 'italic';
            return;
        }

        const selectedContainer = document.createElement('div');
        selectedContainer.className = 'selected-symptoms-container';
        selectedContainer.style.display = 'flex';
        selectedContainer.style.flexWrap = 'wrap';
        selectedContainer.style.gap = '8px';
        selectedContainer.style.marginTop = '10px';

        this.selectedSymptoms.forEach(symptom => {
            const badge = document.createElement('span');
            badge.className = 'badge bg-primary';
            badge.style.padding = '5px 10px';
            badge.style.borderRadius = '15px';
            badge.style.display = 'flex';
            badge.style.alignItems = 'center';
            badge.style.gap = '5px';

            const text = document.createElement('span');
            text.textContent = symptom;

            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '&times;';
            removeBtn.className = 'btn-close btn-close-white';
            removeBtn.style.marginLeft = '5px';
            removeBtn.style.fontSize = '12px';
            removeBtn.style.padding = '0';
            removeBtn.style.backgroundColor = 'transparent';
            removeBtn.style.border = 'none';
            removeBtn.style.cursor = 'pointer';
            removeBtn.onclick = () => {
                this.selectedSymptoms.delete(symptom);
                const checkbox = document.getElementById(`symptom-${symptom}`);
                if (checkbox) checkbox.checked = false;
                this.updateSelectedSymptomsDisplay();
            };

            badge.appendChild(text);
            badge.appendChild(removeBtn);
            selectedContainer.appendChild(badge);
        });

        container.appendChild(selectedContainer);
    }

    // Export health data to JSON file
    exportHealthData() {
        try {
            // Get the logged-in user from auth service
            const loggedInUser = window.auth ? window.auth.getCurrentUser() : null;

            // Prepare export data
            const exportData = {
                user: {
                    username: loggedInUser ? loggedInUser.username : 'Guest User',
                    email: loggedInUser ? loggedInUser.email : 'Not logged in',
                    lastLogin: loggedInUser ? loggedInUser.lastLogin : 'Not logged in'
                },
                healthRecords: this.records,
                exportDate: new Date().toISOString(),
                totalRecords: this.records.length,
                metrics: {
                    averageHeartRate: this.calculateAverage('heartRate'),
                    averageBloodPressure: this.calculateAverage('bloodPressure'),
                    averageTemperature: this.calculateAverage('temperature'),
                    averageWeight: this.calculateAverage('weight')
                },
                commonSymptoms: this.getCommonSymptoms(),
                recentDiseases: this.getRecentDiseases()
            };

            // Convert to JSON string with proper formatting
            const jsonString = JSON.stringify(exportData, null, 2);

            // Create blob and download link
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `health_data_${loggedInUser ? loggedInUser.username : 'guest'}_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Show success message
            this.showToast('Health data exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting health data:', error);
            this.showToast('Error exporting health data. Please try again.', 'error');
        }
    }

    // Helper method to get common symptoms
    getCommonSymptoms() {
        const symptomCounts = {};
        this.records.forEach(record => {
            if (record.symptoms) {
                const symptoms = Array.isArray(record.symptoms) ? record.symptoms : [record.symptoms];
                symptoms.forEach(symptom => {
                    if (symptom) {
                        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
                    }
                });
            }
        });

        return Object.entries(symptomCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([symptom, count]) => ({ symptom, count }));
    }

    // Helper method to get recent diseases
    getRecentDiseases() {
        const diseaseCounts = {};
        this.records.forEach(record => {
            if (record.disease) {
                diseaseCounts[record.disease] = (diseaseCounts[record.disease] || 0) + 1;
            }
        });

        return Object.entries(diseaseCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([disease, count]) => ({ disease, count }));
    }

    // Helper method to calculate average for a metric
    calculateAverage(metric) {
        const values = this.records
            .map(record => {
                if (metric === 'bloodPressure') {
                    const [systolic, diastolic] = record[metric].split('/').map(Number);
                    return { systolic, diastolic };
                }
                return parseFloat(record[metric]);
            })
            .filter(value => !isNaN(value));

        if (values.length === 0) return 'N/A';

        if (metric === 'bloodPressure') {
            const avgSystolic = values.reduce((sum, val) => sum + val.systolic, 0) / values.length;
            const avgDiastolic = values.reduce((sum, val) => sum + val.diastolic, 0) / values.length;
            return `${Math.round(avgSystolic)}/${Math.round(avgDiastolic)}`;
        }

        const average = values.reduce((sum, val) => sum + val, 0) / values.length;
        return metric === 'temperature' ? average.toFixed(1) : Math.round(average);
    }

    generateHealthInsights() {
        const insights = [];
        const metrics = this.calculateHealthMetrics();

        // Heart Rate Insights
        if (metrics.avgHeartRate > 100) {
            insights.push({
                type: 'warning',
                title: 'Elevated Heart Rate',
                description: `Your average heart rate of ${metrics.avgHeartRate.toFixed(0)} BPM is above the normal range.`,
                recommendation: 'Consider consulting a healthcare provider and practicing stress-reduction techniques.'
            });
        } else if (metrics.avgHeartRate < 60) {
            insights.push({
                type: 'warning',
                title: 'Low Heart Rate',
                description: `Your average heart rate of ${metrics.avgHeartRate.toFixed(0)} BPM is below the normal range.`,
                recommendation: 'Ensure you are eating well and consult a healthcare provider if symptoms persist.'
            });
        } else {
            insights.push({
                type: 'success',
                title: 'Healthy Heart Rate',
                description: `Your average heart rate of ${metrics.avgHeartRate.toFixed(0)} BPM is within the normal range.`,
                recommendation: 'Maintain regular exercise and a healthy lifestyle.'
            });
        }

        // Weight Insights
        if (metrics.weightTrend.change > 2) {
            insights.push({
                type: 'warning',
                title: 'Significant Weight Gain',
                description: `Your weight has increased by ${metrics.weightTrend.change.toFixed(1)} kg over the last ${metrics.weightTrend.days} days.`,
                recommendation: 'Consider reviewing your diet and exercise routine.'
            });
        } else if (metrics.weightTrend.change < -2) {
            insights.push({
                type: 'warning',
                title: 'Significant Weight Loss',
                description: `Your weight has decreased by ${Math.abs(metrics.weightTrend.change).toFixed(1)} kg over the last ${metrics.weightTrend.days} days.`,
                recommendation: "Ensure you're maintaining a balanced diet and consult a healthcare provider if unintended."
            });
        } else {
            insights.push({
                type: 'success',
                title: 'Stable Weight',
                description: 'Your weight has remained stable over the recorded period.',
                recommendation: 'Continue maintaining a healthy lifestyle.'
            });
        }

        return insights;
    }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance
    window.healthRecords = new HealthRecords();
});