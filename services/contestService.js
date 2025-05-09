import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const contestService = {
  // Get all contests
  getAllContests: async () => {
    try {
      const response = await axios.get(`${API_URL}/contests`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contests:', error);
      throw error;
    }
  },

  // Get contest by ID
  getContestById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/contests/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contest:', error);
      throw error;
    }
  },

  // Create new contest
  createContest: async (contestData) => {
    try {
      const response = await axios.post(`${API_URL}/contests`, contestData);
      return response.data;
    } catch (error) {
      console.error('Error creating contest:', error);
      throw error;
    }
  },

  // Update contest
  updateContest: async (id, contestData) => {
    try {
      const response = await axios.put(`${API_URL}/contests/${id}`, contestData);
      return response.data;
    } catch (error) {
      console.error('Error updating contest:', error);
      throw error;
    }
  },

  // Delete contest
  deleteContest: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/contests/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting contest:', error);
      throw error;
    }
  },

  // Vote for an image in a contest
  voteForImage: async (contestId, userId, imageIndex) => {
    try {
      const response = await axios.post(`${API_URL}/contests/${contestId}/vote`, {
        userId,
        imageIndex,
      });
      return response.data;
    } catch (error) {
      console.error('Error voting for image:', error);
      throw error;
    }
  },

  // Like a contest
  likeContest: async (contestId, userId) => {
    try {
      const response = await axios.post(`${API_URL}/contests/${contestId}/like`, {
        userId,
      });
      return response.data;
    } catch (error) {
      console.error('Error liking contest:', error);
      throw error;
    }
  },

  // Add comment to contest
  addComment: async (contestId, userId, text) => {
    try {
      const response = await axios.post(`${API_URL}/contests/${contestId}/comment`, {
        userId,
        text,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },
}; 