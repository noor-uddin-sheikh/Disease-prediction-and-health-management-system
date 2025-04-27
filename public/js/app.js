// Main Application Module
class App {
    constructor() {
        // State
        this.currentSection = 'dashboard';

        // DOM elements
        this.mainContainer = document.getElementById('mainContainer');
        this.loginContainer = document.getElementById('loginContainer');
        this.registerContainer = document.getElementById('registerContainer');
        this.dashboardContainer = document.getElementById('dashboardContainer');

        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.showRegisterLink = document.getElementById('showRegister');
        this.showLoginLink = document.getElementById('showLogin');
        this.logoutBtn = document.getElementById('logoutBtn');

        this.navLinks = document.querySelectorAll('.nav-links a[data-section]');
        this.contentSections = document.querySelectorAll('.content-section');

        // Initialize form validation
        this.addFormValidation();

        // Bind event handlers
        this.bindEvents();

        // Check login status and initialize
        this.init();
    }

    // Initialize application
    init() {
        // Check if user is authenticated
        if (auth.isLoggedIn) {
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    // Bind event handlers
    bindEvents() {
        // Login form submission
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register form submission
        if (this.registerForm) {
            this.registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Show register form link
        if (this.showRegisterLink) {
            this.showRegisterLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleAuthForms();
            });
        }

        // Show login form link
        if (this.showLoginLink) {
            this.showLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleAuthForms();
            });
        }

