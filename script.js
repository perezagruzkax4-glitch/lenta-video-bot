// Подключаем Telegram Web App API
const tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем на весь экран

// Наши видео (пока для примера)
const videos = [
    {
        id: 1,
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        likes: 120,
        views: 1540
    },
    {
        id: 2,
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        likes: 85,
        views: 920
    },
    {
        id: 3,
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        likes: 230,
        views: 2800
    }
];

let currentIndex = 0;
const player = document.getElementById('video-player');
const likeBtn = document.getElementById('like-btn');
const likeCountSpan = document.getElementById('like-count');
const viewCountSpan = document.getElementById('view-count');
const nextBtn = document.getElementById('next-btn');

// Функция для загрузки видео
function loadVideo(index) {
    const video = videos[index];
    player.src = video.url;
    player.load();
    player.play();

    // Обновляем счётчики
    likeCountSpan.textContent = video.likes;
    viewCountSpan.textContent = video.views;

    // Увеличиваем счётчик просмотров
    video.views++;
    viewCountSpan.textContent = video.views;
}

// Обработчик кнопки "Нравится"
likeBtn.addEventListener('click', () => {
    const currentVideo = videos[currentIndex];
    currentVideo.likes++;
    likeCountSpan.textContent = currentVideo.likes;
    
    // Отправляем данные в бота
    tg.sendData(JSON.stringify({
        action: 'like',
        videoId: currentVideo.id,
        likes: currentVideo.likes
    }));
});

// Обработчик кнопки "Следующее"
nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % videos.length;
    loadVideo(currentIndex);
});

// Загружаем первое видео при старте
loadVideo(currentIndex);

// Сообщаем боту, что приложение готово
tg.ready();