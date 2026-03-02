import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import PraboardLogo from './PraboardLogo';

const navItems = [
  { name: 'HomeTab', label: 'Ana Sayfa', icon: 'home-outline', activeIcon: 'home' },
  { name: 'Panels', label: 'Panolar', icon: 'easel-outline', activeIcon: 'easel' },
  { name: 'AddAd', label: 'Oluştur', icon: 'add-circle-outline', activeIcon: 'add-circle', isAction: true },
  { name: 'Notifications', label: 'Bildirimler', icon: 'notifications-outline', activeIcon: 'notifications' },
  { name: 'ProfileTab', label: 'Profil', icon: 'person-outline', activeIcon: 'person' },
];

export default function WebSidebar({ activeTab, onTabPress }) {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoSection}>
        <PraboardLogo size={36} variant="standalone" />
        <Text style={styles.logoText}>praboard</Text>
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
                <Ionicons name="add" size={22} color={colors.white} />
                <Text style={styles.createButtonText}>{item.label}</Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => onTabPress(item.name)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? item.activeIcon : item.icon}
                size={22}
                color={isActive ? colors.primary : colors.gray[600]}
              />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerDivider} />
        <View style={styles.footerBrand}>
          <Ionicons name="leaf" size={16} color={colors.primary} />
          <Text style={styles.footerText}>Yeşil Reklamcılık</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    backgroundColor: colors.white,
    borderRightWidth: 1,
    borderRightColor: colors.gray[200],
    paddingTop: 24,
    paddingBottom: 20,
    justifyContent: 'flex-start',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    marginBottom: 12,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.gray[900],
    marginLeft: 10,
    letterSpacing: -0.5,
  },
  navSection: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
  },
  navLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray[600],
    marginLeft: 14,
  },
  navLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 8,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: 20,
  },
  footerDivider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginBottom: 16,
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: colors.gray[500],
    marginLeft: 6,
  },
});
