import { TenantConfig, Product, Comment, Collaborator, Delivery } from './types';

export const INITIAL_TENANTS: TenantConfig[] = [
  {
    id: 'cyc-elegance',
    name: 'Cyc Boutique Glamour',
    slogan: 'Moda sofisticada y de alta costura para marcar tendencia.',
    logoUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=200',
    bannerUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
    bannerLayout: 'transparent-center',
    location: 'Av. Corrientes 1450, Buenos Aires, Argentina',
    phone: '+54 11 4832-9201',
    instagram: '@cyc.boutique_ok',
    licenseKey: 'CYC-2026',
    theme: {
      primaryColor: '#C5A059', // Elegant Gold
      secondaryColor: '#0a0a0a', // Deep dark
      backgroundColor: '#0a0a0a', // Deep black background
      cardColor: '#121212', // Warm black card
      textColor: '#f4f4f5', // Zinc-100 text
      accentColor: '#C5A059', // Elegant Gold accent
      adminTheme: 'cyc-gold'
    }
  },
  {
    id: 'urban-retro',
    name: 'Urban Streetwear',
    slogan: 'Prendas urbanas, oversize y estilo rebelde para la calle.',
    logoUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=200',
    bannerUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800',
    bannerLayout: 'left',
    location: 'Palermo Soho, Honduras 4720, BA',
    phone: '+54 11 5900-3312',
    instagram: '@urbanstreet.style',
    licenseKey: 'URBAN-99',
    theme: {
      primaryColor: '#10b981', // Neon green
      secondaryColor: '#1e293b', // Slate
      backgroundColor: '#0f172a', // Dark slate
      cardColor: '#1e293b', // Card slate
      textColor: '#f8fafc',
      accentColor: '#34d399',
      adminTheme: 'modern-dark'
    }
  },
  {
    id: 'eco-threads',
    name: 'Eco-Threads Organic',
    slogan: 'Algodón 100% orgánico, lino noble y procesos eco-sustentables.',
    logoUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=200',
    bannerUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=800',
    bannerLayout: 'center',
    location: 'San Isidro, Libertador 16400, Buenos Aires',
    phone: '+54 11 3290-4491',
    instagram: '@eco_threads_ar',
    licenseKey: 'ECO-SUSTAINABLE',
    theme: {
      primaryColor: '#065f46', // Deep Emerald
      secondaryColor: '#f5f5f4', // Soft Stone light
      backgroundColor: '#fafaf9', // Linen white
      cardColor: '#ffffff', // Clean white
      textColor: '#1c1917', // Dark stone text
      accentColor: '#059669',
      adminTheme: 'sleek-light'
    }
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // CYC Elegance Products
  {
    id: 'cyc-p1',
    tenantId: 'cyc-elegance',
    name: 'Vestido Gala Noche Gold',
    description: 'Vestido de fiesta confeccionado en satén premium drapeado con detalles metálicos.',
    price: 185000,
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=500',
    imageUrls: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=500'
    ],
    sizes: ['S', 'M', 'L'],
    barcode: '7791234567890',
    category: 'Promo',
    isPromo: true,
    isOffer: false,
    stock: 5
  },
  {
    id: 'cyc-p2',
    tenantId: 'cyc-elegance',
    name: 'Blazer Entallado Imperial',
    description: 'Saco corte sastre italiano con doble botonadura y solapas de seda.',
    price: 125000,
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=500',
    imageUrls: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=500'
    ],
    sizes: ['M', 'L', 'XL'],
    barcode: '7799876543210',
    category: 'Ofertas',
    isPromo: false,
    isOffer: true,
    stock: 8
  },
  {
    id: 'cyc-p3',
    tenantId: 'cyc-elegance',
    name: 'Remera Hilos Lúrex',
    description: 'Básico sofisticado con sutil destello de hilos metálicos dorados.',
    price: 32000,
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=500',
    category: 'Remeras',
    isPromo: false,
    isOffer: false,
    stock: 20
  },
  {
    id: 'cyc-p4',
    tenantId: 'cyc-elegance',
    name: 'Pantalón Sastrero Palazzo',
    description: 'Pantalón tiro alto con pinzas y caída espectacular.',
    price: 78000,
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=500',
    category: 'Pantalones',
    isPromo: false,
    isOffer: false,
    stock: 12
  },
  {
    id: 'cyc-p5',
    tenantId: 'cyc-elegance',
    name: 'Tapado Paño Camel Luxe',
    description: 'Tapado largo confeccionado en lana y cachemira, ideal para bajas temperaturas.',
    price: 240000,
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=500',
    category: 'Buzos', // Using as outwear category
    isPromo: true,
    isOffer: false,
    stock: 3
  },

  // Urban Streetwear Products
  {
    id: 'urb-p1',
    tenantId: 'urban-retro',
    name: 'Buzo Oversize "Cyber Tokyo"',
    description: 'Buzo de friza pesada con estampa refractiva e inscripciones cyberpunk.',
    price: 48000,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=500',
    category: 'Buzos',
    isPromo: false,
    isOffer: false,
    stock: 15
  },
  {
    id: 'urb-p2',
    tenantId: 'urban-retro',
    name: 'Remera Acid Wash "Grunge"',
    description: 'Remera 100% algodón lavado al ácido, de calce cuadrado y hombros caídos.',
    price: 26000,
    imageUrl: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=500',
    category: 'Remeras',
    isPromo: false,
    isOffer: false,
    stock: 25
  },
  {
    id: 'urb-p3',
    tenantId: 'urban-retro',
    name: 'Cargo Pants Multi-Bolsillos',
    description: 'Pantalón cargo técnico ajustable en tobillos, tela ripstop ultra-resistente.',
    price: 64000,
    imageUrl: 'https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=500',
    category: 'Pantalones',
    isPromo: true,
    isOffer: false,
    stock: 10
  },
  {
    id: 'urb-p4',
    tenantId: 'urban-retro',
    name: 'Campera Bomber Neon Line',
    description: 'Campera corta impermeable con vivos refractivos y mangas voluminosas.',
    price: 89000,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=500',
    category: 'Promo',
    isPromo: true,
    isOffer: false,
    stock: 6
  },

  // Eco-Threads Organic Products
  {
    id: 'eco-p1',
    tenantId: 'eco-threads',
    name: 'Remera Lino Soft Verde Oliva',
    description: 'Remera ligera tejida en lino 100% biodegradable con tinturas vegetales.',
    price: 34000,
    imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=500',
    category: 'Remeras',
    isPromo: false,
    isOffer: false,
    stock: 18
  },
  {
    id: 'eco-p2',
    tenantId: 'eco-threads',
    name: 'Pantalón Lino Relajado Arena',
    description: 'Pantalón con cintura elástica y cordón ajustable, calce fresco y transpirable.',
    price: 59000,
    imageUrl: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&q=80&w=500',
    category: 'Pantalones',
    isPromo: false,
    isOffer: false,
    stock: 14
  },
  {
    id: 'eco-p3',
    tenantId: 'eco-threads',
    name: 'Saco Cáñamo y Algodón',
    description: 'Saco liviano unisex ideal para las tardes frescas, botones de coco reciclado.',
    price: 92000,
    imageUrl: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=500',
    category: 'Promo',
    isPromo: true,
    isOffer: false,
    stock: 7
  },
  {
    id: 'eco-p4',
    tenantId: 'eco-threads',
    name: 'Suéter Hilo Orgánico',
    description: 'Suéter de cuello redondo tejido a mano en hilo de algodón regenerado.',
    price: 74000,
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=500',
    category: 'Buzos',
    isPromo: false,
    isOffer: true,
    stock: 8
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    tenantId: 'cyc-elegance',
    author: 'Mariana Peralta',
    text: '¡El vestido es espectacular! Fui la atracción de la fiesta. La calidad de la tela es excelente y la atención impecable.',
    rating: 5,
    date: '10/07/2026',
    approved: true
  },
  {
    id: 'c2',
    tenantId: 'cyc-elegance',
    author: 'Gabriel S.',
    text: 'Muy buen blazer, las solapas satinadas son un gol de media cancha. La entrega fue puntual en Caballito.',
    rating: 5,
    date: '12/07/2026',
    approved: true
  },
  {
    id: 'c3',
    tenantId: 'cyc-elegance',
    author: 'Lucía Fernández',
    text: 'La remera de lúrex brilla hermoso pero me quedó un poco justa. Excelente predisposición para el cambio.',
    rating: 4,
    date: '14/07/2026',
    approved: true
  },
  {
    id: 'c4',
    tenantId: 'cyc-elegance',
    author: 'Esteban Domínguez',
    text: 'Hola, quería consultar si tienen stock de pantalones sastreros talle 44. ¡Me encanta la colección!',
    rating: 4,
    date: '15/07/2026',
    approved: false // Pending approval
  },

  // Urban Retro
  {
    id: 'c5',
    tenantId: 'urban-retro',
    author: 'Thiago R.',
    text: 'El buzo Cyber Tokyo es una locura total, súper abrigado y facha total. 10/10.',
    rating: 5,
    date: '13/07/2026',
    approved: true
  },
  {
    id: 'c6',
    tenantId: 'urban-retro',
    author: 'Santi DJ',
    text: 'Espectaculares cargos, muy cómodos para andar con la bici o tocar en cabina.',
    rating: 5,
    date: '14/07/2026',
    approved: true
  },

  // Eco-threads
  {
    id: 'c7',
    tenantId: 'eco-threads',
    author: 'Clara Silveira',
    text: 'Buscaba prendas sustentables reales y encontré mi lugar. El lino es suave e increíblemente fresco.',
    rating: 5,
    date: '11/07/2026',
    approved: true
  }
];

