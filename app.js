(function () {
  const tg = window.Telegram && Telegram.WebApp;
  if (tg) { tg.ready(); tg.expand(); }
  const cfg = window.APP_CONFIG;
  const $ = (id) => document.getElementById(id);
  const ZONE_KEY = "monetag_zone_id", PTS_KEY = "points";
  let zone = "", inAppOn = false;

  const user = tg && tg.initDataUnsafe && tg.initDataUnsafe.user;
  $("user").textContent = user ? "👤 " + (user.first_name || "") + " (ID: " + user.id + ")" : "Telegram-এর বাইরে চলছে (টেস্ট মোড)";

  // Admin check
  const isAdmin = !cfg.ADMIN_IDS.length || (user && cfg.ADMIN_IDS.includes(user.id));
  if (!isAdmin) $("settings").classList.add("hidden");

  function toast(msg) {
    const t = $("toast"); t.textContent = msg; t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2200);
  }
  function setStatus(m) { $("status").textContent = m; }

  // ---- Storage (Telegram CloudStorage + localStorage fallback) ----
  function storeGet(key) {
    return new Promise((res) => {
      const local = localStorage.getItem(key) || "";
      if (tg && tg.CloudStorage && tg.isVersionAtLeast && tg.isVersionAtLeast("6.9")) {
        tg.CloudStorage.getItem(key, (err, v) => res(!err && v ? v : local));
      } else res(local);
    });
  }
  function storeSet(key, val) {
    localStorage.setItem(key, val);
    if (tg && tg.CloudStorage && tg.isVersionAtLeast && tg.isVersionAtLeast("6.9")) {
      tg.CloudStorage.setItem(key, val, () => {});
    }
  }

  // ---- Points ----
  let points = 0;
  function addPoints(n) { points += n; $("points").textContent = points; storeSet(PTS_KEY, String(points)); }

  // ---- Monetag SDK loader ----
  function loadSdk(z) {
    return new Promise((resolve, reject) => {
      const old = document.getElementById("monetag-sdk");
      if (old) old.remove();
      const fn = "show_" + z;
      const s = document.createElement("script");
      s.id = "monetag-sdk";
      s.src = "//libtl.com/sdk.js";
      s.setAttribute("data-zone", z);
      s.setAttribute("data-sdk", fn);
      s.onload = () => typeof window[fn] === "function" ? resolve(window[fn]) : reject(new Error("SDK ফাংশন পাওয়া যায়নি"));
      s.onerror = () => reject(new Error("Monetag SDK লোড হয়নি"));
      document.head.appendChild(s);
    });
  }

  function updateZoneUi() {
    $("zoneLabel").textContent = zone || "সেট করা নেই";
    $("zoneInput").value = zone;
    const has = !!zone;
    ["btnInter", "btnPop", "btnInApp"].forEach((id) => $(id).disabled = !has);
  }

  async function applyZone(z) {
    zone = z; updateZoneUi();
    if (!z) return setStatus("প্রথমে Settings থেকে Zone ID সেট করুন।");
    setStatus("SDK লোড হচ্ছে...");
    try { await loadSdk(z); setStatus("প্রস্তুত ✅"); }
    catch (e) { setStatus("❌ " + e.message); }
  }

  const showFn = () => window["show_" + zone];

  async function runAd(label, opt) {
    if (!zone || !showFn()) return toast("Zone ID সেট করুন");
    setStatus(label + " লোড হচ্ছে...");
    try {
      await (opt ? showFn()(opt) : showFn()());
      addPoints(cfg.REWARD_POINTS);
      setStatus("✅ অ্যাড সম্পন্ন! +" + cfg.REWARD_POINTS + " পয়েন্ট");
    } catch (e) {
      setStatus("⚠️ অ্যাড দেখানো যায়নি বা মাঝপথে বন্ধ হয়েছে।");
    }
  }

  $("btnInter").onclick = () => runAd("Interstitial");
  $("btnPop").onclick = () => runAd("Popup", "pop");
  $("btnInApp").onclick = () => {
    if (!zone || !showFn()) return toast("Zone ID সেট করুন");
    if (inAppOn) { toast("ইতিমধ্যে চালু আছে (রিলোড করলে বন্ধ হবে)"); return; }
    showFn()({ type: "inApp", inAppSettings: { frequency: 2, capping: 0.1, interval: 30, timeout: 5, everyPage: false } });
    inAppOn = true; $("btnInApp").textContent = "🔁 In-App চালু আছে";
    setStatus("In-App Interstitial চালু হয়েছে।");
  };

  $("btnSave").onclick = () => {
    const v = $("zoneInput").value.trim();
    if (!/^\d{5,10}$/.test(v)) return toast("সঠিক Zone ID দিন (শুধু সংখ্যা)");
    storeSet(ZONE_KEY, v); toast("Zone ID সেভ হয়েছে ✅");
    inAppOn = false; $("btnInApp").textContent = "🔁 In-App Interstitial চালু করুন";
    applyZone(v);
  };
  $("btnClear").onclick = () => {
    storeSet(ZONE_KEY, ""); toast("মুছে ফেলা হয়েছে");
    const o = document.getElementById("monetag-sdk"); if (o) o.remove();
    applyZone("");
  };

  (async function init() {
    points = parseInt(await storeGet(PTS_KEY), 10) || 0;
    $("points").textContent = points;
    const saved = await storeGet(ZONE_KEY);
    applyZone(saved || cfg.DEFAULT_ZONE_ID || "");
  })();
})();
