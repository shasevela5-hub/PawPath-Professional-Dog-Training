// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
// @ts-expect-error - Material Icons has a different type signature
const MAPPING = {
  // Navigation & general
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.up": "keyboard-arrow-up",
  "chevron.down": "keyboard-arrow-down",
  "book.fill": "menu-book",
  "chart.bar.fill": "bar-chart",
  "pawprint.fill": "pets",
  "star.fill": "star",
  "lock.fill": "lock",
  "checkmark.circle.fill": "check-circle",
  "plus.circle.fill": "add-circle",
  "gear": "settings",

  // Settings screen icons
  "gearshape.fill": "settings",
  "paintbrush.fill": "palette",
  "bell.fill": "notifications",
  "hand.tap.fill": "touch-app",
  "trash.fill": "delete",
  "info.circle.fill": "info",
  "doc.text.fill": "description",
  "heart.fill": "favorite",
  "sun.max.fill": "wb-sunny",
  "moon.fill": "nightlight-round",
  "circle.lefthalf.filled": "brightness-medium",
  "command.circle.fill": "school",
  "magic.wand.and.stars": "auto-awesome",

  // Profile / exercise screen icons
  "xmark.circle.fill": "cancel",
  "play.circle.fill": "play-circle",
  "pause.circle.fill": "pause-circle",
  "arrow.clockwise": "refresh",
  "trophy.fill": "emoji-events",
  "flame.fill": "local-fire-department",
  "clock.fill": "schedule",
  "calendar": "calendar-today",
  "checkmark": "check",
  "exclamationmark.triangle.fill": "warning",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
