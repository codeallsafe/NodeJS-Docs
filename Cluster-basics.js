/**
 * DOSYA: Cluster Master Metodları
 * -----------------------------
 * Cluster yönetimi için kullanılan ana metodlar.
 */
function clusterMasterMetodları() {
  // GÖZLEM: Master metodları cluster'ın davranışını kontrol eder
  const temelMetodlar = {
    "cluster.fork()": {
      sözdizimi: "cluster.fork([env])",
      açıklama: "Yeni bir worker process oluşturur",
      parametreler: {
        env: "Opsiyonel - worker için environment variables",
      },
      dönerDeğer: "Worker objesi",
      örnek: `
          const cluster = require('cluster');
          const numCPUs = require('os').cpus().length;
          
          if (cluster.isPrimary) {
            console.log(\`Primary \${process.pid} çalışıyor\`);
            
            // CPU sayısı kadar worker oluştur
            for (let i = 0; i < numCPUs; i++) {
              const worker = cluster.fork({
                WORKER_ID: i,
                NODE_ENV: 'production'
              });
              
              console.log(\`Worker \${worker.id} oluşturuldu\`);
            }
          } else {
            // Worker kodu
            console.log(\`Worker \${process.pid} başlatıldı\`);
            require('./app.js');
          }
        `,
    },
    "cluster.setupMaster()": {
      sözdizimi: "cluster.setupMaster([settings]) // Deprecated",
      yeniHali: "cluster.setupPrimary([settings])",
      açıklama: "Worker oluşturma ayarlarını yapılandırır",
      parametreler: {
        exec: "Worker dosyasının yolu",
        args: "Worker'a geçilecek argümanlar",
        silent: "Worker stdout/stderr'ını bastırma",
        stdio: "Child process stdio yapılandırması",
      },
      örnek: `
          // Eski versiyon (deprecated)
          cluster.setupMaster({
            exec: 'worker.js',
            args: ['--use', 'https'],
            silent: true
          });
          
          // Yeni versiyon (Node.js 16+)
          cluster.setupPrimary({
            exec: './workers/http-worker.js',
            args: ['--port', '3000'],
            silent: false,
            stdio: ['ignore', 'pipe', 'pipe', 'ipc']
          });
          
          // Ayarları değiştikten sonra worker oluştur
          cluster.fork();
        `,
    },
    "cluster.disconnect()": {
      sözdizimi: "cluster.disconnect([callback])",
      açıklama: "Tüm worker'ları nazikçe sonlandırır",
      parametreler: {
        callback: "Opsiyonel - tüm worker'lar disconnect olduğunda çağrılır",
      },
      örnek: `
          // Graceful shutdown
          process.on('SIGTERM', () => {
            console.log('SIGTERM alındı, worker\'lar sonlandırılıyor...');
            
            cluster.disconnect((error) => {
              if (error) {
                console.error('Disconnect hatası:', error);
              } else {
                console.log('Tüm worker\'lar sonlandırıldı');
              }
              process.exit(0);
            });
          });
          
          // Timeout ile zorlama
          function gracefulShutdown(timeout = 10000) {
            console.log('Graceful shutdown başlatılıyor...');
            
            cluster.disconnect();
            
            setTimeout(() => {
              console.log('Timeout! Worker\'lar zorla sonlandırılıyor...');
              for (const id in cluster.workers) {
                cluster.workers[id].kill();
              }
              process.exit(1);
            }, timeout);
          }
        `,
    },
  };

  const clusterÖzellikleri = {
    "cluster.isMaster": {
      açıklama: "Bu process'in master olup olmadığını belirtir (deprecated)",
      yeniHali: "cluster.isPrimary",
      dönerDeğer: "Boolean",
      örnek: `
          // Eski versiyon
          if (cluster.isMaster) {
            console.log('Bu master process');
          }
          
          // Yeni versiyon (Node.js 16+)
          if (cluster.isPrimary) {
            console.log('Bu primary process');
          }
        `,
    },
    "cluster.isWorker": {
      açıklama: "Bu process'in worker olup olmadığını belirtir",
      dönerDeğer: "Boolean",
      örnek: `
          if (cluster.isWorker) {
            console.log(\`Worker \${process.pid} çalışıyor\`);
            console.log(\`Worker ID: \${cluster.worker.id}\`);
          }
        `,
    },
    "cluster.worker": {
      açıklama: "Mevcut worker process'in referansı (sadece worker'da)",
      dönerDeğer: "Worker objesi veya undefined",
      örnek: `
          if (cluster.isWorker) {
            const currentWorker = cluster.worker;
            console.log(\`Ben worker \${currentWorker.id}\`);
            
            // Master'a mesaj gönder
            process.send({
              type: 'status',
              workerId: currentWorker.id,
              memory: process.memoryUsage()
            });
          }
        `,
    },
    "cluster.workers": {
      açıklama: "Tüm aktif worker'ların hash tablosu (sadece master'da)",
      dönerDeğer: "Object - worker ID'ye göre indexlenmiş",
      örnek: `
          if (cluster.isPrimary) {
            // Tüm worker'ları listele
            for (const id in cluster.workers) {
              const worker = cluster.workers[id];
              console.log(\`Worker \${id}: PID \${worker.process.pid}\`);
            }
            
            // Worker sayısını kontrol et
            const workerCount = Object.keys(cluster.workers).length;
            console.log(\`Toplam worker sayısı: \${workerCount}\`);
            
            // Belirli worker'a mesaj gönder
            const targetWorker = cluster.workers[1];
            if (targetWorker && targetWorker.isConnected()) {
              targetWorker.send('Özel mesaj');
            }
          }
        `,
    },
    "cluster.settings": {
      açıklama: "Mevcut cluster ayarlarını içerir",
      dönerDeğer: "Object - setupPrimary() ile belirlenen ayarlar",
      örnek: `
          console.log('Cluster ayarları:', cluster.settings);
          // {
          //   exec: '/path/to/worker.js',
          //   args: ['--port', '3000'],
          //   silent: false,
          //   stdio: [0, 1, 2, 'ipc']
          // }
          
          // Ayarları değiştir
          cluster.setupPrimary({
            exec: './new-worker.js'
          });
          
          console.log('Yeni ayarlar:', cluster.settings);
        `,
    },
    "cluster.schedulingPolicy": {
      açıklama: "Load balancing politikasını belirler",
      değerler: {
        "cluster.SCHED_RR": "Round-robin (varsayılan Linux/macOS)",
        "cluster.SCHED_NONE": "OS'e bırak (varsayılan Windows)",
      },
      örnek: `
          // Round-robin scheduling kullan
          cluster.schedulingPolicy = cluster.SCHED_RR;
          
          // OS'e bırak
          cluster.schedulingPolicy = cluster.SCHED_NONE;
          
          console.log('Scheduling policy:', cluster.schedulingPolicy);
        `,
    },
  };

  // TÜMDENGELİM: Master metodları ve özellikleri, cluster'ın tam kontrolünü sağlar
  return {
    süreç: "Master metodlarını kullanarak cluster yaşam döngüsünü yönetme",
    sonuç: "Esnek ve kontrollü cluster mimarisi",
  };
}

