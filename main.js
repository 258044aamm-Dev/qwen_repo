// Amaanix - Main JavaScript
// Extracted and consolidated from index.html
// Handles: UI interactions, accessibility, state management, animations

// Initialize Lucide icons after DOM load
document.addEventListener('DOMContentLoaded', function() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// === Script Block 1 ===
// Issue 6: Toast Notification System
        function showToast(message) {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = message;
            container.appendChild(toast);
            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // Issue 8: Focus Trap Utility
        function trapFocus(element) {
            const focusableEls = element.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
            if (focusableEls.length === 0) return;
            const firstFocusableEl = focusableEls[0];
            const lastFocusableEl = focusableEls[focusableEls.length - 1];
            
            function handleTab(e) {
                if (e.key !== 'Tab') return;
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableEl) {
                        lastFocusableEl.focus(); e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableEl) {
                        firstFocusableEl.focus(); e.preventDefault();
                    }
                }
            }
            element.addEventListener('keydown', handleTab);
            return () => element.removeEventListener('keydown', handleTab);
        }

        // Announcement Bar
        const announcementBar = document.getElementById('announcementBar');
        const announcementTrack = document.getElementById('announcementTrack');
        const closeBtn = document.getElementById('closeAnnouncementBtn');
        let announcementCurrentSlide = 0;
        let autoRotateInterval;
        let isHovering = false;
        let isSwiping = false;
        let startX = 0;
        let currentX = 0;

        function startAutoRotate() {
            autoRotateInterval = setInterval(() => {
                if (!isHovering && !isSwiping) nextAnnouncementSlide();
            }, 5000);
        }
        function nextAnnouncementSlide() {
            announcementCurrentSlide = (announcementCurrentSlide + 1) % 2;
            updateAnnouncementTrackPosition();
        }
        function updateAnnouncementTrackPosition() {
            announcementTrack.style.transform = `translateX(-${announcementCurrentSlide * 100}%)`;
        }
        announcementBar.addEventListener('mouseenter', () => isHovering = true);
        announcementBar.addEventListener('mouseleave', () => isHovering = false);
        announcementBar.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; isSwiping = true; }, { passive: true });
        announcementBar.addEventListener('touchmove', (e) => { if (isSwiping) currentX = e.touches[0].clientX; }, { passive: true });
        announcementBar.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextAnnouncementSlide();
                else { announcementCurrentSlide = (announcementCurrentSlide - 1 + 2) % 2; updateAnnouncementTrackPosition(); }
            }
            isSwiping = false;
        });
        closeBtn.addEventListener('click', () => {
            announcementBar.classList.add('dismissing');
            setTimeout(() => announcementBar.style.display = 'none', 300);
        });
        startAutoRotate();

        // Hero Slider
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.hero-dot');
        let currentSlide = 0;
        let slideInterval;
        function showSlide(index) {
            slides.forEach((slide, i) => { slide.classList.remove('active'); dots[i].classList.remove('active'); });
            slides[index].classList.add('active'); dots[index].classList.add('active'); currentSlide = index;
        }
        function nextSlide() { showSlide((currentSlide + 1) % slides.length); }
        function changeSlide(index) { showSlide(index); clearInterval(slideInterval); slideInterval = setInterval(nextSlide, 6000); }
        slideInterval = setInterval(nextSlide, 6000);
        dots.forEach(dot => dot.addEventListener('click', function() { changeSlide(parseInt(this.getAttribute('data-slide'), 10)); }));

        // Issue 3: Countdown Timer Persistence
        let countdownDate = localStorage.getItem('amaanix_deal_end');
        if (!countdownDate || parseInt(countdownDate) < new Date().getTime()) {
            countdownDate = new Date().getTime() + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000);
            localStorage.setItem('amaanix_deal_end', countdownDate);
        } else {
            countdownDate = parseInt(countdownDate);
        }
        const countdownFunction = setInterval(function() {
            const now = new Date().getTime();
            const distance = countdownDate - now;
            document.getElementById("days").innerHTML = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
            document.getElementById("hours").innerHTML = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
            document.getElementById("minutes").innerHTML = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
            document.getElementById("seconds").innerHTML = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
            if (distance < 0) { clearInterval(countdownFunction); document.getElementById("countdown").innerHTML = "EXPIRED"; }
        }, 1000);

        // Mobile Menu Toggle
        let removeMobileTrap = null;
        (function() {
            function initMobileMenu() {
                const mobileToggle = document.getElementById('mobileToggle');
                const mobileMenu = document.getElementById('mobileMenu');
                const mobileOverlay = document.getElementById('mobileOverlay');
                const mobileClose = document.getElementById('mobileClose');
                if (!mobileToggle || !mobileMenu || !mobileOverlay || !mobileClose) return;

                function openMobileMenu() {
                    mobileMenu.classList.add('active'); mobileOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    removeMobileTrap = trapFocus(mobileMenu);
                    mobileClose.focus();
                }
                function closeMobileMenu() {
                    mobileMenu.classList.remove('active'); mobileOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                    if (removeMobileTrap) removeMobileTrap();
                    mobileToggle.focus();
                }
                mobileToggle.addEventListener('click', (e) => { e.preventDefault(); openMobileMenu(); });
                mobileClose.addEventListener('click', (e) => { e.preventDefault(); closeMobileMenu(); });
                mobileOverlay.addEventListener('click', (e) => { e.preventDefault(); closeMobileMenu(); });
                
                // Issue 11: Close menu on link click
                document.querySelectorAll('.mobile-nav-links a').forEach(link => {
                    link.addEventListener('click', closeMobileMenu);
                });
            }
            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMobileMenu);
            else initMobileMenu();
        })();

        // Mobile Profile Dropdown Toggle
        (function() {
            const profileDropdown = document.querySelector('.profile-dropdown');
            if (!profileDropdown) return;
            function isMobile() { return window.innerWidth <= 768; }
            profileDropdown.addEventListener('click', function(e) {
                if (isMobile()) {
                    if (e.target.closest('.profile-menu a')) return;
                    e.preventDefault(); e.stopPropagation(); profileDropdown.classList.toggle('active');
                }
            });
            document.addEventListener('click', function(e) { if (isMobile() && !profileDropdown.contains(e.target)) profileDropdown.classList.remove('active'); });
            window.addEventListener('resize', function() { if (!isMobile()) profileDropdown.classList.remove('active'); });
        })();

        // Sticky Header Shadow
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            header.style.boxShadow = window.scrollY > 50 ? "0 4px 20px rgba(0,0,0,0.1)" : "0 2px 10px rgba(0,0,0,0.05)";
        });

        // Footer Accordion for Mobile
        const footerHeaders = document.querySelectorAll('.footer-accordion-header');
        footerHeaders.forEach(header => {
            header.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    const content = header.nextElementSibling; const isOpen = content.classList.contains('open');
                    footerHeaders.forEach(otherHeader => { if (otherHeader !== header) { otherHeader.classList.remove('active'); otherHeader.nextElementSibling.classList.remove('open'); otherHeader.nextElementSibling.style.maxHeight = null; } });
                    if (isOpen) { header.classList.remove('active'); content.classList.remove('open'); content.style.maxHeight = null; }
                    else { header.classList.add('active'); content.classList.add('open'); content.style.maxHeight = content.scrollHeight + "px"; }
                }
            });
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) footerHeaders.forEach(header => { header.classList.remove('active'); const content = header.nextElementSibling; if (content) { content.classList.remove('open'); content.style.maxHeight = null; } });
        });

