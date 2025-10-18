// public/assets/js/auth.js
const apiBase = "/api";

async function postJSON(url, data) {
  const res = await fetch(url, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  });
  return res.json();
}

if (document.getElementById("registerForm")) {
  document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const json = await postJSON(apiBase + "/users/register", { name, email, phone, password });
    if (json.token) {
      localStorage.setItem("token", json.token);
      alert("Đăng ký thành công");
      location.href = "/";
    } else {
      alert(json.message || "Lỗi đăng ký");
    }
  });
}

if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const json = await postJSON(apiBase + "/users/login", { email, password });
    if (json.token) {
      localStorage.setItem("token", json.token);
      alert("Đăng nhập thành công");
      location.href = "/";
    } else {
      alert(json.message || "Lỗi đăng nhập");
    }
  });
}
