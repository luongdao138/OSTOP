// create carousel
let carousels = document.getElementsByClassName('carousel');

for (let carousel of carousels) {
  let carouselIems = carousel.querySelectorAll(':scope > *');

  for (let carouselItem of carouselIems) {
    carouselItem.classList.add('carousel__item');
  }

  carousel.outerHTML = `<div class="carousel-wrap">${carousel.outerHTML}</div>`;
}

let carouselWraps = document.getElementsByClassName('carousel-wrap');

// create arrow button in carousel
for (let carouselWrap of carouselWraps) {
  let arrowNextButton = document.createElement('button');
  arrowNextButton.classList.add('arrow-button', 'arrow-button--next');

  let arrowPrevButton = document.createElement('button');
  arrowPrevButton.classList.add('arrow-button', 'arrow-button--prev');

  let svgPathPrev =
    'M16.259,17.258a.712.712,0,0,1,0,1.028.761.761,0,0,1-1.057,0L8.8,12.064a.712.712,0,0,1,0-1.028l6.5-6.323a.762.762,0,0,1,1.057,0,.712.712,0,0,1,0,1.028L10.386,11.55l5.876,5.708Z';
  let svgPathNext =
    'M8.9,17.258a.712.712,0,0,0,0,1.028.761.761,0,0,0,1.057,0l6.4-6.222a.712.712,0,0,0,0-1.028l-6.5-6.323a.762.762,0,0,0-1.057,0,.712.712,0,0,0,0,1.028l5.975,5.809L8.9,17.258Z';

  createCarouselButton(carouselWrap, arrowPrevButton, svgPathPrev);
  createCarouselButton(carouselWrap, arrowNextButton, svgPathNext);
}

function createCarouselButton(carouselWrap, button, svgPath) {
  let arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  let arrowPath = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );
  arrowPath.setAttribute('d', svgPath);
  arrowPath.setAttribute('transform', 'translate(-8.58 -4.5)');
  arrowSvg.appendChild(arrowPath);
  button.appendChild(arrowSvg);
  carouselWrap.appendChild(button, carouselWrap);
}

// animate carousel
animateCarousel();

