import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, TenantConfig } from '../types';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  tenant: TenantConfig;
  onAddToCart: (product: Product, size?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export default function ProductCard({ product, tenant, onAddToCart, onSelectProduct }: ProductCardProps) {
  const isCyc = tenant.id === 'cyc-elegance';
  const defaultSizes = ['S', 'M', 'L', 'XL'];
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : defaultSizes;
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || 'M');
  const [added, setAdded] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  
  const isDark = tenant.theme.backgroundColor === '#0d0d0d' || tenant.theme.backgroundColor === '#0f172a' || tenant.theme.backgroundColor === '#0a0a0a';

  // Images slideshow configuration
  const images = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls 
    : [product.imageUrl];

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-full"
      style={{
        backgroundColor: isCyc ? 'rgba(255, 255, 255, 0.03)' : tenant.theme.cardColor,
        borderColor: isCyc ? 'rgba(255, 255, 255, 0.08)' : `${tenant.theme.primaryColor}15`
      }}
    >
      <div>
        {/* BADGES */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.isPromo && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-black shadow-md" style={{ backgroundColor: '#fbbf24' }}>
              Promo
            </span>
          )}
          {product.isOffer && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-white shadow-md animate-pulse" style={{ backgroundColor: '#ef4444' }}>
              Oferta
            </span>
          )}
          {product.stock <= 3 && product.stock > 0 && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-gray-900 text-white shadow-md">
              ¡Últimos {product.stock}!
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-red-600 text-white shadow-md">
              Sin Stock
            </span>
          )}
        </div>

        {/* PRODUCT IMAGE CAROUSEL */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-900">
          <img
            src={images[currentImgIndex]}
            alt={product.name}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />

          {/* Next/Prev Buttons inside the Card */}
          {images.length > 1 && (
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handlePrevImage}
                className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white cursor-pointer transition-all border border-white/5"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextImage}
                className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white cursor-pointer transition-all border border-white/5"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <p className="text-xs text-zinc-300 line-clamp-2">{product.description}</p>
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="p-4 flex flex-col gap-3">
          <div>
            <span 
              className="text-[10px] uppercase font-bold tracking-widest mb-1 block"
              style={{ color: isCyc ? '#C5A059' : tenant.theme.primaryColor }}
            >
              {product.category}
            </span>
            <h3 
              className={`font-sans font-bold text-base line-clamp-1 transition-colors ${isCyc ? 'group-hover:text-[#C5A059]' : 'group-hover:text-amber-500'}`}
              style={{ color: isCyc ? '#f4f4f5' : tenant.theme.textColor }}
            >
              {product.name}
            </h3>
          </div>

          {/* SIZES */}
          {product.stock > 0 && (
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Talle:</span>
              <div className="flex gap-1">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center border transition-all cursor-pointer"
                    style={{
                      backgroundColor: selectedSize === size 
                        ? (isCyc ? '#C5A059' : tenant.theme.primaryColor)
                        : 'transparent',
                      color: selectedSize === size 
                        ? '#000000' 
                        : isDark ? '#ffffff' : '#4b5563',
                      borderColor: selectedSize === size 
                        ? (isCyc ? '#C5A059' : tenant.theme.primaryColor)
                        : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PRICE & ACTION */}
      <div className="p-4 pt-0">
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: isCyc ? 'rgba(255,255,255,0.05)' : `${tenant.theme.primaryColor}10` }} onClick={(e) => e.stopPropagation()}>
          <div>
            <span className="text-xs text-zinc-500 block font-light uppercase tracking-wider">Precio</span>
            <span 
              className="font-sans font-extrabold text-lg"
              style={{ color: isCyc ? '#ffffff' : (isDark ? '#ffffff' : '#111827') }}
            >
              ${product.price.toLocaleString('es-AR')}
            </span>
          </div>

          <button
            id={`btn-add-cart-${product.id}`}
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
              isCyc && !added ? 'bg-[#C5A059] text-black border border-[#C5A059]' : ''
            }`}
            style={isCyc && !added ? undefined : {
              backgroundColor: added ? '#22c55e' : tenant.theme.primaryColor,
              color: '#000000',
              border: `1px solid ${tenant.theme.accentColor}`
            }}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Agregado</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
