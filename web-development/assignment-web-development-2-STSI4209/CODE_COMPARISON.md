# Code Comparison: Vanilla JS vs Vue.js

## Real Examples from Your Project

---

## 1. Displaying the Table

### ❌ Vanilla JavaScript (`stok.js` - old version)

```javascript
function displayBahanAjar() {
    const tbody = document.getElementById('tableBahanAjar');
    tbody.innerHTML = '';  // Manually clear

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
        tbody.appendChild(row);  // Manually append
    });

    updateStatistik();  // Must manually call
}
```

**Problems:**
- ❌ Must manually clear and rebuild DOM
- ❌ Must manually call `updateStatistik()` after every change
- ❌ String concatenation is error-prone
- ❌ No automatic filtering/searching
- ❌ Must manually handle updates

---

### ✅ Vue.js (`stok-app.js` + `stok.html`)

**HTML Template:**
```html
<tbody v-if="filteredBahanAjar.length > 0">
    <tr v-for="(item, index) in filteredBahanAjar" :key="item.kodeBarang">
        <td>{{ index + 1 }}</td>
        <td>
            <img
                :src="item.coverUrl"
                :alt="`Cover ${item.namaBarang}`"
                class="cover-thumb"
                @error="handleCoverError">
        </td>
        <td>{{ item.kodeLokasi }}</td>
        <td>{{ item.kodeBarang }}</td>
        <td><strong>{{ item.namaBarang }}</strong></td>
        <td><span class="badge">{{ item.jenisBarang }}</span></td>
        <td>Edisi {{ item.edisi }}</td>
        <td>
            <span
                :class="[
                    'stok-badge',
                    { 'warning': Number(item.stok) < stockThreshold }
                ]">
                {{ formatNumber(item.stok) }}
            </span>
        </td>
        <td class="action-cell">
            <button
                type="button"
                class="btn-action btn-edit"
                @click="editItem(item.kodeBarang)"
                title="Edit data">
                ✏️
            </button>
            <button
                type="button"
                class="btn-action btn-delete"
                @click="deleteItem(item.kodeBarang)"
                title="Hapus data">
                🗑️
            </button>
        </td>
    </tr>
</tbody>
```

**JavaScript:**
```javascript
computed: {
    filteredBahanAjar() {
        const term = this.searchTerm.trim().toLowerCase();
        return this.normalizedList.filter(item => {
            const matchesTerm = !term || [
                item.kodeLokasi,
                item.kodeBarang,
                item.namaBarang,
                item.jenisBarang
            ].some(value => value.toLowerCase().includes(term));

            const matchesJenis = this.filterJenis === 'Semua'
                ? true
                : item.jenisBarang === this.filterJenis;

            const matchesStock = this.onlyLowStock
                ? Number(item.stok) < this.stockThreshold
                : true;

            return matchesTerm && matchesJenis && matchesStock;
        });
    },
    totalData() {
        return this.filteredBahanAjar.length;  // Auto-updates!
    }
}
```

**Benefits:**
- ✅ Automatic DOM updates when `bahanAjarList` changes
- ✅ Built-in filtering with computed properties
- ✅ Conditional styling (`:class` binding)
- ✅ No manual DOM manipulation
- ✅ Cleaner, more maintainable code

---

## 2. Form Submission

### ❌ Vanilla JavaScript

```javascript
document.getElementById('formBahanAjar').addEventListener('submit', function (e) {
    e.preventDefault();

    // Manually extract all form values
    const newItem = {
        kodeLokasi: document.getElementById('kodeLokasi').value,
        kodeBarang: document.getElementById('kodeBarang').value,
        namaBarang: document.getElementById('namaBarang').value,
        jenisBarang: document.getElementById('jenisBarang').value,
        edisi: document.getElementById('edisi').value,
        stok: parseInt(document.getElementById('stok').value),
        cover: 'https://via.placeholder.com/300x400?text=' + 
               encodeURIComponent(document.getElementById('namaBarang').value)
    };

    // Check duplicate
    const isDuplicate = dataBahanAjar.some(item => 
        item.kodeBarang === newItem.kodeBarang
    );

    if (isDuplicate) {
        alert('Kode Barang sudah ada! Gunakan kode yang berbeda.');
        return;
    }

    // Add to array
    dataBahanAjar.push(newItem);

    // Manually refresh everything
    displayBahanAjar();

    // Manually reset form
    batalTambah();

    alert('Bahan ajar berhasil ditambahkan!');
});
```

**Problems:**
- ❌ Lots of `document.getElementById()` calls
- ❌ Manual value extraction
- ❌ Must manually refresh display
- ❌ Must manually reset form
- ❌ No validation feedback

---

### ✅ Vue.js

