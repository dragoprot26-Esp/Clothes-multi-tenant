import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingCart, Plus, Minus, Info } from 'lucide-react';
import { Product, TenantConfig } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  tenant: TenantConfig;
  onAddToCart: (product: Product, size: string, qty: number) => void;
}

export default function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  tenant,
  onAddToCart
}: ProductDetailsModalProps) {
  if (!product || !isOpen) return null;

  const isDark = tenant.theme.backgroundColor === '#0d0d0d' || tenant.theme.backgroundColor === '#0f172a' || tenant.theme.backgroundColor === '#0a0a0a';
  const isCyc = tenant.id === 'cyc-elegance';

  const defaultSizes = ['S', 'M', 'L', 'XL'];
  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : [];

  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);
  const [added, setAdded] = useState<boolean>(false);

  // Get list of images
  const images = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls 
    : [product.imageUrl];

  // Auto transition slideshow effect
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }, 3500);

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

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div id="product-details-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        onClick={onClose} 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" 
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
        style={{ 
          backgroundColor: isCyc ? '#121212' : tenant.theme.cardColor, 
          borderColor: isCyc ? 'rgba(255, 255, 255, 0.08)' : `${tenant.theme.primaryColor}20`,
          color: isCyc ? '#f4f4f5' : tenant.theme.textColor
        }}
      >
        {/* Left Side: Images Carousel */}
        <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto md:h-full bg-zinc-950 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImgIndex}
              src={images[currentImgIndex]}
              alt={product.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>

          {/* Carousel Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white cursor-pointer transition-all border border-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white cursor-pointer transition-all border border-white/10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImgIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImgIndex ? 'bg-[#C5A059] scale-125' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            {product.isPromo && (
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-black bg-amber-400">
                Promo ⚡️
              </span>
            )}
            {product.isOffer && (
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white bg-red-600 animate-pulse">
                Oferta 🔥
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Product Customizations */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          {/* Close button */}
          <button
            id="btn-close-details-modal"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/40 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col gap-5">
            {/* Category & Title */}
            <div>
              <span 
                className="text-xs uppercase font-extrabold tracking-widest block mb-1"
                style={{ color: isCyc ? '#C5A059' : tenant.theme.primaryColor }}
              >
                {product.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium leading-tight text-white">
                {product.name}
              </h2>
              {product.barcode && (
                <span className="text-[10px] text-zinc-500 font-mono tracking-wider block mt-1">
                  CÓD: {product.barcode}
                </span>
              )}
            </div>

            {/* Price & Stock info */}
            <div className="flex items-baseline gap-4 py-2 border-y" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
              <span className="text-2xl sm:text-3xl font-bold text-white">
                ${product.price.toLocaleString('es-AR')}
              </span>
              <span className="text-xs">
                {product.stock > 0 ? (
                  <span className="text-emerald-500 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full">
                    {product.stock} unidades en stock
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold bg-red-500/10 px-2.5 py-1 rounded-full">
                    Sin Stock disponible
                  </span>
                )}
              </span>
            </div>

            {/* Detalle description */}
            <div>
              <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-wider mb-1.5">Detalle de Prenda</h4>
              <p className="text-sm text-zinc-300 leading-relaxed italic">
                {product.description || "Sin descripción adicional de confección."}
              </p>
            </div>

            {/* Dynamic fields specifications if they exist */}
            {product.extraFields && product.extraFields.length > 0 && (
              <div>
                <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-wider mb-2">Especificaciones</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {product.extraFields.map((field, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-black/25 border border-white/5 flex flex-col gap-0.5">
                      <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">{field.name}</span>
                      <span className="text-white font-medium">{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Selectable */}
            {product.stock > 0 && availableSizes.length > 0 && (
              <div className="flex flex-col gap-2">
                <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Talles Disponibles</h4>
                <div className="flex gap-2 flex-wrap">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className="px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer min-w-[40px] flex items-center justify-center"
                      style={{
                        backgroundColor: selectedSize === size 
                          ? (isCyc ? '#C5A059' : tenant.theme.primaryColor)
                          : 'transparent',
                        color: selectedSize === size 
                          ? '#000000' 
                          : '#ffffff',
                        borderColor: selectedSize === size 
                          ? (isCyc ? '#C5A059' : tenant.theme.primaryColor)
                          : 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex flex-col gap-2">
                <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Cantidad</h4>
                <div className="flex items-center border border-white/10 rounded-xl bg-black/20 overflow-hidden w-fit">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="p-2 hover:bg-white/5 transition-colors cursor-pointer text-zinc-400 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 text-sm font-bold text-white min-w-[30px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                    className="p-2 hover:bg-white/5 transition-colors cursor-pointer text-zinc-400 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Add to Basket Action */}
          <div className="pt-6 mt-6 border-t border-white/5">
            <button
              onClick={handleAddToCartClick}
              disabled={product.stock === 0 || added}
              className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                isCyc && !added ? 'bg-[#C5A059] text-black hover:bg-[#b08e4d]' : ''
              }`}
              style={isCyc && !added ? undefined : {
                backgroundColor: added ? '#22c55e' : tenant.theme.primaryColor,
                color: '#000000'
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{added ? '¡Agregado con éxito!' : 'Agregar a la Canasta'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
