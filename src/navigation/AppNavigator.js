import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';
import BottomTabBar from '../components/BottomTabBar';

// Screens
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import UsernameSelectScreen from '../screens/Auth/UsernameSelectScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import LocationSelectScreen from '../screens/Location/LocationSelectScreen';
import FilterScreen from '../screens/Filter/FilterScreen';
import AdUploadScreen from '../screens/AdUpload/AdUploadScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';

// Screens that show the bottom tab bar
const MAIN_TABS = ['HomeTab', 'Panels', 'Notifications', 'ProfileTab'];

export default function AppNavigator({ navigation }) {
  const [activeTab, setActiveTab] = useState('HomeTab');
  const currentRoute = navigation.currentRoute.name;

  const isMainScreen = MAIN_TABS.includes(currentRoute);

  const handleTabPress = (tabName) => {
    if (tabName === 'AddAd') {
      navigation.navigate('AdUpload');
      return;
    }
    setActiveTab(tabName);
    navigation.reset(tabName);
  };

  const renderScreen = () => {
    // For main tab screens
    if (isMainScreen) {
      switch (activeTab) {
        case 'HomeTab': return <HomeScreen navigation={navigation} />;
        case 'Panels': return <View style={styles.emptyScreen} />;
        case 'Notifications': return <View style={styles.emptyScreen} />;
        case 'ProfileTab': return <ProfileScreen navigation={navigation} />;
        default: return <HomeScreen navigation={navigation} />;
      }
    }

    // For non-tab screens
    switch (currentRoute) {
      case 'Onboarding': return <OnboardingScreen navigation={navigation} />;
      case 'Register': return <RegisterScreen navigation={navigation} />;
      case 'Login': return <LoginScreen navigation={navigation} />;
      case 'UsernameSelect': return <UsernameSelectScreen navigation={navigation} />;
      case 'ForgotPassword': return <ForgotPasswordScreen navigation={navigation} />;
      case 'LocationSelect': return <LocationSelectScreen navigation={navigation} />;
      case 'Filter': return <FilterScreen navigation={navigation} />;
      case 'AdUpload': return <AdUploadScreen navigation={navigation} />;
      case 'EditProfile': return <EditProfileScreen navigation={navigation} />;
      default: return <OnboardingScreen navigation={navigation} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>
      {isMainScreen && (
        <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  emptyScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
