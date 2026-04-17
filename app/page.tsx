// app/page.tsx
import VideoFeed from '@/components/VideoFeed';
// ✅ Импортируем функцию напрямую, без HTTP-запроса
import { getVideosData } from './api/videos/route';

export default async function Home() {
  // ✅ Получаем данные напрямую — быстро и без ошибок сети
  const videos = getVideosData();

  return <VideoFeed videos={videos} />;
}