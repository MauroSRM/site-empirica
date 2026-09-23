/**
 * DSTabBar — Navegação por abas
 * Fonte da verdade: src/imports/DSTabBar.tsx
 */

import React, { CSSProperties, useState } from 'react';
import { useTheme } from '../tokens';
import { Home } from 'lucide-react';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | boolean;
}

export interface DSTabBarProps {
  variant: 'line' | 'pill' | 'bottom-nav';
  tabs: Tab[];
  size?: 'sm' | 'md';
  defaultActive?: string;
  onChange?: (tabId: string) => void;
  style?: CSSProperties;
}

function TabBadge({ badge }: { badge?: number | boolean }) {
  const { tokens: t } = useTheme();
  if (!badge) return null;
  const isNum = typeof badge === 'number';
  return (
    <div style={{
      position: 'absolute', top: -4, right: isNum ? -8 : -4,
      minWidth: isNum ? 16 : 8, height: isNum ? 16 : 8,
      borderRadius: t.radiusFull,
      backgroundColor: t.feedbackError,
      color: t.textOnBrand,
      fontSize: '10px', fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isNum ? '0 3px' : 0,
    }}>
      {isNum && (badge > 9 ? '9+' : badge)}
    </div>
  );
}

function LineTabBar({ tabs, active, setActive, size }: {
  tabs: Tab[]; active: string; setActive: (id: string) => void; size: 'sm' | 'md';
}) {
  const { tokens: t } = useTheme();
  const py = size === 'sm' ? '8px' : '10px';
  const px = size === 'sm' ? '16px' : '20px';
  const fs = size === 'sm' ? t.textSm : t.textMd;

  return (
    <div style={{ borderBottom: `2px solid ${t.borderDefault}`, display: 'flex', fontFamily: t.fontFamily }}>
      {tabs.map(tab => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              position: 'relative',
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: `${py} ${px}`,
              background: 'none', border: 'none',
              borderBottom: isActive ? `2px solid ${t.brandPrimary}` : '2px solid transparent',
              marginBottom: '-2px',
              color: isActive ? t.textPrimary : t.textSecondary,
              fontWeight: isActive ? 600 : 400,
              fontSize: fs,
              fontFamily: t.fontFamily,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.icon && <span style={{ position: 'relative' }}>{tab.icon}<TabBadge badge={tab.badge} /></span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function PillTabBar({ tabs, active, setActive, size }: {
  tabs: Tab[]; active: string; setActive: (id: string) => void; size: 'sm' | 'md';
}) {
  const { tokens: t } = useTheme();
  const py = size === 'sm' ? '6px' : '8px';
  const px = size === 'sm' ? '16px' : '20px';
  const fs = size === 'sm' ? t.textSm : t.textMd;

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      backgroundColor: t.neutral200,
      borderRadius: t.radiusXl,
      padding: '4px',
      gap: '4px',
      fontFamily: t.fontFamily,
      boxSizing: 'border-box',
    }}>
      {tabs.map(tab => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              position: 'relative',
              flex: 1,
              padding: `${py} ${px}`,
              borderRadius: t.radiusLg,
              border: 'none',
              backgroundColor: isActive ? t.surfaceDefault : 'transparent',
              color: isActive ? t.textPrimary : t.textSecondary,
              fontWeight: isActive ? 600 : 400,
              fontSize: fs,
              fontFamily: t.fontFamily,
              cursor: 'pointer',
              boxShadow: isActive ? t.shadowDropdown : 'none',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
              textAlign: 'center',
            }}
          >
            {tab.label}
            {isActive && (
              <div style={{
                position: 'absolute',
                bottom: 3,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 30,
                height: 3,
                borderRadius: t.radiusFull,
                backgroundColor: t.brandAccent,
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

function BottomNavBar({ tabs, active, setActive }: {
  tabs: Tab[]; active: string; setActive: (id: string) => void;
}) {
  const { tokens: t } = useTheme();
  return (
    <div style={{
      width: '100%',
      height: t.bottomNavHeight,
      display: 'flex',
      borderTop: `1px solid ${t.borderDefault}`,
      backgroundColor: t.surfaceDefault,
      boxShadow: t.shadowNav,
      fontFamily: t.fontFamily,
    }}>
      {tabs.map(tab => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              flex: 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '4px',
              border: 'none', background: 'none', cursor: 'pointer',
              paddingTop: t.space2, paddingBottom: t.space2,
              paddingLeft: t.space3, paddingRight: t.space3,
              color: isActive ? t.brandPrimary : t.textTertiary,
            }}
          >
            <span style={{ position: 'relative' }}>
              {tab.icon ?? null}
              <TabBadge badge={tab.badge} />
            </span>
            <span style={{ fontSize: t.textXs, fontWeight: 600, fontFamily: t.fontFamily }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function DSTabBar({ variant, tabs, size = 'md', defaultActive, onChange, style }: DSTabBarProps) {
  const [active, setActive] = useState(defaultActive ?? tabs[0]?.id);

  const handleSet = (id: string) => { setActive(id); onChange?.(id); };

  if (variant === 'line')       return <LineTabBar    tabs={tabs} active={active} setActive={handleSet} size={size} />;
  if (variant === 'pill')       return <PillTabBar    tabs={tabs} active={active} setActive={handleSet} size={size} />;
  if (variant === 'bottom-nav') return <BottomNavBar  tabs={tabs} active={active} setActive={handleSet} />;
  return null;
}
