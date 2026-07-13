import { Text, Pressable, type PressableProps, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { cn } from '@/lib/utils';
import { useContext } from 'react';
import { SettingsContext } from '@/lib/settings-context';

export interface ButtonProps extends PressableProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  textClassName?: string;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  textClassName,
  children,
  onPress,
  disabled,
  ...props
}: ButtonProps) {
  // Read haptic preference — gracefully fall back to enabled if context is absent
  const settingsCtx = useContext(SettingsContext);
  const hapticEnabled = settingsCtx?.settings?.hapticFeedbackEnabled ?? true;

  const handlePress = (event: any) => {
    if (Platform.OS !== 'web' && hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(event);
  };

  const variantStyles = {
    primary: 'bg-primary',
    secondary: 'bg-surface border border-border',
    outline: 'bg-transparent border-2 border-primary',
    ghost: 'bg-transparent',
  };

  const sizeStyles = {
    sm: 'px-3 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  };

  const textVariantStyles = {
    primary: 'text-white font-semibold',
    secondary: 'text-foreground font-medium',
    outline: 'text-primary font-semibold',
    ghost: 'text-primary font-medium',
  };

  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 },
        disabled && { opacity: 0.5 },
      ]}
      className={cn(
        'rounded-full items-center justify-center',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      <Text
        className={cn(
          textVariantStyles[variant],
          textSizeStyles[size],
          textClassName
        )}
      >
        {children}
      </Text>
    </Pressable>
  );
}
