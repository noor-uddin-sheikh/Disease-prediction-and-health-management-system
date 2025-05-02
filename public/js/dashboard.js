// Dashboard Module - Using sample data instead of MongoDB backend
class Dashboard {
    constructor() {
        this.userDisplayName = document.getElementById('userDisplayName');
        this.currentRecord = null;
        this.healthRecords = new HealthRecords();
        this.dataService = new DataService();
        this.healthRecords.loadRecordsFromStorage();
        this.initializeDashboard();
        this.healthChart = null;
        this.user = null;
        this.healthStats = {
            totalRecords: 0,
            averageBP: { systolic: 0, diastolic: 0 },
            averageHR: 0,
            averageTemp: 0,
            averageWeight: 0,
            commonSymptoms: [],
            healthTrends: {
                bpTrend: 'stable',
                hrTrend: 'stable',
                weightTrend: 'stable'
            }
        };
        this.dataService = new DataService();
        // DOM elements
        this.userDisplayName = document.getElementById('userDisplayName');
        this.currentDateElem = document.getElementById('currentDate');
        this.heartRateElem = document.getElementById('heartRate');
        this.weightElem = document.getElementById('weight');
        this.temperatureElem = document.getElementById('temperature');
        this.bloodPressureElem = document.getElementById('bloodPressure');
        this.recentCheckupsElem = document.getElementById('recentCheckups');
        this.healthOverview = document.getElementById('healthOverview');
        this.healthInsights = document.getElementById('healthInsights');
        // Initialize current date display
        this.updateCurrentDate();
    }

    async initializeDashboard() {
        this.healthRecords = new HealthRecords();
        await this.healthRecords.loadRecordsFromStorage();
        try {
            // Update the Health Overview section after loading records
            this.updateHealthOverview();
        } catch (error) {
            console.error('Error initializing dashboard:', error);
        }
    }

    updateHealthMetrics() {
        const records = this.healthRecords.records;
        if (!records || records.length === 0) {
            this.showNoDataMessage();
            return;
        }

        // Calculate averages
        const metrics = this.calculateHealthMetrics(records);

        // Update metrics display with null checks
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        };