export const INITIAL_COLLABORATORS: Collaborator[] = [
  {
    id: 'col-1',
    tenantId: 'cyc-elegance',
    name: 'Carolina V.',
    role: 'Editor de Contenidos',
    email: 'carolina@cyc.com',
    active: true,
    phone: '1122334455',
    username: 'carolina',
    password: '123',
    isAdmin2: false,
    firstLoginAttempted: false,
    biometricsAuthorized: false,
    forceLogout: false
  },
  {
    id: 'col-2',
    tenantId: 'cyc-elegance',
    name: 'Marcelo Gómez',
    role: 'Encargado de Stock',
    email: 'marcelo.g@cyc.com',
    active: true,
    phone: '1133445566',
    username: 'marcelo',
    password: '123',
    isAdmin2: true, // admin 2 example
    firstLoginAttempted: false,
    biometricsAuthorized: false,
    forceLogout: false
  },
  {
    id: 'col-3',
    tenantId: 'urban-retro',
    name: 'Kev Street',
    role: 'Diseñador Gráfico',
    email: 'kevin@urbanretro.com',
    active: true,
    phone: '1144556677',
    username: 'kev',
    password: '123',
    isAdmin2: false,
    firstLoginAttempted: false,
    biometricsAuthorized: false,
    forceLogout: false
  }
];

