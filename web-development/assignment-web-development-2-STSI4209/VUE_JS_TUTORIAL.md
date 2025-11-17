# Vue.js Conversion Tutorial: From Vanilla JavaScript to Vue.js

## 📚 Overview

This tutorial explains how the stok (stock) management page was converted from **Vanilla JavaScript** to **Vue.js**. We'll compare both approaches side-by-side to understand the key differences and benefits.

---

## 🔄 Key Differences: Vanilla JS vs Vue.js

### 1. **Data Management**

#### ❌ Vanilla JavaScript (Imperative)
```javascript
// You manually manipulate the DOM
const tbody = document.getElementById('tableBahanAjar');
tbody.innerHTML = '';  // Clear the table

dataBahanAjar.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.namaBarang}</td>
        ...
    `;
    tbody.appendChild(row);  // Manually add each row
});
```

#### ✅ Vue.js (Declarative)
```javascript
// In Vue, you just define the data
data() {
    return {
        bahanAjarList: []  // Vue automatically updates the DOM when this changes
    }
}

// In HTML template:
<tr v-for="(item, index) in filteredBahanAjar" :key="item.kodeBarang">
    <td>{{ index + 1 }}</td>
    <td>{{ item.namaBarang }}</td>
</tr>
```

**Key Concept**: Vue uses **reactive data binding**. When `bahanAjarList` changes, Vue automatically updates the DOM for you!

---

### 2. **Two-Way Data Binding**

#### ❌ Vanilla JavaScript
```javascript
// Getting form values manually
const newItem = {
    kodeLokasi: document.getElementById('kodeLokasi').value,
    kodeBarang: document.getElementById('kodeBarang').value,
    namaBarang: document.getElementById('namaBarang').value,
    // ... more manual work
};

// Setting form values manually
document.getElementById('kodeLokasi').value = item.kodeLokasi;
document.getElementById('kodeBarang').value = item.kodeBarang;
```

#### ✅ Vue.js
```javascript
// Define form data once
data() {
    return {
        form: {
            kodeLokasi: '',
            kodeBarang: '',
            namaBarang: ''
        }
    }
}

// In HTML - automatically synced!
<input v-model="form.kodeLokasi" />
<input v-model="form.kodeBarang" />
```

**Key Concept**: `v-model` creates **two-way binding**. When you type in the input, `form.kodeLokasi` updates automatically. When you change `form.kodeLokasi` in JavaScript, the input updates automatically!

---

### 3. **Event Handling**

#### ❌ Vanilla JavaScript
```javascript
// Manual event listeners
document.getElementById('formBahanAjar').addEventListener('submit', function (e) {
    e.preventDefault();
    // handle submit
});

button.onclick = function() {
    editBahanAjar(index);
};
```

#### ✅ Vue.js
```javascript
// Direct event binding in template
<form @submit.prevent="submitForm">
    <button @click="editItem(item.kodeBarang)">Edit</button>
</form>

// In methods:
methods: {
    submitForm() {
        // handle submit
    },
    editItem(kodeBarang) {
        // handle edit
    }
}
```

**Key Concept**: `@click` is shorthand for `v-on:click`. The `.prevent` modifier automatically calls `preventDefault()`.

---

### 4. **Computed Properties (Smart Calculations)**

#### ❌ Vanilla JavaScript
```javascript
// You have to manually recalculate every time
function updateStatistik() {
    const totalData = document.getElementById('totalData');
    const totalStok = document.getElementById('totalStok');
    
    totalData.textContent = dataBahanAjar.length;
    
    const sumStok = dataBahanAjar.reduce((sum, item) => sum + item.stok, 0);
    totalStok.textContent = sumStok.toLocaleString('id-ID');
}

// Must call this manually after every change!
displayBahanAjar();
updateStatistik();
```

#### ✅ Vue.js
```javascript
// Computed properties automatically recalculate when dependencies change
computed: {
    totalData() {
        return this.filteredBahanAjar.length;  // Auto-updates!
    },
    totalStokKeseluruhan() {
        return this.bahanAjarList.reduce((sum, item) => 
            sum + Number(item.stok || 0), 0
        );
    },
    filteredBahanAjar() {
        // Automatically filters when searchTerm or filterJenis changes
        return this.bahanAjarList.filter(item => {
            const matchesTerm = !this.searchTerm || 
                item.namaBarang.toLowerCase().includes(this.searchTerm.toLowerCase());
            return matchesTerm;
        });
    }
}

// In HTML - always up-to-date!
<p>Total: <strong>{{ totalData }}</strong></p>
```

**Key Concept**: Computed properties are **cached** and only recalculate when their dependencies change. Much more efficient!

---

### 5. **Conditional Rendering**

#### ❌ Vanilla JavaScript
```javascript
// Manual show/hide
const formContainer = document.getElementById('formTambah');
formContainer.style.display = 'block';  // Show
formContainer.style.display = 'none';   // Hide

