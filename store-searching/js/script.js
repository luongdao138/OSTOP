// window.addEventListener('DOMContentLoaded', () => {
//   function syncHeight() {
//     document.documentElement.style.setProperty(
//       '--window-inner-height',
//       `${window.innerHeight}px`
//     );
//     document
//       .querySelector('.modal__content')
//       ?.style.setProperty('--window-inner-height', `${window.innerHeight}px`);
//   }

//   syncHeight();

//   // Testing
//   // document.documentElement.classList.add('is-locked');

//   window.addEventListener('resize', syncHeight);

//   const modalOverlay = document.querySelector('.modal__overlay');
//   const modalWrapper = document.querySelector('.modal__wrapper');

//   const btnModal = document.querySelector('.searching-box__btn');
//   const closeModalBtn = document.querySelector('.modal__close-btn');

//   alert(null);

//   function openModal() {
//     alert('Open');
//     // modalOverlay.classList.add('show');
//     // modalWrapper.classList.add('slide-in');

//     // document.documentElement.classList.add('is-locked');
//   }

//   function closeModal() {
//     modalOverlay.classList.remove('show');
//     modalWrapper.classList.remove('slide-in');

//     document.documentElement.classList.remove('is-locked');
//   }

//   closeModalBtn.onclick = closeModal;
//   btnModal.onclick = openModal;
//   modalOverlay.addEventListener('click', closeModal);

//   document
//     .querySelector('.modal__content')
//     ?.style.setProperty('--window-inner-height', `${window.innerHeight}px`);
// });

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

// alert('Hello');
const modalOverlay = document.querySelector('.modal__overlay');
const modalContent = document.querySelector('.modal__content');
const btnModal = document.querySelector('.searching-box__btn');
const modalWrapper = document.querySelector('.modal__wrapper');
const closeModalBtn = document.querySelector('.modal__close-btn');

function syncHeight() {
  document.documentElement.style.setProperty(
    '--window-inner-height',
    `${window.innerHeight}px`
  );
  modalContent.style.setProperty(
    '--window-inner-height',
    `${window.innerHeight}px`
  );
}

syncHeight();

window.addEventListener('resize', syncHeight);

btnModal.onclick = openModal;
closeModalBtn.onclick = closeModal;
