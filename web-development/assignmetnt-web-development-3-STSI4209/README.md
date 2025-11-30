# SITTA - Vue.js Version

**Sistem Informasi Tiras dan Transaksi Bahan Ajar (SITTA) - Universitas Terbuka**

This is the Vue.js version of the SITTA application, converted from the vanilla JavaScript version (`assignment-web-development-2-STSI4209`).

---

## 📋 Table of Contents

1. [What is This Project?](#what-is-this-project)
2. [Key Differences: Vanilla JS vs Vue.js](#key-differences-vanilla-js-vs-vuejs)
3. [Project Structure](#project-structure)
4. [Vue.js Concepts for Beginners](#vuejs-concepts-for-beginners)
5. [Getting Started](#getting-started)
6. [Features](#features)

---

## 🎯 What is This Project?

This is a **Single Page Application (SPA)** built with Vue.js 3 that manages:
- **User Authentication** (Login system)
- **Dashboard** (Overview statistics)
- **Stock Management** (Bahan Ajar inventory)
- **Tracking System** (Delivery Order tracking)

### Comparison with Vanilla JS Version

| Aspect | Vanilla JS Version | Vue.js Version |
|--------|-------------------|---------------|
| **Files** | Multiple HTML files (login.html, index.html, etc.) | Single HTML file with Vue Router |
| **Navigation** | Page reloads (full page refresh) | Instant navigation (no page reload) |
| **Code Organization** | Separate JS files per page | Component-based architecture |
| **DOM Updates** | Manual manipulation | Automatic reactive updates |
| **State Management** | Global variables | Reactive data properties |
| **Form Handling** | Manual value extraction | Two-way data binding (`v-model`) |

---

## 🔄 Key Differences: Vanilla JS vs Vue.js

### 1. **Multiple Pages vs Single Page Application**

#### ❌ Vanilla JS (Old Version)
```
- login.html      → Separate HTML file
- index.html      → Separate HTML file  
- tracking.html   → Separate HTML file
- stok.html       → Separate HTML file

Navigation: Click link → Full page reload → New HTML file loads
```

#### ✅ Vue.js (This Version)
```
- index.html      → Single entry point
- Vue Router      → Handles all navigation internally

Navigation: Click link → Instant route change → No page reload
```

**Why it's better**: Faster navigation, smoother user experience, feels like a native app!

---

### 2. **File Structure**

#### ❌ Vanilla JS Structure
```
assignment-web-development-2-STSI4209/
├── index.html
├── login.html
├── tracking.html
├── stok.html
├── js/
│   ├── index-app.js
│   ├── login.js
│   ├── tracking-app.js
│   ├── stok-app.js
│   ├── data-source.js
│   └── components/
│       └── layout.js
└── css/
    └── style.css
```

#### ✅ Vue.js Structure
```
assignmetnt-web-development-3-STSI4209/
├── index.html              (Single entry point)
├── src/
│   ├── App.vue            (Root component)
│   ├── main.js            (Application entry)
│   ├── router/
│   │   └── index.js       (Route definitions)
│   ├── views/             (Page components)
│   │   ├── Login.vue
│   │   ├── Dashboard.vue
│   │   ├── Tracking.vue
│   │   └── Stok.vue
│   ├── components/         (Reusable components)
│   │   ├── AppSidebar.vue
│   │   ├── UserInfo.vue
│   │   ├── StatsGrid.vue
│   │   ├── QuickAccess.vue
│   │   └── EmptyState.vue
│   ├── data/
│   │   └── data-source.js  (Data module)
│   └── styles/
│       └── style.css       (Global styles)
└── package.json
```

**Why it's better**: Better organization, reusable components, easier to maintain!

---

### 3. **How Data Updates Work**

#### ❌ Vanilla JS Approach
```javascript
// You manually update the DOM
function updateTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';  // Clear table
    
    dataBahanAjar.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.namaBarang}</td>`;
        tbody.appendChild(row);  // Manually add each row
    });
}

// Must call this manually after every change!
addNewItem();
updateTable();  // ← You have to remember this!
```

#### ✅ Vue.js Approach
```vue
<!-- Template (HTML) -->
<template>
  <tr v-for="item in bahanAjarList" :key="item.kodeBarang">
    <td>{{ item.namaBarang }}</td>
  </tr>
</template>

<script setup>
import { ref } from 'vue'

const bahanAjarList = ref([...])  // Reactive data

// When you add a new item:
function addNewItem() {
  bahanAjarList.value.push(newItem)
  // Vue automatically updates the table! ✨
}
</script>
```

**Key Concept**: In Vue.js, when you change the data, the UI **automatically updates**. You don't need to manually update the DOM!

---

### 4. **Form Handling**

#### ❌ Vanilla JS Approach
```javascript
// Getting form values - lots of manual work
const form = document.getElementById('myForm');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Manually get each field
    const kodeLokasi = document.getElementById('kodeLokasi').value;
    const kodeBarang = document.getElementById('kodeBarang').value;
    const namaBarang = document.getElementById('namaBarang').value;
    
    // Create object
    const newItem = {
        kodeLokasi: kodeLokasi,
        kodeBarang: kodeBarang,
        namaBarang: namaBarang
    };
    
    // Manually reset form
    form.reset();
});
```

#### ✅ Vue.js Approach
```vue
<template>
  <form @submit.prevent="submitForm">
    <input v-model="form.kodeLokasi" />
    <input v-model="form.kodeBarang" />
    <input v-model="form.namaBarang" />
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

// Define form data once
const form = ref({
  kodeLokasi: '',
  kodeBarang: '',
  namaBarang: ''
})

function submitForm() {
  // form.value already has all the data! ✨
  console.log(form.value)
  
  // Reset is easy
  form.value = { kodeLokasi: '', kodeBarang: '', namaBarang: '' }
}
</script>
```

**Key Concept**: `v-model` creates **two-way binding**. When you type, the data updates. When you change the data, the input updates. It's automatic!

---

### 5. **Conditional Rendering**

#### ❌ Vanilla JS Approach
```javascript
// Show/hide elements manually
const formContainer = document.getElementById('form');
if (showForm) {
    formContainer.style.display = 'block';
} else {
    formContainer.style.display = 'none';
}

// Conditional content
if (items.length === 0) {
    tbody.innerHTML = '<tr><td>No data</td></tr>';
} else {
    // render items...
}
```

#### ✅ Vue.js Approach
```vue
<template>
  <!-- Show/hide based on data -->
  <section v-if="showForm" class="form-container">
    <!-- Form content -->
  </section>
  
  <!-- Conditional rendering -->
  <tbody v-if="items.length > 0">
    <tr v-for="item in items">...</tr>
  </tbody>
  <tbody v-else>
    <tr><td>No data</td></tr>
  </tbody>
</template>

<script setup>
import { ref } from 'vue'

const showForm = ref(false)
const items = ref([])

// Just change the data, Vue handles the display!
function toggleForm() {
  showForm.value = !showForm.value  // Vue updates automatically!
}
</script>
```

**Key Concept**: `v-if` conditionally renders elements. Just change your data, and Vue handles showing/hiding!

---

## 🏗️ Project Structure Explained

### **Views** (Pages)
These are the main pages of your application:
- `Login.vue` - Login page
- `Dashboard.vue` - Main dashboard with statistics
- `Tracking.vue` - Track delivery orders
- `Stok.vue` - Manage inventory (bahan ajar)

### **Components** (Reusable Parts)
These are reusable UI components used across pages:
- `AppSidebar.vue` - Navigation sidebar (used in Dashboard, Tracking, Stok)
- `UserInfo.vue` - User information display
- `StatsGrid.vue` - Statistics cards
- `QuickAccess.vue` - Quick access menu
- `EmptyState.vue` - Empty state message (when no data)

**Why Components?** Instead of copying the same HTML/JS code in multiple files, you create it once and reuse it!

### **Router** (Navigation)
`router/index.js` defines all the routes (URLs) in your application:
- `/login` → Shows Login.vue
- `/dashboard` → Shows Dashboard.vue
- `/tracking` → Shows Tracking.vue
- `/stok` → Shows Stok.vue

### **Data**
`data/data-source.js` contains all the mock data (users, inventory, tracking data).

---

## 📚 Vue.js Concepts for Beginners

### 1. **Single File Components (.vue files)**

A Vue component has 3 parts:
```vue
<template>
  <!-- HTML goes here -->
  <div>{{ message }}</div>
</template>

<script setup>
// JavaScript goes here
import { ref } from 'vue'
const message = ref('Hello Vue!')
</script>

<style scoped>
/* CSS goes here (scoped = only affects this component) */
div {
  color: blue;
}
</style>
```

### 2. **Reactive Data with `ref()`**

```javascript
import { ref } from 'vue'

const count = ref(0)  // Create reactive variable

// To access the value:
console.log(count.value)  // 0

// To change the value:
count.value = 5  // Vue automatically updates the UI!
```

### 3. **Template Syntax**

| Syntax | Purpose | Example |
|--------|---------|---------|
| `{{ }}` | Display text | `{{ item.name }}` |
| `v-if` | Show/hide element | `v-if="isVisible"` |
| `v-for` | Loop through array | `v-for="item in items"` |
| `v-model` | Two-way binding | `v-model="form.name"` |
| `@click` | Event handler | `@click="handleClick"` |
| `:src` | Bind attribute | `:src="imageUrl"` |

### 4. **Computed Properties**

Computed properties automatically recalculate when their dependencies change:

```javascript
import { computed, ref } from 'vue'

const items = ref([1, 2, 3, 4, 5])

// Computed property (cached, only recalculates when items changes)
const total = computed(() => {
  return items.value.reduce((sum, item) => sum + item, 0)
})

// In template: {{ total }}  (always shows correct sum!)
```

### 5. **Watchers**

Watch for changes and react to them:

```javascript
import { watch, ref } from 'vue'

const searchTerm = ref('')

// Watch for changes
watch(searchTerm, (newValue) => {
  console.log('User typed:', newValue)
  // Do something when searchTerm changes
})
```

### 6. **Lifecycle Hooks**

Functions that run at specific times:

```javascript
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  // Runs when component is added to page
  console.log('Component mounted!')
  loadData()
})

