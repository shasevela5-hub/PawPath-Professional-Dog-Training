import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { useSettings } from '@/lib/settings-provider';
import { useThemeContext, type ThemePreference } from '@/lib/theme-provider';
import { clearAllData } from '@/lib/storage';

// ─────────────────────────────────────────────
// Small helper components
// ─────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <Text className="text-xs font-semibold text-muted uppercase tracking-widest px-1 pb-1 pt-2">
      {title}
    </Text>
  );
}

interface SettingsRowProps {
  icon: string;
  iconColor?: string;
  label: string;
  sublabel?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
}

function SettingsRow({
  icon,
  iconColor,
  label,
  sublabel,
  right,
  onPress,
  destructive = false,
}: SettingsRowProps) {
  const colors = useColors();
  const resolvedIconColor = iconColor ?? (destructive ? colors.error : colors.muted);

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      disabled={!onPress && !right}
    >
      <Card className="flex-row items-center gap-3 py-3">
        <View
          className="w-9 h-9 rounded-xl items-center justify-center"
          style={{ backgroundColor: resolvedIconColor + '22' }}
        >
          <IconSymbol name={icon as any} size={20} color={resolvedIconColor} />
        </View>
        <View className="flex-1 gap-0.5">
          <Text
            className={`text-base font-medium ${destructive ? 'text-error' : 'text-foreground'}`}
          >
            {label}
          </Text>
          {sublabel ? (
            <Text className="text-xs text-muted">{sublabel}</Text>
          ) : null}
        </View>
        {right ?? (
          onPress ? (
            <IconSymbol name="chevron.right" size={18} color={colors.muted} />
          ) : null
        )}
      </Card>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────
// Theme picker
// ─────────────────────────────────────────────

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: 'sun.max.fill' },
  { value: 'dark', label: 'Dark', icon: 'moon.fill' },
  { value: 'auto', label: 'Auto', icon: 'circle.lefthalf.filled' },
];

