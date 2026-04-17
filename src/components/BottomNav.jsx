import React from 'react';
import { Home, Search, PlusSquare, MessageSquare, User } from 'lucide-react';

const BottomNav = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-black/90 border-t border-gray-800 flex justify-around items-center z-30 pb-2">
      <div className="flex flex-col items-center text-white">
        <Home className="w-6 h-6" fill="white" />
        <span className="text-[10px] mt-1">Главная</span>
      </div>
      
      <div className="flex flex-col items-center text-gray-400">
        <Search className="w-6 h-6" />
        <span className="text-[10px] mt-1">Интересное</span>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-10 h-7 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-lg flex items-center justify-center">
          <PlusSquare className="w-5 h-5 text-black" fill="black" />
        </div>
      </div>

      <div className="flex flex-col items-center text-gray-400">
        <MessageSquare className="w-6 h-6" />
        <span className="text-[10px] mt-1">Входящие</span>
      </div>

      <div className="flex flex-col items-center text-gray-400">
        <User className="w-6 h-6" />
        <span className="text-[10px] mt-1">Профиль</span>
      </div>
    </div>
  );
};

export default BottomNav;