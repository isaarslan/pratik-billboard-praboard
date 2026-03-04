import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const navItems = [
  { name: 'HomeTab', label: 'Ana Sayfa', icon: 'home-outline', activeIcon: 'home' },
  { name: 'Panels', label: 'Panolar', icon: 'easel-outline', activeIcon: 'easel' },
  { name: 'AddAd', label: 'Reklam Oluştur', icon: 'add', isAction: true },
  { name: 'Notifications', label: 'Bildirimler', icon: 'notifications-outline', activeIcon: 'notifications', hasBadge: true },
  { name: 'ProfileTab', label: 'Profil', icon: 'person-outline', activeIcon: 'person' },
];

export default function WebSidebar({ activeTab, onTabPress }) {
  const { profile } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoSection}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>P</Text>
        </View>
        <View>
          <Text style={styles.logoText}>praboard</Text>
          <Text style={styles.logoSubText}>Billboard Network</Text>
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.navSection}>
        {navItems.map((item) => {
          const isActive = activeTab === item.name;

          if (item.isAction) {
            return (
              <TouchableOpacity
                key={item.name}
                style={styles.createButton}
                onPress={() => onTabPress(item.name)}
                activeOpacity={0.8}
              >
                <View style={styles.createIconCircle}>
                  <Ionicons name="add" size={20} color={colors.primary} />
                </View>
                <Text style={styles.createButtonText}>{item.label}</Text>
              </TouchableOpacity>
            );
          }

          const showBadge = item.hasBadge && unreadCount > 0;

          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => onTabPress(item.name)}
              activeOpacity={0.7}
            >
              <View style={styles.navIconContainer}>
                <Ionicons
                  name={isActive ? item.activeIcon : item.icon}
                  size={20}
                  color={isActive ? colors.primary : colors.gray[500]}
                />
                {showBadge && (
                  <View style={styles.navBadge}>
                    <Text style={styles.navBadgeText}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* User Profile Card */}
      <View style={styles.footer}>
        <View style={styles.footerDivider} />
        <TouchableOpacity
          style={styles.userCard}
          onPress={() => onTabPress('ProfileTab')}
          activeOpacity={0.7}
        >
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={18} color={colors.gray[400]} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {profile?.full_name || 'Kullanıcı'}
            </Text>
            <Text style={styles.userRole}>
              {profile?.username ? `@${profile.username}` : 'Ücretsiz Plan'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.gray[400]} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    backgroundColor: colors.white,
    borderRightWidth: 1,
    borderRightColor: colors.gray[200],
    paddingTop: 20,
    paddingBottom: 16,
    justifyContent: 'flex-start',
  },

  // Logo
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    marginBottom: 8,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoBadgeText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.gray[900],
    letterSpacing: -0.5,
  },
  logoSubText: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.gray[400],
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 1,
  },

  // Navigation
  navSection: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 2,
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 75, 75, 0.07)',
  },
  navIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  navBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: colors.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 2,
    borderColor: colors.white,
  },
  navBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[500],
    marginLeft: 14,
    flex: 1,
  },
  navLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },

  // Create Button
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  createIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 12,
  },

  // Footer / User Card
  footer: {
    paddingHorizontal: 12,
  },
  footerDivider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginBottom: 12,
    marginHorizontal: 8,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
  },
  userAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray[900],
  },
  userRole: {
    fontSize: 11,
    color: colors.gray[500],
    marginTop: 1,
  },
});
