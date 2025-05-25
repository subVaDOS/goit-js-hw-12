// Імпортуємо бібліотеку SimpleLightbox для перегляду зображень у модальному вікні
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Ініціалізуємо SimpleLightbox на всіх посиланнях у галереї
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt', // Використовуємо значення атрибуту alt для підпису зображення
  captionDelay: 200, // Затримка перед показом підпису в мілісекундах
});

/**
 * Функція створює та додає HTML-розмітку для зображень у галерею
 * @param {Array} images - масив об'єктів зображень
 * @param {HTMLElement} galleryElem - DOM-елемент галереї, куди вставляється розмітка
 */
export function createGallery(images, galleryElem) {
  // Генеруємо HTML для кожного зображення
  const markup = images
    .map(
      ({
        webformatURL, // URL мініатюри
        largeImageURL, // URL великого зображення
        type, // тип зображення (наприклад, фото)
        tags, // ключові слова (використовуються в alt)
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<li class="gallery-item js-gallery-item">
  <a class="gallery-link js-gallery-link" href="${largeImageURL}">
    <div class="image-wrapper">
      <img
        class="gallery-image js-gallery-image"
        src="${webformatURL}"
        data-source="${type}"
        alt="${tags}"
      />
    </div>
  
  <div>
    <ul class="wrapper-box">
      <li class="list-item">
        <p class="value-title">Likes</p>
        <p class="label" data-likes>${likes}</p>
      </li>
      <li class="list-item">
        <p class="value-title">Views</p>
        <p class="label" data-views>${views}</p>
      </li>
      <li class="list-item">
        <p class="value-title">Comments</p>
        <p class="label" data-comments>${comments}</p>
      </li>
      <li class="list-item">
        <p class="value-title">Downloads</p>
        <p class="label" data-downloads>${downloads}</p>
      </li>
    </ul>
  </div>
  </a>
</li>`
    )
    .join(''); // Об’єднуємо всі рядки в єдиний HTML-код

  // Додаємо готову розмітку в кінець елемента галереї
  galleryElem.insertAdjacentHTML('beforeend', markup);

  // Оновлюємо інстанс SimpleLightbox, щоб він працював із новими елементами
  lightbox.refresh();
}

/**
 * Очищає вміст галереї
 * @param {HTMLElement} galleryElem - DOM-елемент галереї
 */
export function clearGallery(galleryElem) {
  galleryElem.innerHTML = ''; // Повністю видаляє розмітку всередині галереї
}

/**
 * Показує елемент завантаження (loader)
 * @param {HTMLElement} loaderElem - DOM-елемент лоудера
 */
export function showLoader(loaderElem) {
  loaderElem.classList.remove('is-hidden'); // Видаляє клас, що приховує лоудер
}

/**
 * Приховує елемент завантаження (loader)
 * @param {HTMLElement} loaderElem - DOM-елемент лоудера
 */
export function hideLoader(loaderElem) {
  loaderElem.classList.add('is-hidden'); // Додає клас, що приховує лоудер
}

/**
 * Показує кнопку "Завантажити ще"
 * @param {HTMLElement} fetchPostsBtn - DOM-елемент кнопки
 */
export function showLoadMoreBtn(fetchPostsBtn) {
  fetchPostsBtn.classList.remove('is-hidden'); // Робить кнопку видимою
}

/**
 * Приховує кнопку "Завантажити ще"
 * @param {HTMLElement} fetchPostsBtn - DOM-елемент кнопки
 */
export function hideLoadMoreBtn(fetchPostsBtn) {
  fetchPostsBtn.classList.add('is-hidden'); // Приховує кнопку
}
