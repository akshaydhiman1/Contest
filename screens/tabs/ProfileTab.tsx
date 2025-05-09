import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppContext} from '../../context/AppContext';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {API_URL} from '../../config/constants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface UserProfile {
  name: string;
  username: string;
  email: string;
  bio: string;
  followers: number;
  following: number;
  contests: number;
  profileImage: string;
}

interface Setting {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'action';
  value?: boolean;
  icon: string;
  iconColor: string;
}

const initialSettings: Setting[] = [
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Receive contest updates and invitation alerts',
    type: 'toggle',
    value: true,
    icon: 'bell',
    iconColor: '#FF9800'
  },
  {
    id: 'darkMode',
    title: 'Dark Mode',
    description: 'Switch between light and dark theme',
    type: 'toggle',
    value: false,
    icon: 'theme-light-dark',
    iconColor: '#607D8B'
  },
  {
    id: 'privacy',
    title: 'Privacy Settings',
    description: 'Manage who can see your profile and photos',
    type: 'action',
    icon: 'shield-account',
    iconColor: '#4CAF50'
  },
  {
    id: 'help',
    title: 'Help & Support',
    description: 'Get help with any issues you encounter',
    type: 'action',
    icon: 'help-circle',
    iconColor: '#2196F3'
  },
  {
    id: 'logout',
    title: 'Logout',
    description: 'Sign out from your account',
    type: 'action',
    icon: 'logout',
    iconColor: '#F44336'
  }
];

const ProfileTab = () => {
  const {user, logout} = useAppContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<Setting[]>(initialSettings);
  const [activeSection, setActiveSection] = useState<'profile' | 'settings'>('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      console.log('Fetching profile for user:', user.id);
      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user.id
        }
      });

      console.log('Profile response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user profile');
      }

      const result = await response.json();
      console.log('Profile response data:', result);

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch user profile');
      }

      const userData = result.data;
      
      setProfile({
        name: userData.username || 'User',
        username: userData.username || 'user',
        email: userData.email || 'No email provided',
        bio: userData.bio || 'No bio provided',
        followers: userData.followers?.length || 0,
        following: userData.following?.length || 0,
        contests: userData.contests?.length || 0,
        profileImage: userData.avatar || 'https://picsum.photos/id/64/300/300'
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert(
        'Error',
        'Failed to load profile data. Please try again.',
        [
          {
            text: 'Retry',
            onPress: fetchUserProfile
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSetting = (id: string) => {
    if (id === 'darkMode') {
      const newDarkMode = !isDarkMode;
      setIsDarkMode(newDarkMode);
      setSettings(settings.map(setting => 
        setting.id === 'darkMode'
          ? {...setting, value: newDarkMode}
          : setting
      ));
      // Here you would typically update your app's theme
    } else {
      setSettings(settings.map(setting => 
        setting.id === id && setting.type === 'toggle'
          ? {...setting, value: !setting.value}
          : setting
      ));
    }
  };

  const handleSettingAction = (id: string) => {
    if (id === 'logout') {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Logout',
            style: 'destructive',
            onPress: () => {
              logout();
              navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
              });
            },
          },
        ],
      );
    } else {
      Alert.alert(
        'Coming Soon',
        'This feature will be available in a future update.',
      );
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Profile Edit', 'This feature will be available in a future update.');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9C27B0" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={48} color="#9C27B0" />
        <Text style={styles.errorText}>Failed to load profile data</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchUserProfile}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderProfileSection = () => (
    <ScrollView contentContainerStyle={styles.profileScrollContent}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image source={{uri: profile.profileImage}} style={styles.profileImage} />
        </View>
        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.username}>@{profile.username}</Text>
        <Text style={styles.bio}>{profile.bio}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.following}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.contests}</Text>
          <Text style={styles.statLabel}>Contests</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Icon name="email" size={20} color="#555" />
          <Text style={styles.infoText}>{profile.email}</Text>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="image" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>My Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="trophy" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>My Contests</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderSettingsSection = () => (
    <ScrollView contentContainerStyle={styles.settingsScrollContent}>
      {settings.map(setting => (
        <View key={setting.id} style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Icon name={setting.icon} size={24} color={setting.iconColor} />
          </View>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>{setting.title}</Text>
            <Text style={styles.settingDescription}>{setting.description}</Text>
          </View>
          {setting.type === 'toggle' ? (
            <Switch
              value={setting.id === 'darkMode' ? isDarkMode : setting.value}
              onValueChange={() => handleToggleSetting(setting.id)}
              trackColor={{false: '#d0d0d0', true: '#a0cfff'}}
              thumbColor={setting.id === 'darkMode' ? (isDarkMode ? '#2196F3' : '#f4f3f4') : (setting.value ? '#2196F3' : '#f4f3f4')}
            />
          ) : (
            <TouchableOpacity 
              onPress={() => handleSettingAction(setting.id)} 
              style={styles.settingActionButton}
            >
              <Icon name="chevron-right" size={24} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <Icon name="account" size={22} color="#9C27B0" />
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>Profile</Text>
      </View>
      
      <View style={[styles.tabs, isDarkMode && styles.darkTabs]}>
        <TouchableOpacity
          style={[styles.tab, activeSection === 'profile' && styles.activeTab]}
          onPress={() => setActiveSection('profile')}
        >
          <Icon
            name="account"
            size={18}
            color={activeSection === 'profile' ? '#9C27B0' : (isDarkMode ? '#fff' : '#666')}
          />
          <Text
            style={[
              styles.tabText,
              activeSection === 'profile' && styles.activeTabText,
              isDarkMode && styles.darkText
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeSection === 'settings' && styles.activeTab]}
          onPress={() => setActiveSection('settings')}
        >
          <Icon
            name="cog"
            size={18}
            color={activeSection === 'settings' ? '#9C27B0' : (isDarkMode ? '#fff' : '#666')}
          />
          <Text
            style={[
              styles.tabText,
              activeSection === 'settings' && styles.activeTabText,
              isDarkMode && styles.darkText
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeSection === 'profile' ? renderProfileSection() : renderSettingsSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  darkHeader: {
    backgroundColor: '#1e1e1e',
    borderBottomColor: '#333',
  },
  headerTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  darkTabs: {
    backgroundColor: '#1e1e1e',
    borderBottomColor: '#333',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#9C27B0',
  },
  tabText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#9C27B0',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#9C27B0',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileScrollContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 0,
    backgroundColor: 'white',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  username: {
    fontSize: 16,
    color: '#777',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 15,
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#777',
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#e0e0e0',
  },
  editButton: {
    backgroundColor: '#9C27B0',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 20,
    alignSelf: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: 'white',
    marginTop: 20,
    padding: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  actionButton: {
    backgroundColor: '#673AB7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
  },
  settingsScrollContent: {
    padding: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#777',
  },
  settingActionButton: {
    padding: 4,
  },
});

export default ProfileTab;
