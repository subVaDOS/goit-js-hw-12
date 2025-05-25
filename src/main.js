// Імпортуємо бібліотеку повідомлень iziToast та її стилі
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Імпортуємо функцію запиту до Pixabay API
import { getImagesByQuery } from './js/pixabay-api';

// Імпортуємо утиліти для створення галереї, керування loader'ом та кнопками
import {
  createGallery,
  showLoader,
  hideLoader,
  clearGallery,
  showLoadMoreBtn,
  hideLoadMoreBtn,
} from './js/render-functions';

// Отримуємо посилання на DOM-елементи
const form = document.querySelector('.form'); // Форма пошуку
const input = document.querySelector('[name="search-text"]'); // Поле введення
const galleryElem = document.querySelector('.gallery'); // Галерея зображень
const loaderElem = document.querySelector('.loader'); // Анімація завантаження
const fetchPostsBtn = document.querySelector('.js-load-more'); // Кнопка "Завантажити ще"
const showErrorMessage = document.querySelector('.js-error-message'); // Повідомлення про помилку
const showLoadingMessage = document.querySelector('.js-loading-message'); // Повідомлення про завантаження

// Ініціалізуємо змінні для зберігання поточної сторінки, запиту та кількості результатів
let page = 1;
let searchQuery = '';
let totalHits = 0;

// Додаємо слухачі подій: надсилання форми і натискання кнопки "Завантажити ще"
form.addEventListener('submit', onSubmitForm);
fetchPostsBtn.addEventListener('click', onLoadMore);

// Функція для завантаження додаткових результатів
function onLoadMore(event) {
  event.preventDefault(); // Забороняємо стандартну поведінку кнопки
  page += 1; // Збільшуємо номер сторінки

  hideLoadMoreBtn(fetchPostsBtn); // Ховаємо кнопку "Завантажити ще"
  showLoadingMessage.classList.remove('is-hidden'); // Показуємо повідомлення "Завантаження..."

  // Отримуємо зображення за поточним запитом і сторінкою
  getImagesByQuery(searchQuery, page)
    .then(data => {
      const images = data.hits;

      // Якщо нових зображень немає — виводимо повідомлення і припиняємо
      if (images.length === 0) {
        iziToast.error({
          title: 'Caution',
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
          timeout: 3000,
        });
        showErrorMessage.classList.remove('is-hidden');
        return;
      }

      // Додаємо зображення до галереї
      createGallery(images, galleryElem);

      // Обчислюємо загальну кількість сторінок
      const totalPages = Math.ceil(totalHits / 15);

      // Якщо ще є сторінки — показуємо кнопку "Завантажити ще"
      if (page < totalPages) {
        showLoadMoreBtn(fetchPostsBtn);
      } else {
        // Інакше повідомляємо користувача, що це кінець результатів
        iziToast.info({
          title: 'Info',
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
          timeout: 3000,
        });
      }

      // Прокрутка сторінки до нових зображень
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    })
    .catch(error => {
      // Обробка помилки запиту
      iziToast.error({
        title: 'Error',
        message: 'Failed to load more images. Please try again.',
        position: 'topRight',
        timeout: 3000,
      });
      showErrorMessage.classList.remove('is-hidden');
    })
    .finally(() => {
      // Приховуємо повідомлення "Завантаження..." у будь-якому випадку
      showLoadingMessage.classList.add('is-hidden');
    });
}

// Обробник події надсилання форми
function onSubmitForm(event) {
  event.preventDefault(); // Забороняємо перезавантаження сторінки
  searchQuery = input.value.trim(); // Отримуємо текст запиту
  page = 1; // Скидаємо сторінку на 1
  totalHits = 0; // Скидаємо кількість результатів

  clearGallery(galleryElem); // Очищуємо галерею
  hideLoadMoreBtn(fetchPostsBtn); // Ховаємо кнопку "Завантажити ще"
  showErrorMessage.classList.add('is-hidden'); // Приховуємо повідомлення про помилку
  showLoader(loaderElem); // Показуємо loader

  // Якщо запит порожній — показуємо повідомлення і припиняємо
  if (!searchQuery) {
    hideLoader(loaderElem);
    return iziToast.error({
      title: 'Caution',
      message: 'Please enter a search query.',
      position: 'topRight',
      timeout: 3000,
    });
  }

  // Отримуємо зображення з Pixabay API
  getImagesByQuery(searchQuery, page)
    .then(data => {
      const images = data.hits; // Масив зображень
      totalHits = data.totalHits; // Загальна кількість знайдених зображень

      // Якщо нічого не знайдено — виводимо повідомлення
      if (images.length === 0) {
        iziToast.error({
          title: 'Caution',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
          timeout: 3000,
        });
        showErrorMessage.classList.remove('is-hidden');
        return;
      }

      // Створюємо галерею з отриманих зображень
      createGallery(images, galleryElem);

      // Якщо результатів більше 15 — показуємо кнопку "Завантажити ще"
      if (totalHits > 15) {
        showLoadMoreBtn(fetchPostsBtn);
      }
    })
    .catch(error => {
      // Обробка помилки при запиті
      iziToast.error({
        title: 'Error',
        message: 'Something went wrong. Please try again later.',
        position: 'topRight',
        timeout: 3000,
      });
    })
    .finally(() => {
      hideLoader(loaderElem); // Приховуємо loader
      form.reset(); // Очищаємо поле введення
    });
}
