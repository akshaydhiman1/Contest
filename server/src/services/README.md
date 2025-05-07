# Contest App API Integration Guide

This guide explains how to integrate the backend API with the React Native frontend for the Contest App.

## Services Overview

The API services are located in `apiService.js` and provide methods to interact with the backend API. There are two main service objects:

1. `invitationService` - Methods for handling contest invitations
2. `contestService` - Methods for handling contests

## Usage in React Native Components

### Importing the Services

```javascript
import { invitationService, contestService } from '../path/to/services/apiService';
```

### Integration with CreateTab.tsx

The `CreateTab.tsx` component can use the `contestService` to create contests and send invitations.

```javascript
// Example integration for contest creation with invitations
const handleCreateContest = async () => {
  try {
    // Get the authentication token (from context or storage)
    const token = authContext.token;
    
    // Prepare the contest data
    const contestData = {
      title: formData.title,
      description: formData.description,
      images: formData.images,
      votingDuration: formData.votingDuration,
      invitees: {
        appUsers: formData.invitees.appUsers,
        phoneNumbers: formData.invitees.phoneNumbers
      }
    };
    
    // Create the contest
    const createdContest = await contestService.createContest(contestData, token);
    
    console.log('Contest created successfully:', createdContest);
    
    // Reset form and navigate to home or contest detail
    resetForm();
    navigation.navigate('Home');
  } catch (error) {
    console.error('Error creating contest:', error);
    Alert.alert('Error', 'Failed to create contest. Please try again.');
  }
};
```

### Integration with InvitationTab.tsx

The `InvitationTab.tsx` component can use the `invitationService` to fetch, accept, decline, or manage invitations.

```javascript
// Example integration for fetching and responding to invitations

// Fetch received invitations
const fetchReceivedInvitations = async () => {
  try {
    // Get the authentication token (from context or storage)
    const token = authContext.token;
    
    setLoading(true);
    const receivedInvitations = await invitationService.getReceivedInvitations(token);
    setInvitations(receivedInvitations);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching invitations:', error);
    setLoading(false);
    Alert.alert('Error', 'Failed to fetch invitations. Please try again.');
  }
};

// Accept invitation
const handleAcceptInvitation = async (id) => {
  try {
    // Get the authentication token (from context or storage)
    const token = authContext.token;
    
    await invitationService.respondToInvitation(id, 'accepted', token);
    
    // Update the local state
    setInvitations(invitations.map(inv => 
      inv.id === id ? { ...inv, status: 'accepted' } : inv
    ));
    
    Alert.alert('Success', 'Invitation accepted!');
  } catch (error) {
    console.error('Error accepting invitation:', error);
    Alert.alert('Error', 'Failed to accept invitation. Please try again.');
  }
};

// Decline invitation
const handleDeclineInvitation = async (id) => {
  try {
    // Get the authentication token (from context or storage)
    const token = authContext.token;
    
    await invitationService.respondToInvitation(id, 'declined', token);
    
    // Update the local state
    setInvitations(invitations.map(inv => 
      inv.id === id ? { ...inv, status: 'declined' } : inv
    ));
  } catch (error) {
    console.error('Error declining invitation:', error);
    Alert.alert('Error', 'Failed to decline invitation. Please try again.');
  }
};
```

### Integration with WhatsApp, SMS, and Other Invitation Methods

For WhatsApp, SMS and other external invitation methods, you may need to use React Native's Linking API:

```javascript
import { Linking } from 'react-native';

// WhatsApp invitation
const sendWhatsAppInvitation = async (phoneNumber, message) => {
  const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  
  try {
    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        'Error',
        'WhatsApp is not installed on this device',
        [{ text: 'OK' }]
      );
    }
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
  }
};

// SMS invitation
const sendSMSInvitation = async (phoneNumber, message) => {
  const url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
  
  try {
    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        'Error',
        'SMS is not supported on this device',
        [{ text: 'OK' }]
      );
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};
```

## Error Handling

All service methods include error handling and will throw exceptions with appropriate error messages. Always wrap API calls in try/catch blocks to handle potential errors gracefully.

## Authentication

The API services assume an authentication token is available. In a real application, this would be obtained through a login process and stored securely. The token should be passed to each API method.

## API Base URL

The API base URL is set to `http://localhost:5000/api` by default. For production, you would update this to your deployed API endpoint.
