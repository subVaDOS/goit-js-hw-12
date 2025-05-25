// Імпортуємо бібліотеку axios для виконання HTTP-запитів
import axios from 'axios';

// Базова URL-адреса для запитів до API Pixabay
const BASE_URL = 'https://pixabay.com/api/';

// Унікальний ключ доступу до API (отримується після реєстрації на Pixabay)
const API_KEY = '50348782-72c1d2cf6f33e6e33f09bb691';

// Встановлюємо базову адресу для всіх запитів axios
axios.defaults.baseURL = BASE_URL;

// Встановлюємо стандартні параметри запиту, які будуть використовуватись автоматично:
axios.defaults.params = {
  key: API_KEY, // Ключ доступу до API
  image_type: 'photo', // Тип зображень (тільки фотографії)
  orientation: 'horizontal', // Орієнтація зображення (горизонтальна)
  safesearch: true, // Включення безпечного пошуку (виключає 18+ контент)
  per_page: 15, // Кількість зображень на одну сторінку
};

/**
 * Асинхронна функція для отримання зображень за пошуковим запитом
 * @param {string} query - Пошукове слово або фраза
 * @param {number} page - Номер сторінки (для пагінації)
 * @returns {Promise<Object>} - Повертає об'єкт з даними (масив hits + totalHits)
 */
export async function getImagesByQuery(query, page) {
  const response = await axios.get('', {
    params: {
      q: query, // Пошуковий запит
      page: page, // Поточна сторінка
    },
  });

  return response.data;
}