        // Update each metric if the element exists
        updateElement('avgHeartRate', metrics.avgHeartRate.toFixed(0));
        updateElement('avgWeight', metrics.avgWeight.toFixed(1));
        updateElement('avgTemperature', metrics.avgTemperature.toFixed(1));
        updateElement('avgBloodPressure', metrics.avgBloodPressure);
    }

    calculateHealthMetrics(records) {
        const metrics = {
            avgHeartRate: 0,
            avgBloodPressure: 'N/A',
            avgTemperature: 0,
            avgWeight: 0
        };

        if (records.length === 0) return metrics;

        // Calculate averages
        let heartRateSum = 0;
        let temperatureSum = 0;
        let weightSum = 0;
        let bloodPressureCount = 0;
        let systolicSum = 0;
        let diastolicSum = 0;

        records.forEach(record => {
            if (record.heartRate) {
                heartRateSum += parseFloat(record.heartRate);
            }
            if (record.temperature) {
                temperatureSum += parseFloat(record.temperature);
            }
            if (record.weight) {
                weightSum += parseFloat(record.weight);
            }
            if (record.bloodPressure) {
                const [systolic, diastolic] = record.bloodPressure.split('/').map(Number);
                if (!isNaN(systolic) && !isNaN(diastolic)) {
                    systolicSum += systolic;
                    diastolicSum += diastolic;
                    bloodPressureCount++;
                }
            }
        });

        // Calculate averages
        metrics.avgHeartRate = heartRateSum / records.length;
        metrics.avgTemperature = temperatureSum / records.length;
        metrics.avgWeight = weightSum / records.length;

        if (bloodPressureCount > 0) {
            metrics.avgBloodPressure = `${Math.round(systolicSum / bloodPressureCount)}/${Math.round(diastolicSum / bloodPressureCount)}`;
        }

        return metrics;
    }

    updateHealthOverview() {
        const records = this.healthRecords?.records || [];
        const healthOverviewContainer = document.getElementById('health-overview');
        const healthInsightsContainer = document.getElementById('healthInsightsOverview');

        if (!healthOverviewContainer) {
            console.error('Health overview container not found');
            return;
        }

        if (!healthInsightsContainer) {
            console.error('Health insights overview container not found');
            return;
        }

        if (records.length === 0) {
            healthOverviewContainer.innerHTML = '<p class="no-data-message">No health records available for analysis</p>';
            healthInsightsContainer.innerHTML = '';
            return;
        }

        // Calculate health metrics
        const metrics = this.calculateHealthMetrics(records);

        // Create health overview HTML
        const healthOverviewHTML = `
            <h2>Health Overview</h2>
            <p id="heartRate">Heart Rate: ${metrics.avgHeartRate.toFixed(0)} BPM</p>
            <p id="weight">Weight: ${metrics.avgWeight.toFixed(1)} kg</p>
            <p id="temperature">Temperature: ${metrics.avgTemperature.toFixed(1)}°C</p>
            <p id="bloodPressure">Blood Pressure: ${metrics.avgBloodPressure}</p>
        `;

        healthOverviewContainer.innerHTML = healthOverviewHTML;

        // 👉 NEW: Generate and display insights
        this.updateHealthInsightsOverview(records);
    }

    updateHealthInsightsOverview(records) {
        const insightsContainer = document.getElementById('healthInsightsOverview');
        if (!insightsContainer) return;

        const insights = this.generateHealthInsights(records);

        if (insights.length === 0) {
            insightsContainer.innerHTML = `<p class="no-data-message">No insights available</p>`;
            return;
        }

        const insightsHTML = insights.map(insight => `
            <div class="insight-card ${insight.type}">
                <div class="insight-icon"><i class="fas ${insight.icon}"></i></div>
                <div class="insight-content">
                    <h4>${insight.title}</h4>
                    <p>${insight.description}</p>
                    <p class="recommendation">${insight.recommendation}</p>
                </div>
            </div>
        `).join('');

        insightsContainer.innerHTML = `
            <div class="insights-overview-list">
                ${insightsHTML}
            </div>
        `;
    }

    updateHealthInsights() {
        const insightsContainer = document.getElementById('healthInsights');
        if (!insightsContainer) {
            console.error('Health insights container not found');
            return;
        }

        const insights = window.healthRecords.generateHealthInsights();

        if (insights.length === 0) {
            insightsContainer.innerHTML = '<p class="no-data-message">No health insights available</p>';
            return;
        }

        const insightsHTML = insights.map(insight => `
            <div class="insight-card ${insight.type}">
                <h4>${insight.title}</h4>
                <p>${insight.description}</p>
                <p class="recommendation">${insight.recommendation}</p>
            </div>
        `).join('');

        insightsContainer.innerHTML = `<div class="insights-list">${insightsHTML}</div>`;
    }

    updateRecentRecords() {
        const records = this.healthRecords.records || [];
        const recentRecords = records.slice(-5).reverse(); // Get last 5 records, newest first
        const recentRecordsContainer = document.getElementById('recent-records');

        if (!recentRecordsContainer) return;

        if (recentRecords.length === 0) {
            recentRecordsContainer.innerHTML = '<p class="no-data-message">No recent health records available</p>';
            return;
        }

        const recordsHTML = recentRecords.map(record => `
            <div class="record-card">
                <div class="record-header">
                    <h3>${new Date(record.date).toLocaleDateString()}</h3>
                    <span class="record-time">${new Date(record.date).toLocaleTimeString()}</span>
                </div>
                <div class="record-metrics">
                    <div class="metric">
                        <span class="metric-label">Heart Rate:</span>
                        <span class="metric-value">${record.heartRate || 'N/A'} bpm</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Weight:</span>
                        <span class="metric-value">${record.weight || 'N/A'} kg</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Temperature:</span>
                        <span class="metric-value">${record.temperature || 'N/A'}°C</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Blood Pressure:</span>
                        <span class="metric-value">${record.bloodPressure || 'N/A'}</span>
                    </div>
                </div>
                ${record.symptoms && record.symptoms.length > 0 ? `
                    <div class="record-symptoms">
                        <span class="symptoms-label">Symptoms:</span>
                        <span class="symptoms-value">${Array.isArray(record.symptoms) ? record.symptoms.join(', ') : record.symptoms}</span>
                    </div>
                ` : ''}
                ${record.notes ? `
                    <div class="record-notes">
                        <span class="notes-label">Notes:</span>
                        <span class="notes-value">${record.notes}</span>
                    </div>
                ` : ''}
            </div>
        `).join('');

        recentRecordsContainer.innerHTML = `
            <div class="recent-records-header">
                <h3>Recent Health Records</h3>
                <span class="records-count">Showing ${recentRecords.length} of ${records.length} records</span>
            </div>
            <div class="records-list">
                ${recordsHTML}
            </div>
        `;
    }

    generateHealthInsights(records) {
        const metrics = this.calculateHealthMetrics(records);
        const insights = [];

        // Heart Rate Insights
        if (metrics.avgHeartRate > 0) {
            if (metrics.avgHeartRate > 100) {
                insights.push({
                    type: 'warning',
                    icon: 'fa-heartbeat',
                    title: 'Elevated Heart Rate',
                    description: `Your average heart rate of ${metrics.avgHeartRate.toFixed(0)} BPM is above the normal range.`,
                    recommendation: 'Consider consulting a healthcare provider and practicing stress-reduction techniques.'
                });
            } else if (metrics.avgHeartRate < 60) {
                insights.push({
                    type: 'warning',
                    icon: 'fa-heartbeat',
                    title: 'Low Heart Rate',
                    description: `Your average heart rate of ${metrics.avgHeartRate.toFixed(0)} BPM is below the normal range.`,
                    recommendation: 'Ensure you are eating well and consult a healthcare provider if symptoms persist.'
                });
            } else {
                insights.push({
                    type: 'success',
                    icon: 'fa-heartbeat',
                    title: 'Healthy Heart Rate',
                    description: `Your average heart rate of ${metrics.avgHeartRate.toFixed(0)} BPM is within the normal range.`,
                    recommendation: 'Maintain regular exercise and a healthy lifestyle.'
                });
            }
        }

        // Blood Pressure Insights
        if (metrics.avgBloodPressure !== 'N/A') {
            const [systolic, diastolic] = metrics.avgBloodPressure.split('/').map(Number);
            if (systolic > 140 || diastolic > 90) {
                insights.push({
                    type: 'warning',
                    icon: 'fa-tint',
                    title: 'High Blood Pressure',
                    description: `Your average blood pressure of ${metrics.avgBloodPressure} is above the normal range.`,
                    recommendation: 'Consider reducing salt intake and consulting a healthcare provider.'
                });
            } else if (systolic < 90 || diastolic < 60) {
                insights.push({
                    type: 'warning',
                    icon: 'fa-tint',
                    title: 'Low Blood Pressure',
                    description: `Your average blood pressure of ${metrics.avgBloodPressure} is below the normal range.`,
                    recommendation: 'Stay hydrated and consult a healthcare provider if symptoms persist.'
                });
            } else {
                insights.push({
                    type: 'success',
                    icon: 'fa-tint',
                    title: 'Healthy Blood Pressure',
                    description: `Your average blood pressure of ${metrics.avgBloodPressure} is within the normal range.`,
                    recommendation: 'Maintain a balanced diet and regular exercise.'
                });
            }
        }

        // Weight Trends
        if (records.length > 1) {
            const weightTrend = this.calculateWeightTrend(records);
            if (weightTrend.change > 2) {
                insights.push({
                    type: 'warning',
                    icon: 'fa-weight',
                    title: 'Significant Weight Gain',
                    description: `Your weight has increased by ${weightTrend.change.toFixed(1)} kg over the last ${weightTrend.days} days.`,
                    recommendation: 'Consider reviewing your diet and exercise routine.'
                });
            } else if (weightTrend.change < -2) {
                insights.push({
                    type: 'warning',
                    icon: 'fa-weight',
                    title: 'Significant Weight Loss',
                    description: `Your weight has decreased by ${Math.abs(weightTrend.change).toFixed(1)} kg over the last ${weightTrend.days} days.`,
                    recommendation: "Ensure you're maintaining a balanced diet and consult a healthcare provider if unintended."
                });
            } else {
                insights.push({
                    type: 'success',
                    icon: 'fa-weight',
                    title: 'Stable Weight',
                    description: 'Your weight has remained stable over the recorded period.',
                    recommendation: 'Continue maintaining a healthy lifestyle.'
                });
            }
        }

        return insights;
    }

    calculateWeightTrend(records) {
        const sortedRecords = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
        const firstRecord = sortedRecords[0];
        const lastRecord = sortedRecords[sortedRecords.length - 1];
        const days = Math.ceil((new Date(lastRecord.date) - new Date(firstRecord.date)) / (1000 * 60 * 60 * 24));
        const change = parseFloat(lastRecord.weight) - parseFloat(firstRecord.weight);

        return { change, days };
    }

    calculateCheckupFrequency(records) {
        const sortedRecords = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
        const firstDate = new Date(sortedRecords[0].date);
        const lastDate = new Date(sortedRecords[sortedRecords.length - 1].date);
        const days = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24));

        let recommendation = '';
        if (days > 30) {
            recommendation = 'Consider more frequent health check-ups for better monitoring.';
        } else if (days < 7) {
            recommendation = 'You are monitoring your health frequently. Keep up the good work!';
        } else {
            recommendation = 'Your check-up frequency is appropriate. Continue regular monitoring.';
        }

        return { days, recommendation };
    }

    getCommonSymptoms(records) {
        const symptomCounts = {};
        records.forEach(record => {
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
            .slice(0, 3)
            .map(([symptom]) => symptom);
    }

    showNoDataMessage() {
        const insightsContainer = document.getElementById('healthInsights');
        insightsContainer.innerHTML = `
            <div class="no-data-message">
                <i class="fas fa-info-circle"></i>
                <p>No health records available. Add some records to see personalized insights.</p>
            </div>
        `;
    }

    async init(user) {
        if (!user) return;

        this.user = user;
        this.healthRecords = new HealthRecords();
        this.dataService = new DataService();

        // Load records from storage
        await this.healthRecords.loadRecordsFromStorage();

        // Initialize dashboard components
        this.initializeDashboard();

        // Update user info immediately
        this.updateUserInfo();

        // Set up periodic updates
        setInterval(() => {
            this.updateCurrentDate();
            this.updateUserInfo();
        }, 60000); // Update every minute
    }

    generateSampleRecords() {
        const today = new Date();
        const records = [];

        // Generate 10 records over the past 2 months
        for (let i = 0; i < 10; i++) {
            const recordDate = new Date();
            recordDate.setDate(today.getDate() - (i * 6)); // Every 6 days
            records.push({
                date: recordDate.toISOString().split('T')[0],
                recordType: i % 2 === 0 ? 'routine' : 'monthly',
                heartRate: Math.floor(65 + Math.random() * 20).toString(), // 65-85
                bloodPressure: `${Math.floor(110 + Math.random() * 20)}/${Math.floor(70 + Math.random() * 15)}`, // 110-130/70-85
                temperature: (97.5 + Math.random() * 1.5).toFixed(1), // 97.5-99.0
                weight: (65 + Math.random() * 10).toFixed(1), // 65-75
                symptoms: i % 3 === 0 ? 'Mild headache' : '',
                notes: i % 4 === 0 ? 'Regular checkup' : ''
            });
        }

        return records;
    }

    updateUserInfo() {
        if (!this.userDisplayName) {
            console.error('User display name element not found');
            return;
        }

        // Get the logged-in user from auth service
        const loggedInUser = window.auth ? window.auth.getCurrentUser() : null;
        const displayName = this.user && this.user.username ? this.user.username : 'Guest User';
        console.log('Setting display name to:', displayName);
        this.userDisplayName.textContent = displayName;
    }

    updateCurrentDate() {
        if (!this.currentDateElem) return;

        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        this.currentDateElem.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new Dashboard();
    dashboard.init();
});