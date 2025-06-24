// ============================
// 📘 Async Hooks API Dokümantasyonu
// ============================

const async_hooks = require('node:async_hooks');
const fs = require('node:fs');

// UYARI: Bu API deneysel olup, yerine genellikle AsyncLocalStorage önerilir.

// =====================================
// executionAsyncId() & triggerAsyncId()
// =====================================

const eid = async_hooks.executionAsyncId(); // Mevcut context ID
const tid = async_hooks.triggerAsyncId(); // Bu context'i tetikleyen async ID

// =====================================
// createHook(callbacks)
// =====================================

// Tüm callback'ler opsiyoneldir. Amaç: async kaynakların yaşam döngüsünü izlemek
const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    fs.writeSync(1, `[init] ${type}(${asyncId}) triggered by ${triggerAsyncId}\n`);
  },
  before(asyncId) {
    fs.writeSync(1, `[before] ${asyncId}\n`);
  },
  after(asyncId) {
    fs.writeSync(1, `[after] ${asyncId}\n`);
  },
  destroy(asyncId) {
    fs.writeSync(1, `[destroy] ${asyncId}\n`);
  },
  promiseResolve(asyncId) {
    fs.writeSync(1, `[promiseResolve] ${asyncId}\n`);
  }
});

hook.enable(); // Takip başlar

// =====================================
// console.log yerine fs.writeSync
// =====================================
// Çünkü console.log async çalışır ve döngüye neden olabilir

function debug(...args) {
  fs.writeFileSync('log.txt', args.join(' ') + '\n', { flag: 'a' });
}

// =====================================
// Async Hook Lifecycle Örneği
// =====================================
const net = require('node:net');

net.createServer(() => {
  setTimeout(() => {
    fs.writeSync(1, `>>> inside callback: ${async_hooks.executionAsyncId()}\n`);
  }, 10);
}).listen(8080);

// =====================================
// executionAsyncResource()
// =====================================

const currentResource = async_hooks.executionAsyncResource();
fs.writeSync(1, `Current Resource: ${JSON.stringify(currentResource)}\n`);

// =====================================
// Kullanıcıya ait context state taşıma örneği
// =====================================
const http = require('node:http');
const sym = Symbol('context');

async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = async_hooks.executionAsyncResource();
    if (cr) resource[sym] = cr[sym];
  }
}).enable();

http.createServer((req, res) => {
  async_hooks.executionAsyncResource()[sym] = { path: req.url };
  setTimeout(() => {
    res.end(JSON.stringify(async_hooks.executionAsyncResource()[sym]));
  }, 100);
}).listen(3001);

// =====================================
// Promise Takibi
// =====================================
// Normalde Promise'lar asyncId ataması almaz
// Ancak createHook ile bu izleme aktif hale gelir

async_hooks.createHook({ init() {} }).enable();

Promise.resolve(42).then(() => {
  fs.writeSync(1, `eid ${async_hooks.executionAsyncId()} tid ${async_hooks.triggerAsyncId()}\n`);
});

// =====================================
// Özel sınıfla callback örneği
// =====================================
class MyAsyncCallbacks {
  init(asyncId, type, triggerAsyncId, resource) {
    debug('[init]', asyncId, type, triggerAsyncId);
  }
  destroy(asyncId) {
    debug('[destroy]', asyncId);
  }
}

class MyFullCallbacks extends MyAsyncCallbacks {
  before(asyncId) {
    debug('[before]', asyncId);
  }
  after(asyncId) {
    debug('[after]', asyncId);
  }
}

async_hooks.createHook(new MyFullCallbacks()).enable();

// =====================
// SONUÇ:
// =====================
// Bu dosya, async_hooks modülünün createHook ve ilgili API'lerini örneklerle açıklar.
// Bu API karmaşıktır ve genellikle AsyncLocalStorage tercih edilir.
// Ancak özel gözetim veya kaynak takibi gereken durumlarda işlevseldir.
