/* =========================================================
   MUSUK IBUPRENEUR VILLAGE
   MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. LOADER
       ===================================================== */
    const loader = document.getElementById("loader");
    const loaderBar = document.getElementById("loader-bar");

    if (loader && loaderBar) {
        let progress = 0;
        const loaderInterval = setInterval(() => {
            progress += Math.random() * 20;

            if (progress >= 100) {
                progress = 100;
                clearInterval(loaderInterval);
                loaderBar.style.width = "100%";

                setTimeout(() => {
                    loader.classList.add("hidden");
                    if (typeof handleScrollReveal === "function") {
                        handleScrollReveal();
                    }
                }, 400);
            }
            loaderBar.style.width = `${progress}%`;
        }, 100);
    }

    /* =====================================================
       2. HEADER + MOBILE MENU
       ===================================================== */
    const header = document.getElementById("header");
    const menuToggle = document.getElementById("menu-toggle");
    const menu = document.querySelector(".header__menu");
    const navLinks = document.querySelectorAll(".header__link");

    function updateHeader() {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    /* Mobile menu */
    if (menuToggle && menu) {
        menuToggle.addEventListener("click", () => {
            const isActive = menu.classList.toggle("active");
            menuToggle.classList.toggle("active", isActive);
            document.body.style.overflow = isActive ? "hidden" : "";
        });
    }

    /* =====================================================
       3. NAVIGATION
       ===================================================== */
    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");
            if (!href || !href.startsWith("#")) return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();

            /* Tutup mobile menu */
            if (menu && menuToggle) {
                menu.classList.remove("active");
                menuToggle.classList.remove("active");
                document.body.style.overflow = "";
            }

            /* Scroll ke tengah section */
            const targetRect = target.getBoundingClientRect();
            const targetTop = window.scrollY + targetRect.top - (window.innerHeight / 2) + (targetRect.height / 2);

            window.scrollTo({
                top: Math.max(0, targetTop),
                behavior: "smooth"
            });
        });
    });

    /* =====================================================
       4. ACTIVE NAVIGATION
       ===================================================== */
    const sections = document.querySelectorAll("section[id]");

    function updateActiveNavigation() {
        if (!sections.length) return;

        const viewportCenter = window.innerHeight / 2;
        let closestSection = null;
        let closestDistance = Infinity;

        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const sectionCenter = rect.top + (rect.height / 2);
            const distance = Math.abs(sectionCenter - viewportCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestSection = section;
            }
        });

        if (!closestSection) return;

        const currentId = closestSection.getAttribute("id");
        navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            link.classList.toggle("active", href === `#${currentId}`);
        });
    }

    let navigationTicking = false;
    window.addEventListener("scroll", () => {
        if (navigationTicking) return;
        window.requestAnimationFrame(() => {
            updateActiveNavigation();
            navigationTicking = false;
        });
        navigationTicking = true;
    }, { passive: true });

    updateActiveNavigation();

    /* =====================================================
       5. REVEAL ON SCROLL
       ===================================================== */
    const revealElements = document.querySelectorAll(".reveal-fade-up, .reveal-fade-left, .reveal-fade-right");

    function handleScrollReveal() {
        revealElements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                element.classList.add("reveal-active");
            }
        });
    }

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("reveal-active");
                observer.unobserve(entry.target);
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        handleScrollReveal();
    }

    /* =====================================================
       6. COUNTER
       ===================================================== */
    const stats = document.querySelectorAll(".stat__number");
    let hasCounted = false;

    function startCounters() {
        if (hasCounted || !stats.length) return;
        hasCounted = true;

        stats.forEach((stat) => {
            const target = Number(stat.getAttribute("data-target"));
            if (!Number.isFinite(target)) return;

            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.floor(target * easedProgress);

                stat.textContent = currentValue.toLocaleString("id-ID");

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target.toLocaleString("id-ID");
                }
            }
            requestAnimationFrame(updateCounter);
        });
    }

    const statsContainer = document.querySelector(".hero__stats");

    if (statsContainer && "IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    startCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        counterObserver.observe(statsContainer);
    }

    /* =====================================================
       7. TIMELINE
       ===================================================== */
    const timelineContainer = document.querySelector(".timeline__container");
    const timelineProgress = document.getElementById("timeline-progress");

    function updateTimeline() {
        if (!timelineContainer || !timelineProgress) return;

        const rect = timelineContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight / 2 && rect.bottom > 0) {
            const totalHeight = rect.height;
            const scrolled = (windowHeight / 2) - rect.top;
            let percentage = (scrolled / totalHeight) * 100;
            
            percentage = Math.max(0, Math.min(100, percentage));
            timelineProgress.style.height = `${percentage}%`;
        }
    }

    window.addEventListener("scroll", updateTimeline, { passive: true });
    updateTimeline();

    /* =====================================================
       8. FAQ
       ===================================================== */
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach((header) => {
        header.addEventListener("click", () => {
            const item = header.closest(".accordion-item");
            if (!item) return;

            const content = item.querySelector(".accordion-content");
            if (!content) return;

            const isOpen = header.getAttribute("aria-expanded") === "true";

            accordionHeaders.forEach((otherHeader) => {
                if (otherHeader === header) return;
                
                otherHeader.setAttribute("aria-expanded", "false");
                const otherItem = otherHeader.closest(".accordion-item");
                if (!otherItem) return;

                const otherContent = otherItem.querySelector(".accordion-content");
                if (otherContent) {
                    otherContent.style.maxHeight = null;
                    otherContent.style.opacity = "0";
                }
            });

            if (isOpen) {
                header.setAttribute("aria-expanded", "false");
                content.style.maxHeight = null;
                content.style.opacity = "0";
            } else {
                header.setAttribute("aria-expanded", "true");
                content.style.maxHeight = `${content.scrollHeight}px`;
                content.style.opacity = "1";
            }
        });
    });

    /* =====================================================
       9. AI ASSISTANT (ULTIMATE RULE-BASED ENGINE)
       ===================================================== */
    const aiForm = document.getElementById("aiForm");
    const aiInput = document.getElementById("aiInput");
    const aiChat = document.getElementById("aiChat");
    const quickQuestions = document.querySelectorAll(".ai-quick-question");

    // 9.A. JAWABAN PASTI (EXACT MATCH) UNTUK TOMBOL QUICK QUESTIONS
