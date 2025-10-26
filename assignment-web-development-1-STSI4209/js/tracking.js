const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser) {
    alert('Silakan login terlebih dahulu!');
    window.location.href = 'login.html';
}

function displayUserInfo() {
    const userInfoElement = document.getElementById('userInfo');

    if (userInfoElement) {
        userInfoElement.innerHTML = `
            <div style="text-align: right;">
                <div><strong>${currentUser.nama}</strong></div>
                <div style="font-size: 0.85em; color: #888;">${currentUser.role}</div>
            </div>
        `;
    }
}

function cariPengiriman() {
    const nomorDO = document.getElementById('nomorDO').value.trim();
    const trackingResult = document.getElementById('trackingResult');
    const notFound = document.getElementById('notFound');

    trackingResult.style.display = 'none';
    notFound.style.display = 'none';

    if (!nomorDO) {
        alert('Mohon masukkan Nomor Delivery Order!');
        return;
    }

    const tracking = dataTracking[nomorDO];

    if (tracking) {
        displayTrackingResult(tracking);
    } else {
        notFound.style.display = 'block';
    }
}

function displayTrackingResult(tracking) {
    const trackingResult = document.getElementById('trackingResult');

    document.getElementById('resultNomorDO').textContent = tracking.nomorDO;
    document.getElementById('resultNama').textContent = tracking.nama;
    document.getElementById('resultEkspedisi').textContent = tracking.ekspedisi;
    document.getElementById('resultTanggal').textContent = formatTanggal(tracking.tanggalKirim);
    document.getElementById('resultPaket').textContent = tracking.paket;
    document.getElementById('resultTotal').textContent = tracking.total;

    displayStatus(tracking.status);

    displayTimeline(tracking.perjalanan);

    trackingResult.style.display = 'block';

    trackingResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function displayStatus(status) {
    const statusBadge = document.getElementById('statusBadge');
    const progressFill = document.getElementById('progressFill');

    let badgeClass = '';
    let progressWidth = 0;

    switch (status) {
        case 'Dikirim':
            badgeClass = 'status-delivered';
            progressWidth = 100;
            break;
        case 'Dalam Perjalanan':
            badgeClass = 'status-in-transit';
            progressWidth = 60;
            break;
        case 'Diproses':
            badgeClass = 'status-processing';
            progressWidth = 30;
            break;
        default:
            badgeClass = 'status-pending';
            progressWidth = 10;
    }

    statusBadge.className = 'status-badge ' + badgeClass;
    statusBadge.textContent = status;
    progressFill.style.width = progressWidth + '%';
}

function displayTimeline(perjalanan) {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';

    perjalanan.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';

        if (index === 0) {
            timelineItem.classList.add('active');
        }

        timelineItem.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <div class="timeline-time">${formatWaktu(item.waktu)}</div>
                <div class="timeline-desc">${item.keterangan}</div>
            </div>
        `;

        timeline.appendChild(timelineItem);
    });
}

function formatTanggal(tanggalString) {
    const tanggal = new Date(tanggalString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return tanggal.toLocaleDateString('id-ID', options);
}

function formatWaktu(waktuString) {
    const waktu = new Date(waktuString);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return waktu.toLocaleDateString('id-ID', options);
}

function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

document.getElementById('nomorDO').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        cariPengiriman();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    displayUserInfo();
});