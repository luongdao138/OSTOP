window.addEventListener('DOMContentLoaded', function(){

  // when window resize
  let windowWidth = document.body.offsetWidth;
  let resizeWindowWidth;

  window.onresize = function() {
    resizeWindowWidth = document.body.offsetWidth;

    if (windowWidth !== resizeWindowWidth) {
      animateCarousel();
      windowWidth = resizeWindowWidth;
    }
  };

  // image-carousel
  // create carousel
  let imageCarousels = document.getElementsByClassName('image-carousel');

  for (let imageCarousel of imageCarousels) {

    let activeItemFirst = imageCarousel.firstElementChild;
    activeItemFirst.classList.add('active');

    imageCarousel.outerHTML = `<div class="image-carousel-wrap">${imageCarousel.outerHTML}</div>`;
  }

  let imageCarouselWraps = document.getElementsByClassName('image-carousel-wrap');

  for (let imageCarouselWrap of imageCarouselWraps) {

    // create the main image in carousel
    let focusItem = document.createElement('div');
    focusItem.classList.add('focus-item');
    imageCarouselWrap.prepend(focusItem);

    let activeItem = imageCarouselWrap.querySelector('.image-carousel__item.active');
    let cloneActiveItem = activeItem.cloneNode(true);
    focusItem.prepend(cloneActiveItem);
    cloneActiveItem.outerHTML = cloneActiveItem.innerHTML;

    // select the image to focus on
    let carouselNaviItems = imageCarouselWrap.getElementsByClassName('image-carousel__item');
    let currentActiveItem = imageCarouselWrap.querySelector('.image-carousel__item, .active');
    let nextActiveItem = currentActiveItem.nextElementSibling;

    // when selecting a navigation image
    for (let carouselNaviItem of carouselNaviItems) {
      carouselNaviItem.addEventListener('click', function() {
        currentActiveItem.classList.remove('active');
        carouselNaviItem.classList.add('active');
        changeFocusItem(carouselNaviItem, focusItem);
        currentActiveItem = carouselNaviItem;
        nextActiveItem = changeNextActiveItem(currentActiveItem, imageCarouselWrap);
      });
    }

    // when you click on the image that is in focus
    focusItem.addEventListener('click', function() {
      nextActiveItem.classList.add('active');
      currentActiveItem.classList.remove('active');
      changeFocusItem(nextActiveItem, focusItem);
      currentActiveItem = nextActiveItem;
      nextActiveItem = changeNextActiveItem(currentActiveItem, imageCarouselWrap);
    });
  }

  function changeFocusItem(targetItem, focusItem) {
    let cloneItem = targetItem.cloneNode(true);
    focusItem.innerHTML = '';
    focusItem.prepend(cloneItem);
    cloneItem.outerHTML = cloneItem.innerHTML;
  }

  function changeNextActiveItem(currentActiveItem, imageCarouselWrap) {
    let newNextActiveItem;
    if (currentActiveItem.nextElementSibling !== null) {
      newNextActiveItem = currentActiveItem.nextElementSibling;
    } else {
      newNextActiveItem = imageCarouselWrap.querySelector('.image-carousel__item:first-child');
    }
    return newNextActiveItem;
  }

  // 関連コンテンツ
  // only for PC
  let pcContent = document.querySelector('.content-width--pc');
  let pcContentStyle = window.getComputedStyle(pcContent, null);
  let pcContentMarginLeft = parseInt(pcContentStyle.marginLeft, 10);
  if (windowWidth >= 520) {
    let relevantCard = document.querySelector('.relevant-contents .card-item');

    relevantCard.classList.add('carousel');
    relevantCard.style.paddingLeft = pcContentMarginLeft + 40 + 'px';
  }

  // carousel
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

    let svgPathPrev = 'M16.259,17.258a.712.712,0,0,1,0,1.028.761.761,0,0,1-1.057,0L8.8,12.064a.712.712,0,0,1,0-1.028l6.5-6.323a.762.762,0,0,1,1.057,0,.712.712,0,0,1,0,1.028L10.386,11.55l5.876,5.708Z';
    let svgPathNext = 'M8.9,17.258a.712.712,0,0,0,0,1.028.761.761,0,0,0,1.057,0l6.4-6.222a.712.712,0,0,0,0-1.028l-6.5-6.323a.762.762,0,0,0-1.057,0,.712.712,0,0,0,0,1.028l5.975,5.809L8.9,17.258Z';

    createCarouselButton(carouselWrap, arrowPrevButton, svgPathPrev);
    createCarouselButton(carouselWrap, arrowNextButton, svgPathNext);
  }

  function createCarouselButton(carouselWrap, button, svgPath) {
    let arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
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
      let pcContentPaddingLeft = parseInt(pcContentStyle.paddingLeft, 10);
      let carouselActiveArea = Math.min((carouselWrapWidth - carouselPaddingLeft), (pcContent.offsetWidth - pcContentPaddingLeft * 2));
      let carouselItemWidthWhole = carouselItemWidth + carouselItemMarginRight;
      let carouselItemCount = carouselActiveArea / carouselItemWidthWhole;
      let carouselItemCountFloor = Math.floor(carouselItemCount);
      let visibleCarouselItems = carouselItemWidthWhole * carouselItemCountFloor + carouselItemWidth;
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

      if (carouselItemLength < carouselItemCount) activeCarouselItemNum = carouselItemLength;

      // initialization
      (function(){
        let carouselActiveItems = carouselInner.querySelectorAll('.active');
        for (let carouselActiveItem of carouselActiveItems) {
          carouselActiveItem.classList.remove('active');
        }
      }());

      for (let i=0; i<activeCarouselItemNum; i++) {
        carouselItems[i].classList.add('active');
      }

      if(carouselActiveArea < (carouselItemWidthWhole * carouselItemLength)) {
        nextButton.classList.add('show');
      } else {
        nextButton.classList.remove('show');
      }

      prevButton.classList.remove('show');
      carouselInner.style.transform = 'translateX(-' + position + 'px)';
      maxPage = Math.ceil(carouselItemLength / activeCarouselItemNum);

      // when you click the next button
      nextButton.addEventListener('click', function(){
        let carouselActiveItems = carouselInner.querySelectorAll('.active');
        targetPage = currentPage + 1;

        for (let carouselActiveItem of carouselActiveItems) {
          carouselActiveItem.classList.remove('active');
        }

        if ((activeCarouselItemNum * targetPage) <= carouselItemLength) {
          targetIndexMax = activeCarouselItemNum * targetPage;
        } else {
          targetIndexMax = carouselItemLength;
        }

        for (let i=(activeCarouselItemNum * currentPage); i<targetIndexMax; i++) {
          carouselItems[i].classList.add('active');
        }

        position = carouselItemWidthWhole * activeCarouselItemNum * currentPage;
        carouselInner.style.transform = 'translateX(-' + position + 'px)';
        currentPage = targetPage;

        showButton(prevButton, nextButton, currentPage, maxPage);
      });

      // when you click the preview button
      prevButton.addEventListener('click', function(){
        let carouselActiveItems = carouselInner.querySelectorAll('.active');
        targetPage = currentPage - 1;

        for (let carouselActiveItem of carouselActiveItems) {
          carouselActiveItem.classList.remove('active');
        }

        targetIndexMax = activeCarouselItemNum * targetPage;
        targetIndexMin = activeCarouselItemNum * (targetPage - 1);

        for (let i=(activeCarouselItemNum * targetPage - 1); i>=targetIndexMin; i--) {
          carouselItems[i].classList.add('active');
        }

        position = carouselItemWidthWhole * targetIndexMin;
        position > 0 ? position = position : position = 0;
        carouselInner.style.transform = 'translateX(-' + position + 'px)';
        currentPage = targetPage;

        showButton(prevButton, nextButton, currentPage, maxPage);
      });

      // swipe only for SP
      if (windowWidth < 520) {
        let startX;
        let moveX = 0;
        let dist = 30;
        carouselInner.addEventListener('touchstart', function(e) {
          e.preventDefault();
          startX = e.touches[0].pageX;
        });
        carouselInner.addEventListener('touchmove', function(e) {
          e.preventDefault();
          moveX = e.changedTouches[0].pageX;
        });
        carouselInner.addEventListener('touchend', function(e) {
          if (moveX == 0) {
            e.target.click();
          } else if (startX > moveX + dist) {
            nextButton.classList.contains('show') ? nextButton.click() : '' ;
            moveX = 0;
          } else if (startX + dist < moveX) {
            prevButton.classList.contains('show') ? prevButton.click() : '' ;
            moveX = 0;
          }
        });
      }
    }
  }

  // show arrow button in the carousel
  function showButton(prevButton, nextButton, currentPage, maxPage) {
    if (currentPage == 1) {
      prevButton.classList.remove('show');
      nextButton.classList.add('show');
    } else if (currentPage == maxPage) {
      prevButton.classList.add('show');
      nextButton.classList.remove('show');
    } else {
      nextButton.classList.add('show');
      prevButton.classList.add('show');
    }
  }

  // 関連コンテンツ
  // only for SP
  if (windowWidth < 520) {
    let relevantCardWrap = document.querySelector('.card-item-wrap');
    let relevantCard = document.querySelector('.relevant-contents .card-item');
    let relevantItem = relevantCard.querySelector('.relevant-content-wrap');
    let relevantItems = relevantCard.querySelectorAll('.relevant-content-wrap');
    let relevantItemNum = Math.round(relevantItems.length / 2);
    let relevantItemWidth = relevantItem.offsetWidth;
    let relevantItemStyle = window.getComputedStyle(relevantItem, null);
    let relevantItemPaddingLeft = parseInt(relevantItemStyle.paddingLeft, 10);
    let relevantCardStyle = window.getComputedStyle(relevantCard, null);
    let relevantCardMarginLeft = parseInt(relevantCardStyle.marginLeft, 10);

    relevantCard.style.width = relevantItemWidth * relevantItemNum + relevantItemPaddingLeft + "px";

    if (relevantItems.length < 5) {
      relevantCardWrap.classList.add('less-than-4');
    }

    for (let i=0; i<relevantItemNum; i++) {
      relevantItems[i].classList.add('upper-row');
    }
    relevantItems[(relevantItemNum - 1)].classList.add('upper-row-last');

    // create carousel
    let arrowNextButton = document.createElement('button');
    arrowNextButton.classList.add('arrow-button', 'arrow-button--next');
    let arrowPrevButton = document.createElement('button');
    arrowPrevButton.classList.add('arrow-button', 'arrow-button--prev');
    let svgPathPrev = 'M16.259,17.258a.712.712,0,0,1,0,1.028.761.761,0,0,1-1.057,0L8.8,12.064a.712.712,0,0,1,0-1.028l6.5-6.323a.762.762,0,0,1,1.057,0,.712.712,0,0,1,0,1.028L10.386,11.55l5.876,5.708Z';
    let svgPathNext = 'M8.9,17.258a.712.712,0,0,0,0,1.028.761.761,0,0,0,1.057,0l6.4-6.222a.712.712,0,0,0,0-1.028l-6.5-6.323a.762.762,0,0,0-1.057,0,.712.712,0,0,0,0,1.028l5.975,5.809L8.9,17.258Z';

    createCarouselButton(relevantCardWrap, arrowPrevButton, svgPathPrev);
    createCarouselButton(relevantCardWrap, arrowNextButton, svgPathNext);

    let arrowButtons = document.querySelectorAll('.card-item-wrap .arrow-button');
    let relevantItemHeight = relevantItem.offsetHeight;

    for (button of arrowButtons) {
      button.style.top = relevantItemHeight + 'px';
    }

    let nextButton = document.querySelector('.card-item-wrap .arrow-button--next');
    let prevButton = document.querySelector('.card-item-wrap .arrow-button--prev');
    let maxPage = relevantItemNum;
    let currentPage = 1;
    let position;

    nextButton.classList.add('show');
    prevButton.classList.remove('show');

    // when you click the next button
    nextButton.addEventListener('click', function(){
      if ((currentPage + 1) !== relevantItemNum) {
        position = relevantItemWidth * currentPage;
      } else {
        position = relevantItemWidth * (currentPage - 1) + relevantItemPaddingLeft + relevantCardMarginLeft * 2;
      }
      relevantCard.style.transform = 'translateX(-' + position + 'px)';
      currentPage++;

      showButton(prevButton, nextButton, currentPage, maxPage);
    });

    // when you click the preview button
    prevButton.addEventListener('click', function(){
      position = relevantItemWidth * (currentPage - 2);
      position > 0 ? position = position : position = 0;
      relevantCard.style.transform = 'translateX(-' + position + 'px)';
      currentPage--;

      showButton(prevButton, nextButton, currentPage, maxPage);
    });

    // swipe
    let startX;
    let moveX = 0;
    let dist = 30;
    relevantCard.addEventListener('touchstart', function(e) {
      e.preventDefault();
      startX = e.touches[0].pageX;
    });
    relevantCard.addEventListener('touchmove', function(e) {
      e.preventDefault();
      moveX = e.changedTouches[0].pageX;
    });
    relevantCard.addEventListener('touchend', function(e) {
      if (moveX == 0) {
        e.target.click();
      } else if (startX > moveX + dist) {
        nextButton.classList.contains('show') ? nextButton.click() : '' ;
        moveX = 0;
      } else if (startX + dist < moveX) {
        prevButton.classList.contains('show') ? prevButton.click() : '' ;
        moveX = 0;
      }
    });
  }


});