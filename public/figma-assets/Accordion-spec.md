# Accordion — Component Spec

## Overview

Expandable list component. Default behavior is **single-open** (only one item expanded at a time). Use `multiOpen` to allow multiple items expanded simultaneously.

---

## Component Props

### `Accordion` (root)

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `AccordionItem[]` | — | List of accordion items |
| `defaultOpen` | `number \| null` | `null` | Index of item open by default. `null` = all closed |
| `multiOpen` | `boolean` | `false` | Allow multiple items open at the same time |

---

### `AccordionItem` (per item)

| Prop | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | ✅ | Header label |
| `body` | `string` | ✅ | Plain text body content |
| `content` | `"text-only" \| "text-with-buttons"` | — | Body variant |
| `buttons` | `{ label: string }[]` | — | Action buttons — only used with `text-with-buttons` |
| `badge` | `string` | — | 🆕 Secondary text shown inline next to the title (e.g. `"0 docs"`, `"3 files"`) |
| `leftBar` | `boolean` | — | 🆕 Shows a vertical accent bar on the left edge of the header |
| `onClickOverride` | `function` | — | Replaces expand/collapse with an external action (e.g. opens a drawer). Renders a **ChevronRight** instead of ChevronDown/Up |

---

## Variants & States

### `content` variants
- **text-only** — body renders a paragraph
- **text-with-buttons** — body renders a stacked list of secondary buttons

### Item states
- **closed** — default surface, border `borderDefault`, ChevronDown
- **open** — surface `surfaceSelected`, border `borderSelected`, ChevronUp with filled circle bg `brandPrimaryHover`
- **override** — never opens; ChevronRight; click fires `onClickOverride`

---

## New Props — Design Specs

### `leftBar`
- Width: `3px`
- Height: stretches to full header height (`align-self: stretch`)
- Color: `brandAccent`
- Border radius: `2px`
- Position: inline, before the title, inside the header padding

```
┌─────────────────────────────────────────────┐
│ ▌  Title text          badge text       ∨  │
└─────────────────────────────────────────────┘
  ↑
  leftBar (3px, brandAccent)
```

### `badge`
- Position: inline, immediately after the title, same row
- Font size: `textSm` (13px)
- Font weight: `400` (regular)
- Color: `textTertiary`
- No background, no border — plain text only

```
┌─────────────────────────────────────────────┐
│ ▌  Fechamento de Fundo   0 docs         ∨  │
└─────────────────────────────────────────────┘
                            ↑
                            badge
```

---

## Spacing

| Zone | Value |
|---|---|
| Header padding | `24px` all sides |
| Body padding | `16px` top · `24px` right/bottom/left |
| Chevron circle | `24 × 24px` |
| Gap between items | `12px` |
| Item border radius | `radiusLg` |

---

## Typography

| Element | Size | Weight | Color |
|---|---|---|---|
| Title | `textXl` | `600` | `textPrimary` |
| Body | `textLg` | `400` | `textSecondary` |
| Badge | `textSm` | `400` | `textTertiary` |

---

## Usage Examples

### Standard accordion
```
items: [
  { title: "Section A", body: "Description text here." },
  { title: "Section B", body: "More content here.", content: "text-only" },
]
```

### With leftBar + badge (document list)
```
multiOpen: true
items: [
  { title: "Fechamento de Fundo",   body: "", leftBar: true, badge: "0 docs" },
  { title: "Assembleia de Liquidação", body: "", leftBar: true, badge: "2 docs",
    content: "text-with-buttons", buttons: [{ label: "Ata 2024" }] },
]
```

### With onClickOverride (opens drawer)
```
items: [
  { title: "Fechamento de Fundo", body: "", leftBar: true,
    onClickOverride: → opens side drawer },
]
```

---

## Behavior Notes

- `leftBar` and `badge` are **independent** — can be used together or separately
- `onClickOverride` **disables** expand/collapse entirely for that item
- `multiOpen: true` tracks open state per-item independently; no limit on how many can be open
- When `badge` is an empty string `""`, it should **not** render (treat as undefined)
