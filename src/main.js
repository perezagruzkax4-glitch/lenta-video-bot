import './styles.css';
import { init } from '@tma.js/sdk';


const [miniApp] = init();

// Тестовые видео — позже заменим на API
const videoList = [
    { 
        id: 1, 
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.jpg',
        title: '🔥 Лучшее видео дня',
        author: '@LentaVideoBot'
    },
    { 
        id: 2, 
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.jpg',
        title: '🌟 Захватывающий момент',
        author: '@LentaVideoBot'
    },
    { 
        id: 3, 
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.jpg',
        title: '😂 Смех до слёз',
        author: '@LentaVideoBot'
    }
];

let currentVideoIndex = 0;
const mainVideo = document.getElementById('mainVideo');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

function loadVideo(index) {
    const video = videoList[index];
    mainVideo.src = video.src;
    mainVideo.poster = video.poster;
    mainVideo.setAttribute('title', video.title);
    mainVideo.load();
    mainVideo.play().then(() => {
        playPauseBtn.textContent = '⏸️';
    }).catch(e => console.log("Автовоспроизведение заблокировано:", e));
    
    // Отправляем событие в Telegram о просмотре видео (для аналитики)
    if (miniApp.isVersionAtLeast('6.1')) {
        miniApp.sendData(JSON.stringify({
            action: 'view',
            video_id: video.id,
            title: video.title
        }));
    }
}

function togglePlayPause() {
    if (mainVideo.paused) {
        mainVideo.play();
        playPauseBtn.textContent = '⏸️';
    } else {
        mainVideo.pause();
        playPauseBtn.textContent = '▶️';
    }
}

function nextVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % videoList.length;
    loadVideo(currentVideoIndex);
}

function prevVideo() {
    currentVideoIndex = (currentVideoIndex - 1 + videoList.length) % videoList.length;
    loadVideo(currentVideoIndex);
}

// Кнопки
playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', prevVideo);
nextBtn.addEventListener('click', nextVideo);

// Клик по видео = пауза/плей
mainVideo.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlayPause();
});

// Клавиатура для отладки
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
    } else if (e.code === 'ArrowRight') {
        nextVideo();
    } else if (e.code === 'ArrowLeft') {
        prevVideo();
    } else if (e.code === 'KeyF') {
        toggleFullscreen();
    }
});

// Полный экран через Telegram API
function toggleFullscreen() {
    if (miniApp.isFullscreen()) {
        miniApp.exitFullscreen();
    } else {
        miniApp.requestFullscreen();
    }
}

fullscreenBtn.addEventListener('click', toggleFullscreen);

// Жесты свайпа
let touchStartX = 0;
let touchStartY = 0;
const SWIPE_THRESHOLD = 50;

mainVideo.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, {passive: true});

mainVideo.addEventListener('touchend', (e) => {
    if (!touchStartX || !touchStartY) return;
    
    const diffX = e.changedTouches[0].screenX - touchStartX;
    const diffY = e.changedTouches[0].screenY - touchStartY;
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > SWIPE_THRESHOLD) {
            if (diffX > 0) {
                prevVideo();
            } else {
                nextVideo();
            }
        }
    }
    
    touchStartX = 0;
    touchStartY = 0;
});

// Инициализация приложения
async function initApp() {
    try {
        await miniApp.ready();
        miniApp.setHeaderColor('bg_color');
        miniApp.setBackgroundColor('bg_color');
        console.log('LentaVideo Mini App готово');
        loadVideo(currentVideoIndex);
    } catch (error) {
        console.error('Ошибка инициализации:', error);
    }
}

window.addEventListener('load', initApp);