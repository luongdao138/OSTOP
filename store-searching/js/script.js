const modalOverlay = document.querySelector('.modal__overlay')
const modalWrapper = document.querySelector('.modal__wrapper')

const btnModal = document.querySelector('.searching-box__btn')
const closeModalBtn = document.querySelector('.modal__close-btn')

function openModal() {
        modalOverlay.classList.add('show')
        modalWrapper.classList.add('slide-in')

        document.body.style.overflow = 'hidden'
}

function closeModal() {
    modalOverlay.classList.remove('show')
    modalWrapper.classList.remove('slide-in')
    document.body.style.overflow = 'visible'
}

btnModal.addEventListener('click', openModal)
closeModalBtn.addEventListener('click', closeModal)
modalOverlay.addEventListener('click', closeModal)