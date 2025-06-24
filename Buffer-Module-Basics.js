// Node.js Buffer Modülü: Kapsamlı Rehber
// Sherlock Holmes'un titizliğiyle hazırlanmış tam dökümantasyon ve örneklerle açıklamalar

/* --------------------------------------------------
   1. GİRİŞ: Buffer Nedir?
-------------------------------------------------- */

// Buffer, Node.js içinde ikili verilerle çalışmak için kullanılan bir yapıdır.
// Özellikle dosya okuma/yazma, ağ işlemleri gibi durumlarda kullanılır.

const { Buffer, SlowBuffer, constants } = require('node:buffer');

/* --------------------------------------------------
   2. Buffer ve Karakter Kodlamaları
-------------------------------------------------- */

// UTF-8 ile bir string'den Buffer oluşturmak:
const utf8Buf = Buffer.from('Merhaba', 'utf8');
console.log(utf8Buf);               // <Buffer 4d 65 72 68 61 62 61>
console.log(utf8Buf.toString());    // Merhaba

// Base64 ile encode/decode
const base64 = utf8Buf.toString('base64');
const fromBase64 = Buffer.from(base64, 'base64').toString('utf8');

/* --------------------------------------------------
   3. Buffer ve TypedArray Karşılaştırması
-------------------------------------------------- */

// Buffer bir Uint8Array'dir, ancak ek metodlar sunar.
const arr = new Uint8Array([1, 2, 3]);
const buf = Buffer.from(arr);
console.log(buf[0]); // 1

/* --------------------------------------------------
   4. Buffer ve Iterasyon
-------------------------------------------------- */

for (const byte of buf) {
  console.log(byte); // 1, 2, 3
}

/* --------------------------------------------------
   5. Class: Blob ve buffer.Blob()
-------------------------------------------------- */

const blob = new Buffer.Blob([Buffer.from('hello'), ' world']);
blob.text().then(console.log); // hello world

/* --------------------------------------------------
   6. Statik Buffer Metodları
-------------------------------------------------- */

// Buffer.alloc() ile sıfırlanmış bellek
const a = Buffer.alloc(4); // <Buffer 00 00 00 00>

// Buffer.allocUnsafe(): hızlı ama bellek içeriği kirli olabilir
const b = Buffer.allocUnsafe(4); // <Buffer XX XX XX XX>

// Buffer.byteLength(): string’in byte uzunluğu
Buffer.byteLength('Örnek'); // UTF-8'e göre uzunluk

// Buffer.compare()
const x = Buffer.from('abc');
const y = Buffer.from('abd');
Buffer.compare(x, y); // -1

// Buffer.concat()
const joined = Buffer.concat([x, y]);

// Buffer.isBuffer(obj)
Buffer.isBuffer(x); // true

// Buffer.isEncoding('utf8')

/* --------------------------------------------------
   7. Buffer.prototype Kullanımı
-------------------------------------------------- */

const buf2 = Buffer.from('NodeJS');

// buf[index]
console.log(buf2[0]); // İlk byte

// buf.slice()
console.log(buf2.slice(0, 4).toString()); // Node

// buf.equals(), buf.compare(), buf.copy()

// buf.readInt*(), buf.writeInt*(), buf.readFloat*(), buf.writeFloat*()
const bin = Buffer.alloc(4);
bin.writeInt32BE(16909060); // Büyük endian
console.log(bin); // <Buffer 01 02 03 04>
console.log(bin.readInt32BE()); // 16909060

/* --------------------------------------------------
   8. Buffer’in Dahili Özellikleri
-------------------------------------------------- */

console.log(Buffer.poolSize);         // Varsayılan: 8192
console.log(Buffer.constants.MAX_LENGTH); // Maksimum Buffer uzunluğu

/* --------------------------------------------------
   9. Yeni Buffer Kullanımı (legacy)
-------------------------------------------------- */
// Artık önerilmiyor; yerine Buffer.from() kullanılmalı

/* --------------------------------------------------
   10. Class: File (Blob’a benzer)
-------------------------------------------------- */

const file = new Buffer.File([Buffer.from('data')], 'test.txt', {
  type: 'text/plain',
});
console.log(file.name); // test.txt

/* --------------------------------------------------
   11. node:buffer module API’leri
-------------------------------------------------- */

// buffer.atob(), buffer.btoa() (base64 encode/decode)
// buffer.transcode(): charset dönüşümleri
const { transcode } = require('node:buffer');
const source = Buffer.from('é', 'utf8');
const output = transcode(source, 'utf8', 'latin1');
console.log(output); // Latin1 encoded buffer

/* --------------------------------------------------
   12. SlowBuffer
-------------------------------------------------- */

const slow = new SlowBuffer(10);
slow.fill(0x22); // <Buffer 22 22 22 22 22 22 22 22 22 22>

/* --------------------------------------------------
   13. Buffer.from(), Buffer.alloc(), Buffer.allocUnsafe()
-------------------------------------------------- */

// Buffer.from(): içerik ile buffer oluşturur
// Buffer.alloc(): sıfırlanmış bellek
// Buffer.allocUnsafe(): sıfırlanmamış bellek (daha hızlı, ama riskli)

/* --------------------------------------------------
   14. Komut Satırı Opsiyonu: --zero-fill-buffers
-------------------------------------------------- */

// node --zero-fill-buffers app.js
// allocUnsafe() çağrıları sıfırlanmış olarak gelir

/* --------------------------------------------------
   15. Neden "unsafe"?
-------------------------------------------------- */

// Çünkü eski içeriği okuyabilirsiniz. Güvenlik açıklarına sebep olabilir:
const potentialLeak = Buffer.allocUnsafe(100);
console.log(potentialLeak); // İçeriği belirsiz!

/* --------------------------------------------------
   SONUÇ
-------------------------------------------------- */

// Buffer API'si, dosya sisteminden ağ uygulamalarına kadar ikili veriyle ilgili her işlemi kontrol altına alır.
// Performans, bellek kontrolü ve çok yönlülüğü bir arada sunar.
