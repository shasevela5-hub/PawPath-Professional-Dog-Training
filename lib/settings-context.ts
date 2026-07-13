/**
 * Thin re-export of the SettingsContext object so UI components
 * (e.g. Button) can import it without pulling in the full provider module
 * and creating circular dependency issues.
 *
 * The actual provider and hook live in settings-provider.tsx.
 */

import { createContext } from 'react';
import type { AppSettings } from '@/types';

type SettingsContextValue = {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
  isLoaded: boolean;
};

export const SettingsContext = createContext<SettingsContextValue | null>(null);
