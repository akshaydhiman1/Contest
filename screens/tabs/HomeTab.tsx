import React, {useState, useEffect} from 'react';
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
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button, Card, Header} from '../../components/ui';
import {
  colors,
  typography,
  spacing,
  getCardStyle,
  elevation,
  roundness,
} from '../../theme/theme';

// Define Photo and Comment interfaces (similar to ContestTab)
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

// Mocked photo data
const initialPhotos: Photo[] = [
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
        text: 'Such a cute dog! 😍',
        timestamp: '1h ago',
      },
      {
        id: 'c2',
        username: 'mike_j',
        text: 'What breed is it?',
        timestamp: '2h ago',
      },
    ],
    timestamp: '3 hours ago',
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
        timestamp: '5h ago',
      },
    ],
    timestamp: '6 hours ago',
  },
  {
    id: '3',
    uri: 'https://picsum.photos/id/100/300/300',
    caption: 'My workspace setup',
    username: 'techgirl',
    likes: 36,
    liked: false,
    comments: [],
    timestamp: '1 day ago',
  },
  {
    id: '4',
    uri: 'https://picsum.photos/id/1000/300/300',
    caption: 'Morning coffee',
    username: 'coffeelover',
    likes: 24,
    liked: false,
    comments: [],
    timestamp: '2 days ago',
  },
  {
    id: '5',
    uri: 'https://picsum.photos/id/1015/300/300',
    caption: 'Mountain trek',
    username: 'adventurer',
    likes: 65,
    liked: false,
    comments: [],
    timestamp: '3 days ago',
  },
];

// Filter types
type FilterOption = 'recent' | 'popular';

const HomeTab = () => {
  const [photos, setPhotos] = useState(initialPhotos);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('recent');

  useEffect(() => {
    // In a real app, we would fetch user photos from an API
    // For now we're using the mocked photos data
    console.log('Home Tab Loaded - Demo Mode');
  }, []);

  // Filter handlers
  const applyFilter = (filter: FilterOption) => {
    setActiveFilter(filter);

    let filteredPhotos = [...initialPhotos];
    if (filter === 'popular') {
      // Sort by most likes
      filteredPhotos.sort((a, b) => b.likes - a.likes);
    } else {
      // Sort by most recent (assuming timestamp format is consistent)
      filteredPhotos.sort((a, b) => {
        if (a.timestamp.includes('hour') && b.timestamp.includes('day'))
          return -1;
        if (a.timestamp.includes('day') && b.timestamp.includes('hour'))
          return 1;

        // Extract the number part
        const aTime = parseInt(a.timestamp.split(' ')[0]);
        const bTime = parseInt(b.timestamp.split(' ')[0]);

        // Compare based on time unit
        if (a.timestamp.includes('hour') && b.timestamp.includes('hour'))
          return aTime - bTime;
        if (a.timestamp.includes('day') && b.timestamp.includes('day'))
          return aTime - bTime;

        return 0;
      });
    }

    setPhotos(filteredPhotos);
  };

  // Like handler
  const handleLike = (photoId: string) => {
    setPhotos(
      photos.map(photo => {
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
  };

  // Comment handlers
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
      timestamp: 'Just now',
    };

    setPhotos(
      photos.map(photo => {
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
  };

  const renderCommentItem: ListRenderItem<Comment> = ({item}) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentUsername}>{item.username}</Text>
      <Text style={styles.commentText}>{item.text}</Text>
      <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
    </View>
  );

  const renderPhotoItem: ListRenderItem<Photo> = ({item}) => (
    <Card style={styles.photoCard} elevationLevel={elevation.small}>
      <View style={styles.photoHeader}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>

      <Image
        source={{uri: item.uri}}
        style={styles.photo as any}
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
              color={item.liked ? colors.error : colors.textSecondary}
            />
            <Text style={styles.actionText}>{item.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleComments(item.id)}>
            <Icon
              name="comment-outline"
              size={24}
              color={colors.textSecondary}
            />
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
                  color={commentText.trim() ? colors.secondary : colors.grey400}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Card>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <Header title="Discover Photos" />

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'recent' && styles.activeFilter,
          ]}
          onPress={() => applyFilter('recent')}>
          <Icon
            name="clock-outline"
            size={18}
            color={
              activeFilter === 'recent' ? colors.white : colors.textSecondary
            }
          />
          <Text
            style={[
              styles.filterText,
              activeFilter === 'recent' && styles.activeFilterText,
            ]}>
            Recent
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'popular' && styles.activeFilter,
          ]}
          onPress={() => applyFilter('popular')}>
          <Icon
            name="fire"
            size={18}
            color={
              activeFilter === 'popular' ? colors.white : colors.textSecondary
            }
          />
          <Text
            style={[
              styles.filterText,
              activeFilter === 'popular' && styles.activeFilterText,
            ]}>
            Most Liked
          </Text>
        </TouchableOpacity>
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
    backgroundColor: colors.background,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: spacing.regular,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.regular,
    marginRight: spacing.regular,
    borderRadius: roundness.medium,
    backgroundColor: colors.grey100,
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: typography.fontSizeSmall,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: spacing.tiny,
  },
  activeFilterText: {
    color: colors.white,
  },
  photosList: {
    padding: spacing.regular,
  },
  photoCard: {
    overflow: 'hidden',
    marginBottom: spacing.regular,
    padding: 0, // override Card default padding
  },
  photoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.regular,
  },
  username: {
    fontWeight: typography.fontWeightBold as any,
    color: colors.textPrimary,
    fontSize: typography.fontSizeRegular,
  },
  photo: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  photoInfo: {
    padding: spacing.regular,
  },
  caption: {
    fontSize: typography.fontSizeRegular,
    color: colors.textPrimary,
    marginBottom: spacing.small,
    fontWeight: '500',
  },
  photoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.grey100,
    paddingTop: spacing.small,
    marginTop: spacing.small,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.large,
    paddingVertical: spacing.tiny,
  },
  actionText: {
    marginLeft: spacing.tiny,
    color: colors.textSecondary,
    fontSize: typography.fontSizeSmall,
  },
  timestamp: {
    color: colors.textHint,
    fontSize: typography.fontSizeSmall,
  },
  commentsSection: {
    marginTop: spacing.regular,
    borderTopWidth: 1,
    borderTopColor: colors.grey100,
    paddingTop: spacing.regular,
  },
  commentsHeader: {
    fontSize: typography.fontSizeSmall,
    fontWeight: typography.fontWeightBold as any,
    color: colors.textSecondary,
    marginBottom: spacing.small,
  },
  commentsList: {
    maxHeight: 150,
  },
  commentItem: {
    marginBottom: spacing.small,
    paddingBottom: spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey100,
  },
  commentUsername: {
    fontSize: typography.fontSizeSmall,
    fontWeight: typography.fontWeightBold as any,
    color: colors.textPrimary,
  },
  commentText: {
    fontSize: typography.fontSizeSmall,
    color: colors.textPrimary,
    marginVertical: 2,
  },
  commentTimestamp: {
    fontSize: typography.fontSizeXSmall,
    color: colors.textHint,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.small,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.grey300,
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: spacing.regular,
    backgroundColor: colors.grey50,
    fontSize: typography.fontSizeSmall,
    marginRight: spacing.small,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.grey100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeTab;
