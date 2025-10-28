/* assets/js/map.js — Modernized map script with robust tile-provider fallback
   - Auto-fetch from API / local JSON
   - Polling & manual refresh
   - Debounced search
   - LayerGroup + Map of current markers (better perf)
   - Popup event binding (no inline onclick/alert)
   - Graceful DOM checks and error handling
   - Robust tile provider fallback + invalidateSize fix
*/

(() => {
  // CONFIG
  const DATA_URL = "assets/data/emergencies.json"; // change to your API endpoint if needed
  const POLL_INTERVAL_MS = 30000; // polling interval (30s)
  const MAP_CENTER = [16.0471, 108.2068];
  const MAP_ZOOM = 6;

  // fallback sample data if fetch fails
  const FALLBACK_EMERGENCIES = [
    { id: 1, name: "Cháy nhà dân", address: "Số 35 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội", coords: [21.027, 105.85], type: "fire", province: "hanoi", status: "active", time: "10 phút trước" },
    { id: 2, name: "Ngập lụt khu dân cư", address: "Khu vực Định Công, Hoàng Mai, Hà Nội", coords: [20.98, 105.84], type: "flood", province: "hanoi", status: "active", time: "25 phút trước" },
    { id: 3, name: "Tai nạn giao thông", address: "QL1A - Phường Tân Tạo, Bình Tân, TP.HCM", coords: [10.76, 106.62], type: "accident", province: "hcm", status: "resolved", time: "1 giờ trước" },
    { id: 4, name: "Sạt lở đất", address: "Huyện Mường La, Sơn La", coords: [21.41, 104.11], type: "disaster", province: "sonla", status: "active", time: "2 giờ trước" },
    { id: 5, name: "Cháy rừng", address: "Vườn Quốc Gia Cúc Phương, Ninh Bình", coords: [20.31, 105.61], type: "fire", province: "ninhbinh", status: "active", time: "3 giờ trước" },
    { id: 6, name: "Ngập cục bộ", address: "Đường Nguyễn Văn Linh, Đà Nẵng", coords: [16.06, 108.21], type: "flood", province: "danang", status: "resolved", time: "4 giờ trước" }
  ];

  // province coordinates (can extend)
  const provinceCoordinates = {
    hanoi: [21.0278, 105.8342],
    hcm: [10.8231, 106.6297],
    danang: [16.0544, 108.2022],
    hue: [16.4637, 107.5909],
    nghean: [18.6796, 105.6813],
    thanhhoa: [19.8076, 105.7766],
    haiphong: [20.8449, 106.6881],
    cantho: [10.0452, 105.7469],
    sonla: [21.3257, 103.9160],
    ninhbinh: [20.2506, 105.9745]
  };

  // helper: config per type: color (hex), emoji/icon, label
  function getTypeConfig(type) {
    const map = {
      fire: { color: "#ef4444", icon: "🔥", label: "Hỏa hoạn" },
      flood: { color: "#3b82f6", icon: "💧", label: "Ngập lụt" },
      accident: { color: "#f97316", icon: "🚗", label: "Tai nạn" },
      disaster: { color: "#8b5cf6", icon: "🌪️", label: "Thiên tai" },
    };
    return map[type] || { color: "#6b7280", icon: "⚠️", label: "Khác" };
  }

  // safe DOM getters
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // debounce util
  function debounce(fn, wait = 250) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  // modal builder (creates modal if not exists)
  function ensureModal() {
    if ($("#emergency-modal")) return $("#emergency-modal");
    const modal = document.createElement("div");
    modal.id = "emergency-modal";
    modal.className = "fixed inset-0 z-50 hidden items-center justify-center p-4";
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div class="flex justify-between items-start">
          <h3 id="em-modal-title" class="text-xl font-bold"></h3>
          <button id="em-modal-close" aria-label="Đóng">✕</button>
        </div>
        <div id="em-modal-body" class="mt-4"></div>
      </div>
    `;
    document.body.appendChild(modal);
    $("#em-modal-close").addEventListener("click", () => modal.classList.add("hidden"));
    // click outside to close
    modal.addEventListener("click", (ev) => {
      if (ev.target === modal) modal.classList.add("hidden");
    });
    return modal;
  }

  // show modal
  function showModal(title, html) {
    const modal = ensureModal();
    $("#em-modal-title").textContent = title;
    $("#em-modal-body").innerHTML = html;
    modal.classList.remove("hidden");
  }

  // format popup content (no inline onclick)
  function buildPopupHtml(emg) {
    const cfg = getTypeConfig(emg.type);
    return `
      <div class="p-3 min-w-[240px]">
        <div class="flex items-center gap-2 mb-2">
          <div style="background:${cfg.color};width:36px;height:36px;border-radius:999px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px">
            ${cfg.icon}
          </div>
          <div>
            <div style="font-weight:700;color:#1f2937">${emg.name}</div>
            <div style="font-size:12px;color:#6b7280">${emg.address}</div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;margin-top:6px">
          <span style="background:#f3f4f6;padding:4px 8px;border-radius:6px">${cfg.label}</span>
          <span style="color:#6b7280">${emg.time}</span>
        </div>
        <div style="margin-top:10px;display:flex;gap:8px">
          <button class="em-detail-btn flex-1 px-3 py-1 rounded" data-id="${emg.id}" style="background:#ef4444;color:#fff;border-radius:6px;border:none;cursor:pointer">Chi tiết</button>
          <button class="em-share-btn flex-1 px-3 py-1 rounded" data-id="${emg.id}" style="background:#3b82f6;color:#fff;border-radius:6px;border:none;cursor:pointer">Chia sẻ</button>
        </div>
      </div>
    `;
  }

  // state
  let emergencies = FALLBACK_EMERGENCIES.slice();
  let currentFilters = { type: "all", province: "all", search: "" };
  let markerLayer = null;
  let idToMarker = new Map();
  let pollTimer = null;
  let fetchController = null;

  // tile providers array (priority order). Each item: { name, url, options }
  const TILE_PROVIDERS = [
    {
      name: "OpenStreetMap (osm.fr)",
      url: "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
      options: { attribution: '&copy; OpenStreetMap contributors', maxZoom: 20 }
    },
    {
      name: "OpenStreetMap (standard)",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      options: { attribution: '&copy; OpenStreetMap contributors', maxZoom: 19 }
    },
    {
      name: "CartoDB Positron",
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      options: { attribution: '&copy; CartoDB', maxZoom: 19 }
    },
    {
      name: "Esri WorldStreetMap",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      options: { attribution: 'Tiles &copy; Esri', maxZoom: 19 }
    }
  ];

  // helper: create tileLayer with tracking of errors
  function createTileLayer(mapInstance, providerIndex = 0) {
    if (!TILE_PROVIDERS[providerIndex]) {
      console.error("No working tile providers available.");
      return null;
    }
    const prov = TILE_PROVIDERS[providerIndex];
    const layer = L.tileLayer(prov.url, prov.options);

    // count tile errors; if exceed threshold switch provider
    let tileErrorCount = 0;
    const ERROR_THRESHOLD = 50; // if many tiles failing, switch to next provider

    layer.on("tileerror", (err) => {
      tileErrorCount++;
      console.warn(`[tileerror] provider=${prov.name} count=${tileErrorCount}`, err);
      // if too many tile errors, switch provider
      if (tileErrorCount >= ERROR_THRESHOLD) {
        console.warn(`Tile provider "${prov.name}" failing. Switching to next provider.`);
        // remove current layer and try next provider
        try { layer.remove(); } catch (e) {}
        const next = createTileLayer(mapInstance, providerIndex + 1);
        if (next) next.addTo(mapInstance);
      }
    });

    return layer;
  }

  // ==========================
// Map init (đã fix ID/class)
// ==========================
function initMap() {
  // ✅ Đổi selector từ "#map" thành "#rescue-map" cho khớp HTML mới
  const mapEl = document.querySelector("#rescue-map");
  if (!mapEl) {
    console.warn("Không tìm thấy #rescue-map trong DOM. Bỏ qua khởi tạo bản đồ.");
    return null;
  }

  // ✅ Đảm bảo bản đồ có chiều cao đủ (tránh lỗi trắng map)
  const computed = window.getComputedStyle(mapEl);
  if ((!computed.height || computed.height === "0px") && !mapEl.style.height) {
    mapEl.style.height = "550px";
  }

  // ✅ Khởi tạo bản đồ
  const map = L.map(mapEl, {
    worldCopyJump: true,
    zoomControl: false // bạn có thể bật/tắt tùy ý
  }).setView(MAP_CENTER, MAP_ZOOM);

  // ✅ Fallback tile provider thông minh
  const initialTile = createTileLayer(map, 0);
  if (initialTile) initialTile.addTo(map);

  // ✅ Fix lỗi map trắng khi vừa load (invalidateSize)
  setTimeout(() => {
    try {
      map.invalidateSize();
    } catch (e) {
      console.warn("invalidateSize failed", e);
    }
  }, 300);

  // ✅ Thêm thước đo tỉ lệ
  L.control.scale({ imperial: false }).addTo(map);

  // ✅ Tạo layer chứa các marker
  markerLayer = L.layerGroup().addTo(map);

  // ✅ Bắt sự kiện popup để xử lý nút “Chi tiết” và “Chia sẻ”
  map.on("popupopen", (e) => {
    const pop = e.popup.getElement();
    if (!pop) return;
    const detailBtn = pop.querySelector(".em-detail-btn");
    const shareBtn = pop.querySelector(".em-share-btn");
    if (detailBtn) {
      detailBtn.addEventListener("click", () => {
        const id = detailBtn.dataset.id;
        const em = emergencies.find(x => String(x.id) === String(id));
        if (em) {
          showModal(em.name, renderDetailHtml(em));
        }
      });
    }
    if (shareBtn) {
      shareBtn.addEventListener("click", async () => {
        const id = shareBtn.dataset.id;
        const em = emergencies.find(x => String(x.id) === String(id));
        if (!em) return;
        if (navigator.share) {
          try {
            await navigator.share({
              title: `Sự cố: ${em.name}`,
              text: `${em.name} — ${em.address}`,
              url: window.location.href
            });
          } catch (err) {
            console.warn("Share cancelled or failed", err);
          }
        } else {
          try {
            await navigator.clipboard.writeText(window.location.href);
            alert("Đã sao chép liên kết (copy) vào clipboard.");
          } catch {
            alert("Trình duyệt không hỗ trợ chia sẻ/copy.");
          }
        }
      });
    }
  });

  return map;
}

  function renderDetailHtml(em) {
    const cfg = getTypeConfig(em.type);
    return `
      <div>
        <div style="display:flex;gap:12px;align-items:center">
          <div style="background:${cfg.color};width:46px;height:46px;border-radius:999px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px">${cfg.icon}</div>
          <div>
            <h4 style="margin:0 0 4px 0;font-weight:700">${em.name}</h4>
            <div style="font-size:13px;color:#6b7280">${em.address}</div>
          </div>
        </div>
        <div style="margin-top:10px">
          <p><strong>Loại:</strong> ${cfg.label}</p>
          <p><strong>Trạng thái:</strong> ${em.status}</p>
          <p><strong>Thời điểm:</strong> ${em.time}</p>
        </div>
        <div style="margin-top:12px;display:flex;gap:8px">
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(em.coords.join(','))}" target="_blank" style="padding:8px 12px;border-radius:6px;background:#ef4444;color:#fff;text-decoration:none">Mở trên Google Maps</a>
          <button id="em-modal-action" style="padding:8px 12px;border-radius:6px;background:#10b981;color:#fff;border:none;cursor:pointer">Đánh dấu đã xử lý</button>
        </div>
    `;
  }

  // draw markers from current filtered data
  function renderMarkers(mapInstance) {
    if (!mapInstance || !markerLayer) return;
    markerLayer.clearLayers();
    idToMarker.clear();

    const filtered = applyFiltersTo(emergencies);
    filtered.forEach(em => {
      const cfg = getTypeConfig(em.type);
      const markerHtml = `
        <div style="position:relative;display:flex;align-items:center;justify-content:center">
          <div style="width:40px;height:40px;border-radius:999px;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 6px 12px rgba(0,0,0,0.12);border:2px solid #fff;background:${cfg.color};transform:translateY(0);">
            <span style="font-size:18px">${cfg.icon}</span>
          </div>
          ${em.status === "active" ? `<div style="position:absolute;right:-4px;top:-4px;width:10px;height:10px;background:#ef4444;border-radius:999px;animation: pulseAnim 1.8s infinite;"></div>` : ""}
        </div>
      `.trim();

      const marker = L.marker(em.coords, {
        icon: L.divIcon({
          html: markerHtml,
          className: "custom-marker",
          iconSize: [44, 44],
          iconAnchor: [22, 22]
        })
      }).addTo(markerLayer);

      marker.bindPopup(buildPopupHtml(em));
      idToMarker.set(String(em.id), marker);
    });

    // update stats
    updateStatisticsUI();
  }

  // CSS keyframes injection for pulse (if not in CSS)
  function injectPulseKeyframe() {
    if (document.getElementById("pulse-style")) return;
    const s = document.createElement("style");
    s.id = "pulse-style";
    s.textContent = `
      @keyframes pulseAnim {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.18); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(s);
  }

  // apply filters
  function applyFiltersTo(data) {
    const q = currentFilters.search.trim().toLowerCase();
    return data.filter(em => {
      const typeOk = currentFilters.type === "all" || em.type === currentFilters.type;
      const provOk = currentFilters.province === "all" || em.province === currentFilters.province;
      const searchOk = q === "" ||
        (em.name && em.name.toLowerCase().includes(q)) ||
        (em.address && em.address.toLowerCase().includes(q));
      return typeOk && provOk && searchOk;
    });
  }

  // update statistics in DOM
  function updateStatisticsUI() {
    const active = emergencies.filter(e => e.status === "active").length;
    const resolved = emergencies.filter(e => e.status === "resolved").length;
    const elActive = $("#active-incidents");
    const elResolved = $("#resolved-incidents");
    if (elActive) elActive.textContent = active;
    if (elResolved) elResolved.textContent = resolved;

    // counts per type
    $$('[id^="count-"]').forEach(el => {
      const type = el.id.replace("count-", "");
      const count = emergencies.filter(e => e.type === type).length;
      el.textContent = count;
    });

    const lastUpdateEl = $("#last-update");
    if (lastUpdateEl) lastUpdateEl.textContent = new Date().toLocaleTimeString("vi-VN");
  }

  // fly to province
  function flyToProvince(mapInstance, code) {
    if (!mapInstance) return;
    if (code === "all") {
      mapInstance.flyTo(MAP_CENTER, MAP_ZOOM, { duration: 1.2, easeLinearity: 0.25 });
      return;
    }
    const coords = provinceCoordinates[code];
    if (!coords) return;
    mapInstance.flyTo(coords, 11, { duration: 1.2, easeLinearity: 0.25 });
    const temp = L.marker(coords).addTo(mapInstance).bindPopup(`<b>${getProvinceDisplayName(code)}</b><br>Hiển thị khu vực`).openPopup();
    setTimeout(() => {
      try { mapInstance.removeLayer(temp); } catch {}
    }, 2500);
  }

  // mapping province code -> display name (extend as needed)
  function getProvinceDisplayName(code) {
    const names = {
      hanoi: "Hà Nội",
      hcm: "TP. Hồ Chí Minh",
      danang: "Đà Nẵng",
      hue: "Thừa Thiên Huế",
      nghean: "Nghệ An",
      thanhhoa: "Thanh Hóa",
      haiphong: "Hải Phòng",
      cantho: "Cần Thơ",
      sonla: "Sơn La",
      ninhbinh: "Ninh Bình"
    };
    return names[code] || code;
  }

  // safe DOM wiring of UI controls
  function wireUi(mapInstance) {
    if (!mapInstance) return;

    injectPulseKeyframe();

    const typeFilter = $("#type-filter");
    const provinceFilter = $("#province-filter");
    const searchInput = $("#search-incidents");
    const resetBtn = $("#reset-filters");
    const locateBtn = $("#locate-btn");
    const zoomInBtn = $("#zoom-in-btn");
    const zoomOutBtn = $("#zoom-out-btn");

    if (typeFilter) {
      typeFilter.addEventListener("change", (e) => {
        currentFilters.type = e.target.value;
        renderMarkers(mapInstance);
      });
    }

    if (provinceFilter) {
      provinceFilter.addEventListener("change", (e) => {
        currentFilters.province = e.target.value;
        flyToProvince(mapInstance, e.target.value);
        renderMarkers(mapInstance);
      });
    }

    if (searchInput) {
      const deb = debounce((val) => {
        currentFilters.search = val;
        renderMarkers(mapInstance);
      }, 300);
      searchInput.addEventListener("input", (e) => deb(e.target.value));
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        currentFilters = { type: "all", province: "all", search: "" };
        if (typeFilter) typeFilter.value = "all";
        if (provinceFilter) provinceFilter.value = "all";
        if (searchInput) searchInput.value = "";
        flyToProvince(mapInstance, "all");
        renderMarkers(mapInstance);
      });
    }

    if (locateBtn) {
      locateBtn.addEventListener("click", () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            mapInstance.flyTo([lat, lng], 13, { duration: 1.2 });
            L.marker([lat, lng]).addTo(mapInstance).bindPopup("📍 Vị trí của bạn").openPopup();
          }, () => alert("Không thể lấy vị trí của bạn. Vui lòng kiểm tra quyền truy cập vị trí."));
        } else {
          alert("Trình duyệt không hỗ trợ định vị!");
        }
      });
    }

    if (zoomInBtn) zoomInBtn.addEventListener("click", () => mapInstance.zoomIn());
    if (zoomOutBtn) zoomOutBtn.addEventListener("click", () => mapInstance.zoomOut());

    // quick filter elements (class .filter-quick) and legend items (data-type)
    $$(".filter-quick").forEach(btn => {
      btn.addEventListener("click", () => {
        const t = btn.dataset.type || "all";
        currentFilters.type = t;
        if (typeFilter) typeFilter.value = t;
        renderMarkers(mapInstance);
      });
    });

    $$("[data-type]").forEach(item => {
      item.addEventListener("click", () => {
        const t = item.dataset.type || "all";
        currentFilters.type = t;
        if (typeFilter) typeFilter.value = t;
        renderMarkers(mapInstance);
      });
    });
  }

  // fetch data from API or local JSON, with abort + fallback
  async function fetchDataAndUpdate(mapInstance) {
    // abort previous in-flight
    if (fetchController) {
      try { fetchController.abort(); } catch {}
    }
    fetchController = new AbortController();
    const signal = fetchController.signal;

    try {
      const res = await fetch(DATA_URL, { signal, cache: "no-store" });
      if (!res.ok) throw new Error("Network response not ok");
      const data = await res.json();
      // validate basic structure - expecting array of objects with id, coords
      if (Array.isArray(data) && data.length) {
        emergencies = data;
      } else {
        console.warn("Data format unexpected, using fallback.");
        emergencies = FALLBACK_EMERGENCIES.slice();
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Fetch aborted (new fetch started).");
      } else {
        console.warn("Fetch failed, using fallback data:", err);
        emergencies = FALLBACK_EMERGENCIES.slice();
      }
    } finally {
      renderMarkers(mapInstance);
    }
  }

  // start polling (auto-refresh)
  function startPolling(mapInstance) {
    // immediate fetch
    fetchDataAndUpdate(mapInstance);
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(() => fetchDataAndUpdate(mapInstance), POLL_INTERVAL_MS);
  }

  // main init
  function main() {
    const mapInstance = initMap();
    if (!mapInstance) return;

    wireUi(mapInstance);
    renderMarkers(mapInstance); // render initial fallback
    startPolling(mapInstance); // kicks off fetch + subsequent updates

    // also update statistics every 30s UI-side
    setInterval(() => updateStatisticsUI(), 30000);
  }

  // expose minimal global functions for compatibility if other scripts expect them
  window.viewEmergencyDetail = function (id) {
    const em = emergencies.find(x => String(x.id) === String(id));
    if (em) showModal(em.name, renderDetailHtml(em));
  };
  window.shareEmergency = async function (id) {
    const em = emergencies.find(x => String(x.id) === String(id));
    if (!em) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Sự cố: ${em.name}`, text: `${em.name} — ${em.address}`, url: window.location.href });
      } catch (err) { console.warn(err); }
    } else {
      try { await navigator.clipboard.writeText(window.location.href); alert("Đã sao chép liên kết."); } catch { alert("Không hỗ trợ chia sẻ/copy"); }
    }
  };

  // start when DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();



