import React, { createContext, useContext, useState } from 'react'
import { t as staticT, getTokens } from './tokens'

export type ThemeOverride = {
  themeName?:         string
  brandPrimary?:      string
  brandAccent?:       string
  brandSecondary?:    string
  surfaceBackground?: string
  buttonRadius?:      string
  inputRadius?:       string
  cardRadius?:        string
  spacingScale?:      'compact' | 'normal' | 'spacious'
}

export const defaultOverride: ThemeOverride = {
  themeName:         'HB Digital',
  brandPrimary:      '#2758b5',
  brandAccent:       '#ff8200',
  brandSecondary:    '#1e6b55',
  surfaceBackground: '#f5f7fa',
  buttonRadius:      '6px',
  inputRadius:       '8px',
  cardRadius:        '20px',
  spacingScale:      'normal',
}

type ThemeContextValue = {
  override:    ThemeOverride
  tokens:      typeof staticT
  setOverride: (o: ThemeOverride) => void
}

export const ThemeContext = createContext<ThemeContextValue>({
  override:    defaultOverride,
  tokens:      staticT,
  setOverride: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [override, setOverride] = useState<ThemeOverride>(defaultOverride)
  const tokens = getTokens(override)

  return (
    <ThemeContext.Provider value={{ override, tokens, setOverride }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