// Manual conditional content
if (bahanAjarList.length === 0) {
    tbody.innerHTML = '<tr><td>No data</td></tr>';
} else {
    // render data
}
```

#### ✅ Vue.js
```javascript
// In data:
data() {
    return {
        showForm: false
    }
}

// In HTML template:
<section v-if="showForm" class="form-container">
    <!-- Form content -->
</section>

<!-- Conditional rendering -->
<tbody v-if="filteredBahanAjar.length > 0">
    <!-- Show data -->
</tbody>
<tbody v-else-if="bahanAjarList.length === 0">
    <empty-state title="Belum ada data" />
</tbody>
<tbody v-else>
    <empty-state title="Data tidak ditemukan" />
</tbody>
```

**Key Concept**: `v-if`, `v-else-if`, `v-else` conditionally render elements. `v-show` toggles CSS display property.

---

### 6. **Watchers (Reacting to Changes)**

#### ❌ Vanilla JavaScript
```javascript
// No built-in way to watch for changes
// You have to manually check or use events
input.addEventListener('input', function() {
    // Format the value
    this.value = this.value.toUpperCase();
});
```

#### ✅ Vue.js
```javascript
watch: {
    // Watch a specific property
    'form.kodeLokasi'(value) {
        // Auto-format when user types
        if (typeof value === 'string') {
            const formatted = value.replace(/\s+/g, '').toUpperCase();
            if (formatted !== value) {
                this.form.kodeLokasi = formatted;
            }
        }
        // Auto-validate
        if (this.errors.kodeLokasi) {
            this.validateField('kodeLokasi');
        }
    },
    
    // Watch entire array with deep watching
    bahanAjarList: {
        deep: true,  // Watch nested changes
        handler(newValue) {
            // Auto-save to localStorage
            localStorage.setItem('bahanAjarList', JSON.stringify(newValue));
        }
    }
}
```

**Key Concept**: Watchers let you react to data changes and perform side effects (like saving to localStorage).

---

## 📊 Side-by-Side Comparison

### **Displaying Data in Table**

#### Vanilla JS:
```javascript
function displayBahanAjar() {
    const tbody = document.getElementById('tableBahanAjar');
    tbody.innerHTML = '';  // Clear first
    
    dataBahanAjar.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${item.cover}" /></td>
            <td>${item.kodeLokasi}</td>
            <td>${item.namaBarang}</td>
            <td>
                <button onclick="editBahanAjar(${index})">Edit</button>
                <button onclick="hapusBahanAjar(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updateStatistik();  // Must manually update stats
}
```

#### Vue.js:
```html
<!-- HTML Template -->
<tr v-for="(item, index) in filteredBahanAjar" :key="item.kodeBarang">
    <td>{{ index + 1 }}</td>
    <td><img :src="item.coverUrl" @error="handleCoverError" /></td>
    <td>{{ item.kodeLokasi }}</td>
    <td>{{ item.namaBarang }}</td>
    <td>
        <button @click="editItem(item.kodeBarang)">Edit</button>
        <button @click="deleteItem(item.kodeBarang)">Delete</button>
    </td>
</tr>

<!-- Stats automatically update! -->
<p>Total: <strong>{{ totalData }}</strong></p>
```

**Benefits**:
- ✅ No manual DOM manipulation
- ✅ Automatic updates when data changes
- ✅ Cleaner, more readable code
- ✅ Built-in filtering with computed properties

---

### **Form Handling**

#### Vanilla JS:
```javascript
document.getElementById('formBahanAjar').addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Manually get all values
    const newItem = {
        kodeLokasi: document.getElementById('kodeLokasi').value,
        kodeBarang: document.getElementById('kodeBarang').value,
        namaBarang: document.getElementById('namaBarang').value,
        jenisBarang: document.getElementById('jenisBarang').value,
        edisi: document.getElementById('edisi').value,
        stok: parseInt(document.getElementById('stok').value),
    };
    
    // Check duplicate
    const isDuplicate = dataBahanAjar.some(item => 
        item.kodeBarang === newItem.kodeBarang
    );
    
    if (isDuplicate) {
        alert('Kode Barang sudah ada!');
        return;
    }
    
    // Add to array
    dataBahanAjar.push(newItem);
    
    // Manually refresh display
    displayBahanAjar();
    
    // Manually reset form
    document.getElementById('formBahanAjar').reset();
    
    alert('Berhasil ditambahkan!');
});
```

#### Vue.js:
```html
<!-- HTML Template -->
<form @submit.prevent="submitForm">
    <input v-model="form.kodeLokasi" />
    <input v-model="form.kodeBarang" />
    <input v-model="form.namaBarang" />
    <select v-model="form.jenisBarang">...</select>
    <input v-model.number="form.edisi" />
    <input v-model.number="form.stok" />
    <button type="submit">Simpan</button>
