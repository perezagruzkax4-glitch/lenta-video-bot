const tg = window.Telegram.WebApp;
tg.expand();

const container = document.getElementById('video-container');

// ✅ Данные ВНУТРИ фронтенда (работает на GitHub Pages)
const videos = [
    {
        id: 1,
        url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
        author: '@ocean_lover',
        description: 'Красивые волны 🌊'
    },
    {
        id: 2,
        url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
        author: '@nature_fan',
        description: 'Весна пришла 🌸'
    },
    {
        id: 3,
        url: 'https://assets.mixkit.co/videos/preview/mixkit-white-cat-lying-among-the-leaves-1168-large.mp4',
        author: '@cat_master',
        description: 'Милый котик 🐱'
    }
];

function createVideoElement(data) {
    const card = document.createElement('div');
    card.className = 'video-card';

    const video = document.createElement('video');
    video.src = data.url;
    video.loop = true;
    video.playsInline = true;
    video.muted = true; // Начинаем без звука (требование браузеров)
    
    // Включение звука по первому клику
    video.addEventListener('click', () => {
        video.muted = false;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });

    // Обработка ошибок загрузки видео
    video.addEventListener('error', (e) => {
        console.error('Ошибка видео:', data.url, e);
        card.innerHTML = '<div style="color:white;padding:20px">❌ Не удалось загрузить видео</div>';
    });

    const info = document.createElement('div');
    info.className = 'video-info';
    info.innerHTML = `
        <div class="username">${data.author}</div>
        <div class="description">${data.description}</div>
    `;

    card.appendChild(video);
    card.appendChild(info);
    container.appendChild(card);
}

function playFirstVideo() {
    const firstVideo = document.querySelector('video');
    if (firstVideo) {
        firstVideo.play().catch(e => {
            console.log("Autoplay ожидает взаимодействия пользователя", e);
        });
    }
}

// Observer для авто-воспроизведения при скролле
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        if (!video) return;
        
        if (entry.isIntersecting) {
            video.currentTime = 0;
            video.play().catch(e => console.log("Play error", e));
        } else {
            video.pause();
        }
    });
}, { threshold: 0.6 });

// Загрузка и инициализация
function init() {
    videos.forEach(videoData => createVideoElement(videoData));
    
    // Небольшая задержка, чтобы элементы точно отрисовались
    setTimeout(() => {
        document.querySelectorAll('.video-card').forEach(card => {
            observer.observe(card);
        });
        playFirstVideo();
    }, 500);
}

// Ждём, когда Telegram WebApp будет готов
if (tg.initData) {
    init();
} else {
    // Для тестов в браузере без Telegram
    document.addEventListener('DOMContentLoaded', init);
}