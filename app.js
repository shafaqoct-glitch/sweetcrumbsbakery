// Sweet Crumbs Bakery - Main Application JavaScript SPA Logic

// 1. Initial State Definition
const DEFAULT_COUPONS = [
  { code: 'WELCOME10', discount: 10, type: 'percent' },
  { code: 'CRUMBS20', discount: 20, type: 'percent' }
];

const state = {
  products: JSON.parse(localStorage.getItem('bakery_products')) || [],
  cart: JSON.parse(localStorage.getItem('bakery_cart')) || [],
  wishlist: JSON.parse(localStorage.getItem('bakery_wishlist')) || [],
  orders: JSON.parse(localStorage.getItem('bakery_orders')) || [],
  coupons: JSON.parse(localStorage.getItem('bakery_coupons')) || DEFAULT_COUPONS,
  newsletterSubscribers: JSON.parse(localStorage.getItem('bakery_subscribers')) || [],
  
  // App Navigation and Filter State
  currentView: 'home',
  activeCategory: 'all',
  searchQuery: '',
  sortOption: 'default',
  
  // Custom Cake Builder Selection
  cakeCustomizer: {
    flavor: 'chocolate',
    size: '1kg',
    tiers: '1',
    frosting: 'buttercream',
    toppings: [],
    eggless: false,
    message: '',
    deliveryDate: '',
    notes: ''
  },
  
  // Active Coupon Applied
  appliedCoupon: null,
  
  // Admin View Sub-tab
  activeAdminTab: 'analytics',
  adminAuthenticated: false,
  editingProductId: null,
  
  // Account Sub-tab
  activeAccountTab: 'profile',
  selectedOrderTrackId: null
};

// 2. Lifecycle & Init
window.addEventListener('DOMContentLoaded', () => {
  // If products are empty in localstorage, seed from mockData
  if (state.products.length === 0 && window.bakeryProducts) {
    state.products = [...window.bakeryProducts];
    saveProductsToStorage();
  }
  
  // Setup view router
  initRouter();
  updateBadges();
  
  // Check if URL parameters exist (simulated via hash routing if wanted, otherwise tab-based)
  navigateTo('home');
});

// Storage Helpers
function saveCartToStorage() { localStorage.setItem('bakery_cart', JSON.stringify(state.cart)); }
function saveWishlistToStorage() { localStorage.setItem('bakery_wishlist', JSON.stringify(state.wishlist)); }
function saveOrdersToStorage() { localStorage.setItem('bakery_orders', JSON.stringify(state.orders)); }
function saveProductsToStorage() { localStorage.setItem('bakery_products', JSON.stringify(state.products)); }
function saveCouponsToStorage() { localStorage.setItem('bakery_coupons', JSON.stringify(state.coupons)); }
function saveSubscribersToStorage() { localStorage.setItem('bakery_subscribers', JSON.stringify(state.newsletterSubscribers)); }

// 3. Router & Navigation
function initRouter() {
  // Bind close buttons and outside click events
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleCartDrawer(false);
      closeModal();
      closeLightbox();
    }
  });
}

function navigateTo(view, params = {}) {
  state.currentView = view;
  toggleMobileMenu(false); // Close mobile menu if open
  
  // Manage navbar active state
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.classList.remove('active');
    const text = link.innerText.toLowerCase();
    if (text === view || (view === 'categories' && text === 'categories') || (view === 'custom-cakes' && text === 'custom cakes')) {
      link.classList.add('active');
    }
  });

  const main = document.getElementById('main-content');
  main.className = 'fade-in';
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Route Views
  switch (view) {
    case 'home':
      renderHome();
      break;
    case 'shop':
      if (params.category) state.activeCategory = params.category;
      renderShop();
      break;
    case 'categories':
      renderCategories();
      break;
    case 'custom-cakes':
      renderCustomCakes();
      break;
    case 'gallery':
      renderGallery();
      break;
    case 'about':
      renderAbout();
      break;
    case 'contact':
      renderContact();
      break;
    case 'faq':
      renderFAQ();
      break;
    case 'blog':
      renderBlog(params);
      break;
    case 'cart':
      renderCart();
      break;
    case 'checkout':
      renderCheckout();
      break;
    case 'account':
      if (params.tab) state.activeAccountTab = params.tab;
      if (params.orderId) state.selectedOrderTrackId = params.orderId;
      renderAccount();
      break;
    case 'admin':
      renderAdmin();
      break;
    default:
      renderHome();
  }
  
  updateBadges();
}

function updateBadges() {
  const cartBadge = document.getElementById('cart-badge');
  const wishlistBadge = document.getElementById('wishlist-badge');
  
  const totalCartQty = state.cart.reduce((total, item) => total + item.quantity, 0);
  cartBadge.innerText = totalCartQty;
  cartBadge.style.display = totalCartQty > 0 ? 'flex' : 'none';
  
  wishlistBadge.innerText = state.wishlist.length;
  wishlistBadge.style.display = state.wishlist.length > 0 ? 'flex' : 'none';
}

function toggleMobileMenu(forceState) {
  const menu = document.getElementById('nav-menu');
  const icon = document.getElementById('hamburger-icon');
  
  if (forceState !== undefined) {
    if (forceState) {
      menu.classList.add('open');
      icon.className = 'fa-solid fa-xmark';
    } else {
      menu.classList.remove('open');
      icon.className = 'fa-solid fa-bars';
    }
    return;
  }
  
  const isOpen = menu.classList.toggle('open');
  icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
}

// 4. Modal Handlers
function showModal(title, bodyHtml) {
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-title').innerText = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  overlay.classList.add('open');
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('open');
}

function toggleCartDrawer(open) {
  const drawer = document.getElementById('cart-drawer');
  if (open) {
    renderCartDrawer();
    drawer.classList.add('open');
  } else {
    drawer.classList.remove('open');
  }
}

// 5. Global Actions
function handleHeaderSearch(event) {
  if (event.key === 'Enter') {
    const val = event.target.value.trim();
    state.searchQuery = val;
    event.target.value = '';
    navigateTo('shop');
  }
}

function handleNewsletterSubscribe() {
  const emailInput = document.getElementById('newsletter-email');
  const email = emailInput.value.trim();
  
  if (!email || !email.includes('@')) {
    alert('Please enter a valid email address.');
    return;
  }
  
  if (state.newsletterSubscribers.includes(email)) {
    alert('You are already subscribed to our sweet news!');
    return;
  }
  
  state.newsletterSubscribers.push(email);
  saveSubscribersToStorage();
  emailInput.value = '';
  
  alert('Thank you! You have subscribed successfully and received 10% off coupon code: WELCOME10');
}

// 6. VIEW RENDERERS

// HOME VIEW RENDERER
function renderHome() {
  const main = document.getElementById('main-content');
  
  // Featured categories html
  let categoriesHtml = '';
  window.bakeryCategories.slice(1, 7).forEach(cat => {
    categoriesHtml += `
      <div class="category-circle-card" onclick="navigateTo('shop', { category: '${cat.id}' })">
        <i class="fa-solid ${cat.icon}"></i>
        <span>${cat.name}</span>
      </div>
    `;
  });

  // Featured products html (Take 3 best rated)
  let productsHtml = '';
  const sorted = [...state.products].sort((a,b) => b.rating - a.rating).slice(0, 3);
  sorted.forEach(prod => {
    productsHtml += renderProductCardHTML(prod);
  });

  // Testimonials slider html
  let testimonialsHtml = '';
  window.bakeryTestimonials.forEach((test, idx) => {
    testimonialsHtml += `
      <div class="testimonial-slide ${idx === 0 ? 'active' : ''}" id="testimonial-slide-${idx}" style="display: ${idx === 0 ? 'block' : 'none'};">
        <div style="font-size: 1.5rem; color: var(--highlight); margin-bottom: 20px;">
          ${'★'.repeat(test.rating)}${'☆'.repeat(5 - test.rating)}
        </div>
        <p style="font-style: italic; font-size: 1.2rem; color: var(--text-primary); margin-bottom: 30px; max-width: 800px; margin-left: auto; margin-right: auto;">
          "${test.content}"
        </p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 14px;">
          <img src="${test.avatar}" alt="${test.name}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
          <div style="text-align: left;">
            <h4 style="font-size: 1rem; margin-bottom: 2px;">${test.name}</h4>
            <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 500;">${test.role}</span>
          </div>
        </div>
      </div>
    `;
  });

  main.innerHTML = `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-glass-card">
          <span style="color: var(--primary); font-weight: 700; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 2px; display: block; margin-bottom: 12px;">Artisanal & Premium Bakery</span>
          <h1>Freshly Baked Happiness Every Day</h1>
          <p>Delicious handcrafted cakes, cupcakes, pastries, cookies, breads, and desserts made fresh with premium organic ingredients for every celebration.</p>
          <div class="hero-buttons">
            <button class="btn btn-primary" onclick="navigateTo('shop')">Order Now</button>
            <button class="btn btn-secondary" onclick="navigateTo('custom-cakes')"><i class="fa-solid fa-wand-magic-sparkles"></i> Custom Cakes</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="section-padding" style="background-color: #FFFFFF;">
      <div class="container">
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon-wrapper"><i class="fa-solid fa-cake"></i></div>
            <h3>Baked Fresh Daily</h3>
            <p>Our bakers start before dawn to ensure your treats are baked and delivered fresh every single day.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-wrapper"><i class="fa-solid fa-seedling"></i></div>
            <h3>Premium Ingredients</h3>
            <p>We source only high-quality, organic ingredients: real Madagascan vanilla, rich Belgian chocolates, and fresh fruits.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-wrapper"><i class="fa-solid fa-truck-fast"></i></div>
            <h3>Same Day Delivery</h3>
            <p>Craving sweets? Order before 2 PM and get secure doorstep delivery within hours in our temperature-controlled vans.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-wrapper"><i class="fa-solid fa-shield-halved"></i></div>
            <h3>100% Safe Payments</h3>
            <p>Your online transactions are secure with leading fully encrypted credit gateways, Apple Pay, and Google Pay.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Categories -->
    <section class="section-padding">
      <div class="container text-center">
        <h2 class="section-title">Explore Sweetness</h2>
        <p class="section-subtitle">Click a category to browse our delicious handcrafted menu items</p>
        <div class="categories-showcase">
          ${categoriesHtml}
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="section-padding" style="background-color: #FFFFFF; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
      <div class="container">
        <div class="text-center">
          <h2 class="section-title">Chef's Signature Selections</h2>
          <p class="section-subtitle">Customer favorites made with artisan passion and premium toppings</p>
        </div>
        <div class="products-grid">
          ${productsHtml}
        </div>
        <div style="text-align: center; margin-top: 50px;">
          <button class="btn btn-outline" onclick="navigateTo('shop')">Explore Whole Menu</button>
        </div>
      </div>
    </section>

    <!-- Statistics Counters -->
    <section class="section-padding" style="background: linear-gradient(rgba(210, 105, 30, 0.9), rgba(210, 105, 30, 0.9)), url('https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800') center/cover; color: #FFFFFF;">
      <div class="container">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; text-align: center;">
          <div>
            <h2 style="font-size: 3rem; color: #FFFFFF; margin-bottom: 10px;">10,000+</h2>
            <p style="font-weight: 500; font-size: 1rem; opacity: 0.9;">Happy Customers</p>
          </div>
          <div>
            <h2 style="font-size: 3rem; color: #FFFFFF; margin-bottom: 10px;">500+</h2>
            <p style="font-weight: 500; font-size: 1rem; opacity: 0.9;">Custom Cake Designs</p>
          </div>
          <div>
            <h2 style="font-size: 3rem; color: #FFFFFF; margin-bottom: 10px;">15+</h2>
            <p style="font-weight: 500; font-size: 1rem; opacity: 0.9;">Years Experience</p>
          </div>
          <div>
            <h2 style="font-size: 3rem; color: #FFFFFF; margin-bottom: 10px;">50,000+</h2>
            <p style="font-weight: 500; font-size: 1rem; opacity: 0.9;">Orders Delivered</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials slider -->
    <section class="section-padding" style="background-color: var(--card-bg);">
      <div class="container text-center">
        <h2 class="section-title">Crumb Stories</h2>
        <p class="section-subtitle">Read what our gourmet dessert lovers say about our bakeshop</p>
        
        <div style="position: relative; max-width: 900px; margin: 0 auto; padding: 0 40px;">
          ${testimonialsHtml}
          
          <button class="icon-btn" onclick="slideTestimonials(-1)" style="position: absolute; left: 0; top: 50%; transform: translateY(-50%); border: 1px solid var(--border-color);">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <button class="icon-btn" onclick="slideTestimonials(1)" style="position: absolute; right: 0; top: 50%; transform: translateY(-50%); border: 1px solid var(--border-color);">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <button class="btn btn-secondary" onclick="navigateTo('account', { tab: 'history' })">Write A Review</button>
        </div>
      </div>
    </section>
  `;
}

