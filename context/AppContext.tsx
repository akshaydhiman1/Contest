import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import {
  contestService,
  invitationService,
} from '../server/src/services/apiService';
import axios from 'axios';

// Define types
export type VotingDuration = '12h' | '24h' | '48h' | '72h' | '7d';

export interface AppUser {
  id: string;
  username: string;
  avatar: string;
  phone: string;
  email?: string;
  isVerified: boolean;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  images: string[];
  votingDuration: VotingDuration;
  creator: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
}

export interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}

export interface Invitation {
  id: string;
  contestId: string;
  contestTitle: string;
  from: string;
  status: 'pending' | 'accepted' | 'declined';
  date: string;
}

// Create the context
export interface AppContextType {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  login: (userData: AppUser) => void;
  logout: () => void;
  contests: Contest[];
  addContest: (contest: Contest) => Promise<Contest>;
  loadContests: () => Promise<void>;
  isLoadingContests: boolean;
  contestsError: string | null;

  invitations: Invitation[];
  addInvitations: (
    invitees: {appUsers: AppUser[]; phoneNumbers: string[]},
    contestId: string,
  ) => Promise<void>;
  updateInvitationStatus: (
    id: string,
    status: 'accepted' | 'declined',
  ) => Promise<void>;
  loadInvitations: () => Promise<void>;
  isLoadingInvitations: boolean;
  invitationsError: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Simulate a token for now - in a real app, you would get this from authentication
const mockToken = 'mock-token-for-development';

// Flag to toggle between API and mock data (useful when API server is unavailable)
const USE_MOCK_DATA = true; // Set to false when the API server is available

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://192.168.1.28:5000';

// Create a provider component
export const AppProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const [isLoadingContests, setIsLoadingContests] = useState<boolean>(false);
  const [contestsError, setContestsError] = useState<string | null>(null);

  const [isLoadingInvitations, setIsLoadingInvitations] =
    useState<boolean>(false);
  const [invitationsError, setInvitationsError] = useState<string | null>(null);

  const [user, setUser] = useState<AppUser | null>(null);

  const login = (userData: AppUser) => {
    setUser(userData);
    // Load user-specific data after login
    loadContests();
    loadInvitations();
  };

  const logout = () => {
    setUser(null);
    // Clear user-specific data
    setContests([]);
    setInvitations([]);
  };

  // Function to load all contests
  const loadContests = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/api/contests/user/${user.id}`);
      if (response.data.success) {
        setContests(response.data.data);
      }
    } catch (error) {
      console.error('Error loading contests:', error);
    }
  };

  // Function to add a new contest
  const addContest = async (contest: Contest): Promise<Contest> => {
    try {
      // Use mock data if API is unavailable
      if (USE_MOCK_DATA) {
        // Create a mock contest with a generated ID
        const newContest: Contest = {
          id: `mock_${Date.now()}`,
          title: contest.title,
          description: contest.description,
          images: contest.images,
          votingDuration: contest.votingDuration,
          creator: 'You',
          timestamp: 'Just now',
          likes: 0,
          liked: false,
          comments: [],
        };

        // Update state
        setContests(prev => [newContest, ...prev]);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return newContest;
      } else {
        // Create contest data structure for API
        const contestData = {
          title: contest.title,
          description: contest.description,
          images: contest.images,
          votingDuration: contest.votingDuration,
          invitees: {}, // Empty invitees object to match API requirement
        };

        // Call API to create contest
        const createdContest = await contestService.createContest(
          contestData,
          mockToken,
        );

        // Transform to match our Contest interface
        const newContest: Contest = {
          id: createdContest._id || `contest_${Date.now()}`,
          title: createdContest.title,
          description: createdContest.description,
          images: createdContest.images,
          votingDuration: createdContest.votingDuration,
          creator:
            (createdContest.creator && createdContest.creator.username) ||
            'You',
          timestamp: 'Just now',
          likes: 0,
          liked: false,
          comments: [],
        };

        // Update state
        setContests(prev => [newContest, ...prev]);

        return newContest;
      }
    } catch (error) {
      console.error('Error creating contest:', error);

      // Create a mock contest with a generated ID as fallback
      const fallbackContest: Contest = {
        id: `fallback_${Date.now()}`,
        title: contest.title,
        description: contest.description,
        images: contest.images,
        votingDuration: contest.votingDuration,
        creator: 'You',
        timestamp: 'Just now',
        likes: 0,
        liked: false,
        comments: [],
      };

      // Update state with fallback
      setContests(prev => [fallbackContest, ...prev]);

      return fallbackContest;
    }
  };

  // Function to load all invitations
  const loadInvitations = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/api/invitations/received/${user.id}`);
      if (response.data.success) {
        setInvitations(response.data.data);
      }
    } catch (error) {
      console.error('Error loading invitations:', error);
    }
  };

  // Function to add new invitations
  const addInvitations = async (
    invitees: {appUsers: AppUser[]; phoneNumbers: string[]},
    contestId: string,
  ) => {
    try {
      if (USE_MOCK_DATA) {
        // Create mock invitations
        const newInvitations: Invitation[] = invitees.appUsers.map(
          (user, index) => ({
            id: `invitation_${Date.now()}_${index}`,
            contestId: contestId,
            contestTitle:
              contests.find(c => c.id === contestId)?.title || 'New Contest',
            from: 'You',
            status: 'pending',
            date: 'Just now',
          }),
        );

        // Add to existing invitations
        setInvitations(prev => [...newInvitations, ...prev]);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // Transform app users to the format expected by the API
        const transformedInvitees = {
          appUsers: invitees.appUsers.map(user => user.id),
          phoneNumbers: invitees.phoneNumbers,
        };

        // Send invitations
        await invitationService.sendInvitations(
          contestId,
          transformedInvitees,
          mockToken,
        );

        // Reload invitations to get the latest data
        await loadInvitations();
      }
    } catch (error) {
      console.error('Error sending invitations:', error);

      // Create fallback mock invitations
      const fallbackInvitations: Invitation[] = invitees.appUsers.map(
        (user, index) => ({
          id: `fallback_${Date.now()}_${index}`,
          contestId: contestId,
          contestTitle:
            contests.find(c => c.id === contestId)?.title || 'New Contest',
          from: 'You',
          status: 'pending',
          date: 'Just now',
        }),
      );

      // Add fallback invitations
      setInvitations(prev => [...fallbackInvitations, ...prev]);
    }
  };

  // Function to update invitation status
  const updateInvitationStatus = async (
    id: string,
    status: 'accepted' | 'declined',
  ) => {
    try {
      if (USE_MOCK_DATA) {
        // Update local state for mock data
        setInvitations(prev =>
          prev.map(inv => (inv.id === id ? {...inv, status} : inv)),
        );

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // Update invitation status on server
        await invitationService.respondToInvitation(id, status, mockToken);

        // Update local state
        setInvitations(prev =>
          prev.map(inv => (inv.id === id ? {...inv, status} : inv)),
        );
      }
    } catch (error) {
      console.error('Error updating invitation status:', error);

      // Update local state anyway as fallback
      setInvitations(prev =>
        prev.map(inv => (inv.id === id ? {...inv, status} : inv)),
      );
    }
  };

  // Load initial data
  useEffect(() => {
    loadContests();
    loadInvitations();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        contests,
        addContest,
        loadContests,
        isLoadingContests,
        contestsError,

        invitations,
        addInvitations,
        updateInvitationStatus,
        loadInvitations,
        isLoadingInvitations,
        invitationsError,
      }}>
      {children}
    </AppContext.Provider>
  );
};

// Create a hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
