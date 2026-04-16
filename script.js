// ========================
// LentaVideo Mini App
// Полноэкранный TikTok‑клон в Telegram
// ========================

const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// DOM элементы
const feed = document.getElementById('videoFeed');
const modal = document.getElementById('uploadModal');
const closeModalBtn = document.getElementById('closeModal');
const uploadBtn = document.getElementById('uploadBtn');
const videoFileInput = document.getElementById('videoFile');
const videoTitleInput = document.getElementById('videoTitle');

// Состояние
let videos = [];
let currentPlayingVideo = null;
let isLoading = false;

// Стартовые видео (тестовые)
const initialVideos = [
    {
        id: 1,
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        author: '@funny_cats',
        description: 'Когда нашёл вкусняшку 😋 #кот',
        likes: 342,
        comments: 28,
        views: 1540
    },
    {
        id: 2,
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        author: '@traveler',
        description: 'Побег из офиса в пятницу 🏃‍♂️',
        likes: 892,
        comments: 45,
        views: 2100
    },
    {
        id: 3,
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        author: '@music_lover',
        description: 'Новый трек залетит? 🎵',
        likes: 1204,
        comments: 102,
        views: 5600
    }
];

// ========================
// Создание DOM‑элемента для одного видео
// ========================
function createVideoElement(videoData) {
    const item = document.createElement('div');
    item.className = 'video-item';
    item.dataset.videoId = videoData.id;

    // Видео
    const video = document.createElement('video');
    video.src = videoData.url;
    video.loop = true;
    video.muted = false;
    video.playsInline = true;
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('preload', 'metadata');

    // Оверлей с текстом
    const overlay = document.createElement('div');
    overlay.className = 'video-overlay';
    overlay.innerHTML = `
        <div class="video-author">
            ${videoData.author}
            <span style="font-size:11px; background:#ff0050; padding:2px 10px; border-radius:20px; cursor:pointer;" onclick="tg.showPopup({title:'Подписка', message:'Вы подписались на ${videoData.author}'})">Подписаться</span>
        </div>
        <div class="video-description">${videoData.description}</div>
    `;

    // Панель действий
    const actions = document.createElement('div');
    actions.className = 'video-actions';
    actions.innerHTML = `
        <div class="action-icon" data-action="like" data-id="${videoData.id}">
            <span>❤️</span>
            <small>${videoData.likes}</small>
        </div>
        <div class="action-icon" data-action="comment">
            <span>💬</span>
            <small>${videoData.comments}</small>
        </div>
        <div class="action-icon" data-action="share">
            <span>↗️</span>
            <small>Поделиться</small>
        </div>
    `;

    item.appendChild(video);
    item.appendChild(overlay);
    item.appendChild(actions);

    // Увеличиваем просмотры
    videoData.views++;
    return item;
}

// ========================
// Рендер всей ленты
// ========================
function renderFeed() {
    feed.innerHTML = '';
    videos.forEach(v => feed.appendChild(createVideoElement(v)));
    setupIntersectionObserver();
}

// ========================
// Автовоспроизведение видимого видео
// ========================
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video');
            if (!video) return;

            if (entry.isIntersecting) {
                if (currentPlayingVideo && currentPlayingVideo !== video) {
                    currentPlayingVideo.pause();
                }
                video.play().catch(e => console.log('Автовоспроизведение заблокировано'));
                currentPlayingVideo = video;
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.6 });

    document.querySelectorAll('.video-item').forEach(item => observer.observe(item));
}

// ========================
// Обработка кликов (лайк, комментарий, поделиться)
// ========================
feed.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const videoItem = btn.closest('.video-item');
    const videoId = videoItem?.dataset.videoId;
    const video = videos.find(v => v.id == videoId);
    if (!video) return;

    if (action === 'like') {
        video.likes++;
        btn.querySelector('small').textContent = video.likes;

        // Отправляем лайк боту
        tg.sendData(JSON.stringify({
            action: 'like',
            videoId: video.id,
            likes: video.likes
        }));

        btn.style.transform = 'scale(1.2)';
        setTimeout(() => btn.style.transform = '', 150);
    } else if (action === 'comment') {
        tg.showPopup({
            title: '💬 Комментарии',
            message: `Комментарии к видео от ${video.author} появятся позже.`
        });
    } else if (action === 'share') {
        tg.showPopup({
            title: '📤 Поделиться',
            message: 'Ссылка на видео скопирована (эмуляция).'
        });
    }
});

// ========================
// Бесконечная подгрузка (при скролле к концу)
// ========================
feed.addEventListener('scroll', () => {
    const bottom = feed.scrollHeight - feed.scrollTop - feed.clientHeight;
    if (bottom < 300 && !isLoading) {
        loadMoreVideos();
    }
});

async function loadMoreVideos() {
    isLoading = true;
    console.log('Загружаем ещё видео...');

    // Эмуляция задержки сети
    await new Promise(r => setTimeout(r, 800));

    const newVideos = [
        {
            id: Date.now() + 1,
            url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            author: '@adrenaline',
            description: 'Когда адреналин зашкаливает 🏎️',
            likes: 540,
            comments: 33,
            views: 1200
        },
        {
            id: Date.now() + 2,
            url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            author: '@failarmy',
            description: 'Ожидание vs Реальность 😂',
            likes: 2100,
            comments: 189,
            views: 8900
        }
    ];

    videos.push(...newVideos);
    newVideos.forEach(v => feed.appendChild(createVideoElement(v)));
    setupIntersectionObserver();
    isLoading = false;
}

// ========================
// Нижняя навигация
// ========================
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const page = item.dataset.page;

        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        if (page === 'feed') {
            modal.style.display = 'none';
        } else if (page === 'upload') {
            modal.style.display = 'flex';
        } else if (page === 'profile') {
            tg.showPopup({
                title: '👤 Профиль',
                message: 'Твой профиль в разработке. Здесь будет статистика и твои видео.'
            });
        }
    });
});

// ========================
// Модальное окно загрузки
// ========================
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// Загрузка нового видео
uploadBtn.addEventListener('click', async () => {
    const file = videoFileInput.files[0];
    if (!file) {
        tg.showPopup({ message: 'Пожалуйста, выбери видеофайл' });
        return;
    }

    uploadBtn.textContent = 'Загрузка...';
    uploadBtn.disabled = true;

    // === ЗАГЛУШКА: замени на реальную загрузку в облако (Firebase / AWS S3) ===
    // Здесь используем временный URL (работает только в этой сессии)
    const localUrl = URL.createObjectURL(file);

    const newVideo = {
        id: Date.now(),
        url: localUrl,
        author: '@' + (tg.initDataUnsafe?.user?.username || 'you'),
        description: videoTitleInput.value.trim() || 'Новое видео',
        likes: 0,
        comments: 0,
        views: 0
    };

    videos.unshift(newVideo);
    feed.prepend(createVideoElement(newVideo));
    setupIntersectionObserver();

    // Сброс и закрытие
    modal.style.display = 'none';
    videoFileInput.value = '';
    videoTitleInput.value = '';
    uploadBtn.textContent = 'Опубликовать';
    uploadBtn.disabled = false;

    document.querySelector('.nav-item[data-page="feed"]').click();
    tg.showPopup({ message: 'Видео добавлено в ленту!' });
});

// ========================
// Старт приложения
// ========================
videos = [...initialVideos];
renderFeed();