**HTML Template:**
```html
<form @submit.prevent="submitForm" novalidate>
    <div class="form-group" :class="{ 'has-error': errors.kodeLokasi }">
        <label for="kodeLokasi">Kode Lokasi *</label>
        <input
            id="kodeLokasi"
            type="text"
            v-model="form.kodeLokasi"
            @blur="validateField('kodeLokasi')"
            placeholder="Contoh: 0JKT01">
        <small v-if="errors.kodeLokasi" class="error-text">
            {{ errors.kodeLokasi }}
        </small>
    </div>
    <!-- More fields... -->
    <button type="submit" class="btn-primary">
        {{ submitButtonLabel }}
    </button>
</form>
```

**JavaScript:**
```javascript
data() {
    return {
        form: {
            kodeLokasi: '',
            kodeBarang: '',
            namaBarang: '',
            jenisBarang: 'BMP',
            edisi: '',
            stok: '',
            cover: ''
        },
        errors: {},
        editingIndex: null
    }
},

methods: {
    submitForm() {
        // Validate
        if (!this.validateForm()) {
            this.showInfoMessage('Periksa kembali input Anda.', true);
            return;
        }

        // Form data is already in this.form!
        const payload = {
            ...this.form,
            stok: Number(this.form.stok),
            edisi: String(this.form.edisi),
            cover: this.form.cover || this.buildCover(this.form.namaBarang)
        };

        if (this.editingIndex === null) {
            this.bahanAjarList.push(payload);  // Vue auto-updates DOM!
        } else {
            this.bahanAjarList.splice(this.editingIndex, 1, payload);
        }

        this.resetForm();
        this.showForm = false;  // Auto-hides form
        this.showInfoMessage('Data bahan ajar berhasil disimpan.');
    },
    
    resetForm() {
        this.form = createEmptyForm();
        this.errors = {};
        this.editingIndex = null;
    },
    
    validateField(field) {
        const value = this.form[field];
        switch (field) {
            case 'kodeLokasi':
                if (!value) {
                    this.errors[field] = 'Kode lokasi wajib diisi.';
                } else if (!/^[0-9A-Z]{5,}$/.test(value)) {
                    this.errors[field] = 'Gunakan huruf kapital tanpa spasi, minimal 5 karakter.';
                } else {
                    delete this.errors[field];
                }
                break;
            // More validation...
        }
    }
}
```

**Benefits:**
- ✅ `v-model` automatically syncs form inputs with `this.form`
- ✅ Real-time validation with error messages
- ✅ No manual DOM queries
- ✅ Automatic UI updates
- ✅ Cleaner code structure

---

## 3. Search and Filter

### ❌ Vanilla JavaScript

```javascript
// You'd need to manually implement this:
function filterTable() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#tableBahanAjar tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Must manually call on every input change
document.getElementById('searchInput').addEventListener('input', filterTable);
```

**Problems:**
- ❌ Manual DOM manipulation
- ❌ Must manually show/hide rows
- ❌ No computed filtering
- ❌ Performance issues with large lists

---

### ✅ Vue.js

**HTML Template:**
```html
<input
    type="search"
    placeholder="Cari nama, kode, atau lokasi..."
    v-model="searchTerm"
    aria-label="Cari bahan ajar">
    
<select v-model="filterJenis">
    <option value="Semua">Semua Jenis</option>
    <option v-for="jenis in jenisBarangOptions" :key="jenis" :value="jenis">
        {{ jenis }}
    </option>
</select>

<label class="filter-checkbox">
    <input type="checkbox" v-model="onlyLowStock">
    <span>Stok &lt; {{ stockThreshold }}</span>
</label>
```

**JavaScript:**
```javascript
data() {
    return {
        searchTerm: '',
        filterJenis: 'Semua',
        onlyLowStock: false
    }
},

computed: {
    filteredBahanAjar() {
        const term = this.searchTerm.trim().toLowerCase();
        return this.normalizedList.filter(item => {
            const matchesTerm = !term || [
                item.kodeLokasi,
                item.kodeBarang,
                item.namaBarang,
                item.jenisBarang
            ].some(value => value.toLowerCase().includes(term));

            const matchesJenis = this.filterJenis === 'Semua'
                ? true
                : item.jenisBarang === this.filterJenis;

            const matchesStock = this.onlyLowStock
                ? Number(item.stok) < this.stockThreshold
                : true;

            return matchesTerm && matchesJenis && matchesStock;
        });
    }
}
```

**Benefits:**
- ✅ Automatic filtering when `searchTerm` or `filterJenis` changes
- ✅ Computed property is cached and efficient
- ✅ No manual DOM manipulation
- ✅ Multiple filters work together seamlessly

---

## 4. Auto-formatting Input

### ❌ Vanilla JavaScript

```javascript
document.getElementById('kodeLokasi').addEventListener('input', function() {
    this.value = this.value.replace(/\s+/g, '').toUpperCase();
});
```

---

### ✅ Vue.js

