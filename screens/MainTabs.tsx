import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeTab from './tabs/HomeTab';
import ContestTab from './tabs/ContestTab';
import CreateTab from './tabs/CreateTab';
import InvitationTab from './tabs/InvitationTab';
import ProfileTab from './tabs/ProfileTab';
import { colors, elevation, getShadow } from '../theme/theme';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Contest':
              iconName = 'camera';
              break;
            case 'Create':
              iconName = 'plus-circle';
              break;
            case 'Invitation':
              iconName = 'email';
              break;
            case 'Profile':
              iconName = 'account';
              break;
            default:
              iconName = 'help-circle';
          }

          return (
            <View style={focused ? styles.activeIconContainer : styles.iconContainer}>
              <Icon name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          ...getShadow(elevation.medium),
          borderTopWidth: 0,
          backgroundColor: colors.white,
          height: 60,
          paddingBottom: 8, // Add some bottom padding for better touch area
          paddingTop: 8,    // Add padding at the top for better alignment
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeTab} />
      <Tab.Screen name="Contest" component={ContestTab} />
      <Tab.Screen name="Create" component={CreateTab} />
      <Tab.Screen name="Invitation" component={InvitationTab} />
      <Tab.Screen name="Profile" component={ProfileTab} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '15', // 15% opacity of primary color
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default MainTabs;
