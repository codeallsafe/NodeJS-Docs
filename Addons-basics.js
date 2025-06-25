// Node.js C++ Eklentileri - Detaylı Türkçe Rehber

/**
 * 📌 C++ Eklentileri Nedir?
 * ----------------------------------
 * C++ Addons (eklenti modülleri), C++ ile yazılmış ve Node.js içinde `require()` ile yüklenebilen
 * dinamik bağlantılı paylaşımlı nesnelerdir. JavaScript modülleri gibi çalışırlar ama performans açısından çok daha güçlüdür.
 *
 * 📍 Ne Zaman ve Neden Kullanılır?
 * - JavaScript yetersiz kaldığında (özellikle yüksek performans gerektiren durumlar).
 * - C/C++ kütüphanelerini doğrudan Node.js’e entegre etmek için.
 * - Düşük seviyeli donanım ya da işletim sistemi API’lerine erişmek için.
 *
 * 🧠 Nerelerde Kullanılır?
 * - Yerel (native) binding gerektiren projelerde.
 * - Ağır işlem yükü içeren uygulamalarda (video işleme, kriptografi gibi).
 *
 * 🎯 Hangi Projelerde Tercih Edilir?
 * - Görüntü/ses işleme araçları
 * - Şifreleme kütüphaneleri
 * - Dosya sistemi sürücüleri veya sıkıştırma algoritmaları
 * - Ağ protokolü veya donanım ile iletişim kuran projeler
 */

//-------------------------------------------------------------
// 1. Hello World - Basit C++ Eklentisi Örneği
//-------------------------------------------------------------
/**
 * Bu örnek, C++ ile yazılmış en temel “Hello World” eklentisidir.
 * JavaScript’e bir C++ fonksiyonu bağlamayı gösterir.
 *
 * 📍 Ne Zaman Kullanılır?
 * - İlk defa eklenti geliştiriyorsan veya test amaçlıysa.
 *
 * 🎯 Hangi Projeler?
 * - Eğitim amaçlı.
 * - Performans testleri.
 */

//-------------------------------------------------------------
// 2. Context-aware addons - Bağlama Duyarlı Eklentiler
//-------------------------------------------------------------
/**
 * Bu tür eklentiler, birden fazla V8 bağlamını destekler. Özellikle Worker kullanımı için uygundur.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Worker thread’leri ile çalışırken aynı C++ durumunu paylaşmak gerekiyorsa.
 *
 * 🎯 Hangi Projeler?
 * - Paralel işlem yapan uygulamalar.
 */

//-------------------------------------------------------------
// 3. Worker Desteği
//-------------------------------------------------------------
/**
 * Bu eklentiler, Node.js `worker_threads` modülü içinde çalışabilecek şekilde yapılandırılır.
 * Her thread için özel başlatma gerektirir.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Çoklu iş parçacığı kullanan sistemlerde.
 *
 * 🎯 Hangi Projeler?
 * - Görüntü dönüştürme araçları
 * - Paralel matematiksel hesaplamalar
 */

//-------------------------------------------------------------
// 4. Eklenti Derleme Süreci
//-------------------------------------------------------------
/**
 * `node-gyp` aracı ile C++ kodları derlenir. Derleme ayarları `binding.gyp` dosyasında tanımlanır.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Her zaman. Tüm eklentiler derlenmek zorundadır.
 *
 * 🎯 Hangi Projeler?
 * - Yerel C++ kodu içeren tüm Node.js projeleri.
 */

//-------------------------------------------------------------
// 5. Node.js İçindeki Kütüphanelere Bağlanmak
//-------------------------------------------------------------
/**
 * `libuv`, `V8` gibi mevcut Node.js iç kütüphaneleri `binding.gyp` ile projeye bağlanabilir.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Mevcut özellikleri tekrar yazmadan kullanmak istiyorsan.
 *
 * 🎯 Hangi Projeler?
 * - Node.js çekirdeğine yakın çalışan projeler.
 */

//-------------------------------------------------------------
// 6. Eklentiyi require() ile Yüklemek
//-------------------------------------------------------------
/**
 * JavaScript’te modül yükler gibi: `const addon = require('./build/Release/myaddon');`
 *
 * 📍 Ne Zaman Kullanılır?
 * - Her zaman. Derlenmiş eklenti böyle yüklenir.
 *
 * 🎯 Hangi Projeler?
 * - Tüm C++ eklenti projeleri.
 */

//-------------------------------------------------------------
// 7. NAN (Native Abstractions for Node.js)
//-------------------------------------------------------------
/**
 * Node.js sürümleri arasında uyumluluk sağlayan bir C++ API soyutlama katmanıdır.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Birden fazla Node.js sürümünü desteklemek istiyorsan.
 *
 * 🎯 Hangi Projeler?
 * - NPM üzerinden geniş kitlelere dağıtılan eklentiler.
 */

//-------------------------------------------------------------
// 8. Node-API (N-API)
//-------------------------------------------------------------
/**
 * V8’den bağımsız, istikrarlı ve ileriye dönük bir API’dir.
 * C++ eklentileri yazmak için önerilen modern yöntemdir.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Uzun vadeli ve kararlı modüller geliştirirken.
 *
 * 🎯 Hangi Projeler?
 * - Üretim seviyesinde native modüller.
 */

//-------------------------------------------------------------
// 9. Eklenti Örnekleri (Fonksiyon, Callback, Nesne Üretici...)
//-------------------------------------------------------------
/**
 * Fonksiyonlar, callback’ler, nesneler ya da sınıf örnekleri JS’e aktarılabilir.
 *
 * 📍 Ne Zaman Kullanılır?
 * - JS tarafından erişilmesi gereken işlevler ya da sınıflar tanımlıyorsan.
 *
 * 🎯 Hangi Projeler?
 * - Callback bazlı iş akışları, özel nesne yönetimi, mantıksal soyutlamalar.
 */

//-------------------------------------------------------------
// 10. C++ Nesnelerini JS Üzerinden Kullanmak
//-------------------------------------------------------------
/**
 * C++ sınıf ya da nesnelerini JS tarafında kullanılabilir hale getirmek mümkündür.
 *
 * 📍 Ne Zaman Kullanılır?
 * - JS tarafında durumu koruyacak native objelere ihtiyaç varsa.
 *
 * 🎯 Hangi Projeler?
 * - Stream işleyiciler, şifreleme motorları, özel veritabanı sürücüleri.
 */