```javascript
watch: {
    'form.kodeLokasi'(value) {
        if (typeof value === 'string') {
            const formatted = value.replace(/\s+/g, '').toUpperCase();
            if (formatted !== value) {
                this.form.kodeLokasi = formatted;  // Auto-updates input!
            }
        }
        // Auto-validate on change
        if (this.errors.kodeLokasi) {
            this.validateField('kodeLokasi');
        }
    }
}
```

**Benefits:**
- ✅ Automatic formatting as user types
- ✅ Can trigger validation automatically
- ✅ Works with `v-model` seamlessly

---

## 5. Statistics Display

### ❌ Vanilla JavaScript

```javascript
function updateStatistik() {
    const totalData = document.getElementById('totalData');
    const totalStok = document.getElementById('totalStok');

    totalData.textContent = dataBahanAjar.length;

    const sumStok = dataBahanAjar.reduce((sum, item) => sum + item.stok, 0);
    totalStok.textContent = sumStok.toLocaleString('id-ID');
}

// Must call manually after every change!
displayBahanAjar();
updateStatistik();
```

---

### ✅ Vue.js

```javascript
computed: {
    totalData() {
        return this.filteredBahanAjar.length;  // Auto-updates!
    },
    totalStokKeseluruhan() {
        return this.bahanAjarList.reduce((sum, item) => 
            sum + Number(item.stok || 0), 0
        );
    },
    totalStokTerfilter() {
        return this.filteredBahanAjar.reduce((sum, item) => 
            sum + Number(item.stok || 0), 0
        );
    }
}
```

**HTML:**
```html
<p>
    Total Bahan Ajar Terlihat:
    <strong>{{ totalData }}</strong>
</p>
<p>
    Total Stok Terfilter:
    <strong>{{ formatNumber(totalStokTerfilter) }}</strong>
    <span v-if="totalStokTerfilter !== totalStokKeseluruhan">
        dari {{ formatNumber(totalStokKeseluruhan) }} stok keseluruhan.
    </span>
</p>
```

**Benefits:**
- ✅ Automatically updates when data changes
- ✅ No manual DOM updates needed
- ✅ Can show filtered vs total stats easily

---

## 6. Conditional Rendering

### ❌ Vanilla JavaScript

```javascript
function tampilkanFormTambah() {
    const formContainer = document.getElementById('formTambah');
    formContainer.style.display = 'block';
    document.getElementById('formBahanAjar').reset();
}

function batalTambah() {
    const formContainer = document.getElementById('formTambah');
    formContainer.style.display = 'none';
    document.getElementById('formBahanAjar').reset();
}
```

---

### ✅ Vue.js

```javascript
data() {
    return {
        showForm: false
    }
},

methods: {
    startCreate() {
        this.resetForm();
        this.showForm = true;  // Vue automatically shows form!
    },
    
    toggleForm() {
        this.showForm = !this.showForm;
        if (!this.showForm) {
            this.resetForm();
        }
    }
}
```

**HTML:**
```html
<transition name="fade">
    <section v-if="showForm" class="form-container">
        <!-- Form content -->
    </section>
</transition>
```

**Benefits:**
- ✅ Simple boolean toggle
- ✅ Automatic show/hide
- ✅ Can add transitions easily
- ✅ No manual style manipulation

---

## Summary: Key Differences

| Feature | Vanilla JS | Vue.js |
|---------|-----------|--------|
| **DOM Updates** | Manual (`innerHTML`, `appendChild`) | Automatic (reactive) |
| **Form Data** | Manual (`getElementById().value`) | Automatic (`v-model`) |
| **Event Handling** | `addEventListener()` | `@click`, `@submit` |
| **Conditional Display** | `style.display = 'none'` | `v-if`, `v-show` |
| **Lists** | Manual loop + `appendChild` | `v-for` |
| **Calculations** | Manual function calls | `computed` properties |
| **Data Watching** | Manual checks | `watch` |
| **Code Lines** | ~150 lines | ~100 lines (cleaner) |

---

## Why Vue.js is Better for This Project

1. **Less Code**: ~30% less code, easier to maintain
2. **Automatic Updates**: No manual DOM manipulation
3. **Better UX**: Real-time validation, instant filtering
4. **Reactive**: Changes propagate automatically
5. **Component-Based**: Reusable sidebar, user info components
6. **Type Safety**: Better error catching with computed properties
7. **Performance**: Computed properties are cached

---

## Learning Path

1. ✅ **Understand `v-model`** - Two-way data binding
2. ✅ **Understand `computed`** - Smart calculations
3. ✅ **Understand `v-for`** - List rendering
4. ✅ **Understand `v-if`** - Conditional rendering
5. ✅ **Understand `watch`** - Reacting to changes
6. ✅ **Understand Components** - Reusable pieces

Happy learning! 🚀