// === Script Block 2 ===
// Search Overlay Functionality
        (function() {
            const searchOverlay = document.getElementById('searchOverlay');
            const searchTrigger = document.getElementById('searchTrigger');
            const searchInput = document.getElementById('searchInput');
            const searchClear = document.getElementById('searchClear');
            const searchSubmit = document.getElementById('searchSubmit');
            const searchPlaceholder = document.getElementById('searchPlaceholder');
            const searchSuggestions = document.getElementById('searchSuggestions');
            const searchRecent = document.getElementById('searchRecent');
            const searchResults = document.getElementById('searchResults');
            const noResults = document.getElementById('noResults');
            const searchLoading = document.getElementById('searchLoading');
            const viewAllResults = document.getElementById('viewAllResults');
            const clearRecent = document.getElementById('clearRecent');
            const recentList = document.getElementById('recentList');
            const searchChips = document.querySelectorAll('.search-chip');
            let removeSearchTrap = null;

            const placeholderTexts = ['watches', 'earbuds', 'Find your style..', 'desk organizer', 'wellness kit'];
            let placeholderIndex = 0;
            let typingTimeout;

            function rotatePlaceholder() {
                searchPlaceholder.textContent = `Try searching: "${placeholderTexts[placeholderIndex]}"`;
                placeholderIndex = (placeholderIndex + 1) % placeholderTexts.length;
            }
            setInterval(rotatePlaceholder, 3000); rotatePlaceholder();

            function openSearch() {
                searchOverlay.classList.add('active'); searchInput.focus(); loadRecentSearches(); showSuggestions();
                removeSearchTrap = trapFocus(searchOverlay);
            }
            function closeSearch() {
                searchOverlay.classList.remove('active'); searchInput.value = ''; searchClear.classList.remove('visible'); hideAllSearchStates();
                if (removeSearchTrap) removeSearchTrap();
                searchTrigger.focus();
            }

            if (searchTrigger) searchTrigger.addEventListener('click', openSearch);
            if (searchOverlay) searchOverlay.addEventListener('click', (e) => { if (e.target === searchOverlay) closeSearch(); });
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeSearch(); closeWishlistDrawer(); } });

            if (searchInput && searchClear) {
                searchInput.addEventListener('input', function() {
                    searchClear.classList.toggle('visible', this.value.length > 0);
                    if (this.value.length > 0) { hideSuggestions(); showLoading(); performSearch(this.value); } else { showSuggestions(); }
                });
                searchClear.addEventListener('click', () => { searchInput.value = ''; searchClear.classList.remove('visible'); searchInput.focus(); showSuggestions(); });
            }

            searchChips.forEach(chip => chip.addEventListener('click', function() {
                const query = this.dataset.query; searchInput.value = query; searchClear.classList.add('visible'); saveRecentSearch(query); performSearch(query);
            }));

            if (searchSubmit) searchSubmit.addEventListener('click', () => { const q = searchInput.value.trim(); if (q) { saveRecentSearch(q); window.location.href = `collectionpage.html?q=${encodeURIComponent(q)}`; } });
            if (searchInput) searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { const q = searchInput.value.trim(); if (q) { saveRecentSearch(q); window.location.href = `collectionpage.html?q=${encodeURIComponent(q)}`; } } });
            if (viewAllResults) viewAllResults.addEventListener('click', (e) => { e.preventDefault(); const q = searchInput.value.trim(); window.location.href = q ? `collectionpage.html?q=${encodeURIComponent(q)}` : 'collectionpage.html'; });

            function loadRecentSearches() {
                const recent = JSON.parse(localStorage.getItem('amaanix_search_history') || '[]');
                if (recent.length === 0) { searchRecent.style.display = 'none'; return; }
                searchRecent.style.display = 'block'; recentList.innerHTML = '';
                recent.slice(0, 5).forEach(query => {
                    const li = document.createElement('li'); li.className = 'search-recent-item';
                    const a = document.createElement('a'); a.href = "#"; a.textContent = query;
                    a.addEventListener('click', (e) => { e.preventDefault(); searchInput.value = query; searchClear.classList.add('visible'); performSearch(query); });
                    li.appendChild(a);
                    const span = document.createElement('span'); span.style.cssText = 'color:var(--text-light);font-size:12px'; span.textContent = '↗';
                    li.appendChild(span);
                    recentList.appendChild(li);
                });
            }
            function saveRecentSearch(query) {
                let recent = JSON.parse(localStorage.getItem('amaanix_search_history') || '[]');
                recent = recent.filter(q => q.toLowerCase() !== query.toLowerCase()); recent.unshift(query);
                if (recent.length > 10) recent = recent.slice(0, 10);
                try { localStorage.setItem('amaanix_search_history', JSON.stringify(recent)); } catch(e) {}
                loadRecentSearches();
            }
            if (clearRecent) clearRecent.addEventListener('click', () => { try { localStorage.removeItem('amaanix_search_history'); } catch(e) {} loadRecentSearches(); });

            function hideAllSearchStates() { searchSuggestions.style.display = 'none'; searchRecent.style.display = 'none'; searchResults.style.display = 'none'; noResults.style.display = 'none'; searchLoading.style.display = 'none'; }
            function showSuggestions() { hideAllSearchStates(); searchSuggestions.style.display = 'block'; loadRecentSearches(); if (JSON.parse(localStorage.getItem('amaanix_search_history') || '[]').length > 0) searchRecent.style.display = 'block'; }
            function hideSuggestions() { searchSuggestions.style.display = 'none'; }
            function showLoading() { hideAllSearchStates(); searchLoading.style.display = 'flex'; }
            
            function showResults(results) {
                hideAllSearchStates();
                if (results.length === 0) { noResults.style.display = 'block'; } 
                else {
                    searchResults.style.display = 'block';
                    searchResults.innerHTML = ''; // Issue 12: Clear previous safely
                    results.forEach(r => {
                        const item = document.createElement('div'); item.className = 'search-result-item';
                        const img = document.createElement('img'); img.src = r.image; img.alt = r.name; img.className = 'search-result-thumbnail'; img.loading = 'lazy';
                        const info = document.createElement('div'); info.className = 'search-result-info';
                        const name = document.createElement('div'); name.className = 'search-result-name'; name.textContent = r.name; // Issue 12: textContent prevents XSS
                        const price = document.createElement('div'); price.className = 'search-result-price'; price.textContent = r.price; // Issue 12: textContent prevents XSS
                        info.appendChild(name); info.appendChild(price); item.appendChild(img); item.appendChild(info);
                        item.addEventListener('click', () => window.location.href = r.url);
                        searchResults.appendChild(item);
                    });
                }
            }

            // Issue 2: Fixed Search Filter Logic
            function performSearch(query) {
                const mockProducts = [
                    { name: 'Premium Desk Organizer', price: '$49.99', image: 'assets/images/10a0f67f2-1643-4ff5-99a0-8724f31bd312.png', url: 'product-detail-page.html' },
                    { name: 'Wireless Charging Pad', price: '$34.99', image: 'assets/images/100446461-e767-45ca-b1a1-c5806b9fec76.png', url: 'product-detail-page.html' },
                    { name: 'Wellness Essential Kit', price: '$59.99', image: 'assets/images/1451dc398-83fa-4b58-96b2-138fda89c53c.png', url: 'product-detail-page.html' },
                    { name: 'Probiotic Capsules', price: '$34.00', image: 'assets/images/1f195e9bd-bbad-40b7-9b94-8f14a7c8948d.png', url: 'product-detail-page.html' },
                    { name: 'Collagen Powder', price: '$42.00', image: 'assets/images/1db644ff9-912b-4754-b253-28a0b6799c56.png', url: 'product-detail-page.html' }
                ];
                clearTimeout(typingTimeout);
                typingTimeout = setTimeout(() => {
                    const lowerQuery = query.toLowerCase();
                    const results = mockProducts.filter(p => p.name.toLowerCase().includes(lowerQuery)).slice(0, 5); // Issue 2: Fixed logic
                    showResults(results);
                }, 300);
            }
            loadRecentSearches();
        })();

        // Wishlist Drawer Functions
        let removeWishlistTrap = null;
        function openWishlistDrawer(event) {
            if (event) { event.preventDefault(); event.stopPropagation(); }
            const drawer = document.getElementById('wishlistDrawer');
            const overlay = document.getElementById('wishlistDrawerOverlay');
            if (drawer && overlay) {
                drawer.classList.add('active'); overlay.classList.add('active'); document.body.style.overflow = 'hidden';
                checkUserStatus(); updateWishlistSummary();
                removeWishlistTrap = trapFocus(drawer);
                drawer.querySelector('.wishlist-drawer-close').focus();
            }
        }
        function closeWishlistDrawer() {
            const drawer = document.getElementById('wishlistDrawer');
            const overlay = document.getElementById('wishlistDrawerOverlay');
            if (drawer && overlay) {
                drawer.classList.remove('active'); overlay.classList.remove('active'); document.body.style.overflow = '';
                if (removeWishlistTrap) removeWishlistTrap();
            }
        }

        function isUserLoggedIn() { return localStorage.getItem('amaanix_user') !== null; }
        function checkUserStatus() { const p = document.getElementById('wishlistGuestPrompt'); if (p) p.style.display = !isUserLoggedIn() ? 'flex' : 'none'; }
        function hideGuestPrompt() { const p = document.getElementById('wishlistGuestPrompt'); if (p) p.style.display = 'none'; }

        function updateWishlistSummary() {
            const items = document.querySelectorAll('#wishlistItemsContainer .wishlist-item');
            let total = 0, count = 0;
            items.forEach(item => { const price = parseFloat(item.dataset.price) || 0; const quantity = parseInt(item.querySelector('.quantity-value').textContent) || 1; total += price * quantity; count += quantity; });
            const subtotalEl = document.getElementById('wishlistSubtotal'), totalEl = document.getElementById('wishlistTotal'), countEl = document.getElementById('wishlistItemCount'), addAllBtn = document.getElementById('wishlistAddAllBtn');
            if (subtotalEl) subtotalEl.textContent = '$' + total.toFixed(2); if (totalEl) totalEl.textContent = '$' + total.toFixed(2); if (countEl) countEl.textContent = count; if (addAllBtn) addAllBtn.disabled = items.length === 0;
            if (!isUserLoggedIn()) saveWishlistToLocalStorage();
        }
        function updateQuantity(btn, change) { const q = btn.parentElement.querySelector('.quantity-value'); let v = parseInt(q.textContent) || 1; q.textContent = Math.max(1, v + change); updateWishlistSummary(); }
        function removeFromWishlist(btn) { const item = btn.closest('.wishlist-item'); if (item) { item.style.opacity = '0.5'; item.style.pointerEvents = 'none'; setTimeout(() => { item.remove(); updateWishlistSummary(); if (!isUserLoggedIn()) saveWishlistToLocalStorage(); }, 200); } }
        
        // Issue 6: Replaced alert with toast
        function addToCartFromWishlist(btn) {
            const item = btn.closest('.wishlist-item'); const name = item.querySelector('.wishlist-item-name').textContent; const price = item.querySelector('.wishlist-item-price').textContent; const quantity = parseInt(item.querySelector('.quantity-value').textContent) || 1;
            showToast(`${name} (x${quantity}) added to cart for ${price} each!`);
            btn.textContent = 'Added!'; btn.style.background = '#27ae60'; setTimeout(() => { btn.textContent = 'Add to Cart'; btn.style.background = ''; }, 1500);
        }
        // Issue 6: Replaced alert with toast
        function addAllToCart() {
            const items = document.querySelectorAll('#wishlistItemsContainer .wishlist-item'); if (items.length === 0) return;
            showToast(`${items.length} item(s) added to cart!`);
            const btn = document.getElementById('wishlistAddAllBtn'); if (btn) { const o = btn.textContent; btn.textContent = 'All Added! ✓'; btn.style.background = '#27ae60'; setTimeout(() => { btn.textContent = o; btn.style.background = ''; }, 2000); }
        }

        function saveWishlistToLocalStorage() {
            const items = []; document.querySelectorAll('#wishlistItemsContainer .wishlist-item').forEach(item => { items.push({ id: item.dataset.id, name: item.querySelector('.wishlist-item-name').textContent, price: item.dataset.price, image: item.querySelector('.wishlist-item-image').src, quantity: parseInt(item.querySelector('.quantity-value').textContent) || 1 }); });
            try { localStorage.setItem('amaanix_wishlist_guest', JSON.stringify(items)); } catch(e) {}
        }
        function loadWishlistFromLocalStorage() {
            let saved; try { saved = localStorage.getItem('amaanix_wishlist_guest'); } catch(e) { return; }
            if (!saved) return;
            try {
                const items = JSON.parse(saved); const container = document.getElementById('wishlistItemsContainer'); if (!container || items.length === 0) return; container.innerHTML = '';
                items.forEach(item => {
                    const itemEl = document.createElement('div'); itemEl.className = 'wishlist-item'; itemEl.dataset.id = item.id; itemEl.dataset.price = item.price;
                    itemEl.innerHTML = `<img src="${item.image}" alt="${item.name}" class="wishlist-item-image"><div class="wishlist-item-info"><div class="wishlist-item-name">${item.name}</div><div class="wishlist-item-price">${item.price}</div><div class="wishlist-quantity"><button class="quantity-btn" onclick="updateQuantity(this, -1)">−</button><span class="quantity-value">${item.quantity}</span><button class="quantity-btn" onclick="updateQuantity(this, 1)">+</button></div><div class="wishlist-item-actions"><button class="wishlist-add-cart" onclick="addToCartFromWishlist(this)">Add to Cart</button><button class="wishlist-remove" onclick="removeFromWishlist(this)">Remove</button></div></div>`;
                    container.appendChild(itemEl);
                }); updateWishlistSummary();
            } catch (e) { console.error('Failed to load wishlist:', e); }
        }
        function syncWishlistWithServer() { if (!isUserLoggedIn()) return; console.log('Wishlist synced (simulated)'); }
        
        document.addEventListener('DOMContentLoaded', function() { if (!isUserLoggedIn()) loadWishlistFromLocalStorage(); else syncWishlistWithServer(); });
        window.addEventListener('storage', function(e) { if (e.key === 'amaanix_wishlist_guest' && !isUserLoggedIn()) loadWishlistFromLocalStorage(); });

