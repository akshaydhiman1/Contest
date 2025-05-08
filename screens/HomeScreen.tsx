import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import {
  colors,
  typography,
  spacing,
  roundness,
  getCardStyle,
} from '../theme/theme';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.28:5000';

// Test API connection
const testConnection = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    console.log('Server connection test:', response.data);
  } catch (error) {
    console.error('Server connection test failed:', error);
  }
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({navigation}: Props) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Test connection when component mounts
  useEffect(() => {
    testConnection();
  }, []);

  const handleSendOTP = () => {
    // Basic validation
    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    handleVerifyPhone();
  };

  const handleVerifyPhone = async () => {
    try {
      // Add +91 prefix if not present
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
      
      console.log('Attempting to verify phone:', formattedPhone);
      console.log('API URL:', `${API_BASE_URL}/api/users/verify-phone`);
      
      const response = await axios.post(
        `${API_BASE_URL}/api/users/verify-phone`,
        {
          phone: formattedPhone,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 5000, // 5 second timeout
        },
      );

      console.log('Response received:', response.data);
      if (response.data.success) {
        setError(null);
        navigation.navigate('OTP', {phoneNumber: formattedPhone});
      } else {
        setError(response.data.message || 'Verification failed');
      }
    } catch (err: any) {
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status,
      });
      
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please check your internet connection.');
      } else if (!err.response) {
        setError('Network error. Please check if the server is running.');
      } else if (err.response.status === 404) {
        setError('Phone number not found. Please try another number.');
      } else {
        setError(err.response?.data?.message || 'Failed to verify phone number. Please try again later.');
      }
    }
  };

  return (
    <LinearGradient
      colors={[colors.primaryLight, colors.primaryDark]}
      style={styles.background}>
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.label}>Enter Phone Number</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Input
            placeholder="Enter Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            containerStyle={styles.inputContainer}
          />
          <Button
            title="Send OTP"
            onPress={handleSendOTP}
            disabled={!phone}
            size="large"
            variant="primary"
            style={styles.button}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: spacing.screenPadding,
    justifyContent: 'center',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    ...getCardStyle(8, roundness.xlarge),
    padding: spacing.xxLarge,
    borderRadius: roundness.xlarge,
    backgroundColor: colors.white,
    shadowColor: colors.primary,
  },
  label: {
    fontSize: typography.fontSizeXXXLarge,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: spacing.medium,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: spacing.regular,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSizeSmall,
    textAlign: 'center',
    marginBottom: spacing.small,
  },
  button: {
    marginTop: spacing.medium,
    borderRadius: roundness.large,
  },
  phoneNumber: {
    fontSize: typography.fontSizeLarge,
    color: colors.primary,
    marginVertical: spacing.small,
    textAlign: 'center',
  },
});

export default HomeScreen;
