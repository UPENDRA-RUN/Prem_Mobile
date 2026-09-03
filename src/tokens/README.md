# Prem Mobile — Tokens Design System Documentation

> **Version**: `v1.0.0`  
> **Last Updated**: `2026-09-04`  
> **Architecture**: Three-Tier Token Architecture (Primitive, Semantic, Component)

---

## 🏛️ 1. Three-Tier Token Architecture

Our design token system is structured into 3 distinct, scalable tiers:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PRIMITIVE TOKENS (Raw values)                            │
│    e.g., primitive-color-yellow-500 = #FFD400                │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. SEMANTIC TOKENS (Purpose-describing intent)               │
│    e.g., semantic-color-interactive-primary-default = #FFD400 │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. COMPONENT TOKENS (Element-scoped decisions)               │
│    e.g., component-button-primary-bg = #FFD400              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏷️ 2. Naming Conventions

All design tokens follow a strict, predictable naming pattern so any token name communicates its purpose without needing documentation:

```
[tier]-[category]-[purpose/concept]-[variant/state]
```

### Examples:
- **`primitive-color-yellow-500`**: Tells you the raw value (`#FFD400`).
- **`semantic-color-interactive-primary-default`**: Tells you *when & where* to use it (Primary interactive CTAs in default state).
- **`component-button-primary-bg`**: Scopes the decision to the specific primary button background element.

---

## 📖 3. Token Usage & Guidelines

| Semantic Token | Intended Use | Allowed Contexts | Disallowed Contexts |
|---|---|---|---|
| `semantic-color-interactive-primary-default` | Primary CTAs, main action buttons, active toggles | Main Add to Cart buttons, Checkout CTAs, active filters | Body backgrounds, secondary text |
| `semantic-color-interactive-danger-default` | High-risk destructive actions, discount badges | Delete account button, discount badges, stock alert tags | Primary navigation, success alerts |
| `semantic-color-bg-dark` | High-contrast brand containers | Top announcement bar, footer, brand cards | Product card body backgrounds |
| `semantic-color-border-focus` | Active focus rings, selected options | Input focus border, selected variant pills | Muted divider rules |

---

## ⚖️ 4. Token Governance Policy

1. **Strict Token Enforcement**: Hardcoded hex colors (e.g. `#FFD400`) and arbitrary magic numbers in component CSS are strictly prohibited.
2. **Proposing New Tokens**:
   - New tokens must be submitted via review.
   - Must present clear reasoning of purpose, tier classification (Primitive vs Semantic vs Component), and scalable multi-component usage.
3. **1:1 Code Alignment**:
   - `src/tokens/tokens.js` (JavaScript) ↔ `src/index.css` (CSS Variables) ↔ `tailwind.config.js` (Tailwind Utilities) map 1:1.

---

## 📜 5. Versioning & Changelog

### `v1.0.0` — Initial Release (2026-09-04)
- Established 3-Tier Token Architecture.
- Defined color, typography, spacing, radius, and shadow tokens.
- Integrated CSS Custom Properties and Tailwind configuration mapping.
- Created interactive token documentation viewer at `/design-tokens`.
