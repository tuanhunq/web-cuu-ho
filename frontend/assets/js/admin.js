//Thống kê & quản lý dữ liệu
// public/assets/js/admin.js
const apiBase = "/api";

document.getElementById("load")?.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(apiBase + "/rescue", {
    headers: { Authorization: "Bearer " + token }
  });
  const json = await res.json();
  const list = document.getElementById("list");
  if (!res.ok) {
    list.innerText = json.message || "Lỗi load";
    return;
  }
  list.innerHTML = "<table style='width:100%;border-collapse:collapse'><thead><tr><th>ID</th><th>Loại</th><th>Điện thoại</th><th>Vị trí</th><th>Trạng thái</th></tr></thead><tbody>" +
    json.reports.map(r => `<tr style="border-top:1px solid #eee"><td>${r._id}</td><td>${r.type}</td><td>${r.phone||""}</td><td>${r.location?.text||""}</td><td>${r.status}</td></tr>`).join("") +
    "</tbody></table>";
});