function ThemePicker() {
  const colors = useColors();
  const { themePreference, setThemePreference } = useThemeContext();
  const { updateSettings } = useSettings();

  function handleSelect(pref: ThemePreference) {
    setThemePreference(pref);
    updateSettings({ theme: pref });
  }

  return (
    <View className="flex-row gap-2 mt-1">
      {THEME_OPTIONS.map((opt) => {
        const active = themePreference === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            activeOpacity={0.75}
            onPress={() => handleSelect(opt.value)}
            className="flex-1 items-center gap-1.5 py-3 rounded-2xl border"
            style={{
              backgroundColor: active ? colors.primary : colors.surface,
              borderColor: active ? colors.primary : colors.border,
            }}
          >
            <IconSymbol
              name={opt.icon as any}
              size={22}
              color={active ? colors.background : colors.muted}
            />
            <Text
              className="text-xs font-semibold"
              style={{ color: active ? colors.background : colors.foreground }}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─────────────────────────────────────────────
// Reminder days picker
// ─────────────────────────────────────────────

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function ReminderDaysPicker() {
  const colors = useColors();
  const { settings, updateSettings } = useSettings();
  const activeDays: number[] = settings.reminderDays ?? [1, 2, 3, 4, 5];

  function toggleDay(day: number) {
    const next = activeDays.includes(day)
      ? activeDays.filter((d) => d !== day)
      : [...activeDays, day].sort((a, b) => a - b);
    updateSettings({ reminderDays: next });
  }

  return (
    <View className="flex-row gap-1.5 mt-2">
      {DAY_LABELS.map((label, idx) => {
        const active = activeDays.includes(idx);
        return (
          <TouchableOpacity
            key={idx}
            activeOpacity={0.75}
            onPress={() => toggleDay(idx)}
            className="flex-1 items-center py-2 rounded-xl border"
            style={{
              backgroundColor: active ? colors.primary : colors.surface,
              borderColor: active ? colors.primary : colors.border,
            }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: active ? colors.background : colors.muted }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─────────────────────────────────────────────
// Reminder time picker (simple hour/minute stepper)
// ─────────────────────────────────────────────

function ReminderTimePicker() {
  const colors = useColors();
  const { settings, updateSettings } = useSettings();

  // Parse stored "HH:MM" or fall back to "09:00"
  const stored = settings.reminderTime ?? '09:00';
  const [hStr, mStr] = stored.split(':');
  const [hour, setHour] = useState(parseInt(hStr ?? '9', 10));
  const [minute, setMinute] = useState(parseInt(mStr ?? '0', 10));

  function persist(h: number, m: number) {
    const pad = (n: number) => String(n).padStart(2, '0');
    updateSettings({ reminderTime: `${pad(h)}:${pad(m)}` });
  }

  function changeHour(delta: number) {
    const next = (hour + delta + 24) % 24;
    setHour(next);
    persist(next, minute);
  }

  function changeMinute(delta: number) {
    const next = (minute + delta + 60) % 60;
    setMinute(next);
    persist(hour, next);
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  const ampm = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;

  return (
    <View className="flex-row items-center justify-center gap-4 mt-2 py-2">
      {/* Hour */}
      <View className="items-center gap-1">
        <TouchableOpacity
          onPress={() => changeHour(1)}
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.surface }}
        >
          <IconSymbol name="chevron.up" size={18} color={colors.primary} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-foreground w-12 text-center">
          {pad(displayHour)}
        </Text>
        <TouchableOpacity
          onPress={() => changeHour(-1)}
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.surface }}
        >
          <IconSymbol name="chevron.down" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-bold text-foreground">:</Text>

      {/* Minute */}
      <View className="items-center gap-1">
        <TouchableOpacity
          onPress={() => changeMinute(5)}
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.surface }}
        >
          <IconSymbol name="chevron.up" size={18} color={colors.primary} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-foreground w-12 text-center">
          {pad(minute)}
        </Text>
        <TouchableOpacity
          onPress={() => changeMinute(-5)}
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.surface }}
        >
          <IconSymbol name="chevron.down" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Text className="text-lg font-semibold text-muted">{ampm}</Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// Main Settings Screen
// ─────────────────────────────────────────────

export default function SettingsScreen() {
  const colors = useColors();
  const { settings, updateSettings } = useSettings();

  async function handleToggleNotifications(value: boolean) {
    await updateSettings({ notificationsEnabled: value });
  }

  async function handleToggleHaptics(value: boolean) {
    await updateSettings({ hapticFeedbackEnabled: value });
    if (value && Platform.OS !== 'web') {
      // Give a small confirmation buzz when enabling
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }

  function handleResetData() {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your training progress, dog profile, and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert(
                'Data Reset',
                'All data has been cleared. Please restart the app to begin fresh.',
              );
            } catch {
              Alert.alert('Error', 'Failed to reset data. Please try again.');
            }
          },
        },
      ],
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 gap-2">
          {/* ── Header ── */}
          <Text className="text-4xl font-bold text-foreground mb-4">Settings</Text>

          {/* ── Appearance ── */}
          <SectionHeader title="Appearance" />
          <Card className="gap-3">
            <View className="flex-row items-center gap-3">
              <View
                className="w-9 h-9 rounded-xl items-center justify-center"
                style={{ backgroundColor: colors.primary + '22' }}
              >
                <IconSymbol name="paintbrush.fill" size={20} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-foreground">Theme</Text>
                <Text className="text-xs text-muted">Choose your preferred colour scheme</Text>
              </View>
            </View>
            <ThemePicker />
          </Card>

          {/* ── Notifications ── */}
          <SectionHeader title="Notifications" />
          <Card className="gap-4">
            <SettingsRow
              icon="bell.fill"
              label="Training Reminders"
              sublabel="Get daily nudges to keep your streak going"
              right={
                <Switch
                  value={settings.notificationsEnabled}
                  onValueChange={handleToggleNotifications}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.background}
                />
              }
            />

            {settings.notificationsEnabled && (
              <>
                <View className="border-t border-border pt-3 gap-1">
                  <Text className="text-sm font-semibold text-foreground">Reminder Time</Text>
                  <Text className="text-xs text-muted">
                    When should we remind you to train?
                  </Text>
                  <ReminderTimePicker />
                </View>

                <View className="border-t border-border pt-3 gap-1">
                  <Text className="text-sm font-semibold text-foreground">Reminder Days</Text>
                  <Text className="text-xs text-muted">
                    Which days should we send reminders?
                  </Text>
                  <ReminderDaysPicker />
                </View>
              </>
            )}
          </Card>

          {/* ── Feedback ── */}
          <SectionHeader title="Feedback" />
          <SettingsRow
            icon="hand.tap.fill"
            label="Haptic Feedback"
            sublabel="Vibrate on interactions (mobile only)"
            right={
              <Switch
                value={settings.hapticFeedbackEnabled}
                onValueChange={handleToggleHaptics}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            }
          />

          {/* ── Data ── */}
          <SectionHeader title="Data" />
          <SettingsRow
            icon="trash.fill"
            label="Reset All Data"
            sublabel="Permanently delete all progress and settings"
            destructive
            onPress={handleResetData}
          />

          {/* ── About ── */}
          <SectionHeader title="About" />
          <Card className="gap-3">
            <SettingsRow
              icon="info.circle.fill"
              label="Version"
              sublabel="PawPath Professional Dog Training"
              right={
                <Text className="text-sm text-muted font-medium">1.0.0</Text>
              }
            />
            <View className="border-t border-border" />
            <SettingsRow
              icon="doc.text.fill"
              label="Privacy Policy"
              onPress={() =>
                Alert.alert(
                  'Privacy Policy',
                  'PawPath stores all your data locally on your device. We do not collect or share personal information.',
                )
              }
            />
            <View className="border-t border-border" />
            <SettingsRow
              icon="heart.fill"
              iconColor={colors.error}
              label="Made with ❤️ for dog trainers"
              sublabel="Thank you for using PawPath!"
            />
          </Card>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
