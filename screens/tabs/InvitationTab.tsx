import React, {useState, useEffect} from 'react';
import {useAppContext, Invitation} from '../../context/AppContext';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  ListRenderItem,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Invitation type is imported from context

type TabView = 'received' | 'send';

const InvitationTab = () => {
  const [activeTab, setActiveTab] = useState<TabView>('received');
  const {invitations, updateInvitationStatus} = useAppContext();

  const handleAcceptInvitation = (id: string) => {
    updateInvitationStatus(id, 'accepted');
    Alert.alert('Success', 'Invitation accepted!');
  };

  const handleDeclineInvitation = (id: string) => {
    updateInvitationStatus(id, 'declined');
  };

  // Mock data for app users
  const appUsers = [
    {id: 'u1', name: 'Alex Johnson', username: '@alexj', avatar: '👨‍💼'},
    {id: 'u2', name: 'Sarah Williams', username: '@sarahw', avatar: '👩‍💼'},
    {id: 'u3', name: 'Michael Brown', username: '@mikebrown', avatar: '👨‍🦱'},
    {id: 'u4', name: 'Emma Davis', username: '@emmad', avatar: '👩‍🦰'},
    {id: 'u5', name: 'James Wilson', username: '@jamesw', avatar: '👨‍🦲'},
  ];

  const [searchText, setSearchText] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [inviteMethod, setInviteMethod] = useState<string | null>(null);

  // Filter users based on search
  const filteredUsers = searchText
    ? appUsers.filter(
        user =>
          user.name.toLowerCase().includes(searchText.toLowerCase()) ||
          user.username.toLowerCase().includes(searchText.toLowerCase()),
      )
    : appUsers;

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId],
    );
  };

  const handleInviteMethodSelect = (method: string) => {
    setInviteMethod(method);

    // Simulating invitation based on method
    if (method === 'whatsapp') {
      Alert.alert('WhatsApp', 'Opening WhatsApp to invite participants...');
    } else if (method === 'sms') {
      Alert.alert('SMS', 'Opening text messaging to invite participants...');
    } else if (method === 'app') {
      if (selectedUsers.length > 0) {
        Alert.alert(
          'App Invitation',
          `Invitations sent to ${selectedUsers.length} participants!`,
        );
      } else {
        Alert.alert(
          'Select Users',
          'Please select at least one user to invite.',
        );
      }
    } else {
      Alert.alert('Share', 'Opening share dialog to invite participants...');
    }
  };

  const renderInvitationItem: ListRenderItem<Invitation> = ({item}) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.contestTitle}</Text>
        <View
          style={[
            styles.badge,
            item.status === 'accepted'
              ? styles.acceptedBadge
              : item.status === 'declined'
              ? styles.declinedBadge
              : styles.pendingBadge,
          ]}>
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.senderText}>From: {item.from}</Text>
      <Text style={styles.dateText}>{item.date}</Text>

      {item.status === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAcceptInvitation(item.id)}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.declineButton}
            onPress={() => handleDeclineInvitation(item.id)}>
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="email" size={22} color="#2196F3" />
        <Text style={styles.headerTitle}>Invitations</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'received' && styles.activeTab]}
          onPress={() => setActiveTab('received')}>
          <Icon
            name="inbox"
            size={18}
            color={activeTab === 'received' ? '#2196F3' : '#666'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'received' && styles.activeTabText,
            ]}>
            Received
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'send' && styles.activeTab]}
          onPress={() => setActiveTab('send')}>
          <Icon
            name="send"
            size={18}
            color={activeTab === 'send' ? '#2196F3' : '#666'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'send' && styles.activeTabText,
            ]}>
            Send
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'received' ? (
        <FlatList
          data={invitations}
          renderItem={renderInvitationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.sendContainer}>
          <Text style={styles.sendTitle}>Invite Participants</Text>
          <Text style={styles.sendDescription}>
            Choose how you would like to invite participants
          </Text>

          <View style={styles.inviteOptionsContainer}>
            <TouchableOpacity
              style={[
                styles.inviteOption,
                inviteMethod === 'app' && styles.selectedInviteOption,
              ]}
              onPress={() => setInviteMethod('app')}>
              <Icon name="account-group" size={28} color="#2196F3" />
              <Text style={styles.inviteOptionText}>App Users</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.inviteOption,
                inviteMethod === 'whatsapp' && styles.selectedInviteOption,
              ]}
              onPress={() => handleInviteMethodSelect('whatsapp')}>
              <Icon name="whatsapp" size={28} color="#25D366" />
              <Text style={styles.inviteOptionText}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.inviteOption,
                inviteMethod === 'sms' && styles.selectedInviteOption,
              ]}
              onPress={() => handleInviteMethodSelect('sms')}>
              <Icon name="message-text" size={28} color="#9C27B0" />
              <Text style={styles.inviteOptionText}>Text Message</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.inviteOption,
                inviteMethod === 'other' && styles.selectedInviteOption,
              ]}
              onPress={() => handleInviteMethodSelect('other')}>
              <Icon name="share-variant" size={28} color="#FF9800" />
              <Text style={styles.inviteOptionText}>Other</Text>
            </TouchableOpacity>
          </View>

          {inviteMethod === 'app' && (
            <View style={styles.appUsersContainer}>
              <View style={styles.searchContainer}>
                <Icon
                  name="magnify"
                  size={20}
                  color="#999"
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search users..."
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>

              {selectedUsers.length > 0 && (
                <View style={styles.selectedUsersContainer}>
                  <Text style={styles.selectedUsersTitle}>
                    Selected ({selectedUsers.length})
                  </Text>
                  <FlatList
                    data={appUsers.filter(user =>
                      selectedUsers.includes(user.id),
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        style={styles.selectedUserBadge}
                        onPress={() => handleSelectUser(item.id)}>
                        <Text style={styles.selectedUserAvatar}>
                          {item.avatar}
                        </Text>
                        <Text style={styles.selectedUserName}>
                          {item.name.split(' ')[0]}
                        </Text>
                        <Icon
                          name="close-circle"
                          size={16}
                          color="#fff"
                          style={styles.removeUserIcon}
                        />
                      </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.selectedUsersList}
                  />
                </View>
              )}

              <FlatList
                data={filteredUsers}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={[
                      styles.userItem,
                      selectedUsers.includes(item.id) &&
                        styles.selectedUserItem,
                    ]}
                    onPress={() => handleSelectUser(item.id)}>
                    <Text style={styles.userAvatar}>{item.avatar}</Text>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{item.name}</Text>
                      <Text style={styles.userUsername}>{item.username}</Text>
                    </View>
                    {selectedUsers.includes(item.id) && (
                      <Icon
                        name="check-circle"
                        size={24}
                        color="#4CAF50"
                        style={styles.checkIcon}
                      />
                    )}
                  </TouchableOpacity>
                )}
                style={styles.usersList}
              />

              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => handleInviteMethodSelect('app')}>
                <Text style={styles.sendButtonText}>Send Invitations</Text>
                <Icon
                  name="send"
                  size={16}
                  color="#fff"
                  style={styles.sendButtonIcon}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Existing styles
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  headerTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
    borderBottomColor: '#2196F3',
  },
  tabText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  listContent: {
    padding: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: '#FFF9C4',
  },
  acceptedBadge: {
    backgroundColor: '#E8F5E9',
  },
  declinedBadge: {
    backgroundColor: '#FFEBEE',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  senderText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  declineButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  sendContainer: {
    flex: 1,
    padding: 16,
  },
  sendIcon: {
    marginBottom: 16,
  },
  sendTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sendDescription: {
    color: '#666',
    marginBottom: 24,
  },
  inviteOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  inviteOption: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '22%',
    paddingVertical: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedInviteOption: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  inviteOptionText: {
    marginTop: 8,
    fontWeight: '500',
    fontSize: 12,
  },
  appUsersContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  usersList: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedUserItem: {
    backgroundColor: '#E3F2FD',
  },
  userAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  userUsername: {
    fontSize: 14,
    color: '#666',
  },
  checkIcon: {
    marginLeft: 8,
  },
  selectedUsersContainer: {
    marginBottom: 16,
  },
  selectedUsersTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#666',
  },
  selectedUsersList: {
    paddingBottom: 8,
  },
  selectedUserBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  selectedUserAvatar: {
    fontSize: 16,
    marginRight: 4,
    color: '#fff',
  },
  selectedUserName: {
    color: '#fff',
    fontWeight: '500',
    marginRight: 4,
  },
  removeUserIcon: {
    marginLeft: 2,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  sendButtonIcon: {
    marginLeft: 4,
  },
});

export default InvitationTab;
