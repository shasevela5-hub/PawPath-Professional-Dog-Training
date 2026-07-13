/**
 * Settings context — loads AppSettings from AsyncStorage on mount and
 * exposes them (plus a setter) to the entire component tree.
 *
 * Wrap the root layout with <SettingsProvider> so every screen can call
 * `useSettings()` to read or update the persisted preferences.
 */

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getAppSettings, saveAppSettings } from '@/lib/storage';
import { SettingsContext } from '@/lib/settings-context';
import type { AppSettings } from '@/types';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'auto',
  notificationsEnabled: true,
  hapticFeedbackEnabled: true,
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted settings on mount
  useEffect(() => {
    getAppSettings()
      .then((loaded) => {
        setSettings(loaded);
      })
      .catch(() => {
        // Fall back to defaults silently
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  const updateSettings = useCallback(
    async (patch: Partial<AppSettings>) => {
      const next = { ...settings, ...patch };
      setSettings(next);
      await saveAppSettings(next);
    },
    [settings],
  );

  const value = useMemo(
    () => ({ settings, updateSettings, isLoaded }),
    [settings, updateSettings, isLoaded],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}
