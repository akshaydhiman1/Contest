import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import {useAppContext} from '../context/AppContext';
import {
  colors,
  typography,
  spacing,
  roundness,
  getCardStyle,
} from '../theme/theme';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://192.168.1.28:5000';

type Props = NativeStackScreenProps<RootStackParamList, 'OTP'>;

const OTPScreen = ({route, navigation}: Props) => {
  const {phoneNumber} = route.params;
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [testOTP, setTestOTP] = useState<string | null>(null);
  const {login} = useAppContext();

  useEffect(() => {
    const fetchOTP = async () => {
      try {
        console.log('Fetching OTP for phone:', phoneNumber);
        const response = await axios.get(`${API_BASE_URL}/api/users`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Users response:', response.data);
        const user = response.data.data.find(
          (user: any) => user.phone === phoneNumber,
        );
        if (user) {
          console.log('Found user:', user);
          setTestOTP(user.otp);
        } else {
          console.log('User not found in response data');
          setError('User not found.');
        }
      } catch (err) {
        console.error('Error fetching OTP:', err);
        setError('Failed to fetch OTP. Please try again later.');
      }
    };

    fetchOTP();
  }, [phoneNumber]);

  const handleVerifyOTP = async () => {
    try {
      console.log('Verifying OTP - Phone:', phoneNumber, 'OTP:', otp);
      const response = await axios.post(
        `${API_BASE_URL}/api/users/verify-otp`,
        {
          phone: phoneNumber,
          otp,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('OTP verification response:', response.data);

      if (response.data.success) {
        setError(null);
        // Set user state with the verified user data
        const userData = {
          id: response.data.user._id,
          username: response.data.user.username,
          avatar: response.data.user.avatar,
          phone: response.data.user.phone,
          email: response.data.user.email,
          isVerified: response.data.user.isVerified,
        };
        console.log('Setting user data:', userData);
        login(userData);
        navigation.replace('Main');
      } else {
        console.log('OTP verification failed:', response.data.message);
        setError(response.data.message || 'Verification failed');
      }
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(
        err.response?.data?.message || 
        'Failed to verify OTP. Please try again later.'
      );
    }
  };

  return (
    <LinearGradient
      colors={[colors.secondaryLight, colors.secondaryDark]}
      style={styles.background}>
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>
            A verification code has been sent to {phoneNumber}
          </Text>
          {testOTP && (
            <Text style={styles.testOTP}>
              Test OTP: {testOTP}
            </Text>
          )}
          <Input
            placeholder="Enter OTP"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            containerStyle={styles.inputContainer}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            title="Verify OTP"
            onPress={handleVerifyOTP}
            disabled={!otp}
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
    padding: spacing.xxLarge,
    justifyContent: 'center',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    ...getCardStyle(6, roundness.xlarge),
    padding: spacing.cardPadding,
    borderRadius: roundness.xlarge,
    backgroundColor: colors.white,
    shadowColor: colors.primary,
  },
  title: {
    fontSize: typography.fontSizeXXLarge,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: spacing.small,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSizeMedium,
    color: colors.textSecondary,
    marginBottom: spacing.regular,
    textAlign: 'center',
  },
  testOTP: {
    fontSize: typography.fontSizeMedium,
    color: colors.primary,
    marginBottom: spacing.regular,
    textAlign: 'center',
    fontWeight: '600',
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
    marginTop: spacing.small,
    borderRadius: roundness.large,
  },
});

export default OTPScreen;
