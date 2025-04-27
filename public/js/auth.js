// Auth Module for Health Management System using MongoDB backend
class Auth {
    constructor() {
        this.user = null;
        this.token = null;
        this.isLoggedIn = false;
        this.apiUrl = 'http://localhost:5000/api';

        // Check if user is already logged in (from localStorage)
        this.checkLoginStatus();
    }

    // Set auth token for API requests
    setAuthToken(token) {
        this.token = token;
        localStorage.setItem('healthtrackToken', token);
    }

    // Get auth token from localStorage
    getAuthToken() {
        return localStorage.getItem('healthtrackToken');
    }

    // Remove auth token
    removeAuthToken() {
        this.token = null;
        localStorage.removeItem('healthtrackToken');
    }

    // Save user to localStorage
    saveUser(user) {
        this.user = user;
        localStorage.setItem('healthtrackUser', JSON.stringify(user));
    }

    // Get user from localStorage
    getUser() {
        return JSON.parse(localStorage.getItem('healthtrackUser'));
    }

    // Remove user from localStorage
    removeUser() {
        this.user = null;
        localStorage.removeItem('healthtrackUser');
    }

    // Register a new user
    async register(username, email, password) {
        try {
            const response = await fetch(`${this.apiUrl}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Set auth token and user
            this.setAuthToken(data.token);
            this.saveUser(data.user);
            this.isLoggedIn = true;

            return data.user;
        } catch (error) {
            throw error;
        }
    }

    // Login user
    async login(username, password) {
        try {
            console.log(`Attempting to login user: ${username}`);

            // Basic validation
            if (!username || username.trim() === '') {
                throw new Error('Username is required');
            }

            if (!password || password.trim() === '') {
                throw new Error('Password is required');
            }

            const response = await fetch(`${this.apiUrl}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            console.log(`Login response status: ${response.status}`);
            const data = await response.json();
            console.log(`Login response data:`, data);

            if (!response.ok) {
                console.error('Login error response:', data);
                throw new Error(data.message || 'Login failed');
            }

            console.log('Login successful, saving auth data');

            // Set auth token and user
            this.setAuthToken(data.token);
            this.saveUser(data.user);
            this.isLoggedIn = true;

            // Mark login as manual
            sessionStorage.setItem('manualLogin', 'true');

            return data.user;
        } catch (error) {
            console.error('Login error caught:', error);
            throw error;
        }
    }

    // Check if user is logged in from localStorage
    checkLoginStatus() {
        const token = this.getAuthToken(); // Use the class method instead of direct localStorage access

        if (!token) {
            console.log('No auth token found, user is not logged in');
            this.isLoggedIn = false;
            return;
        }

        // Try to get the user info from localStorage
        try {
            const userData = this.getUser();
            if (userData) {
                this.user = userData;
                this.isLoggedIn = true;
                console.log('User found in localStorage:', userData.username);
            } else {
                this.isLoggedIn = false;
            }
        } catch (error) {
            console.error('Error getting user info:', error);
            this.isLoggedIn = false;
            this.removeAuthToken(); // Clean up invalid data
        }
    }

    // Make authenticated API request
    async authRequest(endpoint, method = 'GET', body = null) {
        try {
            // Check if token exists
            const token = this.getAuthToken();
            if (!token) {
                throw new Error('Authentication required');
            }

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const options = {
                method,
                headers
            };

            if (body) {
                options.body = JSON.stringify(body);
            }

            const response = await fetch(`${this.apiUrl}${endpoint}`, options);

            // Handle 401 Unauthorized
            if (response.status === 401) {
                this.logout();
                throw new Error('Session expired. Please login again.');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('Auth request error:', error);
            throw error;
        }
    }

    // Logout user
    logout() {
        this.removeAuthToken();
        this.removeUser();
        this.isLoggedIn = false;
    }

    // Get current user
    getCurrentUser() {
        return this.user;
    }

    // Update user profile
    async updateProfile(userData) {
        try {
            const updatedUser = await this.authRequest('/users/profile', 'PUT', userData);

            // Update local user
            this.user = { ...this.user, ...updatedUser };
            this.saveUser(this.user);

            return this.user;
        } catch (error) {
            throw error;
        }
    }

    // Change password
    async changePassword(currentPassword, newPassword) {
        try {
            await this.authRequest('/users/change-password', 'POST', {
                currentPassword,
                newPassword
            });

            return true;
        } catch (error) {
            throw error;
        }
    }

    // Get all health records
    async getHealthRecords() {
        try {
            return await this.authRequest('/health-records');
        } catch (error) {
            console.error('Error getting health records:', error);
            return [];
        }
    }

    // Save health record
    async saveHealthRecord(record) {
        try {
            if (record.id || record._id) {
                // Update existing record
                const id = record.id || record._id;
                delete record.id; // Remove id from the request body
                delete record._id; // Remove _id from the request body

                return await this.authRequest(`/health-records/${id}`, 'PUT', record);
            } else {
                // Add new record
                return await this.authRequest('/health-records', 'POST', record);
            }
        } catch (error) {
            throw error;
        }
    }

    // Delete health record
    async deleteHealthRecord(recordId) {
        try {
            await this.authRequest(`/health-records/${recordId}`, 'DELETE');
            return true;
        } catch (error) {
            throw error;
        }
    }

    // Delete user account
    async deleteAccount(password) {
        try {
            await this.authRequest('/users', 'DELETE', { password });

            // Logout after deletion
            this.logout();

            return true;
        } catch (error) {
            throw error;
        }
    }

    // Emergency methods (for development only)

    // Create test user
    async createTestUser() {
        try {
            console.log('Attempting to create test user');
            const response = await fetch(`${this.apiUrl}/users/create-test-user`);
            const data = await response.json();
            console.log('Test user creation response:', data);
            return data;
        } catch (error) {
            console.error('Error creating test user:', error);
            throw error;
        }
    }

    // Emergency login
    async emergencyLogin() {
        try {
            console.log('Attempting emergency login');
            const response = await fetch(`${this.apiUrl}/users/emergency-login`);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Emergency login failed');
            }

            const data = await response.json();
            console.log('Emergency login response:', data);

            // Set auth token and user
            this.setAuthToken(data.token);
            this.saveUser(data.user);
            this.isLoggedIn = true;

            return data.user;
        } catch (error) {
            console.error('Emergency login error:', error);
            throw error;
        }
    }
}

// Initialize auth
const auth = new Auth();