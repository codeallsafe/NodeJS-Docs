// Node.js C++ Eklentileri ve Node-API Rehberi
// ------------------------------------------------------------
// Bu dosyada hem `C++ Addons` hem de `Node-API (N-API)` başlıkları
// Türkçe olarak basit, ne zaman kullanılmalı ve hangi projelerde gerekir gibi sorulara yanıt verecek şekilde açıklanır.

//-------------------------------------------------------------
// 📦 Node-API Nedir?
//-------------------------------------------------------------
/**
 * Node-API (N-API), C++ kullanarak Node.js modülleri geliştirmenizi sağlayan
 * istikrarlı ve V8 motorundan bağımsız bir arabirimdir.
 *
 * 📍 Ne Zaman Kullanılır?
 * - C++ eklentileri yazarken gelecekteki Node.js sürümlerine uyumlu kalmak istiyorsan.
 * - V8 motorunun detaylarına bağımlı olmak istemiyorsan.
 *
 * 🎯 Hangi Projelerde Tercih Edilir?
 * - Uzun vadeli sürdürülebilir native modüller.
 * - Geniş platform uyumluluğu gerektiren projeler.
 */

//-------------------------------------------------------------
// 🔗 ABI Stabilitesinin Önemi
//-------------------------------------------------------------
/**
 * Node-API'nin ABI (Binary Interface) stabilitesi sayesinde bir kez derlenen modül
 * farklı Node.js sürümlerinde tekrar derlenmeden çalışabilir.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Kullanıcılara binary dağıtıyorsan ve tekrar derleme istemiyorsan.
 *
 * 🎯 Hangi Projeler?
 * - Precompiled (önceden derlenmiş) modül dağıtımı yapan kütüphaneler.
 */

//-------------------------------------------------------------
// 🛠️ Node-API ile Eklenti Derleme
//-------------------------------------------------------------
/**
 * C++ modüller Node.js ile uyumlu şekilde `node-gyp` veya `cmake-js` gibi araçlarla derlenir.
 *
 * 📍 Ne Zaman Kullanılır?
 * - C++ dosyalarıyla çalışan bir Node.js modülü geliştirirken.
 *
 * 🎯 Hangi Projeler?
 * - Native binding'ler, donanım API’leri veya yoğun matematiksel işlemler.
 */

//-------------------------------------------------------------
// 🔧 Derleme Araçları: node-gyp, cmake-js, node-pre-gyp vs.
//-------------------------------------------------------------
/**
 * - `node-gyp`: Node.js tarafından resmi desteklenen temel derleyicidir.
 * - `cmake-js`: CMake tabanlı projeler için idealdir.
 * - `node-pre-gyp`, `prebuild`, `prebuildify`: Önceden derlenmiş binary’leri yükleyici araçlardır.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Binary dağıtımı yapmak ya da CMake tabanlı bir projeyi entegre etmek gerektiğinde.
 *
 * 🎯 Hangi Projeler?
 * - Donanımsal sürücüler, ağ iletişimi kullanan native modüller.
 */

//-------------------------------------------------------------
// 🧪 Node-API Versiyon Matrisi
//-------------------------------------------------------------
/**
 * Node.js sürümlerine karşılık gelen N-API versiyonlarını gösteren matristir.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Hangi Node sürümünün hangi API’yi desteklediğini kontrol etmek için.
 *
 * 🎯 Hangi Projeler?
 * - Modülünü çok sayıda Node.js sürümüne uygun hale getirmek isteyenler.
 */

//-------------------------------------------------------------
// 🔄 Ortam Yaşam Döngüsü (Environment Life Cycle) API'leri
//-------------------------------------------------------------
/**
 * `napi_set_instance_data`, `napi_get_instance_data`: Native objeyi bir Node.js ortamına bağlar.
 *
 * 📍 Ne Zaman Kullanılır?
 * - JS ve C++ arasında veri paylaşımı gerektiğinde.
 *
 * 🎯 Hangi Projeler?
 * - Uygulama genelinde kullanılan native nesneler.
 */