// 9.A. JAWABAN PASTI (EXACT MATCH) UNTUK TOMBOL QUICK QUESTIONS
    const exactAnswers = {
        "Produk apa saja yang tersedia?": "Tentu! Saat ini Musuk Ibpreneur Village punya 3 produk andalan berbahan dasar alpukat premium:<br><br>🥑 <b>Yoghurt Alpukat Premium:</b> Perpaduan rasa asam segar yoghurt dengan kelembutan alpukat. Sangat baik untuk pencernaan dan menyegarkan!<br><br>🍃 <b>Teh Herbal Daun Alpukat:</b> Diseduh dari daun alpukat pilihan yang kaya akan antioksidan. Aromanya menenangkan, cocok banget buat rileksasi.<br><br>🍞 <b>Selai Alpukat Premium:</b> Selai legit dan sehat yang pas banget buat olesan roti tawar atau isian kue kesukaanmu.<br><br>Semuanya produk adalah hasil produksi rumahan yang di buat oleh ibu-ibu hebat di Desa Musuk, lho!",
        
        "Bagaimana cara membeli produk?": "Tata cara pembeliannya sangat praktis dan aman kok!<br><br>1. Pilih produk yang kamu inginkan di katalog halaman website ini.<br>2. Klik <b>ikon marketplace</b> (logo Shopee atau TikTok) yang ada di kartu produk tersebut.<br>3. Kamu akan langsung dialihkan ke etalase toko resmi kami di aplikasi tersebut.<br>4. Masukkan ke keranjang (Add to Cart) atau tekan 'Beli Sekarang'.<br>5. Pilih metode pengiriman, metode pembayaran, lalu Checkout deh!<br><br>Gampang banget kan? Yuk dicoba!",
        
        "Dimana saya bisa membeli produk?": "Saat ini, demi keamanan transaksi dan agar kamu bisa menikmati subsidi gratis ongkir, kami memusatkan seluruh penjualan secara online melalui dua platform marketplace resmi, yaitu:<br><br>🛒 <b><a href='https://shopee.co.id/LINK_SHOPEE_KALIAN' target='_blank' style='color: #4caf50; text-decoration: underline;'>Shopee Musuk Ibpreneur</a></b><br>🎵 <b><a href='https://tiktok.com/LINK_TIKTOK_KALIAN' target='_blank' style='color: #4caf50; text-decoration: underline;'>TikTok Shop Musuk Ibpreneur</a></b><br><br>Kamu juga bisa langsung menekan tombol/ikon marketplace tersebut di setiap kartu produk yang ada di website ini ya!"
    };

    // 9.B. DATABASE PENGETAHUAN SUPER LENGKAP (SLANG, TYPO, GEN Z, ORTU, DLL)
    const knowledgeBase = [
        {
            category: "KONTAK",
            keywords: ['kontak', 'wa', 'whatsapp', 'ig', 'instagram', 'sosmed', 'nomer', 'nomor', 'telepon', 'telpon', 'cs', 'admin', 'hubungi', 'telp', 'no hp', 'mimin', 'japri', 'pc', 'cp', 'sosial media', 'call'],
            responses: [
                "Kamu butuh bantuan lebih lanjut? Bisa langsung japri mimin lewat halaman 'Hubungi Kami' di website ini ya. Kami siap membalas pertanyaanmu dengan cepat! 📞",
                "Untuk ngobrol langsung sama tim admin atau butuh info kerjasama, silakan cek kontak lengkap atau nomor WhatsApp di menu 'Hubungi Kami' yang ada di website ini."
            ]
        },
        {
            category: "CARA_BELI",
            keywords: ['beli', 'belinya', 'order', 'pesan', 'pesen', 'checkout', 'co', 'keranjang', 'payment', 'bayar', 'tf', 'transfer', 'borong', 'bungkus', 'sikat', 'jajan', 'mahar', 'gimana cara beli', 'gimana pesen', 'cara checkout'],
            responses: [
                "Mau langsung CO (Checkout)? Gampang banget! Tinggal klik tombol Shopee atau TikTok Shop yang ada di deket gambar produk. Nanti langsung masuk ke toko resmi kami.",
                "Buat jajan produk kami, kamu cukup klik logo Shopee/TikTok Shop di katalog produk. Pembayaran transfer atau COD bisa diatur di aplikasinya langsung, aman no debat!"
            ]
        },
        {
            category: "DIMANA",
            keywords: ['dimana', 'di mana', 'marketplace', 'shopee', 'shope', 'tiktok', 'tokped', 'toko oren', 'keranjang kuning', 'link', 'toko', 'alamat', 'lokasi', 'tempat', 'cabangnya', 'jual dimana', 'belinya di'],
            responses: [
                "Sekarang kami jualan eksklusif di toko oren (Shopee) dan keranjang kuning (TikTok Shop) ya! Klik aja ikon aplikasinya di halaman produk kami.",
                "Lokasi penjualan resmi kami ada di Shopee dan TikTok Shop. Ini biar transaksinya aman dan kamu bisa dapet promo ongkir!"
            ]
        },
        {
            category: "HARGA",
            keywords: ['harga', 'harganya', 'pricelist', 'brp', 'brapa', 'piro', 'cuan', 'duit', 'biaya', 'ongkos', 'price', 'rp', 'diskon', 'promo', 'murah', 'mahal', 'pasnya', 'nett', 'sale', 'berapa harganya'],
            responses: [
                "Soal cuan dan harga pastinya aman di kantong! Untuk tau harga nett, diskon, atau promo terbarunya, kamu bisa cek langsung di etalase Shopee/TikTok Shop kami ya.",
                "Harganya bervariasi tapi tetap bersahabat. Biar tau detail harganya (siapa tau lagi ada promo), yuk cek langsung di kartu produk atau klik link tokonya!"
            ]
        },
        {
            category: "PENGIRIMAN",
            keywords: ['kirim', 'pengiriman', 'ongkir', 'ekspedisi', 'jne', 'jnt', 'j&t', 'cod', 'bayar di tempat', 'packing', 'aman', 'free ongkir', 'gratis ongkir', 'paket', 'dikirim', 'kurir', 'nyampe'],
            responses: [
                "Untuk urusan paket, packing dijamin aman! Ekspedisi, gratis ongkir, dan sistem COD (bayar di tempat) bisa kamu pilih langsung pas checkout di Shopee atau TikTok Shop.",
                "Pengiriman diurus langsung sama sistem marketplace (Shopee/TikTok). Jadi kamu bisa tracking paketnya dengan mudah dan pilih kurir kesukaanmu."
            ]
        },
        {
            category: "KETAHANAN",
            keywords: ['tahan', 'awet', 'basi', 'expired', 'kadaluwarsa', 'kedaluwarsa', 'exp', 'simpan', 'kulkas', 'suhu ruang', 'penyimpanan', 'bertahan berapa lama'],
            responses: [
                "Setiap produk punya cara simpan beda-beda. Yoghurt pastinya wajib masuk kulkas biar awet segarnya. Detail masa expired-nya selalu tercetak jelas di tiap kemasan kok!",
                "Biar nggak gampang basi, simpan sesuai petunjuk di kemasan ya. Selai dan teh bisa di suhu ruang asalkan rapat, sedangkan Yoghurt butuh suhu dingin."
            ]
        },
        {
            category: "KONSUMSI",
            keywords: ['cara minum', 'cara makan', 'cara pakai', 'seduh', 'konsumsi', 'diminum', 'dimakan', 'aturan', 'resep', 'penyajian', 'dimasak'],
            responses: [
                "Cara nikmatinnya gampang banget! Teh alpukat tinggal diseduh air panas. Kalo yoghurt udah pasti langsung diminum seger-seger. Selai? Tinggal oles ke roti andalanmu!",
                "Instruksi penyajian atau takaran seduhnya ada di balik kemasan. Bisa kamu kreasikan sesuai selera juga lho!"
            ]
        },
        {
            category: "STOK",
            keywords: ['stok', 'sisa', 'ready', 'tersedia', 'habis', 'sold', 'kosong', 'masih ada', 'restock', 'redi', 'stoknya'],
            responses: [
                "Barang kita cepet banget muternya! Buat tau apakah lagi ready stock atau sold out, cara paling valid adalah cek etalase toko kami di Shopee/TikTok Shop.",
                "Kita selalu usahain restock secepatnya kalo habis. Cek langsung tombol keranjang kuning/oren di website ini buat lihat ketersediaan ya!"
            ]
        },
        {
            category: "KESEHATAN",
            keywords: ['kesehatan', 'medis', 'manfaat', 'khasiat', 'obat', 'sembuh', 'sehat', 'penyakit', 'diet', 'kolesterol', 'gula', 'kalori', 'gizi', 'vitamin', 'nutrisi'],
            responses: [
                "Alpukat itu superfood yang kaya lemak baik dan antioksidan, bagus banget buat tubuh! Tapi inget, kalau punya pantangan penyakit tertentu, tanya ke dokter dulu ya.",
                "Produk kami penuh khasiat alami, dari teh yang bantu relaksasi sampai yoghurt untuk pencernaan. Namun ini bukan obat medis, melainkan makanan pendukung gaya hidup sehat."
            ]
        },
        {
            category: "LEGALITAS",
            keywords: ['halal', 'sertifikat', 'sertifikasi', 'bpom', 'pirt', 'legalitas', 'mui', 'izin', 'aman ga', 'higienis'],
            responses: [
                "Proses produksi kami dijamin higienis karena dikelola langsung oleh ibu-ibu telaten di Desa Musuk. Untuk update nomor sertifikasinya, akan segera kami integrasikan ke website ini ya!",
                "Kami sangat mengutamakan kebersihan dan kualitas bahan. Untuk detail sertifikasi resminya (BPOM/Halal), mohon ditunggu update data selanjutnya dari tim kami."
            ]
        },
        {
            category: "BAHAN_ASAL",
            keywords: ['bahan', 'kualitas', 'pertanian', 'petani', 'desa', 'musuk', 'asal', 'dibuat dari', 'komposisi', 'alpukat', 'avoloka', 'avosari', 'ori', 'asli', 'premium', 'skena', 'kalcer'],
            responses: [
                "Brand unggulan kami (seperti Avoloka dan Avosari) lahir dari kebun alpukat premium di Desa Musuk! Dikelola langsung sama kelompok ibu tani dengan vibe yang kalcer abis.",
                "Semuanya berbahan dasar alpukat lokal kualitas tinggi. Kami berdayakan desa binaan di Musuk untuk menyajikan produk olahan alam yang orisinal dan premium."
            ]
        },
        {
            category: "IDENTITAS",
            keywords: ['siapa', 'kamu siapa', 'chatgpt', 'ai', 'bot', 'namamu', 'robot', 'asisten', 'adminnya', 'yg balas', 'sepuh', 'sigma', 'skibidi', 'api key', 'prompt', 'backend'],
            responses: [
                "Halo! Aku ini Asisten AI resmi Musuk Ibpreneur (bukan admin manusia ya, jadi 100% fast respon). Tugasku bantu jawab semua kepo-an kamu soal produk kami. Ada yang mau ditanya?",
                "Aku Asisten Desa Musuk! Bot pintar yang didesain khusus buat bantuin kamu cari tau soal produk Avoloka, Avosari, atau olahan alpukat lainnya. Bukan chatgpt biasa lho!"
            ]
        },
        {
            category: "PUJIAN",
            keywords: ['keren', 'bagus', 'mantap', 'ok', 'oke', 'siang', 'makasih', 'thank you', 'thx', 'matur nuwun', 'sip', 'mantul', 'top', 'gg', 'valid', 'menyala'],
            responses: [
                "Sama-sama! Menyala abangku 🔥 Kalau butuh bantuan lain seputar MUSUK IBUPRENEUR VILLAGE, jangan sungkan tanya lagi ya!",
                "Terima kasih kembali! Senang bisa membantu. Jangan lupa diborong produknya ya! 😉",
                "Oke siap! Kalau masih penasaran sama produk yang lain, ketik aja di sini ya."
            ]
        },
        {
            category: "SAPAAN",
            keywords: ['halo', 'hai', 'pagi', 'siang', 'sore', 'malam', 'hi', 'hello', 'assalamualaikum', 'ping', 'p', 'uy', 'woy', 'permisi', 'punten', 'samlekom', 'bang', 'kak', 'min', 'puh'],
            responses: [
                "Halo kak! 👋 Selamat datang di Musuk Ibpreneur Village. Mau tanyain soal harga, produk, atau cara belinya nih?",
                "Hai! Ada yang bisa mimin AI bantu soal produk olahan alpukat dari Desa Musuk?",
                "Halo! Silakan, ketik aja pertanyaanmu di bawah, nanti aku bantu jawab sejelas mungkin."
            ]
        },
        {
            category: "PRODUK", // Prioritas paling bawah agar tidak membajak kalimat panjang
            keywords: ['produk', 'prodak', 'jualan', 'barang', 'dagangan', 'jual apa', 'katalog', 'varian', 'menu', 'spill', 'yoghurt', 'yogurt', 'teh', 'selai', 'minuman', 'makanan', 'macam', 'jenis'],
            responses: [
                "Kami punya lini produk mantap nih: Yoghurt Alpukat Premium, Teh Herbal Daun Alpukat, sama Selai Alpukat. Semuanya diolah super fresh! Mau dibantuin cari link belinya?",
                "Spill produk dong? Boleh! Katalog kami saat ini diisi olahan alpukat premium: Yoghurt, Teh Herbal, dan Selai. Semuanya juara! Cek aja di atas buat liat gambarnya."
            ]
        }
    ];

    const fallbackResponses = [
        "Waduh, kalau urusan itu kayaknya di luar wawasan aku deh. 😅 Aku ini asisten AI spesialis jawab hal tentang produk, harga, dan jualan MUSUK IBUPRENEUR VILLAGE aja. Ada yang mau ditanya seputar itu?",
        "Hmm, sistemku nggak nangkep maksudnya nih. Tapi kalau kamu mau nanya 'Cara belinya gimana?' atau 'Berapa harganya?', aku jagonya! Mau dibantu soal produk?",
        "Maaf ya, aku fokusnya ngebantu info seputar desa binaan dan olahan alpukat (Avoloka/Avosari). Kalau mau nanya katalog produk atau kontaknya, boleh banget!"
    ];

    // Helper Functions AI
    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // 9.C. SCORING ENGINE (OTAK DETEKSI 0 ERROR)
    function getBotResponse(text) {
        const lowerText = text.toLowerCase().trim();
        
        // 1. Cek Exact Matches (Khusus untuk Tombol Quick Questions)
        // Mengecek apakah teks user SAMA PERSIS dengan key di exactAnswers
        for (let key in exactAnswers) {
            if (lowerText === key.toLowerCase().trim()) {
                return exactAnswers[key];
            }
        }
        
        // 2. Cek Menggunakan Scoring (Untuk Ketikan User Manual)
        let highestScore = 0;
        let bestCategoryMatch = null;

        for (let item of knowledgeBase) {
            let currentScore = 0;

            for (let keyword of item.keywords) {
                // Untuk kata pendek (seperti p, wa, ig, co, tf), gunakan pembatas kata (\b) agar presisi
                if (keyword.length <= 3) {
                    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
                    if (regex.test(lowerText)) {
                        currentScore += 2; // Poin lebih besar untuk kata kunci spesifik
                    }
                } 
                // Untuk kata panjang (slang/biasa), cek menggunakan includes agar toleran terhadap imbuhan
                else {
                    if (lowerText.includes(keyword)) {
                        currentScore += 1;
                    }
                }
            }

            // Jika skor kategori ini mengalahkan skor sebelumnya, jadikan kandidat utama
            if (currentScore > highestScore) {
                highestScore = currentScore;
                bestCategoryMatch = item;
            }
        }
        
        // Jika AI berhasil menemukan relevansi (skor > 0), berikan jawaban
        if (highestScore > 0 && bestCategoryMatch) {
            return getRandomItem(bestCategoryMatch.responses);
        }
        
        // Jika benar-benar tidak paham
        return getRandomItem(fallbackResponses);
    }

    function scrollAIToBottom() {
        if (!aiChat) return;
        requestAnimationFrame(() => {
            aiChat.scrollTo({
                top: aiChat.scrollHeight,
                behavior: "smooth"
            });
        });
    }

    function addAIMessage(text, sender) {
        if (!aiChat) return;
        
        const wrapper = document.createElement("div");
        wrapper.className = `ai-message ai-message--${sender}`;

        if (sender === "user") {
            wrapper.innerHTML = `
                <div class="ai-message__content">
                    <div class="ai-message__bubble">${text}</div>
                </div>
            `;
        } else {
            wrapper.innerHTML = `
                <div class="ai-message__avatar">✦</div>
                <div class="ai-message__content">
                    <span class="ai-message__name">Asisten Desa Musuk</span>
                    <div class="ai-message__bubble">${text}</div>
                </div>
            `;
        }

        aiChat.appendChild(wrapper);
        scrollAIToBottom();
    }

    function showTypingIndicator() {
        if (!aiChat) return;
        
        const wrapper = document.createElement("div");
        wrapper.className = "ai-message ai-message--bot";
        wrapper.id = "aiTypingIndicator";
        wrapper.innerHTML = `
            <div class="ai-message__avatar">✦</div>
            <div class="ai-message__content">
                <span class="ai-message__name">Asisten Desa Musuk</span>
                <div class="ai-message__bubble" style="padding: 10px 18px;">
                    <div class="ai-typing">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            </div>
        `;
        aiChat.appendChild(wrapper);
        scrollAIToBottom();
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById("aiTypingIndicator");
        if (typingIndicator) typingIndicator.remove();
    }

    function handleUserQuestion(question) {
        if (!question || !question.trim()) return;

        addAIMessage(question.trim(), "user");
        if(aiInput) aiInput.value = "";
        if(aiInput) aiInput.disabled = true;

        showTypingIndicator();

        // Delay ngetik dibikin bervariasi antara 1s - 2.5s biar super natural
        const randomDelay = Math.floor(Math.random() * (2500 - 1000 + 1) + 1000);

        setTimeout(() => {
            removeTypingIndicator();
            const response = getBotResponse(question);
            addAIMessage(response, "bot");
            
            if(aiInput) {
                aiInput.disabled = false;
                aiInput.focus();
            }
        }, randomDelay);
    }

    if (aiForm && aiInput) {
        aiForm.addEventListener("submit", (event) => {
            event.preventDefault();
            handleUserQuestion(aiInput.value);
        });

        aiInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                aiForm.requestSubmit();
            }
        });
    }

    quickQuestions.forEach((button) => {
        button.addEventListener("click", () => {
            if (aiInput && aiInput.disabled) return;
            const question = button.dataset.question;
            if (question) handleUserQuestion(question);
        });
    });
 /* =====================================================
    10. TESTIMONIAL CAROUSEL 3D LOGIC
    ===================================================== */

