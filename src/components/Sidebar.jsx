import React from 'react';
import { Heart, MessageCircle, Share2, Music2 } from 'lucide-react';
import WebApp from '@twa-dev/sdk';

const Sidebar = ({ data }) => {
  const handleLike = () => {
    // Здесь будет логика отправки лайка на бэкенд
    WebApp.HapticFeedback.impactOccurred('medium');
    alert(`Лайк поставлен! ${data.likes}`);
  };

  const handleShare = () => {
    WebApp.HapticFeedback.impactOccurred('light');
    // Используем нативный шеринг Telegram
    WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(data.description)}`);
  };

  return (
    <div className="absolute right-2 bottom-24 flex flex-col items-center gap-6 z-20">
      {/* Аватар */}
      <div className="relative mb-2">
        <img src={data.avatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-white" />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-pink-500 rounded-full p-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
        </div>
      </div>

      {/* Лайк */}
      <div className="flex flex-col items-center" onClick={handleLike}>
        <Heart className="w-8 h-8 text-white drop-shadow-md cursor-pointer hover:text-red-500 transition-colors" fill="rgba(255,255,255,0.2)" />
        <span className="text-xs font-semibold mt-1 drop-shadow-md">{data.likes}</span>
      </div>

      {/* Комментарии */}
      <div className="flex flex-col items-center">
        <MessageCircle className="w-8 h-8 text-white drop-shadow-md cursor-pointer" fill="rgba(255,255,255,0.2)" />
        <span className="text-xs font-semibold mt-1 drop-shadow-md">{data.comments}</span>
      </div>

      {/* Поделиться */}
      <div className="flex flex-col items-center" onClick={handleShare}>
        <Share2 className="w-8 h-8 text-white drop-shadow-md cursor-pointer" fill="rgba(255,255,255,0.2)" />
        <span className="text-xs font-semibold mt-1 drop-shadow-md">{data.shares}</span>
      </div>

      {/* Вращающаяся пластинка (музыка) */}
      <div className="mt-4 animate-spin-slow">
        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border-4 border-gray-700">
           <Music2 className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;