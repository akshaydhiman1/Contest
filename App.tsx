import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar, StyleSheet} from 'react-native';
import HomeScreen from './screens/HomeScreen';
import OTPScreen from './screens/OTPScreen';
import MainTabs from './screens/MainTabs';
import {colors, typography, getShadow, elevation} from './theme/theme';
import {AppProvider} from './context/AppContext';

export type RootStackParamList = {
  Home: undefined;
  OTP: {phoneNumber: string};
  Main: undefined;
};

// Customize the navigation theme to match our app theme
const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.cardBackground,
    text: colors.textPrimary,
    border: colors.divider,
    notification: colors.error,
  },
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <AppProvider>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <NavigationContainer theme={AppTheme}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerTitleStyle: {
              fontWeight: typography.fontWeightSemiBold as any,
              fontSize: typography.fontSizeLarge,
              color: colors.textPrimary,
            },
            headerTitleAlign: 'center',
            headerStyle: {
              ...getShadow(elevation.small),
              backgroundColor: colors.white,
            },
            contentStyle: {
              backgroundColor: colors.background,
            },
            headerShadowVisible: false, // We'll use our own shadow
          }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Sign In',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="OTP"
            component={OTPScreen}
            options={{
              title: 'Verification',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{
              headerShown: false,
              animation: 'fade',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;
