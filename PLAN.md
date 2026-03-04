# Praboard Geliştirme Planı

## Genel Bakış
Ödeme entegrasyonu dışında tüm eksik özelliklerin adım adım implementasyonu.

---

## FAZE 1: Gelişmiş Admin Paneli (Öncelikli)

### 1.1 Admin Dashboard - İstatistik Sayfası
- **Dosya**: `src/screens/Admin/AdminScreen.js` (mevcut ekranı genişlet)
- Yeni tab: "Dashboard" (ana sayfa)
- Kartlar: Toplam sipariş, aktif yayın, online panel, toplam gelir
- Son 7 gün sipariş grafiği (basit bar chart)
- Son aktiviteler listesi

### 1.2 Panel Yönetimi (CRUD)
- **Yeni dosya**: `src/screens/Admin/PanelManagementTab.js`
- Panel ekleme formu (isim, konum, boyut, fiyat, görsel, lat/lng)
- Panel düzenleme modal
- Panel silme (onay ile)
- Panel durumunu değiştirme (Müsait/Dolu/Bakımda)
- Panelleri Supabase'e taşı (şu anda mock data)
- **Yeni servis**: `src/services/panelService.js`

### 1.3 Kullanıcı Yönetimi
- **Yeni dosya**: `src/screens/Admin/UserManagementTab.js`
- Kullanıcı listesi (profil bilgileri, kayıt tarihi, rol)
- Kullanıcı arama/filtreleme
- Rol değiştirme (user ↔ admin)
- Kullanıcı detay modal (siparişleri, reklamları)
- **Yeni servis**: `src/services/adminService.js`

### 1.4 İçerik Moderasyonu
- **Yeni dosya**: `src/screens/Admin/ContentModerationTab.js`
- Onay bekleyen reklamların büyük önizlemesi
- Hızlı onayla/reddet butonları
- Red sebebi şablonları (hazır mesajlar)
- Toplu onay/red seçeneği

### 1.5 Admin Tab Yapısı
Mevcut 2 tab → 5 tab:
1. Dashboard (yeni)
2. Siparişler (mevcut, iyileştirilmiş)
3. Panel Yönetimi (yeni)
4. Kullanıcılar (yeni)
5. TV Yönetimi (mevcut, iyileştirilmiş)

---

## FAZE 2: Gerçek Bildirim Sistemi

### 2.1 Supabase Bildirim Tablosu
- **Yeni migration**: `notifications` tablosu
  - id, user_id, type, title, message, data (jsonb), read, created_at
- RLS politikaları (kullanıcı sadece kendi bildirimlerini görsün)

### 2.2 Bildirim Servisi
- **Yeni dosya**: `src/services/notificationService.js`
- createNotification(userId, type, title, message, data)
- getUserNotifications(userId)
- markAsRead(notificationId)
- markAllAsRead(userId)
- getUnreadCount(userId)
- Realtime subscription (yeni bildirimler anında gelsin)

### 2.3 Bildirim Context
- **Yeni dosya**: `src/context/NotificationContext.js`
- Okunmamış sayısını tut
- Bildirim listesini yönet
- Badge sayısını BottomTabBar'a aktar

### 2.4 Otomatik Bildirimler
- Sipariş durumu değiştiğinde bildirim oluştur
- Admin sipariş onayladığında → kullanıcıya bildirim
- Reklam yayına alındığında → kullanıcıya bildirim
- Reklam süresi bittiğinde → kullanıcıya bildirim

### 2.5 NotificationsScreen Güncelleme
- Mock veriyi kaldır, gerçek Supabase verisine geç
- Pull-to-refresh
- Bildirime tıklayınca ilgili ekrana git (OrderDetail vb.)
- Okunmamış badge'i BottomTabBar'da göster

---

## FAZE 3: Beğeni / Paylaşım Sistemi

### 3.1 Supabase Tabloları
- `likes` tablosu: id, user_id, ad_id, created_at (unique: user_id + ad_id)
- `shares` tablosu: id, user_id, ad_id, platform, created_at

### 3.2 Beğeni Servisi
- **Yeni dosya**: `src/services/likeService.js`
- toggleLike(userId, adId) - beğen/beğenmekten vazgeç
- getLikeCount(adId)
- isLikedByUser(userId, adId)
- getUserLikes(userId)
- Realtime like count güncelleme

### 3.3 HomeScreen Feed Entegrasyonu
- Kalp ikonuna tıklama → gerçek beğeni
- Beğeni sayısı Supabase'den
- Beğenilmiş kartlarda dolu kalp ikonu
- Animasyonlu beğeni efekti

### 3.4 Paylaşım
- Share butonuna tıklama → platform native share dialog
- Web: clipboard'a link kopyala
- Paylaşım sayısını kaydet

---

## FAZE 4: Profil Fotoğrafı

### 4.1 Fotoğraf Yükleme
- ProfileScreen'de avatar'a tıklama → ImagePicker
- Supabase Storage 'avatars' bucket'ına yükle
- Profile tablosunda avatar_url güncelle

### 4.2 Avatar Gösterimi
- ProfileScreen'de gerçek avatar
- HomeScreen feed kartlarında avatar
- Admin kullanıcı listesinde avatar
- Placeholder: mevcut ikon (geri dönüş)

---

## FAZE 5: Arama ve Filtreleme

### 5.1 Gerçek Filtreleme Mantığı
- FilterScreen'deki seçimleri Context'e kaydet
- HomeScreen feed'ini filtrelere göre filtrele
- Sektör, konum, tarih aralığı filtreleri
- Aktif filtre badge'i (kaç filtre aktif)

### 5.2 Arama
- HomeScreen header'a arama çubuğu ekle
- Reklam başlığı, açıklama, kullanıcı adı ile ara
- Debounced arama (300ms)
- Arama sonuçları sayfası

---

## FAZE 6: Reklam Analitiği

### 6.1 Gösterim Takibi
- `ad_impressions` tablosu: id, ad_id, panel_id, viewed_at, duration_ms
- TVDisplayScreen'de her reklam gösterildiğinde kayıt
- Günlük/haftalık/aylık gösterim sayısı

### 6.2 Analitik Dashboard (Kullanıcı)
- **Yeni dosya**: `src/screens/Analytics/AnalyticsScreen.js`
- Toplam gösterim, günlük ortalama
- Panel bazlı gösterim dağılımı
- Basit çizgi/bar grafikler
- ProfileScreen'den erişim butonu

### 6.3 Admin Analitiği
- Admin Dashboard'da genel istatistikler
- En çok gösterim alan reklamlar
- Panel performans karşılaştırması
- Gelir raporu (sipariş bazlı)

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
