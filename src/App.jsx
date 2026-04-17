import React, { useEffect, useRef, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import VideoItem from './components/VideoItem';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';

// Моковые данные. В реальном проекте это будет запрос к API/Firebase
const MOCK_VIDEOS = [
  {
    id: '1',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    username: '@user1',
    description: 'Первое видео в LentaVideoBot! 🔥 #telegram #miniapp',
    likes: 1200,
    comments: 45,
    shares: 12,
    avatar: 'https://i.pravatar.cc/150?u=1',
  },
  {
    id: '2',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    username: '@creator_pro',
    description: 'Смотри какой крутой эффект 😎 #viral',
    likes: 8500,
    comments: 320,
    shares: 105,
    avatar: 'https://i.pravatar.cc/150?u=2',
  },
  {
    id: '3',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    username: '@tech_guy',
    description: 'Технологии будущего уже здесь 🚀',
    likes: 540,
    comments: 12,
    shares: 5,
    avatar: 'https://i.pravatar.cc/150?u=3',
  },
];

function App() {
  const [videos, setVideos] = useState(MOCK_VIDEOS);
  const containerRef = useRef(null);

  useEffect(() => {
    // Инициализация Telegram WebApp
    WebApp.ready();
    WebApp.expand(); // Разворачиваем на весь экран
    
    // Настраиваем цвета под тему Telegram
    document.body.style.backgroundColor = WebApp.themeParams.bg_color || '#000';
  }, []);

  return (
    <div className="h-screen w-full relative bg-black text-white">
      {/* Контейнер с вертикальным скроллом */}
      <div 
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {videos.map((video) => (
          <VideoItem key={video.id} data={video} />
        ))}
      </div>

      {/* Навигация снизу (как в TikTok) */}
      <BottomNav />
    </div>
  );
}

export default App;