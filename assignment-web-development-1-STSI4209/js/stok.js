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

function displayBahanAjar() {
    const tbody = document.getElementById('tableBahanAjar');
    tbody.innerHTML = '';

    dataBahanAjar.forEach((item, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <img src="${item.cover}" alt="${item.namaBarang}" 
                     style="width: 50px; height: 70px; object-fit: cover; border-radius: 4px;"
                     onerror="this.src='https://via.placeholder.com/50x70?text=No+Image'">
            </td>
            <td>${item.kodeLokasi}</td>
            <td>${item.kodeBarang}</td>
            <td><strong>${item.namaBarang}</strong></td>
            <td><span class="badge">${item.jenisBarang}</span></td>
            <td>Edisi ${item.edisi}</td>
            <td><span class="stok-badge">${item.stok}</span></td>
            <td>
                <button class="btn-action btn-edit" onclick="editBahanAjar(${index})" title="Edit">✏️</button>
                <button class="btn-action btn-delete" onclick="hapusBahanAjar(${index})" title="Hapus">🗑️</button>
            </td>
        `;

        tbody.appendChild(row);
    });

    updateStatistik();
}

function updateStatistik() {
    const totalData = document.getElementById('totalData');
    const totalStok = document.getElementById('totalStok');

    totalData.textContent = dataBahanAjar.length;

    const sumStok = dataBahanAjar.reduce((sum, item) => sum + item.stok, 0);
    totalStok.textContent = sumStok.toLocaleString('id-ID');
}

function tampilkanFormTambah() {
    const formContainer = document.getElementById('formTambah');
    formContainer.style.display = 'block';

    document.getElementById('formBahanAjar').reset();

    formContainer.scrollIntoView({ behavior: 'smooth' });
}

function batalTambah() {
    const formContainer = document.getElementById('formTambah');
    formContainer.style.display = 'none';

    document.getElementById('formBahanAjar').reset();
}

document.getElementById('formBahanAjar').addEventListener('submit', function (e) {
    e.preventDefault();

    const newItem = {
        kodeLokasi: document.getElementById('kodeLokasi').value,
        kodeBarang: document.getElementById('kodeBarang').value,
        namaBarang: document.getElementById('namaBarang').value,
        jenisBarang: document.getElementById('jenisBarang').value,
        edisi: document.getElementById('edisi').value,
        stok: parseInt(document.getElementById('stok').value),
        cover: 'https://via.placeholder.com/300x400?text=' + encodeURIComponent(document.getElementById('namaBarang').value)
    };

    const isDuplicate = dataBahanAjar.some(item => item.kodeBarang === newItem.kodeBarang);

    if (isDuplicate) {
        alert('Kode Barang sudah ada! Gunakan kode yang berbeda.');
        return;
    }

    dataBahanAjar.push(newItem);

    displayBahanAjar();

    batalTambah();

    alert('Bahan ajar berhasil ditambahkan!');
});

function editBahanAjar(index) {
    const item = dataBahanAjar[index];

    const newStok = prompt(`Edit Stok untuk "${item.namaBarang}"\nStok saat ini: ${item.stok}`, item.stok);

    if (newStok !== null && newStok !== '') {
        const stokInt = parseInt(newStok);

        if (isNaN(stokInt) || stokInt < 0) {
            alert('Stok harus berupa angka positif!');
            return;
        }

        dataBahanAjar[index].stok = stokInt;
        displayBahanAjar();
        alert('Stok berhasil diupdate!');
    }
}

function hapusBahanAjar(index) {
    const item = dataBahanAjar[index];

    if (confirm(`Apakah Anda yakin ingin menghapus "${item.namaBarang}"?`)) {
        dataBahanAjar.splice(index, 1);
        displayBahanAjar();
        alert('Bahan ajar berhasil dihapus!');
    }
}

function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    displayUserInfo();
    displayBahanAjar();
});