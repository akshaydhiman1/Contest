import React, { useState } from 'react';
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
  KeyboardAvoidingView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Define Photo and Comment interfaces
interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}

interface Photo {
  id: string;
  uri: string;
  caption: string;
  username: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  timestamp: string;
}

// Mocked contest photos data
const initialContestPhotos: Photo[] = [
  {
    id: '1',
    uri: 'https://picsum.photos/id/237/300/300',
    caption: 'My best friend',
    username: 'john_doe',
    likes: 42,
    liked: false,
    comments: [
      {
        id: 'c1',
        username: 'sarah89',
        text: 'So cute! 😍',
        timestamp: '1h ago'
      },
      {
        id: 'c2',
        username: 'mike_j',
        text: 'Great shot!',
        timestamp: '2h ago'
      }
    ],
    timestamp: '3 hours ago'
  },
  {
    id: '2',
    uri: 'https://picsum.photos/id/1024/300/300',
    caption: 'Beautiful sunset at the beach',
    username: 'travel_junkie',
    likes: 87,
    liked: true,
    comments: [
      {
        id: 'c3',
        username: 'photoexpert',
        text: 'Amazing colors!',
        timestamp: '5h ago'
      }
    ],
    timestamp: '6 hours ago'
  },
  {
    id: '3',
    uri: 'https://picsum.photos/id/100/300/300',
    caption: 'My workspace setup',
    username: 'techgirl',
    likes: 36,
    liked: false,
    comments: [],
    timestamp: '1 day ago'
  }
];

const ContestTab = () => {
  const [photos, setPhotos] = useState<Photo[]>(initialContestPhotos);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const handleLike = (photoId: string) => {
    setPhotos(photos.map(photo => {
      if (photo.id === photoId) {
        return {
          ...photo,
          likes: photo.liked ? photo.likes - 1 : photo.likes + 1,
          liked: !photo.liked
        };
      }
      return photo;
    }));
  };

  const toggleComments = (photoId: string) => {
    setExpandedComments(expandedComments === photoId ? null : photoId);
    setCommentText('');
  };

  const addComment = (photoId: string) => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `c${Date.now()}`,
      username: 'you',
      text: commentText.trim(),
      timestamp: 'Just now'
    };

    setPhotos(photos.map(photo => {
      if (photo.id === photoId) {
        return {
          ...photo,
          comments: [...photo.comments, newComment]
        };
      }
      return photo;
    }));

    setCommentText('');
  };

  const renderCommentItem: ListRenderItem<Comment> = ({ item }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentUsername}>{item.username}</Text>
      <Text style={styles.commentText}>{item.text}</Text>
      <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
    </View>
  );

  const renderPhotoItem: ListRenderItem<Photo> = ({ item }) => (
    <View style={styles.photoCard}>
      <View style={styles.photoHeader}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      
      <Image source={{ uri: item.uri }} style={styles.photo} />
      
      <View style={styles.photoInfo}>
        <Text style={styles.caption}>{item.caption}</Text>
        
        <View style={styles.actionBar}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleLike(item.id)}
          >
            <Icon 
              name={item.liked ? "heart" : "heart-outline"} 
              size={24} 
              color={item.liked ? "#F44336" : "#666"} 
            />
            <Text style={styles.actionText}>{item.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => toggleComments(item.id)}
          >
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
                disabled={!commentText.trim()}
              >
                <Icon name="send" size={20} color={commentText.trim() ? "#2196F3" : "#ccc"} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.header}>
        <Icon name="trophy" size={22} color="#FFC107" />
        <Text style={styles.title}>Photo Contest</Text>
      </View>
      
      <FlatList
        data={photos}
        renderItem={renderPhotoItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.photosList}
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
        shadowOffset: { width: 0, height: 2 },
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
        shadowOffset: { width: 0, height: 2 },
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
});

export default ContestTab;
