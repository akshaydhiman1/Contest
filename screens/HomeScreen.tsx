import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { colors, typography, spacing, roundness, getCardStyle } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const [phone, setPhone] = useState('');

  const handleSendOTP = () => {
    navigation.navigate('OTP', { phoneNumber: phone });
  };

  return (
    <LinearGradient
      colors={[colors.primaryLight, colors.primaryDark]}
      style={styles.background}
    >
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.label}>Enter Phone Number</Text>
          <Input
            placeholder="e.g. 1234567890"
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
  button: {
    marginTop: spacing.medium,
    borderRadius: roundness.large,
  },
});

export default HomeScreen;