</form>
```

```javascript
// JavaScript
methods: {
    submitForm() {
        // Validate
        if (!this.validateForm()) {
            this.showInfoMessage('Periksa input Anda.', true);
            return;
        }
        
        // Form data is already in this.form (thanks to v-model!)
        const payload = {
            ...this.form,
            stok: Number(this.form.stok),
            edisi: String(this.form.edisi),
        };
        
        if (this.editingIndex === null) {
            this.bahanAjarList.push(payload);  // Vue auto-updates DOM!
        } else {
            this.bahanAjarList.splice(this.editingIndex, 1, payload);
        }
        
        this.resetForm();  // Reset form data
        this.showForm = false;  // Hide form (Vue auto-updates!)
        this.showInfoMessage('Data berhasil disimpan.');
    },
    
    resetForm() {
        this.form = createEmptyForm();  // Reset form object
        this.errors = {};
        this.editingIndex = null;
    }
}
```

**Benefits**:
- ✅ No manual value extraction
- ✅ Automatic form reset
- ✅ Reactive updates
- ✅ Cleaner validation

---

## 🎯 Vue.js Core Concepts

### 1. **Reactive Data**
```javascript
data() {
    return {
        bahanAjarList: []  // This is reactive!
    }
}
```
When you change `this.bahanAjarList`, Vue automatically updates all parts of the UI that use it.

### 2. **Template Syntax**
- `{{ }}` - Text interpolation: `{{ item.namaBarang }}`
- `v-bind` or `:` - Bind attributes: `:src="item.cover"` or `:class="{ active: isActive }"`
- `v-model` - Two-way binding: `v-model="form.namaBarang"`
- `v-if` / `v-show` - Conditional rendering
- `v-for` - List rendering: `v-for="item in list"`
- `@` or `v-on` - Event handling: `@click="handleClick"`

### 3. **Lifecycle Hooks**
```javascript
mounted() {
    // Runs after component is added to DOM
    this.loadUser();
    this.loadData();
},

beforeUnmount() {
    // Cleanup (like clearing timers)
    if (this.clockTimer) {
        clearInterval(this.clockTimer);
    }
}
```

### 4. **Computed vs Methods**
```javascript
computed: {
    // Cached - only recalculates when dependencies change
    totalData() {
        return this.bahanAjarList.length;
    }
},

methods: {
    // Runs every time it's called
    calculateTotal() {
        return this.bahanAjarList.length;
    }
}
```

---

## 🚀 Advantages of Vue.js

1. **Less Code**: No manual DOM manipulation
2. **Automatic Updates**: UI updates when data changes
3. **Better Organization**: Clear separation of data, logic, and template
4. **Reactive**: Changes propagate automatically
5. **Component-Based**: Reusable components (like `<app-sidebar>`, `<user-info>`)
6. **Developer Experience**: Better debugging, clearer code structure

---

## 📝 Quick Reference: Vue.js Directives

| Directive | Purpose | Example |
|-----------|---------|---------|
| `v-if` | Conditionally render element | `v-if="showForm"` |
| `v-show` | Toggle visibility (CSS display) | `v-show="isVisible"` |
| `v-for` | Loop through array | `v-for="item in list"` |
| `v-model` | Two-way data binding | `v-model="form.name"` |
| `v-bind` or `:` | Bind attribute | `:src="imageUrl"` |
| `v-on` or `@` | Event listener | `@click="handleClick"` |
| `v-text` | Set text content | `v-text="message"` |
| `v-html` | Set HTML content | `v-html="htmlContent"` |

---

## 🎓 Practice Exercise

Try converting this vanilla JavaScript code to Vue.js:

```javascript
// Vanilla JS
const button = document.getElementById('toggleBtn');
const content = document.getElementById('content');
let isVisible = false;

button.addEventListener('click', function() {
    isVisible = !isVisible;
    if (isVisible) {
        content.style.display = 'block';
    } else {
        content.style.display = 'none';
    }
});
```

**Vue.js Solution:**
```html
<button @click="isVisible = !isVisible">Toggle</button>
<div v-show="isVisible">Content</div>
```

```javascript
data() {
    return {
        isVisible: false
    }
}
```

---

## 📚 Next Steps

1. **Components**: Learn about creating reusable components
2. **Props & Events**: Passing data between components
3. **Vue Router**: For single-page applications
4. **Vuex/Pinia**: For state management in larger apps

---

## 💡 Key Takeaways

1. **Vue.js is Declarative**: You describe WHAT you want, not HOW to do it
2. **Reactive Data**: Changes to data automatically update the UI
3. **Less Boilerplate**: No need for manual DOM manipulation
4. **Better Organization**: Clear structure with data, computed, methods, etc.
5. **Component-Based**: Build reusable, maintainable components

Happy coding! 🎉