// ===== WISHLIST EVENT DELEGATION (replaces inline onclick) =====
// Attach delegated event listeners for wishlist drawer interactions
document.addEventListener('DOMContentLoaded', function() {
  const wishlistDrawer = document.getElementById('wishlistDrawer');
  if (!wishlistDrawer) return;
  
  // Delegate clicks within wishlist drawer
  wishlistDrawer.addEventListener('click', function(e) {
    const target = e.target;
    
    // Quantity buttons: updateQuantity(btn, delta)
    if (target.classList.contains('quantity-btn')) {
      e.preventDefault();
      const delta = target.textContent.trim() === '+' ? 1 : -1;
      updateQuantity(target, delta);
      return;
    }
    
    // Add to cart button
    if (target.classList.contains('wishlist-add-cart')) {
      e.preventDefault();
      addToCartFromWishlist(target);
      return;
    }
    
    // Remove button
    if (target.classList.contains('wishlist-remove')) {
      e.preventDefault();
      removeFromWishlist(target);
      return;
    }
  });
  
  // Add All to Cart button (outside delegated area)
  const addAllBtn = document.getElementById('wishlistAddAllBtn');
  if (addAllBtn) {
    addAllBtn.addEventListener('click', function(e) {
      e.preventDefault();
      addAllToCart();
    });
  }
  
  // Wishlist drawer overlay close
  const overlay = document.getElementById('wishlistDrawerOverlay');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      e.preventDefault();
      closeWishlistDrawer();
    });
  }
  
  // Wishlist drawer close button
  const closeBtn = wishlistDrawer.querySelector('.wishlist-drawer-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      closeWishlistDrawer();
    });
  }
  
  // Guest prompt close button
  const guestPrompt = document.getElementById('wishlistGuestPrompt');
  if (guestPrompt) {
    const closePrompt = guestPrompt.querySelector('.close-prompt');
    if (closePrompt) {
      closePrompt.addEventListener('click', function(e) {
        e.preventDefault();
        hideGuestPrompt();
      });
    }
  }
  
  // Wishlist icon buttons (header)
  const wishlistIcons = document.querySelectorAll('.wishlist-icon, .mobile-wishlist-icon');
  wishlistIcons.forEach(icon => {
    icon.addEventListener('click', function(e) {
      e.preventDefault();
      openWishlistDrawer(e);
    });
  });
});
