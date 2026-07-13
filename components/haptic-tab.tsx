import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { useContext } from "react";
import { SettingsContext } from "@/lib/settings-context";

export function HapticTab(props: BottomTabBarButtonProps) {
  const settingsCtx = useContext(SettingsContext);
  const hapticEnabled = settingsCtx?.settings?.hapticFeedbackEnabled ?? true;

  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === "ios" && hapticEnabled) {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
