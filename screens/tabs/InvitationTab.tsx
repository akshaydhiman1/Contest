import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Alert,
  Platform,
  ListRenderItem
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Invitation {
  id: string;
  contestTitle: string;
  from: string;
  status: 'pending' | 'accepted' | 'declined';
  date: string;
}

// Sample data
const sampleInvitations: Invitation[] = [
  { 
    id: '1', 
    contestTitle: 'Wildlife Photography', 
    from: 'wildlife_enthusiast', 
    status: 'pending', 
    date: '2 days ago' 
  },
  { 
    id: '2', 
    contestTitle: 'Portrait Magic', 
    from: 'pro_photographer', 
    status: 'accepted', 
    date: '1 week ago' 
  },
  { 
    id: '3', 
    contestTitle: 'Urban Landscapes', 
    from: 'city_explorer', 
    status: 'declined', 
    date: '2 weeks ago' 
  }
];

type TabView = 'received' | 'send';

const InvitationTab = () => {
  const [activeTab, setActiveTab] = useState<TabView>('received');
  const [invitations, setInvitations] = useState<Invitation[]>(sampleInvitations);

  const handleAcceptInvitation = (id: string) => {
    setInvitations(invitations.map(inv => 
      inv.id === id ? { ...inv, status: 'accepted' } : inv
    ));
    Alert.alert('Success', 'Invitation accepted!');
  };

  const handleDeclineInvitation = (id: string) => {
    setInvitations(invitations.map(inv => 
      inv.id === id ? { ...inv, status: 'declined' } : inv
    ));
  };

  const handleSendInvitation = () => {
    Alert.alert(
      'Feature Coming Soon',
      'In a complete implementation, this would allow you to invite friends to your contests.'
    );
  };

  const renderInvitationItem: ListRenderItem<Invitation> = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.contestTitle}</Text>
        <View style={[
          styles.badge,
          item.status === 'accepted' ? styles.acceptedBadge :
          item.status === 'declined' ? styles.declinedBadge :
          styles.pendingBadge
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
            onPress={() => handleAcceptInvitation(item.id)}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.declineButton} 
            onPress={() => handleDeclineInvitation(item.id)}
          >
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
          onPress={() => setActiveTab('received')}
        >
          <Icon name="inbox" size={18} color={activeTab === 'received' ? '#2196F3' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'received' && styles.activeTabText]}>
            Received
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'send' && styles.activeTab]}
          onPress={() => setActiveTab('send')}
        >
          <Icon name="send" size={18} color={activeTab === 'send' ? '#2196F3' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'send' && styles.activeTabText]}>
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
          <Icon name="send" size={50} color="#2196F3" style={styles.sendIcon} />
          <Text style={styles.sendTitle}>Invite Friends to Contests</Text>
          <Text style={styles.sendDescription}>
            Select a contest and invite your friends to participate
          </Text>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendInvitation}
          >
            <Text style={styles.sendButtonText}>Create Invitation</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
        shadowOffset: { width: 0, height: 2 },
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
        shadowOffset: { width: 0, height: 1 },
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default InvitationTab;
