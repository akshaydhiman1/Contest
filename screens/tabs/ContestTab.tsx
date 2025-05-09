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
  likes: number;
  liked: boolean;
  comments: AppComment[];
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
  creatorId?: string;
  createdAt: string;
  likes?: number;
  liked?: boolean;
  comments?: AppComment[];
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
        likes: contest.likes || 0,
        liked: contest.liked || false,
        comments: contest.comments || [],
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

  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    // Display a message when the contest tab is shown for the first time
    console.log('Contest Tab Loaded - Demo Mode');

    // In a real app, we would fetch contest photos from an API
    // For now we're using the mocked photos data
  }, []);

  const handleLike = async (photoId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/contests/${photoId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to like contest');
      }

      // Update local state
      setPhotos(prevPhotos =>
        prevPhotos.map(photo => {
          if (photo.id === photoId) {
            return {
              ...photo,
              likes: photo.liked ? photo.likes - 1 : photo.likes + 1,
              liked: !photo.liked,
            };
          }
          return photo;
        }),
      );
    } catch (error) {
      console.error('Error liking contest:', error);
      Alert.alert('Error', 'Failed to like contest. Please try again.');
    }
  };

  const toggleComments = (photoId: string) => {
    setExpandedComments(expandedComments === photoId ? null : photoId);
    setCommentText('');
  };

  const addComment = async (photoId: string) => {
    if (!commentText.trim() || !user) return;

    try {
      const response = await fetch(`${API_URL}/api/contests/${photoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: commentText.trim(),
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const result = await response.json();
      const newComment = result.data;

      // Update local state
      setPhotos(prevPhotos =>
        prevPhotos.map(photo => {
          if (photo.id === photoId) {
            return {
              ...photo,
              comments: [...photo.comments, newComment],
            };
          }
          return photo;
        }),
      );

      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    }
  };

  const renderCommentItem: ListRenderItem<AppComment> = ({item}) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentUsername}>{item.username}</Text>
      <Text style={styles.commentText}>{item.text}</Text>
      <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
    </View>
  );

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

        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLike(item.id)}>
            <Icon
              name={item.liked ? 'heart' : 'heart-outline'}
              size={24}
              color={item.liked ? '#F44336' : '#666'}
            />
            <Text style={styles.actionText}>{item.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleComments(item.id)}>
            <Icon name="comment-outline" size={24} color="#666" />
            <Text style={styles.actionText}>{item.comments.length}</Text>
          </TouchableOpacity>
        </View>

        {expandedComments === item.id && (
          <View style={styles.commentsSection}>
            <Text style={styles.commentsHeader}>
              {item.comments.length === 0
                ? 'No comments yet'
                : `Comments (${item.comments.length})`}
            </Text>

            {item.comments.length > 0 && (
              <FlatList
                data={item.comments}
                renderItem={renderCommentItem}
                keyExtractor={comment => comment.id}
                style={styles.commentsList}
              />
            )}

            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => addComment(item.id)}
                disabled={!commentText.trim()}>
                <Icon
                  name="send"
                  size={20}
                  color={commentText.trim() ? '#2196F3' : '#ccc'}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
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

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFC107" />
          <Text style={styles.loadingText}>Loading your contests...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={48} color="#FFC107" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : photos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="image-off" size={48} color="#FFC107" />
          <Text style={styles.emptyText}>No contests yet</Text>
          <Text style={styles.emptySubText}>Create your first contest to get started!</Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          renderItem={renderPhotoItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.photosList}
          refreshing={isLoading}
          onRefresh={handleRefresh}
        />
      )}
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
  actionBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 4,
  },
  actionText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  commentsSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  commentsHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  commentsList: {
    maxHeight: 150,
  },
  commentItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentUsername: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    marginVertical: 2,
  },
  commentTimestamp: {
    fontSize: 11,
    color: '#999',
  },
  commentInputContainer: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    marginRight: 8,
    fontSize: 14,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
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
