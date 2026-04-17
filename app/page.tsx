import VideoFeed from '@/components/VideoFeed';
import { VideoData } from './api/videos/route';

async function getVideos(): Promise<VideoData[]> {
  // В реальном проекте можно запрашивать данные из API или напрямую импортировать
  const res = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/videos`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch videos');
  return res.json();
}

export default async function Home() {
  const videos = await getVideos();

  return <VideoFeed videos={videos} />;
}
