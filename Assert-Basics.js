// assert modülü Node.js testlerinde varsayımları (assertions) doğrulamak için kullanılır.
const assert = require('assert');
const strict = require('assert/strict');

// =====================================
// Basic Assertions
// =====================================

// assert(value[, message])
// Value falsy ise AssertionError fırlatır.
assert(true, 'Bu hata vermez');
// assert(false, 'Bu hata verir');

// assert.ok(value[, message])
// assert() ile aynıdır; genellikle okunabilirlik için kullanılır.
assert.ok(1 === 1, '1 eşit değil');

// =====================================
// Equal & Not Equal
// =====================================

// assert.equal(actual, expected[, message])
// == kullanarak karşılaştırır (tavsiye edilmez)
assert.equal('1', 1); // true çünkü ==

// assert.notEqual(actual, expected[, message])
// != kullanarak karşılaştırır
assert.notEqual(1, 2);

// assert.strictEqual(actual, expected[, message])
// === kullanır, tür eşitliği de aranır
assert.strictEqual(1, 1);

// assert.notStrictEqual(actual, expected[, message])
// !== kullanır
assert.notStrictEqual(1, '1');

// =====================================
// Deep Equal (Nesne ve Dizi Karşılaştırmaları)
// =====================================

// assert.deepEqual(actual, expected[, message])
// Objeleri gevşek (==) karşılaştırır
assert.deepEqual({ a: 1 }, { a: '1' }); // eşit sayılır

// assert.deepStrictEqual(actual, expected[, message])
// Objeleri === ve tip dahil karşılaştırır
assert.deepStrictEqual({ a: 1 }, { a: 1 });

// assert.notDeepEqual(actual, expected[, message])
// deepEqual ile eşit değilse geçer
assert.notDeepEqual({ a: 1 }, { a: 2 });

// assert.notDeepStrictEqual(actual, expected[, message])
assert.notDeepStrictEqual({ a: 1 }, { a: '1' });

// assert.partialDeepStrictEqual(actual, expected[, message])
// actual içinde expected'ın tüm alanları varsa ve eşleşiyorsa geçer
assert.partialDeepStrictEqual({ a: 1, b: 2 }, { a: 1 });

// =====================================
// Throw/Reject Kontrolleri
// =====================================

// assert.throws(fn[, error][, message])
// fn hata fırlatmalı, aksi halde hata alınır
assert.throws(() => { throw new Error('Hata'); }, Error);

// assert.doesNotThrow(fn[, error][, message])
// fn hata fırlatmamalı
assert.doesNotThrow(() => { return true; });

// assert.rejects(asyncFn[, error][, message])
// async fonksiyon hata fırlatmalı
assert.rejects(async () => { throw new Error('Async Hata'); });

// assert.doesNotReject(asyncFn[, error][, message])
// async fonksiyon hata fırlatmamalı
assert.doesNotReject(async () => Promise.resolve());

// =====================================
// Regex Karşılaştırmaları
// =====================================

// assert.match(string, regexp[, message])
assert.match('abc123', /123$/);

// assert.doesNotMatch(string, regexp[, message])
assert.doesNotMatch('abc', /\d+/);

// =====================================
// Hata Üretme ve ifError
// =====================================

// assert.fail([message])
// Testi elle başarısız yapmak için
// assert.fail('Test bilinçli olarak başarısız oldu');

// assert.ifError(value)
// value truthy ise hata verir. Özellikle err nesneleri için kullanılır.
assert.ifError(null);

// =====================================
// Custom AssertionError
// =====================================

// new assert.AssertionError(options)
const customError = new assert.AssertionError({
  message: 'Özel hata',
  actual: 1,
  expected: 2,
  operator: '===',
});
console.log(customError instanceof assert.AssertionError); // true

// =====================================
// CallTracker Kullanımı
// =====================================

const { CallTracker } = require('assert');
const tracker = new CallTracker();

function example(x) {
  return x * 2;
}

const wrapped = tracker.calls(example, 2); // 2 kez çağrılması beklenir
wrapped(1);
wrapped(2);

// tracker.verify(); // Beklenen çağrı yapılmazsa AssertionError fırlatır
// tracker.getCalls(wrapped); // Çağrı detaylarını verir

// =====================================
// assert.strict: Strict mod için önerilen kullanım
// =====================================
strict.strictEqual(10, 10);
strict.deepStrictEqual({ x: 1 }, { x: 1 });

// =====================
// SON
// =====================
// Bu dosya, assert API'sinin örneklerle ve açıklamalarla belgelenmiş halidir.
// Test ortamlarında örnek olarak veya eğitim amacıyla kullanılabilir.
