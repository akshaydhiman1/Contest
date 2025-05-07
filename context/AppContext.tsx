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

// Define types
export type VotingDuration = '12h' | '24h' | '48h' | '72h' | '7d';

export interface AppUser {
  id: string;
  username: string;
  avatar: string;
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
interface AppContextType {
  contests: Contest[];
  addContest: (contest: Omit<Contest, 'id'>) => Promise<Contest>;
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

// Create a provider component
export const AppProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const [isLoadingContests, setIsLoadingContests] = useState<boolean>(false);
  const [contestsError, setContestsError] = useState<string | null>(null);

  const [isLoadingInvitations, setIsLoadingInvitations] =
    useState<boolean>(false);
  const [invitationsError, setInvitationsError] = useState<string | null>(null);

  // Function to load all contests
  const loadContests = async () => {
    try {
      setIsLoadingContests(true);
      setContestsError(null);

      if (USE_MOCK_DATA) {
        // Use mock data
        const mockContests: Contest[] = [
          {
            id: '1',
            title: 'Wildlife Photography',
            description: 'Share your best wildlife photos!',
            images: ['https://picsum.photos/id/237/300/300'],
            votingDuration: '24h',
            creator: 'wildlife_enthusiast',
            timestamp: '3 hours ago',
            likes: 42,
            liked: false,
            comments: [
              {
                id: 'c1',
                username: 'sarah89',
                text: 'So cute! 😍',
                timestamp: '1h ago',
              },
            ],
          },
          {
            id: '2',
            title: 'Urban Landscapes',
            description: 'Show off your city views!',
            images: ['https://picsum.photos/id/1029/300/300'],
            votingDuration: '48h',
            creator: 'city_explorer',
            timestamp: '1 day ago',
            likes: 28,
            liked: false,
            comments: [],
          },
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        setContests(mockContests);
      } else {
        // In a real app, use the token from auth
        const contestsData = await contestService.getAllContests(mockToken);

        // Transform the data to match our Contest interface
        const transformedContests: Contest[] = contestsData.map(
          (contest: any) => ({
            id: contest._id,
            title: contest.title,
            description: contest.description,
            images: contest.images,
            votingDuration: contest.votingDuration,
            creator: contest.creator.username || 'Unknown User',
            timestamp: new Date(contest.createdAt).toLocaleString(),
            likes: 0, // This would come from another API in a real app
            liked: false, // This would be user-specific in a real app
            comments: [], // This would come from another API in a real app
          }),
        );

        setContests(transformedContests);
      }
    } catch (error) {
      setContestsError(
        error instanceof Error ? error.message : 'Failed to load contests',
      );
      console.error('Error loading contests:', error);

      // Fallback to mock data in case of error
      const mockContests: Contest[] = [
        {
          id: '1',
          title: 'Wildlife Photography',
          description: 'Share your best wildlife photos!',
          images: ['https://picsum.photos/id/237/300/300'],
          votingDuration: '24h',
          creator: 'wildlife_enthusiast',
          timestamp: '3 hours ago',
          likes: 42,
          liked: false,
          comments: [
            {
              id: 'c1',
              username: 'sarah89',
              text: 'So cute! 😍',
              timestamp: '1h ago',
            },
          ],
        },
      ];

      setContests(mockContests);
    } finally {
      setIsLoadingContests(false);
    }
  };

  // Function to add a new contest
  const addContest = async (contest: Omit<Contest, 'id'>): Promise<Contest> => {
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
    try {
      setIsLoadingInvitations(true);
      setInvitationsError(null);

      if (USE_MOCK_DATA) {
        // Use mock data
        const mockInvitations: Invitation[] = [
          {
            id: '1',
            contestId: '1',
            contestTitle: 'Wildlife Photography',
            from: 'wildlife_enthusiast',
            status: 'pending',
            date: '2 days ago',
          },
          {
            id: '2',
            contestTitle: 'Urban Landscapes',
            contestId: '2',
            from: 'city_explorer',
            status: 'accepted',
            date: '1 week ago',
          },
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        setInvitations(mockInvitations);
      } else {
        // In a real app, use the token from auth
        const receivedInvitations =
          await invitationService.getReceivedInvitations(mockToken);

        // Transform the data to match our Invitation interface
        const transformedInvitations: Invitation[] = receivedInvitations.map(
          (inv: any) => ({
            id: inv._id,
            contestId: inv.contestId._id,
            contestTitle: inv.contestId.title,
            from: inv.from.username || inv.from.name || inv.from,
            status: inv.status,
            date: new Date(inv.createdAt).toLocaleString(),
          }),
        );

        setInvitations(transformedInvitations);
      }
    } catch (error) {
      setInvitationsError(
        error instanceof Error ? error.message : 'Failed to load invitations',
      );
      console.error('Error loading invitations:', error);

      // Fallback to mock data in case of error
      const mockInvitations: Invitation[] = [
        {
          id: '1',
          contestId: '1',
          contestTitle: 'Wildlife Photography',
          from: 'wildlife_enthusiast',
          status: 'pending',
          date: '2 days ago',
        },
      ];

      setInvitations(mockInvitations);
    } finally {
      setIsLoadingInvitations(false);
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