const track = document.getElementById("testimonial-track");

if (track) {
    const cards = Array.from(
        track.querySelectorAll(".testimonial-card")
    );

    let currentIdx = 0;
    let sliderInterval = null;
    let initialTimeout = null;

    function renderCarousel() {
        const total = cards.length;

        // Bersihkan semua class tambahan
        cards.forEach(card => {
            card.className = "testimonial-card";
        });

        if (total >= 5) {
            // Mode Carousel Penuh
            const cIdx = currentIdx;
            const lIdx = (currentIdx - 1 + total) % total;
            const rIdx = (currentIdx + 1) % total;
            const edgeLIdx = (currentIdx - 2 + total) % total;
            const edgeRIdx = (currentIdx + 2) % total;

            cards[lIdx].classList.add("show-left");
            cards[cIdx].classList.add("show-center");
            cards[rIdx].classList.add("show-right");

            cards[edgeLIdx].classList.add("edge-left");
            cards[edgeRIdx].classList.add("edge-right");

        } else if (total === 3 || total === 4) {
            // Mode Statis
            cards[0].classList.add("show-left");
            cards[1].classList.add("show-center");
            cards[2].classList.add("show-right");
        }
    }

    function nextSlide() {
        if (cards.length >= 5) {
            currentIdx = (currentIdx + 1) % cards.length;
            renderCarousel();
        }
    }

    function startAutoPlay() {
        // Hindari interval berjalan lebih dari satu
        clearInterval(sliderInterval);

        sliderInterval = setInterval(() => {
            nextSlide();
        }, 4000);
    }

    // =====================================================
    // INITIAL RENDER
    // =====================================================

    renderCarousel();

    // =====================================================
    // AUTO PLAY
    // =====================================================

    if (cards.length >= 5) {

        // Beri waktu untuk melihat posisi awal
        initialTimeout = setTimeout(() => {
            nextSlide();
            startAutoPlay();
        }, 1000);

        // Pause ketika mouse berada di carousel
        track.addEventListener("mouseenter", () => {
            clearTimeout(initialTimeout);
            clearInterval(sliderInterval);
        });

        // Lanjutkan ketika mouse keluar
        track.addEventListener("mouseleave", () => {
            startAutoPlay();
        });
    }
}

    /* =====================================================
       11. BACK TO TOP
       ===================================================== */
    const backToTop = document.getElementById("back-to-top");

    if (backToTop) {
        function updateBackToTop() {
            if (window.scrollY > 500) {
                backToTop.classList.add("visible");
            } else {
                backToTop.classList.remove("visible");
            }
        }

        window.addEventListener("scroll", updateBackToTop, { passive: true });
        updateBackToTop();

        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* =====================================================
       12. DISABLE HERO PARALLAX
       ===================================================== */
    document.querySelectorAll(".parallax-item").forEach((element) => {
        element.style.transform = "translate3d(0, 0, 0)";
    });

    /* =====================================================
       13. WINDOW RESIZE
       ===================================================== */
    window.addEventListener("resize", () => {
        accordionHeaders.forEach((header) => {
            if (header.getAttribute("aria-expanded") !== "true") return;

            const item = header.closest(".accordion-item");
            if (!item) return;

            const content = item.querySelector(".accordion-content");
            if (content) {
                content.style.maxHeight = `${content.scrollHeight}px`;
            }
        });
        updateActiveNavigation();
    });

    /* =====================================================
       INITIALIZATION
       ===================================================== */
    handleScrollReveal();
    updateActiveNavigation();
    updateTimeline();

});