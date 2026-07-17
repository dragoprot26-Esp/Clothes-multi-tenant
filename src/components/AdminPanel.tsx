import React, { useState } from 'react';
import { 
  Package, Palette, LayoutGrid, Users, Settings, TrendingUp, 
  Plus, Trash2, Edit, Check, X, Shield, Star, LogOut, Image, MapPin, Phone, Instagram, Scan, PlusCircle, MinusCircle, Upload, Eye, MessageSquare,
  Download, FileSpreadsheet, Trash, Calendar, DollarSign, UserCheck, Fingerprint, User, Database, Printer, RefreshCw, ShoppingBag
} from 'lucide-react';
import { TenantConfig, Product, Comment, Collaborator, Delivery, RetiroOrder } from '../types';
import BarcodeScannerModal from './BarcodeScannerModal';

interface AdminPanelProps {
  tenant: TenantConfig;
  products: Product[];
  comments: Comment[];
  collaborators: Collaborator[];
  categories: string[];
  deliveries: Delivery[];
  retiroOrders: RetiroOrder[];
  onMarkDelivered?: (id: string) => void;
  loggedInUser: {
    name: string;
    role: 'admin' | 'collaborator';
    email: string;
    isAdmin2?: boolean;
  };
  onClearDeliveries: (updated: Delivery[]) => void;
  onAddDelivery: (delivery: Omit<Delivery, 'id'>) => void;
  onLogout: () => void;
  onUpdateTenant: (updatedTenant: TenantConfig) => void;
  onAddProduct: (product: Omit<Product, 'id' | 'tenantId'>) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onApproveComment: (commentId: string) => void;
  onRejectComment: (commentId: string) => void;
  onAddCollaborator: (collaborator: Omit<Collaborator, 'id' | 'tenantId'>) => void;
  onDeleteCollaborator: (collaboratorId: string) => void;
  onEditCollaborator: (collaborator: Collaborator) => void;
  onAddCategory: (categoryName: string) => void;
  onDeleteCategory: (categoryName: string) => void;
  onTogglePublicPreview: () => void;
}