export const DEFAULT_CATEGORIES = ['Todos', 'Promo', 'Ofertas', 'Remeras', 'Buzos', 'Pantalones'];

export function generateMockDeliveries(products: Product[]): Delivery[] {
  const deliveries: Delivery[] = [];
  const today = new Date();
  
  // Helper to subtract days
  const subtractDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };
  
  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Find products for each tenant
  const cycProducts = products.filter(p => p.tenantId === 'cyc-elegance');
  const urbanProducts = products.filter(p => p.tenantId === 'urban-retro');
  const ecoProducts = products.filter(p => p.tenantId === 'eco-threads');

  // Let's seed cyc-elegance deliveries
  if (cycProducts.length > 0) {
    // Today
    deliveries.push({
      id: 'del-cyc-1',
      tenantId: 'cyc-elegance',
      productId: cycProducts[0].id,
      productName: cycProducts[0].name,
      productBarcode: cycProducts[0].barcode || '7791234567890',
      quantity: 1,
      size: 'M',
      price: cycProducts[0].price,
      totalPrice: cycProducts[0].price,
      date: formatDate(today),
      deliveredBy: 'Carolina V.'
    });

    deliveries.push({
      id: 'del-cyc-2',
      tenantId: 'cyc-elegance',
      productId: (cycProducts[1] || cycProducts[0]).id,
      productName: (cycProducts[1] || cycProducts[0]).name,
      productBarcode: (cycProducts[1] || cycProducts[0]).barcode || '7791234567891',
      quantity: 1,
      size: 'S',
      price: (cycProducts[1] || cycProducts[0]).price,
      totalPrice: (cycProducts[1] || cycProducts[0]).price,
      date: formatDate(today),
      deliveredBy: 'Admin Inquilino'
    });

    // Yesterday (1 day ago)
    deliveries.push({
      id: 'del-cyc-3',
      tenantId: 'cyc-elegance',
      productId: (cycProducts[2] || cycProducts[0]).id,
      productName: (cycProducts[2] || cycProducts[0]).name,
      productBarcode: (cycProducts[2] || cycProducts[0]).barcode || '7791234567892',
      quantity: 2,
      size: 'L',
      price: (cycProducts[2] || cycProducts[0]).price,
      totalPrice: (cycProducts[2] || cycProducts[0]).price * 2,
      date: formatDate(subtractDays(today, 1)),
      deliveredBy: 'Marcelo Gómez'
    });

    // 4 days ago
    deliveries.push({
      id: 'del-cyc-4',
      tenantId: 'cyc-elegance',
      productId: cycProducts[0].id,
      productName: cycProducts[0].name,
      productBarcode: cycProducts[0].barcode || '7791234567890',
      quantity: 1,
      size: 'M',
      price: cycProducts[0].price,
      totalPrice: cycProducts[0].price,
      date: formatDate(subtractDays(today, 4)),
      deliveredBy: 'Carolina V.'
    });

    // 10 days ago (this month)
    deliveries.push({
      id: 'del-cyc-5',
      tenantId: 'cyc-elegance',
      productId: (cycProducts[1] || cycProducts[0]).id,
      productName: (cycProducts[1] || cycProducts[0]).name,
      productBarcode: (cycProducts[1] || cycProducts[0]).barcode || '7791234567891',
      quantity: 1,
      size: 'L',
      price: (cycProducts[1] || cycProducts[0]).price,
      totalPrice: (cycProducts[1] || cycProducts[0]).price,
      date: formatDate(subtractDays(today, 10)),
      deliveredBy: 'Admin Inquilino'
    });

    // 25 days ago (this month)
    deliveries.push({
      id: 'del-cyc-6',
      tenantId: 'cyc-elegance',
      productId: (cycProducts[2] || cycProducts[0]).id,
      productName: (cycProducts[2] || cycProducts[0]).name,
      productBarcode: (cycProducts[2] || cycProducts[0]).barcode || '7791234567892',
      quantity: 1,
      size: 'M',
      price: (cycProducts[2] || cycProducts[0]).price,
      totalPrice: (cycProducts[2] || cycProducts[0]).price,
      date: formatDate(subtractDays(today, 25)),
      deliveredBy: 'Marcelo Gómez'
    });

    // 45 days ago (this year)
    deliveries.push({
      id: 'del-cyc-7',
      tenantId: 'cyc-elegance',
      productId: cycProducts[0].id,
      productName: cycProducts[0].name,
      productBarcode: cycProducts[0].barcode || '7791234567890',
      quantity: 1,
      size: 'S',
      price: cycProducts[0].price,
      totalPrice: cycProducts[0].price,
      date: formatDate(subtractDays(today, 45)),
      deliveredBy: 'Carolina V.'
    });

    // 120 days ago (this year)
    deliveries.push({
      id: 'del-cyc-8',
      tenantId: 'cyc-elegance',
      productId: (cycProducts[1] || cycProducts[0]).id,
      productName: (cycProducts[1] || cycProducts[0]).name,
      productBarcode: (cycProducts[1] || cycProducts[0]).barcode || '7791234567891',
      quantity: 2,
      size: 'M',
      price: (cycProducts[1] || cycProducts[0]).price,
      totalPrice: (cycProducts[1] || cycProducts[0]).price * 2,
      date: formatDate(subtractDays(today, 120)),
      deliveredBy: 'Admin Inquilino'
    });
  }

  // Seeding urban-retro deliveries
  if (urbanProducts.length > 0) {
    deliveries.push({
      id: 'del-urb-1',
      tenantId: 'urban-retro',
      productId: urbanProducts[0].id,
      productName: urbanProducts[0].name,
      productBarcode: urbanProducts[0].barcode || '7792222222220',
      quantity: 2,
      size: 'XL',
      price: urbanProducts[0].price,
      totalPrice: urbanProducts[0].price * 2,
      date: formatDate(today),
      deliveredBy: 'Kev Street'
    });

    deliveries.push({
      id: 'del-urb-2',
      tenantId: 'urban-retro',
      productId: (urbanProducts[1] || urbanProducts[0]).id,
      productName: (urbanProducts[1] || urbanProducts[0]).name,
      productBarcode: (urbanProducts[1] || urbanProducts[0]).barcode || '7792222222221',
      quantity: 1,
      size: 'L',
      price: (urbanProducts[1] || urbanProducts[0]).price,
      totalPrice: (urbanProducts[1] || urbanProducts[0]).price,
      date: formatDate(subtractDays(today, 3)),
      deliveredBy: 'Admin Inquilino'
    });

    deliveries.push({
      id: 'del-urb-3',
      tenantId: 'urban-retro',
      productId: urbanProducts[0].id,
      productName: urbanProducts[0].name,
      productBarcode: urbanProducts[0].barcode || '7792222222220',
      quantity: 1,
      size: 'L',
      price: urbanProducts[0].price,
      totalPrice: urbanProducts[0].price,
      date: formatDate(subtractDays(today, 15)),
      deliveredBy: 'Kev Street'
    });
  }

  // Seeding eco-threads deliveries
  if (ecoProducts.length > 0) {
    deliveries.push({
      id: 'del-eco-1',
      tenantId: 'eco-threads',
      productId: ecoProducts[0].id,
      productName: ecoProducts[0].name,
      productBarcode: ecoProducts[0].barcode || '7793333333330',
      quantity: 1,
      size: 'M',
      price: ecoProducts[0].price,
      totalPrice: ecoProducts[0].price,
      date: formatDate(today),
      deliveredBy: 'Admin Inquilino'
    });

    deliveries.push({
      id: 'del-eco-2',
      tenantId: 'eco-threads',
      productId: (ecoProducts[1] || ecoProducts[0]).id,
      productName: (ecoProducts[1] || ecoProducts[0]).name,
      productBarcode: (ecoProducts[1] || ecoProducts[0]).barcode || '7793333333331',
      quantity: 1,
      size: 'S',
      price: (ecoProducts[1] || ecoProducts[0]).price,
      totalPrice: (ecoProducts[1] || ecoProducts[0]).price,
      date: formatDate(subtractDays(today, 5)),
      deliveredBy: 'Admin Inquilino'
    });
  }

  return deliveries;
}
