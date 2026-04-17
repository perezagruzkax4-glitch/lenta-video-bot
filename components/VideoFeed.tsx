'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { VideoData } from '@/app/api/videos/route';
import { initTelegram, getTelegramUser } from '@/lib/telegram';

interface VideoFeedProps {
  videos: VideoData[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  // Инициализируем массив null-значениями, чтобы избежать ошибок доступа
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  
  // Получаем пользователя (это синхронная функция, можно вызывать в теле компонента)
  const user = getTelegramUser();

  // Инициализация Telegram Web App
  useEffect(() => {
    initTelegram();
  }, []);

  // Инициализация массива рефов при изменении количества видео
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videos.length);
  }, [videos.length]);

  // Управление воспроизведением при смене индекса
  useEffect(() => {
    // 1. Пауза предыдущего видео (если есть)
    const prevIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : 
                      currentIndex + 1 < videos.length ? currentIndex + 1 : null;
    
    // На всякий случай пройдемся по всем, кроме текущего, и поставим на паузу
    videoRefs.current.forEach((video, idx) => {
      if (idx !== currentIndex && video) {
        video.pause();
        video.currentTime = 0; // Опционально: сброс на начало
      }
    });

    // 2. Запуск текущего видео
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      // Браузеры требуют взаимодействия пользователя для воспроизведения звука,
      // поэтому лучше начинать с muted или ловить ошибку
      currentVideo.play().catch((e) => {
        console.warn('Autoplay prevented:', e);
        // Если автоплей заблокирован, можно включить mute и попробовать снова
        currentVideo.muted = true;
        currentVideo.play().catch(console.error);
      });
    }
  }, [currentIndex, videos.length]);

  // Функция перехода к следующему/предыдущему видео
  const goToVideo = useCallback(
    (index: number) => {
      if (index >= 0 && index < videos.length) {
        setCurrentIndex(index);
      }
    },
    [videos.length]
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
        // Свайп вверх — следующее видео
        goToVideo(currentIndex + 1);
      } else {
        // Свайп вниз — предыдущее видео
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
            zIndex: index === currentIndex ? 10 : 1, // Текущее видео выше остальных
          }}
        >
          <div className="relative w-full h-full">
            <video
              // ИСПРАВЛЕНО: ref теперь ничего не возвращает
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              src={video.url}
              className="absolute inset-0 w-full h-full object-cover"
              loop
              muted={false}
              playsInline
              preload="metadata"
              poster={video.thumbnail}
            />
            {/* Оверлей с информацией */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
              <p className="text-white font-medium text-lg drop-shadow-md">
                {video.author}
              </p>
              <p className="text-white/80 text-sm drop-shadow-md">{video.description}</p>
            </div>
            {/* Индикатор для пользователя Telegram */}
            {user && (
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 pointer-events-none">
                <p className="text-white text-xs">👤 {user.first_name}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}