function animateCarousel() {
  let carouselWraps = document.getElementsByClassName('carousel-wrap');

  for (let carouselWrap of carouselWraps) {
    let carouselWrapWidth = carouselWrap.offsetWidth;
    let carouselInner = carouselWrap.querySelector('.carousel');
    let carouselStyle = window.getComputedStyle(carouselInner, null);
    let carouselPaddingLeft = parseInt(carouselStyle.paddingLeft, 10);
    let carouselItem = carouselInner.querySelector('.carousel__item');
    let carouselItemStyle = window.getComputedStyle(carouselItem, null);
    let carouselItemWidth = carouselItem.offsetWidth;
    let carouselItemMarginRight = parseInt(carouselItemStyle.marginRight, 10);
    let carouselActiveArea = carouselWrapWidth - carouselPaddingLeft;
    let carouselItemWidthWhole = carouselItemWidth + carouselItemMarginRight;
    let carouselItemCount = carouselActiveArea / carouselItemWidthWhole;
    let carouselItemCountFloor = Math.floor(carouselItemCount);
    let visibleCarouselItems =
      carouselItemWidthWhole * carouselItemCountFloor + carouselItemWidth;
    let carouselItems = carouselInner.querySelectorAll('.carousel__item');
    let carouselItemLength = carouselItems.length;
    let nextButton = carouselWrap.querySelector('.arrow-button--next');
    let prevButton = carouselWrap.querySelector('.arrow-button--prev');
    let position = 0;
    let maxPage;
    let currentPage = 1;
    let targetIndexMax;
    let targetIndexMin;
    let targetPage;
    let activeCarouselItemNum;

    // number of items to activate in the carousel
    if (visibleCarouselItems <= carouselActiveArea) {
      activeCarouselItemNum = carouselItemCountFloor + 1;
    } else {
      activeCarouselItemNum = carouselItemCountFloor;
    }

    let restItems = carouselItems.length - activeCarouselItemNum;

    // initialization
    (function () {
      let carouselActiveItems = carouselInner.querySelectorAll('.active');
      for (let carouselActiveItem of carouselActiveItems) {
        carouselActiveItem.classList.remove('active');
      }
    })();

    for (let i = 0; i < activeCarouselItemNum; i++) {
      if(carouselItems[i]) carouselItems[i].classList.add('active');
    }

    maxPage = Math.ceil(carouselItemLength / activeCarouselItemNum);

    if(maxPage != 1) nextButton.classList.add('show');
  
    prevButton.classList.remove('show');
    carouselInner.style.transform = 'translateX(-' + position + 'px)';

    // when you click the next button
    nextButton.addEventListener('click', function () {
      let carouselActiveItems = carouselInner.querySelectorAll('.active');
      targetPage = currentPage + 1;

      for (let carouselActiveItem of carouselActiveItems) {
        carouselActiveItem.classList.remove('active');
      }

      if (activeCarouselItemNum * targetPage <= carouselItemLength) {
        targetIndexMax = activeCarouselItemNum * targetPage;
      } else {
        targetIndexMax = carouselItemLength;
      }

      restItems = carouselItems.length - currentPage * activeCarouselItemNum

      for (
        let i = activeCarouselItemNum * currentPage - (restItems > activeCarouselItemNum ? 0 : (activeCarouselItemNum - restItems));
        i < targetIndexMax;
        i++
      ) {
        carouselItems[i].classList.add('active');
      }

      if(restItems > activeCarouselItemNum) {
        position = carouselItemWidthWhole * activeCarouselItemNum * currentPage;
      } else {
        const wWidth = window.innerWidth;
        const paddingLeftCarouselInner = parseFloat(window.getComputedStyle(carouselInner).paddingLeft) || 0;
        const restWidth = wWidth - (activeCarouselItemNum * carouselItemWidthWhole + paddingLeftCarouselInner);
        position += carouselItemWidthWhole * restItems - restWidth + paddingLeftCarouselInner;
      }

      carouselInner.style.transform = 'translateX(-' + position + 'px)';
      currentPage = targetPage;

      showButton(prevButton, nextButton, currentPage, maxPage);
    });

    // when you click the preview button
    prevButton.addEventListener('click', function () {
      let carouselActiveItems = carouselInner.querySelectorAll('.active');
      targetPage = currentPage - 1;

      for (let carouselActiveItem of carouselActiveItems) {
        carouselActiveItem.classList.remove('active');
      }

      targetIndexMax = activeCarouselItemNum * targetPage;
      targetIndexMin = activeCarouselItemNum * (targetPage - 1);

      for (
        let i = activeCarouselItemNum * targetPage - 1;
        i >= targetIndexMin;
        i--
      ) {
        carouselItems[i].classList.add('active');
      }

      position = carouselItemWidthWhole * targetIndexMin;
      carouselInner.style.transform = 'translateX(-' + position + 'px)';
      currentPage = targetPage;

      showButton(prevButton, nextButton, currentPage, maxPage);
    });
  }
}

// show arrow button in the carousel
function showButton(prevButton, nextButton, currentPage, maxPage) {
  if (currentPage == 1) {
    prevButton.classList.remove('show');
    if(maxPage != 1) {
      nextButton.classList.add('show');
    }
  } else if (currentPage == maxPage) {
    nextButton.classList.remove('show');
    prevButton.classList.add('show');
  } else {
    if(currentPage > maxPage) {
      nextButton.classList.remove('show');
      prevButton.classList.add('show');
    } else {
      nextButton.classList.add('show');
      prevButton.classList.add('show');
    }
  }
}

// when window resize
let windowWidth = document.body.offsetWidth;
let resizeWindowWidth;

window.onresize = function () {
  resizeWindowWidth = document.body.offsetWidth;

  if (windowWidth !== resizeWindowWidth) {
    animateCarousel();
    windowWidth = resizeWindowWidth;
  }
};