        // Logout button
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Emergency login buttons (for development)
        const createTestUserBtn = document.getElementById('createTestUserBtn');
        if (createTestUserBtn) {
            createTestUserBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    const result = await auth.createTestUser();
                    this.showToast(`Test user created/verified: ${result.username}`, 'success');
                } catch (error) {
                    console.error('Create test user error:', error);
                    this.showToast(error.message, 'error');
                }
            });
        }

        const emergencyLoginBtn = document.getElementById('emergencyLoginBtn');
        if (emergencyLoginBtn) {
            emergencyLoginBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    await auth.emergencyLogin();
                    this.showDashboard();
                    this.showToast('Emergency login successful', 'success');
                } catch (error) {
                    console.error('Emergency login error:', error);
                    this.showToast(error.message, 'error');
                }
            });
        }

        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.navigateTo(section);
            });
        });

        // Profile form submission
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProfile();
            });
        }

        // Change password form submission
        const changePasswordForm = document.getElementById('changePasswordForm');
        if (changePasswordForm) {
            changePasswordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.changePassword();
            });
        }

        // Delete account button
        const deleteAccountBtn = document.getElementById('deleteAccountBtn');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => this.confirmDeleteAccount());
        }

        // Export data button
        const exportDataBtn = document.getElementById('exportDataBtn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => this.exportUserData());
        }
    }

    // Add form validation
    addFormValidation() {
        // Login form validation
        if (this.loginForm) {
            const usernameInput = this.loginForm.querySelector('#username');
            const passwordInput = this.loginForm.querySelector('#password');

            usernameInput.addEventListener('input', () => {
                usernameInput.setCustomValidity('');
                usernameInput.checkValidity();
            });

            passwordInput.addEventListener('input', () => {
                passwordInput.setCustomValidity('');
                passwordInput.checkValidity();
            });
        }

        // Register form validation
        if (this.registerForm) {
            const usernameInput = this.registerForm.querySelector('#newUsername');
            const emailInput = this.registerForm.querySelector('#email');
            const passwordInput = this.registerForm.querySelector('#newPassword');
            const confirmPasswordInput = this.registerForm.querySelector('#confirmPassword');

            usernameInput.addEventListener('input', () => {
                usernameInput.setCustomValidity('');
                usernameInput.checkValidity();
            });

            emailInput.addEventListener('input', () => {
                emailInput.setCustomValidity('');
                emailInput.checkValidity();
            });

            passwordInput.addEventListener('input', () => {
                passwordInput.setCustomValidity('');

                // Check if passwords match when both have values
                if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
                    confirmPasswordInput.setCustomValidity('Passwords do not match');
                } else {
                    confirmPasswordInput.setCustomValidity('');
                }

                passwordInput.checkValidity();
                confirmPasswordInput.checkValidity();
            });

            confirmPasswordInput.addEventListener('input', () => {
                if (passwordInput.value !== confirmPasswordInput.value) {
                    confirmPasswordInput.setCustomValidity('Passwords do not match');
                } else {
                    confirmPasswordInput.setCustomValidity('');
                }
                confirmPasswordInput.checkValidity();
            });
        }
    }

    // Handle login form submission
    async handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            // Attempt login - auth.login returns a Promise, so we need to await it
            const user = await auth.login(username, password);

            // Show dashboard if successful
            this.showDashboard();

            // Show success message
            this.showToast('Login successful', 'success');
        } catch (error) {
            console.error('Login error:', error);

            // Show error message
            this.showToast(error.message, 'error');

            // Set validation messages
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            if (error.message === 'User not found') {
                usernameInput.setCustomValidity('Username not found');
                usernameInput.reportValidity();
            } else if (error.message === 'Incorrect password') {
                passwordInput.setCustomValidity('Incorrect password');
                passwordInput.reportValidity();
            }
        }
    }

    // Handle register form submission
    async handleRegister() {
        const username = document.getElementById('newUsername').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Check if passwords match
        if (password !== confirmPassword) {
            const confirmPasswordInput = document.getElementById('confirmPassword');
            confirmPasswordInput.setCustomValidity('Passwords do not match');
            confirmPasswordInput.reportValidity();
            return;
        }

        try {
            // Attempt registration
            const user = await auth.register(username, email, password);

            // Login the user
            await auth.login(username, password);

            // Show dashboard
            this.showDashboard();

            // Show success message
            this.showToast('Registration successful', 'success');
        } catch (error) {
            console.error('Registration error:', error);

            // Show error message
            this.showToast(error.message, 'error');

            // Set validation messages
            const usernameInput = document.getElementById('newUsername');
            const emailInput = document.getElementById('email');

            if (error.message === 'Username already exists') {
                usernameInput.setCustomValidity('Username already exists');
                usernameInput.reportValidity();
            } else if (error.message === 'Email already exists') {
                emailInput.setCustomValidity('Email already exists');
                emailInput.reportValidity();
            }
        }
    }

    // Handle logout
    handleLogout() {
        auth.logout();
        this.showLogin();
        this.showToast('You have been logged out', 'info');
    }

    // Toggle between login and register forms
    toggleAuthForms() {
        this.loginContainer.classList.toggle('hidden');
        this.registerContainer.classList.toggle('hidden');
    }

    // Show login screen
    showLogin() {
        this.loginContainer.classList.remove('hidden');
        this.registerContainer.classList.add('hidden');
        this.dashboardContainer.classList.add('hidden');
    }

    // Show dashboard
    showDashboard() {
        // Update UI
        this.loginContainer.classList.add('hidden');
        this.registerContainer.classList.add('hidden');
        this.dashboardContainer.classList.remove('hidden');

        // Navigate to dashboard section
        this.navigateTo('dashboard');

        // Get the actual logged-in user instead of creating a mock user
        const user = auth.getCurrentUser();

        // If we have a user from auth service, use it
        if (user) {
            console.log('Using authenticated user:', user.username);
            this.initializeModules(user);
        } else {
            // Fall back to mock user only if no authenticated user exists
            console.log('No authenticated user found, using guest user');
            const mockUser = {
                username: 'guest',
                email: 'guest@example.com',
                fullName: 'Guest User',
                age: '30',
                gender: 'male',
                height: '175',
                weight: '70',
                medicalHistory: '',
                allergies: '',
                joinDate: new Date().toISOString()
            };
            this.initializeModules(mockUser);
        }
    }

    // Navigate to a specific section
    navigateTo(section) {
        // Update current section
        this.currentSection = section;

        // Update active navigation link
        this.navLinks.forEach(link => {
            const linkSection = link.getAttribute('data-section');
            const listItem = link.parentElement;

            if (linkSection === section) {
                listItem.classList.add('active');
            } else {
                listItem.classList.remove('active');
            }
        });

        // Show selected section, hide others
        this.contentSections.forEach(sectionElem => {
            const sectionId = sectionElem.id;

            if (sectionId === `${section}-section`) {
                sectionElem.classList.remove('hidden');
            } else {
                sectionElem.classList.add('hidden');
            }
        });

        // Perform section-specific initializations
        this.initializeSection(section);
    }

    // Initialize section-specific functionality
    initializeSection(section) {
        switch (section) {
            case 'health-records':
                // Initialize health records if not already
                if (window.healthRecords) {
                    window.healthRecords.init();
                }
                break;
            case 'predict-disease':
                // Initialize disease prediction if not already
                if (window.diseasePrediction) {
                    window.diseasePrediction.init();
                }
                break;
            case 'profile':
                // Initialize profile data
                this.initializeProfileData();
                break;
        }
    }

    // Initialize all modules with user data
    async initializeModules(user) {
        // Initialize dashboard
        window.dashboard = new Dashboard();
        await window.dashboard.init(user);

        // Initialize other modules
        window.healthRecords = new HealthRecords();
        window.diseasePrediction = new DiseasePrediction();
        window.dataService = new DataService();

        // Health records will initialize when that section is shown

        // Initialize profile data
        this.initializeProfileData();
    }

    // Initialize profile data
    initializeProfileData() {
        // Use mock user data instead of auth service
        const mockUser = {
            username: 'guest',
            email: 'guest@example.com',
            fullName: 'Guest User',
            age: '30',
            gender: 'male',
            height: '175',
            weight: '70',
            medicalHistory: '',
            allergies: '',
            joinDate: new Date().toISOString()
        };

        // Set profile data
        document.getElementById('profileName').textContent = mockUser.fullName || mockUser.username;
        document.getElementById('profileEmail').textContent = mockUser.email;
        document.getElementById('profileUsername').value = mockUser.username;
        document.getElementById('profileFullName').value = mockUser.fullName || '';
        document.getElementById('profileAge').value = mockUser.age || '';
        document.getElementById('profileGender').value = mockUser.gender || 'male';
        document.getElementById('profileHeight').value = mockUser.height || '';
        document.getElementById('profileWeight').value = mockUser.weight || '';
        document.getElementById('profileMedicalHistory').value = mockUser.medicalHistory || '';
        document.getElementById('profileAllergies').value = mockUser.allergies || '';
    }

    // Update user profile
    updateProfile() {
        // Get profile data
        const userData = {
            fullName: document.getElementById('profileFullName').value,
            age: document.getElementById('profileAge').value,
            gender: document.getElementById('profileGender').value,
            height: document.getElementById('profileHeight').value,
            weight: document.getElementById('profileWeight').value,
            medicalHistory: document.getElementById('profileMedicalHistory').value,
            allergies: document.getElementById('profileAllergies').value
        };

        try {
            // Update display
            document.getElementById('profileName').textContent = userData.fullName || 'Guest User';

            // Show success message
            this.showToast('Profile updated successfully', 'success');

            // Update dashboard
            if (window.dashboard) {
                window.dashboard.init({
                    username: 'guest',
                    email: 'guest@example.com',
                    ...userData,
                    joinDate: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('Profile update error:', error);
            this.showToast('Error updating profile', 'error');
        }
    }

    // Change password
    changePassword() {
        if (!auth.isLoggedIn) return;

        // Get password data
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPasswordInput').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            document.getElementById('confirmNewPassword').setCustomValidity('Passwords do not match');
            document.getElementById('confirmNewPassword').reportValidity();
            return;
        }

        try {
            // Change password
            auth.changePassword(currentPassword, newPassword);

            // Clear form
            document.getElementById('changePasswordForm').reset();

            // Show success message
            this.showToast('Password changed successfully', 'success');
        } catch (error) {
            console.error('Password change error:', error);

            // Show error message
            if (error.message === 'Current password is incorrect') {
                document.getElementById('currentPassword').setCustomValidity('Current password is incorrect');
                document.getElementById('currentPassword').reportValidity();
            } else {
                this.showToast(error.message, 'error');
            }
        }
    }

    // Confirm account deletion
    confirmDeleteAccount() {
        if (!auth.isLoggedIn) return;

        // Show confirmation dialog
        const confirmed = confirm(
            'Are you sure you want to delete your account? This action cannot be undone.'
        );

        if (confirmed) {
            // Prompt for password
            const password = prompt('Please enter your password to confirm account deletion:');

            if (password) {
                try {
                    // Delete account
                    auth.deleteAccount(password);

                    // Show login screen
                    this.showLogin();

                    // Show success message
                    this.showToast('Your account has been deleted', 'info');
                } catch (error) {
                    console.error('Account deletion error:', error);
                    this.showToast(error.message, 'error');
                }
            }
        }
    }

    // Export user data
    exportUserData() {
        if (!auth.isLoggedIn) return;

        const user = auth.getCurrentUser();
        if (!user) return;

        // Create a copy of user data (without password)
        const userData = { ...user };
        delete userData.password;

        // Convert to JSON
        const jsonData = JSON.stringify(userData, null, 2);

        // Create a Blob
        const blob = new Blob([jsonData], { type: 'application/json' });

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `healthtrack_data_${user.username}.json`;

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Show success message
        this.showToast('Your data has been exported', 'success');
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
}

// Initialize application on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global app instance
    window.app = new App();
}); 