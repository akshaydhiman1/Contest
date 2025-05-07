import React, {useState} from 'react';
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

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({navigation}: Props) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

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
      const response = await axios.post(
        'http://localhost:5000/api/verify-phone',
        {
          phone_number: phone,
        },
      );

      if (response.data.success) {
        setError(null);
        navigation.navigate('OTP', {phoneNumber: phone});
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error verifying phone number:', err);
      setError('Failed to verify phone number. Please try again later.');
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
