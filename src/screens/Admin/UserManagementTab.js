import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { getUsers, updateUserRole, getUserOrderCount } from '../../services/adminService';

const ROLE_LABELS = {
  admin: 'Admin',
  user: 'Kullanıcı',
};

const ROLE_COLORS = {
  admin: { bg: '#FFF0F0', text: colors.primary },
  user: { bg: '#E3F2FD', text: '#1565C0' },
};

export default function UserManagementTab() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrderCount, setUserOrderCount] = useState(0);

  const loadUsers = useCallback(async (searchTerm = '') => {
    const result = await getUsers({ search: searchTerm, limit: 100 });
    setUsers(result.users);
    setTotal(result.total);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, loadUsers]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers(search);
    setRefreshing(false);
  };

  const handleOpenDetail = async (user) => {
    setSelectedUser(user);
    const count = await getUserOrderCount(user.id);
    setUserOrderCount(count);
  };

  const handleRoleChange = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const msg = `${user.full_name || user.username || 'Bu kullanıcı'} rolünü "${ROLE_LABELS[newRole]}" olarak değiştirmek istiyor musunuz?`;

    const doChange = async () => {
      const result = await updateUserRole(user.id, newRole);
      if (result.success) {
        await loadUsers(search);
        if (selectedUser?.id === user.id) {
          setSelectedUser({ ...user, role: newRole });
        }
      } else {
        const errMsg = result.error || 'Rol değiştirilemedi';
        if (Platform.OS === 'web') { alert(errMsg); } else { Alert.alert('Hata', errMsg); }
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(msg)) doChange();
    } else {
      Alert.alert('Rol Değiştir', msg, [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'Değiştir', onPress: doChange },
      ]);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getInitials = (user) => {
    if (user.full_name) {
      return user.full_name.split(' ').map((w) => w[0]).join('').substring(0, 2).toUpperCase();
    }
    if (user.username) return user.username.substring(0, 2).toUpperCase();
    return '?';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="pulse-outline" size={32} color={colors.gray[400]} />
        <Text style={styles.loadingText}>Kullanıcılar yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Arama */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={colors.gray[400]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Kullanıcı ara..."
          placeholderTextColor={colors.gray[400]}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={colors.gray[400]} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.countText}>{total} kullanıcı</Text>

      {/* Kullanıcı Listesi */}
      <ScrollView
        style={styles.listArea}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {users.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={colors.gray[300]} />
            <Text style={styles.emptyText}>
              {search ? 'Sonuç bulunamadı' : 'Henüz kullanıcı yok'}
            </Text>
          </View>
        ) : (
          users.map((user) => {
            const rc = ROLE_COLORS[user.role] || ROLE_COLORS.user;
            return (
              <TouchableOpacity
                key={user.id}
                style={styles.userCard}
                onPress={() => handleOpenDetail(user)}
                activeOpacity={0.7}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(user)}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {user.full_name || user.username || 'İsimsiz'}
                  </Text>
                  {user.username && (
                    <Text style={styles.userUsername}>@{user.username}</Text>
                  )}
                  <Text style={styles.userEmail} numberOfLines={1}>{user.email || '-'}</Text>
                </View>
                <View style={styles.userRight}>
                  <View style={[styles.roleBadge, { backgroundColor: rc.bg }]}>
                    <Text style={[styles.roleBadgeText, { color: rc.text }]}>
                      {ROLE_LABELS[user.role] || 'Kullanıcı'}
                    </Text>
                  </View>
                  <Text style={styles.userDate}>{formatDate(user.created_at)}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Kullanıcı Detay Modal */}
      {selectedUser && (
        <Modal visible={true} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Kullanıcı Detayı</Text>
                <TouchableOpacity onPress={() => setSelectedUser(null)} activeOpacity={0.7}>
                  <Ionicons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <View style={styles.detailAvatar}>
                <Text style={styles.detailAvatarText}>{getInitials(selectedUser)}</Text>
              </View>
              <Text style={styles.detailName}>
                {selectedUser.full_name || selectedUser.username || 'İsimsiz'}
              </Text>
              {selectedUser.username && (
                <Text style={styles.detailUsername}>@{selectedUser.username}</Text>
              )}

              <View style={styles.detailInfoCard}>
                <View style={styles.detailRow}>
                  <Ionicons name="mail-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailRowText}>{selectedUser.email || '-'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailRowText}>{selectedUser.phone || '-'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailRowText}>Kayıt: {formatDate(selectedUser.created_at)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="receipt-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailRowText}>{userOrderCount} sipariş</Text>
                </View>
              </View>

              {/* Rol Değiştir */}
              <View style={styles.roleSection}>
                <Text style={styles.roleSectionTitle}>Rol</Text>
                <View style={styles.roleButtons}>
                  <TouchableOpacity
                    style={[
                      styles.roleBtn,
                      selectedUser.role === 'user' && styles.roleBtnActive,
                    ]}
                    onPress={() => selectedUser.role !== 'user' && handleRoleChange(selectedUser)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="person-outline" size={16} color={selectedUser.role === 'user' ? '#1565C0' : colors.gray[400]} />
                    <Text style={[styles.roleBtnText, selectedUser.role === 'user' && { color: '#1565C0', fontWeight: '700' }]}>
                      Kullanıcı
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.roleBtn,
                      selectedUser.role === 'admin' && styles.roleBtnActiveAdmin,
                    ]}
                    onPress={() => selectedUser.role !== 'admin' && handleRoleChange(selectedUser)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="shield-outline" size={16} color={selectedUser.role === 'admin' ? colors.primary : colors.gray[400]} />
                    <Text style={[styles.roleBtnText, selectedUser.role === 'admin' && { color: colors.primary, fontWeight: '700' }]}>
                      Admin
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.closeDetailBtn}
                onPress={() => setSelectedUser(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.closeDetailBtnText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.gray[400],
  },
  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
  },
  countText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  // List
  listArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 12,
  },
  // User Card
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userUsername: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  userEmail: {
    fontSize: 12,
    color: colors.gray[400],
    marginTop: 1,
  },
  userRight: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  userDate: {
    fontSize: 11,
    color: colors.gray[400],
    marginTop: 4,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  detailAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailAvatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  detailName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  detailUsername: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  detailInfoCard: {
    width: '100%',
    backgroundColor: colors.gray[100],
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailRowText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  // Role Section
  roleSection: {
    width: '100%',
    marginTop: 20,
  },
  roleSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  roleBtnActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1565C0',
  },
  roleBtnActiveAdmin: {
    backgroundColor: '#FFF0F0',
    borderColor: colors.primary,
  },
  roleBtnText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  closeDetailBtn: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeDetailBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
