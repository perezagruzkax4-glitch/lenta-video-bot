'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { VideoData } from '@/app/api/videos/route';
import { initTelegram, getTelegramUser } from '@/lib/telegram';

interface VideoFeedProps {
  videos: VideoData[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const isSwiping = useRef(false);
  const user = getTelegramUser();

  // Инициализация Telegram Web App
  useEffect(() => {
    initTelegram();
  }, []);

  // Отслеживаем видимость каждого видео
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.7,
    triggerOnce: false,
  });

  // При смене индекса или видимости управляем воспроизведением
  useEffect(() => {
    const video = videoRefs.current[currentIndex];
    if (video) {
      if (inView) {
        video.play().catch((e) => console.log('Autoplay prevented:', e));
      } else {
        video.pause();
      }
    }
  }, [currentIndex, inView]);

  // Функция перехода к следующему/предыдущему видео
  const goToVideo = useCallback(
    (index: number) => {
      if (index >= 0 && index < videos.length) {
        // Останавливаем текущее видео
        const currentVideo = videoRefs.current[currentIndex];
        if (currentVideo) currentVideo.pause();

        setCurrentIndex(index);
      }
    },
    [currentIndex, videos.length]
  );

  // Обработчики свайпов
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!touchStartY.current || !touchEndY.current) return;
    const deltaY = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 50;

    if (Math.abs(deltaY) > minSwipeDistance) {
      if (deltaY > 0) {
        // свайп вверх — следующее видео
        goToVideo(currentIndex + 1);
      } else {
        // свайп вниз — предыдущее видео
        goToVideo(currentIndex - 1);
      }
    }

    touchStartY.current = null;
    touchEndY.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {videos.map((video, index) => (
        <div
          key={video.id}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translateY(${(index - currentIndex) * 100}%)`,
            transition: 'transform 0.3s ease-out',
            willChange: 'transform',
          }}
        >
          <div
            className="relative w-full h-full"
            ref={index === currentIndex ? inViewRef : null}
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={video.url}
              className="absolute inset-0 w-full h-full object-cover"
              loop
              muted={false}
              playsInline
              preload="metadata"
              poster={video.thumbnail}
            />
            {/* Оверлей с информацией */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white font-medium text-lg">
                {video.author}
              </p>
              <p className="text-white/80 text-sm">{video.description}</p>
            </div>
            {/* Индикатор для пользователя Telegram */}
            {user && (
              <div className="absolute top-4 left-4 bg-black/40 rounded-full px-3 py-1">
                <p className="text-white text-xs">👤 {user.first_name}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}