onBeforeUnmount(() => {
  // Runs before component is removed
  console.log('Component will be removed')
  // Cleanup code here
})
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.19.0 or v22.12.0+)
- npm or bun

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
bun install
```

2. **Start development server:**
   ```bash
   npm run dev
   # or
bun dev
```

3. **Open in browser:**
   - The app will be available at `http://localhost:5173` (or similar)
   - You'll be redirected to `/login` if not authenticated

### Build for Production

```bash
npm run build
# or
bun run build
```

The built files will be in the `dist/` folder.

---

## ✨ Features

### 🔐 Authentication
- Login system with user validation
- Session management (localStorage)
- Protected routes (requires login)

### 📊 Dashboard
- Real-time statistics
- Quick access menu
- Greeting based on time of day

### 📦 Stock Management (Stok)
- View all inventory items
- Add new items
- Edit existing items
- Delete items
- Search and filter
- Low stock warnings

### 🚚 Tracking
- Search by Delivery Order (DO) number
- View delivery status
- Timeline of delivery progress
- Search history

---

## 🎓 Learning Resources

If you're new to Vue.js, here are some helpful resources:

1. **Official Vue.js Guide**: https://vuejs.org/guide/
2. **Vue Router Documentation**: https://router.vuejs.org/
3. **Vue.js Tutorial**: https://vuejs.org/tutorial/

