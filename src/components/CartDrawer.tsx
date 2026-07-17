import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Plus, Minus, Trash2, ShoppingCart, MessageSquare, 
  User, Phone, Mail, ArrowLeft, Copy, Check, CheckCircle2 
} from 'lucide-react';
import { CartItem, TenantConfig, RetiroOrder } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, size: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onClearCart: () => void;
  tenant: TenantConfig;
  onPlaceOrder?: (order: RetiroOrder) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  tenant,
  onPlaceOrder
}: CartDrawerProps) {
  const isDark = tenant.theme.backgroundColor === '#0d0d0d' || tenant.theme.backgroundColor === '#0f172a' || tenant.theme.backgroundColor === '#0a0a0a';
  const isCyc = tenant.id === 'cyc-elegance';
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Checkout flow states
  const [step, setStep] = useState<'cart' | 'form' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [pickupCode, setPickupCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate complete checkout details text
  const getOrderDetailsText = (code: string) => {
    let text = `*Pedido de Compra - ${tenant.name}*\n`;
    text += `*Código de Retiro: ${code}*\n\n`;
    text += `*Datos del Cliente:*\n`;
    text += `- Nombre: ${customerName}\n`;
    text += `- Teléfono: ${customerPhone}\n`;
    if (customerEmail) {
      text += `- Email: ${customerEmail}\n`;
    }
    text += `\n*Prendas encargadas:*\n`;
    cart.forEach((item, index) => {
      text += `${index + 1}. *${item.product.name}* (Talle: ${item.size || 'M'}) x ${item.quantity} - _$${(item.product.price * item.quantity).toLocaleString('es-AR')}_\n`;
    });
    text += `\n*Total a abonar al retirar:* $${total.toLocaleString('es-AR')}\n\n`;
    text += `_Muchas gracias por tu compra!_`;
    return text;
  };

  const handleSendWhatsApp = (code: string) => {
    const cleanPrefix = (tenant.phonePrefix || '+549').replace(/[^0-9]/g, '');
    let cleanPhone = tenant.phone.replace(/[^0-9]/g, '');
    
    if (!cleanPhone.startsWith(cleanPrefix) && cleanPhone.length <= 11) {
      cleanPhone = cleanPrefix + cleanPhone;
    }
    
    const text = getOrderDetailsText(code);
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSendEmail = (code: string) => {
    const subject = `Pedido de Compra - ${tenant.name} (Código: ${code})`;
    // Stripping markdown asterisks/underscores for standard email text
    const plainText = getOrderDetailsText(code).replace(/\*/g, '').replace(/_/g, '');
    const body = `Hola, adjunto los detalles de mi pedido para coordinar el retiro.\n\n` + plainText;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleGenerateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    // Generate unique lookup pickup code: prefix + 6 random digits
    const prefix = tenant.name.slice(0, 3).toUpperCase();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const generatedCode = `RET-${prefix}-${randomNum}`;
    
    const order: RetiroOrder = {
      id: `ord-${Date.now()}`,
      code: generatedCode,
      tenantId: tenant.id,
      date: new Date().toISOString(),
      clientName: customerName.trim(),
      clientPhone: customerPhone.trim(),
      clientEmail: customerEmail.trim(),
      items: cart.map((it) => ({ name: it.product.name, quantity: it.quantity, size: it.size, price: it.product.price })),
      total,
      status: 'nuevo',
    };
    if (onPlaceOrder) onPlaceOrder(order);

    setPickupCode(generatedCode);
    setStep('success');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pickupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinalize = () => {
    onClearCart();
    setStep('cart');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setPickupCode('');
    onClose();
  };

  const handleCloseWrapper = () => {
    if (step === 'success') {
      onClearCart();
      setStep('cart');
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setPickupCode('');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            id="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseWrapper}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            id="cart-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col shadow-2xl border-l"
            style={{ 
              backgroundColor: isCyc ? '#0a0a0a' : tenant.theme.backgroundColor,
              borderColor: isCyc ? 'rgba(255,255,255,0.05)' : `${tenant.theme.primaryColor}20`,
              color: isCyc ? '#f4f4f5' : tenant.theme.textColor 
            }}
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: isCyc ? 'rgba(255,255,255,0.05)' : `${tenant.theme.primaryColor}15` }}>
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-500" style={{ color: isCyc ? '#C5A059' : tenant.theme.primaryColor }} />
                <h2 className="font-sans font-bold text-lg">Tu Canasta</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-500/20">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} ítems
                </span>
              </div>
              <button
                id="btn-close-cart-drawer"
                onClick={handleCloseWrapper}
                className="p-1 rounded-full hover:bg-zinc-500/20 transition-colors cursor-pointer text-zinc-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Step Indicator Map */}
            {cart.length > 0 && (
              <div className="flex items-center justify-between px-6 py-3.5 border-b text-[10px] font-black tracking-wider uppercase bg-black/20" style={{ borderColor: isCyc ? 'rgba(255,255,255,0.05)' : `${tenant.theme.primaryColor}15` }}>
                <div className={`flex items-center gap-1.5 ${step === 'cart' ? 'text-amber-500' : 'text-zinc-500'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step === 'cart' ? 'bg-amber-500 text-black' : 'bg-zinc-800'}`}>1</span>
                  <span>Canasta</span>
                </div>
                <div className="flex-1 h-[1px] mx-3 bg-zinc-850" />
                <div className={`flex items-center gap-1.5 ${step === 'form' ? 'text-amber-500' : 'text-zinc-500'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step === 'form' ? 'bg-amber-500 text-black' : 'bg-zinc-800'}`}>2</span>
                  <span>Datos</span>
                </div>
                <div className="flex-1 h-[1px] mx-3 bg-zinc-850" />
                <div className={`flex items-center gap-1.5 ${step === 'success' ? 'text-amber-500' : 'text-zinc-500'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step === 'success' ? 'bg-amber-500 text-black' : 'bg-zinc-800'}`}>3</span>
                  <span>Retiro</span>
                </div>
              </div>
            )}

            {/* Step 1: Cart items list */}
            {step === 'cart' && (
              <>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-60">
                      <ShoppingCart className="w-16 h-16 mb-4 stroke-1 text-zinc-500" />
                      <p className="font-semibold text-lg">La canasta está vacía</p>
                      <p className="text-sm text-zinc-400 mt-1 max-w-xs">¡Agrega los mejores artículos de moda para lucir tu estilo!</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        id={`cart-item-${item.product.id}-${item.size}`}
                        key={`${item.product.id}-${item.size}`}
                        className="flex gap-3 p-3 rounded-xl border relative"
                        style={{ 
                          backgroundColor: isCyc ? 'rgba(255,255,255,0.03)' : tenant.theme.cardColor,
                          borderColor: isCyc ? 'rgba(255,255,255,0.05)' : `${tenant.theme.primaryColor}10`
                        }}
                      >
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-lg object-cover bg-zinc-900 border"
                          style={{ borderColor: isCyc ? 'rgba(255,255,255,0.05)' : `${tenant.theme.primaryColor}20` }}
                          referrerPolicy="no-referrer"
                        />

                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <h4 className="font-sans font-bold text-sm line-clamp-1">{item.product.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              {item.size && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-500/20 uppercase">
                                  Talle: {item.size}
                                </span>
                              )}
                              <span className="text-xs text-zinc-400">
                                ${item.product.price.toLocaleString('es-AR')} c/u
                              </span>
                            </div>
                          </div>

                          {/* Quantity Selector */}
                          <div className="flex items-center justify-between mt-1.5">
                            <div className="flex items-center border rounded-lg bg-black/10 overflow-hidden" style={{ borderColor: isCyc ? 'rgba(255,255,255,0.08)' : `${tenant.theme.primaryColor}20` }}>
                              <button
                                id={`btn-cart-minus-${item.product.id}-${item.size}`}
                                onClick={() => onUpdateQuantity(item.product.id, item.size || 'M', -1)}
                                className="p-1 hover:bg-white/10 transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
                              </button>
                              <span className="px-3 text-xs font-bold">{item.quantity}</span>
                              <button
                                id={`btn-cart-plus-${item.product.id}-${item.size}`}
                                onClick={() => onUpdateQuantity(item.product.id, item.size || 'M', 1)}
                                className="p-1 hover:bg-white/10 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
                              </button>
                            </div>

                            <span className="font-bold text-sm text-right">
                              ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                            </span>
                          </div>
                        </div>

                        {/* Remove button */}
                        <button
                          id={`btn-cart-remove-${item.product.id}-${item.size}`}
                          onClick={() => onRemoveItem(item.product.id, item.size || 'M')}
                          className="absolute top-2 right-2 p-1.5 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Summary */}
                {cart.length > 0 && (
                  <div 
                    className="p-4 border-t flex flex-col gap-4 shadow-inner" 
                    style={{ 
                      borderColor: isCyc ? 'rgba(255,255,255,0.05)' : `${tenant.theme.primaryColor}20`,
                      backgroundColor: isCyc ? 'rgba(255, 255, 255, 0.02)' : `${tenant.theme.cardColor}`
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 font-medium">Subtotal</span>
                      <span className="text-lg font-bold">${total.toLocaleString('es-AR')}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        id="btn-clear-cart"
                        onClick={onClearCart}
                        className="py-3 px-4 rounded-full border text-xs font-bold hover:bg-red-500/10 hover:text-red-500 transition-all cursor-pointer border-red-500/20 text-zinc-400"
                      >
                        Vaciar Canasta
                      </button>

                      <button
                        id="btn-checkout-go-to-form"
                        onClick={() => setStep('form')}
                        className={`py-3 px-4 rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer ${
                          isCyc ? 'bg-[#C5A059] text-black hover:bg-[#b08e4d]' : ''
                        }`}
                        style={isCyc ? undefined : { 
                          backgroundColor: tenant.theme.primaryColor,
                          color: '#000000',
                          border: `1px solid ${tenant.theme.accentColor}`
                        }}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Encargar Pedido
                      </button>
                    </div>

                    <p className="text-[10px] text-zinc-500 text-center leading-tight">
                      * Al presionar "Encargar Pedido", te pediremos tus datos para generar un código de retiro único para coordinar.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Step 2: Form to ask Name and Phone */}
            {step === 'form' && (
              <form onSubmit={handleGenerateCode} className="flex-1 overflow-y-auto p-6 flex flex-col justify-between gap-6">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStep('cart')}
                      className="p-1.5 rounded-full hover:bg-zinc-500/20 text-zinc-300 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h3 className="font-sans font-black text-sm uppercase tracking-wider text-white">Ingresa tus datos</h3>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Por favor, completa tus datos de contacto para que el vendedor de <b>{tenant.name}</b> prepare tu vestimenta. Obtendrás un código de retiro único.
                  </p>

                  {/* Input Fields */}
                  <div className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Nombre Completo *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Ej. Juan Pérez"
                          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-amber-500 font-sans"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Teléfono de contacto *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="Ej. +54 9 11 1234 5678"
                          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Correo electrónico (Opcional)</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="Ej. juan.perez@correo.com"
                          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-amber-500 font-sans"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  className="p-5 rounded-2xl border flex flex-col gap-3"
                  style={{ 
                    backgroundColor: isCyc ? 'rgba(255,255,255,0.02)' : `${tenant.theme.cardColor}50`,
                    borderColor: isCyc ? 'rgba(255,255,255,0.05)' : `${tenant.theme.primaryColor}15`
                  }}
                >
                  <div className="flex justify-between items-center text-xs text-zinc-400 font-medium">
                    <span>Monto total del pedido</span>
                    <span className="text-base font-bold text-white">${total.toLocaleString('es-AR')}</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-full font-black text-xs uppercase tracking-wider text-black transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-lg mt-2"
                    style={{
                      backgroundColor: isCyc ? '#C5A059' : tenant.theme.primaryColor,
                    }}
                  >
                    <span>Confirmar y Generar Código</span>
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Success Screen (Pickup code generated, Whatsapp / Email option) */}
            {step === 'success' && (
              <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between gap-6">
                <div className="flex flex-col items-center text-center gap-4 py-2">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 shadow-inner">
                    <CheckCircle2 className="w-10 h-10 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-lg text-white uppercase tracking-wider">¡Pedido Encargado!</h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
                      Se ha generado tu código único de retiro. Coordina la entrega con el local enviando este código por WhatsApp o Correo electrónico.
                    </p>
                  </div>

                  {/* Highlighted copyable box */}
                  <div className="w-full mt-4 p-5 rounded-3xl bg-zinc-950 border border-amber-500/25 relative flex flex-col items-center gap-1.5">
                    <span className="text-[9px] text-amber-500 uppercase font-black tracking-widest">Código de Retiro</span>
                    <span className="text-2xl font-mono font-black text-white tracking-widest select-all">{pickupCode}</span>
                    
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="mt-2.5 flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-bold text-zinc-300 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-green-500">¡Código Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Código</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-[10px] text-zinc-400 uppercase font-black tracking-widest text-center block mb-1">
                    Enviar detalles al local por:
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleSendWhatsApp(pickupCode)}
                      className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 fill-black" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendEmail(pickupCode)}
                      className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 cursor-pointer border border-blue-500/30"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-zinc-500 text-center mt-2 leading-relaxed">
                    * Tu pedido queda reservado con el código <b>{pickupCode}</b>. Al presentarte en el local o coordinar, indica este código para el cobro y entrega.
                  </p>

                  <button
                    type="button"
                    onClick={handleFinalize}
                    className="w-full py-3.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white text-xs font-black uppercase tracking-wider transition-all mt-6 cursor-pointer text-center"
                  >
                    Finalizar y Vaciar Canasta
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
