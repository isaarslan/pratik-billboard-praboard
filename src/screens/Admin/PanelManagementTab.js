import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import {
  getPanels,
  createPanel,
  updatePanel,
  deletePanel,
  updatePanelStatus,
  PANEL_STATUS_MAP,
  PANEL_STATUS_COLORS,
} from '../../services/panelService';

const EMPTY_FORM = {
  name: '',
  location: '',
  size: '',
  price: '',
  image: '',
  lat: '',
  lng: '',
  status: 'available',
};

export default function PanelManagementTab() {
  const [panels, setPanels] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPanel, setEditingPanel] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadPanels = useCallback(async () => {
    const data = await getPanels();
    setPanels(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPanels();
  }, [loadPanels]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPanels();
    setRefreshing(false);
  };

  const openAddForm = () => {
    setEditingPanel(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (panel) => {
    setEditingPanel(panel);
    setForm({
      name: panel.name || '',
      location: panel.location || '',
      size: panel.size || '',
      price: String(panel.price || ''),
      image: panel.image || '',
      lat: String(panel.lat || ''),
      lng: String(panel.lng || ''),
      status: panel.status || 'available',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.location) {
      const msg = 'Panel adı ve konum zorunludur';
      if (Platform.OS === 'web') { alert(msg); } else { Alert.alert('Hata', msg); }
      return;
    }

    setSaving(true);
    let result;
    if (editingPanel) {
      result = await updatePanel(editingPanel.id, form);
    } else {
      result = await createPanel(form);
    }

    if (result.success) {
      setShowForm(false);
      setEditingPanel(null);
      setForm(EMPTY_FORM);
      await loadPanels();
    } else {
      const msg = result.error || 'İşlem başarısız';
      if (Platform.OS === 'web') { alert(msg); } else { Alert.alert('Hata', msg); }
    }
    setSaving(false);
  };

  const handleDelete = (panel) => {
    const doDelete = async () => {
      const result = await deletePanel(panel.id);
      if (result.success) {
        await loadPanels();
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`"${panel.name}" panelini silmek istediğinize emin misiniz?`)) {
        doDelete();
      }
    } else {
      Alert.alert(
        'Paneli Sil',
        `"${panel.name}" panelini silmek istediğinize emin misiniz?`,
        [
          { text: 'Vazgeç', style: 'cancel' },
          { text: 'Sil', style: 'destructive', onPress: doDelete },
        ]
      );
    }
  };

  const handleStatusChange = async (panel) => {
    const statuses = ['available', 'full', 'maintenance'];
    const currentIdx = statuses.indexOf(panel.status);
    const nextStatus = statuses[(currentIdx + 1) % statuses.length];
    await updatePanelStatus(panel.id, nextStatus);
    await loadPanels();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="pulse-outline" size={32} color={colors.gray[400]} />
        <Text style={styles.loadingText}>Paneller yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Üst Bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>{panels.length} Panel</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddForm} activeOpacity={0.7}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addButtonText}>Yeni Panel</Text>
        </TouchableOpacity>
      </View>

      {/* Panel Listesi */}
      <ScrollView
        style={styles.listArea}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {panels.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="map-outline" size={48} color={colors.gray[300]} />
            <Text style={styles.emptyText}>Henüz panel eklenmemiş</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={openAddForm}>
              <Text style={styles.emptyButtonText}>İlk Paneli Ekle</Text>
            </TouchableOpacity>
          </View>
        ) : (
          panels.map((panel) => {
            const sc = PANEL_STATUS_COLORS[panel.status] || PANEL_STATUS_COLORS.available;
            return (
              <View key={panel.id} style={styles.panelCard}>
                {panel.image ? (
                  <Image source={{ uri: panel.image }} style={styles.panelThumb} resizeMode="cover" />
                ) : (
                  <View style={[styles.panelThumb, styles.panelThumbPlaceholder]}>
                    <Ionicons name="image-outline" size={24} color={colors.gray[400]} />
                  </View>
                )}
                <View style={styles.panelInfo}>
                  <Text style={styles.panelName} numberOfLines={1}>{panel.name}</Text>
                  <View style={styles.panelMeta}>
                    <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
                    <Text style={styles.panelMetaText} numberOfLines={1}>{panel.location}</Text>
                  </View>
                  <View style={styles.panelMeta}>
                    <Ionicons name="resize-outline" size={13} color={colors.textSecondary} />
                    <Text style={styles.panelMetaText}>{panel.size}</Text>
                  </View>
                  <View style={styles.panelFooter}>
                    <TouchableOpacity
                      style={[styles.statusBadge, { backgroundColor: sc.bg }]}
                      onPress={() => handleStatusChange(panel)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.statusBadgeText, { color: sc.text }]}>
                        {PANEL_STATUS_MAP[panel.status] || panel.status}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.panelPrice}>
                      {panel.price ? `${Number(panel.price).toLocaleString('tr-TR')} TL/gün` : '-'}
                    </Text>
                  </View>
                </View>
                <View style={styles.panelActions}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => openEditForm(panel)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="create-outline" size={18} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleDelete(panel)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={18} color="#C62828" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Ekle/Düzenle Modal */}
      <Modal visible={showForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingPanel ? 'Paneli Düzenle' : 'Yeni Panel Ekle'}
              </Text>
              <TouchableOpacity onPress={() => setShowForm(false)} activeOpacity={0.7}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll}>
              <Text style={styles.fieldLabel}>Panel Adı *</Text>
              <TextInput
                style={styles.input}
                placeholder="örn: Kızılay Meydanı"
                placeholderTextColor={colors.gray[400]}
                value={form.name}
                onChangeText={(t) => setForm({ ...form, name: t })}
              />

              <Text style={styles.fieldLabel}>Konum *</Text>
              <TextInput
                style={styles.input}
                placeholder="örn: Ankara, Kızılay"
                placeholderTextColor={colors.gray[400]}
                value={form.location}
                onChangeText={(t) => setForm({ ...form, location: t })}
              />

              <View style={styles.rowFields}>
                <View style={styles.halfField}>
                  <Text style={styles.fieldLabel}>Boyut</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="3m x 6m"
                    placeholderTextColor={colors.gray[400]}
                    value={form.size}
                    onChangeText={(t) => setForm({ ...form, size: t })}
                  />
                </View>
                <View style={styles.halfField}>
                  <Text style={styles.fieldLabel}>Fiyat (TL/gün)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="1000"
                    placeholderTextColor={colors.gray[400]}
                    value={form.price}
                    onChangeText={(t) => setForm({ ...form, price: t })}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text style={styles.fieldLabel}>Görsel URL</Text>
              <TextInput
                style={styles.input}
                placeholder="https://..."
                placeholderTextColor={colors.gray[400]}
                value={form.image}
                onChangeText={(t) => setForm({ ...form, image: t })}
              />

              <View style={styles.rowFields}>
                <View style={styles.halfField}>
                  <Text style={styles.fieldLabel}>Enlem (Lat)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="39.9208"
                    placeholderTextColor={colors.gray[400]}
                    value={form.lat}
                    onChangeText={(t) => setForm({ ...form, lat: t })}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.halfField}>
                  <Text style={styles.fieldLabel}>Boylam (Lng)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="32.8541"
                    placeholderTextColor={colors.gray[400]}
                    value={form.lng}
                    onChangeText={(t) => setForm({ ...form, lng: t })}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text style={styles.fieldLabel}>Durum</Text>
              <View style={styles.statusOptions}>
                {Object.entries(PANEL_STATUS_MAP).map(([key, label]) => {
                  const sc = PANEL_STATUS_COLORS[key];
                  const isActive = form.status === key;
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.statusOption,
                        isActive && { backgroundColor: sc.bg, borderColor: sc.text },
                      ]}
                      onPress={() => setForm({ ...form, status: key })}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.statusOptionText, isActive && { color: sc.text, fontWeight: '700' }]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShowForm(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelBtnText}>Vazgeç</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                  onPress={handleSave}
                  disabled={saving}
                  activeOpacity={0.7}
                >
                  <Ionicons name={editingPanel ? 'checkmark' : 'add'} size={18} color="#fff" />
                  <Text style={styles.saveBtnText}>{editingPanel ? 'Kaydet' : 'Ekle'}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  // Top Bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  topBarTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  // List
  listArea: {
    flex: 1,
    paddingHorizontal: 16,
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
  emptyButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  // Panel Card
  panelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  panelThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: colors.gray[200],
  },
  panelThumbPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelInfo: {
    flex: 1,
    marginLeft: 12,
  },
  panelName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  panelMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  panelMetaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  panelFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  panelPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  panelActions: {
    gap: 8,
    marginLeft: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 480,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  formScroll: {
    maxHeight: 500,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  statusOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statusOptionText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
