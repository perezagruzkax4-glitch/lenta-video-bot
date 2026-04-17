import WebApp from '@twa-dev/sdk';

export const initTelegram = () => {
  if (typeof window !== 'undefined') {
    WebApp.ready();
    WebApp.expand(); // развернуть на весь экран
    WebApp.enableClosingConfirmation(); // подтверждение при закрытии
    WebApp.setHeaderColor('secondary_bg_color'); // адаптация под тему
  }
};

export const getTelegramUser = () => {
  return WebApp.initDataUnsafe?.user || null;
};

export const closeApp = () => {
  WebApp.close();
};