import React from 'react';
import { motion } from 'motion/react';
import { TenantConfig } from '../types';

interface BannerProps {
  tenant: TenantConfig;
}

export default function Banner({ tenant }: BannerProps) {
  const isDark = tenant.theme.backgroundColor === '#0d0d0d' || tenant.theme.backgroundColor === '#0f172a';

  return (
    <div id="banner-container" className="w-full relative overflow-hidden py-8 sm:py-12 md:py-16">
      {/* Dynamic Background subtle grid/mesh pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ 
          backgroundImage: `radial-gradient(${tenant.theme.primaryColor} 1px, transparent 1px)`,
          backgroundSize: '24px 24px' 
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TRANSPARENT-CENTER LAYOUT */}
        {tenant.bannerLayout === 'transparent-center' && (
          tenant.id === 'cyc-elegance' ? (
            <div 
              id="banner-layout-elegant-split"
              className="relative rounded-2xl overflow-hidden shadow-2xl border grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[440px] md:min-h-[480px] transition-all duration-300 bg-[#0a0a0a]"
              style={{ 
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Left Column: Text Info */}
              <div className="flex flex-col justify-center px-8 sm:px-16 py-12 bg-gradient-to-r from-zinc-950/90 to-transparent z-10 relative">
                <span className="text-[#C5A059] text-xs font-semibold tracking-[0.3em] uppercase mb-4 block">
                  Nueva Colección 2024
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif mb-6 leading-tight text-white font-medium">
                  Estilo & <br />
                  <span className="italic font-light text-[#C5A059]">Sofisticación.</span>
                </h1>
                <p className="text-zinc-400 text-sm sm:text-base max-w-md leading-relaxed mb-8">
                  {tenant.slogan || "Descubre piezas exclusivas diseñadas para quienes valoran la elegancia en cada detalle."}
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      const element = document.getElementById('category-menu-container');
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-white hover:bg-zinc-200 text-black px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md"
                  >
                    Ver Catálogo
                  </button>
                </div>
              </div>

              {/* Right Column: Background cover */}
              <div className="relative bg-zinc-900 min-h-[250px] md:min-h-full">
                <div 
                  className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-90"
                  style={{ backgroundImage: `url(${tenant.bannerUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent via-transparent to-[#0a0a0a]" />
              </div>
            </div>
          ) : (
            <div 
              id="banner-layout-transparent"
              className="relative rounded-2xl overflow-hidden shadow-2xl border aspect-[16/7] md:aspect-[21/9] flex flex-col items-center justify-center text-center p-6 md:p-12 transition-all duration-300"
              style={{ 
                backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${tenant.bannerUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderColor: `${tenant.theme.primaryColor}30`
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl bg-black/40 backdrop-blur-md p-6 sm:p-8 rounded-xl border border-white/10"
              >
                <h1 
                  id="banner-title"
                  className="font-sans font-extrabold tracking-tight text-3xl sm:text-4xl md:text-5xl uppercase mb-3"
                  style={{ color: tenant.theme.primaryColor }}
                >
                  {tenant.name}
                </h1>
                <div 
                  className="w-16 h-1 mx-auto my-3 rounded-full" 
                  style={{ backgroundColor: tenant.theme.primaryColor }}
                />
                <p 
                  id="banner-slogan"
                  className="font-sans text-sm sm:text-base md:text-lg font-light text-gray-200"
                >
                  {tenant.slogan}
                </p>
              </motion.div>
            </div>
          )
        )}

        {/* CENTERED LAYOUT */}
        {tenant.bannerLayout === 'center' && (
          <div 
            id="banner-layout-center"
            className="flex flex-col items-center text-center gap-6"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full rounded-2xl overflow-hidden shadow-xl border aspect-[16/7] md:aspect-[21/9]"
              style={{ borderColor: `${tenant.theme.primaryColor}30` }}
            >
              <img 
                src={tenant.bannerUrl} 
                alt={tenant.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl mt-4"
            >
              <h1 
                id="banner-title-center"
                className="font-sans font-extrabold tracking-tight text-3xl sm:text-4xl md:text-5xl"
                style={{ color: isDark ? '#ffffff' : '#1c1917' }}
              >
                {tenant.name}
              </h1>
              <p 
                id="banner-slogan-center"
                className="mt-3 font-sans text-sm sm:text-base md:text-lg"
                style={{ color: isDark ? 'rgba(255,255,255,0.7)' : '#57534e' }}
              >
                {tenant.slogan}
              </p>
            </motion.div>
          </div>
        )}

        {/* LEFT LAYOUT */}
        {tenant.bannerLayout === 'left' && (
          <div 
            id="banner-layout-left"
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
          >
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="md:col-span-7 rounded-2xl overflow-hidden shadow-xl border aspect-[16/9]"
              style={{ borderColor: `${tenant.theme.primaryColor}30` }}
            >
              <img 
                src={tenant.bannerUrl} 
                alt={tenant.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-5 flex flex-col justify-center text-left"
            >
              <span 
                className="text-xs uppercase tracking-widest font-bold mb-2"
                style={{ color: tenant.theme.primaryColor }}
              >
                Estilo Exclusivo
              </span>
              <h1 
                id="banner-title-left"
                className="font-sans font-extrabold tracking-tight text-3xl sm:text-4xl md:text-5xl"
                style={{ color: isDark ? '#ffffff' : '#0f172a' }}
              >
                {tenant.name}
              </h1>
              <div 
                className="w-12 h-1 my-4 rounded-full" 
                style={{ backgroundColor: tenant.theme.primaryColor }}
              />
              <p 
                id="banner-slogan-left"
                className="font-sans text-sm sm:text-base md:text-lg leading-relaxed"
                style={{ color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }}
              >
                {tenant.slogan}
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
