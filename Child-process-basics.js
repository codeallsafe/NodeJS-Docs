// Node.js Child Process Modülü
// ------------------------------------------------------------
// Bu bölüm, Node.js'in `child_process` modülünü temel alan süreç oluşturma yeteneklerini açıklar.
// Her başlık için: Tanım, Ne zaman kullanılır, Hangi tür projelerde tercih edilir şeklinde detaylı bilgi sunulmuştur.

//-------------------------------------------------------------
// ⚙️ Child Process Nedir?
//-------------------------------------------------------------
/**
 * `child_process`, Node.js’in dış dünyadaki komutları veya scriptleri çalıştırmasını sağlayan
 * yerleşik bir modüldür. Yeni bir işlem (process) oluşturur ve bu işlem ana Node.js sürecinden bağımsızdır.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Shell komutu veya sistem programı çalıştırmak istendiğinde.
 * - CPU yoğun işleri izole etmek için.
 *
 * 🎯 Hangi Projelerde?
 * - Medya dönüştürücü araçlar, video işleme sistemleri, otomasyon scriptleri.
 */

//-------------------------------------------------------------
// ⏱️ Asenkron Süreç Oluşturma (Asynchronous process creation)
//-------------------------------------------------------------
/**
 * Asenkron süreçler, ana thread'i bloklamadan çalışır.
 * `exec`, `spawn`, `fork` gibi fonksiyonlar buna örnektir.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Ana uygulama işleyişinin kesilmemesi gereken durumlarda.
 *
 * 🎯 Hangi Projelerde?
 * - Web sunucuları, canlı veri işleyen uygulamalar.
 */

//-------------------------------------------------------------
// 🪟 Windows'ta .bat ve .cmd dosyalarının çalıştırılması
//-------------------------------------------------------------
/**
 * Windows'ta `spawn` kullanırken `.bat` ve `.cmd` uzantılı dosyalar shell altında çalıştırılmalıdır.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Windows’a özel script dosyalarıyla çalışırken.
 *
 * 🎯 Hangi Projelerde?
 * - Windows sistem yönetimi, otomasyon scriptleri.
 */

//-------------------------------------------------------------
// 🔧 child_process.exec()
//-------------------------------------------------------------
/**
 * Bir komut satırı komutunu çalıştırır ve çıktısını döner (buffer olarak).
 *
 * 📍 Ne Zaman Kullanılır?
 * - Komut kısa sürede çalışıyorsa ve tüm çıktı tek seferde gerekiyorsa.
 *
 * 🎯 Hangi Projelerde?
 * - Basit shell işlemleri, `ls`, `cat`, `ping` gibi komutlar.
 */

//-------------------------------------------------------------
// 🔧 child_process.execFile()
//-------------------------------------------------------------
/**
 * `exec`'e benzer ama doğrudan bir dosyayı çalıştırır (shell yok).
 *
 * 📍 Ne Zaman Kullanılır?
 * - Shell özelliklerine ihtiyaç duyulmuyorsa, güvenlik ve performans için.
 *
 * 🎯 Hangi Projelerde?
 * - CLI programlarını doğrudan çalıştırma.
 */

//-------------------------------------------------------------
// 🔁 child_process.fork()
//-------------------------------------------------------------
/**
 * Yeni bir Node.js süreci başlatır ve IPC (process arası iletişim) sağlar.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Ana süreci yormadan birden fazla Node.js süreci çalıştırmak için.
 *
 * 🎯 Hangi Projelerde?
 * - Mikroservis mimarileri, mesajlaşma sistemleri.
 */

//-------------------------------------------------------------
// ⚙️ child_process.spawn()
//-------------------------------------------------------------
/**
 * Düşük seviyeli süreç oluşturur. Stream bazlı veri yönetimi sağlar.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Süreçten gelen veriyi adım adım işlemek gerekiyorsa.
 *
 * 🎯 Hangi Projelerde?
 * - Uzun süren işler, büyük çıktı üreten işlemler.
 */

//-------------------------------------------------------------
// 🧷 options.detached ve options.stdio
//-------------------------------------------------------------
/**
 * - `detached`: Süreç ana süreçten bağımsız çalışsın mı?
 * - `stdio`: stdin, stdout ve stderr yapılandırması.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Arka planda çalışan işlemler veya özel veri akışları gerektiğinde.
 *
 * 🎯 Hangi Projelerde?
 * - Daemon servisler, log dosyalarıyla çalışan sistemler.
 */

//-------------------------------------------------------------
// ⏱️ Senkron Süreç Oluşturma
//-------------------------------------------------------------
/**
 * `execSync`, `spawnSync`, `execFileSync`: Bloklayıcı süreçler.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Küçük komutlar ve scriptler için, sırayla işlem gerekiyorsa.
 *
 * 🎯 Hangi Projelerde?
 * - CLI araçları, sıralı batch işlemleri.
 */

//-------------------------------------------------------------
// 🧱 Class: ChildProcess ve Event'ler
//-------------------------------------------------------------
/**
 * `ChildProcess` sınıfı, süreçle etkileşim kurmak için event bazlı API sunar:
 * - 'exit', 'close', 'error', 'message', 'disconnect', 'spawn'
 *
 * 📍 Ne Zaman Kullanılır?
 * - Süreç durumu ve çıktısıyla ilgilenilmek isteniyorsa.
 *
 * 🎯 Hangi Projeler?
 * - Süreç yönetim sistemleri, test runner'lar.
 */

//-------------------------------------------------------------
// 📬 subprocess özellikleri ve metotları
//-------------------------------------------------------------
/**
 * `subprocess.stdin`, `stdout`, `stderr`, `kill`, `send`, `connected` gibi alanlarla
 * süreç üzerinde doğrudan kontrol sağlanabilir.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Canlı veri iletişimi veya süreç yönetimi gerektiğinde.
 *
 * 🎯 Hangi Projeler?
 * - Chat bot’lar, stream bazlı işler, pipe yönetimi.
 */

//-------------------------------------------------------------
// 🧪 Örnek: Sunucu nesnesi/soket gönderme
//-------------------------------------------------------------
/**
 * `fork` ile başlatılan child process’e `server` veya `socket` nesneleri gönderilebilir.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Load balancing veya dağıtık sistemlerde.
 *
 * 🎯 Hangi Projeler?
 * - Cluster mimarisi kullanan Node.js sunucuları.
 */

//-------------------------------------------------------------
// ⚠️ maxBuffer ve Unicode, Shell Gereksinimleri
//-------------------------------------------------------------
/**
 * `exec` için varsayılan maxBuffer sınırlıdır; büyük çıktı alırken aşılabilir.
 * Ayrıca Windows’ta `cmd.exe` ile uyumlu komutlar gerekir.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Büyük veri çıktısı alınacaksa veya Windows’ta çalışılıyorsa.
 *
 * 🎯 Hangi Projeler?
 * - Sistem bilgi toplayıcılar, log analiz araçları.
 */

//-------------------------------------------------------------
// 🧬 Gelişmiş Serileştirme (Advanced serialization)
//-------------------------------------------------------------
/**
 * `send()` fonksiyonu ile nesneler IPC üzerinden gönderilirken
 * JSON dışı yapıların (örn. Map, Set) doğru şekilde serileştirilmesi için özel yapılandırmalar gerekebilir.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Karmaşık veri yapıları süreçler arasında iletilecekse.
 *
 * 🎯 Hangi Projeler?
 * - Dağıtık sistemler, paralel çalışan veri işleyiciler.
 */
