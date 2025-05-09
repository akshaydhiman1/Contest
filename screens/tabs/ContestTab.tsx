import React, {useState, useEffect} from 'react';
import {useAppContext, Comment as AppComment} from '../../context/AppContext';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  ListRenderItem,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {API_URL} from '../../config/constants';

// Use a local interface for photo display that maps to our context Contest type
interface Photo {
  id: string;
  uri: string;
  caption: string;
  username: string;
  timestamp: string;
}

interface Contest {
  _id: string;
  title: string;
  images: string[];
  creator: {
    _id: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
}

const ContestTab = () => {
  const {user} = useAppContext();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's contests
  const fetchUserContests = async () => {
    if (!user) {
      setError('Please log in to view your contests');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Fetching contests for user:', user.id);
      const response = await fetch(`${API_URL}/api/contests/user/created`);
      console.log('Contest response status:', response.status);
      
      const result = await response.json();
      console.log('Contest response data:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch contests');
      }

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch contests');
      }

      const contests = result.data;
      console.log('User contests:', contests);
      
      // Transform contests to photo format
      const transformedPhotos: Photo[] = contests.map((contest: Contest) => ({
        id: contest._id,
        uri: contest.images[0], // Use first image as main photo
        caption: contest.title,
        username: contest.creator?.username || 'Unknown',
        timestamp: new Date(contest.createdAt).toLocaleDateString(),
      }));

      setPhotos(transformedPhotos);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching contests:', err);
      setError('Failed to load contests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a refresh function
  const handleRefresh = () => {
    setIsLoading(true);
    fetchUserContests();
  };

  useEffect(() => {
    fetchUserContests();
  }, [user]);

  const renderPhotoItem: ListRenderItem<Photo> = ({item}) => (
    <View style={styles.photoCard}>
      <View style={styles.photoHeader}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>

      <Image
        source={{uri: item.uri}}
        style={styles.photo}
        onError={() => {
          console.log(`Failed to load image: ${item.uri}`);
        }}
      />

      <View style={styles.photoInfo}>
        <Text style={styles.caption}>{item.caption}</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFC107" />
        <Text style={styles.loadingText}>Loading your contests...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={48} color="#FFC107" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (photos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="image-off" size={48} color="#FFC107" />
        <Text style={styles.emptyText}>No contests yet</Text>
        <Text style={styles.emptySubText}>Create your first contest to get started!</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <View style={styles.header}>
        <Icon name="trophy" size={22} color="#FFC107" />
        <Text style={styles.title}>My Contests</Text>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={handleRefresh}
          disabled={isLoading}>
          <Icon 
            name="refresh" 
            size={22} 
            color={isLoading ? '#ccc' : '#FFC107'} 
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={photos}
        renderItem={renderPhotoItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.photosList}
        refreshing={isLoading}
        onRefresh={handleRefresh}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  photosList: {
    padding: 8,
  },
  photoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  photoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  photo: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  photoInfo: {
    padding: 12,
  },
  caption: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  refreshButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFC107',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ContestTab;
