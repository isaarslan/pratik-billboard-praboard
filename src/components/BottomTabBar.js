import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useNotifications } from '../context/NotificationContext';

const tabs = [
  { name: 'HomeTab', label: 'Ana Sayfa', icon: 'home-outline', activeIcon: 'home' },
  { name: 'Panels', label: 'Panolar', icon: 'easel-outline', activeIcon: 'easel' },
  { name: 'AddAd', label: '', icon: 'add', isSpecial: true },
  { name: 'Notifications', label: 'Bildirimler', icon: 'notifications-outline', activeIcon: 'notifications' },
  { name: 'ProfileTab', label: 'Profil', icon: 'person-outline', activeIcon: 'person' },
];

export default function BottomTabBar({ activeTab, onTabPress }) {
  const { unreadCount } = useNotifications();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        if (tab.isSpecial) {
          return (
            <TouchableOpacity key={tab.name} style={styles.tab} onPress={() => onTabPress(tab.name)} activeOpacity={0.7}>
              <View style={styles.addButton}>
                <Ionicons name="add" size={28} color={colors.white} />
              </View>
            </TouchableOpacity>
          );
        }

        const showBadge = tab.name === 'Notifications' && unreadCount > 0;

        return (
          <TouchableOpacity key={tab.name} style={styles.tab} onPress={() => onTabPress(tab.name)} activeOpacity={0.7}>
            <View>
              <Ionicons name={isActive ? tab.activeIcon : tab.icon} size={24} color={isActive ? colors.primary : colors.textSecondary} />
              {showBadge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 65,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 2,
  },
  activeLabel: {
    color: colors.primary,
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#E74C3C',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
});