export default function AdminPanel({
  tenant,
  products,
  comments,
  collaborators,
  categories,
  deliveries,
  retiroOrders,
  onMarkDelivered,
  loggedInUser,
  onClearDeliveries,
  onAddDelivery,
  onLogout,
  onUpdateTenant,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onApproveComment,
  onRejectComment,
  onAddCollaborator,
  onDeleteCollaborator,
  onEditCollaborator,
  onAddCategory,
  onDeleteCategory,
  onTogglePublicPreview
}: AdminPanelProps) {
  // Tabs: 'products' | 'orders' | 'comments' | 'pagetheme' | 'admintheme' | 'dashboard' | 'collabs' | 'config'
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'comments' | 'pagetheme' | 'admintheme' | 'dashboard' | 'collabs' | 'config'>('dashboard');

  // Product addition state
  const [showAddProdModal, setShowAddProdModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodCategory, setProdCategory] = useState(categories[1] || 'Remeras');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  
  // Enriched product states
  const [prodImageUrls, setProdImageUrls] = useState<string[]>([]);
  const [prodSizes, setProdSizes] = useState<string[]>([]);
  const [prodExtraFields, setProdExtraFields] = useState<{ name: string; value: string }[]>([]);
  const [prodBarcode, setProdBarcode] = useState('');
  
  const [prodIsPromo, setProdIsPromo] = useState(false);
  const [prodIsOffer, setProdIsOffer] = useState(false);
  const [prodStock, setProdStock] = useState(10);

  // Scanner status state
  const [showScanner, setShowScanner] = useState(false);

  // Theme states
  const [tenantName, setTenantName] = useState(tenant.name);
  const [tenantSlogan, setTenantSlogan] = useState(tenant.slogan);
  const [tenantLogoUrl, setTenantLogoUrl] = useState(tenant.logoUrl);
  const [tenantBannerUrl, setTenantBannerUrl] = useState(tenant.bannerUrl);
  const [tenantBannerLayout, setTenantBannerLayout] = useState(tenant.bannerLayout);
  
  // Color configuration states
  const [primaryColor, setPrimaryColor] = useState(tenant.theme.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(tenant.theme.secondaryColor);
  const [backgroundColor, setBackgroundColor] = useState(tenant.theme.backgroundColor);
  const [cardColor, setCardColor] = useState(tenant.theme.cardColor);
  const [textColor, setTextColor] = useState(tenant.theme.textColor);
  const [accentColor, setAccentColor] = useState(tenant.theme.accentColor);

  // Collaborator states
  const [collabName, setCollabName] = useState('');
  const [collabRole, setCollabRole] = useState('Vendedor');
  const [collabEmail, setCollabEmail] = useState('');
  const [collabPhone, setCollabPhone] = useState('');
  const [collabUsername, setCollabUsername] = useState('');
  const [collabPassword, setCollabPassword] = useState('');
  const [collabIsAdmin2, setCollabIsAdmin2] = useState(false);
  const [collabProfileImage, setCollabProfileImage] = useState('');
  const [editingCollab, setEditingCollab] = useState<Collaborator | null>(null);

  // Configuration settings
  const [configLocation, setConfigLocation] = useState(tenant.location);
  const [configPhone, setConfigPhone] = useState(tenant.phone);
  const [configInstagram, setConfigInstagram] = useState(tenant.instagram);
  const [configLicenseKey, setConfigLicenseKey] = useState(tenant.licenseKey);

  // Extended Configuration settings
  const [ownerName, setOwnerName] = useState(tenant.ownerName || '');
  const [ownerPhone, setOwnerPhone] = useState(tenant.ownerPhone || '');
  const [ownerEmail, setOwnerEmail] = useState(tenant.ownerEmail || '');
  const [phonePrefix, setPhonePrefix] = useState(tenant.phonePrefix || '+549');
  const [language, setLanguage] = useState(tenant.language || 'es');

  // Password Recovery state
  const [enteredRecoveryCode, setEnteredRecoveryCode] = useState('');
  const [newOwnerPassword, setNewOwnerPassword] = useState('');
  const [confirmNewOwnerPassword, setConfirmNewOwnerPassword] = useState('');
  const [ownerPasswordChangeCode, setOwnerPasswordChangeCode] = useState('');
  const [isRecoveryCodeSent, setIsRecoveryCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Backup List state
  const [backupsList, setBackupsList] = useState<{ id: string; date: string; data: string }[]>(() => {
    const saved = localStorage.getItem(`cyc_backups_${tenant.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Countdown timer for password reset
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Category addition
  const [newCatName, setNewCatName] = useState('');

  // Quick manual delivery states
  const [quickDelProductId, setQuickDelProductId] = useState('');
  const [quickDelSize, setQuickDelSize] = useState('M');
  const [quickDelQuantity, setQuickDelQuantity] = useState(1);
  const [emptySalesOnExport, setEmptySalesOnExport] = useState(false);

  // Filter products for this tenant
  const tenantProducts = products.filter((p) => p.tenantId === tenant.id);
  const tenantComments = comments.filter((c) => c.tenantId === tenant.id);
  const tenantCollaborators = collaborators.filter((col) => col.tenantId === tenant.id);

  const pendingComments = tenantComments.filter((c) => !c.approved);
  const nuevosEncargos = retiroOrders.filter((o) => o.status !== 'entregado').length;
  const approvedCommentsCount = tenantComments.filter((c) => c.approved).length;

  // Handle barcode scan match or creation
  const handleScanSuccess = (barcode: string, existingProduct?: Product) => {
    if (existingProduct) {
      handleOpenEditProd(existingProduct);
    } else {
      handleOpenAddProd();
      setProdBarcode(barcode);
    }
  };

  // Handle open add product modal
  const handleOpenAddProd = () => {
    setEditingProduct(null);
    setProdName('');
    setProdPrice(0);
    setProdCategory(categories[1] || 'Remeras');
    setProdDescription('');
    setProdImageUrl('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=500');
    setProdImageUrls([
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=500',
      '', '', '', ''
    ]);
    setProdSizes(['S', 'M', 'L', 'XL']);
    setProdExtraFields([]);
    setProdBarcode('');
    setProdIsPromo(false);
    setProdIsOffer(false);
    setProdStock(10);
    setShowAddProdModal(true);
  };

  // Handle edit product trigger
  const handleOpenEditProd = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdPrice(prod.price);
    setProdCategory(prod.category);
    setProdDescription(prod.description);
    setProdImageUrl(prod.imageUrl);
    
    // Support multiple images (precargando los campos vacíos si tiene menos de 5)
    let urls = prod.imageUrls ? [...prod.imageUrls] : [prod.imageUrl];
    while (urls.length < 5) {
      urls.push('');
    }
    setProdImageUrls(urls.slice(0, 5));
    
    setProdSizes(prod.sizes || ['S', 'M', 'L', 'XL']);
    setProdExtraFields(prod.extraFields || []);
    setProdBarcode(prod.barcode || '');
    setProdIsPromo(prod.isPromo);
    setProdIsOffer(prod.isOffer);
    setProdStock(prod.stock);
    setShowAddProdModal(true);
  };

  // Save product (either new or edited)
  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) { alert('Poné el nombre de la prenda.'); return; }
    if (!prodPrice || prodPrice <= 0) { alert('Poné un precio válido (mayor a 0).'); return; }

    // Imagen: usa la subida/URL; si no hay ninguna, deja un placeholder (no bloquea el guardado)
    const activeImageUrls = prodImageUrls.filter((url) => url.trim() !== '');
    const mainImg = (prodImageUrl && prodImageUrl.trim()) || activeImageUrls[0] || 'https://via.placeholder.com/500x600?text=Prenda';

    if (editingProduct) {
      onEditProduct({
        ...editingProduct,
        name: prodName,
        price: prodPrice,
        category: prodCategory,
        description: prodDescription,
        imageUrl: mainImg,
        imageUrls: activeImageUrls.length > 0 ? activeImageUrls : [mainImg],
        sizes: prodSizes,
        extraFields: prodExtraFields,
        barcode: prodBarcode,
        isPromo: prodIsPromo,
        isOffer: prodIsOffer,
        stock: prodStock
      });
    } else {
      onAddProduct({
        name: prodName,
        price: prodPrice,
        category: prodCategory,
        description: prodDescription,
        imageUrl: mainImg,
        imageUrls: activeImageUrls.length > 0 ? activeImageUrls : [mainImg],
        sizes: prodSizes,
        extraFields: prodExtraFields,
        barcode: prodBarcode,
        isPromo: prodIsPromo,
        isOffer: prodIsOffer,
        stock: prodStock
      });
    }
    setShowAddProdModal(false);
  };

  // Convert uploaded image files to base64 strings and set state
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("La imagen es demasiado grande. Por favor elija una imagen menor a 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setTenantLogoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("La imagen es demasiado grande. Por favor elija una imagen menor a 3MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setTenantBannerUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle tenant settings updates (Page Theme & Layout)
  const handleSavePageTheme = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTenant({
      ...tenant,
      name: tenantName,
      slogan: tenantSlogan,
      logoUrl: tenantLogoUrl,
      bannerUrl: tenantBannerUrl,
      bannerLayout: tenantBannerLayout,
      theme: {
        ...tenant.theme,
        primaryColor,
        secondaryColor,
        backgroundColor,
        cardColor,
        textColor,
        accentColor
      }
    });
    alert('Configuración de tema y textos actualizada con éxito.');
  };

  // Save Config details
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTenant({
      ...tenant,
      location: configLocation,
      phone: configPhone,
      instagram: configInstagram,
      licenseKey: configLicenseKey,
      ownerName,
      ownerPhone,
      ownerEmail,
      phonePrefix,
      language
    });
    alert('Configuración de sucursal y seguridad guardada.');
  };

  // Create Backup
  const handleCreateBackup = () => {
    const newBackup = {
      id: `backup-${Date.now()}`,
      date: new Date().toLocaleDateString('es-AR') + ' ' + new Date().toLocaleTimeString('es-AR'),
      data: JSON.stringify({
        products: products,
        comments: comments,
        collaborators: collaborators,
        tenant: tenant,
        categories: categories,
        deliveries: deliveries
      })
    };

    let updatedBackups = [newBackup, ...backupsList];
    if (updatedBackups.length > 5) {
      updatedBackups = updatedBackups.slice(0, 5);
    }
    
    setBackupsList(updatedBackups);
    localStorage.setItem(`cyc_backups_${tenant.id}`, JSON.stringify(updatedBackups));
    alert('¡Copia de seguridad creada con éxito! Se conserva un máximo de 5 copias históricas.');
  };

  // Restore Backup
  const handleRestoreBackup = (backup: { id: string; date: string; data: string }) => {
    if (!confirm(`¿Está seguro de restaurar la copia de seguridad del ${backup.date}?\nSe reemplazarán todas las prendas, comentarios, colaboradores, entregas y configuraciones actuales.`)) {
      return;
    }
    try {
      const parsed = JSON.parse(backup.data);
      
      // Update local storage directly
      if (parsed.products) {
        localStorage.setItem('cyc_pwa_products', JSON.stringify(parsed.products));
      }
      if (parsed.comments) {
        localStorage.setItem('cyc_pwa_comments', JSON.stringify(parsed.comments));
      }
      if (parsed.collaborators) {
        localStorage.setItem('cyc_pwa_collaborators', JSON.stringify(parsed.collaborators));
      }
      if (parsed.tenant) {
        const localTenants = localStorage.getItem('cyc_pwa_tenants');
        if (localTenants) {
          const tenantsArray: TenantConfig[] = JSON.parse(localTenants);
          const updatedTenants = tenantsArray.map(t => t.id === tenant.id ? parsed.tenant : t);
          localStorage.setItem('cyc_pwa_tenants', JSON.stringify(updatedTenants));
        }
      }
      if (parsed.categories) {
        localStorage.setItem('cyc_pwa_categories', JSON.stringify(parsed.categories));
      }
      if (parsed.deliveries) {
        localStorage.setItem('cyc_pwa_deliveries', JSON.stringify(parsed.deliveries));
      }
      
      alert('¡Copia de seguridad restaurada con éxito! La página se recargará para aplicar todos los cambios.');
      window.location.reload();
    } catch (e) {
      alert('Error al restaurar la copia de seguridad.');
    }
  };

  // Delete Backup
  const handleDeleteBackup = (backupId: string) => {
    if (!confirm('¿Está seguro de eliminar esta copia de seguridad?')) return;
    const updated = backupsList.filter(b => b.id !== backupId);
    setBackupsList(updated);
    localStorage.setItem(`cyc_backups_${tenant.id}`, JSON.stringify(updated));
  };

  // Request password change code simulation
  const handleRequestPasswordCode = () => {
    if (!ownerEmail.trim()) {
      alert('Por favor ingrese un correo electrónico válido primero.');
      return;
    }
    // Generate a 6-digit verification code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setOwnerPasswordChangeCode(generatedCode);
    setIsRecoveryCodeSent(true);
    setCountdown(300); // 5 minutes
    
    // Show a neat mock email verification message
    alert(`[SIMULACIÓN DE ENVÍO DE EMAIL]\n\nSe ha enviado un correo a: ${ownerEmail}\n\nCódigo de Verificación: ${generatedCode}\n\nTiene un estimado de 5 minutos para ingresarlo.`);
  };

  // Confirm password change workflow
  const handleConfirmPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRecoveryCodeSent) {
      alert('Debe solicitar el código de cambio primero.');
      return;
    }
    if (countdown === 0) {
      alert('El código ha expirado (límite de 5 minutos). Por favor solicite uno nuevo.');
      return;
    }
    if (enteredRecoveryCode !== ownerPasswordChangeCode) {
      alert('El código ingresado es incorrecto.');
      return;
    }
    if (!newOwnerPassword) {
      alert('Por favor ingrese una nueva contraseña.');
      return;
    }
    if (newOwnerPassword !== confirmNewOwnerPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    // Success! Update password inside active tenant configuration
    onUpdateTenant({
      ...tenant,
      adminPassword: newOwnerPassword,
      location: configLocation,
      phone: configPhone,
      instagram: configInstagram,
      licenseKey: configLicenseKey,
      ownerName,
      ownerPhone,
      ownerEmail,
      phonePrefix,
      language
    });

    alert('Cambio hechos');
    // Force logout as requested
    onLogout();
  };

  // Print flyer QR
  const handlePrintQR = () => {
    const publicPageUrl = `${window.location.origin}/?codigo=${tenant.id}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(publicPageUrl)}`;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor permita las ventanas emergentes (popups) para poder imprimir el flyer en PDF.');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir QR - ${tenant.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background-color: #ffffff;
              color: #111111;
            }
            .flyer-container {
              width: 100%;
              max-width: 500px;
              border: 8px double #111111;
              padding: 50px 40px;
              text-align: center;
              box-sizing: border-box;
              margin: 20px;
              border-radius: 12px;
            }
            .store-name {
              font-size: 36px;
              font-weight: 900;
              text-transform: uppercase;
              margin-bottom: 25px;
              letter-spacing: 1px;
            }
            .qr-wrapper {
              margin: 30px auto;
              width: 250px;
              height: 250px;
              border: 1px solid #e2e8f0;
              padding: 10px;
              border-radius: 8px;
            }
            .qr-image {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            .legend {
              font-size: 18px;
              font-weight: 700;
              line-height: 1.5;
              margin-top: 25px;
              padding: 0 10px;
              color: #333333;
            }
            @media print {
              body {
                background: none;
              }
              .flyer-container {
                border: 8px double #000000;
                box-shadow: none;
                margin: 0;
                width: 100%;
                height: 100%;
                max-width: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div class="flyer-container">
            <div class="store-name">\${tenant.name}</div>
            <div class="qr-wrapper">
              <img src="\${qrUrl}" class="qr-image" alt="QR Code" />
            </div>
            <div class="legend">Escanee el QR y veras todas los productos y ofertas.</div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 600);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Apply Admin theme presets (Cyc Gold vs Cyber Modern vs Minimal Light)
  const applyAdminPreset = (preset: 'cyc-gold' | 'modern-dark' | 'sleek-light') => {
    let updatedTheme = { ...tenant.theme, adminTheme: preset };
    if (preset === 'cyc-gold') {
      updatedTheme.primaryColor = '#b3924e';
      updatedTheme.secondaryColor = '#1e1e1e';
      updatedTheme.backgroundColor = '#0d0d0d';
      updatedTheme.cardColor = '#161616';
      updatedTheme.textColor = '#ffffff';
      updatedTheme.accentColor = '#e0c068';
    } else if (preset === 'modern-dark') {
      updatedTheme.primaryColor = '#10b981';
      updatedTheme.secondaryColor = '#1e293b';
      updatedTheme.backgroundColor = '#0f172a';
      updatedTheme.cardColor = '#1e293b';
      updatedTheme.textColor = '#f8fafc';
      updatedTheme.accentColor = '#34d399';
    } else if (preset === 'sleek-light') {
      updatedTheme.primaryColor = '#065f46';
      updatedTheme.secondaryColor = '#f5f5f4';
      updatedTheme.backgroundColor = '#fafaf9';
      updatedTheme.cardColor = '#ffffff';
      updatedTheme.textColor = '#1c1917';
      updatedTheme.accentColor = '#059669';
    }
    
    // Set UI states for instant preview feedback
    setPrimaryColor(updatedTheme.primaryColor);
    setSecondaryColor(updatedTheme.secondaryColor);
    setBackgroundColor(updatedTheme.backgroundColor);
    setCardColor(updatedTheme.cardColor);
    setTextColor(updatedTheme.textColor);
    setAccentColor(updatedTheme.accentColor);

    onUpdateTenant({
      ...tenant,
      theme: updatedTheme
    });
  };

  // Handle collaborator profile image upload
  const handleCollabImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("La imagen es demasiado grande. Por favor elija una imagen menor a 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCollabProfileImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add or edit collaborator
  const handleSaveCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collabName || !collabUsername || !collabPassword) {
      alert('Por favor complete Nombre, Usuario y Contraseña.');
      return;
    }

    if (editingCollab) {
      onEditCollaborator({
        ...editingCollab,
        name: collabName,
        role: collabRole,
        email: collabEmail,
        phone: collabPhone,
        username: collabUsername,
        password: collabPassword,
        isAdmin2: collabIsAdmin2,
        profileImage: collabProfileImage
      });
      alert('¡Colaborador actualizado con éxito!');
      setEditingCollab(null);
    } else {
      onAddCollaborator({
        name: collabName,
        role: collabRole,
        email: collabEmail,
        phone: collabPhone,
        username: collabUsername,
        password: collabPassword,
        isAdmin2: collabIsAdmin2,
        profileImage: collabProfileImage,
        active: true,
        firstLoginAttempted: false,
        biometricsAuthorized: false,
        forceLogout: false
      });
      alert('¡Colaborador creado con éxito!');
    }

    // Reset fields
    setCollabName('');
    setCollabRole('Vendedor');
    setCollabEmail('');
    setCollabPhone('');
    setCollabUsername('');
    setCollabPassword('');
    setCollabIsAdmin2(false);
    setCollabProfileImage('');
  };

  const handleEditClick = (col: Collaborator) => {
    setEditingCollab(col);
    setCollabName(col.name);
    setCollabRole(col.role || 'Vendedor');
    setCollabEmail(col.email || '');
    setCollabPhone(col.phone || '');
    setCollabUsername(col.username || '');
    setCollabPassword(col.password || '');
    setCollabIsAdmin2(col.isAdmin2 || false);
    setCollabProfileImage(col.profileImage || '');
  };

  const handleCancelCollabEdit = () => {
    setEditingCollab(null);
    setCollabName('');
    setCollabRole('Vendedor');
    setCollabEmail('');
    setCollabPhone('');
    setCollabUsername('');
    setCollabPassword('');
    setCollabIsAdmin2(false);
    setCollabProfileImage('');
  };

  // Add category
  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim());
    setNewCatName('');
  };

  return (
    <div 
      id="admin-dashboard-container"
      className="min-h-screen pb-16 flex flex-col"
      style={{ 
        backgroundColor: '#0a0a0a', 
        color: '#e5e5e5' 
      }}
    >
      {/* Admin Top Navbar */}
      <nav id="admin-top-nav" className="bg-[#111] border-b border-yellow-600/30 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-yellow-600/10 border border-yellow-500/40 flex items-center justify-center text-yellow-500">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-sans font-black text-sm sm:text-base tracking-widest text-amber-500">CYC-ADMIN</h1>
            <p className="text-[10px] text-gray-400">Panel Central de Control</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-xs text-gray-400">
            Sesión: <b className="text-yellow-500">Administrador de {tenant.name}</b>
          </span>
          <button
            id="btn-admin-preview-public"
            onClick={onTogglePublicPreview}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600/10 border border-amber-500/30 text-amber-500 rounded-lg text-xs font-bold hover:bg-amber-600/25 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vista Pública</span>
          </button>
          <button
            id="btn-admin-logout"
            onClick={onLogout}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-950/40 border border-red-500/30 text-red-400 rounded-lg text-xs font-bold hover:bg-red-950 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 flex flex-col gap-8 w-full">
        {/* TABS SELECTOR - Cyc Style */}
        <div 
          id="admin-tabs"
          className="flex flex-wrap items-center gap-1 bg-[#121212] p-1 rounded-2xl border border-white/5 overflow-x-auto"
        >
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
            { id: 'products', label: 'Productos', icon: Package },
            { id: 'orders', label: 'Encargos', icon: ShoppingBag },
            { id: 'comments', label: 'Comentarios', icon: MessageSquare },
            { id: 'pagetheme', label: 'Tema Página', icon: Palette },
            { id: 'admintheme', label: 'Tema Panel Admin', icon: Shield },
            { id: 'collabs', label: 'Colaboradores', icon: Users },
            { id: 'config', label: 'Configuración', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                id={`admin-tab-btn-${tab.id}`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap relative"
                style={{
                  backgroundColor: isSelected ? '#d97706' : 'transparent',
                  color: isSelected ? '#000000' : '#a3a3a3'
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'comments' && pendingComments.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[9px] flex items-center justify-center animate-pulse border border-red-500 min-w-[18px]">
                    {pendingComments.length}
                  </span>
                )}
                {tab.id === 'orders' && nuevosEncargos > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[9px] flex items-center justify-center animate-pulse border border-red-500 min-w-[18px]">
                    {nuevosEncargos}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* TAB CONTENT: DASHBOARD */}
        {/* ======================================================== */}
        {/* ======================================================== */}
        {/* TAB CONTENT: DASHBOARD */}
        {/* ======================================================== */}
        {activeTab === 'dashboard' && (() => {
          // Filter deliveries based on roles
          const isUserAdmin = loggedInUser.role === 'admin';
          const filteredDeliveries = deliveries.filter(d => {
            if (d.tenantId !== tenant.id) return false;
            if (!isUserAdmin) {
              return d.deliveredBy.toLowerCase() === loggedInUser.name.toLowerCase();
            }
            return true;
          });

          // Calculate metrics
          const getDeliveriesMetrics = () => {
            const todayStr = new Date().toISOString().split('T')[0];
            const now = new Date();
            
            const dailyDeliveries = filteredDeliveries.filter(d => d.date === todayStr);
            
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            const weeklyDeliveries = filteredDeliveries.filter(d => {
              const delDate = new Date(d.date);
              return delDate >= oneWeekAgo && delDate <= now;
            });

            const oneMonthAgo = new Date();
            oneMonthAgo.setDate(now.getDate() - 30);
            const monthlyDeliveries = filteredDeliveries.filter(d => {
              const delDate = new Date(d.date);
              return delDate >= oneMonthAgo && delDate <= now;
            });

            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(now.getFullYear() - 1);
            const annualDeliveries = filteredDeliveries.filter(d => {
              const delDate = new Date(d.date);
              return delDate >= oneYearAgo && delDate <= now;
            });

            return {
              daily: {
                count: dailyDeliveries.reduce((sum, d) => sum + d.quantity, 0),
                amount: dailyDeliveries.reduce((sum, d) => sum + d.totalPrice, 0)
              },
              weekly: {
                count: weeklyDeliveries.reduce((sum, d) => sum + d.quantity, 0),
                amount: weeklyDeliveries.reduce((sum, d) => sum + d.totalPrice, 0)
              },
              monthly: {
                count: monthlyDeliveries.reduce((sum, d) => sum + d.quantity, 0),
                amount: monthlyDeliveries.reduce((sum, d) => sum + d.totalPrice, 0)
              },
              annual: {
                count: annualDeliveries.reduce((sum, d) => sum + d.quantity, 0),
                amount: annualDeliveries.reduce((sum, d) => sum + d.totalPrice, 0)
              }
            };
          };

          const metrics = getDeliveriesMetrics();

          // Set default product choice if none set
          if (!quickDelProductId && tenantProducts.length > 0) {
            setQuickDelProductId(tenantProducts[0].id);
          }

          // Handle manual delivery additions
          const handleQuickDeliverySubmit = (e: React.FormEvent) => {
            e.preventDefault();
            const product = tenantProducts.find(p => p.id === quickDelProductId);
            if (!product) {
              alert('Por favor seleccione un producto.');
              return;
            }

            onAddDelivery({
              tenantId: tenant.id,
              productId: product.id,
              productName: product.name,
              productBarcode: product.barcode || '7790000000000',
              quantity: quickDelQuantity,
              size: quickDelSize,
              price: product.price,
              totalPrice: product.price * quickDelQuantity,
              date: new Date().toISOString().split('T')[0],
              deliveredBy: loggedInUser.name
            });

            // Reset states
            setQuickDelQuantity(1);
            alert('¡Venta y entrega registrada con éxito!');
          };

          // PDF Print export helper
          const handleExportPDF = () => {
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
              alert('Por favor habilite las ventanas emergentes (pop-ups) para imprimir el reporte en PDF.');
              return;
            }
            
            const rows = filteredDeliveries.map(d => `
              <tr>
                <td style="font-family: monospace; font-size: 10px;">${d.id}</td>
                <td style="font-family: monospace; font-size: 10px;">${d.productBarcode}</td>
                <td><b>${d.productName}</b></td>
                <td style="text-align: center;">${d.size}</td>
                <td style="text-align: center;">${d.quantity}</td>
                <td style="text-align: right;">$${d.price.toLocaleString('es-AR')}</td>
                <td style="text-align: right; font-weight: bold;">$${d.totalPrice.toLocaleString('es-AR')}</td>
                <td>${d.date}</td>
                <td>${d.deliveredBy}</td>
              </tr>
            `).join('');

            const totalSales = filteredDeliveries.reduce((sum, d) => sum + d.totalPrice, 0);

            printWindow.document.write(`
              <html>
                <head>
                  <title>Reporte de Entregas - ${tenant.name}</title>
                  <style>
                    body { font-family: sans-serif; color: #1a1a1a; padding: 40px; font-size: 11px; }
                    .header { width: 100%; border-bottom: 2px solid #b3924e; padding-bottom: 15px; margin-bottom: 25px; }
                    .title { font-size: 20px; font-weight: 900; letter-spacing: 1px; color: #000; text-transform: uppercase; margin: 0; }
                    .subtitle { font-size: 10px; color: #666; margin-top: 3px; }
                    .meta-table { width: 100%; margin-bottom: 25px; }
                    .meta-table td { vertical-align: top; font-size: 11px; }
                    .table-data { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    .table-data th { background: #f4f4f5; font-weight: 800; text-transform: uppercase; font-size: 9px; padding: 10px; border: 1px solid #e4e4e7; text-align: left; }
                    .table-data td { padding: 9px; border: 1px solid #e4e4e7; }
                    .total { text-align: right; font-size: 14px; font-weight: bold; margin-top: 25px; border-top: 2px solid #eee; padding-top: 15px; }
                  </style>
                </head>
                <body>
                  <div class="header">
                    <h1 class="title">${tenant.name}</h1>
                    <div class="subtitle">Ecosistema CyC-admin &bull; Registro de Ventas y Logística de Entregas</div>
                  </div>
                  <table class="meta-table">
                    <tr>
                      <td style="width: 50%;">
                        <b>Datos de Sucursal:</b><br/>
                        Dirección: ${tenant.location || 'Física de la Tienda'}<br/>
                        Teléfono WhatsApp: ${tenant.phone || 'No configurado'}<br/>
                        Instagram: ${tenant.instagram || 'No configurado'}
                      </td>
                      <td style="width: 50%; text-align: right;">
                        <b>Información de Sesión:</b><br/>
                        Usuario: ${loggedInUser.name} (${loggedInUser.role === 'admin' ? 'Administrador Inquilino' : 'Colaborador'})<br/>
                        Fecha de Emisión: ${new Date().toLocaleDateString('es-AR')}<br/>
                        Filtro de Datos: ${isUserAdmin ? 'Todo el Personal' : 'Entregas Propias'}
                      </td>
                    </tr>
                  </table>
                  <table class="table-data">
                    <thead>
                      <tr>
                        <th>Código / ID</th>
                        <th>Cód. Barras / SKU</th>
                        <th>Producto</th>
                        <th style="text-align: center;">Talle</th>
                        <th style="text-align: center;">Cant</th>
                        <th style="text-align: right;">Precio Unit.</th>
                        <th style="text-align: right;">Monto Total</th>
                        <th>Fecha</th>
                        <th>Entregado Por</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${rows || '<tr><td colspan="9" style="text-align: center; color: #999; padding: 30px;">Ninguna venta o entrega registrada.</td></tr>'}
                    </tbody>
                  </table>
                  <div class="total">
                    MONTO TOTAL DE VENTAS REGISTRADO: $${totalSales.toLocaleString('es-AR')}
                  </div>
                  <script>
                    window.onload = function() {
                      window.print();
                      window.close();
                    };
                  </script>
                </body>
              </html>
            `);
            printWindow.document.close();
          };

          // Excel sheet report export helper
          const handleExportExcel = () => {
            let csvContent = "SEP=;\n";
            csvContent += `DATOS DE LA SUCURSAL / LOCAL;;\n`;
            csvContent += `Nombre del Local;${tenant.name};;\n`;
            csvContent += `Direccion Fisica;${tenant.location || 'Fisica de la Tienda'};;\n`;
            csvContent += `WhatsApp / Telefonos;${tenant.phone || 'No especificado'};;\n`;
            csvContent += `Instagram Oficial;${tenant.instagram || 'No especificado'};;\n`;
            csvContent += `USUARIO GENERADOR / PERFIL;${loggedInUser.name} (${loggedInUser.role === 'admin' ? 'Admin Inquilino' : 'Colaborador'});;\n`;
            csvContent += `Fecha de Generacion;${new Date().toLocaleDateString('es-AR')};;\n`;
            csvContent += `\n`;
            csvContent += `Codigo Entrega;Codigo Barras / SKU;Producto;Talle;Cantidad;Precio Unitario;Precio Total;Fecha;Entregado Por\n`;

            filteredDeliveries.forEach(d => {
              csvContent += `${d.id};${d.productBarcode};${d.productName};${d.size};${d.quantity};${d.price};${d.totalPrice};${d.date};${d.deliveredBy}\n`;
            });

            const totalSales = filteredDeliveries.reduce((sum, d) => sum + d.totalPrice, 0);
            csvContent += `\n; ; ; ; ;Monto Total;${totalSales}; ;\n`;

            // Trigger CSV download
            const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `planilla_ventas_${tenant.id}_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // If emptySalesOnExport option is checked, clear deliveries!
            if (emptySalesOnExport) {
              const remainingDeliveries = deliveries.filter(d => {
                const belongsToThisTenant = d.tenantId === tenant.id;
                if (!belongsToThisTenant) return true; // Keep other stores intact
                
                if (!isUserAdmin) {
                  // Collaborator: only keep deliveries not done by this collaborator
                  return d.deliveredBy.toLowerCase() !== loggedInUser.name.toLowerCase();
                }
                
                // Admin: delete all deliveries of this store
                return false;
              });

              onClearDeliveries(remainingDeliveries);
              alert('Planilla de cálculo descargada y listado de ventas vaciado con éxito.');
            } else {
              alert('Planilla de cálculo descargada con éxito.');
            }
          };

          return (
            <div id="tab-dashboard" className="flex flex-col gap-8 animate-fadeIn">
              
              {/* Header profile notification banner */}
              <div 
                className="p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                style={{ backgroundColor: `${tenant.theme.cardColor}`, borderColor: `${tenant.theme.primaryColor}20` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-amber-500/10 border border-amber-500/20 text-amber-500" style={{ color: tenant.theme.primaryColor }}>
                    {loggedInUser.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-sm uppercase tracking-wide">
                      {isUserAdmin ? 'Perfil: Administrador Inquilino' : `Perfil Colaborador: ${loggedInUser.name}`}
                    </h3>
                    <p className="text-[10px] text-gray-400">
                      {isUserAdmin 
                        ? 'Acceso completo e ilimitado para auditar y vaciar todas las métricas corporativas del local.' 
                        : 'Acceso restringido de control. Solo visualizas y administras tus ventas y entregas propias.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs bg-black/30 px-3.5 py-1.5 rounded-full border border-white/5 font-mono text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1" />
                  Sesión Activa: <span style={{ color: tenant.theme.primaryColor }}>{loggedInUser.role.toUpperCase()}</span>
                </div>
              </div>

              {/* ========================================== */}
              {/* METRIC BARS PANEL (DAILY, WEEKLY, MONTHLY, ANNUAL) */}
              {/* ========================================== */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-sans font-black text-xs text-amber-500 uppercase tracking-widest" style={{ color: tenant.theme.primaryColor }}>
                      Métricas y Logística de Entregas
                    </h4>
                    <p className="text-[11px] text-gray-400">Progreso de despacho de prendas comparado con metas operativas.</p>
                  </div>
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { 
                      id: 'diarias', 
                      label: 'Entregas Diarias', 
                      count: metrics.daily.count, 
                      amount: metrics.daily.amount, 
                      target: 5, 
                      color: tenant.theme.primaryColor,
                      icon: () => <Calendar className="w-4 h-4" />
                    },
                    { 
                      id: 'semanal', 
                      label: 'Entregas Semanales', 
                      count: metrics.weekly.count, 
                      amount: metrics.weekly.amount, 
                      target: 25, 
                      color: tenant.theme.accentColor,
                      icon: () => <TrendingUp className="w-4 h-4" />
                    },
                    { 
                      id: 'mensual', 
                      label: 'Entregas Mensuales', 
                      count: metrics.monthly.count, 
                      amount: metrics.monthly.amount, 
                      target: 100, 
                      color: '#10b981',
                      icon: () => <Package className="w-4 h-4" />
                    },
                    { 
                      id: 'anual', 
                      label: 'Entregas Anuales', 
                      count: metrics.annual.count, 
                      amount: metrics.annual.amount, 
                      target: 1000, 
                      color: '#6366f1',
                      icon: () => <Shield className="w-4 h-4" />
                    }
                  ].map((bar) => {
                    const percentage = Math.min(100, (bar.count / bar.target) * 100);
                    return (
                      <div 
                        id={`metric-bar-card-${bar.id}`}
                        key={bar.id} 
                        className="p-5 bg-[#141414] rounded-2xl border border-white/5 flex flex-col gap-4 relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-gray-400 uppercase font-black tracking-wide">{bar.label}</span>
                          <div className="p-1.5 rounded-lg bg-white/5 text-gray-400">
                            {bar.icon()}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-black text-white">{bar.count}</span>
                            <span className="text-[10px] text-gray-500">/ {bar.target} prendas</span>
                          </div>
                          <span className="text-[11px] font-bold mt-1 block" style={{ color: bar.color }}>
                            Monto: ${bar.amount.toLocaleString('es-AR')}
                          </span>
                        </div>

                        {/* Custom Visual Bar representation */}
                        <div className="flex flex-col gap-1.5 mt-1">
                          <div className="w-full h-2 rounded-full bg-zinc-800 relative overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-1000 ease-out"
                              style={{ 
                                width: `${percentage}%`, 
                                backgroundColor: bar.color,
                                boxShadow: `0 0 8px ${bar.color}`
                              }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[9px] text-gray-500">
                            <span>Progreso Meta</span>
                            <span>{percentage.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ========================================== */}
              {/* CONTROL DE EXPORTACIONES Y MANUAL LOGS GRID */}
              {/* ========================================== */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Export panel (Left block) */}
                <div 
                  className="lg:col-span-7 p-6 bg-[#141414] rounded-2xl border border-white/5 flex flex-col gap-5"
                >
                  <div>
                    <h4 className="font-sans font-black text-sm uppercase text-white tracking-wider">
                      Exportaciones y Descargas
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Baje el listado consolidado de ventas. Puede habilitar el vaciado automático de registros.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Excel Spreadsheet download */}
                    <button
                      id="btn-export-spreadsheet"
                      onClick={handleExportExcel}
                      className="p-4 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-950/10 hover:bg-emerald-950/30 text-emerald-400 text-xs font-bold flex flex-col items-center text-center gap-2.5 transition-all active:scale-95 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-6 h-6" />
                      <div>
                        <span className="block">Bajar Planilla de Cálculo</span>
                        <span className="block text-[9px] text-emerald-500/80 mt-0.5">Formato compatible Excel (CSV)</span>
                      </div>
                    </button>

                    {/* PDF Document download */}
                    <button
                      id="btn-export-pdf"
                      onClick={handleExportPDF}
                      className="p-4 rounded-xl border border-amber-500/20 hover:border-amber-500/40 bg-amber-950/10 hover:bg-amber-950/30 text-amber-500 text-xs font-bold flex flex-col items-center text-center gap-2.5 transition-all active:scale-95 cursor-pointer"
                      style={{ 
                        color: tenant.theme.primaryColor, 
                        borderColor: `${tenant.theme.primaryColor}20`,
                        backgroundColor: `${tenant.theme.primaryColor}05`
                      }}
                    >
                      <Download className="w-6 h-6" />
                      <div>
                        <span className="block">Descargar Listado en PDF</span>
                        <span className="block text-[9px] text-amber-500/80 mt-0.5" style={{ color: `${tenant.theme.primaryColor}dd` }}>Listo para impresión corporativa</span>
                      </div>
                    </button>
                  </div>

                  {/* Empty Sales Checkbox option */}
                  <div className="p-4 bg-black/30 rounded-xl border border-white/5 flex items-start gap-3">
                    <input
                      id="chk-empty-sales-on-download"
                      type="checkbox"
                      checked={emptySalesOnExport}
                      onChange={(e) => setEmptySalesOnExport(e.target.checked)}
                      className="w-4 h-4 rounded mt-0.5 text-amber-500 bg-zinc-900 border-zinc-700 accent-amber-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <label htmlFor="chk-empty-sales-on-download" className="text-xs font-bold text-gray-200 cursor-pointer select-none">
                        Habilitar vaciado del listado al bajar planilla
                      </label>
                      <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                        Al activar esta opción, al hacer clic en <b>Bajar Planilla de Cálculo</b> se borrará el historial de ventas del sistema ({isUserAdmin ? 'todo el local' : 'únicamente tus registros propios'}).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Sale delivery Logger (Right block) */}
                <div 
                  className="lg:col-span-5 p-6 bg-[#141414] rounded-2xl border border-white/5 flex flex-col gap-4"
                >
                  <div>
                    <h4 className="font-sans font-black text-sm uppercase text-white tracking-wider">
                      Registrar Entrega / Venta
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Ingreso manual rápido para simular salidas de stock.
                    </p>
                  </div>

                  {tenantProducts.length === 0 ? (
                    <p className="text-center text-xs text-gray-500 py-6 italic">No hay productos disponibles para registrar entregas.</p>
                  ) : (
                    <form id="form-quick-delivery-record" onSubmit={handleQuickDeliverySubmit} className="flex flex-col gap-3.5">
                      {/* Product selection */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-gray-400">Producto despachado</label>
                        <select
                          value={quickDelProductId}
                          onChange={(e) => setQuickDelProductId(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none cursor-pointer"
                        >
                          {tenantProducts.map(p => (
                            <option key={p.id} value={p.id} className="bg-zinc-900 text-white">
                              {p.name} (${p.price.toLocaleString('es-AR')})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Size choice */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-gray-400">Talle</label>
                          <select
                            value={quickDelSize}
                            onChange={(e) => setQuickDelSize(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none cursor-pointer"
                          >
                            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => (
                              <option key={s} value={s} className="bg-zinc-900 text-white">{s}</option>
                            ))}
                          </select>
                        </div>

                        {/* Quantity */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-gray-400">Cantidad</label>
                          <input
                            type="number"
                            required
                            min={1}
                            max={100}
                            value={quickDelQuantity}
                            onChange={(e) => setQuickDelQuantity(parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <button
                        id="btn-quick-delivery-record-submit"
                        type="submit"
                        className="py-2.5 px-4 rounded-xl bg-amber-500 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer mt-1"
                        style={{ backgroundColor: tenant.theme.primaryColor }}
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Registrar Entrega</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* ========================================== */}
              {/* DETAILED DELIVERIES LIST TABLE (DEBAJO DE LAS BARRAS) */}
              {/* ========================================== */}
              <div className="bg-[#141414] rounded-2xl border border-white/5 flex flex-col overflow-hidden">
                <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/10">
                  <div>
                    <h4 className="font-sans font-black text-sm uppercase text-white tracking-wider">
                      Listado Detallado de Ventas y Entregas
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {isUserAdmin 
                        ? 'Auditoría completa. Mostrando todos los productos despachados por el personal de la sucursal.' 
                        : 'Lista de control personal. Solo visualizas las entregas ejecutadas bajo tu cuenta.'}
                    </p>
                  </div>
                  
                  <div className="text-xs bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 font-bold">
                    Total: <span style={{ color: tenant.theme.primaryColor }}>{filteredDeliveries.length} registros</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-black/30 text-gray-400 font-extrabold border-b border-white/5">
                        <th className="p-4 uppercase tracking-wider text-[10px]">ID / Código</th>
                        <th className="p-4 uppercase tracking-wider text-[10px]">Cód. Barras / SKU</th>
                        <th className="p-4 uppercase tracking-wider text-[10px]">Producto despachado</th>
                        <th className="p-4 uppercase tracking-wider text-[10px] text-center">Talle</th>
                        <th className="p-4 uppercase tracking-wider text-[10px] text-center">Cant</th>
                        <th className="p-4 uppercase tracking-wider text-[10px] text-right">Precio Unit.</th>
                        <th className="p-4 uppercase tracking-wider text-[10px] text-right">Total Cobrado</th>
                        <th className="p-4 uppercase tracking-wider text-[10px]">Fecha</th>
                        <th className="p-4 uppercase tracking-wider text-[10px]">Quién Entregó</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredDeliveries.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-gray-500 italic">
                            No se registran ventas o entregas en este período para la cuenta actual.
                          </td>
                        </tr>
                      ) : (
                        filteredDeliveries.map((del) => (
                          <tr 
                            id={`delivery-row-${del.id}`}
                            key={del.id} 
                            className="hover:bg-white/[0.02] transition-colors"
                          >
                            <td className="p-4 font-mono text-[10px] text-gray-400">{del.id}</td>
                            <td className="p-4 font-mono text-[10px] text-gray-500">{del.productBarcode}</td>
                            <td className="p-4 font-bold text-white">{del.productName}</td>
                            <td className="p-4 text-center">
                              <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-bold text-gray-300">
                                {del.size}
                              </span>
                            </td>
                            <td className="p-4 text-center font-bold text-gray-300">{del.quantity}</td>
                            <td className="p-4 text-right text-gray-400">${del.price.toLocaleString('es-AR')}</td>
                            <td className="p-4 text-right font-black text-amber-500" style={{ color: tenant.theme.primaryColor }}>
                              ${del.totalPrice.toLocaleString('es-AR')}
                            </td>
                            <td className="p-4 text-gray-400">{del.date}</td>
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1 text-[10px] bg-white/5 text-gray-300 px-2.5 py-1 rounded-full font-semibold">
                                <UserCheck className="w-3 h-3 text-amber-500" style={{ color: tenant.theme.primaryColor }} />
                                {del.deliveredBy}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {filteredDeliveries.length > 0 && (
                  <div className="p-4 bg-black/20 border-t border-white/5 text-right font-bold text-sm text-gray-300">
                    Suma Facturada Período: <span className="text-amber-500 text-base ml-1" style={{ color: tenant.theme.primaryColor }}>
                      ${filteredDeliveries.reduce((sum, d) => sum + d.totalPrice, 0).toLocaleString('es-AR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ======================================================== */}
        {/* TAB CONTENT: COMENTARIOS */}
        {/* ======================================================== */}
        {activeTab === 'comments' && (
          <div id="tab-comments" className="flex flex-col gap-8 animate-fadeIn">
            {/* Header */}
            <div>
              <h3 className="font-sans font-black text-lg text-white uppercase tracking-wider">Gestión de Comentarios y Reseñas</h3>
              <p className="text-xs text-gray-400 mt-0.5">Modera y administra las opiniones de los clientes sobre tu local.</p>
            </div>

            {/* Comments Status Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#141414] rounded-2xl border border-white/5 flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Recibidos</span>
                <span className="text-xl font-black text-white">{tenantComments.length}</span>
              </div>
              <div className="p-4 bg-[#141414] rounded-2xl border border-white/5 flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Pendientes de Moderación</span>
                <span className={`text-xl font-black ${pendingComments.length > 0 ? 'text-amber-500 animate-pulse' : 'text-gray-400'}`}>
                  {pendingComments.length}
                </span>
              </div>
              <div className="p-4 bg-[#141414] rounded-2xl border border-white/5 flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Aprobados / Públicos</span>
                <span className="text-xl font-black text-green-500">{approvedCommentsCount}</span>
              </div>
            </div>

            {/* Pending Section */}
            <div className="p-6 bg-[#141414] rounded-2xl border border-white/5 flex flex-col gap-6">
              <div>
                <h4 className="font-sans font-black text-sm tracking-widest text-amber-500 uppercase">Comentarios Pendientes</h4>
                <p className="text-xs text-gray-400 mt-1">Habilita o rechaza comentarios para que se muestren públicamente.</p>
              </div>

              {pendingComments.length === 0 ? (
                <div className="p-8 rounded-xl border border-dashed border-white/10 text-center text-gray-500 text-xs">
                  No hay comentarios pendientes. ¡Tus clientes están al día!
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {pendingComments.map((comment) => (
                    <div 
                      id={`pending-comment-row-comments-tab-${comment.id}`}
                      key={comment.id}
                      className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm text-yellow-500">{comment.author}</span>
                          <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded">{comment.date}</span>
                          <div className="flex gap-0.5 text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < comment.rating ? 'fill-current' : 'opacity-20'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed italic">
                          "{comment.text}"
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          id={`btn-approve-comment-comments-tab-${comment.id}`}
                          onClick={() => onApproveComment(comment.id)}
                          className="px-4 py-2 rounded-xl bg-green-500 text-black text-xs font-bold flex items-center gap-1 hover:scale-105 transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Dar OK</span>
                        </button>
                        <button
                          id={`btn-reject-comment-comments-tab-${comment.id}`}
                          onClick={() => onRejectComment(comment.id)}
                          className="px-4 py-2 rounded-xl bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-1 hover:bg-red-950 transition-all cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Rechazar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Approved Section */}
            <div className="p-6 bg-[#141414] rounded-2xl border border-white/5 flex flex-col gap-6">
              <div>
                <h4 className="font-sans font-black text-sm tracking-widest text-green-500 uppercase">Comentarios Aprobados ({approvedCommentsCount})</h4>
                <p className="text-xs text-gray-400 mt-1">Estos comentarios están publicados en la tienda del local.</p>
              </div>

              {tenantComments.filter(c => c.approved).length === 0 ? (
                <div className="p-8 rounded-xl border border-dashed border-white/10 text-center text-gray-500 text-xs">
                  Aún no hay comentarios aprobados.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {tenantComments.filter(c => c.approved).map((comment) => (
                    <div 
                      id={`approved-comment-row-comments-tab-${comment.id}`}
                      key={comment.id}
                      className="p-4 rounded-xl bg-black/20 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm text-gray-300">{comment.author}</span>
                          <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded">{comment.date}</span>
                          <div className="flex gap-0.5 text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < comment.rating ? 'fill-current' : 'opacity-20'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed italic">
                          "{comment.text}"
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          id={`btn-unapprove-comment-comments-tab-${comment.id}`}
                          onClick={() => onRejectComment(comment.id)}
                          className="px-3 py-1.5 rounded-lg border border-red-500/30 hover:bg-red-950/20 text-red-400 text-[10px] uppercase font-bold transition-all cursor-pointer"
                        >
                          Desaprobar / Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB CONTENT: PRODUCTS */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div id="tab-orders" className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="font-sans font-black text-lg text-white uppercase tracking-wider">Encargos recibidos</h2>
                <p className="text-xs text-gray-400 mt-0.5">Pedidos de retiro que hicieron tus clientes desde la página pública.</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">{retiroOrders.length} en total</span>
            </div>
            {retiroOrders.length === 0 ? (
              <div id="orders-empty" className="p-8 text-center text-gray-500 text-sm bg-[#141414] rounded-2xl border border-white/5">
                Todavía no hay encargos. Cuando un cliente confirme un pedido desde la página pública, aparece acá automáticamente.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {retiroOrders.map((o) => (
                  <div key={o.id} id={`order-${o.id}`} className="p-4 bg-[#141414] rounded-2xl border border-white/5 flex flex-col gap-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-mono font-bold text-white text-sm">{o.code}</span>
                      <span className="text-[10px] text-gray-500">{new Date(o.date).toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-300">
                      <b className="text-white">{o.clientName}</b> · {o.clientPhone}{o.clientEmail ? ' · ' + o.clientEmail : ''}
                    </div>
                    <ul className="text-xs text-gray-400 list-disc pl-4">
                      {(o.items || []).map((it, i) => (
                        <li key={i}>{it.quantity}x {it.name}{it.size ? ' (' + it.size + ')' : ''} — ${it.price}</li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-bold text-amber-400 text-sm">Total: ${o.total}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${o.status === 'entregado' ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10'}`}>{o.status === 'entregado' ? 'Entregado' : 'Nuevo'}</span>
                        {o.status !== 'entregado' && onMarkDelivered && (
                          <button
                            id={`btn-deliver-${o.id}`}
                            onClick={() => onMarkDelivered(o.id)}
                            className="text-[10px] px-3 py-1 rounded-full font-bold bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30 transition-colors cursor-pointer"
                          >
                            Marcar entregado
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div id="tab-products" className="flex flex-col gap-6 animate-fadeIn">
            {/* Products Bar action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-sans font-black text-lg text-white uppercase tracking-wider">Catálogo de Ropa</h3>
                <p className="text-xs text-gray-400 mt-0.5">Agrega, edita y ajusta la vestimenta disponible.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Scan Button */}
                <button
                  id="btn-open-scanner"
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Scan className="w-4 h-4" />
                  <span>Escanear QR/Barra</span>
                </button>

                {/* Fast Category additions */}
                <form id="add-category-form" onSubmit={handleAddCategorySubmit} className="flex gap-1.5">
                  <input
                    id="input-new-category-name"
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Nueva categoría..."
                    className="px-3 py-1.5 text-xs bg-[#141414] border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    id="btn-add-category"
                    type="submit"
                    className="p-1.5 rounded-xl bg-amber-500 text-black text-xs font-bold flex items-center justify-center hover:scale-105 cursor-pointer"
                    title="Añadir Categoría"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>

                <button
                  id="btn-open-add-product"
                  onClick={handleOpenAddProd}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Producto</span>
                </button>
              </div>
            </div>

            {/* Inline Categories Deletion Manager */}
            <div className="flex flex-wrap gap-2 items-center p-3.5 bg-[#141414] rounded-2xl border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider mr-2 block">Control de Categorías (- para eliminar):</span>
              {categories.map((cat) => {
                const isSystem = ['Todos', 'Promo', 'Ofertas'].includes(cat);
                return (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-xs font-bold text-gray-300 border border-white/5"
                  >
                    <span>{cat}</span>
                    {!isSystem && (
                      <button
                        type="button"
                        onClick={() => onDeleteCategory(cat)}
                        className="text-red-400 hover:text-red-500 cursor-pointer font-black w-4 h-4 rounded-full flex items-center justify-center bg-red-950/40 hover:bg-red-900/60 transition-colors"
                        title={`Eliminar categoría ${cat}`}
                      >
                        &times;
                      </button>
                    )}
                  </span>
                );
              })}
            </div>

            {/* Products Table/List */}
            {tenantProducts.length === 0 && (
              <div id="products-empty" className="p-6 text-center text-gray-500 text-sm bg-[#141414] rounded-2xl border border-white/5">
                Todavía no cargaste prendas para esta tienda. Usá "Nuevo Producto" o "Escanear QR/Barra" para agregar la primera.
              </div>
            )}
            <div className="bg-[#141414] rounded-2xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#1a1a1a] border-b border-white/5 text-gray-400 uppercase tracking-widest text-[9px] font-bold">
                      <th className="p-4">Imagen</th>
                      <th className="p-4">Nombre</th>
                      <th className="p-4">Categoría</th>
                      <th className="p-4">Precio</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Etiquetas</th>
                      <th className="p-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {tenantProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <img 
                            src={prod.imageUrl} 
                            alt={prod.name} 
                            className="w-10 h-10 object-cover rounded-lg border border-white/10 bg-black"
                            referrerPolicy="no-referrer"
                          />
                        </td>
                        <td className="p-4 font-bold text-white">
                          <div>
                            <span className="block text-sm">{prod.name}</span>
                            <span className="block text-[10px] text-gray-400 font-light mt-0.5 line-clamp-1">{prod.description}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-white/5 text-gray-300 font-semibold text-[10px]">
                            {prod.category}
                          </span>
                        </td>
                        <td className="p-4 font-extrabold text-amber-500">
                          ${prod.price.toLocaleString('es-AR')}
                        </td>
                        <td className="p-4 font-medium text-gray-300">
                          {prod.stock > 0 ? (
                            <span className="text-green-500">{prod.stock} u.</span>
                          ) : (
                            <span className="text-red-500 font-black uppercase">Agotado</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            {prod.isPromo && <span className="px-2 py-0.5 text-[8px] font-black uppercase bg-yellow-500 text-black rounded-md">Promo</span>}
                            {prod.isOffer && <span className="px-2 py-0.5 text-[8px] font-black uppercase bg-red-600 text-white rounded-md">Oferta</span>}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              id={`btn-edit-prod-${prod.id}`}
                              onClick={() => handleOpenEditProd(prod)}
                              className="p-1.5 rounded-lg bg-blue-950 text-blue-400 hover:bg-blue-900 transition-colors cursor-pointer"
                              title="Editar"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`btn-delete-prod-${prod.id}`}
                              onClick={() => onDeleteProduct(prod.id)}
                              className="p-1.5 rounded-lg bg-red-950/70 text-red-400 hover:bg-red-900 transition-colors cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB CONTENT: TEMA PAGINA */}
        {/* ======================================================== */}
        {activeTab === 'pagetheme' && (
          <div className="flex flex-col gap-6 animate-fadeIn w-full">
            {/* BRAND THEME SELECTION BAR (AS REQUESTED BY USER INSTANTLY) */}
            <div className="p-6 bg-[#141414] rounded-2xl border border-white/5 flex flex-col gap-4">
              <div>
                <h3 className="font-sans font-black text-sm text-white uppercase tracking-wider">Plantillas y Temas de Marca</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Selecciona uno de los tres temas de la colección de forma instantánea para aplicar su diseño, logo y paleta de colores:
                </p>
              </div>

              {/* Exact styling from the user's attachment */}
              <div className="flex flex-wrap items-center gap-3 p-4 bg-black rounded-3xl border border-white/10 w-full">
                {[
                  {
                    id: 'cyc-elegance',
                    name: 'Cyc Boutique Glamour',
                    logoUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=200',
                    slogan: 'Moda sofisticada y de alta costura para marcar tendencia.',
                    bannerUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
                    bannerLayout: 'transparent-center' as const,
                    colors: {
                      primaryColor: '#C5A059',
                      secondaryColor: '#0a0a0a',
                      backgroundColor: '#0a0a0a',
                      cardColor: '#121212',
                      textColor: '#f4f4f5',
                      accentColor: '#C5A059',
                      adminTheme: 'cyc-gold' as const
                    }
                  },
                  {
                    id: 'urban-retro',
                    name: 'Urban Streetwear',
                    logoUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=200',
                    slogan: 'Prendas urbanas, oversize y estilo rebelde para la calle.',
                    bannerUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800',
                    bannerLayout: 'left' as const,
                    colors: {
                      primaryColor: '#10b981',
                      secondaryColor: '#1e293b',
                      backgroundColor: '#0f172a',
                      cardColor: '#1e293b',
                      textColor: '#f8fafc',
                      accentColor: '#34d399',
                      adminTheme: 'modern-dark' as const
                    }
                  },
                  {
                    id: 'eco-threads',
                    name: 'Eco-Threads Organic',
                    logoUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=200',
                    slogan: 'Algodón 100% orgánico, lino noble y procesos eco-sustentables.',
                    bannerUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=800',
                    bannerLayout: 'center' as const,
                    colors: {
                      primaryColor: '#065f46',
                      secondaryColor: '#f5f5f4',
                      backgroundColor: '#fafaf9',
                      cardColor: '#ffffff',
                      textColor: '#1c1917',
                      accentColor: '#059669',
                      adminTheme: 'sleek-light' as const
                    }
                  }
                ].map((p) => {
                  // Active state is determined if current local state values match this preset name
                  const isActive = tenantName === p.name;
                  return (
                    <button
                      id={`btn-preset-theme-pagetheme-${p.id}`}
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setTenantName(p.name);
                        setTenantSlogan(p.slogan);
                        setTenantLogoUrl(p.logoUrl);
                        setTenantBannerUrl(p.bannerUrl);
                        setTenantBannerLayout(p.bannerLayout);
                        setPrimaryColor(p.colors.primaryColor);
                        setSecondaryColor(p.colors.secondaryColor);
                        setBackgroundColor(p.colors.backgroundColor);
                        setCardColor(p.colors.cardColor);
                        setTextColor(p.colors.textColor);
                        setAccentColor(p.colors.accentColor);
                        
                        onUpdateTenant({
                          ...tenant,
                          name: p.name,
                          slogan: p.slogan,
                          logoUrl: p.logoUrl,
                          bannerUrl: p.bannerUrl,
                          bannerLayout: p.bannerLayout,
                          theme: {
                            ...tenant.theme,
                            ...p.colors
                          }
                        });
                      }}
                      className="px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 cursor-pointer shadow-md border"
                      style={{
                        backgroundColor: isActive ? '#C5A059' : '#0d0d0d',
                        color: isActive ? '#000000' : '#ffffff',
                        borderColor: isActive ? '#C5A059' : 'rgba(255,255,255,0.08)'
                      }}
                    >
                      <img 
                        src={p.logoUrl} 
                        alt="" 
                        className="w-5 h-5 rounded-full object-cover border border-white/20 bg-black" 
                        referrerPolicy="no-referrer"
                      />
                      <span>{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form id="form-page-theme" onSubmit={handleSavePageTheme} className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Editor fields */}
              <div className="md:col-span-7 p-6 bg-[#141414] rounded-2xl border border-white/5 flex flex-col gap-5">
                <div>
                  <h3 className="font-sans font-black text-base text-white uppercase tracking-wider">Textos y Portadas Públicas</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Controla las imágenes y descripciones que ven los visitantes.</p>
                </div>

                {/* Store Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Nombre del Local</label>
                  <input
                    id="theme-store-name"
                    type="text"
                    required
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 focus:outline-none focus:border-amber-500 text-white"
                  />
                </div>

                {/* Slogan */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Texto a Expresar (Slogan)</label>
                  <textarea
                    id="theme-store-slogan"
                    required
                    rows={2}
                    value={tenantSlogan}
                    onChange={(e) => setTenantSlogan(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 focus:outline-none focus:border-amber-500 text-white resize-none"
                  />
                </div>

                 {/* Logo URL with Uploader */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Imagen de Logo</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 flex flex-col gap-1">
                      <input
                        id="theme-logo-url"
                        type="text"
                        required
                        value={tenantLogoUrl}
                        onChange={(e) => setTenantLogoUrl(e.target.value)}
                        placeholder="Enlace o Base64 del Logo"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 focus:outline-none focus:border-amber-500 text-white"
                      />
                      <span className="text-[10px] text-gray-500">Enlace de internet o selecciona un archivo.</span>
                    </div>
                    <label 
                      id="upload-logo-label"
                      className="cursor-pointer px-4 py-2 rounded-xl border border-dashed border-white/20 hover:border-amber-500/50 bg-white/5 hover:bg-white/10 text-xs font-bold flex items-center justify-center gap-2 transition-all shrink-0 h-9"
                    >
                      <Upload className="w-4 h-4 text-gray-400" />
                      <span>Subir Imagen</span>
                      <input
                        id="input-file-logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Banner URL with Uploader */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Portada / Banner de la Tienda</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 flex flex-col gap-1">
                      <input
                        id="theme-banner-url"
                        type="text"
                        required
                        value={tenantBannerUrl}
                        onChange={(e) => setTenantBannerUrl(e.target.value)}
                        placeholder="Enlace o Base64 de la Portada"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 focus:outline-none focus:border-amber-500 text-white"
                      />
                      <span className="text-[10px] text-gray-500">Enlace de internet o selecciona un archivo.</span>
                    </div>
                    <label 
                      id="upload-banner-label"
                      className="cursor-pointer px-4 py-2 rounded-xl border border-dashed border-white/20 hover:border-amber-500/50 bg-white/5 hover:bg-white/10 text-xs font-bold flex items-center justify-center gap-2 transition-all shrink-0 h-9"
                    >
                      <Upload className="w-4 h-4 text-gray-400" />
                      <span>Subir Imagen</span>
                      <input
                        id="input-file-banner"
                        type="file"
                        accept="image/*"
                        onChange={handleBannerFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Banner Layout options */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Alineación del Banner</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'left', label: 'Izquierda' },
                      { id: 'center', label: 'Centrado' },
                      { id: 'transparent-center', label: 'Centro Transparente' }
                    ].map((lay) => (
                      <button
                        id={`btn-layout-set-${lay.id}`}
                        key={lay.id}
                        type="button"
                        onClick={() => setTenantBannerLayout(lay.id as any)}
                        className="py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors"
                        style={{
                          backgroundColor: tenantBannerLayout === lay.id ? '#d97706' : 'rgba(255,255,255,0.02)',
                          color: tenantBannerLayout === lay.id ? '#000000' : '#d4d4d4',
                          borderColor: tenantBannerLayout === lay.id ? '#d97706' : 'rgba(255,255,255,0.08)'
                        }}
                      >
                        {lay.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Colors config */}
              <div className="md:col-span-5 flex flex-col gap-6">
                <div className="p-6 bg-[#141414] rounded-2xl border border-white/5 flex flex-col gap-5">
                  <div>
                    <h3 className="font-sans font-black text-base text-white uppercase tracking-wider">Paleta de Colores de Tienda</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Sintoniza los colores para la vista del comprador.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Color Primario</label>
                      <div className="flex gap-2">
                        <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-8 h-8 rounded-full border-0 bg-transparent cursor-pointer" />
                        <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-full text-xs px-2 border rounded-xl bg-black text-white" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Color Secundario</label>
                      <div className="flex gap-2">
                        <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-8 h-8 rounded-full border-0 bg-transparent cursor-pointer" />
                        <input type="text" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-full text-xs px-2 border rounded-xl bg-black text-white" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Fondo General</label>
                      <div className="flex gap-2">
                        <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-8 h-8 rounded-full border-0 bg-transparent cursor-pointer" />
                        <input type="text" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-full text-xs px-2 border rounded-xl bg-black text-white" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Color de Tarjetas</label>
                      <div className="flex gap-2">
                        <input type="color" value={cardColor} onChange={(e) => setCardColor(e.target.value)} className="w-8 h-8 rounded-full border-0 bg-transparent cursor-pointer" />
                        <input type="text" value={cardColor} onChange={(e) => setCardColor(e.target.value)} className="w-full text-xs px-2 border rounded-xl bg-black text-white" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Color del Texto</label>
                      <div className="flex gap-2">
                        <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded-full border-0 bg-transparent cursor-pointer" />
                        <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full text-xs px-2 border rounded-xl bg-black text-white" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Color Accent (Destellos)</label>
                      <div className="flex gap-2">
                        <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-8 h-8 rounded-full border-0 bg-transparent cursor-pointer" />
                        <input type="text" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-full text-xs px-2 border rounded-xl bg-black text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  id="btn-save-page-theme"
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Aplicar Cambios de Tema</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB CONTENT: TEMA PANEL ADMIN */}
        {/* ======================================================== */}
        {activeTab === 'admintheme' && (
          <div id="tab-admin-theme" className="flex flex-col gap-6 max-w-2xl mx-auto w-full animate-fadeIn">
            <div className="p-6 bg-[#141414] rounded-2xl border border-white/5 flex flex-col gap-6 text-center">
              <Shield className="w-12 h-12 text-amber-500 mx-auto" />
              <div>
                <h3 className="font-sans font-black text-lg text-white uppercase tracking-wider">TEMAS DEL PANEL CYC-ADMIN</h3>
                <p className="text-xs text-gray-400 mt-1">Elige la estética y visualización de tu oficina de administración.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {/* CYC GOLD */}
                <button
                  id="btn-preset-cyc-gold"
                  onClick={() => applyAdminPreset('cyc-gold')}
                  className="p-5 rounded-2xl border text-left flex flex-col gap-3 transition-all hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: tenant.theme.adminTheme === 'cyc-gold' ? '#1c1917' : '#0d0d0d',
                    borderColor: tenant.theme.adminTheme === 'cyc-gold' ? '#b3924e' : 'rgba(255,255,255,0.05)'
                  }}
                >
                  <span className="w-5 h-5 rounded-full bg-[#b3924e]" />
                  <div>
                    <span className="block font-bold text-xs text-white">Molde CyC-admin</span>
                    <span className="block text-[10px] text-gray-400 mt-1">Negro azabache con filetes oro rosa. Elegante y exclusivo.</span>
                  </div>
                </button>

                {/* CYBER MODERN */}
                <button
                  id="btn-preset-modern-dark"
                  onClick={() => applyAdminPreset('modern-dark')}
                  className="p-5 rounded-2xl border text-left flex flex-col gap-3 transition-all hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: tenant.theme.adminTheme === 'modern-dark' ? '#1e293b' : '#0d0d0d',
                    borderColor: tenant.theme.adminTheme === 'modern-dark' ? '#10b981' : 'rgba(255,255,255,0.05)'
                  }}
                >
                  <span className="w-5 h-5 rounded-full bg-[#10b981]" />
                  <div>
                    <span className="block font-bold text-xs text-white">Moderno Cyber</span>
                    <span className="block text-[10px] text-gray-400 mt-1">Gris pizarra y verde esmeralda brillante. Ágil e intuitivo.</span>
                  </div>
                </button>

                {/* SLEEK LIGHT */}
                <button
                  id="btn-preset-sleek-light"
                  onClick={() => applyAdminPreset('sleek-light')}
                  className="p-5 rounded-2xl border text-left flex flex-col gap-3 transition-all hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: tenant.theme.adminTheme === 'sleek-light' ? '#ffffff' : '#0d0d0d',
                    borderColor: tenant.theme.adminTheme === 'sleek-light' ? '#065f46' : 'rgba(255,255,255,0.05)'
                  }}
                >
                  <span className="w-5 h-5 rounded-full bg-[#065f46]" />
                  <div>
                    <span className="block font-bold text-xs text-black">Organic Light</span>
                    <span className="block text-[10px] text-gray-500 mt-1">Lino suave, beige y verde bosque. Clásico e imponente.</span>
                  </div>
                </button>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-[11px] text-gray-400">
                La estética del panel sincroniza automáticamente para reflejar un ecosistema corporativo consistente.
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB CONTENT: COLLABORATORS */}
        {/* ======================================================== */}
        {activeTab === 'collabs' && (
          <div id="tab-collaborators" className="flex flex-col gap-8 animate-fadeIn">
            {/* 1. PENDING BIOMETRIC REQUESTS BANNER */}
            {(() => {
              const pendingBiometricCollabs = tenantCollaborators.filter(c => c.firstLoginAttempted && !c.biometricsAuthorized);
              if (pendingBiometricCollabs.length === 0) return null;
              return (
                <div id="pending-biometrics-bar" className="w-full bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Fingerprint className="w-5 h-5 text-amber-500 animate-pulse" />
                    <h4 className="font-sans font-black text-sm uppercase tracking-wider">🔔 Solicitudes de Datos Biométricos ({pendingBiometricCollabs.length})</h4>
                  </div>
                  <p className="text-xs text-gray-300">
                    Los siguientes colaboradores iniciaron sesión por primera vez y solicitan habilitar su ingreso rápido biométrico (Huella/FaceID) por seguridad.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-1">
                    {pendingBiometricCollabs.map(col => (
                      <div key={col.id} className="p-3 bg-black/40 rounded-xl flex items-center justify-between gap-3 border border-white/5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-black/40 flex items-center justify-center shrink-0">
                            {col.profileImage ? (
                              <img src={col.profileImage} alt={col.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full bg-amber-500/10 flex items-center justify-center font-bold text-amber-500 text-xs">
                                {col.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-white leading-snug">{col.name}</span>
                            <span className="block text-[9px] text-gray-400 font-mono">Usuario: {col.username}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              onEditCollaborator({
                                ...col,
                                biometricsAuthorized: true
                              });
                              alert(`Acceso biométrico aprobado con éxito para ${col.name}.`);
                            }}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Aprobar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onEditCollaborator({
                                ...col,
                                firstLoginAttempted: false
                              });
                              alert(`Solicitud rechazada para ${col.name}.`);
                            }}
                            className="p-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all cursor-pointer"
                            title="Rechazar"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* 2. CREATION FORM & MAIN TEAM LIST */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Add/Edit Form Panel */}
              <div className="md:col-span-5">
                <form 
                  id="form-add-collaborator"
                  onSubmit={handleSaveCollaborator} 
                  className="p-6 bg-[#141414] rounded-2xl border border-white/5 flex flex-col gap-4 shadow-xl"
                >
                  <div className="border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-500" />
                      <h3 className="font-sans font-black text-base text-white uppercase tracking-wider">
                        {editingCollab ? 'Editar Colaborador' : 'Añadir Colaborador'}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {editingCollab ? 'Modifica el perfil o credenciales del colaborador.' : 'Asigna accesos y credenciales de personal.'}
                    </p>
                  </div>

                  {/* Profile Image (PC/Mobile upload) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Foto de Perfil</label>
                    <div className="flex items-center gap-3 p-2 bg-black/20 rounded-xl border border-white/5">
                      <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-black/40 flex items-center justify-center shrink-0">
                        {collabProfileImage ? (
                          <img src={collabProfileImage} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <User className="w-6 h-6 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-300 hover:bg-white/10 transition-colors cursor-pointer inline-flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-amber-500" />
                          <span>Subir desde PC/Móvil</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCollabImageFileChange}
                            className="hidden"
                          />
                        </label>
                        {collabProfileImage && (
                          <button
                            type="button"
                            onClick={() => setCollabProfileImage('')}
                            className="text-[9px] text-red-400 hover:underline block mt-1"
                          >
                            Remover imagen
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase">Nombre Completo</label>
                    <input
                      id="collab-input-name"
                      type="text"
                      required
                      value={collabName}
                      onChange={(e) => setCollabName(e.target.value)}
                      placeholder="Ej. Martín Varela"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase">Teléfono de Contacto</label>
                    <input
                      id="collab-input-phone"
                      type="text"
                      required
                      value={collabPhone}
                      onChange={(e) => setCollabPhone(e.target.value)}
                      placeholder="Ej. +54 9 11 1234-5678"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase">Correo Electrónico (Opcional)</label>
                    <input
                      id="collab-input-email"
                      type="email"
                      value={collabEmail}
                      onChange={(e) => setCollabEmail(e.target.value)}
                      placeholder="martin@tienda.com"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  {/* Role */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase">Rol / Puesto</label>
                    <select
                      id="collab-select-role"
                      value={collabRole}
                      onChange={(e) => setCollabRole(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none cursor-pointer"
                    >
                      <option value="Vendedor">Vendedor / Asistente</option>
                      <option value="Encargado de Stock">Encargado de Stock</option>
                      <option value="Editor de Contenidos">Editor de Contenidos</option>
                      <option value="Gerente Comercial">Gerente Comercial</option>
                    </select>
                  </div>

                  <div className="border-t border-white/5 my-1" />

                  {/* Credentials block */}
                  <div className="p-3 bg-black/30 rounded-xl border border-white/5 flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">🔑 Credenciales de Acceso</span>
                    
                    {/* Username */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Usuario</label>
                      <input
                        id="collab-input-username"
                        type="text"
                        required
                        value={collabUsername}
                        onChange={(e) => setCollabUsername(e.target.value)}
                        placeholder="Ej. martin"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-white/5 bg-black/40 text-white focus:outline-none focus:border-amber-500/50 font-mono"
                      />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Contraseña</label>
                      <input
                        id="collab-input-password"
                        type="text"
                        required
                        value={collabPassword}
                        onChange={(e) => setCollabPassword(e.target.value)}
                        placeholder="Ej. pass123"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-white/5 bg-black/40 text-white focus:outline-none focus:border-amber-500/50 font-mono"
                      />
                    </div>
                  </div>

                  {/* Admin 2 Checkbox */}
                  <div className="flex items-center gap-2.5 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 select-none">
                    <input
                      id="collab-chk-admin2"
                      type="checkbox"
                      checked={collabIsAdmin2}
                      onChange={(e) => setCollabIsAdmin2(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 bg-black border-white/10 accent-amber-500 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">¿Habilitar como Admin 2?</span>
                      <span className="text-[9px] text-gray-400 leading-tight mt-0.5">Permite ver absolutamente todo y hacer cualquier cambio.</span>
                    </div>
                  </div>

                  {/* Submit Actions */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      id="btn-add-collaborator-submit"
                      type="submit"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
                    >
                      {editingCollab ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Guardar Cambios</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Dar de Alta</span>
                        </>
                      )}
                    </button>

                    {editingCollab && (
                      <button
                        type="button"
                        onClick={handleCancelCollabEdit}
                        className="px-3 py-2.5 rounded-xl border border-red-500/20 text-red-400 font-extrabold text-xs flex items-center justify-center gap-1.5 hover:bg-red-500/10 active:scale-95 transition-all cursor-pointer"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List Panel */}
              <div className="md:col-span-7 p-6 bg-[#141414] rounded-2xl border border-white/5 flex flex-col gap-5 shadow-xl">
                <div>
                  <h3 className="font-sans font-black text-base text-white uppercase tracking-wider">Equipo de Trabajo</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Gestione los roles, credenciales y seguridad de su personal.</p>
                </div>

                {tenantCollaborators.length === 0 ? (
                  <p className="text-center text-xs text-gray-500 py-10 border border-dashed border-white/10 rounded-xl">No hay colaboradores dados de alta.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {tenantCollaborators.map((col) => (
                      <div 
                        id={`collab-row-${col.id}`}
                        key={col.id}
                        className="p-3 bg-black/30 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          {/* Profile Image Avatar */}
                          <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-black/40 flex items-center justify-center shrink-0">
                            {col.profileImage ? (
                              <img src={col.profileImage} alt={col.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full bg-amber-500/10 flex items-center justify-center font-bold text-amber-500 text-sm">
                                {col.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-white">{col.name}</span>
                            <span className="block text-[10px] text-gray-400 mt-0.5">
                              📞 {col.phone || 'Sin teléfono'} {col.email ? `| ✉️ ${col.email}` : ''}
                            </span>
                            <span className="block text-[10px] text-amber-500/80 mt-0.5">
                              Rol: <b>{col.role}</b> &bull; Usuario: <span className="font-mono bg-black/30 px-1 py-0.5 rounded text-[9px] text-gray-300">{col.username}</span>
                            </span>

                            {/* Custom descriptive badges */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {col.isAdmin2 ? (
                                <span className="text-[9px] font-extrabold uppercase bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                                  <Shield className="w-2.5 h-2.5" />
                                  <span>Admin 2</span>
                                </span>
                              ) : (
                                <span className="text-[9px] font-extrabold uppercase bg-white/5 text-gray-400 px-2 py-0.5 rounded border border-white/5">
                                  Colaborador
                                </span>
                              )}

                              {col.biometricsAuthorized ? (
                                <span className="text-[9px] font-extrabold uppercase bg-emerald-950/40 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                                  <Fingerprint className="w-2.5 h-2.5 text-emerald-400" />
                                  <span>Biometría Activa</span>
                                </span>
                              ) : (
                                <span className="text-[9px] font-medium text-gray-500 px-2 py-0.5 rounded bg-black/20">
                                  Biometría Inactiva
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions buttons */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          {/* 1. Edit */}
                          <button
                            id={`btn-edit-collab-${col.id}`}
                            onClick={() => handleEditClick(col)}
                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                            title="Editar Datos"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* 2. Remote Logout (Cerrar sesión a distancia) */}
                          <button
                            id={`btn-logout-collab-${col.id}`}
                            onClick={() => {
                              if (confirm(`¿Desea forzar el cierre de sesión a distancia para ${col.name} por seguridad?`)) {
                                onEditCollaborator({
                                  ...col,
                                  forceLogout: true
                                });
                                alert(`Cierre de sesión enviado. ${col.name} será desconectado de inmediato.`);
                              }
                            }}
                            className="p-2 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 transition-all cursor-pointer"
                            title="Cerrar Sesión a Distancia"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                          </button>

                          <div className="w-[1px] h-4 bg-white/5 mx-1" />

                          {/* 3. Delete */}
                          <button
                            id={`btn-delete-collab-${col.id}`}
                            onClick={() => {
                              if (confirm(`¿Está seguro de eliminar definitivamente el acceso de ${col.name}?`)) {
                                onDeleteCollaborator(col.id);
                              }
                            }}
                            className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                            title="Remover Colaborador"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB CONTENT: CONFIGURATION */}
        {/* ======================================================== */}
        {activeTab === 'config' && (
          <div className="flex flex-col gap-8 animate-fadeIn">
            {/* Top Config Form */}
            <form id="form-config-settings" onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* General Settings */}
              <div className="md:col-span-7 p-6 bg-[#141414] rounded-2xl border border-white/5 flex flex-col gap-6">
                <div>
                  <h3 className="font-sans font-black text-base text-white uppercase tracking-wider">Datos de Sucursal y Enlaces</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Información general del local expuesta a la canasta y el footer.</p>
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Ubicación Física (Dirección)</label>
                  <input
                    id="config-input-location"
                    type="text"
                    required
                    value={configLocation}
                    onChange={(e) => setConfigLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Teléfono / WhatsApp de Pedidos</label>
                  <input
                    id="config-input-phone"
                    type="text"
                    required
                    value={configPhone}
                    onChange={(e) => setConfigPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none"
                  />
                </div>

                {/* Instagram */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Cuenta de Instagram</label>
                  <input
                    id="config-input-instagram"
                    type="text"
                    required
                    value={configInstagram}
                    onChange={(e) => setConfigInstagram(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none"
                  />
                </div>

                <div className="border-t border-white/5 my-2" />

                <div>
                  <h3 className="font-sans font-black text-sm text-white uppercase tracking-wider">Datos del Inquilino / Propietario</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Información de contacto exclusiva para administración.</p>
                </div>

                {/* Owner Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Nombres Completos</label>
                  <input
                    id="config-owner-name"
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none"
                  />
                </div>

                {/* Owner Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Teléfono de Contacto</label>
                  <input
                    id="config-owner-phone"
                    type="text"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="Ej. +5491132904491"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none"
                  />
                </div>

                {/* Owner Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Mail del Inquilino</label>
                  <input
                    id="config-owner-email"
                    type="email"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="Ej. admin@tienda.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none"
                  />
                  <p className="text-[10px] text-gray-500 italic mt-0.5">* Al ingresar un mail válido se habilitará el flujo de cambio de contraseña a la derecha.</p>
                </div>

                <div className="border-t border-white/5 my-2" />

                <div>
                  <h3 className="font-sans font-black text-sm text-white uppercase tracking-wider">Opciones de Idioma y Prefijo</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Ajustes regionales para el catálogo y mensajería.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Language Option */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase">Idioma Predeterminado</label>
                    <select
                      id="config-language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none"
                    >
                      <option value="es" className="bg-zinc-900 text-white">Español Castellano (Predeterminado)</option>
                      <option value="en" className="bg-zinc-900 text-white">Inglés (English)</option>
                    </select>
                  </div>

                  {/* Configurable Prefix */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase">Prefijo configurable</label>
                    <input
                      id="config-phone-prefix"
                      type="text"
                      value={phonePrefix}
                      onChange={(e) => setPhonePrefix(e.target.value)}
                      placeholder="+549"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none font-mono"
                    />
                    <span className="text-[9px] text-gray-500 italic">Predeterminado: +549</span>
                  </div>
                </div>
              </div>

              {/* License & Password Change & Save */}
              <div className="md:col-span-5 flex flex-col gap-6">
                {/* License Section */}
                <div className="p-6 bg-[#141414] rounded-2xl border border-white/5 flex flex-col gap-5">
                  <div>
                    <h3 className="font-sans font-black text-base text-white uppercase tracking-wider">Clave de Licencia e Inquilino</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Seguridad crítica para el acceso de escudito.</p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase">Clave de Licencia</label>
                    <input
                      id="config-input-license"
                      type="text"
                      required
                      value={configLicenseKey}
                      onChange={(e) => setConfigLicenseKey(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-amber-500/20 bg-black/40 text-amber-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="p-3.5 bg-yellow-500/5 rounded-xl border border-yellow-500/10 flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-extrabold text-amber-500 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" /> Biometría Habilitada en Servidor
                    </span>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Los colaboradores autorizados pueden enrolar sus datos biométricos para autenticación rápida mediante FaceID / Huella dactilar.
                    </p>
                  </div>
                </div>

                {/* Password Change Flow Section */}
                <div className="p-6 bg-[#141414] rounded-2xl border border-white/5 flex flex-col gap-4">
                  <div>
                    <h3 className="font-sans font-black text-sm text-white uppercase tracking-wider">Cambio de Contraseña</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">Modificación segura de la contraseña administrador.</p>
                  </div>

                  {ownerEmail ? (
                    <div className="flex flex-col gap-3">
                      {!isRecoveryCodeSent ? (
                        <button
                          id="btn-request-pw-code"
                          type="button"
                          onClick={handleRequestPasswordCode}
                          className="w-full py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs hover:bg-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Solicitar Código de Cambio</span>
                        </button>
                      ) : (
                        <div className="flex flex-col gap-3.5 bg-black/30 p-3 rounded-xl border border-white/5 animate-fadeIn">
                          {/* Timer & Notification */}
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-amber-500 font-medium text-[10px] truncate">Código enviado a: {ownerEmail}</span>
                            <span className="font-mono font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                              ⏳ {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                            </span>
                          </div>

                          {countdown === 0 ? (
                            <div className="text-center py-2 text-red-500 text-xs font-bold">
                              El código de verificación ha expirado.
                              <button
                                type="button"
                                onClick={handleRequestPasswordCode}
                                className="block mx-auto mt-1.5 text-amber-500 underline text-[10px] cursor-pointer"
                              >
                                Volver a solicitar código
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-3">
                              {/* Enter verification code */}
                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Código de Verificación (6 dígitos)</label>
                                <input
                                  type="text"
                                  maxLength={6}
                                  value={enteredRecoveryCode}
                                  onChange={(e) => setEnteredRecoveryCode(e.target.value)}
                                  placeholder="Ej. 123456"
                                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-white/10 bg-black/40 text-white font-mono text-center focus:outline-none"
                                />
                              </div>

                              {/* New Password */}
                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Nueva Contraseña</label>
                                <input
                                  type="password"
                                  value={newOwnerPassword}
                                  onChange={(e) => setNewOwnerPassword(e.target.value)}
                                  placeholder="Contraseña nueva"
                                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-white/10 bg-black/40 text-white focus:outline-none"
                                />
                              </div>

                              {/* Confirm New Password */}
                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Confirmar Nueva Contraseña</label>
                                <input
                                  type="password"
                                  value={confirmNewOwnerPassword}
                                  onChange={(e) => setConfirmNewOwnerPassword(e.target.value)}
                                  placeholder="Repita la contraseña"
                                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-white/10 bg-black/40 text-white focus:outline-none"
                                />
                              </div>

                              <button
                                id="btn-confirm-pw-change"
                                type="button"
                                onClick={handleConfirmPasswordChange}
                                className="w-full py-2 px-3 rounded-lg bg-green-600 text-white font-bold text-[11px] hover:bg-green-500 transition-all cursor-pointer mt-1"
                              >
                                Confirmar Cambio y Guardar
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] text-gray-400 text-center leading-relaxed">
                      ⚠️ Debe ingresar el mail de contacto del inquilino a la izquierda para poder habilitar las opciones de cambio de contraseña.
                    </div>
                  )}
                </div>

                {/* Save button */}
                <button
                  id="btn-save-config"
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Configuración</span>
                </button>
              </div>
            </form>

            {/* Backups List Section */}
            <div className="p-6 bg-[#141414] rounded-2xl border border-white/5 flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-sans font-black text-base text-white uppercase tracking-wider">Copia de Seguridad de Datos</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Resguarde prendas, colaboradores, entregas y configuraciones de este inquilino.</p>
                </div>
                <button
                  id="btn-create-backup"
                  type="button"
                  onClick={handleCreateBackup}
                  className="py-2.5 px-5 rounded-xl bg-white text-black font-extrabold text-xs hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Database className="w-4 h-4 text-amber-500" />
                  <span>Hacer copia de seguridad</span>
                </button>
              </div>

              {backupsList.length === 0 ? (
                <div className="text-center py-8 bg-black/20 rounded-xl border border-dashed border-white/5 text-gray-400 text-xs font-medium">
                  No se han registrado copias de seguridad de momento. Haga clic en el botón de arriba para registrar la primera.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] uppercase font-bold text-gray-500">Copias guardadas (Máximo 5 - FIFO rota):</span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {backupsList.map((bk, idx) => (
                      <div key={bk.id} className="p-3 bg-black/30 rounded-xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[10px] font-bold text-amber-400">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="block font-bold text-white">Copia de Seguridad - Punto #{idx + 1}</span>
                            <span className="block text-[10px] text-gray-400 mt-0.5">Fecha y hora de creación: <b>{bk.date}</b></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleRestoreBackup(bk)}
                            className="px-3 py-1.5 rounded-lg bg-green-600/10 hover:bg-green-600/20 text-green-400 font-extrabold text-[10px] uppercase border border-green-500/20 cursor-pointer transition-all flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3 animate-spin animate-duration-3000" />
                            <span>Restaurar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBackup(bk.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-500 cursor-pointer transition-all"
                            title="Eliminar Copia"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* QR Code Page Section */}
            <div className="p-6 bg-[#141414] rounded-2xl border border-white/5 flex flex-col gap-6">
              <div>
                <h3 className="font-sans font-black text-base text-white uppercase tracking-wider">Código QR - Acceso Directo Público</h3>
                <p className="text-xs text-gray-400 mt-0.5">Imprima el flyer con código QR para colgar en su local comercial.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Visual rendering of the QR */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-black/40 rounded-xl border border-white/5 text-center">
                  <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-md">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/?codigo=${tenant.id}`)}`}
                      alt="Local QR Code"
                      className="w-40 h-40 object-cover"
                    />
                  </div>
                  <span className="block text-[10px] text-gray-400 mt-3 font-mono">ID de Inquilino: {tenant.id}</span>
                </div>

                {/* Details & Action Button */}
                <div className="md:col-span-8 flex flex-col gap-4 text-xs">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-2">
                    <span className="font-bold text-white uppercase tracking-wide text-[11px] block">Detalles del Flyer a imprimir:</span>
                    <ul className="list-disc pl-4 text-gray-400 space-y-1">
                      <li><b>Cabecera:</b> Nombre del local (<span className="text-amber-400 font-bold">{tenant.name}</span>)</li>
                      <li><b>Medio:</b> Código QR de redirección automática</li>
                      <li><b>Pie de página:</b> <span className="italic text-gray-300">"Escanee el QR y veras todas los productos y ofertas."</span></li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      id="btn-print-qr-pdf"
                      type="button"
                      onClick={handlePrintQR}
                      className="py-3 px-5 rounded-xl bg-amber-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Imprimir QR en PDF</span>
                    </button>
                    <div className="flex-1 min-w-0 bg-black/40 px-3 py-2.5 rounded-xl border border-white/5 flex items-center justify-between gap-2 text-gray-400">
                      <span className="truncate font-mono text-[10px]">{window.location.origin}/?tenant={tenant.id}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/?codigo=${tenant.id}`);
                          alert('¡Enlace copiado al portapapeles!');
                        }}
                        className="p-1 hover:bg-white/5 rounded text-amber-500 text-[10px] cursor-pointer"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* PRODUCT ADD / EDIT DIALOG/MODAL */}
      {/* ======================================================== */}
      {showAddProdModal && (
        <div id="product-add-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div onClick={() => setShowAddProdModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" />
          
          {/* Panel */}
          <form 
            id="product-edit-form"
            onSubmit={handleSaveProductSubmit}
            className="relative bg-[#141414] border border-yellow-600/30 rounded-3xl w-full max-w-xl p-6 sm:p-8 flex flex-col gap-5 text-left text-xs text-gray-300 max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="font-sans font-extrabold text-base uppercase text-amber-500">
                {editingProduct ? 'Editar Prenda' : 'Añadir Nueva Prenda'}
              </h3>
              <button 
                id="btn-close-product-modal"
                type="button" 
                onClick={() => setShowAddProdModal(false)} 
                className="p-1 rounded-full hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Nombre de Prenda</label>
                <input
                  id="prod-input-name"
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Ej. Buzo Oversize Crew"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none"
                />
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Precio ($ ARS)</label>
                <input
                  id="prod-input-price"
                  type="number"
                  required
                  value={prodPrice}
                  onChange={(e) => setProdPrice(Number(e.target.value))}
                  placeholder="48000"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Categoría</label>
                <select
                  id="prod-select-category"
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none cursor-pointer"
                >
                  {categories.filter(c => c !== 'Todos').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Stock */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Cantidad de Stock</label>
                <input
                  id="prod-input-stock"
                  type="number"
                  required
                  value={prodStock}
                  onChange={(e) => setProdStock(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none"
                />
              </div>

              {/* Barcode / QR Field */}
              <div className="flex flex-col sm:col-span-2 gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Código de Barra / QR (para escaneo)</label>
                <input
                  id="prod-input-barcode"
                  type="text"
                  value={prodBarcode}
                  onChange={(e) => setProdBarcode(e.target.value)}
                  placeholder="Ej. 7791234567890 o código QR único"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none font-mono"
                />
              </div>

              {/* Multi image upload from PC/Mobile - UP TO 5 IMAGES */}
              <div className="flex flex-col sm:col-span-2 gap-2.5">
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">
                  Imágenes de la Prenda (Hasta 5 - Subir de PC/Móvil o pegar URL)
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const currentUrl = prodImageUrls[idx] || '';
                    
                    const handleImageFileChange = (index: number, file: File | null) => {
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const result = event.target?.result as string;
                        if (result) {
                          const nextUrls = [...prodImageUrls];
                          nextUrls[index] = result;
                          setProdImageUrls(nextUrls);
                          if (index === 0) {
                            setProdImageUrl(result);
                          }
                        }
                      };
                      reader.readAsDataURL(file);
                    };

                    return (
                      <div 
                        key={idx} 
                        className="relative p-2 rounded-2xl bg-black/30 border border-white/5 flex flex-col items-center justify-center gap-2 text-center"
                      >
                        {/* Thumbnail Preview */}
                        <div className="w-16 h-16 rounded-xl border border-white/5 bg-zinc-950 overflow-hidden flex items-center justify-center relative">
                          {currentUrl ? (
                            <img src={currentUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <Image className="w-5 h-5 text-gray-600" />
                          )}
                          {currentUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                const nextUrls = [...prodImageUrls];
                                nextUrls[idx] = '';
                                setProdImageUrls(nextUrls);
                                if (idx === 0) setProdImageUrl('');
                              }}
                              className="absolute top-0.5 right-0.5 p-0.5 bg-red-600 text-white rounded-full text-[9px] hover:scale-110 cursor-pointer w-4 h-4 flex items-center justify-center font-bold"
                              title="Eliminar"
                            >
                              &times;
                            </button>
                          )}
                        </div>

                        {/* Image actions */}
                        <div className="w-full flex flex-col gap-1">
                          <label className="flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 font-bold cursor-pointer text-[10px] transition-colors">
                            <Upload className="w-3 h-3 text-amber-500" />
                            <span>Subir file</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                handleImageFileChange(idx, file);
                              }}
                            />
                          </label>
                          <input
                            type="text"
                            value={currentUrl}
                            onChange={(e) => {
                              const val = e.target.value;
                              const nextUrls = [...prodImageUrls];
                              nextUrls[idx] = val;
                              setProdImageUrls(nextUrls);
                              if (idx === 0) {
                                setProdImageUrl(val);
                              }
                            }}
                            placeholder="Enlace URL..."
                            className="w-full px-1.5 py-1 text-[9px] bg-black border border-white/5 rounded text-white text-center focus:outline-none"
                          />
                        </div>
                        <span className="text-[9px] text-gray-500 font-bold uppercase">Foto {idx + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sizes Selection checkboxes */}
              <div className="flex flex-col sm:col-span-2 gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Habilitar Talles (Selecciona los disponibles)</label>
                <div className="flex flex-wrap gap-2 py-1">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => {
                    const isSelected = prodSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          if (prodSizes.includes(size)) {
                            setProdSizes(prodSizes.filter(s => s !== size));
                          } else {
                            setProdSizes([...prodSizes, size]);
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer"
                        style={{
                          backgroundColor: isSelected ? '#d97706' : 'transparent',
                          color: isSelected ? '#000000' : '#a3a3a3',
                          borderColor: isSelected ? '#d97706' : 'rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom dynamic fields / specifications */}
              <div className="flex flex-col sm:col-span-2 gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-400 uppercase">Campos y Especificaciones Adicionales</label>
                  <button
                    type="button"
                    onClick={() => setProdExtraFields([...prodExtraFields, { name: '', value: '' }])}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 hover:text-amber-400 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Añadir Atributo</span>
                  </button>
                </div>

                {prodExtraFields.length === 0 ? (
                  <p className="text-[10px] text-gray-500 italic p-3 bg-black/20 rounded-xl border border-white/5">
                    No hay atributos adicionales de momento. Pulsa "+ Añadir Atributo" para sumar campos como Material, Confección, Fit o Tipo de cierre.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {prodExtraFields.map((field, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) => {
                            const updated = [...prodExtraFields];
                            updated[idx].name = e.target.value;
                            setProdExtraFields(updated);
                          }}
                          placeholder="Nombre (ej: Material)"
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none"
                        />
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => {
                            const updated = [...prodExtraFields];
                            updated[idx].value = e.target.value;
                            setProdExtraFields(updated);
                          }}
                          placeholder="Valor (ej: Algodón 100%)"
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setProdExtraFields(prodExtraFields.filter((_, i) => i !== idx))}
                          className="p-2 rounded-xl bg-red-950/40 text-red-400 border border-red-500/20 hover:bg-red-950 transition-colors cursor-pointer"
                          title="Quitar campo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col sm:col-span-2 gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Descripción / Detalles de Confección</label>
                <textarea
                  id="prod-input-description"
                  rows={2}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Materiales, calce, colores..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none resize-none"
                />
              </div>

              {/* Promo & Offer checkboxes */}
              <div className="flex items-center gap-6 py-2 sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    id="prod-chk-promo"
                    type="checkbox"
                    checked={prodIsPromo}
                    onChange={(e) => setProdIsPromo(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                  />
                  <span>Destacar como PROMO ⚡️</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    id="prod-chk-offer"
                    type="checkbox"
                    checked={prodIsOffer}
                    onChange={(e) => setProdIsOffer(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                  />
                  <span>Destacar como OFERTA 🔥</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-white/5 mt-2">
              <button
                id="btn-cancel-product-modal"
                type="button"
                onClick={() => setShowAddProdModal(false)}
                className="py-2.5 px-5 rounded-xl border border-white/10 hover:bg-white/5 font-bold transition-all text-gray-400 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                id="btn-save-product-modal"
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-amber-500 text-black font-extrabold hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {editingProduct ? 'Guardar Cambios' : 'Añadir Prenda'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Barcode scanner component */}
      <BarcodeScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        products={products}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
}
