# Praboard Geliştirme Planı

## Genel Bakış
Ödeme entegrasyonu dışında tüm eksik özelliklerin adım adım implementasyonu.

---

## FAZE 1: Gelişmiş Admin Paneli ✅ TAMAMLANDI

### 1.1 Admin Dashboard - İstatistik Sayfası ✅
- ✅ DashboardTab: Toplam sipariş, aktif yayın, kullanıcı, bekleyen kartları
- ✅ Gelir kartı (toplam gelir, beğeni, paylaşım sayıları)
- ✅ Panel durumları (müsait, dolu, bakımda)
- ✅ Son aktiviteler listesi (Supabase'den gerçek veri)

### 1.2 Panel Yönetimi (CRUD) ✅
- ✅ PanelManagementTab: Panel ekleme/düzenleme/silme
- ✅ Panel durumu değiştirme (Müsait/Dolu/Bakımda)
- ✅ panelService.js: Supabase CRUD + varsayılan paneller

### 1.3 Kullanıcı Yönetimi ✅
- ✅ UserManagementTab: Kullanıcı listesi, arama, detay modal
- ✅ Rol değiştirme (user ↔ admin)
- ✅ adminService.js: getUsers, updateUserRole, getDashboardStats

### 1.4 İçerik Moderasyonu ✅
- ✅ ContentModerationTab: Büyük önizleme, onayla/reddet
- ✅ Ret sebebi şablonları (5 hazır mesaj)
- ✅ Toplu onay/red seçeneği (checkbox ile)

### 1.5 Admin Tab Yapısı ✅
- ✅ 6 tab: Dashboard, Siparişler, Paneller, Moderasyon, Kullanıcılar, TV Yönetimi

---

## FAZE 2: Gerçek Bildirim Sistemi ✅ TAMAMLANDI

### 2.1 Supabase Bildirim Tablosu ✅
- ✅ notifications tablosu (006_notifications_table.sql)
- ✅ RLS politikaları

### 2.2 Bildirim Servisi ✅
- ✅ notificationService.js: CRUD + realtime subscription

### 2.3 Bildirim Context ✅
- ✅ NotificationContext.js: okunmamış sayısı, badge, liste yönetimi

### 2.4 Otomatik Bildirimler ✅
- ✅ Sipariş durumu değişikliklerinde bildirim

### 2.5 NotificationsScreen ✅
- ✅ Gerçek Supabase verisi, badge gösterimi

---

## FAZE 3: Beğeni / Paylaşım Sistemi ✅ TAMAMLANDI

### 3.1 Supabase Tabloları ✅
- ✅ likes tablosu (003_likes_shares_tables.sql)
- ✅ shares tablosu

### 3.2 Beğeni Servisi ✅
- ✅ likeService.js: toggleLike, getLikeCounts, getUserLikedAdIds, isLikedByUser

### 3.3 HomeScreen Feed Entegrasyonu ✅
- ✅ Gerçek beğeni (Supabase), optimistic updates, dolu kalp ikonu

### 3.4 Paylaşım ✅
- ✅ shareService.js: platform seçici modal (WhatsApp, Instagram, Twitter, clipboard)

### 3.5 Profil Beğenilenler ✅
- ✅ ProfileScreen beğenilenler tabında gerçek Supabase verisi

---

## FAZE 4: Profil Fotoğrafı & Kapak Resmi ✅ TAMAMLANDI

### 4.1 Fotoğraf Yükleme ✅
- ✅ Avatar yükleme (expo-image-picker + Supabase Storage)
- ✅ Kapak fotoğrafı yükleme (cover_url, 16:9 kırpma)
- ✅ AuthContext'e uploadAvatar + uploadCover fonksiyonları

### 4.2 Gösterim ✅
- ✅ ProfileScreen: avatar + kapak fotoğrafı gösterimi
- ✅ EditProfileScreen: avatar + kapak düzenleme
- ✅ WebSidebar: profil fotoğrafı gösterimi

---

## FAZE 5: Arama ve Filtreleme ✅ TAMAMLANDI

### 5.1 Gerçek Filtreleme Mantığı ✅
- ✅ AdContext'e filter state eklendi (searchText, topics, adTypes)
- ✅ FilterScreen'den context'e filtre kaydetme
- ✅ HomeScreen feed'ini filtrelere göre filtreleme
- ✅ Aktif filtre badge'i (kaç filtre aktif)

### 5.2 Arama ✅
- ✅ HomeScreen mobile + web header'da arama çubuğu
- ✅ Reklam başlığı, açıklama, kullanıcı adı, konum, sektör ile arama

---

## FAZE 6: Reklam Analitiği ✅ TAMAMLANDI

### 6.1 Gösterim Takibi ✅
- ✅ ad_impressions tablosu (008_ad_impressions_table.sql)
- ✅ TVDisplayScreen'de her slayt gösterildiğinde otomatik kayıt
- ✅ analyticsService.js: recordImpression, getAdAnalytics, getUserAnalytics

### 6.2 Analitik Dashboard (Kullanıcı) ✅
- ✅ AnalyticsScreen: Toplam gösterim, ort. süre, beğeni, paylaşım kartları
- ✅ Son 7 gün bar grafiği
- ✅ Panel dağılımı (yatay bar)
- ✅ Sipariş bazlı performans listesi
- ✅ ProfileScreen'de "Analitik" butonu

### 6.3 Admin Analitiği ✅
- ✅ DashboardTab'a en çok gösterim alan reklamlar eklendi
- ✅ Panel performans karşılaştırması eklendi
- ✅ getTopAds, getPanelPerformance servisleri

---

## FAZE 7: Harita Üzerinde Panel Seçimi

### 7.1 İnteraktif Harita
- PanelsScreen haritasında panel seçimi
- Seçilen panelin detaylarını göster
- "Bu panelde reklam ver" butonu → AdUpload'a yönlendir
- Çoklu panel seçimi desteği

### 7.2 AdUpload Entegrasyonu
- Adım 1'de harita ile panel seçimi seçeneği
- Seçilen panel(ler)i göster
- Panel değiştirme imkanı

---

## Teknik Altyapı (Tüm Fazlar İçin)

### Supabase Tabloları (Yeni)
1. `notifications` - Bildirim sistemi
2. `likes` - Beğeni sistemi
3. `shares` - Paylaşım kaydı
4. `ad_impressions` - Gösterim takibi
5. `panels` - Panel veritabanı (mock'tan taşıma)

### Mevcut Tabloları Güncelleme
- `profiles` - avatar_url alanı (muhtemelen var)
- `orders` - ek alanlar gerekirse

---

## Uygulama Sırası

| Sıra | Faz | Tahmini Dosya | Öncelik |
|------|-----|---------------|---------|
| 1    | Admin Paneli | ~8 dosya | Yüksek |
| 2    | Bildirimler | ~4 dosya | Yüksek |
| 3    | Beğeni/Paylaşım | ~3 dosya | Orta |
| 4    | Profil Fotoğrafı | ~2 dosya | Orta |
| 5    | Arama/Filtreleme | ~3 dosya | Orta |
| 6    | Analitik | ~4 dosya | Düşük |
| 7    | Harita Seçimi | ~2 dosya | Düşük |
