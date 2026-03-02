import React, { useState } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator, useWindowDimensions } from 'react-native';
import { colors } from '../theme';
import BottomTabBar from '../components/BottomTabBar';
import WebSidebar from '../components/WebSidebar';
import CreateActionModal from '../components/CreateActionModal';

// Screens
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import UsernameSelectScreen from '../screens/Auth/UsernameSelectScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
import EmailVerifiedScreen from '../screens/Auth/EmailVerifiedScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import LocationSelectScreen from '../screens/Location/LocationSelectScreen';
import FilterScreen from '../screens/Filter/FilterScreen';
import AdUploadScreen from '../screens/AdUpload/AdUploadScreen';
import AdDetailScreen from '../screens/AdDetail/AdDetailScreen';
import PanelsScreen from '../screens/Panels/PanelsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import OrderDetailScreen from '../screens/Orders/OrderDetailScreen';
import AdminScreen from '../screens/Admin/AdminScreen';

// Screens that show the bottom tab bar
const MAIN_TABS = ['HomeTab', 'Panels', 'Notifications', 'ProfileTab'];
const AUTH_SCREENS = ['Onboarding', 'Login', 'Register', 'UsernameSelect', 'ForgotPassword', 'ResetPassword'];

// Web breakpoint
const WEB_SIDEBAR_BREAKPOINT = 768;

export default function AppNavigator({ navigation }) {
  const [activeTab, setActiveTab] = useState('HomeTab');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const currentRoute = navigation.currentRoute?.name;
  const { width } = useWindowDimensions();

  const isMainScreen = MAIN_TABS.includes(currentRoute);
  const isAuthScreen = AUTH_SCREENS.includes(currentRoute);
  const isWebWide = Platform.OS === 'web' && width >= WEB_SIDEBAR_BREAKPOINT;

  const handleTabPress = (tabName) => {
    if (tabName === 'AddAd') {
      setShowCreateModal(true);
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
        case 'Panels': return <PanelsScreen navigation={navigation} />;
        case 'Notifications': return <NotificationsScreen navigation={navigation} />;
        case 'ProfileTab': return <ProfileScreen navigation={navigation} />;
        default: return <HomeScreen navigation={navigation} />;
      }
    }

    // For non-tab screens
    switch (currentRoute) {
      case 'Loading': return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
      case 'Onboarding': return <OnboardingScreen navigation={navigation} />;
      case 'Register': return <RegisterScreen navigation={navigation} />;
      case 'Login': return <LoginScreen navigation={navigation} />;
      case 'UsernameSelect': return <UsernameSelectScreen navigation={navigation} />;
      case 'ForgotPassword': return <ForgotPasswordScreen navigation={navigation} />;
      case 'ResetPassword': return <ResetPasswordScreen navigation={navigation} />;
      case 'EmailVerified': return <EmailVerifiedScreen navigation={navigation} />;
      case 'LocationSelect': return <LocationSelectScreen navigation={navigation} />;
      case 'Filter': return <FilterScreen navigation={navigation} />;
      case 'AdUpload': return <AdUploadScreen navigation={navigation} />;
      case 'AdDetail': return <AdDetailScreen navigation={navigation} />;
      case 'EditProfile': return <EditProfileScreen navigation={navigation} />;
      case 'OrderDetail': return <OrderDetailScreen navigation={navigation} />;
      case 'Admin': return <AdminScreen navigation={navigation} />;
      default: return <OnboardingScreen navigation={navigation} />;
    }
  };

  // Auth screens: full width, no sidebar
  if (isAuthScreen) {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.screenContainer}>
          {renderScreen()}
        </View>
      </View>
    );
  }

  // Web wide layout: sidebar + content
  if (isWebWide) {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.webLayout}>
          {isMainScreen && (
            <WebSidebar activeTab={activeTab} onTabPress={handleTabPress} />
          )}
          <View style={styles.webContent}>
            <View style={styles.screenContainer}>
              {renderScreen()}
            </View>
          </View>
        </View>

        <CreateActionModal
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSharePost={() => {
            navigation.navigate('AdUpload');
          }}
          onCreateAd={() => {
            setActiveTab('Panels');
            navigation.reset('Panels');
          }}
        />
      </View>
    );
  }

  // Mobile layout: content + bottom tabs
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.screenContainer}>
          {renderScreen()}
        </View>
        {isMainScreen && (
          <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
        )}
      </View>

      <CreateActionModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSharePost={() => {
          navigation.navigate('AdUpload');
        }}
        onCreateAd={() => {
          setActiveTab('Panels');
          navigation.reset('Panels');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  screenContainer: {
    flex: 1,
  },
  // Web wide layout
  webLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  webContent: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
