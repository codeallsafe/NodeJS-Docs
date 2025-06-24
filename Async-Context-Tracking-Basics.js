// ============================
// 📘 Async Context Tracking Docs
// Node.js async_hooks modülü ile
// ============================

const { AsyncLocalStorage, AsyncResource } = require('node:async_hooks');

// =====================================
// AsyncLocalStorage Kullanımı
// =====================================

// Yeni bir AsyncLocalStorage örneği oluştur
const asyncLocalStorage = new AsyncLocalStorage();

// Bir HTTP sunucusunda her istek için benzersiz bir ID bağlamak
const http = require('node:http');
let id = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(id++, () => {
    logWithId('Request started');
    setTimeout(() => {
      logWithId('Request finished');
      res.end();
    }, 50);
  });
}).listen(8080);

function logWithId(msg) {
  const context = asyncLocalStorage.getStore();
  console.log(`${context !== undefined ? context : '-'}: ${msg}`);
}

// =====================================
// asyncLocalStorage.run(store, callback)
// =====================================
// Bir store objesi ile context başlatılır, ardından gelen async işlemler bu store'a erişebilir
asyncLocalStorage.run({ userId: 123 }, () => {
  console.log(asyncLocalStorage.getStore()); // { userId: 123 }
});

// =====================================
// asyncLocalStorage.enterWith(store)
// =====================================
// Sadece mevcut senkron execution context'inde store ayarlar.
// Tercihen run() kullanılmalıdır.
const store = { traceId: 'abc123' };
asyncLocalStorage.enterWith(store);
console.log(asyncLocalStorage.getStore()); // { traceId: 'abc123' }

// =====================================
// asyncLocalStorage.getStore()
// =====================================
// Mevcut context'e ait veriyi döner, context yoksa undefined

// =====================================
// asyncLocalStorage.disable()
// =====================================
// Tüm context'leri devre dışı bırakır. Bellekten toplanması için kullanılabilir.
asyncLocalStorage.disable();

// =====================================
// asyncLocalStorage.exit(callback)
// =====================================
// Verilen callback'i context dışında çalıştırır.
asyncLocalStorage.run({ value: 10 }, () => {
  asyncLocalStorage.exit(() => {
    console.log(asyncLocalStorage.getStore()); // undefined
  });
});

// =====================================
// asyncLocalStorage.bind(fn)
// =====================================
// Verilen fonksiyonu mevcut context'e bağlar
const boundFn = AsyncLocalStorage.bind(() => {
  console.log(asyncLocalStorage.getStore());
});
asyncLocalStorage.run('boundTest', boundFn);

// =====================================
// asyncLocalStorage.snapshot()
// =====================================
// O anki context'i yakalayarak başka yerde çalıştırmak için fonksiyon döner
const runInContext = asyncLocalStorage.run('snapshotID', () => AsyncLocalStorage.snapshot());
const result = asyncLocalStorage.run('otherContext', () => runInContext(() => asyncLocalStorage.getStore()));
console.log(result); // snapshotID

// =====================================
// Class: AsyncResource
// =====================================

// Özel async işlemlerimizi takip edebilmek için AsyncResource kullanılır
class DBQuery extends AsyncResource {
  constructor(db) {
    super('DBQuery');
    this.db = db;
  }

  get(query, callback) {
    this.db.get(query, (err, data) => {
      this.runInAsyncScope(callback, null, err, data);
    });
  }

  close() {
    this.emitDestroy(); // Manuel destroy edilmesi gerekir
  }
}

// =====================================
// asyncResource.runInAsyncScope(fn, thisArg, ...args)
// =====================================
// Fonksiyonu kendi async context'inde çalıştırır

// =====================================
// asyncResource.bind(fn)
// =====================================
// Fonksiyonu bu resource'un context'ine bağlar

// =====================================
// asyncResource.asyncId() ve triggerAsyncId()
// =====================================
// asyncId: Bu resource'a atanmış ID
// triggerAsyncId: Resource’u tetikleyen context’in ID’si

// =====================================
// Worker Pool Örneği (Özet Yapı)
// =====================================

// AsyncResource, worker havuzları gibi dış kaynaklar için context koruması sağlar
// Worker havuzu yapılarında callback'lerin doğru async context ile bağlanmasını sağlar

// =====================================
// EventEmitter ile Kullanım
// =====================================

// EventEmitter içindeki listener'lar doğru async context'te çalışmayabilir
// Bunun için AsyncResource.bind() ile bağlamak gerekir
const { createServer } = require('node:http');

createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    console.log('Bağlı context içinde');
  }));

  req.on('close', () => {
    console.log('Normal context');
  });
  res.end();
}).listen(3000);

// =====================
// SON
// =====================
// Bu dosya, node:async_hooks modülünün
// tüm fonksiyonlarını açıklamalı olarak içermektedir.
// Eğitim ve test ortamları için referans döküman niteliğindedir.
