# PROJECT_CONTEXT.md

## 1. Project Overview & Goal
**FASHIONFEVER** is a premium, multi-sided fashion & beauty marketplace application integrating:
*   **E-Commerce Platform:** Customers browse beauty products; approved vendors list items and configure variants.
*   **Booking Platform:** Customers schedule beauty services from approved salon and freelance service providers.
*   **Affiliate Portal:** Social media influencers register, generate custom referral links, track conversion metrics, and submit content links for commission validations.
*   **Wholesale Distribution:** Distributors order bulk packages with volume discount tiers and book pre-orders for out-of-stock items.
*   **Academy (E-Learning):** Educators build instructional video catalogs, categorize tutorials, and enroll students.

---

## 2. Project Architecture & Directory Layout
```
e:\office project\WAKEUPMAKEUP
├── index.html                  # HTML Shell
├── vite.config.js              # Vite bundler configuration
├── eslint.config.js            # Code syntax verification patterns
├── package.json                # Dependencies (React 19, Vite 8, Tailwind 4)
└── src/
    ├── main.jsx                # Application root rendering hook
    ├── App.jsx                 # Route configurations & base layout wraps
    ├── index.css               # Global styling, Google fonts & theme tokens
    ├── api/                    # API Service functions mapped to backend endpoints
    │   ├── apiClient.js        # Central Axios client (includes auth token injector & 401 redirector)
    │   ├── adminService.js     # Admin backend endpoints
    │   ├── authService.js      # Register, login, OTP, and user detail edits
    │   ├── cartService.js      # Cart API bindings
    │   ├── educatorService.js  # Academy educators backend hooks
    │   ├── productService.js   # Product fetchers & queries
    │   ├── serviceProviderService.js # Booking panel API calls
    │   ├── vendorService.js    # Vendor store analytics & listing APIs
    │   └── wishlistService.js  # Wishlist API integrations
    ├── context/                # Global React Context states
    │   ├── CartContext.jsx     # Handles checkout basket operations & local storage sync
    │   ├── SearchContext.jsx   # Connects navbar search strings to the shop component
    │   ├── ThemeContext.jsx    # Dark/Light theme toggles
    │   ├── UserContext.jsx     # Auth token session controls & details
    │   └── WishlistContext.jsx # Wishlist counts & persistence
    ├── components/             # Reusable UI component blocks
    │   ├── Navbar.jsx          # Top Navigation Bar & search entry point
    │   ├── Footer.jsx          # Bottom site summary columns
    │   ├── shared/             # Generic components (DataTable, DeleteConfirmModal)
    │   └── ...                 # Landing page content modules (Hero, TopBrands, etc.)
    └── pages/                  # Page route components
        ├── Home.jsx            # Landing page layout
        ├── Auth.jsx            # Dynamic OTP verification registration & login
        ├── Shop.jsx            # Dynamic product catalogs, filter blocks & pages
        ├── ProductDetail.jsx   # Description, reviews, variants picker
        ├── admin/              # Administrator dashboard & sub-components
        ├── vendor/             # Approved store owner portal & variant managers
        ├── service_provider/   # Salon booking controls & services managers
        └── educator/           # Curriculum & tutorials builders
```

---

