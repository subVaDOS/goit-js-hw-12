// Імпортуємо бібліотеку iziToast для повідомлень
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Імпортуємо функцію запиту до Pixabay API
import { getImagesByQuery } from './js/pixabay-api';

// Імпортуємо утиліти для галереї, лоадера і кнопок
import {
  createGallery,
  showLoader,
  hideLoader,
  clearGallery,
  showLoadMoreBtn,
  hideLoadMoreBtn,
} from './js/render-functions';

// DOM-посилання
const form = document.querySelector('.form');
const input = document.querySelector('[name="search-text"]');
const galleryElem = document.querySelector('.gallery');
const loaderElem = document.querySelector('.loader');
const fetchPostsBtn = document.querySelector('.js-load-more');
const showErrorMessage = document.querySelector('.js-error-message');
const showLoadingMessage = document.querySelector('.js-loading-message');

// Стан
let page = 1;
let searchQuery = '';
let totalHits = 0;

// Слухачі подій
form.addEventListener('submit', onSubmitForm);
fetchPostsBtn.addEventListener('click', onLoadMore);

// Обробник події надсилання форми
async function onSubmitForm(event) {
  event.preventDefault();

  searchQuery = input.value.trim();
  page = 1;
  totalHits = 0;

  clearGallery(galleryElem);
  hideLoadMoreBtn(fetchPostsBtn);
  showErrorMessage.classList.add('is-hidden');
  showLoader(loaderElem);

  if (!searchQuery) {
    hideLoader(loaderElem);
    return iziToast.error({
      title: 'Caution',
      message: 'Please enter a search query.',
      position: 'topRight',
      timeout: 3000,
    });
  }

  try {
    const data = await getImagesByQuery(searchQuery, page);
    const images = data.hits;
    totalHits = data.totalHits;

    if (images.length === 0) {
      showErrorMessage.classList.remove('is-hidden');
      return iziToast.error({
        title: 'Caution',
        message: 'Sorry, no images match your search query. Try again!',
        position: 'topRight',
        timeout: 3000,
      });
    }

    createGallery(images, galleryElem);

    if (totalHits > 15) {
      showLoadMoreBtn(fetchPostsBtn);
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
      timeout: 3000,
    });
  } finally {
    hideLoader(loaderElem);
    form.reset();
  }
}

// Обробник кнопки "Завантажити ще"
async function onLoadMore(event) {
  event.preventDefault();
  page += 1;

  hideLoadMoreBtn(fetchPostsBtn);
  showLoadingMessage.classList.remove('is-hidden');

  try {
    const data = await getImagesByQuery(searchQuery, page);
    const images = data.hits;

    if (images.length === 0) {
      showErrorMessage.classList.remove('is-hidden');
      return iziToast.error({
        title: 'Caution',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        timeout: 3000,
      });
    }

    createGallery(images, galleryElem);

    const totalPages = Math.ceil(totalHits / 15);
    if (page < totalPages) {
      showLoadMoreBtn(fetchPostsBtn);
    } else {
      iziToast.info({
        title: 'Info',
        message: "You've reached the end of search results.",
        position: 'topRight',
        timeout: 3000,
      });
    }

    // Прокручуємо до нових зображень
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more images. Please try again.',
      position: 'topRight',
      timeout: 3000,
    });
    showErrorMessage.classList.remove('is-hidden');
  } finally {
    showLoadingMessage.classList.add('is-hidden');
  }
}
