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
  ActivityIndicator,
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
import {API_URL} from '../../config/constants';

interface Contest {
  _id: string;
  title: string;
  description: string;
  images: string[];
  creator: {
  username: string;
    avatar: string;
  };
  votingDuration: string;
  startDate: string;
  status: string;
  participants: Array<{
  username: string;
    avatar: string;
  }>;
  createdAt: string;
}

const HomeTab = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);
      console.log('Fetching all contests from:', `${API_URL}/api/contests/all`);
      const response = await fetch(`${API_URL}/api/contests/all`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to fetch contests');
      }

      const result = await response.json();
      console.log('Contests fetched:', result);

      if (!result.success) {
        console.error('Unsuccessful response:', result);
        throw new Error(result.message || 'Failed to fetch contests');
      }

      setContests(result.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching contests:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch contests');
    } finally {
      setLoading(false);
    }
  };

  const renderContestItem: ListRenderItem<Contest> = ({item}) => (
    <Card style={styles.contestCard} elevationLevel={elevation.small}>
      <View style={styles.contestHeader}>
        <Image
          source={{uri: item.creator.avatar}}
          style={styles.creatorAvatar}
        />
        <Text style={styles.creatorName}>{item.creator.username}</Text>
      </View>

      <Image
        source={{uri: item.images[0]}}
        style={styles.contestImage}
        onError={() => {
          console.log(`Failed to load image: ${item.images[0]}`);
        }}
      />

      <View style={styles.contestInfo}>
        <Text style={styles.contestTitle}>{item.title}</Text>
        <Text style={styles.contestDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.contestMeta}>
          <View style={styles.metaItem}>
            <Icon name="account-group" size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>
              {item.participants.length} participants
            </Text>
            </View>
          <View style={styles.metaItem}>
            <Icon name="clock-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>{item.votingDuration}</Text>
          </View>
        </View>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Retry"
          onPress={fetchContests}
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <Header title="Discover Contests" />

      <FlatList
        data={contests}
        renderItem={renderContestItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.contestsList}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.regular,
  },
  errorText: {
    color: colors.error,
    marginBottom: spacing.regular,
    textAlign: 'center',
  },
  retryButton: {
    minWidth: 120,
  },
  contestsList: {
    padding: spacing.regular,
  },
  contestCard: {
    overflow: 'hidden',
    marginBottom: spacing.regular,
  },
  contestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.regular,
  },
  creatorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: spacing.small,
  },
  creatorName: {
    fontSize: typography.fontSizeSmall,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  contestImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  contestInfo: {
    padding: spacing.regular,
  },
  contestTitle: {
    fontSize: typography.fontSizeLarge,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.small,
  },
  contestDescription: {
    fontSize: typography.fontSizeRegular,
    color: colors.textSecondary,
    marginBottom: spacing.regular,
  },
  contestMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.grey200,
    paddingTop: spacing.small,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: spacing.tiny,
    fontSize: typography.fontSizeSmall,
    color: colors.textSecondary,
  },
});

export default HomeTab;
