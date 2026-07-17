import React from 'react';
import { TenantConfig } from '../types';

interface CategoryMenuProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  tenant: TenantConfig;
}

export default function CategoryMenu({
  categories,
  activeCategory,
  onSelectCategory,
  tenant
}: CategoryMenuProps) {
  const isDark = tenant.theme.backgroundColor === '#0d0d0d' || tenant.theme.backgroundColor === '#0f172a' || tenant.theme.backgroundColor === '#0a0a0a';
  const isCyc = tenant.id === 'cyc-elegance';

  return (
    <div 
      id="category-menu-container" 
      className={`w-full ${isCyc ? 'h-16 flex items-center bg-zinc-950/50 backdrop-blur-md border-y' : 'py-4 border-y'}`} 
      style={{ 
        borderColor: isCyc ? 'rgba(255,255,255,0.05)' : `${tenant.theme.primaryColor}20` 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Horizontal scrollable wrapper */}
        <div 
          id="category-menu-scroll"
          className={`flex items-center overflow-x-auto no-scrollbar ${isCyc ? 'gap-10 py-2' : 'gap-2 py-2 -my-2'}`}
        >
          {categories.map((category) => {
            const isActive = activeCategory === category;
            
            if (isCyc) {
              return (
                <button
                  id={`category-btn-${category.toLowerCase()}`}
                  key={category}
                  onClick={() => onSelectCategory(category)}
                  className={`pb-1 border-b-2 font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'text-[#C5A059] border-[#C5A059]' 
                      : 'text-zinc-500 hover:text-white border-transparent'
                  }`}
                >
                  {category === 'Promo' && '⚡️ '}
                  {category === 'Ofertas' && '🔥 '}
                  {category}
                </button>
              );
            }

            return (
              <button
                id={`category-btn-${category.toLowerCase()}`}
                key={category}
                onClick={() => onSelectCategory(category)}
                className="px-5 py-2 rounded-full text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: isActive 
                    ? tenant.theme.primaryColor 
                    : isDark ? '#1e1e1e' : '#f3f4f6',
                  color: isActive 
                    ? '#000000' 
                    : isDark ? 'rgba(255, 255, 255, 0.8)' : '#374151',
                  border: isActive 
                    ? `1px solid ${tenant.theme.accentColor}` 
                    : `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  boxShadow: isActive ? `0 4px 12px ${tenant.theme.primaryColor}40` : 'none'
                }}
              >
                {category === 'Promo' && '⚡️ '}
                {category === 'Ofertas' && '🔥 '}
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
