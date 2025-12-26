import { View, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

export interface ProgressBarProps extends ViewProps {
  progress: number; // 0-100
  height?: number;
  color?: string;
  backgroundColor?: string;
  className?: string;
}

export function ProgressBar({
  progress,
  height = 8,
  color,
  backgroundColor,
  className,
  ...props
}: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View
      className={cn('rounded-full overflow-hidden', backgroundColor || 'bg-surface', className)}
      style={{ height }}
      {...props}
    >
      <View
        className={color || 'bg-primary'}
        style={{
          width: `${clampedProgress}%`,
          height: '100%',
        }}
      />
    </View>
  );
}
