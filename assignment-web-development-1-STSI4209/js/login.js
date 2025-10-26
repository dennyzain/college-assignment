
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = dataPengguna.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));

        alert('Login berhasil! Selamat datang ' + user.nama);
        window.location.href = 'dashboard.html';
    } else {
        alert('Email atau password yang anda masukkan salah!');
    }
});

document.getElementById('lupaPassword').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('modalLupaPassword').style.display = 'block';
});

document.getElementById('daftar').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('modalDaftar').style.display = 'block';
});

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function () {
        const modalId = this.getAttribute('data-modal');
        document.getElementById(modalId).style.display = 'none';
    });
});

// Close modal ketika klik di luar modal
window.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Cek apakah sudah login
window.addEventListener('load', function () {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'dashboard.html';
    }
});