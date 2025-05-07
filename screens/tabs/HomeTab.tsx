import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  Platform,
  ListRenderItem 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Card, Header } from '../../components/ui';
import { colors, typography, spacing, getCardStyle, elevation } from '../../theme/theme';

// Define Photo type
interface Photo {
  id: string;
  uri: string;
  caption: string;
  likes: number;
  timestamp: string;
}

// Mocked photo data
const initialPhotos: Photo[] = [
  {
    id: '1',
    uri: 'https://picsum.photos/id/237/300/300',
    caption: 'My awesome photo',
    likes: 15,
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    uri: 'https://picsum.photos/id/1024/300/300',
    caption: 'Beautiful sunset',
    likes: 32,
    timestamp: '1 day ago'
  }
];

const HomeTab = () => {
  const [photos, setPhotos] = useState(initialPhotos);

  const renderPhotoItem: ListRenderItem<Photo> = ({ item }) => (
    <Card style={styles.photoCard} elevationLevel={elevation.small}>
      <Image source={{ uri: item.uri }} style={styles.photo} />
      <View style={styles.photoInfo}>
        <Text style={styles.caption}>{item.caption}</Text>
        <View style={styles.photoMeta}>
          <TouchableOpacity style={styles.likeContainer}>
            <Icon name="heart" size={16} color={colors.error} />
            <Text style={styles.likeCount}>{item.likes}</Text>
          </TouchableOpacity>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="My Photos" 
      />
      
      <FlatList
        data={photos}
        renderItem={renderPhotoItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.photosList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: colors.background,
  },
  photosList: {
    padding: spacing.regular,
  },
  photoCard: {
    overflow: 'hidden',
    marginBottom: spacing.regular,
    padding: 0, // override Card default padding
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
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.tiny,
  },
  likeCount: {
    marginLeft: spacing.tiny,
    color: colors.textSecondary,
    fontSize: typography.fontSizeSmall,
  },
  timestamp: {
    color: colors.textHint,
    fontSize: typography.fontSizeSmall,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.large,
  },
  emptyText: {
    fontSize: typography.fontSizeLarge,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.regular,
  },
  emptySubtext: {
    fontSize: typography.fontSizeMedium,
    color: colors.textSecondary,
    marginTop: spacing.small,
    textAlign: 'center',
  },
});

export default HomeTab;
