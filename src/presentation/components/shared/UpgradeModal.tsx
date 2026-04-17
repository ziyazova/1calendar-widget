import React, { useState } from 'react';
import { SubscriptionService } from '@/infrastructure/services/SubscriptionService';
import { useAuth } from '@/presentation/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Single source of truth for the Pro upgrade modal. Render once from any
 * page (or wire through `UpgradeModalContext`) — the visual is identical
 * to what `WidgetStudioPage` and `StudioPage` used to ship inline.
 */
export const UpgradeModal: React.FC<UpgradeModalProps> = ({ open, onClose }) => {
  const { isRegistered } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleGetPro = async () => {
    setError(null);
    // Anonymous visitors can't subscribe — route them through sign-up first
    // so the eventual webhook has a supabase user id to link to.
    if (!isRegistered) {
      onClose();
      navigate('/login', { state: { signup: true } });
      return;
    }
    setSubmitting(true);
    try {
      await SubscriptionService.startCheckout();
      // startCheckout does a full-page redirect on success; if we reach this
      // line, it didn't redirect and the .catch below will run.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      />
      <div style={{
        position: 'relative', background: '#fff', borderRadius: 28, padding: '48px 40px 40px',
        width: 620, maxWidth: '92vw',
        boxShadow: '0 32px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)',
        animation: 'upgradeModalIn 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        <style>{`@keyframes upgradeModalIn { from { opacity: 0; transform: scale(0.96) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: 20, right: 20, width: 36, height: 36, border: 'none',
            background: 'rgba(0,0,0,0.04)', borderRadius: 12, cursor: 'pointer', fontSize: 20, color: '#bbb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >×</button>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, #6366F1, #818CF8)',
            marginBottom: 16, boxShadow: '0 4px 16px rgba(99,102,241,0.25)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
            </svg>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#1F1F1F', letterSpacing: '-0.03em' }}>Upgrade to Pro</div>
          <div style={{ fontSize: 15, color: '#999', marginTop: 8 }}>Unlock all styles and unlimited widgets</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 6fr', gap: 16, alignItems: 'stretch' }}>
          <div style={{ border: '1.5px solid rgba(0,0,0,0.06)', borderRadius: 20, padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#bbb', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em', minHeight: 27, display: 'flex', alignItems: 'center' }}>Free</div>
            <div style={{ fontSize: 44, fontWeight: 700, color: '#1F1F1F', letterSpacing: '-0.04em', lineHeight: 1 }}>$0</div>
            <div style={{ fontSize: 13, color: '#ccc', marginTop: 6, marginBottom: 28 }}>forever</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 14, color: '#666', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: '#ccc', fontSize: 15 }}>✓</span> 3 widgets</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: '#ccc', fontSize: 15 }}>✓</span> Basic widget types</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: '#ccc', fontSize: 15 }}>✓</span> Limited customization</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: '#ccc', fontSize: 15 }}>✓</span> Embed in Notion</li>
            </ul>
            <button
              onClick={onClose}
              style={{ marginTop: 28, width: '100%', height: 46, border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: 14, background: '#fff', color: '#555', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}
            >
              Current plan
            </button>
          </div>
          <div style={{
            border: '1.5px solid rgba(99,102,241,0.2)', borderRadius: 20, padding: '28px 24px',
            background: 'linear-gradient(160deg, rgba(99,102,241,0.04) 0%, rgba(236,72,153,0.03) 100%)',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pro</div>
              <div style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '5px 14px', borderRadius: 20 }}>Popular</div>
            </div>
            <div style={{ fontSize: 44, fontWeight: 700, color: '#1F1F1F', letterSpacing: '-0.04em', lineHeight: 1 }}>$4</div>
            <div style={{ fontSize: 13, color: '#ccc', marginTop: 6, marginBottom: 28 }}>/month</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 14, color: '#444', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: '#6366F1', fontSize: 15 }}>✓</span> <strong>Unlimited widgets</strong></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: '#6366F1', fontSize: 15 }}>✓</span> <strong>All widget types</strong></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: '#6366F1', fontSize: 15 }}>✓</span> <strong>Full customization</strong></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: '#6366F1', fontSize: 15 }}>✓</span> <strong>Exclusive styles</strong></li>
            </ul>
            <button
              onClick={handleGetPro}
              disabled={submitting}
              style={{
                marginTop: 28, width: '100%', height: 46, border: 'none', borderRadius: 14,
                background: 'linear-gradient(135deg, #1F1F1F, #333)', color: '#fff',
                fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
                cursor: submitting ? 'default' : 'pointer',
                opacity: submitting ? 0.75 : 1,
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              }}
            >
              {submitting ? 'Redirecting…' : isRegistered ? 'Get Pro' : 'Sign up to continue'}
            </button>
            {error && (
              <div style={{ marginTop: 10, fontSize: 12, color: '#DC2828', textAlign: 'center' }}>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
