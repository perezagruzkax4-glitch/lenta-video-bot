import VideoFeed from '@/components/VideoFeed';
import { VideoData } from './api/videos/route';

async function getVideos(): Promise<VideoData[]> {
  // 1. Определяем базовый URL
  const vercelUrl = process.env.VERCEL_URL;
  
  // Если мы на Vercel -> добавляем https://, иначе localhost
  const baseUrl = vercelUrl 
    ? `https://${vercelUrl}` 
    : 'http://localhost:3000';

  // 2. Делаем запрос с полным URL
  const res = await fetch(`${baseUrl}/api/videos`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch videos');
  return res.json();
}

export default async function Home() {
  const videos = await getVideos();

  return <VideoFeed videos={videos} />;
}