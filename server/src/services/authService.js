/**
 * Authentication Service for Contest App
 *
 * This service provides methods to handle user authentication including
 * phone number verification, OTP validation, and user session management.
 */

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Auth Service
 * Methods for handling user authentication
 */
export const authService = {
  /**
   * Send OTP to a phone number
   *
   * @param {string} phoneNumber - The user's phone number
   */
  sendOTP: async phoneNumber => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({phoneNumber}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      return data;
    } catch (error) {
      console.error('Error sending OTP:', error);
      // For development, we'll simulate successful OTP sending with our test accounts
      return {
        success: true,
        message: 'OTP sent successfully (simulated)',
      };
    }
  },

  /**
   * Verify OTP and authenticate user
   *
   * @param {string} phoneNumber - The user's phone number
   * @param {string} otp - The OTP to verify
   */
  verifyOTP: async (phoneNumber, otp) => {
    try {
      // Hardcoded test accounts (in a real app, this would be validated on the server)
      const testAccounts = {
        3332221110: '121212',
        2221113330: '212121',
        1113332220: '321321',
      };

      // Check if the phone number exists and the OTP matches
      if (testAccounts[phoneNumber] && testAccounts[phoneNumber] === otp) {
        // Simulate a successful API response with a token
        return {
          success: true,
          data: {
            token: `test_token_${phoneNumber}`,
            user: {
              id: `user_${phoneNumber}`,
              phoneNumber,
              createdAt: new Date().toISOString(),
            },
          },
        };
      }

      // In a real application, we would make an API call:
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({phoneNumber, otp}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      return data;
    } catch (error) {
      console.error('Error verifying OTP:', error);

      // For development, we'll just handle the test accounts and throw an error for others
      const testAccounts = {
        3332221110: '121212',
        2221113330: '212121',
        1113332220: '321321',
      };

      if (testAccounts[phoneNumber] && testAccounts[phoneNumber] === otp) {
        return {
          success: true,
          data: {
            token: `test_token_${phoneNumber}`,
            user: {
              id: `user_${phoneNumber}`,
              phoneNumber,
              createdAt: new Date().toISOString(),
            },
          },
        };
      }

      throw new Error('Invalid phone number or OTP');
    }
  },

  /**
   * Get current user profile
   *
   * @param {string} token - Authentication token
   */
  getUserProfile: async token => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get user profile');
      }

      return data.data;
    } catch (error) {
      console.error('Error getting user profile:', error);

      // For development, we'll extract the phone number from the test token
      if (token && token.startsWith('test_token_')) {
        const phoneNumber = token.replace('test_token_', '');
        return {
          id: `user_${phoneNumber}`,
          phoneNumber,
          username: `user_${phoneNumber.substring(0, 4)}`,
          createdAt: new Date().toISOString(),
        };
      }

      throw error;
    }
  },

  /**
   * Logout the current user
   *
   * @param {string} token - Authentication token
   */
  logout: async token => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to logout');
      }

      return data;
    } catch (error) {
      console.error('Error logging out:', error);
      // For development, we'll simulate successful logout
      return {
        success: true,
        message: 'Logged out successfully (simulated)',
      };
    }
  },
};