let activeTestimonialIndex = 0;
window.slideTestimonials = function(direction) {
  const slides = document.querySelectorAll('.testimonial-slide');
  if (slides.length === 0) return;
  
  slides[activeTestimonialIndex].style.display = 'none';
  
  activeTestimonialIndex += direction;
  if (activeTestimonialIndex >= slides.length) activeTestimonialIndex = 0;
  if (activeTestimonialIndex < 0) activeTestimonialIndex = slides.length - 1;
  
  slides[activeTestimonialIndex].style.display = 'block';
  slides[activeTestimonialIndex].classList.add('fade-in');
};

// SHOP VIEW RENDERER
function renderShop() {
  const main = document.getElementById('main-content');
  
  // Category side filter list
  let sidebarCategoriesHtml = '';
  window.bakeryCategories.forEach(cat => {
    const isActive = state.activeCategory === cat.id;
    sidebarCategoriesHtml += `
      <li class="filter-item ${isActive ? 'active' : ''}" onclick="filterShopCategory('${cat.id}')">
        <span>${cat.name}</span>
        <i class="fa-solid fa-chevron-right" style="font-size: 0.75rem;"></i>
      </li>
    `;
  });

  // Filter products by category, search, sorting
  let filteredProducts = state.products.filter(prod => {
    const matchCategory = state.activeCategory === 'all' || prod.category === state.activeCategory;
    const matchSearch = prod.name.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
                        prod.description.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (state.sortOption === 'price-low') {
    filteredProducts.sort((a,b) => a.price - b.price);
  } else if (state.sortOption === 'price-high') {
    filteredProducts.sort((a,b) => b.price - a.price);
  } else if (state.sortOption === 'rating') {
    filteredProducts.sort((a,b) => b.rating - a.rating);
  }

  let productsGridHtml = '';
  if (filteredProducts.length === 0) {
    productsGridHtml = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 0;">
        <i class="fa-solid fa-cookie-bite" style="font-size: 3rem; color: var(--border-color); margin-bottom: 20px;"></i>
        <h3>No Treats Found</h3>
        <p style="color: var(--text-secondary);">Try clearing your search query or filters.</p>
        <button class="btn btn-primary" style="margin-top: 20px;" onclick="clearShopFilters()">Reset Filters</button>
      </div>
    `;
  } else {
    filteredProducts.forEach(prod => {
      productsGridHtml += renderProductCardHTML(prod);
    });
  }

  main.innerHTML = `
    <div class="container section-padding">
      <div style="margin-bottom: 30px;">
        <h1 style="font-size: 2.2rem; margin-bottom: 8px;">Order Our Treats</h1>
        <p style="color: var(--text-secondary);">Explore freshly made confectionery catalog with quick customization</p>
      </div>
      
      <!-- Search & Filters Header -->
      <div style="display: flex; gap: 20px; justify-content: space-between; flex-wrap: wrap; background-color: var(--card-bg); padding: 16px 24px; border-radius: var(--radius); border: 1px solid var(--border-color); align-items: center; margin-bottom: 30px;">
        <div style="display: flex; gap: 12px; align-items: center; flex-grow: 1; max-width: 400px;">
          <i class="fa-solid fa-magnifying-glass" style="color: var(--text-secondary);"></i>
          <input type="text" id="shop-search-input" value="${state.searchQuery}" placeholder="Search products..." style="border: none; width: 100%; font-size: 0.95rem;" onkeyup="handleShopSearch(event)">
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-secondary);">Sort By:</span>
          <select id="shop-sort-select" onchange="handleShopSort(event)" style="border: 1px solid var(--border-color); padding: 8px 16px; border-radius: var(--radius-sm); font-size: 0.9rem; background-color: #FFFFFF;">
            <option value="default" ${state.sortOption === 'default' ? 'selected' : ''}>Featured</option>
            <option value="price-low" ${state.sortOption === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
            <option value="price-high" ${state.sortOption === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
            <option value="rating" ${state.sortOption === 'rating' ? 'selected' : ''}>Rating</option>
          </select>
        </div>
      </div>

      <div class="shop-layout">
        <!-- Sidebar Filters -->
        <aside class="filter-sidebar">
          <div class="filter-group">
            <h3>Categories</h3>
            <ul class="filter-list">
              ${sidebarCategoriesHtml}
            </ul>
          </div>
          <button class="btn btn-outline" style="width: 100%; padding: 10px;" onclick="clearShopFilters()">Clear Filters</button>
        </aside>

        <!-- Main Catalog -->
        <div>
          <div class="products-grid">
            ${productsGridHtml}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderProductCardHTML(prod) {
  const isWishlisted = state.wishlist.includes(prod.id);
  const tagHtml = prod.tags && prod.tags.length > 0 
    ? prod.tags.map(t => `<span class="badge" style="background-color: var(--primary); align-self: flex-start;">${t}</span>`).join('') 
    : '';

  return `
    <div class="product-card">
      <div class="product-badge-container">
        ${tagHtml}
        ${!prod.inStock ? '<span class="badge" style="background-color: var(--text-secondary);">Out of Stock</span>' : ''}
      </div>
      <div class="product-image-wrapper">
        <img src="${prod.image}" alt="${prod.name}">
        <div class="product-actions-overlay">
          <button class="action-btn" onclick="openQuickView(${prod.id})" title="Quick View"><i class="fa-solid fa-eye"></i></button>
          <button class="action-btn ${isWishlisted ? 'wishlisted' : ''}" onclick="toggleWishlist(${prod.id})" title="Wishlist"><i class="fa-solid fa-heart"></i></button>
        </div>
      </div>
      <div class="product-content">
        <div class="product-meta">
          <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary); font-weight: 600;">
            ${prod.category.replace('-', ' ')}
          </span>
          <div class="product-rating">
            <i class="fa-solid fa-star"></i>
            ${prod.rating} <span>(${prod.reviewsCount})</span>
          </div>
        </div>
        <h3 class="product-title">${prod.name}</h3>
        <p class="product-desc">${prod.description}</p>
        <div class="product-footer">
          <span class="product-price">$${prod.price.toFixed(2)}</span>
          <button class="btn btn-primary" onclick="addToCart(${prod.id})" style="padding: 8px 16px; font-size: 0.85rem; border-radius: var(--radius-sm);" ${!prod.inStock ? 'disabled' : ''}>
            <i class="fa-solid fa-cart-plus"></i> Add
          </button>
        </div>
      </div>
    </div>
  `;
}

window.filterShopCategory = function(catId) {
  state.activeCategory = catId;
  renderShop();
};

window.handleShopSearch = function(event) {
  state.searchQuery = event.target.value.trim();
  if (event.key === 'Enter') {
    renderShop();
  }
};

window.handleShopSort = function(event) {
  state.sortOption = event.target.value;
  renderShop();
};

window.clearShopFilters = function() {
  state.activeCategory = 'all';
  state.searchQuery = '';
  state.sortOption = 'default';
  const headerSearch = document.getElementById('header-search-input');
  if (headerSearch) headerSearch.value = '';
  renderShop();
};

// CATEGORIES VIEW RENDERER
function renderCategories() {
  const main = document.getElementById('main-content');
  
  let gridHtml = '';
  window.bakeryCategories.slice(1).forEach(cat => {
    gridHtml += `
      <div class="product-card" onclick="navigateTo('shop', { category: '${cat.id}' })" style="cursor: pointer;">
        <div class="product-image-wrapper" style="aspect-ratio: 1.5;">
          <img src="${cat.image}" alt="${cat.name}">
        </div>
        <div class="product-content" style="text-align: center; padding: 24px;">
          <i class="fa-solid ${cat.icon}" style="font-size: 2rem; color: var(--primary); margin-bottom: 12px;"></i>
          <h3>${cat.name}</h3>
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 8px;">Explore all signature bakes in this selection &rarr;</p>
        </div>
      </div>
    `;
  });

  main.innerHTML = `
    <div class="container section-padding">
      <div class="text-center">
        <h1 class="section-title">Baking Categories</h1>
        <p class="section-subtitle">Discover our delicious arrays of handcrafted cakes, sweets, pastries and organic breads</p>
      </div>
      <div class="products-grid">
        ${gridHtml}
      </div>
    </div>
  `;
}

// ABOUT VIEW RENDERER
function renderAbout() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="container section-padding">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; margin-bottom: 80px;">
        <div>
          <span style="color: var(--primary); font-weight: 700; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 2px;">Our Heritage</span>
          <h1 style="font-size: 2.5rem; margin: 12px 0 20px 0;">Sweet Crumbs Story</h1>
          <p style="color: var(--text-secondary); margin-bottom: 20px;">
            Sweet Crumbs Bakery creates handcrafted cakes and baked goods using premium ingredients. We specialize in birthday cakes, wedding cakes, cupcakes, pastries, cookies, brownies, breads, and custom desserts with exceptional quality and customer service.
          </p>
          <p style="color: var(--text-secondary);">
            Founded in 2011, we started as a small local kitchen. Today, our experienced master bakers continue to mix, decorate, and craft everything by hand in small batches, ensuring you receive the same warm, comforting homemade texture in every bite.
          </p>
        </div>
        <div style="position: relative;">
          <img src="https://images.unsplash.com/photo-1582231374119-8414523c9288?auto=format&fit=crop&q=80&w=600" alt="Bakery Prep" style="width: 100%; border-radius: var(--radius); box-shadow: var(--shadow-lg);">
          <div style="position: absolute; bottom: -20px; left: -20px; background-color: var(--secondary); border: 2px solid var(--primary); padding: 20px 30px; border-radius: var(--radius); box-shadow: var(--shadow-md);">
            <h3 style="color: var(--primary); font-size: 2.2rem; line-height: 1;">15</h3>
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">Years of Baking Love</span>
          </div>
        </div>
      </div>

      <div class="text-center" style="margin-bottom: 50px;">
        <h2 class="section-title">Why Choose Us</h2>
        <p class="section-subtitle">Dedicated to creating premium bakery memories with excellent craftsmanship</p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon-wrapper"><i class="fa-solid fa-cookie-bite"></i></div>
          <h3>Fresh Ingredients</h3>
          <p>We source fresh cream, local organic butter, real fruits, and imported premium cocoa chocolates.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon-wrapper"><i class="fa-solid fa-user-tie"></i></div>
          <h3>Experienced Bakers</h3>
          <p>Our pastry chefs bring years of fine culinary training, delivering stunning cake designs.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon-wrapper"><i class="fa-solid fa-tags"></i></div>
          <h3>Affordable Prices</h3>
          <p>Luxurious flavor doesn't have to break the bank. We offer premium values for all special days.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon-wrapper"><i class="fa-solid fa-truck-fast"></i></div>
          <h3>Fast Delivery</h3>
          <p>Specially packaged temperature-controlled transport vehicles to deliver fresh decorations to your events.</p>
        </div>
      </div>
    </div>
  `;
}

// GALLERY VIEW RENDERER
let activeGalleryFilter = 'all';
function renderGallery() {
  const main = document.getElementById('main-content');
  
  const filterCategories = [
    { id: 'all', name: 'All' },
    { id: 'birthday-cakes', name: 'Birthday Cakes' },
    { id: 'wedding-cakes', name: 'Wedding Cakes' },
    { id: 'cupcakes', name: 'Cupcakes' },
    { id: 'cookies', name: 'Cookies' },
    { id: 'pastries', name: 'Pastries' },
    { id: 'brownies', name: 'Brownies' },
    { id: 'behind-the-scenes', name: 'Behind the Scenes' }
  ];

  let filterButtonsHtml = '';
  filterCategories.forEach(cat => {
    const isActive = activeGalleryFilter === cat.id;
    filterButtonsHtml += `
      <button class="btn ${isActive ? 'btn-primary' : 'btn-secondary'}" onclick="filterGalleryItems('${cat.id}')" style="padding: 8px 18px; font-size: 0.85rem;">
        ${cat.name}
      </button>
    `;
  });

  const filteredItems = window.bakeryGalleryItems.filter(item => activeGalleryFilter === 'all' || item.category === activeGalleryFilter);

  let galleryGridHtml = '';
  filteredItems.forEach(item => {
    galleryGridHtml += `
      <div class="product-card" style="cursor: pointer; overflow: hidden;" onclick="openLightbox('${item.image}', '${item.title}')">
        <div class="product-image-wrapper" style="aspect-ratio: 1;">
          <img src="${item.image}" alt="${item.title}" style="transition: transform 0.6s ease;">
          <div class="product-actions-overlay" style="opacity: 0; background: rgba(0,0,0,0.5); justify-content: center; align-items: center;">
            <i class="fa-solid fa-magnifying-glass-plus" style="font-size: 2rem; color: #FFFFFF;"></i>
          </div>
        </div>
        <div style="padding: 14px 20px; background-color: #FFFFFF;">
          <h4 style="font-size: 0.95rem; font-weight: 600; text-align: center;">${item.title}</h4>
        </div>
      </div>
    `;
  });

  main.innerHTML = `
    <div class="container section-padding">
      <div class="text-center">
        <h1 class="section-title">Sweet Gallery</h1>
        <p class="section-subtitle">A visual celebration of our beautifully decorated custom cakes and master kitchen works</p>
      </div>

      <!-- Filter Buttons -->
      <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 40px;">
        ${filterButtonsHtml}
      </div>

      <div class="products-grid">
        ${galleryGridHtml}
      </div>
    </div>
  `;
}

window.filterGalleryItems = function(catId) {
  activeGalleryFilter = catId;
  renderGallery();
};

window.openLightbox = function(imageUrl, title) {
  const lightbox = document.getElementById('lightbox-overlay');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  
  img.src = imageUrl;
  caption.innerText = title;
  
  lightbox.classList.add('open');
};

window.closeLightbox = function() {
  document.getElementById('lightbox-overlay').classList.remove('open');
};

// FAQ VIEW RENDERER
function renderFAQ() {
  const main = document.getElementById('main-content');
  
  let faqListHtml = '';
  window.bakeryFaqs.forEach((faq, idx) => {
    faqListHtml += `
      <div style="margin-bottom: 16px; border: 1px solid var(--border-color); border-radius: var(--radius); background-color: #FFFFFF; overflow: hidden; box-shadow: var(--shadow-sm);">
        <div style="padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-weight: 600; user-select: none;" onclick="toggleFaqAccordion(${idx})">
          <span>${faq.question}</span>
          <i class="fa-solid fa-chevron-down" id="faq-chevron-${idx}" style="transition: var(--transition); color: var(--primary);"></i>
        </div>
        <div id="faq-answer-${idx}" style="max-height: 0; overflow: hidden; transition: max-height 0.3s cubic-bezier(0, 1, 0, 1); background-color: var(--bg-color);">
          <div style="padding: 20px 24px; color: var(--text-secondary); border-top: 1px solid var(--border-color); font-size: 0.95rem;">
            ${faq.answer}
          </div>
        </div>
      </div>
    `;
  });

  main.innerHTML = `
    <div class="container section-padding" style="max-width: 800px;">
      <div class="text-center">
        <h1 class="section-title">Common Questions</h1>
        <p class="section-subtitle">Find immediate answers regarding orders, custom design cakes, eggless options and shipping</p>
      </div>
      <div>
        ${faqListHtml}
      </div>
    </div>
  `;
}

window.toggleFaqAccordion = function(index) {
  const answer = document.getElementById(`faq-answer-${index}`);
  const chevron = document.getElementById(`faq-chevron-${index}`);
  
  const isOpen = answer.style.maxHeight !== '0px' && answer.style.maxHeight !== '';
  
  // Close all other accordions first
  const allAnswers = document.querySelectorAll('[id^="faq-answer-"]');
  const allChevrons = document.querySelectorAll('[id^="faq-chevron-"]');
  allAnswers.forEach(ans => ans.style.maxHeight = '0px');
  allChevrons.forEach(chev => chev.className = 'fa-solid fa-chevron-down');
  
  if (!isOpen) {
    answer.style.maxHeight = '500px'; // sufficiently large
    chevron.className = 'fa-solid fa-chevron-up';
  }
};

// BLOG VIEW RENDERER
function renderBlog(params = {}) {
  const main = document.getElementById('main-content');
  
  // If specific blog detail is requested
  if (params.id) {
    const article = window.bakeryBlogs.find(b => b.id === Number(params.id));
    if (article) {
      main.innerHTML = `
        <div class="container section-padding" style="max-width: 800px;">
          <button class="btn btn-secondary" onclick="navigateTo('blog')" style="padding: 8px 16px; margin-bottom: 30px;">
            <i class="fa-solid fa-arrow-left"></i> Back to Blog
          </button>
          
          <img src="${article.image}" alt="${article.title}" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: var(--radius); box-shadow: var(--shadow-md); margin-bottom: 30px;">
          
          <div style="display: flex; gap: 16px; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 20px; font-weight: 500;">
            <span><i class="fa-regular fa-user" style="color: var(--primary); margin-right: 4px;"></i> ${article.author}</span>
            <span><i class="fa-regular fa-calendar" style="color: var(--primary); margin-right: 4px;"></i> ${article.date}</span>
            <span><i class="fa-regular fa-clock" style="color: var(--primary); margin-right: 4px;"></i> ${article.readTime}</span>
          </div>
          
          <h1 style="font-size: 2.5rem; line-height: 1.2; margin-bottom: 24px;">${article.title}</h1>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin-bottom: 30px;">
          
          <article class="blog-rich-content" style="font-size: 1.05rem; line-height: 1.8; color: var(--text-primary);">
            ${article.content}
          </article>
        </div>
      `;
      return;
    }
  }

  // Otherwise render blog list
  let blogCardsHtml = '';
  window.bakeryBlogs.forEach(post => {
    blogCardsHtml += `
      <div class="product-card" onclick="navigateTo('blog', { id: ${post.id} })" style="cursor: pointer;">
        <div class="product-image-wrapper" style="aspect-ratio: 16/10;">
          <img src="${post.image}" alt="${post.title}">
        </div>
        <div class="product-content" style="padding: 24px;">
          <div style="display: flex; gap: 14px; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 10px; font-weight: 500;">
            <span><i class="fa-regular fa-calendar"></i> ${post.date}</span>
            <span><i class="fa-regular fa-clock"></i> ${post.readTime}</span>
          </div>
          <h3 style="font-size: 1.2rem; margin-bottom: 12px; line-height: 1.3;">${post.title}</h3>
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 16px;">${post.summary}</p>
          <span style="font-size: 0.9rem; font-weight: 600; color: var(--primary);">Read Full Article &rarr;</span>
        </div>
      </div>
    `;
  });

  main.innerHTML = `
    <div class="container section-padding">
      <div class="text-center">
        <h1 class="section-title">Crumb Secrets & Decorating</h1>
        <p class="section-subtitle">Tasty recipes, expert baking instructions, decoration ideas, and wedding cake trends</p>
      </div>
      <div class="products-grid" style="grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));">
        ${blogCardsHtml}
      </div>
    </div>
  `;
}

// CONTACT VIEW RENDERER
function renderContact() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="container section-padding">
      <div class="text-center">
        <h1 class="section-title">Visit Our Bakery</h1>
        <p class="section-subtitle">Have questions or want to plan custom cakes? Stop by or fill out our quick form</p>
      </div>

      <div class="cart-grid" style="grid-template-columns: 1.2fr 1fr;">
        <!-- Left: Form -->
        <div class="cart-items-container">
          <h3 style="margin-bottom: 24px;">Send Us A Message</h3>
          <form onsubmit="handleContactSubmit(event)">
            <div class="form-group-row">
              <div class="form-group">
                <label>Your Name *</label>
                <input type="text" id="contact-name" required placeholder="E.g. Jane Doe">
              </div>
              <div class="form-group">
                <label>Your Email *</label>
                <input type="email" id="contact-email" required placeholder="E.g. jane@gmail.com">
              </div>
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" id="contact-phone" placeholder="E.g. +1 (555) 012-3456">
            </div>
            <div class="form-group">
              <label>Event Type / Subject *</label>
              <select id="contact-subject" required>
                <option value="">Select event type...</option>
                <option value="birthday">Birthday Cake Inquiry</option>
                <option value="wedding">Wedding Cake Planning</option>
                <option value="catering">Corporate Dessert Catering</option>
                <option value="general">General Question</option>
              </select>
            </div>
            <div class="form-group">
              <label>Your Message *</label>
              <textarea id="contact-message" rows="5" required placeholder="Tell us details about your custom design, flavors, date, guest count..."></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Message</button>
          </form>
        </div>

        <!-- Right: Contacts info & map -->
        <div style="display: flex; flex-direction: column; gap: 30px;">
          <div class="cart-summary-card" style="width: 100%;">
            <h3 style="margin-bottom: 20px;">Contact Details</h3>
            <div style="display: flex; flex-direction: column; gap: 16px; font-size: 0.95rem;">
              <div style="display: flex; gap: 12px;">
                <i class="fa-solid fa-location-dot" style="color: var(--primary); font-size: 1.2rem; margin-top: 3px;"></i>
                <div>
                  <h4 style="margin-bottom: 4px;">Bakery Location</h4>
                  <p style="color: var(--text-secondary);">458 Baker Avenue, Sweet Sugar District, New York, NY 10001</p>
                </div>
              </div>
              
              <div style="display: flex; gap: 12px;">
                <i class="fa-solid fa-clock" style="color: var(--primary); font-size: 1.2rem; margin-top: 3px;"></i>
                <div>
                  <h4 style="margin-bottom: 4px;">Business Hours</h4>
                  <p style="color: var(--text-secondary);">Monday – Saturday: 7:00 AM – 8:00 PM<br>Sunday: 8:00 AM – 5:00 PM</p>
                </div>
              </div>
              
              <div style="display: flex; gap: 12px;">
                <i class="fa-solid fa-phone" style="color: var(--primary); font-size: 1.2rem; margin-top: 3px;"></i>
                <div>
                  <h4 style="margin-bottom: 4px;">Call Us Directly</h4>
                  <p style="color: var(--text-secondary);">+1 (555) 019-2834</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Mock Map -->
          <div class="cart-summary-card" style="width: 100%; overflow: hidden; padding: 0;">
            <div style="background-color: var(--secondary); height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border-radius: var(--radius); position: relative;">
              <i class="fa-solid fa-map-location-dot" style="font-size: 3rem; color: var(--primary); margin-bottom: 12px;"></i>
              <h4 style="color: var(--primary);">Interactive Google Map</h4>
              <p style="font-size: 0.8rem; color: var(--text-secondary); max-width: 250px; margin-top: 4px;">Double click to navigate directly to Baker Ave directions</p>
              
              <!-- styled map pin decorative layout -->
              <div style="position: absolute; width: 12px; height: 12px; background-color: var(--accent); border: 2px solid #FFF; border-radius: 50%; top: 40%; left: 55%; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.handleContactSubmit = function(event) {
  event.preventDefault();
  alert('Thank you! Your message has been received by our kitchen staff. We will reply to your email within 1-2 hours.');
  event.target.reset();
};

// QUICK VIEW MODAL
window.openQuickView = function(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  const modalHtml = `
    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 30px; align-items: start;">
      <div>
        <img src="${prod.image}" alt="${prod.name}" style="width: 100%; border-radius: var(--radius-sm); object-fit: cover;">
      </div>
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <span style="font-size: 0.8rem; text-transform: uppercase; font-weight: 600; color: var(--text-secondary);">
          ${prod.category.replace('-', ' ')}
        </span>
        <h2 style="font-size: 1.6rem; line-height: 1.2;">${prod.name}</h2>
        
        <div style="display: flex; align-items: center; gap: 8px; color: var(--highlight);">
          <i class="fa-solid fa-star"></i>
          <span style="font-weight: 600; color: var(--text-primary); font-size: 0.95rem;">${prod.rating}</span>
          <span style="color: var(--text-secondary); font-size: 0.85rem;">(${prod.reviewsCount} customer reviews)</span>
        </div>

        <span style="font-size: 1.8rem; font-weight: 700; color: var(--primary);">$${prod.price.toFixed(2)}</span>
        
        <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5;">${prod.description}</p>
        
        <!-- Quick Options -->
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 6px;">Eggless Variant Option:</label>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary active" id="quick-egg-no" onclick="toggleQuickEggless(false)" style="padding: 6px 14px; font-size: 0.8rem; border-color: var(--primary);">Standard (With Egg)</button>
            <button class="btn btn-secondary" id="quick-egg-yes" onclick="toggleQuickEggless(true)" style="padding: 6px 14px; font-size: 0.8rem;">Eggless (+$2.00)</button>
          </div>
        </div>

        <div style="display: flex; gap: 12px; margin-top: 10px;">
          <button class="btn btn-primary" onclick="addQuickProductToCart(${prod.id})" style="flex-grow: 1;">
            <i class="fa-solid fa-cart-plus"></i> Add To Cart
          </button>
          <button class="icon-btn" onclick="toggleWishlist(${prod.id})" style="border: 1px solid var(--border-color); width: 48px; height: 48px;">
            <i class="fa-solid fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  window.activeQuickViewCustomizations = {
    eggless: false
  };

  showModal('Quick Gourmet View', modalHtml);
};

window.toggleQuickEggless = function(eggless) {
  window.activeQuickViewCustomizations.eggless = eggless;
  
  const btnNo = document.getElementById('quick-egg-no');
  const btnYes = document.getElementById('quick-egg-yes');
  
  if (eggless) {
    btnYes.classList.add('active');
    btnYes.style.borderColor = 'var(--primary)';
    btnNo.classList.remove('active');
    btnNo.style.borderColor = 'var(--border-color)';
  } else {
    btnNo.classList.add('active');
    btnNo.style.borderColor = 'var(--primary)';
    btnYes.classList.remove('active');
    btnYes.style.borderColor = 'var(--border-color)';
  }
};

window.addQuickProductToCart = function(prodId) {
  addToCart(prodId, 1, window.activeQuickViewCustomizations.eggless);
  closeModal();
};


// 7. CART & WISHLIST OPERATIONS
window.addToCart = function(productId, quantity = 1, eggless = false) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  const basePrice = prod.price;
  const finalPrice = eggless ? basePrice + 2.00 : basePrice;
  const note = eggless ? 'Eggless option selected' : '';

  // Check if item already in cart with same configurations
  const existingIndex = state.cart.findIndex(item => item.id === productId && item.customNotes === note);
  
  if (existingIndex > -1) {
    state.cart[existingIndex].quantity += quantity;
  } else {
    state.cart.push({
      id: productId,
      name: prod.name,
      image: prod.image,
      price: finalPrice,
      quantity: quantity,
      customNotes: note
    });
  }

  saveCartToStorage();
  updateBadges();
  
  // Slide cart drawer open to show confirmation
  toggleCartDrawer(true);
};

window.toggleWishlist = function(productId) {
  const index = state.wishlist.indexOf(productId);
  if (index > -1) {
    state.wishlist.splice(index, 1);
  } else {
    state.wishlist.push(productId);
  }
  
  saveWishlistToStorage();
  updateBadges();
  
  // Refresh current view to show wishlist active state changes
  if (state.currentView === 'shop') renderShop();
  if (state.currentView === 'account') renderAccount();
};

// SLIDING CART DRAWER RENDERER
function renderCartDrawer() {
  const itemsContainer = document.getElementById('cart-drawer-items');
  const footerContainer = document.getElementById('cart-drawer-footer');
  
  if (state.cart.length === 0) {
    itemsContainer.innerHTML = `<p class="text-center" style="margin-top: 40px; color: var(--text-secondary);">Your cart is empty.</p>`;
    footerContainer.innerHTML = '';
    return;
  }

  let itemsHtml = '';
  state.cart.forEach((item, index) => {
    itemsHtml += `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          ${item.customNotes ? `<p class="cart-item-desc">${item.customNotes}</p>` : ''}
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
            <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            
            <div class="quantity-controls">
              <button class="qty-btn" onclick="updateCartItemQty(${index}, -1)">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn" onclick="updateCartItemQty(${index}, 1)">+</button>
            </div>
          </div>
        </div>
        <button class="icon-btn" onclick="removeCartItem(${index})" style="color: var(--accent);"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    `;
  });

  itemsContainer.innerHTML = itemsHtml;

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  footerContainer.innerHTML = `
    <div class="price-breakdown" style="border-top: none; padding-top: 0; margin-top: 0; margin-bottom: 20px;">
      <div class="price-row">
        <span>Subtotal</span>
        <span style="font-weight: 600; color: var(--text-primary);">$${subtotal.toFixed(2)}</span>
      </div>
      <p style="font-size: 0.75rem; color: var(--text-secondary); text-align: right; margin-top: 4px;">Taxes and shipping calculated at checkout</p>
    </div>
    <div style="display: flex; gap: 10px;">
      <button class="btn btn-secondary" onclick="toggleCartDrawer(false); navigateTo('cart');" style="flex-grow: 1; padding: 10px;">View Cart</button>
      <button class="btn btn-primary" onclick="toggleCartDrawer(false); navigateTo('checkout');" style="flex-grow: 1; padding: 10px;">Checkout</button>
    </div>
  `;
}

window.updateCartItemQty = function(index, delta) {
  state.cart[index].quantity += delta;
  
  if (state.cart[index].quantity <= 0) {
    state.cart.splice(index, 1);
  }
  
  saveCartToStorage();
  updateBadges();
  renderCartDrawer();
  if (state.currentView === 'cart') renderCart();
};

window.removeCartItem = function(index) {
  state.cart.splice(index, 1);
  saveCartToStorage();
  updateBadges();
  renderCartDrawer();
  if (state.currentView === 'cart') renderCart();
};

// FULL CART PAGE RENDERER
function renderCart() {
  const main = document.getElementById('main-content');
  
  if (state.cart.length === 0) {
    main.innerHTML = `
      <div class="container section-padding text-center">
        <i class="fa-solid fa-bag-shopping" style="font-size: 4rem; color: var(--border-color); margin-bottom: 20px;"></i>
        <h1>Your Cart is Empty</h1>
        <p style="color: var(--text-secondary); margin-bottom: 30px;">Add some sweet treats from our shop to satisfy your sugar cravings.</p>
        <button class="btn btn-primary" onclick="navigateTo('shop')">Explore Products</button>
      </div>
    `;
    return;
  }

  let itemsHtml = '';
  state.cart.forEach((item, index) => {
    itemsHtml += `
      <div class="cart-item" style="padding: 24px 0;">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px;">
        <div class="cart-item-info">
          <h3 style="font-size: 1.2rem; font-family: 'Poppins', sans-serif; font-weight: 600; margin-bottom: 6px;">${item.name}</h3>
          ${item.customNotes ? `<p class="cart-item-desc" style="font-size: 0.85rem; margin-bottom: 6px; font-style: italic; color: var(--text-secondary);"><i class="fa-solid fa-cake" style="color: var(--primary); margin-right: 4px;"></i>${item.customNotes}</p>` : ''}
          <span style="font-weight: 500; font-size: 0.9rem; color: var(--text-secondary);">$${item.price.toFixed(2)} each</span>
        </div>
        
        <div class="quantity-controls" style="margin: 0 30px;">
          <button class="qty-btn" onclick="updateCartItemQty(${index}, -1)">-</button>
          <span class="qty-val">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartItemQty(${index}, 1)">+</button>
        </div>
        
        <div style="text-align: right; min-width: 100px;">
          <span class="cart-item-price" style="font-size: 1.2rem;">$${(item.price * item.quantity).toFixed(2)}</span>
          <button class="icon-btn" onclick="removeCartItem(${index})" style="color: var(--accent); margin-left: auto; margin-top: 8px;"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </div>
    `;
  });

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const delivery = subtotal >= 50 ? 0.00 : 5.00;
  
  let discount = 0;
  if (state.appliedCoupon) {
    discount = subtotal * (state.appliedCoupon.discount / 100);
  }
  const netTotal = subtotal + tax + delivery - discount;

  main.innerHTML = `
    <div class="container section-padding">
      <div style="margin-bottom: 35px;">
        <h1 style="font-size: 2.2rem; margin-bottom: 8px;">Shopping Cart</h1>
        <p style="color: var(--text-secondary);">Manage items, apply coupon codes, and proceed to checkout.</p>
      </div>

      <div class="cart-grid">
        <!-- Cart Items List -->
        <div class="cart-items-container">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--border-color); padding-bottom: 12px; margin-bottom: 12px;">
            <span style="font-weight: 600; color: var(--text-secondary); font-size: 0.9rem;">Product Details</span>
            <span style="font-weight: 600; color: var(--text-secondary); font-size: 0.9rem; margin-right: 140px;">Quantity</span>
            <span style="font-weight: 600; color: var(--text-secondary); font-size: 0.9rem;">Total</span>
          </div>
          ${itemsHtml}
        </div>

        <!-- Summary & Coupon sidebar -->
        <div>
          <div class="cart-summary-card">
            <h3 style="margin-bottom: 20px; font-size: 1.25rem;">Order Summary</h3>
            
            <div class="coupon-section">
              <input type="text" id="cart-coupon-input" placeholder="Coupon Code" value="${state.appliedCoupon ? state.appliedCoupon.code : ''}" ${state.appliedCoupon ? 'disabled' : ''}>
              ${state.appliedCoupon 
                ? `<button class="btn btn-secondary" onclick="removeCoupon()" style="padding: 10px; font-size: 0.85rem;"><i class="fa-solid fa-xmark"></i></button>`
                : `<button class="btn btn-primary" onclick="applyCoupon()" style="padding: 10px 18px; font-size: 0.85rem;">Apply</button>`
              }
            </div>

            <div class="price-breakdown">
              <div class="price-row">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
              </div>
              <div class="price-row">
                <span>Sales Tax (8%)</span>
                <span>$${tax.toFixed(2)}</span>
              </div>
              <div class="price-row">
                <span>Home Delivery</span>
                <span>${delivery === 0 ? '<span style="color: var(--primary); font-weight: 600;">FREE</span>' : `$${delivery.toFixed(2)}`}</span>
              </div>
              ${state.appliedCoupon ? `
                <div class="price-row" style="color: var(--accent); font-weight: 600;">
                  <span>Discount (${state.appliedCoupon.code})</span>
                  <span>-$${discount.toFixed(2)}</span>
                </div>
              ` : ''}
              
              <div class="price-row total">
                <span>Total Amount</span>
                <span>$${netTotal.toFixed(2)}</span>
              </div>
            </div>

            <button class="btn btn-primary" onclick="navigateTo('checkout')" style="width: 100%; margin-top: 24px;">Proceed to Checkout</button>
            <button class="btn btn-secondary" onclick="navigateTo('shop')" style="width: 100%; margin-top: 10px;">Continue Shopping</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.applyCoupon = function() {
  const input = document.getElementById('cart-coupon-input');
  const code = input.value.trim().toUpperCase();
  
  if (!code) return;

  const validCoupon = state.coupons.find(c => c.code === code);
  
  if (!validCoupon) {
    alert('Invalid Coupon Code! Try CRUMBS20.');
    return;
  }

  state.appliedCoupon = validCoupon;
  renderCart();
};

window.removeCoupon = function() {
  state.appliedCoupon = null;
  renderCart();
};

// CHECKOUT VIEW RENDERER
function renderCheckout() {
  const main = document.getElementById('main-content');
  
  if (state.cart.length === 0) {
    navigateTo('cart');
    return;
  }

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const delivery = subtotal >= 50 ? 0.00 : 5.00;
  
  let discount = 0;
  if (state.appliedCoupon) {
    discount = subtotal * (state.appliedCoupon.discount / 100);
  }
  const netTotal = subtotal + tax + delivery - discount;

  let orderItemsSummaryHtml = '';
  state.cart.forEach(item => {
    orderItemsSummaryHtml += `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 0.9rem;">
        <span style="color: var(--text-secondary); font-weight: 500;">
          ${item.name} <strong style="color: var(--text-primary);">x ${item.quantity}</strong>
        </span>
        <span style="font-weight: 600; color: var(--text-primary);">$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `;
  });

  main.innerHTML = `
    <div class="container section-padding">
      <div style="margin-bottom: 35px;">
        <h1 style="font-size: 2.2rem; margin-bottom: 8px;">Order Checkout</h1>
        <p style="color: var(--text-secondary);">Fill in delivery information and complete secure mock payments.</p>
      </div>

      <div class="checkout-grid">
        <!-- Billing Details Form -->
        <div class="checkout-card">
          <h3 style="margin-bottom: 24px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">Delivery Address</h3>
          <form onsubmit="handlePlaceOrder(event)">
            <div class="form-group-row">
              <div class="form-group">
                <label>First Name *</label>
                <input type="text" required id="checkout-fname" placeholder="John">
              </div>
              <div class="form-group">
                <label>Last Name *</label>
                <input type="text" required id="checkout-lname" placeholder="Doe">
              </div>
            </div>
            
            <div class="form-group-row">
              <div class="form-group">
                <label>Email Address *</label>
                <input type="email" required id="checkout-email" placeholder="john@gmail.com">
              </div>
              <div class="form-group">
                <label>Phone Number *</label>
                <input type="tel" required id="checkout-phone" placeholder="+1 (555) 012-3456">
              </div>
            </div>

            <div class="form-group">
              <label>Street Address *</label>
              <input type="text" required id="checkout-address" placeholder="123 Baker St. Suite A">
            </div>

            <div class="form-group-row">
              <div class="form-group">
                <label>City *</label>
                <input type="text" required id="checkout-city" placeholder="New York">
              </div>
              <div class="form-group">
                <label>ZIP/Postal Code *</label>
                <input type="text" required id="checkout-zip" placeholder="10001">
              </div>
            </div>

            <div class="form-group">
              <label>Delivery Instructions / Notes</label>
              <textarea id="checkout-notes" rows="3" placeholder="Gated code, leave at door, knock loud..."></textarea>
            </div>

            <h3 style="margin: 35px 0 20px 0; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">Secure Payments</h3>
            <div class="payment-options">
              <div class="payment-box selected" id="pay-box-cod" onclick="selectPaymentOption('cod')">
                <input type="radio" name="payment-method" id="pay-radio-cod" checked style="accent-color: var(--primary);">
                <i class="fa-solid fa-hand-holding-dollar" style="font-size: 1.3rem; color: var(--primary);"></i>
                <div>
                  <h4 style="font-size: 0.95rem; margin-bottom: 2px;">Cash on Delivery</h4>
                  <p style="font-size: 0.75rem; color: var(--text-secondary);">Pay in cash or credit card card reader when package arrives</p>
                </div>
              </div>
              
              <div class="payment-box" id="pay-box-card" onclick="selectPaymentOption('card')">
                <input type="radio" name="payment-method" id="pay-radio-card" style="accent-color: var(--primary);">
                <i class="fa-solid fa-credit-card" style="font-size: 1.3rem; color: var(--primary);"></i>
                <div>
                  <h4 style="font-size: 0.95rem; margin-bottom: 2px;">Credit / Debit Card</h4>
                  <p style="font-size: 0.75rem; color: var(--text-secondary);">Secure encrypted credit check (Visa, Mastercard, Amex)</p>
                </div>
              </div>
            </div>

            <!-- Card Inputs Area (Toggled) -->
            <div id="card-fields-container" style="display: none; animation: fadeIn 0.4s ease; margin-bottom: 20px; border: 1px solid var(--border-color); padding: 20px; border-radius: var(--radius-sm); background-color: var(--bg-color);">
              <div class="form-group">
                <label>Cardholder Name</label>
                <input type="text" id="card-name" placeholder="John Doe">
              </div>
              <div class="form-group">
                <label>Card Number</label>
                <input type="text" id="card-num" placeholder="1234 5678 9101 1121" maxlength="19">
              </div>
              <div class="form-group-row">
                <div class="form-group">
                  <label>Expiry Date</label>
                  <input type="text" id="card-exp" placeholder="MM/YY" maxlength="5">
                </div>
                <div class="form-group">
                  <label>CVV Code</label>
                  <input type="password" id="card-cvv" placeholder="123" maxlength="3">
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 20px; font-size: 1.1rem; padding: 16px;">
              <i class="fa-solid fa-bag-shopping"></i> Confirm Order & Pay $${netTotal.toFixed(2)}
            </button>
          </form>
        </div>

        <!-- Right Side: Order list and price details -->
        <div>
          <div class="cart-summary-card">
            <h3 style="margin-bottom: 20px; font-size: 1.25rem;">Items Checklist</h3>
            
            <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 16px;">
              ${orderItemsSummaryHtml}
            </div>

            <div class="price-breakdown" style="border-top: none; padding-top: 0; margin-top: 0;">
              <div class="price-row">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
              </div>
              <div class="price-row">
                <span>Sales Tax (8%)</span>
                <span>$${tax.toFixed(2)}</span>
              </div>
              <div class="price-row">
                <span>Home Delivery</span>
                <span>${delivery === 0 ? 'FREE' : `$${delivery.toFixed(2)}`}</span>
              </div>
              ${state.appliedCoupon ? `
                <div class="price-row" style="color: var(--accent); font-weight: 600;">
                  <span>Discount (${state.appliedCoupon.code})</span>
                  <span>-$${discount.toFixed(2)}</span>
                </div>
              ` : ''}
              
              <div class="price-row total">
                <span>Total Amount</span>
                <span>$${netTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

let selectedPaymentOption = 'cod';
window.selectPaymentOption = function(method) {
  selectedPaymentOption = method;
  const payCod = document.getElementById('pay-box-cod');
  const payCard = document.getElementById('pay-box-card');
  const radCod = document.getElementById('pay-radio-cod');
  const radCard = document.getElementById('pay-radio-card');
  const cardFields = document.getElementById('card-fields-container');

  if (method === 'cod') {
    payCod.classList.add('selected');
    payCard.classList.remove('selected');
    radCod.checked = true;
    radCard.checked = false;
    cardFields.style.display = 'none';
  } else {
    payCard.classList.add('selected');
    payCod.classList.remove('selected');
    radCard.checked = true;
    radCod.checked = false;
    cardFields.style.display = 'block';
  }
};

window.handlePlaceOrder = function(event) {
  event.preventDefault();
  
  if (selectedPaymentOption === 'card') {
    const cardName = document.getElementById('card-name').value.trim();
    const cardNum = document.getElementById('card-num').value.trim();
    const cardExp = document.getElementById('card-exp').value.trim();
    const cardCvv = document.getElementById('card-cvv').value.trim();
    
    if (!cardName || cardNum.length < 15 || !cardExp.includes('/') || cardCvv.length < 3) {
      alert('Please fill out all Credit Card details correctly.');
      return;
    }
  }

  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  const fname = document.getElementById('checkout-fname').value.trim();
  const lname = document.getElementById('checkout-lname').value.trim();
  const email = document.getElementById('checkout-email').value.trim();
  const phone = document.getElementById('checkout-phone').value.trim();
  const address = document.getElementById('checkout-address').value.trim();
  const city = document.getElementById('checkout-city').value.trim();
  const zip = document.getElementById('checkout-zip').value.trim();
  const notes = document.getElementById('checkout-notes').value.trim();

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const delivery = subtotal >= 50 ? 0.00 : 5.00;
  
  let discount = 0;
  if (state.appliedCoupon) {
    discount = subtotal * (state.appliedCoupon.discount / 100);
  }
  const netTotal = subtotal + tax + delivery - discount;

  const newOrder = {
    id: orderId,
    customer: {
      name: `${fname} ${lname}`,
      email,
      phone,
      address: `${address}, ${city}, ZIP ${zip}`
    },
    items: [...state.cart],
    subtotal,
    tax,
    delivery,
    discount,
    total: netTotal,
    paymentMethod: selectedPaymentOption === 'cod' ? 'Cash on Delivery' : 'Credit Card',
    status: 'Pending', // Pending, Baking, Out for Delivery, Delivered
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    deliveryInstructions: notes
  };

  state.orders.unshift(newOrder); // Add to beginning of array
  saveOrdersToStorage();
  
  // Clear cart and applied coupon
  state.cart = [];
  state.appliedCoupon = null;
  saveCartToStorage();
  updateBadges();

  // Show Success View in main content
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="container section-padding text-center" style="max-width: 600px;">
      <i class="fa-solid fa-circle-check" style="font-size: 5rem; color: var(--primary); margin-bottom: 24px;"></i>
      <h1 style="font-size: 2.2rem; margin-bottom: 12px;">Order Placed!</h1>
      <p style="color: var(--text-secondary); margin-bottom: 30px;">Thank you for your order! We have sent a confirmation email receipt to <strong>${email}</strong>. Our professional bakers are preparing your treats.</p>
      
      <div class="cart-summary-card" style="text-align: left; margin-bottom: 30px; padding: 24px;">
        <h4 style="border-bottom: 1px solid var(--border-color); padding-bottom: 8px; margin-bottom: 12px;">Order ID: ${orderId}</h4>
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 8px; color: var(--text-secondary);">
          <span>Delivery to:</span>
          <span style="color: var(--text-primary); font-weight: 500;">${fname} ${lname}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 8px; color: var(--text-secondary);">
          <span>Method:</span>
          <span style="color: var(--text-primary); font-weight: 500;">${newOrder.paymentMethod}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.95rem; font-weight: 600; border-top: 1px dashed var(--border-color); padding-top: 8px; margin-top: 8px;">
          <span>Total Charged:</span>
          <span style="color: var(--primary); font-weight: 700;">$${netTotal.toFixed(2)}</span>
        </div>
      </div>
      
      <div style="display: flex; gap: 14px; justify-content: center;">
        <button class="btn btn-primary" onclick="navigateTo('account', { orderId: '${orderId}', tab: 'tracking' })">Track My Order</button>
        <button class="btn btn-secondary" onclick="navigateTo('shop')">Keep Shopping</button>
      </div>
    </div>
  `;
};


// CUSTOM CAKE BUILDER VIEW RENDERER
let activeBuilderStep = 1;
function renderCustomCakes() {
  const main = document.getElementById('main-content');
  activeBuilderStep = 1;

  main.innerHTML =
    updateCakeVisualizer();`
    <div class="container section-padding">
      <div class="text-center">
        <h1 class="section-title">Design Your Custom Cake</h1>
        <p class="section-subtitle">Choose your base, dimensions, frostings, toppings and write a custom message in real-time</p>
      </div>

      <div class="cake-builder-grid">
        <!-- Visual Preview column (Left) -->
        <div class="cake-preview-sticky">
          <h3>Your Design Preview</h3>
          
          <div class="cake-visualizer" style="margin-top: 24px;">
            <!-- Floating Toppings -->
            <div class="cake-topping-visuals" id="preview-toppings"></div>
            <!-- Top tier -->
            <div class="cake-tier cake-tier-top" id="preview-tier-top" style="display: none;"></div>
            <!-- Bottom / Base tier -->
            <div class="cake-tier cake-tier-base" id="preview-tier-base"></div>
          </div>

          <div class="price-breakdown">
            <div class="price-row">
              <span>Sponge Base (<span id="preview-txt-flavor">Chocolate</span>)</span>
              <span id="price-txt-flavor">$28.00</span>
            </div>
            <div class="price-row">
              <span>Size & Tiers (<span id="preview-txt-size">1 Tier - 1kg</span>)</span>
              <span id="price-txt-size">+$0.00</span>
            </div>
            <div class="price-row">
              <span>Frosting Styling (<span id="preview-txt-frosting">Buttercream</span>)</span>
              <span>+$0.00</span>
            </div>
            <div class="price-row">
              <span>Toppings Added</span>
              <span id="price-txt-toppings">+$0.00</span>
            </div>
            <div class="price-row">
              <span>Eggless Formulation Option</span>
              <span id="price-txt-eggless">+$0.00</span>
            </div>
            <div class="price-row total">
              <span>Estimated Cost</span>
              <span id="price-txt-total">$28.00</span>
            </div>
          </div>
        </div>

        <!-- Customizer wizard steps (Right) -->
        <div class="cake-builder-steps">
          <!-- Step node progress bar -->
          <div class="step-indicator">
            <div class="step-node active" id="node-step-1">1</div>
            <div class="step-node" id="node-step-2">2</div>
            <div class="step-node" id="node-step-3">3</div>
            <div class="step-node" id="node-step-4">4</div>
            <div class="step-node" id="node-step-5">5</div>
          </div>

          <!-- Step 1: Base Flavors -->
          <div class="builder-step-pane active" id="pane-step-1">
            <h3 style="margin-bottom: 10px;">Step 1: Choose Sponge Base</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">Select the delicious base recipe for your special custom cake.</p>
            <div class="options-grid">
              <div class="option-box" onclick="selectCakeOption('flavor', 'vanilla', 25.00, 'Vanilla Bean')">
<div class="option-box selected" onclick="selectCakeOption('flavor', 'chocolate', 28.00, 'Chocolate Fudge')">
                <span>Vanilla Sponge ($25)</span>
              </div>
              <div class="option-box" onclick="selectCakeOption('flavor', 'chocolate', 28.00, 'Chocolate Fudge')">
                <i class="fa-solid fa-cake" style="color: #6d4c41;"></i>
                <span>Chocolate Fudge ($28)</span>
              </div>
              <div class="option-box" onclick="selectCakeOption('flavor', 'red-velvet', 30.00, 'Red Velvet')">
                <i class="fa-solid fa-cake" style="color: var(--accent);"></i>
                <span>Red Velvet ($30)</span>
              </div>
              <div class="option-box" onclick="selectCakeOption('flavor', 'pineapple', 26.00, 'Pineapple Paradise')">
                <i class="fa-solid fa-cake" style="color: var(--highlight);"></i>
                <span>Pineapple sponge ($26)</span>
              </div>
              <div class="option-box" onclick="selectCakeOption('flavor', 'black-forest', 29.00, 'Black Forest')">
                <i class="fa-solid fa-cake" style="color: #3e2723;"></i>
                <span>Black Forest ($29)</span>
              </div>
            </div>
          </div>

          <!-- Step 2: Size and Tiers -->
          <div class="builder-step-pane" id="pane-step-2">
            <h3 style="margin-bottom: 10px;">Step 2: Dimensions & Tiers</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">Configure cake levels and weight depending on your guest count.</p>
            <div class="options-grid">
              <div class="option-box selected" onclick="selectCakeSize('1', '1kg', 0.00, 'Single Tier - 1kg')">
                <i class="fa-solid fa-circle" style="font-size: 1rem;"></i>
                <span>1 Tier (1kg) (+$0)</span>
              </div>
              <div class="option-box" onclick="selectCakeSize('1', '2kg', 15.00, 'Single Tier - 2kg')">
                <i class="fa-solid fa-circle" style="font-size: 1.4rem;"></i>
                <span>1 Tier (2kg) (+$15)</span>
              </div>
              <div class="option-box" onclick="selectCakeSize('2', '3kg', 35.00, 'Double Tier - 3kg')">
                <i class="fa-solid fa-layer-group"></i>
                <span>2 Tiers (3kg) (+$35)</span>
              </div>
              <div class="option-box" onclick="selectCakeSize('2', '5kg', 65.00, 'Double Tier - 5kg')">
                <i class="fa-solid fa-layer-group" style="font-size: 1.8rem;"></i>
                <span>2 Tiers (5kg) (+$65)</span>
              </div>
            </div>
          </div>

          <!-- Step 3: Frosting Type -->
          <div class="builder-step-pane" id="pane-step-3">
            <h3 style="margin-bottom: 10px;">Step 3: Frosting Styling</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">Choose the icing finish type for the outer texture of your cake.</p>
            <div class="options-grid">
              <div class="option-box selected" onclick="selectCakeOption('frosting', 'buttercream', 0.00, 'Buttercream Sweet')">
                <i class="fa-solid fa-brush"></i>
                <span>Cream Buttercream</span>
              </div>
              <div class="option-box" onclick="selectCakeOption('frosting', 'fondant', 5.00, 'Fondant Art')">
                <i class="fa-solid fa-palette"></i>
                <span>Smooth Fondant (+$5)</span>
              </div>
              <div class="option-box" onclick="selectCakeOption('frosting', 'whipped-cream', 0.00, 'Whipped Frosting')">
                <i class="fa-solid fa-cloud"></i>
                <span>Whipped Cream</span>
              </div>
            </div>
          </div>

          <!-- Step 4: Toppings Selection -->
          <div class="builder-step-pane" id="pane-step-4">
            <h3 style="margin-bottom: 10px;">Step 4: Select Gourmet Toppings</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">Select multiple toppings. They will be artistically arranged by our bakers.</p>
            <div class="options-grid">
              <div class="option-box" id="toppingbox-berries" onclick="toggleCakeTopping('berries', 5.00)">
                <i class="fa-solid fa-seedling" style="color: var(--accent);"></i>
                <span>Fresh Berries (+$5)</span>
              </div>
              <div class="option-box" id="toppingbox-sprinkles" onclick="toggleCakeTopping('sprinkles', 2.00)">
                <i class="fa-solid fa-ellipsis" style="color: var(--highlight);"></i>
                <span>Rainbow Sprinkles (+$2)</span>
              </div>
              <div class="option-box" id="toppingbox-shavings" onclick="toggleCakeTopping('shavings', 3.00)">
                <i class="fa-solid fa-cookie-bite"></i>
                <span>Chocolate Shavings (+$3)</span>
              </div>
              <div class="option-box" id="toppingbox-macarons" onclick="toggleCakeTopping('macarons', 8.00)">
                <i class="fa-solid fa-cheese"></i>
                <span>Parisian Macarons (+$8)</span>
              </div>
            </div>
          </div>

          <!-- Step 5: Message & Schedule Delivery -->
          <div class="builder-step-pane" id="pane-step-5">
            <h3 style="margin-bottom: 10px;">Step 5: Written message & Schedule</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 20px;">Provide custom text writing on cake base and schedule delivery.</p>
            
            <div class="form-group" style="display: flex; gap: 10px; align-items: center; border: 1px solid var(--border-color); padding: 12px 16px; border-radius: var(--radius-sm); margin-bottom: 20px;">
              <input type="checkbox" id="cake-eggless-toggle" onchange="toggleCakeEggless(this)" style="width: 20px; height: 20px; accent-color: var(--primary);">
              <div>
                <label for="cake-eggless-toggle" style="font-weight: 600; cursor: pointer; display: block; margin: 0;">100% Eggless Sponge Option (+$3.00)</label>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">Baked without eggs in dedicated allergen-free oven</span>
              </div>
            </div>

            <div class="form-group">
              <label>Written Message on Cake (Max 30 chars)</label>
              <input type="text" id="cake-writing-msg" placeholder="E.g. Happy 10th Birthday Liam!" onkeyup="handleCakeMessageChange(this)">
            </div>
            
            <div class="form-group-row">
              <div class="form-group">
                <label>Preferred Delivery Date *</label>
                <input type="date" id="cake-date-val" required>
              </div>
              <div class="form-group">
                <label>Special Instructions</label>
                <input type="text" id="cake-notes-val" placeholder="Color theme, box wrapping, card...">
              </div>
            </div>
          </div>

          <!-- Wizard control buttons -->
          <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-color); padding-top: 20px; margin-top: 30px;">
            <button class="btn btn-secondary" id="btn-builder-prev" onclick="moveBuilderStep(-1)" style="visibility: hidden;">Back</button>
            <button class="btn btn-primary" id="btn-builder-next" onclick="moveBuilderStep(1)">Next Step</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Set default values in builder state
  state.cakeCustomizer = {
    flavor: 'chocolate',
    flavorPrice: 28.00,
    flavorText: 'Chocolate Fudge',
    size: '1kg',
    tiers: '1',
    sizePrice: 0.00,
    sizeText: 'Single Tier - 1kg',
    frosting: 'buttercream',
    frostingPrice: 0.00,
    frostingText: 'Buttercream Sweet',
    toppings: [],
    eggless: false,
    message: '',
    deliveryDate: '',
    notes: ''
  };

  updateCakeVisualizer();
}

window.moveBuilderStep = function(delta) {
  const nextStep = activeBuilderStep + delta;
  if (nextStep < 1 || nextStep > 5) return;
  
  // If moving past step 5 (place in cart)
  if (activeBuilderStep === 5 && delta === 1) {
    addCustomCakeToCart();
    return;
  }

  // Update panel display
  document.getElementById(`pane-step-${activeBuilderStep}`).classList.remove('active');
  document.getElementById(`pane-step-${nextStep}`).classList.add('active');
  
  // Update node progress indicators
  const currNode = document.getElementById(`node-step-${activeBuilderStep}`);
  const nextNode = document.getElementById(`node-step-${nextStep}`);
  
  if (delta > 0) {
    currNode.classList.remove('active');
    currNode.classList.add('completed');
  } else {
    nextNode.classList.remove('completed');
  }
  nextNode.classList.add('active');
  
  activeBuilderStep = nextStep;

  // Configure visibility of prev/next buttons
  document.getElementById('btn-builder-prev').style.visibility = activeBuilderStep === 1 ? 'hidden' : 'visible';
  document.getElementById('btn-builder-next').innerHTML = activeBuilderStep === 5 ? '<i class="fa-solid fa-cart-plus"></i> Add To Bag' : 'Next Step';
};

window.selectCakeOption = function(optionType, value, price, text) {
  state.cakeCustomizer[optionType] = value;
  state.cakeCustomizer[optionType + 'Price'] = price;
  state.cakeCustomizer[optionType + 'Text'] = text;

  // Manage selection styling in active options grid
  const pane = document.getElementById(`pane-step-${activeBuilderStep}`);
  const boxes = pane.querySelectorAll('.option-box');
  boxes.forEach(box => box.classList.remove('selected'));
  
  event.currentTarget.classList.add('selected');

  updateCakeVisualizer();
};

window.selectCakeSize = function(tiers, size, price, text) {
  state.cakeCustomizer.tiers = tiers;
  state.cakeCustomizer.size = size;
  state.cakeCustomizer.sizePrice = price;
  state.cakeCustomizer.sizeText = text;

  const pane = document.getElementById(`pane-step-2`);
  const boxes = pane.querySelectorAll('.option-box');
  boxes.forEach(box => box.classList.remove('selected'));
  event.currentTarget.classList.add('selected');

  updateCakeVisualizer();
};

window.toggleCakeTopping = function(topping, price) {
  const box = document.getElementById(`toppingbox-${topping}`);
  const index = state.cakeCustomizer.toppings.findIndex(t => t.name === topping);
  
  if (index > -1) {
    state.cakeCustomizer.toppings.splice(index, 1);
    box.classList.remove('selected');
  } else {
    state.cakeCustomizer.toppings.push({ name: topping, price });
    box.classList.add('selected');
  }

  updateCakeVisualizer();
};

window.toggleCakeEggless = function(checkbox) {
  state.cakeCustomizer.eggless = checkbox.checked;
  updateCakeVisualizer();
};

window.handleCakeMessageChange = function(input) {
  state.cakeCustomizer.message = input.value.trim().substring(0, 30);
  updateCakeVisualizer();
};

function updateCakeVisualizer() {
  // Update Visual Tiers colors
  const baseTier = document.getElementById('preview-tier-base');
  const topTier = document.getElementById('preview-tier-top');
  
  const flavorColors = {
    vanilla: { bg: '#FFF8E7', border: '#D2691E' },
    chocolate: { bg: '#5D4037', border: '#3E2723' },
    'red-velvet': { bg: '#C62828', border: '#8E0000' },
    pineapple: { bg: '#FFF59D', border: '#FBC02D' },
    'black-forest': { bg: '#4E342E', border: '#270F0A' }
  };
  
  const currentColors = flavorColors[state.cakeCustomizer.flavor] || flavorColors.chocolate;
  
  baseTier.style.backgroundColor = currentColors.bg;
  baseTier.style.borderColor = currentColors.border;
  topTier.style.backgroundColor = currentColors.bg;
  topTier.style.borderColor = currentColors.border;

  // Manage Tiers displaying
  if (state.cakeCustomizer.tiers === '2') {
    topTier.style.display = 'block';
  } else {
    topTier.style.display = 'none';
  }

  // Manage Toppings preview
  const toppingsContainer = document.getElementById('preview-toppings');
  let toppingsHtml = '';
  state.cakeCustomizer.toppings.forEach(top => {
    if (top.name === 'berries') {
      toppingsHtml += `<div class="topping-cherry" style="background-color: var(--accent);"></div><div class="topping-cherry" style="background-color: #880E4F;"></div>`;
    } else if (top.name === 'sprinkles') {
      toppingsHtml += `<div style="width: 6px; height: 6px; background-color: var(--highlight); border-radius: 50%;"></div><div style="width: 6px; height: 6px; background-color: cyan; border-radius: 50%;"></div><div style="width: 6px; height: 6px; background-color: magenta; border-radius: 50%;"></div>`;
    } else if (top.name === 'shavings') {
      toppingsHtml += `<i class="fa-solid fa-cookie" style="font-size: 0.8rem; color: #3e2723;"></i>`;
    } else if (top.name === 'macarons') {
      toppingsHtml += `<i class="fa-solid fa-cheese" style="font-size: 0.9rem; color: var(--secondary);"></i>`;
    }
  });
  toppingsContainer.innerHTML = toppingsHtml;

  // Update text values in summary columns
  document.getElementById('preview-txt-flavor').innerText = state.cakeCustomizer.flavorText;
  document.getElementById('price-txt-flavor').innerText = `$${state.cakeCustomizer.flavorPrice.toFixed(2)}`;
  
  document.getElementById('preview-txt-size').innerText = state.cakeCustomizer.sizeText;
  document.getElementById('price-txt-size').innerText = `+$${state.cakeCustomizer.sizePrice.toFixed(2)}`;
  
  document.getElementById('preview-txt-frosting').innerText = state.cakeCustomizer.frostingText;
  
  const toppingsCost = state.cakeCustomizer.toppings.reduce((sum, t) => sum + t.price, 0);
  document.getElementById('price-txt-toppings').innerText = `+$${toppingsCost.toFixed(2)}`;
  
  const egglessCost = state.cakeCustomizer.eggless ? 3.00 : 0.00;
  document.getElementById('price-txt-eggless').innerText = `+$${egglessCost.toFixed(2)}`;

  // Calculate grand total cost
  const frostingCost = state.cakeCustomizer.frostingPrice || 0;
  const total = state.cakeCustomizer.flavorPrice + state.cakeCustomizer.sizePrice + frostingCost + toppingsCost + egglessCost;
  document.getElementById('price-txt-total').innerText = `$${total.toFixed(2)}`;
  state.cakeCustomizer.totalCost = total;
}

window.addCustomCakeToCart = function() {
  const dateInput = document.getElementById('cake-date-val');
  if (!dateInput || !dateInput.value) {
    alert('Please choose a preferred delivery date for your custom cake.');
    return;
  }
  
  state.cakeCustomizer.deliveryDate = dateInput.value;
  state.cakeCustomizer.notes = document.getElementById('cake-notes-val').value.trim();

  const customCakeItem = {
    id: 'CUST-' + Math.floor(1000 + Math.random() * 9000),
    name: `Custom ${state.cakeCustomizer.flavorText} Cake`,
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=400',
    price: state.cakeCustomizer.totalCost,
    quantity: 1,
    customNotes: `Tiers: ${state.cakeCustomizer.tiers} (${state.cakeCustomizer.size}), Frosting: ${state.cakeCustomizer.frostingText}, Toppings: ${state.cakeCustomizer.toppings.map(t => t.name).join(', ') || 'None'}, Written text: "${state.cakeCustomizer.message || 'None'}", Date: ${state.cakeCustomizer.deliveryDate}`
  };

  state.cart.push(customCakeItem);
  saveCartToStorage();
  updateBadges();

  alert('Success! Your custom cake has been added to your shopping bag.');
  toggleCartDrawer(true);
  navigateTo('cart');
};


// MY ACCOUNT VIEW RENDERER
function renderAccount() {
  const main = document.getElementById('main-content');

  // Generate wishlist item list
  let wishlistHtml = '';
  if (state.wishlist.length === 0) {
    wishlistHtml = '<p style="color: var(--text-secondary); text-align: center; padding: 30px 0;">No wishlisted bakes found.</p>';
  } else {
    wishlistHtml = '<div class="products-grid">';
    state.wishlist.forEach(id => {
      const prod = state.products.find(p => p.id === id);
      if (prod) wishlistHtml += renderProductCardHTML(prod);
    });
    wishlistHtml += '</div>';
  }

  // Generate order history html
  let orderHistoryHtml = '';
  if (state.orders.length === 0) {
    orderHistoryHtml = '<p style="color: var(--text-secondary); text-align: center; padding: 30px 0;">You have not placed any orders yet.</p>';
  } else {
    state.orders.forEach(ord => {
      orderHistoryHtml += `
        <div class="order-card">
          <div class="order-header">
            <div>
              <strong>Order ID:</strong> ${ord.id}<br>
              <span style="color: var(--text-secondary); font-size: 0.8rem;">Placed on ${ord.date}</span>
            </div>
            <div style="text-align: right;">
              <span class="status-pill status-${ord.status.toLowerCase()}">${ord.status}</span><br>
              <strong style="color: var(--primary); font-size: 1.15rem; display: block; margin-top: 4px;">$${ord.total.toFixed(2)}</strong>
            </div>
          </div>
          <div>
            ${ord.items.map(item => `
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; margin-bottom: 6px;">
                <span>${item.name} <strong>x ${item.quantity}</strong></span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          <div style="text-align: right; border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 12px;">
            <button class="btn btn-secondary" onclick="navigateTo('account', { tab: 'tracking', orderId: '${ord.id}' })" style="padding: 6px 12px; font-size: 0.8rem;">
              <i class="fa-solid fa-location-arrow"></i> Live Track
            </button>
          </div>
        </div>
      `;
    });
  }

  // Generate tracking section html
  let trackingHtml = '';
  const activeTrackOrder = state.selectedOrderTrackId 
    ? state.orders.find(o => o.id === state.selectedOrderTrackId)
    : state.orders[0];

  if (!activeTrackOrder) {
    trackingHtml = `
      <div style="text-align: center; padding: 40px 0;">
        <i class="fa-solid fa-location-dot" style="font-size: 3rem; color: var(--border-color); margin-bottom: 16px;"></i>
        <h3>No Active Tracked Orders</h3>
        <p style="color: var(--text-secondary); margin-top: 6px;">Check order history to view past receipts or track orders.</p>
      </div>
    `;
  } else {
    const statusIdxs = { Pending: 0, Baking: 1, 'Out for Delivery': 2, Delivered: 3 };
    const currIdx = statusIdxs[activeTrackOrder.status] || 0;
    const progressWidth = (currIdx / 3) * 100;

    trackingHtml = `
      <div class="cart-summary-card" style="width: 100%;">
        <div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-bottom: 20px;">
          <div>
            <h3 style="font-size: 1.2rem;">Tracking Order: ${activeTrackOrder.id}</h3>
            <span style="font-size: 0.8rem; color: var(--text-secondary);">Placed on: ${activeTrackOrder.date}</span>
          </div>
          <span class="status-pill status-${activeTrackOrder.status.toLowerCase()}" style="font-size: 0.9rem; padding: 6px 14px; height: fit-content;">${activeTrackOrder.status}</span>
        </div>
        
        <!-- Tracking Step progress bar -->
        <div class="order-status-bar">
          <div class="status-fill" style="width: ${progressWidth}%;"></div>
          
          <div class="status-step ${currIdx >= 0 ? 'active' : ''}">
            <div class="status-node"><i class="fa-solid fa-list-check"></i></div>
            <span>Received</span>
          </div>
          
          <div class="status-step ${currIdx >= 1 ? 'active' : ''}">
            <div class="status-node"><i class="fa-solid fa-fire-burner"></i></div>
            <span>Baking</span>
          </div>
          
          <div class="status-step ${currIdx >= 2 ? 'active' : ''}">
            <div class="status-node"><i class="fa-solid fa-truck-fast"></i></div>
            <span>On the Way</span>
          </div>
          
          <div class="status-step ${currIdx >= 3 ? 'active' : ''}">
            <div class="status-node"><i class="fa-solid fa-house-chimney-check"></i></div>
            <span>Delivered</span>
          </div>
        </div>

        <div style="border-top: 1px dashed var(--border-color); padding-top: 20px; margin-top: 30px; font-size: 0.9rem; color: var(--text-secondary);">
          <h4 style="color: var(--text-primary); margin-bottom: 8px;">Delivery Details</h4>
          <p><strong>Customer Name:</strong> ${activeTrackOrder.customer.name}</p>
          <p><strong>Recipient Phone:</strong> ${activeTrackOrder.customer.phone}</p>
          <p><strong>Shipping Address:</strong> ${activeTrackOrder.customer.address}</p>
          ${activeTrackOrder.deliveryInstructions ? `<p><strong>Delivery Notes:</strong> ${activeTrackOrder.deliveryInstructions}</p>` : ''}
        </div>
      </div>
    `;
  }

  main.innerHTML = `
    <div class="container section-padding">
      <div class="admin-layout">
        <!-- Sidebar tabs -->
        <aside class="admin-sidebar">
          <h3 style="padding: 10px 16px; font-size: 1.1rem; border-bottom: 1px solid var(--border-color); margin-bottom: 10px;">My Account</h3>
          <button class="admin-sidebar-btn ${state.activeAccountTab === 'profile' ? 'active' : ''}" onclick="switchAccountTab('profile')">
            <i class="fa-regular fa-user"></i> Profile Details
          </button>
          <button class="admin-sidebar-btn ${state.activeAccountTab === 'history' ? 'active' : ''}" onclick="switchAccountTab('history')">
            <i class="fa-solid fa-history"></i> Order History
          </button>
          <button class="admin-sidebar-btn ${state.activeAccountTab === 'tracking' ? 'active' : ''}" onclick="switchAccountTab('tracking')">
            <i class="fa-solid fa-location-dot"></i> Live Tracking
          </button>
          <button class="admin-sidebar-btn ${state.activeAccountTab === 'wishlist' ? 'active' : ''}" onclick="switchAccountTab('wishlist')">
            <i class="fa-regular fa-heart"></i> My Wishlist
          </button>
          <button class="admin-sidebar-btn" onclick="navigateTo('admin')" style="margin-top: 20px; border-top: 1px solid var(--border-color); border-radius: 0; padding-top: 16px; color: var(--primary);">
            <i class="fa-solid fa-gears"></i> Admin Dashboard
          </button>
        </aside>

        <!-- Main Account Tab pane -->
        <div>
          <!-- Profile View -->
          <div id="account-tab-profile" style="display: ${state.activeAccountTab === 'profile' ? 'block' : 'none'};">
            <div class="cart-items-container">
              <h2 style="margin-bottom: 20px;">Profile Information</h2>
              <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 30px;">
                <div style="width: 80px; height: 80px; border-radius: 50%; background-color: var(--secondary); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 2rem;">
                  <i class="fa-regular fa-user"></i>
                </div>
                <div>
                  <h3>Gourmet Lover</h3>
                  <p style="color: var(--text-secondary); font-size: 0.85rem;">Member since 2026 | Silver Tier discounts</p>
                </div>
              </div>
              <div class="form-group-row">
                <div class="form-group">
                  <label>Full Name</label>
                  <input type="text" value="Gourmet Lover" readonly>
                </div>
                <div class="form-group">
                  <label>Email Address</label>
                  <input type="email" value="gourmet@sweetcrumbs.com" readonly>
                </div>
              </div>
              <div class="form-group">
                <label>Primary Phone Number</label>
                <input type="text" value="+1 (555) 987-6543" readonly>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-secondary); font-style: italic;">* Profile changes are disabled in guest preview mode.</p>
            </div>
          </div>

          <!-- History View -->
          <div id="account-tab-history" style="display: ${state.activeAccountTab === 'history' ? 'block' : 'none'};">
            <h2 style="margin-bottom: 20px;">Past Orders</h2>
            ${orderHistoryHtml}
          </div>

          <!-- Tracking View -->
          <div id="account-tab-tracking" style="display: ${state.activeAccountTab === 'tracking' ? 'block' : 'none'};">
            <h2 style="margin-bottom: 20px;">Delivery Status</h2>
            ${trackingHtml}
          </div>

          <!-- Wishlist View -->
          <div id="account-tab-wishlist" style="display: ${state.activeAccountTab === 'wishlist' ? 'block' : 'none'};">
            <h2 style="margin-bottom: 20px;">My Wishlist</h2>
            ${wishlistHtml}
          </div>
        </div>
      </div>
    </div>
  `;
}

window.switchAccountTab = function(tabName) {
  state.activeAccountTab = tabName;
  renderAccount();
};


// 8. ADMIN DASHBOARD VIEW RENDERER
function renderAdmin() {
  const main = document.getElementById('main-content');
  
  if (!state.adminAuthenticated) {
    main.innerHTML = `
      <div class="container section-padding" style="max-width: 480px;">
        <div class="cart-items-container text-center" style="padding: 40px 30px;">
          <i class="fa-solid fa-lock" style="font-size: 3rem; color: var(--primary); margin-bottom: 20px;"></i>
          <h2>Admin Gate</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 24px;">Enter the passcode to access sales reports and catalog management.</p>
          <form onsubmit="handleAdminLogin(event)">
            <div class="form-group">
              <input type="password" id="admin-passcode" placeholder="Passcode (use: admin)" style="text-align: center; font-size: 1.1rem; letter-spacing: 4px;" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Authenticate</button>
          </form>
        </div>
      </div>
    `;
    return;
  }

  // Dashboard calculations
  const totalRevenue = state.orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = state.orders.length;
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
  const productsCount = state.products.length;

  // Manage Order rows HTML
  let orderRowsHtml = '';
  if (state.orders.length === 0) {
    orderRowsHtml = '<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">No orders placed yet.</td></tr>';
  } else {
    state.orders.forEach(ord => {
      orderRowsHtml += `
        <tr>
          <td><strong>${ord.id}</strong></td>
          <td>${ord.customer.name}</td>
          <td>${ord.date}</td>
          <td>$${ord.total.toFixed(2)}</td>
          <td>
            <select onchange="updateOrderStatus('${ord.id}', this.value)" style="border: 1px solid var(--border-color); padding: 4px 8px; border-radius: var(--radius-sm); font-size: 0.8rem; background: #FFF;">
              <option value="Pending" ${ord.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Baking" ${ord.status === 'Baking' ? 'selected' : ''}>Baking</option>
              <option value="Out for Delivery" ${ord.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
              <option value="Delivered" ${ord.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            </select>
          </td>
          <td>
            <button class="btn btn-secondary" onclick="viewOrderDetails('${ord.id}')" style="padding: 4px 8px; font-size: 0.75rem;"><i class="fa-solid fa-eye"></i></button>
          </td>
        </tr>
      `;
    });
  }

  // Manage Product rows HTML
  let productRowsHtml = '';
  state.products.forEach(prod => {
    productRowsHtml += `
      <tr>
        <td><img src="${prod.image}" alt="${prod.name}" style="width: 40px; height: 40px; border-radius: var(--radius-sm); object-fit: cover;"></td>
        <td><strong>${prod.name}</strong></td>
        <td><span style="font-size: 0.8rem; text-transform: uppercase;">${prod.category.replace('-', ' ')}</span></td>
        <td>$${prod.price.toFixed(2)}</td>
        <td><i class="fa-solid fa-star" style="color: var(--highlight);"></i> ${prod.rating}</td>
        <td>
          <button class="btn btn-secondary" onclick="editProduct(${prod.id})" style="padding: 4px 8px; font-size: 0.75rem; color: var(--primary);"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-secondary" onclick="deleteProduct(${prod.id})" style="padding: 4px 8px; font-size: 0.75rem; color: var(--accent);"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `;
  });

  // Coupons table
  let couponRowsHtml = '';
  state.coupons.forEach(c => {
    couponRowsHtml += `
      <tr>
        <td><code><strong>${c.code}</strong></code></td>
        <td>${c.discount}% Discount</td>
        <td>${c.type}</td>
        <td>
          <button class="btn btn-secondary" onclick="deleteCoupon('${c.code}')" style="padding: 4px 8px; font-size: 0.75rem; color: var(--accent);"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `;
  });

  main.innerHTML = `
    <div class="container section-padding">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 35px;">
        <div>
          <h1 style="font-size: 2.2rem; margin-bottom: 8px;">Kitchen Admin Portal</h1>
          <p style="color: var(--text-secondary);">Manage product catalog, check live revenue charts, and dispatch orders.</p>
        </div>
        <button class="btn btn-secondary" onclick="logoutAdmin()"><i class="fa-solid fa-right-from-bracket"></i> Lock Admin</button>
      </div>

      <div class="admin-layout">
        <!-- Sidebar Navigation -->
        <aside class="admin-sidebar">
          <button class="admin-sidebar-btn ${state.activeAdminTab === 'analytics' ? 'active' : ''}" onclick="switchAdminTab('analytics')">
            <i class="fa-solid fa-chart-line"></i> Analytics & Sales
          </button>
          <button class="admin-sidebar-btn ${state.activeAdminTab === 'orders' ? 'active' : ''}" onclick="switchAdminTab('orders')">
            <i class="fa-solid fa-truck-ramp-box"></i> Manage Orders
          </button>
          <button class="admin-sidebar-btn ${state.activeAdminTab === 'products' ? 'active' : ''}" onclick="switchAdminTab('products')">
            <i class="fa-solid fa-cake"></i> Product Catalog
          </button>
          <button class="admin-sidebar-btn ${state.activeAdminTab === 'coupons' ? 'active' : ''}" onclick="switchAdminTab('coupons')">
            <i class="fa-solid fa-tags"></i> Coupon Settings
          </button>
        </aside>

        <!-- Dynamic Content pane -->
        <div>
          <!-- Tab 1: Analytics -->
          <div id="admin-tab-analytics" style="display: ${state.activeAdminTab === 'analytics' ? 'block' : 'none'};">
            <div class="admin-analytics-grid">
              <div class="analytic-card">
                <div class="analytic-info">
                  <h4>Total Revenue</h4>
                  <span>$${totalRevenue.toFixed(2)}</span>
                </div>
                <i class="fa-solid fa-dollar-sign" style="font-size: 2rem; color: var(--primary); opacity: 0.3;"></i>
              </div>
              <div class="analytic-card">
                <div class="analytic-info">
                  <h4>Total Orders</h4>
                  <span>${totalOrders}</span>
                </div>
                <i class="fa-solid fa-bag-shopping" style="font-size: 2rem; color: var(--primary); opacity: 0.3;"></i>
              </div>
              <div class="analytic-card">
                <div class="analytic-info">
                  <h4>Average Order</h4>
                  <span>$${avgOrderValue.toFixed(2)}</span>
                </div>
                <i class="fa-solid fa-calculator" style="font-size: 2rem; color: var(--primary); opacity: 0.3;"></i>
              </div>
              <div class="analytic-card">
                <div class="analytic-info">
                  <h4>Menu Products</h4>
                  <span>${productsCount}</span>
                </div>
                <i class="fa-solid fa-cookie-bite" style="font-size: 2rem; color: var(--primary); opacity: 0.3;"></i>
              </div>
            </div>

            <!-- Revenue Trend SVG Chart -->
            <div class="chart-placeholder">
              <h3 style="font-size: 1.1rem; margin-bottom: 12px;">Sales Performance Tracker (Weekly)</h3>
              <div class="chart-svg-container">
                <svg viewBox="0 0 500 200" width="100%" height="100%" style="overflow: visible;">
                  <line x1="40" y1="20" x2="40" y2="160" stroke="#E8DCCF" stroke-width="2"/>
                  <line x1="40" y1="160" x2="480" y2="160" stroke="#E8DCCF" stroke-width="2"/>
                  
                  <!-- Gridlines -->
                  <line x1="40" y1="110" x2="480" y2="110" stroke="#F8E8D8" stroke-dasharray="4"/>
                  <line x1="40" y1="60" x2="480" y2="60" stroke="#F8E8D8" stroke-dasharray="4"/>

                  <!-- Trend Line -->
                  <path d="M 40 150 L 110 130 L 180 140 L 250 90 L 320 110 L 390 70 L 460 50" fill="none" stroke="var(--primary)" stroke-width="3"/>
                  
                  <!-- Dots -->
                  <circle cx="40" cy="150" r="5" fill="var(--primary)"/>
                  <circle cx="110" cy="130" r="5" fill="var(--primary)"/>
                  <circle cx="180" cy="140" r="5" fill="var(--primary)"/>
                  <circle cx="250" cy="90" r="5" fill="var(--accent)"/>
                  <circle cx="320" cy="110" r="5" fill="var(--primary)"/>
                  <circle cx="390" cy="70" r="5" fill="var(--primary)"/>
                  <circle cx="460" cy="50" r="5" fill="var(--primary)"/>
                  
                  <!-- Labels -->
                  <text x="40" y="180" font-size="10" fill="#666" text-anchor="middle">Mon</text>
                  <text x="110" y="180" font-size="10" fill="#666" text-anchor="middle">Tue</text>
                  <text x="180" y="180" font-size="10" fill="#666" text-anchor="middle">Wed</text>
                  <text x="250" y="180" font-size="10" fill="#666" text-anchor="middle">Thu</text>
                  <text x="320" y="180" font-size="10" fill="#666" text-anchor="middle">Fri</text>
                  <text x="390" y="180" font-size="10" fill="#666" text-anchor="middle">Sat</text>
                  <text x="460" y="180" font-size="10" fill="#666" text-anchor="middle">Sun</text>
                  
                  <text x="30" y="160" font-size="10" fill="#666" text-anchor="end">0</text>
                  <text x="30" y="110" font-size="10" fill="#666" text-anchor="end">500</text>
                  <text x="30" y="60" font-size="10" fill="#666" text-anchor="end">1000</text>
                </svg>
              </div>
            </div>
          </div>

          <!-- Tab 2: Orders Management -->
          <div id="admin-tab-orders" style="display: ${state.activeAdminTab === 'orders' ? 'block' : 'none'};">
            <div class="admin-table-card">
              <div class="table-header-bar">
                <h3>Live Kitchen Orders</h3>
              </div>
              <div class="admin-table-wrapper">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orderRowsHtml}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Tab 3: Products Catalog -->
          <div id="admin-tab-products" style="display: ${state.activeAdminTab === 'products' ? 'block' : 'none'};">
            <div class="admin-table-card" style="margin-bottom: 30px;">
              <div class="table-header-bar">
                <h3>${state.editingProductId ? 'Edit Menu Product' : 'Add New Cake / Dessert'}</h3>
              </div>
              <div style="padding: 24px;">
                <form onsubmit="handleProductSubmit(event)">
                  <div class="form-group-row">
                    <div class="form-group">
                      <label>Product Name *</label>
                      <input type="text" id="admin-prod-name" required placeholder="E.g. Strawberry Shortcake">
                    </div>
                    <div class="form-group">
                      <label>Category *</label>
                      <select id="admin-prod-cat" required>
                        <option value="birthday-cakes">Birthday Cakes</option>
                        <option value="wedding-cakes">Wedding Cakes</option>
                        <option value="chocolate-cakes">Chocolate Cakes</option>
                        <option value="cupcakes">Cupcakes</option>
                        <option value="cookies">Cookies</option>
                        <option value="brownies">Brownies</option>
                        <option value="pastries">Pastries</option>
                        <option value="cheesecakes">Cheesecakes</option>
                        <option value="bread">Bread</option>
                        <option value="desserts">Desserts</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group-row">
                    <div class="form-group">
                      <label>Price ($) *</label>
                      <input type="number" id="admin-prod-price" step="0.01" required placeholder="24.99">
                    </div>
                    <div class="form-group">
                      <label>Image URL *</label>
                      <input type="text" id="admin-prod-image" required placeholder="Unsplash URL or Local path">
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Description *</label>
                    <textarea id="admin-prod-desc" rows="3" required placeholder="Write ingredients details, allergens, sponge textures..."></textarea>
                  </div>
                  <div style="display: flex; gap: 10px;">
                    <button type="submit" class="btn btn-primary">${state.editingProductId ? 'Update Product' : 'Add Product to Shop'}</button>
                    ${state.editingProductId ? `<button type="button" class="btn btn-secondary" onclick="cancelProductEdit()">Cancel</button>` : ''}
                  </div>
                </form>
              </div>
            </div>

            <div class="admin-table-card">
              <div class="table-header-bar">
                <h3>Product Catalog List</h3>
              </div>
              <div class="admin-table-wrapper">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Img</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Rating</th>
                      <th>Action Commands</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${productRowsHtml}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Tab 4: Coupon Settings -->
          <div id="admin-tab-coupons" style="display: ${state.activeAdminTab === 'coupons' ? 'block' : 'none'};">
            <div class="admin-table-card" style="margin-bottom: 30px;">
              <div class="table-header-bar">
                <h3>Create New Coupon</h3>
              </div>
              <div style="padding: 24px;">
                <form onsubmit="handleCouponSubmit(event)">
                  <div class="form-group-row">
                    <div class="form-group">
                      <label>Coupon Code (Alphanumeric) *</label>
                      <input type="text" id="admin-coupon-code" required placeholder="E.g. SWEET30" style="text-transform: uppercase;">
                    </div>
                    <div class="form-group">
                      <label>Discount Amount (%) *</label>
                      <input type="number" id="admin-coupon-discount" min="1" max="100" required placeholder="30">
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary">Create Coupon</button>
                </form>
              </div>
            </div>

            <div class="admin-table-card">
              <div class="table-header-bar">
                <h3>Active Coupon Codes</h3>
              </div>
              <div class="admin-table-wrapper">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Discount Value</th>
                      <th>Calculation Type</th>
                      <th>Delete Command</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${couponRowsHtml}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.handleAdminLogin = function(event) {
  event.preventDefault();
  const pass = document.getElementById('admin-passcode').value.trim();
  
  if (pass === 'admin') {
    state.adminAuthenticated = true;
    renderAdmin();
  } else {
    alert('Access Denied! Invalid admin credentials passcode.');
  }
};

window.logoutAdmin = function() {
  state.adminAuthenticated = false;
  navigateTo('home');
};

window.switchAdminTab = function(tabName) {
  state.activeAdminTab = tabName;
  state.editingProductId = null; // Clear edit state
  renderAdmin();
};

window.updateOrderStatus = function(orderId, newStatus) {
  const ord = state.orders.find(o => o.id === orderId);
  if (ord) {
    ord.status = newStatus;
    saveOrdersToStorage();
    alert(`Order ${orderId} updated to status: ${newStatus}`);
    
    // Automatically trigger updates if viewing account tracking
    if (state.currentView === 'account') renderAccount();
  }
};

window.viewOrderDetails = function(orderId) {
  const ord = state.orders.find(o => o.id === orderId);
  if (!ord) return;

  const detailHtml = `
    <div style="font-size: 0.95rem;">
      <p style="margin-bottom: 8px;"><strong>Date:</strong> ${ord.date}</p>
      <p style="margin-bottom: 8px;"><strong>Status:</strong> <span class="status-pill status-${ord.status.toLowerCase()}">${ord.status}</span></p>
      <p style="margin-bottom: 8px;"><strong>Payment Method:</strong> ${ord.paymentMethod}</p>
      
      <h4 style="margin: 20px 0 8px 0; border-bottom: 1px solid var(--border-color);">Customer Address Details</h4>
      <p><strong>Name:</strong> ${ord.customer.name}</p>
      <p><strong>Phone:</strong> ${ord.customer.phone}</p>
      <p><strong>Email:</strong> ${ord.customer.email}</p>
      <p><strong>Address:</strong> ${ord.customer.address}</p>
      ${ord.deliveryInstructions ? `<p><strong>Instructions:</strong> ${ord.deliveryInstructions}</p>` : ''}

      <h4 style="margin: 20px 0 8px 0; border-bottom: 1px solid var(--border-color);">Items Ordered</h4>
      ${ord.items.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>${item.name} <strong>x ${item.quantity}</strong></span>
          <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
        ${item.customNotes ? `<p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 10px; padding-left: 10px; font-style: italic;">Note: ${item.customNotes}</p>` : ''}
      `).join('')}

      <div style="border-top: 1px dashed var(--border-color); padding-top: 10px; margin-top: 16px; text-align: right; font-weight: 700; color: var(--primary); font-size: 1.15rem;">
        Grand Total: $${ord.total.toFixed(2)}
      </div>
    </div>
  `;

  showModal(`Order details: ${orderId}`, detailHtml);
};

// Admin Products catalog management
window.handleProductSubmit = function(event) {
  event.preventDefault();
  const name = document.getElementById('admin-prod-name').value.trim();
  const category = document.getElementById('admin-prod-cat').value;
  const price = Number(document.getElementById('admin-prod-price').value);
  const image = document.getElementById('admin-prod-image').value.trim();
  const description = document.getElementById('admin-prod-desc').value.trim();

  if (state.editingProductId) {
    // Edit existing product
    const idx = state.products.findIndex(p => p.id === state.editingProductId);
    if (idx > -1) {
      state.products[idx] = {
        ...state.products[idx],
        name,
        category,
        price,
        image,
        description
      };
    }
    state.editingProductId = null;
    alert('Product details updated successfully!');
  } else {
    // Add new product
    const newId = state.products.length > 0 ? Math.max(...state.products.map(p => p.id)) + 1 : 1;
    const newProd = {
      id: newId,
      name,
      category,
      price,
      image,
      description,
      rating: 5.0,
      reviewsCount: 0,
      inStock: true
    };
    state.products.push(newProd);
    alert('New cake product added successfully to the catalog!');
  }

  saveProductsToStorage();
  renderAdmin();
};

window.editProduct = function(prodId) {
  const prod = state.products.find(p => p.id === prodId);
  if (!prod) return;

  state.editingProductId = prodId;
  renderAdmin(); // Re-render to show edit title

  // Set form inputs
  document.getElementById('admin-prod-name').value = prod.name;
  document.getElementById('admin-prod-cat').value = prod.category;
  document.getElementById('admin-prod-price').value = prod.price;
  document.getElementById('admin-prod-image').value = prod.image;
  document.getElementById('admin-prod-desc').value = prod.description;
  
  // Scroll to form
  window.scrollTo({ top: 180, behavior: 'smooth' });
};

window.cancelProductEdit = function() {
  state.editingProductId = null;
  renderAdmin();
};

window.deleteProduct = function(prodId) {
  if (confirm('Are you sure you want to delete this product from the store catalog?')) {
    state.products = state.products.filter(p => p.id !== prodId);
    saveProductsToStorage();
    renderAdmin();
  }
};

// Admin coupon commands
window.handleCouponSubmit = function(event) {
  event.preventDefault();
  const code = document.getElementById('admin-coupon-code').value.trim().toUpperCase();
  const discount = Number(document.getElementById('admin-coupon-discount').value);

  if (state.coupons.find(c => c.code === code)) {
    alert('Coupon Code already exists!');
    return;
  }

  state.coupons.push({
    code,
    discount,
    type: 'percent'
  });

  saveCouponsToStorage();
  renderAdmin();
  alert('New coupon successfully created!');
};

window.deleteCoupon = function(code) {
  if (confirm(`Are you sure you want to remove the coupon code: ${code}?`)) {
    state.coupons = state.coupons.filter(c => c.code !== code);
    saveCouponsToStorage();
    renderAdmin();
  }
};
