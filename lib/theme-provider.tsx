import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Appearance, View, useColorScheme as useSystemColorScheme } from "react-native";
import { colorScheme as nativewindColorScheme, vars } from "nativewind";

import { SchemeColors, type ColorScheme } from "@/constants/theme";
import { getAppSettings, saveAppSettings } from "@/lib/storage";

/** The persisted preference — 'auto' means follow the system. */
export type ThemePreference = "light" | "dark" | "auto";

type ThemeContextValue = {
  colorScheme: ColorScheme;
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
  /** @deprecated use setThemePreference instead */
  setColorScheme: (scheme: ColorScheme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = (useSystemColorScheme() ?? "light") as ColorScheme;
  const [preference, setPreferenceState] = useState<ThemePreference>("auto");

  // Derive the effective colour scheme from the stored preference
  const colorScheme: ColorScheme =
    preference === "auto" ? systemScheme : preference;

  const applyScheme = useCallback((scheme: ColorScheme) => {
    nativewindColorScheme.set(scheme);
    Appearance.setColorScheme?.(scheme);
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.dataset.theme = scheme;
      root.classList.toggle("dark", scheme === "dark");
      const palette = SchemeColors[scheme];
      Object.entries(palette).forEach(([token, value]) => {
        root.style.setProperty(`--color-${token}`, value);
      });
    }
  }, []);

  // Load saved preference from AsyncStorage on mount
  useEffect(() => {
    getAppSettings()
      .then((saved) => {
        if (saved?.theme) {
          setPreferenceState(saved.theme as ThemePreference);
        }
      })
      .catch(() => {
        // ignore — fall back to 'auto'
      });
  }, []);

  // Apply the effective scheme whenever it changes
  useEffect(() => {
    applyScheme(colorScheme);
  }, [applyScheme, colorScheme]);

  const setThemePreference = useCallback(
    (pref: ThemePreference) => {
      setPreferenceState(pref);
      // Persist immediately
      getAppSettings()
        .then((current) => saveAppSettings({ ...current, theme: pref }))
        .catch(() => {});
    },
    [],
  );

  // Back-compat shim: setColorScheme('light'|'dark') maps to setThemePreference
  const setColorScheme = useCallback(
    (scheme: ColorScheme) => {
      setThemePreference(scheme);
    },
    [setThemePreference],
  );

  const themeVariables = useMemo(
    () =>
      vars({
        "color-primary": SchemeColors[colorScheme].primary,
        "color-background": SchemeColors[colorScheme].background,
        "color-surface": SchemeColors[colorScheme].surface,
        "color-foreground": SchemeColors[colorScheme].foreground,
        "color-muted": SchemeColors[colorScheme].muted,
        "color-border": SchemeColors[colorScheme].border,
        "color-success": SchemeColors[colorScheme].success,
        "color-warning": SchemeColors[colorScheme].warning,
        "color-error": SchemeColors[colorScheme].error,
      }),
    [colorScheme],
  );

  const value = useMemo(
    () => ({
      colorScheme,
      themePreference: preference,
      setThemePreference,
      setColorScheme,
    }),
    [colorScheme, preference, setThemePreference, setColorScheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View style={[{ flex: 1 }, themeVariables]}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return ctx;
}
