import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions, Platform } from 'react-native';
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
  const playerRef = useRef<any>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Validate URL format
  const isValidUrl = useMemo(() => {
    try {
      new URL(videoUrl);
      return true;
    } catch {
      return false;
    }
  }, [videoUrl]);

  // Create player with comprehensive error handling
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = false;
    playerRef.current = player;

    // Listen for status updates
    const statusSubscription = player.addListener('statusChange', (status: any) => {
      if (status === 'error') {
        // Attempt retry for transient network errors
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current += 1;
          console.warn(`Video load failed, retrying (${retryCountRef.current}/${maxRetries})...`);
          setTimeout(() => {
            player.replace(videoUrl);
          }, 1000 * retryCountRef.current); // Exponential backoff
        } else {
          const errorMsg = Platform.OS === 'web'
            ? 'Video unavailable. This may be a browser compatibility issue.'
            : 'Failed to load video. Please check your connection.';
          setError(errorMsg);
          setIsLoading(false);
        }
      } else if (status === 'readyToPlay') {
        setError(null);
        setIsLoading(false);
        retryCountRef.current = 0; // Reset retry count on success
      }
    });

    // Listen for play/pause state changes
    const playingSubscription = player.addListener('playingChange', (payload: any) => {
      setIsPlaying(payload.isPlaying ?? false);
    });

    // Cleanup subscriptions
    return () => {
      statusSubscription?.remove?.();
      playingSubscription?.remove?.();
    };
  });

  // Cleanup on unmount or URL change
  useEffect(() => {
    retryCountRef.current = 0;
    return () => {
      if (playerRef.current) {
        playerRef.current.release?.();
      }
    };
  }, [videoUrl]);

  const handlePlayPause = () => {
    if (!player) return;
    
    try {
      if (isPlaying) {
        player.pause();
      } else {
        player.play();
      }
    } catch (err) {
      console.error('Error toggling playback:', err);
      setError('Failed to play video. Please try again.');
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    retryCountRef.current = 0;
    if (playerRef.current) {
      playerRef.current.replace(videoUrl);
    }
  };

  const screenWidth = Dimensions.get('window').width;
  const videoHeight = Math.min((screenWidth - 48) * (9 / 16), 400); // 16:9 aspect ratio, max 400px

  // Render error state if URL is invalid
  if (!isValidUrl) {
    return (
      <View className={cn('gap-3', className)}>
        {title && (
          <Text className="text-lg font-semibold text-foreground">{title}</Text>
        )}
        <View
          className="relative rounded-xl overflow-hidden bg-surface border border-border"
          style={{ height: videoHeight }}
        >
          <View className="flex-1 items-center justify-center gap-3 p-4">
            <Text className="text-center text-sm text-muted">
              Video demonstration coming soon
            </Text>
          </View>
        </View>
      </View>
    );
  }

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
          <View className="flex-1 items-center justify-center bg-surface gap-3 p-4">
            <Text className="text-center text-sm text-error px-4">{error}</Text>
            <TouchableOpacity
              onPress={handleRetry}
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white text-sm font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <VideoView
              ref={videoRef}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
              style={{ width: '100%', height: '100%' }}
              nativeControls={false}
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
          disabled={error !== null || isLoading}
          className="flex-1 py-3 px-4 rounded-lg items-center justify-center"
          style={{ 
            backgroundColor: error || isLoading ? colors.muted : colors.primary,
            opacity: error || isLoading ? 0.5 : 1,
          }}
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
