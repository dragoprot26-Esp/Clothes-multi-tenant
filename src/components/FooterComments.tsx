import React, { useState } from 'react';
import { Star, Send, Instagram, Phone, MapPin, ExternalLink } from 'lucide-react';
import { TenantConfig, Comment } from '../types';

interface FooterCommentsProps {
  tenant: TenantConfig;
  comments: Comment[];
  onSubmitComment: (author: string, text: string, rating: number) => void;
}

export default function FooterComments({
  tenant,
  comments,
  onSubmitComment
}: FooterCommentsProps) {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [success, setSuccess] = useState(false);

  const approvedComments = comments.filter((c) => c.approved);
  const isDark = tenant.theme.backgroundColor === '#0d0d0d' || tenant.theme.backgroundColor === '#0f172a';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    
    onSubmitComment(author, text, rating);
    setAuthor('');
    setText('');
    setRating(5);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  const isCyc = tenant.id === 'cyc-elegance';

  return (
    <footer 
      id="footer-main"
      className="mt-16 border-t" 
      style={{ 
        backgroundColor: isCyc ? '#0a0a0a' : tenant.theme.backgroundColor,
        borderColor: isCyc ? 'rgba(255, 255, 255, 0.05)' : `${tenant.theme.primaryColor}20`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-12">
        {/* TOP PANEL: APPROVED REVIEWS & SUBMIT REVIEWS GRID */}
        <div id="footer-top-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Approved Reviews Carrousel/List (Left side) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <h2 className="font-sans font-extrabold text-2xl" style={{ color: isCyc ? '#f4f4f5' : tenant.theme.textColor }}>
                Opiniones de Clientes
              </h2>
              <p className="text-xs text-gray-400 mt-1">Lo que opinan los clientes que visten nuestra marca.</p>
            </div>

            {approvedComments.length === 0 ? (
              <div 
                className="p-6 rounded-2xl border text-center text-gray-500 text-sm" 
                style={{ 
                  backgroundColor: isCyc ? 'rgba(255, 255, 255, 0.03)' : tenant.theme.cardColor, 
                  borderColor: isCyc ? 'rgba(255, 255, 255, 0.05)' : `${tenant.theme.primaryColor}10` 
                }}
              >
                No hay comentarios aprobados aún. ¡Sé el primero en dejar tu opinión!
              </div>
            ) : (
              <div id="comments-approved-list" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {approvedComments.slice(-4).map((comment) => (
                  <div
                    id={`approved-comment-card-${comment.id}`}
                    key={comment.id}
                    className="p-4 rounded-xl border flex flex-col gap-2 transition-all duration-300 hover:scale-[1.02]"
                    style={{ 
                      backgroundColor: isCyc ? 'rgba(255, 255, 255, 0.03)' : tenant.theme.cardColor,
                      borderColor: isCyc ? 'rgba(255, 255, 255, 0.05)' : `${tenant.theme.primaryColor}10`
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs" style={{ color: isCyc ? '#f4f4f5' : tenant.theme.textColor }}>{comment.author}</span>
                      <span className="text-[10px] text-gray-400">{comment.date}</span>
                    </div>

                    <div className="flex gap-0.5 text-[#C5A059]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < comment.rating ? 'fill-current' : 'opacity-20'}`} 
                        />
                      ))}
                    </div>

                    <p className="text-xs text-zinc-400 italic leading-relaxed">
                      "{comment.text}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leave a Comment Form (Right side) */}
          <div className="lg:col-span-5">
            <div 
              id="comment-form-panel"
              className="p-6 rounded-2xl border shadow-xl flex flex-col gap-5"
              style={{ 
                backgroundColor: isCyc ? 'rgba(255, 255, 255, 0.03)' : tenant.theme.cardColor,
                borderColor: isCyc ? 'rgba(255, 255, 255, 0.08)' : `${tenant.theme.primaryColor}15`
              }}
            >
              <div>
                <h3 className="font-sans font-extrabold text-lg" style={{ color: isCyc ? '#f4f4f5' : tenant.theme.textColor }}>
                  Deja tu Comentario
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Tu opinión nos ayuda a seguir brindándote la mejor calidad.</p>
              </div>

              {success && (
                <div className="p-3 bg-green-500/10 text-green-500 border border-green-500/30 rounded-lg text-xs font-semibold animate-bounce text-center">
                  ¡Gracias! Tu comentario fue enviado para revisión del administrador.
                </div>
              )}

              <form id="comment-submission-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Nombre Completo</label>
                  <input
                    id="input-comment-author"
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Ej. Sofía Rossi"
                    className="w-full px-3 py-2 text-xs rounded-xl border bg-black/20 focus:outline-none focus:ring-1 focus:border-[#C5A059]"
                    style={{ borderColor: isCyc ? 'rgba(255, 255, 255, 0.1)' : `${tenant.theme.primaryColor}20`, color: isCyc ? '#f4f4f5' : tenant.theme.textColor }}
                  />
                </div>

                {/* Rating selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Puntuación</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        id={`btn-star-${star}`}
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star 
                          className={`w-6 h-6 transition-all ${
                            star <= rating ? 'text-[#C5A059] fill-[#C5A059]' : 'text-zinc-600 opacity-35'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Comentario</label>
                  <textarea
                    id="input-comment-text"
                    required
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Escribe tu opinión sobre el talle, la tela, el servicio..."
                    className="w-full px-3 py-2 text-xs rounded-xl border bg-black/20 focus:outline-none focus:ring-1 focus:border-[#C5A059] resize-none"
                    style={{ borderColor: isCyc ? 'rgba(255, 255, 255, 0.1)' : `${tenant.theme.primaryColor}20`, color: isCyc ? '#f4f4f5' : tenant.theme.textColor }}
                  />
                </div>

                <button
                  id="btn-submit-comment"
                  type="submit"
                  className={`py-2.5 px-4 rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer ${
                    isCyc ? 'bg-[#C5A059] hover:bg-[#b08e4d] text-black font-semibold' : ''
                  }`}
                  style={isCyc ? undefined : { 
                    backgroundColor: tenant.theme.primaryColor,
                    color: '#000000',
                    border: `1px solid ${tenant.theme.accentColor}`
                  }}
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar Comentario
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* BOTTOM PANEL: CONTACT & VISIT VITRINA BRANDING */}
        <div 
          id="footer-bottom-branding"
          className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ borderColor: isCyc ? 'rgba(255, 255, 255, 0.05)' : `${tenant.theme.primaryColor}15` }}
        >
          {/* Logo & Contact details */}
          <div className="flex flex-col gap-3 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <img 
                src={tenant.logoUrl} 
                alt={tenant.name} 
                className="w-8 h-8 rounded-full object-cover border"
                style={{ borderColor: isCyc ? '#C5A059' : tenant.theme.primaryColor }}
                referrerPolicy="no-referrer"
              />
              <span className="font-sans font-extrabold text-sm uppercase tracking-widest" style={{ color: isCyc ? '#f4f4f5' : tenant.theme.textColor }}>
                {tenant.name}
              </span>
            </div>

            {/* Contact Specs */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-zinc-400 mt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" style={{ color: isCyc ? '#C5A059' : tenant.theme.primaryColor }} />
                <span>{tenant.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" style={{ color: isCyc ? '#C5A059' : tenant.theme.primaryColor }} />
                <span>{tenant.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5" style={{ color: isCyc ? '#C5A059' : tenant.theme.primaryColor }} />
                <span>{tenant.instagram}</span>
              </div>
            </div>
          </div>

          {/* VISITA VITRINA (PROMPT CRITICAL REQUIREMENT) */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">¿Quieres ver más tiendas?</span>
            <a
              id="btn-visit-vitrina-footer"
              href="https://vitrina-cyc.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2.5 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                isCyc ? 'bg-[#C5A059] hover:bg-[#b08e4d] text-black' : 'bg-black text-white border'
              }`}
              style={isCyc ? undefined : { 
                borderColor: tenant.theme.primaryColor,
              }}
            >
              <span>Visita Vitrina</span>
              <ExternalLink className={`w-3.5 h-3.5 ${isCyc ? 'text-black' : 'text-amber-500'}`} style={isCyc ? undefined : { color: tenant.theme.primaryColor }} />
            </a>
          </div>
        </div>

        {/* Legal note */}
        <p className="text-center text-[10px] text-zinc-600">
          &copy; 2026 CyC-admin Multi-Tenant PWA Clothes. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
