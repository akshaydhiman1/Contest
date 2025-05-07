/**
 * API Service for Contest App
 *
 * This service provides methods to interact with the backend API
 * from the React Native frontend.
 */

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Invitation Service
 * Methods for handling contest invitations
 */
export const invitationService = {
  /**
   * Send invitations to participate in a contest
   *
   * @param {string} contestId - The ID of the contest
   * @param {Object} invitees - The users to invite
   * @param {Array} invitees.appUsers - Array of app users to invite
   * @param {Array} invitees.phoneNumbers - Array of phone numbers to invite
   * @param {string} token - Authentication token
   */
  sendInvitations: async (contestId, invitees, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/invitations/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({contestId, invitees}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send invitations');
      }

      return data;
    } catch (error) {
      console.error('Error sending invitations:', error);
      throw error;
    }
  },

  /**
   * Get invitations received by the current user
   *
   * @param {string} token - Authentication token
   */
  getReceivedInvitations: async token => {
    try {
      const response = await fetch(`${API_BASE_URL}/invitations/received`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to retrieve invitations');
      }

      return data.data;
    } catch (error) {
      console.error('Error getting received invitations:', error);
      throw error;
    }
  },

  /**
   * Get invitations sent by the current user
   *
   * @param {string} token - Authentication token
   */
  getSentInvitations: async token => {
    try {
      const response = await fetch(`${API_BASE_URL}/invitations/sent`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to retrieve sent invitations');
      }

      return data.data;
    } catch (error) {
      console.error('Error getting sent invitations:', error);
      throw error;
    }
  },

  /**
   * Respond to an invitation (accept/decline)
   *
   * @param {string} invitationId - The ID of the invitation
   * @param {string} status - Response status ('accepted' or 'declined')
   * @param {string} token - Authentication token
   */
  respondToInvitation: async (invitationId, status, token) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/invitations/${invitationId}/respond`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({status}),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to respond to invitation');
      }

      return data.data;
    } catch (error) {
      console.error('Error responding to invitation:', error);
      throw error;
    }
  },

  /**
   * Cancel an invitation
   *
   * @param {string} invitationId - The ID of the invitation
   * @param {string} token - Authentication token
   */
  cancelInvitation: async (invitationId, token) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/invitations/${invitationId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel invitation');
      }

      return data;
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      throw error;
    }
  },
};

/**
 * Contest Service
 * Methods for handling contests
 */
export const contestService = {
  /**
   * Create a new contest with optional invitations
   *
   * @param {Object} contestData - The contest data
   * @param {string} contestData.title - Contest title
   * @param {string} contestData.description - Contest description
   * @param {Array} contestData.images - Array of image URLs
   * @param {string} contestData.votingDuration - Duration for voting (e.g., '24h', '7d')
   * @param {Object} contestData.invitees - Users to invite (optional)
   * @param {string} token - Authentication token
   */
  createContest: async (contestData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create contest');
      }

      return data.data;
    } catch (error) {
      console.error('Error creating contest:', error);
      throw error;
    }
  },

  /**
   * Get all contests
   *
   * @param {string} token - Authentication token
   */
  getAllContests: async token => {
    try {
      const response = await fetch(`${API_BASE_URL}/contests`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to retrieve contests');
      }

      return data.data;
    } catch (error) {
      console.error('Error getting all contests:', error);
      throw error;
    }
  },

  /**
   * Get contests created by the current user
   *
   * @param {string} token - Authentication token
   */
  getUserContests: async token => {
    try {
      const response = await fetch(`${API_BASE_URL}/contests/user/created`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to retrieve user contests');
      }

      return data.data;
    } catch (error) {
      console.error('Error getting user contests:', error);
      throw error;
    }
  },

  /**
   * Get contests in which the user is participating
   *
   * @param {string} token - Authentication token
   */
  getParticipatingContests: async token => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/contests/user/participating`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to retrieve participating contests',
        );
      }

      return data.data;
    } catch (error) {
      console.error('Error getting participating contests:', error);
      throw error;
    }
  },
};
