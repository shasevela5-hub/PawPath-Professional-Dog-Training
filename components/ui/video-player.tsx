import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  description?: string;
  className?: string;
}

export function VideoPlayer({
  videoUrl,
  title,
  description,
  className,
}: VideoPlayerProps) {
  const colors = useColors();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = false;
  });

  const handlePlayPause = () => {
    if (player.playing) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  React.useEffect(() => {
    // Simulate video loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [videoUrl]);

  const screenWidth = Dimensions.get('window').width;
  const videoHeight = Math.min((screenWidth - 48) * (9 / 16), 400); // 16:9 aspect ratio, max 400px

  return (
    <View className={cn('gap-3', className)}>
      {title && (
        <Text className="text-lg font-semibold text-foreground">{title}</Text>
      )}

      {description && (
        <Text className="text-sm text-muted leading-relaxed">{description}</Text>
      )}

      <View
        className="relative rounded-xl overflow-hidden bg-black"
        style={{ height: videoHeight }}
      >
        {error ? (
          <View className="flex-1 items-center justify-center bg-surface">
            <Text className="text-center text-sm text-error px-4">{error}</Text>
          </View>
        ) : (
          <>
            <VideoView
              ref={videoRef}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
              style={{ width: '100%', height: '100%' }}
            />

            {isLoading && (
              <View className="absolute inset-0 items-center justify-center bg-black/50">
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}

            {!isLoading && !error && (
              <TouchableOpacity
                onPress={handlePlayPause}
                style={{
                  position: 'absolute',
                  inset: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                activeOpacity={0.7}
              >
                {!isPlaying && (
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text className="text-2xl text-white">▶</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      <View className="flex-row gap-2 justify-center">
        <TouchableOpacity
          onPress={handlePlayPause}
          className="flex-1 py-3 px-4 rounded-lg items-center justify-center"
          style={{ backgroundColor: colors.primary }}
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold">
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
