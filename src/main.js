import './styles.css';
import { init } from '@tma.js/sdk';

const [miniApp] = init();

// --- Тестовые видео (позже заменим на API) ---
const videoList = [
    { 
        id: 1, 
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.jpg',
        title: '🔥 Лучшее видео дня',
        author: '@LentaVideoBot',
        likes: 1240,
        comments: 45
    },
    { 
        id: 2, 
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.jpg',
        title: '🌟 Захватывающий момент',
        author: '@LentaVideoBot',
        likes: 890,
        comments: 23
    },
    { 
        id: 3, 
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.jpg',
        title: '😂 Смех до слёз',
        author: '@LentaVideoBot',
        likes: 2100,
        comments: 112
    }
];

// --- DOM элементы ---
const feedContainer = document.getElementById('videoFeed');
const likeBtn = document.querySelector('.like-btn');
const commentBtn = document.querySelector('.comment-btn');
const navBtns = document.querySelectorAll('.nav-btn');
const pages = {
    feed: document.getElementById('feed-tab'),
    upload: document.getElementById('upload-tab'),
    profile: document.getElementById('profile-tab')
};

// --- Переключение вкладок ---
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        // Меняем активный класс кнопок
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Показываем нужную страницу
        Object.values(pages).forEach(page => page.classList.remove('active'));
        pages[tabName].classList.add('active');
        
        // Если открыта лента — инициализируем видео
        if (tabName === 'feed') {
            initVideoFeed();
        }
    });
});

// --- Лента видео ---
function initVideoFeed() {
    feedContainer.innerHTML = '';
    videoList.forEach((video, index) => {
        const slide = document.createElement('div');
        slide.className = 'video-slide';
        slide.innerHTML = `
            <video 
                src="${video.src}" 
                poster="${video.poster}"
                loop 
                muted 
                playsinline 
                webkit-playsinline
                data-index="${index}"
            ></video>
        `;
        feedContainer.appendChild(slide);
    });

    // Автовоспроизведение первого видимого видео
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video');
            if (entry.isIntersecting) {
                video.play().catch(e => console.log('Autoplay blocked:', e));
                // Обновляем лайки/комменты для активного видео
                const idx = video.dataset.index;
                updateActionButtons(videoList[idx]);
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.6 });

    document.querySelectorAll('.video-slide').forEach(slide => observer.observe(slide));
    
    // Клик по видео = пауза/воспроизведение
    feedContainer.addEventListener('click', (e) => {
        const video = e.target.closest('video');
        if (!video) return;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
}

function updateActionButtons(videoData) {
    likeBtn.textContent = `❤️ ${videoData.likes || 0}`;
    commentBtn.textContent = `💬 ${videoData.comments || 0}`;
}

// --- Загрузка видео (демо) ---
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const statusDiv = document.getElementById('uploadStatus');
    statusDiv.textContent = 'Загрузка...';
    
    // Здесь должен быть реальный запрос на сервер
    setTimeout(() => {
        statusDiv.textContent = '✅ Видео загружено (демо)';
        // Очищаем форму
        e.target.reset();
        // Переключаем на главную через 1 сек
        setTimeout(() => {
            document.querySelector('[data-tab="feed"]').click();
        }, 1000);
    }, 1500);
});

// --- Профиль (демо) ---
async function loadProfile() {
    const user = await miniApp.getUser();
    document.getElementById('userName').textContent = user.username || `User ${user.id}`;
    if (user.photoUrl) {
        document.getElementById('userAvatar').src = user.photoUrl;
    }
    // Пока заглушки для статистики
    document.getElementById('videoCount').textContent = videoList.length;
    document.getElementById('likesCount').textContent = videoList.reduce((sum, v) => sum + (v.likes || 0), 0);
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    miniApp.close();
});

// --- Инициализация приложения ---
async function initApp() {
    try {
        await miniApp.ready();
        miniApp.setHeaderColor('bg_color');
        miniApp.setBackgroundColor('bg_color');
        console.log('LentaVideo готово');
        
        initVideoFeed();
        loadProfile();
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

window.addEventListener('load', initApp);