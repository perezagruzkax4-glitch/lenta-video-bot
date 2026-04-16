// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Раскрыть на весь экран

const container = document.getElementById('video-container');

// Функция загрузки видео с нашего сервера
async function loadVideos() {
    try {
        const response = await fetch('/api/videos');
        const videos = await response.json();
        
        videos.forEach(videoData => {
            createVideoElement(videoData);
        });
        
        // Запускаем первое видео
        playFirstVideo();
    } catch (error) {
        console.error('Ошибка загрузки видео:', error);
    }
}

function createVideoElement(data) {
    const card = document.createElement('div');
    card.className = 'video-card';

    const video = document.createElement('video');
    video.src = data.url;
    video.loop = true; // Зациклить видео
    video.playsInline = true; // Для iOS важно
    video.muted = false; // По умолчанию звук выключен браузерами, включим по клику
    
    // Обработчик клика для паузы/воспроизведения и включения звука
    video.addEventListener('click', () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
        // Браузеры разрешают включить звук только после взаимодействия пользователя
        video.muted = false; 
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
        // Пытаемся autoplay, но браузер может заблокировать звук
        firstVideo.play().catch(e => console.log("Autoplay blocked, waiting for interaction"));
    }
}

// Observer для автоматического воспроизведения следующего видео при скролле
// Это продвинутая часть, но она делает опыт как в TikTok
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        if (entry.isIntersecting) {
            // Видео появилось на экране -> играем
            video.currentTime = 0; // Начать сначала
            video.play().catch(e => console.log("Play error", e));
        } else {
            // Видео ушло с экрана -> пауза
            video.pause();
        }
    });
}, { threshold: 0.6 }); // Срабатывает, когда 60% видео видно

// Применяем observer ко всем видео после загрузки
// (В реальном проекте нужно вызывать это после добавления элементов)
setTimeout(() => {
    document.querySelectorAll('.video-card').forEach(card => {
        observer.observe(card);
    });
}, 1000);

loadVideos();