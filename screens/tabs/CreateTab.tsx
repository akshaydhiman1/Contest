import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Image,
  FlatList,
  KeyboardAvoidingView,
  ActivityIndicator,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppContext, VotingDuration, AppUser} from '../../context/AppContext';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

interface ContestFormData {
  title: string;
  description: string;
  images: string[];
  votingDuration: VotingDuration | null;
  invitees: {
    appUsers: AppUser[];
    phoneNumbers: string[];
  };
}

// Sample app users for testing
const sampleAppUsers: AppUser[] = [
  {
    id: '1',
    username: 'photo_lover',
    avatar: 'https://picsum.photos/id/1062/100/100',
  },
  {
    id: '2',
    username: 'creative_eye',
    avatar: 'https://picsum.photos/id/1005/100/100',
  },
  {
    id: '3',
    username: 'snap_master',
    avatar: 'https://picsum.photos/id/1025/100/100',
  },
  {
    id: '4',
    username: 'camera_pro',
    avatar: 'https://picsum.photos/id/1012/100/100',
  },
  {
    id: '5',
    username: 'lens_guru',
    avatar: 'https://picsum.photos/id/1074/100/100',
  },
];

const CreateTab = () => {
  const [formData, setFormData] = useState<ContestFormData>({
    title: '',
    description: '',
    images: [],
    votingDuration: null,
    invitees: {
      appUsers: [],
      phoneNumbers: [],
    },
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<{[id: string]: boolean}>(
    {},
  );
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: keyof ContestFormData, value: any) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const goToNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS handles permissions through Info.plist
    } catch (err) {
      console.warn('Camera permission error:', err);
      return false;
    }
  };

  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          Platform.Version >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to select photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS handles permissions through Info.plist
    } catch (err) {
      console.warn('Storage permission error:', err);
      return false;
    }
  };

  const handleCameraLaunch = async () => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Please grant camera permission in your device settings to take photos.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ],
        );
        return;
      }

      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: true,
        presentationStyle: 'fullScreen',
        cameraType: 'back',
      });

      if (result.didCancel) {
        console.log('User cancelled camera');
        return;
      }

      if (result.errorCode) {
        console.error('Camera Error:', result.errorMessage);
        Alert.alert('Error', 'Failed to capture image. Please try again.');
        return;
      }

      if (result.assets && result.assets[0]?.uri) {
        updateField('images', [...formData.images, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Camera Error:', error);
      Alert.alert('Error', 'Failed to access camera. Please try again.');
    }
  };

  const handleGalleryLaunch = async () => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Please grant storage permission in your device settings to select photos.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ],
        );
        return;
      }

      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
        presentationStyle: 'fullScreen',
      });

      if (result.didCancel) {
        console.log('User cancelled gallery picker');
        return;
      }

      if (result.errorCode) {
        console.error('Gallery Error:', result.errorMessage);
        Alert.alert('Error', 'Failed to select image. Please try again.');
        return;
      }

      if (result.assets && result.assets[0]?.uri) {
        updateField('images', [...formData.images, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Gallery Error:', error);
      Alert.alert('Error', 'Failed to access gallery. Please try again.');
    }
  };

  const handleAddImage = () => {
    Alert.alert(
      'Add Image',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: handleCameraLaunch,
        },
        {
          text: 'Choose from Gallery',
          onPress: handleGalleryLaunch,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };

  const toggleUserSelection = (userId: string) => {
    const newSelection = {...selectedUsers};
    newSelection[userId] = !newSelection[userId];
    setSelectedUsers(newSelection);

    const selectedAppUsers = sampleAppUsers.filter(
      user => newSelection[user.id],
    );
    updateField('invitees', {
      ...formData.invitees,
      appUsers: selectedAppUsers,
    });
  };

  // Get context functions
  const {addContest, addInvitations} = useAppContext();

  const finalizeContest = async () => {
    try {
      // Validation
      if (!formData.title.trim()) {
        Alert.alert('Error', 'Please enter a contest title');
        return;
      }

      if (!formData.description.trim()) {
        Alert.alert('Error', 'Please enter a contest description');
        return;
      }

      if (formData.images.length === 0) {
        Alert.alert('Error', 'Please add at least one image');
        return;
      }

      if (!formData.votingDuration) {
        Alert.alert('Error', 'Please select a voting duration');
        return;
      }

      setIsLoading(true);

      // Create new contest
      const newContest = {
        title: formData.title,
        description: formData.description,
        images: formData.images,
        votingDuration: formData.votingDuration as VotingDuration,
        creator: 'current_user', // In a real app, get this from auth
        timestamp: 'Just now',
        likes: 0,
        liked: false,
        comments: [],
      };

      // Add contest to context - this will call the API
      const createdContest = await addContest(newContest);

      // Create invitations for selected users
      if (formData.invitees.appUsers.length > 0) {
        // Add invitations to context with contestId and invitees
        await addInvitations(
          {
            appUsers: formData.invitees.appUsers,
            phoneNumbers: formData.invitees.phoneNumbers,
          },
          createdContest.id,
        );
      }

      // Simulate API call - will be replaced with real API calls
      setTimeout(() => {
        setIsLoading(false);

        Alert.alert(
          'Success!',
          `Contest "${formData.title}" created successfully!`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setFormData({
                  title: '',
                  description: '',
                  images: [],
                  votingDuration: null,
                  invitees: {
                    appUsers: [],
                    phoneNumbers: [],
                  },
                });
                setSelectedUsers({});
                setCurrentStep(1);
              },
            },
          ],
        );
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to create contest. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Creating contest...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}>
      <View style={styles.header}>
        <Icon name="plus-circle" size={22} color="#4CAF50" />
        <Text style={styles.title}>Create Contest</Text>
      </View>

      <View style={styles.stepIndicator}>
        {Array.from({length: totalSteps}).map((_, index) => (
          <View
            key={index}
            style={[
              styles.stepDot,
              currentStep >= index + 1 && styles.activeStepDot,
            ]}
          />
        ))}
      </View>

      <ScrollView style={styles.scrollContainer}>
        {currentStep === 1 ? (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Contest Basics</Text>

            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.textInput}
              value={formData.title}
              onChangeText={value => updateField('title', value)}
              placeholder="Enter contest title"
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, {minHeight: 100}]}
              value={formData.description}
              onChangeText={value => updateField('description', value)}
              placeholder="Describe your contest"
              multiline
            />

            <Text style={styles.inputLabel}>Images</Text>
            {formData.images.length > 0 && (
              <FlatList
                horizontal
                data={formData.images}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({item}) => (
                  <Image source={{uri: item}} style={styles.thumbnail} />
                )}
              />
            )}

            <TouchableOpacity style={styles.button} onPress={handleAddImage}>
              <Text style={styles.buttonText}>Add Image</Text>
            </TouchableOpacity>

            <View style={styles.navigationButtons}>
              <View style={{width: 80}} />
              <TouchableOpacity
                style={styles.nextButton}
                onPress={goToNextStep}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : currentStep === 2 ? (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Voting Duration</Text>

            <View>
              {(['12h', '24h', '48h', '72h', '7d'] as VotingDuration[]).map(
                duration => (
                  <TouchableOpacity
                    key={duration}
                    style={[
                      styles.durationOption,
                      formData.votingDuration === duration &&
                        styles.selectedDuration,
                    ]}
                    onPress={() => updateField('votingDuration', duration)}>
                    <Text style={styles.durationText}>
                      {duration === '7d' ? '7 Days' : duration}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>

            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={goToPrevStep}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={goToNextStep}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Invite Participants</Text>

            <Text style={styles.inviteDescription}>
              Choose how you would like to invite participants
            </Text>

            <View style={styles.inviteOptionsContainer}>
              <TouchableOpacity
                style={[
                  styles.inviteOption,
                  Object.values(selectedUsers).some(v => v) &&
                    styles.selectedInviteOption,
                ]}
                onPress={() => {
                  // Handle app users invitation
                }}>
                <Icon name="account-group" size={28} color="#4CAF50" />
                <Text style={styles.inviteOptionText}>App Users</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.inviteOption}
                onPress={() => {
                  // Handle WhatsApp invitation
                  Alert.alert(
                    'WhatsApp Invitation',
                    'This would open WhatsApp to invite people.',
                  );
                }}>
                <Icon name="whatsapp" size={28} color="#25D366" />
                <Text style={styles.inviteOptionText}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.inviteOption}
                onPress={() => {
                  // Handle text message invitation
                  Alert.alert(
                    'Text Message',
                    'This would send invitations via SMS.',
                  );
                }}>
                <Icon name="message-text" size={28} color="#9C27B0" />
                <Text style={styles.inviteOptionText}>Text Message</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.inviteOption}
                onPress={() => {
                  // Handle other sharing methods
                  Alert.alert('Share', 'This would open sharing options.');
                }}>
                <Icon name="share-variant" size={28} color="#FF9800" />
                <Text style={styles.inviteOptionText}>Other</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.appUsersContainer}>
              <Text style={styles.subSectionTitle}>App Users</Text>
              <FlatList
                data={sampleAppUsers}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={[
                      styles.userItemEnhanced,
                      selectedUsers[item.id] && styles.selectedUserItemEnhanced,
                    ]}
                    onPress={() => toggleUserSelection(item.id)}>
                    <Image
                      source={{uri: item.avatar}}
                      style={styles.userAvatar}
                    />
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{item.username}</Text>
                    </View>
                    {selectedUsers[item.id] ? (
                      <Icon name="check-circle" size={24} color="#4CAF50" />
                    ) : (
                      <Icon
                        name="checkbox-blank-circle-outline"
                        size={24}
                        color="#ddd"
                      />
                    )}
                  </TouchableOpacity>
                )}
                style={styles.usersList}
              />
            </View>

            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={goToPrevStep}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createButton}
                onPress={finalizeContest}>
                <Text style={styles.buttonText}>Create Contest</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  activeStepDot: {
    backgroundColor: '#4CAF50',
  },
  scrollContainer: {
    flex: 1,
  },
  stepContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    margin: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 16,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  thumbnail: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#757575',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  durationOption: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  durationText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDuration: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
  inviteDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  inviteOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  inviteOptionText: {
    marginTop: 8,
    fontWeight: '500',
    fontSize: 12,
    color: '#555',
  },
  selectedInviteOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  appUsersContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  userItemEnhanced: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedUserItemEnhanced: {
    backgroundColor: '#E8F5E9',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  usersList: {
    maxHeight: 300,
  },
});

// Export the component as default
export default CreateTab;
