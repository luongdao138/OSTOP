function syncHeight() {
  document.documentElement.style.setProperty(
    '--window-inner-height',
    `${window.innerHeight}px`
  );
}

syncHeight();

window.addEventListener('resize', syncHeight);

const modalOverlay = document.querySelector('.modal__overlay');
const modalWrapper = document.querySelector('.modal__wrapper');

const btnModal = document.querySelector('.searching-box__btn');
const closeModalBtn = document.querySelector('.modal__close-btn');

function openModal() {
  modalOverlay.classList.add('show');
  modalWrapper.classList.add('slide-in');

  document.documentElement.classList.add('is-locked');
}

function closeModal() {
  modalOverlay.classList.remove('show');
  modalWrapper.classList.remove('slide-in');

  document.documentElement.classList.remove('is-locked');
}

btnModal.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

document
  .querySelector('.modal__content')
  .style.setProperty('--window-inner-height', `${window.innerHeight}px`);