//-------------------------------------------------------------
// 🧱 Temel Veri Türleri ve Yapılar
//-------------------------------------------------------------
/**
 * - `napi_value`, `napi_env`, `napi_ref`: JS ile C++ arasında değer taşıyan yapılardır.
 * - `napi_status`: Hata yönetimi için dönüş tipi.
 *
 * 📍 Ne Zaman Kullanılır?
 * - C++ kodu içerisinde JavaScript ile etkileşime geçerken.
 *
 * 🎯 Hangi Projeler?
 * - Karmaşık veri transferleri içeren modüller.
 */

//-------------------------------------------------------------
// 📞 Callback Türleri
//-------------------------------------------------------------
/**
 * - `napi_callback`, `napi_async_execute_callback`, `napi_finalize` gibi yapılar,
 *   JavaScript’in C++ fonksiyonlarını çağırmasını sağlar.
 *
 * 📍 Ne Zaman Kullanılır?
 * - JavaScript’ten gelen fonksiyonları C++’ta çalıştırmak gerekiyorsa.
 *
 * 🎯 Hangi Projeler?
 * - Event bazlı sistemler, async işlem yapan native modüller.
 */

//-------------------------------------------------------------
// 🚨 Hata Yönetimi
//-------------------------------------------------------------
/**
 * - `napi_throw`, `napi_throw_type_error` gibi fonksiyonlarla JS tarafına hata fırlatılır.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Hataları düzgün bir şekilde JS’e iletmek gerektiğinde.
 *
 * 🎯 Hangi Projeler?
 * - API seviyesi kontrolleri olan C++ eklentiler.
 */

//-------------------------------------------------------------
// ⚙️ C++ Embedder API
//-------------------------------------------------------------
/**
 * C++ Embedder API, Node.js'i başka bir C++ uygulamasının içine gömmeye yarayan bir arayüzdür.
 * Yani Node.js'i bir betik motoru gibi kullanabilirsin.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Mevcut bir C++ uygulamasına JavaScript çalıştırma yeteneği kazandırmak istiyorsan.
 * - Node.js'i doğrudan entegre bir bileşen olarak kullanmak gerekiyorsa.
 *
 * 🎯 Hangi Projeler?
 * - C++ ile yazılmış oyun motorları, gömülü sistem yazılımları, yüksek performanslı sunucular.
 */

//-------------------------------------------------------------
// 🧪 Örnek Gömülü (Embedded) Uygulama
//-------------------------------------------------------------
/**
 * Basit bir örnekle, C++ tarafında bir `node::CreateEnvironment`, `node::LoadEnvironment` ve `node::Start` çağrılarıyla
 * bir Node.js ortamı oluşturulabilir.
 *
 * 📍 Ne Zaman Kullanılır?
 * - JS script'lerini runtime'da C++ tarafından çalıştırmak isteniyorsa.
 *
 * 🎯 Hangi Projeler?
 * - Script tabanlı yapılandırma, oyun içi modlama, CLI araçları içine gömülü JS motoru.
 */

//-------------------------------------------------------------
// 🧠 Süreç Bazlı Durum Oluşturma (Per-Process State)
//-------------------------------------------------------------
/**
 * Node.js ortamı kurulduğunda süreç başına global bir durum (örn. logger, config, belleğe alınmış veri) tutulabilir.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Tüm ortamın erişebileceği ortak bir yapı tanımlanmak isteniyorsa.
 *
 * 🎯 Hangi Projeler?
 * - Çoklu Node ortamları açılmayan, tek instancelı sistemler.
 */

//-------------------------------------------------------------
// 🧩 Instance Bazlı Durum Oluşturma (Per-Instance State)
//-------------------------------------------------------------
/**
 * Farklı modüller veya ortamlar için birbirinden bağımsız instance durumları kurulabilir.
 * Her bir environment, kendi bağımsız state verisini taşıyabilir.
 *
 * 📍 Ne Zaman Kullanılır?
 * - Aynı süreç içinde birden fazla Node.js ortamı oluşturuluyorsa.
 * - Durumların birbirinden yalıtılması gerekiyorsa.
 *
 * 🎯 Hangi Projeler?
 * - Plugin mimarisiyle çalışan sistemler, her kullanıcıya ayrı ortam sağlayan sistemler.
 */
