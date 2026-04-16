// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // раскрываем на весь экран

// Наши переменные
const videoElement = document.getElementById('current-video');
const loader = document.getElementById('loader');
const captionEl = document.getElementById('caption');
const progressBar = document.getElementById('progress-bar');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// ---------- БАЗА ВИДЕО (здесь будут твои видео) ----------
// Для теста используем бесплатные короткие ролики с тестового сервера
// Замени эти ссылки на свои!
const videoList = [
    {
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        caption: 'Красивое небо ✨'
    },
    {
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        caption: 'Океан и волны 🌊'
    },
    {
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        caption: 'Горы и закат 🏔️'
    },
    {
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        caption: 'Лава и вулкан 🔥'
    }
];

let currentIndex = 0; // текущий индекс видео

// ---------- ФУНКЦИИ ----------

// Загружаем видео по индексу
function loadVideo(index) {
    // Если индекс выходит за границы — циклим
    if (index < 0) index = videoList.length - 1;
    if (index >= videoList.length) index = 0;
    currentIndex = index;

    const videoData = videoList[currentIndex];
    
    // Показываем загрузчик
    loader.style.display = 'block';
    
    // Меняем источник видео
    videoElement.src = videoData.url;
    videoElement.load();
    
    // Обновляем подпись
    captionEl.textContent = videoData.caption;
    
    // Когда видео готово к воспроизведению
    videoElement.oncanplay = () => {
        loader.style.display = 'none';
        videoElement.play().catch(e => {
            // На мобильных автовоспроизведение может блокироваться, 
            // но muted + playsinline решает проблему
            console.log('Автовоспроизведение не удалось, ждём касания');
        });
    };
    
    // Обновляем прогресс-бар при воспроизведении
    videoElement.ontimeupdate = updateProgressBar;
}

// Обновление полоски прогресса
function updateProgressBar() {
    if (videoElement.duration) {
        const percent = (videoElement.currentTime / videoElement.duration) * 100;
        progressBar.style.width = percent + '%';
    }
}

// Следующее видео
function nextVideo() {
    loadVideo(currentIndex + 1);
}

// Предыдущее видео
function prevVideo() {
    loadVideo(currentIndex - 1);
}

// ---------- ОБРАБОТЧИКИ СОБЫТИЙ ----------

// 1. Свайпы (для мобильных)
let touchStartY = 0;
let touchEndY = 0;
const swipeThreshold = 50; // минимальное расстояние для свайпа

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const diff = touchStartY - touchEndY;
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Свайп вверх — следующее видео
            nextVideo();
        } else {
            // Свайп вниз — предыдущее
            prevVideo();
        }
    }
}

// 2. Прокрутка колесом мыши (для десктопа)
let wheelTimeout;
document.addEventListener('wheel', (e) => {
    e.preventDefault();
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
            nextVideo();
        } else {
            prevVideo();
        }
    }, 100); // небольшая задержка чтобы не листалось слишком быстро
}, { passive: false });

// 3. Кнопки (для наглядности)
prevBtn.addEventListener('click', prevVideo);
nextBtn.addEventListener('click', nextVideo);

// 4. Когда видео заканчивается — автоматически переходим к следующему
videoElement.addEventListener('ended', nextVideo);

// 5. Обработка ошибок загрузки видео
videoElement.addEventListener('error', () => {
    loader.style.display = 'none';
    alert('Ошибка загрузки видео. Попробуем следующее.');
    // Переходим к следующему, если текущее не загрузилось
    setTimeout(nextVideo, 500);
});

// ---------- СТАРТ ----------
// Загружаем первое видео
loadVideo(0);

// Сообщаем Telegram, что приложение готово
tg.ready();