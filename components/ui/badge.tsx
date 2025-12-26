import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

export interface BadgeProps extends ViewProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'premium';
  size?: 'sm' | 'md';
  className?: string;
  textClassName?: string;
  children: React.ReactNode;
}

export function Badge({
  variant = 'default',
  size = 'md',
  className,
  textClassName,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-surface border border-border',
    success: 'bg-success/10 border border-success/20',
    warning: 'bg-warning/10 border border-warning/20',
    error: 'bg-error/10 border border-error/20',
    premium: 'bg-premium/10 border border-premium/20',
  };

  const textVariantStyles = {
    default: 'text-foreground',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    premium: 'text-premium',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5',
    md: 'px-3 py-1',
  };

  const textSizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
  };

  return (
    <View
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
          'font-medium',
          textVariantStyles[variant],
          textSizeStyles[size],
          textClassName
        )}
      >
        {children}
      </Text>
    </View>
  );
}
