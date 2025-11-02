
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser) {
    alert('Silakan login terlebih dahulu!');
    window.location.href = 'login.html';
}

function getGreeting() {
    const now = new Date();
    const hour = now.getHours();

    let greeting = '';
    let icon = '';

    if (hour >= 5 && hour < 11) {
        greeting = 'Selamat Pagi';
        icon = '🌅';
    } else if (hour >= 11 && hour < 15) {
        greeting = 'Selamat Siang';
        icon = '☀️';
    } else if (hour >= 15 && hour < 19) {
        greeting = 'Selamat Sore';
        icon = '🌇';
    } else {
        greeting = 'Selamat Malam';
        icon = '🌙';
    }

    return { greeting, icon };
}

function displayGreeting() {
    const { greeting, icon } = getGreeting();
    const greetingElement = document.getElementById('greeting');

    if (greetingElement) {
        greetingElement.innerHTML = `${icon} ${greeting}, <strong>${currentUser.nama}</strong>`;
    }
}

function displayUserInfo() {
    const userInfoElement = document.getElementById('userInfo');

    if (userInfoElement) {
        userInfoElement.innerHTML = `
            <div style="text-align: right;">
                <div><strong>${currentUser.nama}</strong></div>
                <div style="font-size: 0.85em; color: #888;">${currentUser.role} - ${currentUser.lokasi}</div>
            </div>
        `;
    }
}

function calculateStats() {
    const totalBahanAjarElement = document.getElementById('totalBahanAjar');
    const totalStokElement = document.getElementById('totalStok');

    if (totalBahanAjarElement) {
        totalBahanAjarElement.textContent = dataBahanAjar.length;
    }

    if (totalStokElement) {
        const totalStok = dataBahanAjar.reduce((sum, item) => sum + item.stok, 0);
        totalStokElement.textContent = totalStok.toLocaleString('id-ID');
    }
}

function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    displayGreeting();
    displayUserInfo();
    calculateStats();
});

setInterval(displayGreeting, 60000);