import React, { useState } from 'react';
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
  KeyboardAvoidingView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type VotingDuration = '12h' | '24h' | '48h' | '72h' | '7d';

interface ContestFormData {
  title: string;
  description: string;
  images: string[];
  votingDuration: VotingDuration | null;
}

const CreateTab = () => {
  const [formData, setFormData] = useState<ContestFormData>({
    title: '',
    description: '',
    images: [],
    votingDuration: null
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const updateField = (field: keyof ContestFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Contest title is required');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Contest description is required');
      return false;
    }
    if (formData.images.length === 0) {
      Alert.alert('Error', 'Please upload at least one image');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.votingDuration) {
      Alert.alert('Error', 'Please select a voting duration');
      return false;
    }
    return true;
  };

  const goToNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddImage = () => {
    // In a real app, this would open an image picker
    Alert.alert(
      "Upload Image", 
      "In a complete implementation, this would open your camera or photo gallery.",
      [
        {
          text: "Simulate Upload",
          onPress: () => {
            // Simulate uploading by setting a sample image URL
            const newImage = `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/500/300`;
            updateField('images', [...formData.images, newImage]);
          }
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };
  
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    updateField('images', updatedImages);
  };

  const createContest = () => {
    if (validateStep2()) {
      // In a real app, would submit to a backend
      Alert.alert(
        'Success!',
        `Contest "${formData.title}" created successfully! It will be open for voting for ${formData.votingDuration}.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFormData({
                title: '',
                description: '',
                images: [],
                votingDuration: null
              });
              setCurrentStep(1);
            }
          }
        ]
      );
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Contest Basics</Text>
      
      <Text style={styles.inputLabel}>Contest Title</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter a catchy title"
        value={formData.title}
        onChangeText={(value) => updateField('title', value)}
      />
      
      <Text style={styles.inputLabel}>Description</Text>
      <TextInput
        style={[styles.textInput, styles.textArea]}
        placeholder="What is this contest about?"
        value={formData.description}
        onChangeText={(value) => updateField('description', value)}
        multiline={true}
        numberOfLines={4}
      />
      
      <Text style={styles.inputLabel}>Images</Text>
      <Text style={styles.helperText}>Upload multiple images for your contest</Text>
      
      {formData.images.length > 0 && (
        <FlatList
          data={formData.images}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.imageList}
          renderItem={({ item, index }) => (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item }}
                style={styles.thumbnail}
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveImage(index)}
              >
                <Icon name="close-circle" size={24} color="#F44336" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      
      <TouchableOpacity 
        style={styles.uploadButton} 
        onPress={handleAddImage}
      >
        <Icon name="image-plus" size={24} color="#666" />
        <Text style={styles.uploadButtonText}>
          {formData.images.length === 0 
            ? "Upload Images" 
            : "Add More Images"}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.navigationButtons}>
        <View style={styles.placeholder} />
        <TouchableOpacity
          style={styles.nextButton}
          onPress={goToNextStep}
        >
          <Text style={styles.buttonText}>Continue</Text>
          <Icon name="arrow-right" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Voting Duration</Text>
      
      <Text style={styles.instructionText}>
        Select how long the voting period should last after the contest closes for submissions:
      </Text>
      
      <View style={styles.durationOptions}>
        {[
          { value: '12h', label: '12 Hours' },
          { value: '24h', label: '24 Hours' },
          { value: '48h', label: '48 Hours' },
          { value: '72h', label: '72 Hours' },
          { value: '7d', label: '7 Days' }
        ].map(option => (
          <TouchableOpacity 
            key={option.value}
            style={[
              styles.durationOption,
              formData.votingDuration === option.value && styles.selectedDuration
            ]}
            onPress={() => updateField('votingDuration', option.value as VotingDuration)}
          >
            <Text 
              style={[
                styles.durationText,
                formData.votingDuration === option.value && styles.selectedDurationText
              ]}
            >
              {option.label}
            </Text>
            {formData.votingDuration === option.value && (
              <Icon name="check-circle" size={20} color="#fff" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goToPrevStep}
        >
          <Icon name="arrow-left" size={16} color="#333" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.createButton}
          onPress={createContest}
        >
          <Icon name="check" size={16} color="#fff" />
          <Text style={styles.buttonText}>Create Contest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <Icon name="plus-circle" size={22} color="#4CAF50" />
        <Text style={styles.title}>Create Contest</Text>
      </View>
      
      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.stepDot,
              currentStep >= index + 1 && styles.activeStepDot
            ]}
          />
        ))}
      </View>
      
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
      >
        {currentStep === 1 ? renderStep1() : renderStep2()}
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  stepContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imageList: {
    paddingVertical: 10,
  },
  imageContainer: {
    marginRight: 10,
    position: 'relative',
  },
  thumbnail: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: '#666',
    marginLeft: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  durationOptions: {
    marginBottom: 20,
  },
  durationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  selectedDuration: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  durationText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  selectedDurationText: {
    color: '#fff',
  },
  checkIcon: {
    marginLeft: 10,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginHorizontal: 6,
  },
  backButtonText: {
    color: '#333',
    fontWeight: 'bold',
    marginHorizontal: 6,
  },
  placeholder: {
    width: 70,
  }
});

export default CreateTab;
