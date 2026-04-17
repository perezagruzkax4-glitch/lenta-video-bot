import React, { useRef, useEffect, useState } from 'react';
import Sidebar from './Sidebar';

const VideoItem = ({ data }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer для автовоспроизведения
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          videoRef.current.play().catch(() => {
            // Автоплей может быть заблокирован браузером без взаимодействия
            console.log('Autoplay prevented');
          });
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 } // Видео считается активным, если видно 60%
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="h-screen w-full snap-start relative flex items-center justify-center bg-gray-900">
      {/* Видео плеер */}
      <video
        ref={videoRef}
        src={data.url}
        className="h-full w-full object-cover"
        loop
        playsInline
        muted={false} // Важно: звук включен по умолчанию для эффекта TikTok
        onClick={togglePlay}
      />

      {/* Оверлей градиента для читаемости текста */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* Информация о видео (слева внизу) */}
      <div className="absolute bottom-20 left-4 z-10 max-w-[70%]">
        <h3 className="font-bold text-white text-lg mb-1">{data.username}</h3>
        <p className="text-white text-sm opacity-90 line-clamp-2">{data.description}</p>
        <div className="flex items-center mt-2 text-xs text-white/80">
          <span className="mr-2">🎵 Оригинальный звук</span>
        </div>
      </div>

      {/* Боковая панель действий (справа) */}
      <Sidebar data={data} />

      {/* Индикатор паузы (если видео на паузе) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 rounded-full p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoItem;