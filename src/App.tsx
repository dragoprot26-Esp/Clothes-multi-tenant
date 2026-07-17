import React, { useState, useEffect } from 'react';
import { 
  INITIAL_TENANTS, INITIAL_PRODUCTS, INITIAL_COMMENTS, 
  INITIAL_COLLABORATORS, DEFAULT_CATEGORIES, generateMockDeliveries
} from './mockData';
import { TenantConfig, Product, Comment, Collaborator, CartItem, Delivery, RetiroOrder } from './types';
import Header from './components/Header';
import Banner from './components/Banner';
import CategoryMenu from './components/CategoryMenu';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import FooterComments from './components/FooterComments';
import AdminLoginModal from './components/AdminLoginModal';
import AdminPanel from './components/AdminPanel';
import ProductDetailsModal from './components/ProductDetailsModal';
import { cloudLoad, cloudSave, clotPublica, clotAgregarPedido, clotAgregarResena, CloudData } from './lib/cloud';
import { Sparkles, MapPin, X, Info } from 'lucide-react';

export default function App() {
  // --- CORE STATE ---
  const [tenants, setTenants] = useState<TenantConfig[]>([]);
  const [activeTenantId, setActiveTenantId] = useState('cyc-elegance');
  const [cloudCodigo, setCloudCodigo] = useState<string | null>(null);
  const [retiroOrders, setRetiroOrders] = useState<RetiroOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState('Todos');

  // View States
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isPublicPreviewActive, setIsPublicPreviewActive] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Enlarge details modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Specific tenant cart item state map (tenantId -> CartItem[])
  const [carts, setCarts] = useState<Record<string, CartItem[]>>({});
  
  // Deliveries & logged-in admin/collaborator profile state
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<{
    id?: string;
    name: string;
    role: 'admin' | 'collaborator';
    email: string;
    isAdmin2?: boolean;
  } | null>(null);
  
  // Modal alerts
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // --- INITIALIZE FROM LOCAL STORAGE ---
  useEffect(() => {
    // Tenants
    const localTenants = localStorage.getItem('cyc_pwa_tenants');
    if (localTenants) {
      setTenants(JSON.parse(localTenants));
    } else {
      setTenants(INITIAL_TENANTS);
      localStorage.setItem('cyc_pwa_tenants', JSON.stringify(INITIAL_TENANTS));
    }

    // Products
    const localProducts = localStorage.getItem('cyc_pwa_products');
    if (localProducts) {
      setProducts(JSON.parse(localProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('cyc_pwa_products', JSON.stringify(INITIAL_PRODUCTS));
    }

    // Comments
    const localComments = localStorage.getItem('cyc_pwa_comments');
    if (localComments) {
      setComments(JSON.parse(localComments));
    } else {
      setComments(INITIAL_COMMENTS);
      localStorage.setItem('cyc_pwa_comments', JSON.stringify(INITIAL_COMMENTS));
    }

    // Collaborators
    const localCollabs = localStorage.getItem('cyc_pwa_collaborators');
    if (localCollabs) {
      setCollaborators(JSON.parse(localCollabs));
    } else {
      setCollaborators(INITIAL_COLLABORATORS);
      localStorage.setItem('cyc_pwa_collaborators', JSON.stringify(INITIAL_COLLABORATORS));
    }

    // Categories
    const localCats = localStorage.getItem('cyc_pwa_categories');
    if (localCats) {
      setCategories(JSON.parse(localCats));
    } else {
      setCategories(DEFAULT_CATEGORIES);
      localStorage.setItem('cyc_pwa_categories', JSON.stringify(DEFAULT_CATEGORIES));
    }

    // Load active tenant cart
    const localCarts = localStorage.getItem('cyc_pwa_carts');
    if (localCarts) {
      setCarts(JSON.parse(localCarts));
    }

    // Deliveries
    const localDeliveries = localStorage.getItem('cyc_pwa_deliveries');
    if (localDeliveries) {
      setDeliveries(JSON.parse(localDeliveries));
    } else {
      const generated = generateMockDeliveries(localProducts ? JSON.parse(localProducts) : INITIAL_PRODUCTS);
      setDeliveries(generated);
      localStorage.setItem('cyc_pwa_deliveries', JSON.stringify(generated));
    }
  }, []);

  // --- PÁGINA PÚBLICA POR ?codigo= (molde CyC) ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codigo = (params.get('codigo') || params.get('tenant') || '').toUpperCase();
    if (!codigo) return;
    clotPublica(codigo).then((data) => {
      if (!data) return;
      if (data.tenants && data.tenants.length) {
        const cloudTenants = data.tenants as TenantConfig[];
        setTenants((prev) => {
          const otros = prev.filter((t) => !cloudTenants.some((ct) => ct.id === t.id));
          return [...cloudTenants, ...otros];
        });
      }
      if (data.products) setProducts(data.products as Product[]);
      if (data.comments) setComments(data.comments as Comment[]);
      if (data.categories && data.categories.length) setCategories(data.categories as string[]);
      setActiveTenantId(codigo);
      setIsAdminLoggedIn(false);
    });
  }, []);

  // Monitor force logout of collaborators in real-time
  useEffect(() => {
    if (loggedInUser && loggedInUser.role === 'collaborator' && loggedInUser.id) {
      const currentCollab = collaborators.find(c => c.id === loggedInUser.id);
      if (currentCollab?.forceLogout) {
        alert(`Tu sesión fue cerrada a distancia por seguridad.`);
        setIsAdminLoggedIn(false);
        setLoggedInUser(null);
        setIsPublicPreviewActive(false);
        // Reset the forceLogout flag so they can log in normally later
        const updated = collaborators.map(c => c.id === loggedInUser.id ? { ...c, forceLogout: false } : c);
        saveCollaborators(updated);
      }
    }
  }, [collaborators, loggedInUser]);

  // --- SAVE STATE WRAPPERS ---
  const saveDeliveries = (updated: Delivery[]) => {
    setDeliveries(updated);
    localStorage.setItem('cyc_pwa_deliveries', JSON.stringify(updated));
  };
  const saveTenants = (updated: TenantConfig[]) => {
    setTenants(updated);
    localStorage.setItem('cyc_pwa_tenants', JSON.stringify(updated));
  };

  const saveProducts = (updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem('cyc_pwa_products', JSON.stringify(updated));
  };

  const saveComments = (updated: Comment[]) => {
    setComments(updated);
    localStorage.setItem('cyc_pwa_comments', JSON.stringify(updated));
  };

  const saveCollaborators = (updated: Collaborator[]) => {
    setCollaborators(updated);
    localStorage.setItem('cyc_pwa_collaborators', JSON.stringify(updated));
  };

  const saveCarts = (updatedCarts: Record<string, CartItem[]>) => {
    setCarts(updatedCarts);
    localStorage.setItem('cyc_pwa_carts', JSON.stringify(updatedCarts));
  };

  const saveCategories = (updatedCats: string[]) => {
    setCategories(updatedCats);
    localStorage.setItem('cyc_pwa_categories', JSON.stringify(updatedCats));
  };

  // Get active tenant details
  const activeTenant = tenants.find((t) => t.id === activeTenantId) || INITIAL_TENANTS[0];
  const activeCart = carts[activeTenantId] || [];

  // Reset category filters when switching tenants
  const handleSelectTenant = (id: string) => {
    setActiveTenantId(id);
    setActiveCategory('Todos');
    setIsAdminLoggedIn(false); // Log out active admin session on switcher change
    setIsPublicPreviewActive(false);
    setCloudCodigo(null);
  };

  // --- LOGIN + NUBE (molde CyC) ---
  const handleLoginSuccess = (user: { id?: string; name: string; role: 'admin' | 'collaborator'; email: string; isAdmin2?: boolean; codigo?: string }) => {
    setIsAdminLoggedIn(true);
    setLoggedInUser({ id: user.id, name: user.name, role: user.role, email: user.email, isAdmin2: user.isAdmin2 });
    const codigo = (user.codigo || '').toUpperCase();
    if (!codigo) return;
    setCloudCodigo(codigo);
    cloudLoad(codigo).then((data) => {
      const tieneDatos = !!(data && ((data.products && data.products.length) || (data.tenants && data.tenants.length) || (data.collaborators && data.collaborators.length)));
      if (tieneDatos && data) {
        if (data.tenants && data.tenants.length) {
          const cloudTenants = data.tenants as TenantConfig[];
          const otros = tenants.filter((t) => !cloudTenants.some((ct) => ct.id === t.id));
          saveTenants([...cloudTenants, ...otros]);
        }
        if (data.products) saveProducts(data.products as Product[]);
        if (data.comments) saveComments(data.comments as Comment[]);
        if (data.collaborators) saveCollaborators(data.collaborators as Collaborator[]);
        if (data.deliveries) saveDeliveries(data.deliveries as Delivery[]);
        if (data.categories) saveCategories(data.categories as string[]);
        if (data.retiroOrders) setRetiroOrders(data.retiroOrders as RetiroOrder[]);
        setActiveTenantId(codigo);
      } else {
        // Licencia nueva: clonamos la tienda activa como tienda de esta licencia
        const base = tenants.find((t) => t.id === activeTenantId) || INITIAL_TENANTS[0];
        const nuevo: TenantConfig = { ...base, id: codigo, licenseKey: codigo };
        saveTenants([nuevo, ...tenants.filter((t) => t.id !== codigo)]);
        setActiveTenantId(codigo);
      }
    });
  };

  // Autosave a la nube (sincroniza entre dispositivos) — debounce 1.5s
  useEffect(() => {
    if (!cloudCodigo || !isAdminLoggedIn) return;
    const t = setTimeout(() => {
      const datos: CloudData = {
        tenants: tenants.filter((t) => t.id === cloudCodigo),
        products: products.filter((p) => p.tenantId === cloudCodigo),
        comments: comments.filter((c) => c.tenantId === cloudCodigo),
        collaborators: collaborators.filter((c) => c.tenantId === cloudCodigo),
        deliveries: deliveries.filter((d) => d.tenantId === cloudCodigo),
        categories,
        retiroOrders: retiroOrders.filter((o) => o.tenantId === cloudCodigo),
      };
      cloudSave(cloudCodigo, datos);
    }, 1500);
    return () => clearTimeout(t);
  }, [cloudCodigo, isAdminLoggedIn, tenants, products, comments, collaborators, deliveries, categories, retiroOrders]);

  // Poll de encargos entrantes (sincroniza pública -> panel) cada 12s
  useEffect(() => {
    if (!cloudCodigo || !isAdminLoggedIn) return;
    const iv = setInterval(() => {
      cloudLoad(cloudCodigo).then((data) => {
        if (data && data.retiroOrders) {
          setRetiroOrders((prev) => {
            const ids = new Set(prev.map((o) => o.id));
            const nuevos = (data.retiroOrders as RetiroOrder[]).filter((o) => !ids.has(o.id));
            return nuevos.length ? [...nuevos, ...prev] : prev;
          });
        }
        if (data && data.comments) {
          setComments((prev) => {
            const ids = new Set(prev.map((c) => c.id));
            const nuevos = (data.comments as Comment[]).filter((c) => !ids.has(c.id));
            return nuevos.length ? [...prev, ...nuevos] : prev;
          });
        }
      });
    }, 12000);
    return () => clearInterval(iv);
  }, [cloudCodigo, isAdminLoggedIn]);

  // Cliente confirma un encargo desde la pública -> lo guarda en la nube
  const handlePlaceOrder = (order: RetiroOrder) => {
    if (!activeTenantId) return;
    clotAgregarPedido(activeTenantId, order);
    setRetiroOrders((prev) => [order, ...prev]);
  };

  const handleMarkDelivered = (id: string) => {
    setRetiroOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'entregado' } : o)));
  };

  // --- CART MUTATIONS ---
  const handleAddToCart = (product: Product, size = 'M') => {
    const updatedCart = [...activeCart];
    const existingIndex = updatedCart.findIndex(
      (item) => item.product.id === product.id && item.size === size
    );

    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart.push({ product, quantity: 1, size });
    }

    const nextCarts = { ...carts, [activeTenantId]: updatedCart };
    saveCarts(nextCarts);
  };

  const handleUpdateCartQuantity = (productId: string, size: string, delta: number) => {
    const updatedCart = activeCart
      .map((item) => {
        if (item.product.id === productId && item.size === size) {
          const nextQty = item.quantity + delta;
          return { ...item, quantity: Math.max(1, nextQty) };
        }
        return item;
      });

    const nextCarts = { ...carts, [activeTenantId]: updatedCart };
    saveCarts(nextCarts);
  };

  const handleRemoveCartItem = (productId: string, size: string) => {
    const updatedCart = activeCart.filter(
      (item) => !(item.product.id === productId && item.size === size)
    );
    const nextCarts = { ...carts, [activeTenantId]: updatedCart };
    saveCarts(nextCarts);
  };

  const handleClearCart = () => {
    const nextCarts = { ...carts, [activeTenantId]: [] };
    saveCarts(nextCarts);
  };

  // --- COMMENTS MUTATIONS ---
  const handleAddComment = (author: string, text: string, rating: number) => {
    const newComment: Comment = {
      id: `c-new-${Date.now()}`,
      tenantId: activeTenantId,
      author,
      text,
      rating,
      date: new Date().toLocaleDateString('es-AR'),
      approved: false // Must be approved by the admin!
    };
    saveComments([...comments, newComment]);
    if (activeTenantId) clotAgregarResena(activeTenantId, newComment);
  };

  // --- ADMIN ACTIONS ---
  const handleUpdateTenant = (updatedTenant: TenantConfig) => {
    const updatedList = tenants.map((t) => (t.id === updatedTenant.id ? updatedTenant : t));
    saveTenants(updatedList);
  };

  const handleAddProduct = (newProd: Omit<Product, 'id' | 'tenantId'>) => {
    const product: Product = {
      ...newProd,
      id: `p-new-${Date.now()}`,
      tenantId: activeTenantId
    };
    saveProducts([...products, product]);
  };

  const handleEditProduct = (editedProd: Product) => {
    const updated = products.map((p) => (p.id === editedProd.id ? editedProd : p));
    saveProducts(updated);
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    saveProducts(updated);
  };

  const handleApproveComment = (commentId: string) => {
    const updated = comments.map((c) => (c.id === commentId ? { ...c, approved: true } : c));
    saveComments(updated);
  };

  const handleRejectComment = (commentId: string) => {
    const updated = comments.filter((c) => c.id !== commentId);
    saveComments(updated);
  };

  const handleAddCollaborator = (newCollab: Omit<Collaborator, 'id' | 'tenantId'>) => {
    const collaborator: Collaborator = {
      ...newCollab,
      id: `col-new-${Date.now()}`,
      tenantId: activeTenantId
    };
    saveCollaborators([...collaborators, collaborator]);
  };

  const handleDeleteCollaborator = (collabId: string) => {
    const updated = collaborators.filter((col) => col.id !== collabId);
    saveCollaborators(updated);
  };

  const handleEditCollaborator = (editedCollab: Collaborator) => {
    const updated = collaborators.map((col) => col.id === editedCollab.id ? editedCollab : col);
    saveCollaborators(updated);
  };

  const handleAddCategory = (categoryName: string) => {
    if (categories.includes(categoryName)) return;
    const updated = [...categories, categoryName];
    saveCategories(updated);
  };

  const handleDeleteCategory = (categoryName: string) => {
    if (['Todos', 'Promo', 'Ofertas'].includes(categoryName)) return; // Prevent deleting core tabs
    const updated = categories.filter((cat) => cat !== categoryName);
    saveCategories(updated);
    if (activeCategory === categoryName) {
      setActiveCategory('Todos');
    }
  };

  // --- FILTER PRODUCT LOGIC ---
  const filteredProducts = products.filter((p) => {
    if (p.tenantId !== activeTenantId) return false;
    if (activeCategory === 'Todos') return true;
    if (activeCategory === 'Promo') return p.isPromo;
    if (activeCategory === 'Ofertas') return p.isOffer;
    return p.category === activeCategory;
  });

  return (
    <div 
      id="app-wrapper"
      className="min-h-screen flex flex-col font-sans transition-colors duration-300"
      style={{ backgroundColor: activeTenant.theme.backgroundColor }}
    >

      {/* RENDER VIEW: PUBLIC OR ADMIN PANEL */}
      {isAdminLoggedIn && !isPublicPreviewActive ? (
        /* ADMIN PANEL VIEW ("Al molde de Cyc-admin") */
        <AdminPanel
          tenant={activeTenant}
          products={products}
          comments={comments}
          collaborators={collaborators}
          categories={categories}
          deliveries={deliveries}
          retiroOrders={retiroOrders}
          onMarkDelivered={handleMarkDelivered}
          loggedInUser={loggedInUser || { name: 'Admin Inquilino', role: 'admin', email: 'admin@cyc.com' }}
          onClearDeliveries={saveDeliveries}
          onAddDelivery={(newDel) => {
            const delivery: Delivery = {
              ...newDel,
              id: `del-new-${Date.now()}`
            };
            saveDeliveries([...deliveries, delivery]);
          }}
          onLogout={() => {
            setIsAdminLoggedIn(false);
            setLoggedInUser(null);
            setIsPublicPreviewActive(false);
          }}
          onUpdateTenant={handleUpdateTenant}
          onAddProduct={handleAddProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onApproveComment={handleApproveComment}
          onRejectComment={handleRejectComment}
          onAddCollaborator={handleAddCollaborator}
          onDeleteCollaborator={handleDeleteCollaborator}
          onEditCollaborator={handleEditCollaborator}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onTogglePublicPreview={() => setIsPublicPreviewActive(true)}
        />
      ) : (
        /* PUBLIC PAGE VIEW */
        <div id="public-ecommerce-page" className="flex-1 flex flex-col">
          {isPublicPreviewActive && (
            <div 
              id="admin-preview-banner" 
              className="sticky top-0 z-50 bg-amber-500 text-black px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-lg animate-fadeIn text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                <span className="font-bold uppercase tracking-wider">Modo Vista Previa de la Página Pública</span>
                <span className="hidden md:inline text-[11px] opacity-75">| Mira en tiempo real los cambios realizados en el panel.</span>
              </div>
              <button
                id="btn-admin-preview-exit"
                onClick={() => setIsPublicPreviewActive(false)}
                className="px-4 py-1.5 rounded-lg bg-black hover:bg-zinc-900 text-amber-500 font-extrabold uppercase tracking-wide flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
              >
                <span>Regresar al Panel Admin</span>
              </button>
            </div>
          )}

          {/* Header */}
          <Header
            tenant={activeTenant}
            cart={activeCart}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenAdminLogin={() => setIsLoginModalOpen(true)}
            onOpenLocation={() => setLocationModalOpen(true)}
          />

          {/* Banner Hero */}
          <Banner tenant={activeTenant} />

          {/* Categories Slider Navigation bar */}
          <CategoryMenu
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            tenant={activeTenant}
          />

          {/* Main Products Grid */}
          <main id="main-public-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 
                  id="section-category-title"
                  className="font-sans font-extrabold text-2xl uppercase tracking-wider"
                  style={{ color: activeTenant.theme.textColor }}
                >
                  {activeCategory === 'Todos' ? 'Nuestra Colección' : activeCategory}
                </h2>
                <p className="text-xs text-gray-400 mt-1">Prendas premium confeccionadas bajo estrictos controles de calidad.</p>
              </div>

              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                {filteredProducts.length} Prenda(s)
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div 
                className="py-16 text-center rounded-2xl border border-dashed text-gray-400 font-medium"
                style={{ borderColor: `${activeTenant.theme.primaryColor}20` }}
              >
                No hay prendas disponibles en esta categoría de momento.
              </div>
            ) : (
              <div id="product-cards-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    tenant={activeTenant}
                    onAddToCart={handleAddToCart}
                    onSelectProduct={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </main>

          {/* Customer Reviews & Feedback Form Footer */}
          <FooterComments
            tenant={activeTenant}
            comments={comments}
            onSubmitComment={handleAddComment}
          />
        </div>
      )}

      {/* --- MODALS & DRAWERS --- */}

      {/* Shopping Basket Drawer Slider */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={activeCart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        tenant={activeTenant}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Secure Shield Admin Portal Verification Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        tenant={activeTenant}
        collaborators={collaborators}
        onLoginSuccess={handleLoginSuccess}
        onEditCollaborator={handleEditCollaborator}
      />

      {/* Enlarge Product Details Carousel Modal */}
      <ProductDetailsModal
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        tenant={activeTenant}
        onAddToCart={(prod, size) => {
          handleAddToCart(prod, size);
          setSelectedProduct(null);
        }}
      />

      {/* Location Modal Alert */}
      {locationModalOpen && (
        <div id="location-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setLocationModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" />
          <div 
            className="relative p-6 sm:p-8 rounded-3xl border w-full max-w-md text-center flex flex-col gap-5 shadow-2xl animate-scaleUp"
            style={{ 
              backgroundColor: activeTenant.theme.cardColor, 
              borderColor: activeTenant.theme.primaryColor,
              color: activeTenant.theme.textColor
            }}
          >
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-amber-500/10 border" style={{ borderColor: activeTenant.theme.primaryColor }}>
              <MapPin className="w-6 h-6 text-amber-500" style={{ color: activeTenant.theme.primaryColor }} />
            </div>

            <div>
              <h3 className="font-sans font-black text-lg uppercase tracking-wider">Dirección de la Sucursal</h3>
              <p className="text-xs text-gray-400 mt-1">Visítanos o encarga retiros presenciales en:</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 font-bold text-sm">
              {activeTenant.location}
            </div>

            <p className="text-[10px] text-gray-500 leading-relaxed">
              * El horario de atención general es de Lunes a Sábado de 09:00 a 20:00 hrs.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 justify-center mt-2">
              <a
                id="btn-open-google-maps"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeTenant.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-5 rounded-xl font-bold text-xs uppercase hover:scale-105 cursor-pointer transition-all flex items-center justify-center gap-1.5 border border-white/10 bg-white/5 text-center"
                style={{ color: activeTenant.theme.textColor }}
              >
                <MapPin className="w-3.5 h-3.5 text-red-500 animate-bounce" />
                <span>Abrir en Google Maps</span>
              </a>

              <button
                id="btn-close-location-modal"
                onClick={() => setLocationModalOpen(false)}
                className="py-2.5 px-6 rounded-xl font-bold text-xs uppercase hover:scale-105 cursor-pointer transition-all"
                style={{ backgroundColor: activeTenant.theme.primaryColor, color: '#000000' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