## 3. Route Map & Protection Guards
All routes are parsed inside [App.jsx](file:///e:/office%20project/WAKEUPMAKEUP/src/App.jsx).

### Public Routes
*   `/` -> Home Landing Page ([Home.jsx](file:///e:/office%20project/WAKEUPMAKEUP/src/pages/Home.jsx))
*   `/auth` -> Sign In / Sign Up OTP wizard ([Auth.jsx](file:///e:/office%20project/WAKEUPMAKEUP/src/pages/Auth.jsx))
*   `/shop` -> E-commerce products list ([Shop.jsx](file:///e:/office%20project/WAKEUPMAKEUP/src/pages/Shop.jsx))
*   `/product/:id` -> Single product specs ([ProductDetail.jsx](file:///e:/office%20project/WAKEUPMAKEUP/src/pages/ProductDetail.jsx))
*   `/booking` or `/services` -> Beauty service booking list
*   `/academy` -> E-learning course list

### Protected Routes (Role-Based Guards)
Dashboard routes are wrapped with `<RoleGuard allowedRoles={['role_name']}>` to restrict access:
*   **Admin Panel:** `/admin/*` (Requires role: `'admin'`) -> [AdminPanel.jsx](file:///e:/office%20project/WAKEUPMAKEUP/src/pages/admin/AdminPanel.jsx)
*   **Vendor Dashboard:** `/vendor/dashboard` (Requires roles: `'vendor'`, `'admin'`) -> [VendorDashboard.jsx](file:///e:/office%20project/WAKEUPMAKEUP/src/pages/vendor/VendorDashboard.jsx)
*   **Influencer Dashboard:** `/influencer/dashboard` (Requires roles: `'influencer'`, `'admin'`) -> [InfluencerDashboard.jsx](file:///e:/office%20project/WAKEUPMAKEUP/src/pages/InfluencerDashboard.jsx)
*   **Distributor Dashboard:** `/distributor/dashboard` (Requires roles: `'distributor'`, `'admin'`) -> [DistributorDashboard.jsx](file:///e:/office%20project/WAKEUPMAKEUP/src/pages/DistributorDashboard.jsx)
*   **Service Provider Panel:** `/service-provider/dashboard` (Requires roles: `'service_provider'`, `'admin'`) -> [ServiceProviderPanel.jsx](file:///e:/office%20project/WAKEUPMAKEUP/src/pages/service_provider/ServiceProviderPanel.jsx)
*   **Educator Dashboard:** `/educator/dashboard` (Requires roles: `'educator'`, `'admin'`) -> [EducatorDashboard.jsx](file:///e:/office%20project/WAKEUPMAKEUP/src/pages/educator/EducatorDashboard.jsx)

---

## 4. User Dashboards & Core Modules

### ⚙️ Admin Panel
*   **Access:** `['admin']`
*   **Core Modules:** 
    *   *Dashboard Analytics:* Revenue metrics, categories performance, order status charts.
    *   *User Control:* List, search, ban/unban, and remove user accounts.
    *   *Partner Onboarding:* Review and accept or reject pending Vendor and Educator profiles.
    *   *Coupon Engine:* Manage promo codes (assign to influencers, set discount values, usage limits).
    *   *Influencer Commission Slabs:* Create tiered sales thresholds and commission percentage mappings.
    *   *Page Content Builder:* Live customizers for landing page banners, carousels, and promos.

### 🏬 Vendor Dashboard
*   **Access:** `['vendor', 'admin']`
*   **Core Modules:**
    *   *Dynamic Analytics:* Monthly store revenue counters, order tracking, and charts.
    *   *Products Catalog:* Create and update products; configure multi-variant options (prices, dimensions, weights, SKU codes, variant-specific images).
    *   *Order Fulfillment:* Manage order pipelines, enter shipping tracking IDs, and download store invoices as CSV files.

### 📣 Influencer Dashboard
*   **Access:** `['influencer', 'admin']`
*   **Core Modules:**
    *   *Referral Link copying:* Auto-generates unique affiliate codes.
    *   *Stats Tracker:* Balance counters, clicks analytics, conversion rates, and earnings.
    *   *Campaign Catalog:* Browse active product campaigns with commission percentages.
    *   *Content Submission:* Submit social URLs (Instagram, YouTube, TikTok) for verification.

### 🚛 Distributor Dashboard
*   **Access:** `['distributor', 'admin']`
*   **Core Modules:**
    *   *Bulk Order Wizard:* Automated tiered wholesale pricing (e.g. 15% discount for 50-100 units, 40% for 500+).
    *   *Stock Pre-orders:* Reserve upcoming inventory blocks for out-of-stock items.

### 💅 Service Provider Panel
*   **Access:** `['service_provider', 'admin']`
*   **Core Modules:**
    *   *Onboarding Form:* Set parlor name, address, bio details, and business license validations.
    *   *Services Catalog:* List salon services, durations, and pricing.
    *   *Staff Roster:* Add and assign specialist technicians.
    *   *Availability Blocks:* Set weekly rest days and daily appointment timeslots.

### 🎓 Educator Dashboard
*   **Access:** `['educator', 'admin']`
*   **Core Modules:**
    *   *Course Constructor:* Upload tutorials, set difficulty levels (Beginner, Intermediate, Expert), languages, and pricing.
    *   *Lesson Manager:* Organize curriculum structures and links to video URLs.
    *   *Earnings Summary:* Keep track of total student enrollments and reviews.

---

## 5. API Integration Mapping & Data Flows
All Axios endpoints are configured relative to `config.API_URL` (located in [config.js](file:///e:/office%20project/WAKEUPMAKEUP/src/config/config.js)):
*   **Register & Login:** Handled via OTP validation routes (`/auth/register`, `/auth/verify-login-otp`).
*   **Authentication Token Header:** Automatically managed by the interceptor in [apiClient.js](file:///e:/office%20project/WAKEUPMAKEUP/src/api/apiClient.js) using the `Authorization: Bearer <token>` schema.
*   **Product Catalogs:** Mapped directly to backend models.
*   *Note:* Wallet withdrawals, influencer campaign validation endpoints, and distributor wholesale checkouts currently run on mock data flows.

---

## 6. Development Rules & Guidelines
Before modifying any files, always run through this safety checklist:
1.  **Read and Check this context file (`PROJECT_CONTEXT.md`) first.**
2.  Identify all files impacted by your planned code updates.
3.  Cross-reference changes with existing implementations to avoid duplicate code.
4.  Reuse existing shared components (e.g., `DataTable`, `DeleteConfirmModal`).
5.  Maintain compatibility with existing Axios configurations in `src/api/` and global Context states.
6.  Assess and explain the side effects of your modifications before writing code.

---

## 7. Current Development Status

### Completed:
- Admin Dashboard API Integration
- Vendor Dashboard API Integration
- Coupon Management APIs
- Category CRUD APIs
- User Management APIs
- Vendor Management APIs
- Service Provider CRUD APIs
- Staff CRUD APIs
- Educator Dashboard APIs
- Checkout APIs
- Cart APIs
- Profile Order APIs
- Wallet Balance API Integration
- Wallet Transactions API Integration
- Wallet Context & Global State Management
- Navbar Wallet Indicators (Desktop, Mobile, Role-filtered)
- Checkout "Pay using Wallet" Payment Integration (Automatic COD Charge Bypass)
- Add Wallet Balance API & UI Dialog Integration
- Vendor Wallet Balance API & Dashboard Widgets Integration
- Dynamic Category Strip & Sidebar Filter API Integration (`/admin-public/categories`)
- Dynamic Brand Strip & Ticker Carousel Filter API Integration (`/public-user/brands`) with edge-to-edge logo layout (16:9 ratio, no padding gaps)
- Top Selling Products 4-Card Single Row Grid API Integration (`/public-user/top-selling-products`) with `max-w-[1600px]` layout
- Top Trending Products 4-Card Single Row Grid API Integration (`/public-user/trending-products`) with `max-w-[1600px]` layout
- Corner and Spacing Layout refinements on Shop product cards & Brand carousel cards to ensure edge-to-edge image covering (no gaps)
- Admin Panel Cashback Slabs Management Tab Integration (`/wallet/admin/cashback-slabs/list-cashback-slab` & `/wallet/admin/cashback-slabs/add-cashback-slab`) with complete CRUD operations (list, create, update, delete) and details modal
- Full Product Card Clickable Navigation across all catalogs (Best Sellers, Top Selling, Top Trending, and Shop pages) with event propagation handles for wishlist and checkout actions
- Fixed shopping bag and checkout currency presentation precision bug to round and limit prices to exactly 2 decimal places, avoiding floating-point precision display leakage (e.g. `₹148.76999999999998`)



### Pending:
- Booking Module
- Influencer Real APIs
- Distributor Real APIs
- Wallet Withdrawals
- Bulk Payout Processing
