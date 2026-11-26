/**
 * Logika Aplikasi Web Profil (Pure JavaScript - Lokal & Vercel)
 * ------------------------------------------------------------
 * Bekerja langsung melalui protokol file:// maupun saat di-deploy ke Vercel.
 */
(function (global) {
  "use strict";

  var STORAGE_KEY = "web_profil_state_v1";
  var MESSAGES_KEY = "web_profil_messages_v1";
  var SESSION_KEY = "web_profil_admin_session_v1";

  /**
   * Implementasi murni JavaScript SHA-256 agar verifikasi & ganti password
   * tetap berjalan pada protokol file:// lokal maupun HTTPS (Vercel).
   */
  function sha256(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }

    var utf8 = unescape(encodeURIComponent(ascii));
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = "length";
    var i, j;
    var result = "";

    var words = [];
    var asciiBitLength = utf8[lengthProperty] * 8;

    var hash = (sha256.h = sha256.h || []);
    var k = (sha256.k = sha256.k || []);
    var primeCounter = k[lengthProperty];

    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) {
          isComposite[i] = candidate;
        }
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }

    utf8 += "\x80";
    while ((utf8[lengthProperty] % 64) - 56) utf8 += "\x00";
    for (i = 0; i < utf8[lengthProperty]; i++) {
      j = utf8.charCodeAt(i);
      if (j >> 8) return "";
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
    words[words[lengthProperty]] = asciiBitLength;

    for (j = 0; j < words[lengthProperty]; ) {
      var w = words.slice(j, (j += 16));
      var oldHash = hash;
      hash = hash.slice(0, 8);

      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15],
          w2 = w[i - 2];
        var a = hash[0],
          e = hash[4];
        var temp1 =
          hash[7] +
          (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
          ((e & hash[5]) ^ (~e & hash[6])) +
          k[i] +
          (w[i] =
            i < 16
              ? w[i]
              : (w[i - 16] +
                  (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                  w[i - 7] +
                  (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
                0);
        var temp2 =
          (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
          ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }

      for (i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }

    for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        var b = (hash[i] >> (j * 8)) & 255;
        result += (b < 16 ? 0 : "") + b.toString(16);
      }
    }
    return result;
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function getBaseConfig() {
    return deepClone(global.APP_CONFIG || {});
  }

  function loadStateMeta() {
    var base = getBaseConfig();
    var hasLocalOverrides = false;
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          var savedBaseVer = Number(parsed.baseVersion || 0);
          var currentBaseVer = Number(base.version || 0);
          // Gunakan data localStorage selama versi config publik belum lebih baru
          if (savedBaseVer >= currentBaseVer) {
            hasLocalOverrides = true;
            return {
              state: {
                version: parsed.version || currentBaseVer,
                baseVersion: savedBaseVer,
                isCustomized: true,
                publishedAt: parsed.publishedAt || base.publishedAt,
                admin: Object.assign({}, base.admin, parsed.admin || {}),
                profile: Object.assign({}, base.profile, parsed.profile || {}),
                contact: Object.assign({}, base.contact, parsed.contact || {})
              },
              hasLocalOverrides: true
            };
          }
        }
      }
    } catch (err) {
      // Abaikan jika penyimpanan lokal tidak tersedia
    }
    return {
      state: base,
      hasLocalOverrides: hasLocalOverrides
    };
  }

  function getState() {
    return loadStateMeta().state;
  }

  function saveState(nextState) {
    var base = getBaseConfig();
    var payload = deepClone(nextState);
    payload.baseVersion = Number(base.version || 1);
    payload.version = Date.now();
    payload.isCustomized = true;
    payload.publishedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return payload;
  }

  function resetLocalState() {
    localStorage.removeItem(STORAGE_KEY);
    return getBaseConfig();
  }

  function getIconSvg(name, size) {
    var s = size || 20;
    switch (name) {
      case "instagram":
        return (
          '<svg width="' +
          s +
          '" height="' +
          s +
          '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>' +
          '<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>' +
          '<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>' +
          "</svg>"
        );
      case "github":
        return (
          '<svg width="' +
          s +
          '" height="' +
          s +
          '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>' +
          '<path d="M9 18c-4.51 2-5-2-7-2"></path>' +
          "</svg>"
        );
      case "globe":
        return (
          '<svg width="' +
          s +
          '" height="' +
          s +
          '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<circle cx="12" cy="12" r="10"></circle>' +
          '<line x1="2" y1="12" x2="22" y2="12"></line>' +
          '<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>' +
          "</svg>"
        );
      default:
        return (
          '<svg width="' +
          s +
          '" height="' +
          s +
          '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>' +
          '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>' +
          "</svg>"
        );
    }
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function safeUrl(url) {
    var trimmed = String(url || "").trim();
    if (!trimmed) return "#";
    if (/^(https?:\/\/|#|\/)/i.test(trimmed)) return trimmed;
    return "https://" + trimmed;
  }

  function checkSensitiveInfo(value) {
    var str = String(value || "").trim();
    if (!str) return null;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
      return "Terdeteksi format email. Sesuai ketentuan privasi, alamat email tidak perlu dicantumkan.";
    }
    if (/(\+62|62|08)[0-9\s\-]{7,}/.test(str)) {
      return "Terdeteksi format nomor telepon/HP. Sesuai ketentuan privasi, nomor HP tidak perlu dicantumkan.";
    }
    return null;
  }

  function formatBioParagraphs(bioText) {
    var parts = String(bioText || "")
      .split(/\n\s*\n/)
      .map(function (p) {
        return p.trim();
      })
      .filter(Boolean);
    if (!parts.length) return "";
    return parts
      .map(function (p) {
        return "<p>" + escapeHtml(p).replace(/\n/g, "<br>") + "</p>";
      })
      .join("");
  }

  /**
   * Menerapkan data profil ke elemen HTML.
   * Jika user mengedit langsung teks di HTML dan belum pernah mengubah via Admin/config.js,
   * elemen bertanda data-preserve-html="true" tetap dipertahankan agar tidak berubah saat publish.
   */
  function applyProfileToDom() {
    var meta = loadStateMeta();
    var state = meta.state;
    var shouldApplyStaticText = meta.hasLocalOverrides || Boolean(state.isCustomized);
    var p = state.profile || {};
    var c = state.contact || {};

    var bindMap = {
      nama: p.nama,
      peran: p.peran,
      tagline: p.tagline,
      sambutanHero: p.sambutanHero,
      ketersediaan: p.ketersediaan,
      contactSambutan: c.sambutan,
      komunitasJudul: c.komunitasJudul,
      komunitasDeskripsi: c.komunitasDeskripsi,
      instagramHandle: c.instagramHandle
    };

    document.querySelectorAll("[data-bind]").forEach(function (el) {
      var key = el.getAttribute("data-bind");
      var preserveHtml = el.getAttribute("data-preserve-html") === "true";
      if (preserveHtml && !shouldApplyStaticText) {
        return;
      }
      if (key === "bio") {
        el.innerHTML = formatBioParagraphs(p.bio);
        return;
      }
      if (Object.prototype.hasOwnProperty.call(bindMap, key) && bindMap[key] !== undefined) {
        el.textContent = bindMap[key];
      }
    });

    // Foto profil & Ilustrasi
    document.querySelectorAll("[data-bind-img]").forEach(function (img) {
      var key = img.getAttribute("data-bind-img");
      var preserveHtml = img.getAttribute("data-preserve-html") === "true";
      if (preserveHtml && !shouldApplyStaticText) {
        return;
      }
      var src = key === "foto" ? p.foto : key === "ilustrasi" ? p.ilustrasi : "";
      if (src) {
        img.src = src;
      }
      if (key === "foto" && p.nama) {
        img.alt = "Foto Profil " + p.nama;
      }
    });

    // Link Instagram (Logo jejaring komunitas = Instagram)
    document.querySelectorAll("[data-bind-instagram]").forEach(function (anchor) {
      var preserveHtml = anchor.getAttribute("data-preserve-html") === "true";
      if (!preserveHtml || shouldApplyStaticText) {
        anchor.href = safeUrl(c.instagramUrl);
      }
    });

    // Render Keahlian
    var skillsContainer = document.getElementById("skills-container");
    if (skillsContainer && (shouldApplyStaticText || !skillsContainer.children.length)) {
      var skills = Array.isArray(p.keahlian) ? p.keahlian : [];
      skillsContainer.innerHTML = skills
        .map(function (item) {
          return (
            '<div class="skill-card">' +
            '<div class="skill-top">' +
            '<span class="skill-cat">' +
            escapeHtml(item.kategori || "Keahlian") +
            "</span>" +
            '<span class="skill-level">' +
            escapeHtml(item.tingkat || "Aktif") +
            "</span>" +
            "</div>" +
            '<h3 class="skill-name">' +
            escapeHtml(item.nama) +
            "</h3>" +
            "</div>"
          );
        })
        .join("");
    }

    // Render Sorotan Karya / Fokus
    var highlightsContainer = document.getElementById("highlights-container");
    if (highlightsContainer && (shouldApplyStaticText || !highlightsContainer.children.length)) {
      var items = Array.isArray(p.sorotan) ? p.sorotan : [];
      highlightsContainer.innerHTML = items
        .map(function (item) {
          return (
            '<article class="feature-card">' +
            '<span class="tag-pill">' +
            escapeHtml(item.tag || "Karya") +
            "</span>" +
            "<h3>" +
            escapeHtml(item.judul) +
            "</h3>" +
            "<p>" +
            escapeHtml(item.deskripsi) +
            "</p>" +
            "</article>"
          );
        })
        .join("");
    }

    // Render Riwayat / Perjalanan Belajar
    var historyContainer = document.getElementById("history-container");
    if (historyContainer && (shouldApplyStaticText || !historyContainer.children.length)) {
      var historyList = Array.isArray(p.riwayat) ? p.riwayat : [];
      historyContainer.innerHTML = historyList
        .map(function (item) {
          return (
            '<div class="timeline-item">' +
            '<div class="timeline-dot" aria-hidden="true"></div>' +
            '<div class="timeline-content">' +
            '<span class="timeline-period">' +
            escapeHtml(item.periode) +
            "</span>" +
            "<h3>" +
            escapeHtml(item.judul) +
            "</h3>" +
            '<p class="timeline-org">' +
            escapeHtml(item.instansi) +
            "</p>" +
            "<p>" +
            escapeHtml(item.deskripsi) +
            "</p>" +
            "</div>" +
            "</div>"
          );
        })
        .join("");
    }

    // Render Daftar Kontak Digital (tanpa nomor HP, alamat, email)
    var contactLinksContainer = document.getElementById("contact-links-container");
    if (contactLinksContainer && (shouldApplyStaticText || !contactLinksContainer.children.length)) {
      var links = Array.isArray(c.links) ? c.links : [];
      contactLinksContainer.innerHTML = links
        .map(function (item) {
          var iconKey = item.ikon || "link";
          return (
            '<a class="contact-channel-card" href="' +
            escapeHtml(safeUrl(item.url)) +
            '" target="_blank" rel="noopener noreferrer">' +
            '<div class="channel-icon channel-icon-' +
            escapeHtml(iconKey) +
            '">' +
            getIconSvg(iconKey, 22) +
            "</div>" +
            '<div class="channel-body">' +
            '<span class="channel-label">' +
            escapeHtml(item.label) +
            "</span>" +
            '<strong class="channel-value">' +
            escapeHtml(item.nilai) +
            "</strong>" +
            "</div>" +
            '<span class="channel-arrow" aria-hidden="true">&rarr;</span>' +
            "</a>"
          );
        })
        .join("");
    }

    // Update indikator admin aktif pada navbar jika login
    updateAdminNavBadge();
  }

  function isAdminLoggedIn() {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "authenticated";
    } catch (e) {
      return false;
    }
  }

  function setAdminSession(active) {
    try {
      if (active) {
        sessionStorage.setItem(SESSION_KEY, "authenticated");
      } else {
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {
      // Abaikan
    }
  }

  function updateAdminNavBadge() {
    var navBtn = document.getElementById("nav-admin-link");
    if (!navBtn) return;
    if (isAdminLoggedIn()) {
      navBtn.innerHTML = '<span class="status-dot-online"></span> Panel Admin';
      navBtn.classList.add("is-logged-in");
    } else {
      navBtn.textContent = "Login Admin";
      navBtn.classList.remove("is-logged-in");
    }
  }

  function initNavbar() {
    var toggleBtn = document.getElementById("nav-toggle");
    var navMenu = document.getElementById("nav-menu");
    if (toggleBtn && navMenu) {
      toggleBtn.addEventListener("click", function () {
        var expanded = toggleBtn.getAttribute("aria-expanded") === "true";
        toggleBtn.setAttribute("aria-expanded", String(!expanded));
        navMenu.classList.toggle("open");
      });
    }
  }

  function getMessages() {
    try {
      var raw = localStorage.getItem(MESSAGES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveMessage(msgObj) {
    var list = getMessages();
    list.unshift({
      id: Date.now(),
      nama: msgObj.nama,
      subjek: msgObj.subjek,
      pesan: msgObj.pesan,
      waktu: new Date().toLocaleString("id-ID")
    });
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(list.slice(0, 30)));
  }

  function clearMessages() {
    localStorage.removeItem(MESSAGES_KEY);
  }

  function initContactForm() {
    var form = document.getElementById("contact-message-form");
    if (!form) return;
    var feedback = document.getElementById("contact-form-feedback");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nama = document.getElementById("msg-nama").value.trim();
      var subjek = document.getElementById("msg-subjek").value.trim();
      var pesan = document.getElementById("msg-pesan").value.trim();

      if (!nama || !pesan) {
        feedback.className = "form-alert form-alert-error";
        feedback.textContent = "Mohon lengkapi nama dan isi pesan terlebih dahulu.";
        return;
      }

      saveMessage({
        nama: nama,
        subjek: subjek || "Sapaan & Diskusi",
        pesan: pesan
      });

      form.reset();
      feedback.className = "form-alert form-alert-success";
      feedback.textContent =
        "Terima kasih, " +
        nama +
        ". Pesan Anda telah dicatat pada penyimpanan lokal browser ini. Untuk respons lebih cepat, Anda juga dapat menghubungi melalui Instagram.";
    });
  }

  function generateConfigJsContent(state) {
    var exportObj = deepClone(state);
    exportObj.version = Date.now();
    exportObj.isCustomized = true;
    exportObj.publishedAt = new Date().toISOString();
    delete exportObj.baseVersion;

    return (
      "/**\n" +
      " * Konfigurasi Utama Aplikasi Web Profil (Hasil Ekspor Panel Admin)\n" +
      " * ------------------------------------------------------------------\n" +
      " * Ganti file js/config.js dengan file ini sebelum melakukan upload/deploy\n" +
      " * ke Vercel agar seluruh data profil yang telah diedit tetap permanen.\n" +
      " */\n" +
      "window.APP_CONFIG = " +
      JSON.stringify(exportObj, null, 2) +
      ";\n"
    );
  }

  function compressImageToDataUrl(file, maxSize, callback) {
    var reader = new FileReader();
    reader.onload = function (event) {
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement("canvas");
        var width = img.width;
        var height = img.height;
        var limit = maxSize || 420;

        if (width > height && width > limit) {
          height = Math.round((height * limit) / width);
          width = limit;
        } else if (height > limit) {
          width = Math.round((width * limit) / height);
          height = limit;
        }

        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavbar();
    applyProfileToDom();
    initContactForm();
  });

  global.WebProfilApp = {
    sha256: sha256,
    getState: getState,
    saveState: saveState,
    resetLocalState: resetLocalState,
    loadStateMeta: loadStateMeta,
    applyProfileToDom: applyProfileToDom,
    isAdminLoggedIn: isAdminLoggedIn,
    setAdminSession: setAdminSession,
    updateAdminNavBadge: updateAdminNavBadge,
    checkSensitiveInfo: checkSensitiveInfo,
    generateConfigJsContent: generateConfigJsContent,
    compressImageToDataUrl: compressImageToDataUrl,
    getMessages: getMessages,
    clearMessages: clearMessages,
    getIconSvg: getIconSvg,
    escapeHtml: escapeHtml,
    safeUrl: safeUrl
  };
})(window);
