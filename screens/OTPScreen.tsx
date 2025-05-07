import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { colors, typography, spacing, roundness, getCardStyle } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'OTP'>;

const OTPScreen = ({ route, navigation }: Props) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState('');

  useEffect(() => {
    // Simulate OTP sent
    console.log(`Simulating OTP sent to ${phoneNumber}`);
  }, [phoneNumber]);

  const handleVerifyOTP = () => {
    navigation.replace('Main');
  };

  return (
    <LinearGradient
      colors={[colors.secondaryLight, colors.secondaryDark]}
      style={styles.background}
    >
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>A verification code has been sent to {phoneNumber}</Text>
          <Input
            placeholder="Enter OTP"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            containerStyle={styles.inputContainer}
          />
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
  inputContainer: {
    marginBottom: spacing.regular,
  },
  button: {
    marginTop: spacing.small,
    borderRadius: roundness.large,
  },
});

export default OTPScreen;
