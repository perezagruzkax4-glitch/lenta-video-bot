import { NextResponse } from 'next/server';

export interface VideoData {
  id: string;
  url: string;
  thumbnail?: string;
  author: string;
  description: string;
}

const videos: VideoData[] = [
  {
    id: '1',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    author: '@traveler',
    description: 'Закат на побережье 🌅',
  },
  {
    id: '2',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
    author: '@adventurer',
    description: 'Горы зовут 🏔️',
  },
  {
    id: '3',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
    author: '@funnycat',
    description: 'Котики делают зарядку 😹',
  },
];

export async function GET() {
  return NextResponse.json(videos);
}