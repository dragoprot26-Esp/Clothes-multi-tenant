import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, User, Lock, Fingerprint, RefreshCw, CheckCircle, AlertCircle, X } from 'lucide-react';
import { TenantConfig, Collaborator } from '../types';
import { validarLicencia, asegurarCuentaSeguraDueno, emailDe, estaLogueado } from '../lib/cloud';
import * as biometria from '../lib/biometria';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: TenantConfig;
  collaborators: Collaborator[];
  onLoginSuccess: (user: { id?: string; name: string; role: 'admin' | 'collaborator'; email: string; isAdmin2?: boolean; codigo?: string }) => void;
  onEditCollaborator: (collaborator: Collaborator) => void;
}

export default function AdminLoginModal({
  isOpen,
  onClose,
  tenant,
  collaborators,
  onLoginSuccess,
  onEditCollaborator
}: AdminLoginModalProps) {
  // Login Steps: 'license' | 'credentials'
  const [step, setStep] = useState<'license' | 'credentials'>('license');
  
  const [licenseInput, setLicenseInput] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [enableBiometrics, setEnableBiometrics] = useState(false);
  const [isBiometricRegistered, setIsBiometricRegistered] = useState(false);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [licenseSuccess, setLicenseSuccess] = useState(false);
  const [validatedCodigo, setValidatedCodigo] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Profile Type selector
  const [loginType, setLoginType] = useState<'admin' | 'collaborator'>('admin');
  const [selectedCollabId, setSelectedCollabId] = useState('');

  const tenantCollaborators = collaborators.filter(c => c.tenantId === tenant.id && c.active);

  // Check if biometric is already registered in local storage for this tenant
  useEffect(() => {
    if (isOpen) {
      const has = biometria.hay();
      setIsBiometricRegistered(has);
      setEnableBiometrics(!has);
      
      // Reset fields
      setLicenseInput('');
      setUsername('');
      setPassword('');
      setErrorMessage('');
      setStep('license');
      setLicenseSuccess(false);
      setValidatedCodigo('');
      setIsVerifying(false);
      setLoginType('admin');
    }
  }, [isOpen, tenant.id]);

  useEffect(() => {
    if (tenantCollaborators.length > 0) {
      setSelectedCollabId(tenantCollaborators[0].id);
    } else {
      setSelectedCollabId('');
    }
  }, [tenant.id, collaborators]);

  const handleVerifyLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = licenseInput.trim().toUpperCase();
    if (!code) { setErrorMessage('Ingresá tu clave de licencia.'); return; }
    setErrorMessage('');
    setIsVerifying(true);
    const lic = await validarLicencia(code);
    setIsVerifying(false);
    if (lic) {
      setValidatedCodigo(code);
      setLicenseSuccess(true);
      setTimeout(() => { setStep('credentials'); }, 600);
    } else {
      setErrorMessage('Licencia no válida o vencida. Verificá la clave con tu proveedor CyC.');
    }
  };

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginType === 'admin') {
      if (!username.trim() || password.length < 6) {
        setErrorMessage('Ingresá tu usuario y una contraseña de 6+ caracteres.');
        return;
      }
      setIsVerifying(true);
      const r = await asegurarCuentaSeguraDueno(username.trim(), password, validatedCodigo);
      setIsVerifying(false);
      if (!r.ok) { setErrorMessage(r.msg || 'No se pudo iniciar sesión.'); return; }
      if (enableBiometrics) {
        try { await biometria.registrar(validatedCodigo, username.trim(), 'admin'); } catch (e) { /* noop */ }
      } else {
        biometria.borrar();
      }
      onLoginSuccess({
        name: 'Admin Inquilino',
        role: 'admin',
        email: emailDe(username.trim(), validatedCodigo),
        codigo: validatedCodigo
      });
      onClose();
    } else {
      const selectedCollab = tenantCollaborators.find(c => c.id === selectedCollabId);
      if (selectedCollab) {
        if (selectedCollab.password === password) {
          const isFirstLogin = !selectedCollab.firstLoginAttempted;
          if (isFirstLogin) {
            onEditCollaborator({
              ...selectedCollab,
              firstLoginAttempted: true,
              biometricsAuthorized: false
            });
            alert(`¡Primer ingreso exitoso, ${selectedCollab.name}!\n\nSe ha enviado una solicitud al administrador del inquilino para habilitar tu ingreso rápido biométrico (Rostro / Huella).`);
          }
          
          onLoginSuccess({
            id: selectedCollab.id,
            name: selectedCollab.name,
            role: 'collaborator',
            email: selectedCollab.email,
            isAdmin2: selectedCollab.isAdmin2,
            codigo: validatedCodigo
          });
          onClose();
        } else {
          setErrorMessage(`Contraseña incorrecta para ${selectedCollab.name}.`);
        }
      } else {
        setErrorMessage('Por favor seleccione un colaborador válido.');
      }
    }
  };

  const handleBiometricLogin = async () => {
    setIsBiometricScanning(true);
    setErrorMessage('');
    const meta = await biometria.desbloquear();
    setIsBiometricScanning(false);
    if (!meta) { setErrorMessage('No se pudo verificar la huella/rostro. Probá de nuevo o entrá con tu clave.'); return; }
    if (!estaLogueado()) { setErrorMessage('Por seguridad, ingresá una vez con usuario y contraseña; después la huella entra sola.'); return; }
    if (meta.role === 'collaborator') {
      const col = tenantCollaborators.find((c) => c.id === meta.colId);
      if (col) { onLoginSuccess({ id: col.id, name: col.name, role: 'collaborator', email: col.email, isAdmin2: col.isAdmin2, codigo: meta.licenseCode }); onClose(); return; }
      setErrorMessage('La huella no coincide con un colaborador activo.'); return;
    }
    onLoginSuccess({ name: 'Admin Inquilino', role: 'admin', email: emailDe(meta.name || 'admin', meta.licenseCode), codigo: meta.licenseCode });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            id="login-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm cursor-pointer"
          />

          {/* Login Container Modal */}
          <motion.div
            id="login-modal-panel"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-6 sm:p-8 rounded-3xl border shadow-2xl flex flex-col gap-6"
            style={{ 
              backgroundColor: tenant.theme.cardColor,
              borderColor: tenant.theme.primaryColor,
              color: tenant.theme.textColor
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: `${tenant.theme.primaryColor}20` }}>
              <div className="flex items-center gap-2.5">
                <Shield className="w-6 h-6" style={{ color: tenant.theme.primaryColor }} />
                <div>
                  <h2 className="font-sans font-extrabold text-lg uppercase tracking-wide">Acceso CyC-admin</h2>
                  <p className="text-[10px] text-gray-400">Portal del Inquilino: {tenant.name}</p>
                </div>
              </div>
              <button 
                id="btn-close-login"
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-500/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message banner */}
            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* BIOMETRIC SCANNING OVERLAY VIEW */}
            {isBiometricScanning ? (
              <div id="biometric-scanning-view" className="flex flex-col items-center justify-center py-10 gap-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" style={{ backgroundColor: `${tenant.theme.primaryColor}40` }} />
                  <div className="w-24 h-24 rounded-full border-2 flex items-center justify-center relative bg-black/40" style={{ borderColor: tenant.theme.primaryColor }}>
                    <Fingerprint className="w-12 h-12 animate-pulse" style={{ color: tenant.theme.primaryColor }} />
                  </div>
                  {/* Glowing scanner line */}
                  <div 
                    className="absolute left-0 right-0 h-1 bg-amber-400 shadow-lg animate-bounce" 
                    style={{ backgroundColor: tenant.theme.accentColor, top: '40%' }} 
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-base">Verificando Datos Biométricos</h3>
                  <p className="text-xs text-gray-400 mt-1">Coloque su huella en el lector o mire la cámara frontal...</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] bg-white/5 px-3 py-1 rounded-full text-gray-300">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Simulación FaceID / Huella</span>
                </div>
              </div>
            ) : (
              <>
                {/* STEP 1: LICENSE VERIFICATION */}
                {step === 'license' && (
                  <form id="license-verification-form" onSubmit={handleVerifyLicense} className="flex flex-col gap-4">
                    <div className="text-center bg-black/20 p-4 rounded-xl border border-white/5">
                      <p className="text-xs text-gray-300">
                        Para ingresar a la consola de administración, valide su licencia de inquilino.
                      </p>
                      {isBiometricRegistered && (
                        <button
                          type="button"
                          id="btn-biometric-quick-license"
                          onClick={handleBiometricLogin}
                          className="mt-3 w-full py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
                        >
                          <Fingerprint className="w-4 h-4 animate-pulse" />
                          <span>Entrar con Huella / FaceID</span>
                        </button>
                      )}
                      <span className="text-[10px] text-amber-500 font-bold block mt-2" style={{ color: tenant.theme.primaryColor }}>
                        * Ingresá la clave que te entregó tu proveedor CyC.
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Clave de Licencia</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          id="input-license-key"
                          type="text"
                          required
                          value={licenseInput}
                          onChange={(e) => setLicenseInput(e.target.value)}
                          placeholder="Ej. CYC-2026"
                          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-black/20 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          style={{ borderColor: `${tenant.theme.primaryColor}30`, color: tenant.theme.textColor }}
                        />
                      </div>
                    </div>

                    <button
                      id="btn-verify-license"
                      type="submit"
                      disabled={licenseSuccess}
                      className="py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-80 cursor-pointer"
                      style={{ 
                        backgroundColor: licenseSuccess ? '#22c55e' : tenant.theme.primaryColor,
                        color: '#000000',
                        border: `1px solid ${tenant.theme.accentColor}`
                      }}
                    >
                      {licenseSuccess ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Licencia Verificada</span>
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4" />
                          <span>Verificar Licencia</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* STEP 2: CREDENTIALS (USERNAME & PASSWORD) & BIOMETRIC LOGIN */}
                {step === 'credentials' && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    {/* Switch layout back to license */}
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-green-500 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Licencia OK
                      </span>
                      <button
                        id="btn-back-to-license"
                        onClick={() => setStep('license')}
                        className="text-gray-400 hover:text-amber-500 transition-colors cursor-pointer underline"
                      >
                        Cambiar Licencia
                      </button>
                    </div>

                    {/* Quick Biometric Access Trigger */}
                    {loginType === 'admin' && isBiometricRegistered && (
                      <div 
                        id="biometric-quick-access-banner"
                        className="p-4 rounded-xl border flex flex-col items-center text-center gap-3 bg-black/30"
                        style={{ borderColor: `${tenant.theme.primaryColor}20` }}
                      >
                        <p className="text-xs text-gray-300">Biometría habilitada para esta cuenta</p>
                        <button
                          id="btn-trigger-biometric-login"
                          onClick={handleBiometricLogin}
                          className="px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer bg-white text-black border border-gray-200"
                        >
                          <Fingerprint className="w-4 h-4 text-emerald-600 animate-pulse" />
                          <span>Ingresar con Biometría</span>
                        </button>
                      </div>
                    )}

                    {/* Profile Type selection buttons */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Perfil de Acceso</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setLoginType('admin')}
                          className="py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer"
                          style={{
                            backgroundColor: loginType === 'admin' ? tenant.theme.primaryColor : 'rgba(255,255,255,0.03)',
                            borderColor: loginType === 'admin' ? tenant.theme.primaryColor : 'rgba(255,255,255,0.08)',
                            color: loginType === 'admin' ? '#000000' : '#a3a3a3'
                          }}
                        >
                          Admin Inquilino
                        </button>
                        <button
                          type="button"
                          disabled={tenantCollaborators.length === 0}
                          onClick={() => setLoginType('collaborator')}
                          className="py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{
                            backgroundColor: loginType === 'collaborator' ? tenant.theme.primaryColor : 'rgba(255,255,255,0.03)',
                            borderColor: loginType === 'collaborator' ? tenant.theme.primaryColor : 'rgba(255,255,255,0.08)',
                            color: loginType === 'collaborator' ? '#000000' : '#a3a3a3'
                          }}
                        >
                          Colaborador {tenantCollaborators.length > 0 ? `(${tenantCollaborators.length})` : ''}
                        </button>
                      </div>
                    </div>

                    {/* Standard Login Form */}
                    <form id="standard-login-form" onSubmit={handleStandardLogin} className="flex flex-col gap-4">
                      {loginType === 'collaborator' ? (
                        <div className="flex flex-col gap-3 animate-fadeIn">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Seleccionar Colaborador</label>
                            <select
                              value={selectedCollabId}
                              onChange={(e) => setSelectedCollabId(e.target.value)}
                              className="w-full px-4 py-2.5 text-xs rounded-xl border bg-black/40 text-white focus:outline-none focus:border-amber-500 font-sans"
                              style={{ borderColor: `${tenant.theme.primaryColor}30` }}
                            >
                              {tenantCollaborators.map(c => (
                                <option key={c.id} value={c.id} className="bg-zinc-900 text-white">
                                  {c.name} ({c.role})
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          {/* Username Display & Biometrics Authorized Badge */}
                          <div className="flex flex-col gap-1 text-[11px] text-gray-300 bg-black/30 p-3 rounded-xl border border-white/5">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Usuario de ingreso:</span>
                              <strong className="text-amber-400 font-mono">{tenantCollaborators.find(c => c.id === selectedCollabId)?.username || 'No asignado'}</strong>
                            </div>
                            <div className="border-t border-white/5 my-1.5" />
                            {tenantCollaborators.find(c => c.id === selectedCollabId)?.biometricsAuthorized ? (
                              <div className="text-green-400 flex items-start gap-1.5">
                                <Fingerprint className="w-3.5 h-3.5 shrink-0 mt-0.5 text-green-400 animate-pulse" />
                                <span>Acceso biométrico habilitado. ¡Puedes ingresar instantáneamente!</span>
                              </div>
                            ) : (
                              <div className="text-gray-400 text-[10px] italic">
                                {tenantCollaborators.find(c => c.id === selectedCollabId)?.firstLoginAttempted ? (
                                  <span>Biometría pendiente de aprobación en la pestaña Colaboradores del Admin.</span>
                                ) : (
                                  <span>Inicia sesión por primera vez con contraseña para solicitar biometría.</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Username */
                        <div className="flex flex-col gap-1.5 animate-fadeIn">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Usuario Administrador</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              id="input-login-username"
                              type="text"
                              required
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="admin"
                              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border bg-black/20 focus:outline-none focus:ring-1 focus:ring-amber-500"
                              style={{ borderColor: `${tenant.theme.primaryColor}30`, color: tenant.theme.textColor }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Password */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Contraseña</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            id="input-login-password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border bg-black/20 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            style={{ borderColor: `${tenant.theme.primaryColor}30`, color: tenant.theme.textColor }}
                          />
                        </div>
                      </div>

                      {/* BIOMETRIC TOGGLE */}
                      {loginType === 'admin' && (
                        <div className="flex items-center justify-between py-1 px-1">
                          <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                            <input
                              id="chk-enable-biometrics"
                              type="checkbox"
                              checked={enableBiometrics}
                              onChange={(e) => setEnableBiometrics(e.target.checked)}
                              className="w-4 h-4 rounded text-amber-500 focus:ring-0 focus:ring-offset-0 accent-amber-500 cursor-pointer"
                            />
                            <span className="text-gray-300 font-medium">Habilitar datos biométricos</span>
                          </label>
                          <Fingerprint className="w-4 h-4 text-gray-400" />
                        </div>
                      )}

                      <p className="text-[10px] text-gray-400 italic bg-black/15 p-2 rounded">
                        * Credenciales demo: {loginType === 'admin' ? <span>Usuario <b>admin</b>, pass <b>admin123</b></span> : <span>Contraseña creada por el administrador para cada perfil</span>}
                      </p>

                      <div className="flex flex-col gap-2 mt-2">
                        <button
                          id="btn-login-submit"
                          type="submit"
                          className="py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                          style={{ 
                            backgroundColor: tenant.theme.primaryColor,
                            color: '#000000',
                            border: `1px solid ${tenant.theme.accentColor}`
                          }}
                        >
                          <Shield className="w-4 h-4" />
                          <span>Entrar al Panel</span>
                        </button>

                        {/* Quick Biometric Access for Authorized Collaborators */}
                        {loginType === 'collaborator' && tenantCollaborators.find(c => c.id === selectedCollabId)?.biometricsAuthorized && (
                          <button
                            id="btn-login-biometric-collab"
                            type="button"
                            onClick={handleBiometricLogin}
                            className="py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer border hover:opacity-90"
                            style={{ 
                              backgroundColor: 'rgba(16, 185, 129, 0.12)',
                              color: '#10b981',
                              borderColor: '#10b981'
                            }}
                          >
                            <Fingerprint className="w-4 h-4 text-green-400 animate-pulse animate-duration-1000" />
                            <span>Acceso Biométrico Rápido</span>
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
