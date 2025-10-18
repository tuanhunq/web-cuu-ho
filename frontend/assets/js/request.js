document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reqForm");
  const btnGet = document.getElementById("getLocation");
  const resultBox = document.getElementById("result");
  if (!form) return;

  function showResult(text, success = true) {
    if (!resultBox) return;
    resultBox.style.display = 'block';
    resultBox.innerText = text;
    resultBox.style.borderLeft = success ? '4px solid #00a36c' : '4px solid #ff4c4c';
  }

  if (btnGet) {
    btnGet.addEventListener('click', () => {
      if (!navigator.geolocation) return showResult('Trình duyệt không hỗ trợ GPS', false);
      showResult('Đang lấy vị trí...');
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);
        const locInput = document.getElementById('locationText');
        if (locInput) locInput.value = `${lat},${lon}`;
        showResult('Lấy vị trí thành công: ' + lat + ',' + lon);
      }, (err) => {
        showResult('Không thể lấy vị trí: ' + (err.message || 'Lỗi'), false);
      }, {timeout:8000});
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('type')?.value || '';
    const phone = document.getElementById('phone')?.value.trim() || '';
    const locationText = document.getElementById('locationText')?.value.trim() || '';
    const desc = document.getElementById('desc')?.value.trim() || '';

    if (!phone) return showResult('Vui lòng nhập số điện thoại liên hệ', false);

    showResult('Đang gửi yêu cầu...');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/rescue', {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}),
        body: JSON.stringify({ type, phone, location: { text: locationText }, description: desc })
      });

      const json = await res.json();
      if (!res.ok) {
        showResult(json.message || 'Lỗi gửi yêu cầu', false);
        return;
      }

      // backend returns report object
      const id = json.report?._id || json.report?.id || json.id || ('REQ-' + Date.now().toString().slice(-6));
      showResult('✅ Yêu cầu đã gửi. Mã: ' + id);
      form.reset();
      const follow = document.createElement('div');
      follow.style.marginTop = '8px';
      follow.innerHTML = `<a href="tracking.html#${id}" class="btn btn-primary">Theo dõi yêu cầu ${id}</a>`;
      resultBox.appendChild(follow);
    } catch (err) {
      console.error('send request error', err);
      showResult('Lỗi kết nối tới server: ' + (err.message || ''), false);
    }
  });
});
