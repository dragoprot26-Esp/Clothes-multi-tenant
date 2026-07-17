import React, { useState } from 'react';
import { Share2, MapPin, Shield, ShoppingBag, Check, MessageCircle, Facebook, Twitter, Send, Copy, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { TenantConfig, CartItem } from '../types';

interface HeaderProps {
  tenant: TenantConfig;
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenAdminLogin: () => void;
  onOpenLocation: () => void;
}

export default function Header({
  tenant,
  cart,
  onOpenCart,
  onOpenAdminLogin,
  onOpenLocation
}: HeaderProps) {
  const [copied, setCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/?codigo=${tenant.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCyc = tenant.id === 'cyc-elegance';
  
  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/?codigo=${tenant.id}` : `https://tienda.cyc.com/?codigo=${tenant.id}`;
  const encodedUrl = encodeURIComponent(currentUrl);
  const shareText = `¡Te recomiendo visitar la tienda ${tenant.name}! 🌟 Moda y tendencias espectaculares.`;
  const encodedText = encodeURIComponent(shareText);

  // Social share links
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;

  return (
    <header 
      id="header-main"
      className="sticky top-0 z-40 w-full backdrop-blur-md shadow-sm border-b transition-colors duration-300"
      style={{ 
        backgroundColor: isCyc ? '#0a0a0acc' : `${tenant.theme.backgroundColor}cc`,
        borderColor: isCyc ? 'rgba(255, 255, 255, 0.1)' : `${tenant.theme.primaryColor}20`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between relative">
        {/* LOGO & BRAND NAME */}
        <div id="header-logo-section" className="flex items-center gap-3">
          <img 
            id="tenant-header-logo"
            src={tenant.logoUrl} 
            alt={tenant.name} 
            className="w-10 h-10 rounded-full object-cover border-2 shadow-inner"
            style={{ borderColor: isCyc ? '#C5A059' : tenant.theme.primaryColor }}
            referrerPolicy="no-referrer"
          />
          <span 
            id="tenant-header-name"
            className="hidden md:inline font-sans font-bold tracking-tight text-lg"
            style={{ color: isCyc ? '#f4f4f5' : tenant.theme.textColor }}
          >
            {tenant.name}
          </span>
        </div>

        {/* SHOPPING CART IN THE DEAD MIDDLE */}
        <div 
          id="header-cart-middle"
          className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10 mx-2"
        >
          {isCyc ? (
            <button
              id="btn-open-cart-middle"
              onClick={onOpenCart}
              className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 px-6 py-2.5 rounded-full border border-white/10 transition-all duration-200 cursor-pointer hover:border-white/20 active:scale-95 text-zinc-100"
            >
              <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
              <span className="text-xs uppercase tracking-widest font-semibold">{totalItems} PRODUCTO{totalItems !== 1 ? 'S' : ''}</span>
            </button>
          ) : (
            <button
              id="btn-open-cart-middle"
              onClick={onOpenCart}
              className="relative flex items-center justify-center p-3 rounded-full shadow-lg border hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              style={{ 
                backgroundColor: tenant.theme.primaryColor,
                borderColor: tenant.theme.accentColor,
              }}
              title="Ver Canasta"
            >
              <ShoppingBag className="w-6 h-6 text-black font-bold" />
              {totalItems > 0 && (
                <span 
                  id="cart-badge-count"
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse"
                  style={{ 
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>
          )}
        </div>

        {/* RIGHT ACTIONS Bar (Compartir, Ubicacion, Escudito Admin) */}
        <div id="header-right-actions" className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* SHARE BUTTON */}
          <button
            id="btn-share-page"
            onClick={handleShare}
            className={`flex items-center gap-1 sm:gap-2 px-4 py-2 rounded-full border text-xs font-medium transition-all hover:scale-105 cursor-pointer ${
              isCyc 
                ? 'bg-white/5 hover:bg-white/10 border-white/10 uppercase tracking-widest text-zinc-100' 
                : 'hover:opacity-90 active:scale-95'
            }`}
            style={isCyc ? undefined : { 
              borderColor: `${tenant.theme.primaryColor}40`,
              color: tenant.theme.textColor,
              backgroundColor: `${tenant.theme.primaryColor}10`
            }}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-500" />
                <span className="hidden sm:inline">Copiado</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Compartir</span>
              </>
            )}
          </button>

          {/* LOCATION BUTTON */}
          <button
            id="btn-location-header"
            onClick={onOpenLocation}
            className={`flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all hover:scale-105 cursor-pointer ${
              isCyc 
                ? 'bg-transparent border-0 text-zinc-400 hover:text-white uppercase tracking-tighter' 
                : 'border hover:opacity-90 active:scale-95'
            }`}
            style={isCyc ? undefined : { 
              borderColor: `${tenant.theme.primaryColor}40`,
              color: tenant.theme.textColor,
              backgroundColor: `${tenant.theme.primaryColor}10`
            }}
            title={tenant.location}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ubicación</span>
          </button>

          {/* ADMIN SHIELD ICON */}
          <button
            id="btn-admin-shield"
            onClick={onOpenAdminLogin}
            className={`flex items-center justify-center p-2 rounded-lg border transition-all cursor-pointer shadow-md ${
              isCyc 
                ? 'bg-[#C5A059]/10 border-[#C5A059]/30 hover:bg-[#C5A059]/20 text-[#C5A059]' 
                : 'hover:rotate-12'
            }`}
            style={isCyc ? undefined : { 
              borderColor: tenant.theme.primaryColor,
              backgroundColor: `${tenant.theme.primaryColor}20`,
              color: tenant.theme.textColor
            }}
            title="Acceso Administrador"
          >
            <Shield className="w-5 h-5" style={{ color: isCyc ? '#C5A059' : tenant.theme.primaryColor }} />
          </button>
        </div>
      </div>

      {/* EXQUISITE INTERACTIVE SHARE MODAL */}
      {isShareModalOpen && createPortal(
        <div id="share-options-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          {/* Backdrop */}
          <div 
            onClick={() => setIsShareModalOpen(false)} 
            className="absolute inset-0 bg-black/85 backdrop-blur-sm cursor-pointer" 
          />
          
          {/* Card Content */}
          <div 
            className="relative p-6 sm:p-8 rounded-3xl border w-full max-w-md text-center flex flex-col gap-5 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            style={{ 
              backgroundColor: tenant.theme.cardColor, 
              borderColor: tenant.theme.primaryColor,
              color: tenant.theme.textColor
            }}
          >
            {/* Header / Close button */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">Compartir en Redes</span>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Logo/Greeting */}
            <div className="flex flex-col items-center gap-3">
              <img 
                src={tenant.logoUrl} 
                alt="" 
                className="w-16 h-16 rounded-full object-cover border-2 shadow-md bg-black"
                style={{ borderColor: tenant.theme.primaryColor }}
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-sans font-black text-base uppercase tracking-wide">{tenant.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Elige una red social o WhatsApp para compartir la tienda:</p>
              </div>
            </div>

            {/* Share Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareModalOpen(false)}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 transition-all hover:scale-105"
              >
                <MessageCircle className="w-7 h-7 text-[#25D366] mb-1.5 animate-pulse" />
                <span className="text-xs font-bold text-[#25D366]">WhatsApp</span>
              </a>

              {/* Facebook */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareModalOpen(false)}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/20 transition-all hover:scale-105"
              >
                <Facebook className="w-7 h-7 text-[#1877F2] mb-1.5" />
                <span className="text-xs font-bold text-[#1877F2]">Facebook</span>
              </a>

              {/* Twitter / X */}
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareModalOpen(false)}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105"
              >
                <Twitter className="w-7 h-7 text-white mb-1.5" />
                <span className="text-xs font-bold text-white">Twitter / X</span>
              </a>

              {/* Telegram */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareModalOpen(false)}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 border border-[#0088cc]/20 transition-all hover:scale-105"
              >
                <Send className="w-7 h-7 text-[#0088cc] mb-1.5" />
                <span className="text-xs font-bold text-[#0088cc]">Telegram</span>
              </a>
            </div>

            {/* Copy link box */}
            <div className="mt-2 flex flex-col gap-2">
              <span className="text-[10px] uppercase font-black tracking-wider text-gray-500 text-left block">Copiar enlace directo:</span>
              <div className="flex gap-2 p-1.5 bg-black/40 rounded-xl border border-white/5 items-center justify-between">
                <span className="text-xs text-gray-400 font-mono truncate px-2 text-left flex-1 max-w-[200px]">
                  {currentUrl}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 hover:scale-105 transition-all cursor-pointer text-black"
                  style={{ backgroundColor: tenant.theme.primaryColor }}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-black" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-black" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
