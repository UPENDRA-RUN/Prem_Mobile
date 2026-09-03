/**
 * Prem Mobile - Tokens Design System
 * Architecture: Three-Tier Token Architecture (Primitive, Semantic, Component)
 * Version: 1.0.0
 * Last Updated: 2026-09-04
 */

export const designTokensMeta = {
  systemName: "Prem Mobile Design Tokens",
  version: "1.0.0",
  lastUpdated: "2026-09-04",
  governancePolicy: "Strict Token Usage. Hardcoded hex colors and arbitrary pixel magic numbers are prohibited for core theme elements.",
  changelog: [
    {
      version: "1.0.0",
      date: "2026-09-04",
      description: "Initial release of 3-Tier Design Token Architecture (Primitive, Semantic, Component)."
    }
  ]
};

// TIER 1: PRIMITIVE TOKENS (Raw values)
export const primitiveTokens = {
  color: {
    black: {
      900: "#050505",
      800: "#111111",
      700: "#1f1f1f",
      600: "#333333"
    },
    yellow: {
      500: "#FFD400",
      600: "#e6be00",
      400: "#ffe033"
    },
    red: {
      600: "#E31B23",
      700: "#cc141c",
      500: "#ff333a"
    },
    green: {
      500: "#25D366",
      600: "#20ba5a",
      100: "#dcfce7"
    },
    slate: {
      50: "#F6F6F6",
      100: "#f1f5f9",
      200: "#e2e8f0",
      400: "#94a3b8",
      500: "#64748b",
      700: "#334155",
      900: "#0f172a"
    },
    white: {
      100: "#FFFFFF"
    }
  },
  typography: {
    fontFamily: {
      sans: "'Poppins', system-ui, -apple-system, sans-serif",
      display: "'Poppins', system-ui, -apple-system, sans-serif"
    },
    fontSize: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px"
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900
    }
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px"
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    full: "9999px"
  },
  shadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    glowYellow: "0 0 25px rgba(255, 212, 0, 0.45)"
  }
};

// TIER 2: SEMANTIC TOKENS (Purpose-describing intent)
export const semanticTokens = {
  color: {
    interactive: {
      primary: {
        default: primitiveTokens.color.yellow[500],
        hover: primitiveTokens.color.yellow[600],
        text: primitiveTokens.color.black[900]
      },
      danger: {
        default: primitiveTokens.color.red[600],
        hover: primitiveTokens.color.red[700],
        text: primitiveTokens.color.white[100]
      },
      success: {
        default: primitiveTokens.color.green[500],
        hover: primitiveTokens.color.green[600],
        text: primitiveTokens.color.white[100]
      }
    },
    bg: {
      body: primitiveTokens.color.slate[50],
      surface: primitiveTokens.color.white[100],
      dark: primitiveTokens.color.black[900],
      card: primitiveTokens.color.white[100]
    },
    text: {
      primary: primitiveTokens.color.black[900],
      secondary: primitiveTokens.color.slate[500],
      inverse: primitiveTokens.color.white[100],
      brand: primitiveTokens.color.yellow[500],
      accent: primitiveTokens.color.red[600]
    },
    border: {
      subtle: primitiveTokens.color.slate[200],
      focus: primitiveTokens.color.yellow[500],
      brand: primitiveTokens.color.yellow[500]
    },
    feedback: {
      successBg: primitiveTokens.color.green[100],
      successText: "#14532d",
      errorBg: "#fef2f2",
      errorText: "#991b1b"
    }
  }
};

// TIER 3: COMPONENT TOKENS (Element-scoped decisions)
export const componentTokens = {
  button: {
    primaryBg: semanticTokens.color.interactive.primary.default,
    primaryText: semanticTokens.color.interactive.primary.text,
    primaryHoverBg: semanticTokens.color.interactive.primary.hover,
    dangerBg: semanticTokens.color.interactive.danger.default,
    dangerText: semanticTokens.color.interactive.danger.text
  },
  card: {
    bg: semanticTokens.color.bg.card,
    border: semanticTokens.color.border.subtle,
    hoverBorder: semanticTokens.color.border.brand,
    radius: primitiveTokens.radius.xl
  },
  badge: {
    discountBg: primitiveTokens.color.red[600],
    discountText: primitiveTokens.color.white[100],
    tagBg: primitiveTokens.color.black[900],
    tagText: primitiveTokens.color.yellow[500]
  },
  input: {
    bg: primitiveTokens.color.slate[50],
    border: primitiveTokens.color.slate[200],
    focusBorder: semanticTokens.color.border.focus,
    radius: primitiveTokens.radius.md
  }
};
