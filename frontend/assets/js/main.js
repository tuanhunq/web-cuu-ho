document.addEventListener("DOMContentLoaded", () => {
  // Load navbar & footer
  loadComponent("components/navbar.html", "#navbar", () => setActiveNav());
  loadComponent("components/footer.html", "#footer");

  // Khởi tạo bản đồ
  const map = L.map("map").setView([21.0278, 105.8342], 6);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Marker demo
  const reports = [
    { name: "Thái Nguyên cần 5 xe máy", lat: 21.6, lng: 105.8 },
    { name: "Hà Tĩnh cần xuồng cứu trợ", lat: 18.35, lng: 105.9 },
  ];

  const container = document.getElementById("reportContainer");
  reports.forEach((r) => {
    const card = document.createElement("div");
    card.className = "report-card";
    card.innerHTML = `
      <span class="tag tag-need">🆘 Cần cứu hộ</span>
      <h4>${r.name}</h4>
      <small>📍 ${r.lat.toFixed(2)}, ${r.lng.toFixed(2)}</small>
      <div class="card-actions" style="margin-top:8px;display:flex;gap:8px">
        <a class="btn btn-small" href="request.html">Gửi yêu cầu</a>
        <a class="btn btn-small" href="tracking.html#REQ-DEMO">Theo dõi</a>
      </div>
    `;
    container.appendChild(card);

    const marker = L.marker([r.lat, r.lng]).addTo(map);
    marker.bindPopup(`<b>${r.name}</b>`);
  });

  // Nút mở modal
  document.getElementById("btnOpenReport").addEventListener("click", () => {
    document.getElementById("reportModal").style.display = "flex";
  });
});

function loadComponent(url, target, cb) {
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} while fetching ${url}`);
      return res.text();
    })
    .then((html) => {
      const el = document.querySelector(target);
      if (!el) throw new Error(`Target ${target} not found in DOM`);
      el.innerHTML = html;
      if (typeof cb === "function") cb();
    })
    .catch((err) => {
      console.error("loadComponent error:", err);
      const el = document.querySelector(target);
      if (el) el.innerHTML = `<!-- failed to load ${url} -->`;
    });
}

function setActiveNav() {
  try {
    const path = window.location.pathname.split("/").pop() || "index.html";
    const nav = document.querySelector("#navbar nav");
    if (!nav) return;
    nav.querySelectorAll("a").forEach((a) => {
      const href = a.getAttribute("href");
      if (!href) return;
      if (href === path || (href === "index.html" && path === "")) {
        a.classList.add("active");
      } else {
        a.classList.remove("active");
      }
    });
  } catch (e) {
    console.warn("setActiveNav failed:", e);
  }
}

// Modal helpers: close on overlay click or ESC
document.addEventListener('click', (e) => {
  const modal = document.getElementById('reportModal');
  if (!modal) return;
  if (modal.style.display !== 'flex') return;
  // if click outside modal-content -> close
  const content = modal.querySelector('.modal-content');
  if (content && !content.contains(e.target)) {
    modal.style.display = 'none';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('reportModal');
    if (modal) modal.style.display = 'none';
  }
});