### Key Concepts to Learn:
- ✅ Reactive data (`ref`, `reactive`)
- ✅ Template syntax (`v-if`, `v-for`, `v-model`)
- ✅ Components and props
- ✅ Vue Router (navigation)
- ✅ Lifecycle hooks
- ✅ Computed properties and watchers

---

## 📝 Quick Comparison Summary

| Feature | Vanilla JS | Vue.js |
|---------|-----------|--------|
| **Pages** | Multiple HTML files | Single SPA with router |
| **DOM Updates** | Manual | Automatic |
| **Form Handling** | Manual value extraction | `v-model` binding |
| **Code Reuse** | Copy-paste | Components |
| **State Management** | Global variables | Reactive data |
| **Navigation** | Page reload | Instant (SPA) |
| **Code Organization** | Separate files | Component-based |

---

## 💡 Why Vue.js?

1. **Less Code**: No manual DOM manipulation
2. **Automatic Updates**: UI updates when data changes
3. **Better Organization**: Clear structure with components
4. **Faster Development**: Built-in features (routing, state management)
5. **Better UX**: Smooth navigation, no page reloads
6. **Easier Maintenance**: Component-based architecture

---

## 🐛 Troubleshooting

### Issue: "Cannot find module"
**Solution**: Run `npm install` to install dependencies.

### Issue: Port already in use
**Solution**: Vite will automatically try the next available port, or specify one in `vite.config.js`.

### Issue: Router not working
**Solution**: Make sure you're using `<router-link>` for navigation, not regular `<a>` tags.

---

## 📄 License

This project is for educational purposes.

---

**Happy Learning Vue.js! 🎉**
