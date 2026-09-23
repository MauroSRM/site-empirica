/**
 * SrmAccordion — Acordeão expansível do SRM Site
 * 100% inline styles — usa useTheme() do DS Matriz
 */
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useTheme } from "../../../../design-system";

export interface SrmAccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SrmAccordion({ title, children, defaultOpen = false }: SrmAccordionProps) {
  const { tokens: t } = useTheme();
  const [open, setOpen] = useState(defaultOpen);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(open ? bodyRef.current.scrollHeight : 0);
    }
  }, [open]);

  return (
    <div style={{
      border: `1px solid ${open ? t.primary200 : t.borderDefault}`,
      borderRadius: t.radiusLg,
      background: open ? t.primary50 : t.surfaceDefault,
      overflow: "hidden",
      transition: "border-color 0.18s ease, background 0.18s ease",
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: 24,
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: t.fontFamily,
        }}
      >
        <span style={{
          fontSize: t.textXl,
          fontWeight: 600,
          color: t.textPrimary,
          lineHeight: "22.5px",
          flex: 1,
          minWidth: 0,
        }}>
          {title}
        </span>

        <div style={{
          width: 24, height: 24, borderRadius: t.radiusFull,
          background: open ? t.brandPrimaryHover : t.surfaceMuted,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          transition: "background 0.2s ease",
        }}>
          <ChevronDown
            size={16}
            style={{
              color: open ? t.textOnBrand : t.textSecondary,
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1), color 0.2s",
            }}
          />
        </div>
      </button>

      <div style={{
        height,
        overflow: "hidden",
        transition: "height 0.3s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <div ref={bodyRef} style={{
          borderTop: `1px solid ${t.primary200}`,
          padding: 24,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