/**
 * DOSYA: Pratik Cluster Uygulamaları
 * ---------------------------------
 * Gerçek dünya senaryolarında cluster kullanımı.
 */
function pratikClusterUygulamaları() {
  // İPUÇLARI: Gerçek uygulamalarda cluster kullanımının incelikleri
  const temelHTTPServer = {
    açıklama: "En yaygın kullanım senaryosu - HTTP server clustering",
    örnek: `
        const cluster = require('cluster');
        const http = require('http');
        const numCPUs = require('os').cpus().length;
        
        if (cluster.isPrimary) {
          console.log(\`Primary \${process.pid} çalışıyor\`);
          
          // CPU sayısı kadar worker oluştur
          for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
          }
          
          // Worker çıktığında yenisini oluştur
          cluster.on('exit', (worker, code, signal) => {
            console.log(\`Worker \${worker.process.pid} öldü\`);
            if (!worker.exitedAfterDisconnect) {
              console.log('Yeni worker başlatılıyor...');
              cluster.fork();
            }
          });
          
        } else {
          // Worker kodu
          const server = http.createServer((req, res) => {
            res.writeHead(200);
            res.end(\`Worker \${process.pid} tarafından işlendi\\n\`);
          });
          
          server.listen(3000, () => {
            console.log(\`Worker \${process.pid} 3000 portunu dinliyor\`);
          });
        }
      `,
  };

  const gracefulRestart = {
    açıklama: "Zero-downtime deployment için graceful restart",
    örnek: `
        const cluster = require('cluster');
        
        if (cluster.isPrimary) {
          let workers = [];
          const numCPUs = require('os').cpus().length;
          
          // Worker'ları başlat
          function createWorkers() {
            for (let i = 0; i < numCPUs; i++) {
              createWorker();
            }
          }
          
          function createWorker() {
            const worker = cluster.fork();
            workers.push(worker);
            
            worker.on('exit', (code, signal) => {
              if (!worker.exitedAfterDisconnect) {
                console.log('Worker beklenmedik şekilde öldü, yenisi oluşturuluyor...');
                workers = workers.filter(w => w !== worker);
                createWorker();
              }
            });
            
            return worker;
          }
          
          // Graceful restart function
          function gracefulRestart() {
            const oldWorkers = [...workers];
            workers = [];
            
            console.log('Graceful restart başlıyor...');
            
            // Yeni worker'ları oluştur
            createWorkers();
            
            // Yeni worker'lar hazır olduğunda eski worker'ları kapat
            let readyCount = 0;
            workers.forEach(worker => {
              worker.on('listening', () => {
                readyCount++;
                if (readyCount === workers.length) {
                  console.log('Yeni worker\\'lar hazır, eski worker\\'lar kapatılıyor...');
                  oldWorkers.forEach(oldWorker => {
                    oldWorker.disconnect();
                  });
                }
              });
            });
          }
          
          // SIGUSR2 ile graceful restart
          process.on('SIGUSR2', gracefulRestart);
          
          createWorkers();
          console.log('Primary process başladı. SIGUSR2 ile restart yapabilirsiniz.');
          
        } else {
          // Worker kodu
          require('./app.js');
        }
      `,
  };

  /* const workerCommunication = {
      açıklama: 'Worker'lar arası iletişim ve veri paylaşımı',
      örnek: `
        const cluster = require('cluster');
        
        if (cluster.isPrimary) {
          // Shared state (master'da)
          let sharedData = {
            connections: 0,
            messages: []
          };
          
          // Worker'ları oluştur
          for (let i = 0; i < 4; i++) {
            const worker = cluster.fork();
            
            worker.on('message', (message) => {
              switch (message.type) {
                case 'increment_connections':
                  sharedData.connections++;
                  broadcastToAllWorkers({
                    type: 'connections_update',
                    count: sharedData.connections
                  });
                  break;
                  
                case 'add_message':
                  sharedData.messages.push(message.data);
                  broadcastToAllWorkers({
                    type: 'new_message',
                    message: message.data,
                    messages: sharedData.messages
                  });
                  break;
                  
                case 'get_stats':
                  worker.send({
                    type: 'stats_response',
                    data: sharedData
                  });
                  break;
              }
            });
          }
          
          function broadcastToAllWorkers(message) {
            for (const id in cluster.workers) {
              cluster.workers[id].send(message);
            }
          }
          
        } else {
          // Worker kodu
          const express = require('express');
          const app = express();
          
          app.use(express.json());
          
          let localConnections = 0;
          
          app.get('/status', (req, res) => {
            process.send({ type: 'get_stats' });
            
            // Master'dan response bekle
            const messageHandler = (message) => {
              if (message.type === 'stats_response') {
                process.removeListener('message', messageHandler);
                res.json({
                  worker: process.pid,
                  localConnections,
                  globalData: message.data
                });
              }
            };
            
            process.on('message', messageHandler);
          });
          
          app.post('/connect', (req, res) => {
            localConnections++;
            process.send({ type: 'increment_connections' });
            res.json({ message: 'Connected', worker: process.pid });
          });
          
          app.post('/message', (req, res) => {
            process.send({
              type: 'add_message',
              data: {
                text: req.body.text,
                worker: process.pid,
                timestamp: new Date()
              }
            });
            res.json({ message: 'Message sent' });
          });
          
          // Master'dan gelen broadcast mesajları dinle
          process.on('message', (message) => {
            switch (message.type) {
              case 'connections_update':
                console.log(\`Total connections: \${message.count}\`);
                break;
              case 'new_message':
                console.log('New message received:', message.message);
                break;
            }
          });
          
          app.listen(3000, () => {
            console.log(\`Worker \${process.pid} started\`);
          });
        }
      `
    }; */

  const healthMonitoring = {
    açıklama: "Worker sağlık durumu izleme ve otomatik yeniden başlatma",
    örnek: `
        const cluster = require('cluster');
        
        if (cluster.isPrimary) {
          const workerHealth = new Map();
          
          function createWorker() {
            const worker = cluster.fork();
            
            // Worker sağlık durumunu izle
            workerHealth.set(worker.id, {
              lastHeartbeat: Date.now(),
              isHealthy: true,
              restartCount: 0
            });
            
            // Worker'dan heartbeat bekle
            worker.on('message', (message) => {
              if (message.type === 'heartbeat') {
                const health = workerHealth.get(worker.id);
                if (health) {
                  health.lastHeartbeat = Date.now();
                  health.isHealthy = true;
                }
              }
            });
            
            worker.on('exit', (code, signal) => {
              const health = workerHealth.get(worker.id);
              if (health && !worker.exitedAfterDisconnect) {
                health.restartCount++;
                
                if (health.restartCount < 5) {
                  console.log(\`Worker \${worker.id} restart ediliyor (\${health.restartCount}/5)\`);
                  setTimeout(() => createWorker(), 1000 * health.restartCount);
                } else {
                  console.error(\`Worker \${worker.id} çok fazla restart edildi, durduruldu\`);
                }
              }
              workerHealth.delete(worker.id);
            });
            
            return worker;
          }
          
          // Health check timer
          setInterval(() => {
            const now = Date.now();
            const healthTimeout = 30000; // 30 saniye
            
            for (const [workerId, health] of workerHealth) {
              if (now - health.lastHeartbeat > healthTimeout) {
                console.log(\`Worker \${workerId} heartbeat timeout, restart ediliyor...\`);
                const worker = cluster.workers[workerId];
                if (worker) {
                  health.isHealthy = false;
                  worker.kill();
                }
              }
            }
          }, 10000); // Her 10 saniyede kontrol et
          
          // İlk worker'ları oluştur
          const numCPUs = require('os').cpus().length;
          for (let i = 0; i < numCPUs; i++) {
            createWorker();
          }
          
        } else {
          // Worker kodu
          const express = require('express');
          const app = express();
          
          // Heartbeat gönder
          setInterval(() => {
            process.send({
              type: 'heartbeat',
              pid: process.pid,
              memory: process.memoryUsage(),
              uptime: process.uptime()
            });
          }, 5000);
          
          app.get('/health', (req, res) => {
            res.json({
              status: 'healthy',
              pid: process.pid,
              memory: process.memoryUsage(),
              uptime: process.uptime()
            });
          });
          
          app.listen(3000, () => {
            console.log(\`Worker \${process.pid} started with health monitoring\`);
          });
        }
      `,
  };

  // TEMEL MANTIK: Cluster uygulamaları, robust ve scalable sistemler için kritik pattern'lar içerir
  /*   return {
      süreç: 'Gerçek dünya ihtiyaçlarına uygun cluster pattern'ları uygulama',
      sonuç: 'Production-ready, scalable ve fault-tolerant uygulamalar'
    };
  } */

  /**
   * DOSYA: Cluster Best Practices ve Gotcha'lar
   * ------------------------------------------
   * Cluster kullanırken dikkat edilmesi gereken noktalar.
   */
  function clusterBestPractices() {
    // KANIT: Cluster kullanımında yaygın hatalar ve bunlardan kaçınma yolları
    const bestPractices = {
      workerYönetimi: [
        "Worker sayısını CPU çekirdek sayısı ile sınırla",
        "Memory leak olan worker'ları periyodik olarak restart et",
        "Graceful shutdown implement et",
        "Worker restart count limit koy",
        "Health check mekanizması ekle",
      ],
      performans: [
        "Session affinity (sticky sessions) gerektiğinde implement et",
        "Load balancing policy'yi uygulamaya göre seç",
        "Worker'lar arası veri paylaşımını minimize et",
        "Shared state için Redis gibi external store kullan",
        "CPU-intensive işleri worker pool'a dağıt",
      ],
      güvenlik: [
        "Worker'lar arası IPC mesajlarını validate et",
        "Sensitive data'yı worker'lar arasında paylaşma",
        "Process isolation'ı koru",
        "Worker permissions'ını limit et",
        "Error handling'de sensitive data expose etme",
      ],
    };

    const yaygınHatalar = {
      sharedMemory: {
        hata: "Worker'lar arasında memory/state paylaşıldığını sanmak",
        çözüm:
          "Her worker ayrı process, shared state için external store kullan",
        örnek: `
          // YANLIŞ
          let globalCounter = 0; // Her worker'da ayrı olacak
          
          // DOĞRU
          const redis = require('redis');
          const client = redis.createClient();
          
          async function incrementCounter() {
            return await client.incr('global_counter');
          }
        `,
      },
      sessionStickiness: {
        hata: "Session data'nın worker değişiminde kaybolması",
        çözüm: "External session store veya sticky sessions kullan",
        örnek: `
          // Session store kullan
          const session = require('express-session');
          const RedisStore = require('connect-redis')(session);
          
          app.use(session({
            store: new RedisStore({ host: 'localhost', port: 6379 }),
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: false
          }));
        `,
      },
      socketHandling: {
        hata: "Socket.io gibi real-time teknolojilerde connection kaybı",
        çözüm: "Sticky sessions veya Redis adapter kullan",
        örnek: `
          // Socket.io Redis adapter
          const io = require('socket.io')(server);
          const redis = require('socket.io-redis');
          
          io.adapter(redis({ host: 'localhost', port: 6379 }));
        `,
      },
      resourceLeaks: {
        hata: "Worker'larda memory/handle leak'leri",
        çözüm: "Periyodik restart ve monitoring",
        örnek: `
          // Memory monitoring ve restart
          setInterval(() => {
            const usage = process.memoryUsage();
            const maxMemory = 500 * 1024 * 1024; // 500MB
            
            if (usage.heapUsed > maxMemory) {
              console.log('Memory limit aşıldı, graceful restart...');
              process.disconnect();
            }
          }, 60000);
        `,
      },
    };

    const performansTuning = {
      schedulingPolicy: {
        açıklama: "Load balancing algoritması seçimi",
        seçenekler: {
          SCHED_RR: "Round-robin - eşit dağılım",
          SCHED_NONE: "OS handles - kernel karar verir",
        },
        tavsiye: "Çoğu durumda SCHED_RR daha predictable",
      },
      workerSayısı: {
        açıklama: "Optimal worker sayısı belirleme",
        formül: "CPU cores sayısı (I/O heavy için biraz daha fazla olabilir)",
        örnek: `
          const numCPUs = require('os').cpus().length;
          const workerCount = process.env.NODE_ENV === 'production' 
            ? numCPUs 
            : 1; // Development'ta tek worker
        `,
      },
      gracefulShutdown: {
        açıklama: "Zero-downtime deployment için",
        implementasyon: `
          // Signal handler
          process.on('SIGTERM', () => {
            server.close(() => {
              // Cleanup işlemleri
              database.close();
              cache.disconnect();
              process.exit(0);
            });
          });
          
          // Timeout ile force exit
          process.on('SIGTERM', () => {
            setTimeout(() => {
              console.error('Force exit after timeout');
              process.exit(1);
            }, 10000);
          });
        `,
      },
    };

    // TÜMDENGELİM: Cluster başarısı, doğru pattern'ları bilmek ve yaygın tuzaklardan kaçınmakla gelir
    /*   return {
      süreç: 'Best practice'leri takip ederek robust cluster implementasyonu',
      sonuç: 'Production-ready, scalable ve maintainable cluster architecture'
    }; */
  }

  /**
   * SONUÇ RAPORU
   * ============
   *
   * Node.js Cluster modülü, single-threaded Node.js'in multi-core sistemlerde
   * tam potansiyelini kullanmasını sağlayan güçlü bir araçtır. Tıpkı bir dedektifin
   * karmaşık bir vakayı çözmek için ekip çalışması yapması gibi, cluster da
   * birden fazla process'in koordineli çalışmasını sağlar.
   *
   * Cluster kullanımında başarı, worker yaşam döngüsünü anlama, event'leri doğru
   * yönetme ve master-worker iletişimini etkili kullanmaya dayanır. Her worker
   * bağımsız bir process olduğu için, shared state yönetimi ve session handling
   * gibi konularda özel dikkat gerekir.
   *
   * Modern production environments'ta cluster, load balancing, fault tolerance
   * ve zero-downtime deployment gibi kritik gereksinimleri karşılamak için
   * vazgeçilmez bir teknoloji haline gelmiştir.
   *
   * "Elementary, sevgili Watson! Node.js Cluster, tek bir process'in sınırlarını
   * aşarak, birden fazla worker'ın uyumlu çalışmasını sağlayan bir orkestra
   * şefi gibidir. Master process, tıpkı bir dedektifin soruşturmada ekibini
   * yönetmesi gibi, worker'ları koordine eder ve her birinin kendi uzmanlık
   * alanında en iyi performansı vermesini sağlar."
   */ /**
   * NODE.JS CLUSTER MODÜLÜ - KAPSAMLI REHBER
   * =====================================================
   *
   * Node.js Cluster modülünün detaylı incelemesi ve
   * dedektif yaklaşımıyla yapılan kapsamlı analiz.
   */

  /**
   * DOSYA: Cluster Nedir ve Nasıl Çalışır?
   * -------------------------------------
   * Cluster modülünün temel mantığı ve çalışma prensipleri.
   */
  function clusterTemelMantık() {
    // GÖZLEM: Node.js tek threaded'dir, ama cluster ile çok işlemcili sistemleri kullanabiliriz
    const clusterGereği = {
      sebebi: [
        "Node.js single-threaded event loop kullanır",
        "Çok çekirdekli sistemlerde sadece 1 çekirdek kullanılır",
        "CPU-intensive işlemler event loop'u bloke eder",
        "Daha yüksek performans ve ölçeklenebilirlik gerekir",
      ],
      çözüm: [
        "Worker process'ler oluşturma",
        "Load balancing sağlama",
        "Çekirdeklerin verimli kullanımı",
        "Fault tolerance artırma",
      ],
    };

    const nasılÇalışır = {
      masterProcess: [
        "Ana süreç (primary process) worker'ları yönetir",
        "Gelen istekleri worker'lara dağıtır",
        "Worker'ların durumunu izler",
        "Gerektiğinde yeni worker'lar oluşturur",
      ],
      workerProcess: [
        "Gerçek uygulama kodunu çalıştırır",
        "Master'dan gelen istekleri işler",
        "Master ile IPC (Inter-Process Communication) ile iletişim kurar",
        "Kendi event loop'unu çalıştırır",
      ],
      ipc: [
        "Process'ler arası mesajlaşma",
        "Unix domain socket veya named pipe kullanır",
        "JSON serileştirme ile veri transferi",
        "Handle paylaşımı (socket, server gibi)",
      ],
    };

    // TÜMDENGELİM: Cluster, Node.js\'in tek threaded sınırlarını aşmanın etkili yoludur
    return {
      süreç: "Master-worker mimarisi ile process'leri koordine etme",
      sonuç:
        "Çok çekirdekli sistemlerde yüksek performans ve ölçeklenebilirlik",
    };
  }

  /**
   * DOSYA: Worker Sınıfı - Temel Özellikler
   * ---------------------------------------
   * Worker nesnelerinin özellikleri ve kullanımı.
   */
  function workerSınıfı() {
    // KANIT: Her worker, bağımsız bir process ve kendine özgü özellikler taşır
    const workerÖzellikleri = {
      "worker.id": {
        açıklama: "Worker'ın benzersiz kimlik numarası",
        kullanım: "Worker'ları ayırt etmek ve loglamak için",
        örnek: `
          const cluster = require('cluster');
          
          if (cluster.isPrimary) {
            const worker = cluster.fork();
            console.log('Worker ID:', worker.id); // 1, 2, 3...
          }
        `,
      },
      "worker.process": {
        açıklama: "Worker'ın child_process nesnesine referans",
        kullanım: "Process detaylarına erişim (PID, memory usage vb.)",
        örnek: `
          const worker = cluster.fork();
          console.log('Worker PID:', worker.process.pid);
          console.log('Memory Usage:', worker.process.memoryUsage());
        `,
      },
      "worker.exitedAfterDisconnect": {
        açıklama: "Worker'ın disconnect() sonrası çıkıp çıkmadığını belirtir",
        kullanım: "Kasıtlı vs. beklenmeyen çıkışları ayırt etmek için",
        örnek: `
          worker.on('exit', (code, signal) => {
            if (worker.exitedAfterDisconnect) {
              console.log('Worker kasıtlı olarak sonlandırıldı');
            } else {
              console.log('Worker beklenmeyen bir şekilde çıktı');
              cluster.fork(); // Yeni worker oluştur
            }
          });
        `,
      },
    };

    const workerDurumKontrolleri = {
      "worker.isConnected()": {
        açıklama: "Worker'ın master ile IPC bağlantısının aktif olup olmadığı",
        dönerDeğer: "Boolean - true eğer bağlı, false eğer bağlı değil",
        örnek: `
          if (worker.isConnected()) {
            worker.send('Mesaj gönderilebilir');
          } else {
            console.log('Worker bağlantısı kesilmiş');
          }
        `,
      },
      "worker.isDead()": {
        açıklama: "Worker process'inin ölü olup olmadığını kontrol eder",
        dönerDeğer: "Boolean - true eğer ölü, false eğer yaşıyor",
        örnek: `
          if (worker.isDead()) {
            console.log('Worker artık çalışmıyor');
            delete cluster.workers[worker.id];
          }
        `,
      },
    };

    // TÜMDENGELİM: Worker nesneleri, process yönetimi için zengin bir API sunar
    return {
      süreç: "Worker özelliklerini kullanarak process durumunu izleme",
      sonuç: "Güvenilir worker yönetimi ve hata toleransı",
    };
  }

  /**
   * DOSYA: Worker Events - Olay Yönetimi
   * -----------------------------------
   * Worker\'ların yaşam döngüsündeki olaylar.
   */
  function workerEvents() {
    // İPUÇLARI: Event\'ler, worker\'ların durumunu anlamamızı sağlar
    const workerEventleri = {
      online: {
        ne: "Worker process başlatıldığında tetiklenir",
        timing: "fork() sonrası, worker kodu çalışmaya başlamadan önce",
        kullanım: "Worker'ın başarıyla oluşturulduğunu doğrulamak",
        örnek: `
          const worker = cluster.fork();
          worker.on('online', () => {
            console.log(\`Worker \${worker.id} çevrimiçi oldu\`);
            // Worker artık hazır, mesaj gönderilebilir
          });
        `,
      },
      listening: {
        ne: "Worker bir port dinlemeye başladığında tetiklenir",
        parametreler: "address objesi (port, family, address içerir)",
        kullanım: "Worker'ın hizmet vermeye hazır olduğunu anlamak",
        örnek: `
          worker.on('listening', (address) => {
            console.log(\`Worker \${worker.id} dinliyor: \${address.port}\`);
          });
        `,
      },
      message: {
        ne: "Worker'dan master'a mesaj geldiğinde tetiklenir",
        parametreler: "message (gönderilen veri), handle (opsiyonel)",
        kullanım: "Worker'larla çift yönlü iletişim",
        örnek: `
          worker.on('message', (message) => {
            console.log('Worker\'dan mesaj:', message);
            
            if (message.type === 'status') {
              console.log('Worker durumu:', message.data);
            }
          });
        `,
      },
      disconnect: {
        ne: "Worker ile IPC bağlantısı kesildiğinde tetiklenir",
        kullanım: "Bağlantı kaybını tespit etmek",
        örnek: `
          worker.on('disconnect', () => {
            console.log(\`Worker \${worker.id} bağlantısı kesildi\`);
            // Gerekirse yeniden bağlantı kur
          });
        `,
      },
      error: {
        ne: "Worker'da hata oluştuğunda tetiklenir",
        parametreler: "error objesi",
        kullanım: "Worker hatalarını yakalamak ve işlemek",
        örnek: `
          worker.on('error', (error) => {
            console.error(\`Worker \${worker.id} hatası:\`, error.message);
            // Hata logla, monitoring sistemine bildir
          });
        `,
      },
      exit: {
        ne: "Worker process sonlandığında tetiklenir",
        parametreler: "code (çıkış kodu), signal (sinyal)",
        kullanım: "Worker'ın neden çıktığını anlamak ve yeni worker oluşturmak",
        örnek: `
          worker.on('exit', (code, signal) => {
            console.log(\`Worker \${worker.id} çıktı - kod: \${code}, sinyal: \${signal}\`);
            
            if (!worker.exitedAfterDisconnect) {
              console.log('Beklenmeyen çıkış, yeni worker oluşturuluyor...');
              cluster.fork();
            }
          });
        `,
      },
    };

    const eventSıralaması = [
      "1. fork() çağrılır",
      "2. online event tetiklenir",
      "3. Worker kodu çalışmaya başlar",
      "4. listening event tetiklenir (eğer server.listen() çağrılırsa)",
      "5. message event'leri (çift yönlü iletişim)",
      "6. disconnect event (bağlantı kesilirse)",
      "7. exit event (worker sonlandığında)",
    ];

    // TEMEL MANTIK: Event\'leri doğru sırayla dinlemek, güvenilir cluster yönetimi sağlar
    return {
      süreç: "Worker event'lerini sistematik olarak dinleme ve işleme",
      sonuç: "Worker yaşam döngüsünün tam kontrolü",
    };
  }

  /**
   * DOSYA: Worker Metodları - Process Kontrolü
   * -----------------------------------------
   * Worker\'ları kontrol etmek için kullanılan metodlar.
   */
  function workerMetodları() {
    // GÖZLEM: Worker kontrolü hem nazik hem de zorlayıcı yöntemler içerir
    const workerKontrolMetodları = {
      "worker.send()": {
        sözdizimi: "worker.send(message[, sendHandle[, options]][, callback])",
        açıklama: "Worker'a mesaj gönderir",
        parametreler: {
          message: "Gönderilecek veri (JSON serialize edilebilir olmalı)",
          sendHandle: "Opsiyonel - socket veya server handle'ı",
          options: "Opsiyonel - gönderim seçenekleri",
          callback: "Opsiyonel - gönderim tamamlandığında çağrılır",
        },
        örnek: `
          // Basit mesaj gönderimi
          worker.send('Merhaba Worker!');
          
          // Obje gönderimi
          worker.send({
            type: 'config',
            data: { port: 3000, env: 'production' }
          });
          
          // Callback ile
          worker.send('ping', (error) => {
            if (error) {
              console.error('Mesaj gönderilemedi:', error);
            } else {
              console.log('Mesaj başarıyla gönderildi');
            }
          });
          
          // Handle paylaşımı
          const server = require('net').createServer();
          worker.send('server', server);
        `,
      },
      "worker.kill()": {
        sözdizimi: "worker.kill([signal])",
        açıklama: "Worker'ı zorla sonlandırır",
        parametreler: {
          signal: "Opsiyonel - gönderilecek sinyal (default: SIGTERM)",
        },
        dikkat: "Graceful shutdown sağlamaz, acil durumlarda kullanılmalı",
        örnek: `
          // Graceful termination
          worker.kill('SIGTERM');
          
          // Immediate termination
          worker.kill('SIGKILL');
          
          // Default (SIGTERM)
          worker.kill();
          
          // Timeout ile güvenli sonlandırma
          function gracefulKill(worker, timeout = 5000) {
            worker.disconnect();
            
            const killTimer = setTimeout(() => {
              worker.kill('SIGKILL');
            }, timeout);
            
            worker.on('exit', () => {
              clearTimeout(killTimer);
            });
          }
        `,
      },
      "worker.disconnect()": {
        sözdizimi: "worker.disconnect()",
        açıklama: "Worker ile IPC bağlantısını nazikçe keser",
        kullanım: "Graceful shutdown için tercih edilen yöntem",
        örnek: `
          // Nazik sonlandırma
          worker.disconnect();
          
          // Event ile takip
          worker.on('disconnect', () => {
            console.log('Worker bağlantısı kesildi');
          });
          
          worker.on('exit', () => {
            console.log('Worker sonlandı');
          });
          
          // Timeout ile zorlama
          function gracefulDisconnect(worker, timeout = 5000) {
            worker.disconnect();
            
            setTimeout(() => {
              if (!worker.isDead()) {
                console.log('Worker hala yaşıyor, zorla sonlandırılıyor');
                worker.kill();
              }
            }, timeout);
          }
        `,
      },
    };

    const bestPractices = {
      mesajGönderimi: [
        "Mesaj boyutunu makul tut (büyük veri için stream kullan)",
        "Callback kullanarak gönderim hatalarını yakala",
        "Message type'ları kullanarak mesajları kategorize et",
        "Worker'ın isConnected() olduğunu kontrol et",
      ],
      workerSonlandırma: [
        "Önce disconnect() kullan (graceful)",
        "Timeout ile kill() kullan (fallback)",
        "exitedAfterDisconnect kontrolü yap",
        "Event listener'ları temizle",
      ],
    };

    // TÜMDENGELİM: Worker metodları, process yönetimi için güçlü ama dikkatli kullanılması gereken araçlardır
    return {
      süreç: "Worker metodlarını doğru sıra ve zamanlama ile kullanma",
      sonuç: "Kontrollü ve güvenilir worker yaşam döngüsü yönetimi",
    };
  }

  /**
   * DOSYA: Cluster Master Events
   * ---------------------------
   * Master process\'te dinlenen cluster event\'leri.
   */
  function clusterMasterEvents() {
    // KANIT: Master events, cluster\'ın genel durumunu izlememizi sağlar
    const masterEvents = {
      setup: {
        ne: "setupMaster() çağrıldığında tetiklenir",
        parametreler: "settings objesi",
        kullanım: "Cluster yapılandırmasının değiştiğini bildirmek",
        örnek: `
          cluster.on('setup', (settings) => {
            console.log('Cluster ayarları güncellendi:', settings);
          });
          
          cluster.setupMaster({
            exec: 'worker.js',
            args: ['--use', 'https'],
            silent: false
          });
        `,
      },
      fork: {
        ne: "Yeni worker oluşturulduğunda tetiklenir",
        parametreler: "worker objesi",
        kullanım: "Worker oluşumunu izlemek ve loglama",
        örnek: `
          cluster.on('fork', (worker) => {
            console.log(\`Yeni worker oluşturuldu: \${worker.id}\`);
            
            // Worker sayısını izle
            const activeWorkers = Object.keys(cluster.workers).length;
            console.log(\`Aktif worker sayısı: \${activeWorkers}\`);
          });
        `,
      },
      online: {
        ne: "Worker online olduğunda tetiklenir",
        parametreler: "worker objesi",
        kullanım: "Worker'ın hazır olduğunu doğrulamak",
        örnek: `
          cluster.on('online', (worker) => {
            console.log(\`Worker \${worker.id} online oldu\`);
            
            // Worker\'a initial configuration gönder
            worker.send({
              type: 'init',
              config: getWorkerConfig()
            });
          });
        `,
      },
      listening: {
        ne: "Worker listening başladığında tetiklenir",
        parametreler: "worker objesi, address objesi",
        kullanım: "Worker'ın hizmet vermeye başladığını doğrulamak",
        örnek: `
          cluster.on('listening', (worker, address) => {
            console.log(\`Worker \${worker.id} dinliyor: \${address.address}:\${address.port}\`);
            
            // Health check başlat
            startHealthCheck(worker, address);
          });
        `,
      },
      disconnect: {
        ne: "Worker disconnect olduğunda tetiklenir",
        parametreler: "worker objesi",
        kullanım: "Bağlantı kaybını merkezi olarak izlemek",
        örnek: `
          cluster.on('disconnect', (worker) => {
            console.log(\`Worker \${worker.id} disconnect oldu\`);
            
            // Worker\'ı active listesinden çıkar
            delete cluster.workers[worker.id];
          });
        `,
      },
      exit: {
        ne: "Worker exit ettiğinde tetiklenir",
        parametreler: "worker objesi, code, signal",
        kullanım: "Worker çıkışlarını merkezi olarak yönetmek",
        örnek: `
          cluster.on('exit', (worker, code, signal) => {
            console.log(\`Worker \${worker.id} çıktı (kod: \${code}, sinyal: \${signal})\`);
            
            if (!worker.exitedAfterDisconnect) {
              console.log('Beklenmeyen çıkış, yeni worker oluşturuluyor...');
              
              // Eksponensiyel backoff ile restart
              setTimeout(() => {
                cluster.fork();
              }, getRestartDelay());
            }
          });
        `,
      },
      message: {
        ne: "Herhangi bir worker'dan master'a mesaj geldiğinde tetiklenir",
        parametreler: "worker objesi, message, handle",
        kullanım: "Worker'lardan gelen mesajları merkezi olarak işlemek",
        örnek: `
          cluster.on('message', (worker, message, handle) => {
            console.log(\`Worker \${worker.id}\'dan mesaj:\`, message);
            
            // Mesaj tipine göre işlem yap
            switch (message.type) {
              case 'metrics':
                updateMetrics(worker.id, message.data);
                break;
              case 'error':
                handleWorkerError(worker, message.data);
                break;
              case 'broadcast':
                broadcastToOtherWorkers(worker, message.data);
                break;
            }
          });
        `,
      },
    };

    const eventYönetimiBestPractices = [
      "Tüm worker event'lerini master'da merkezi olarak dinle",
      "Worker restart logic'ini exit event'te implement et",
      "Worker health monitoring için listening event'i kullan",
      "Message routing için message event'te type-based switching yap",
      "Error handling ve logging'i merkezi olarak yönet",
    ];

    // TÜMDENGELİM: Master events, cluster\'ın sağlık durumunu izlemek ve yönetmek için kritiktir
    return {
      süreç: "Master events ile cluster durumunu merkezi olarak izleme",
      sonuç: "Proaktif cluster yönetimi ve hata toleransı",
    };
  }

  return {
    cluster: cluster,
    worker: worker,
    event: event,
    eventYönetimiBestPractices: eventYönetimiBestPractices,
  };
}
