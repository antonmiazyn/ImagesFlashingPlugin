window.onload = () => {

  /*      =============================================      Define Flashing Elements      =============================================      */

  const flashingContainer = document.querySelectorAll('.flashing');
  const isFlashingContainer = flashingContainer && flashingContainer.length > 0;

  /* ----- utilites list ----- */

  const utilites = {
    setStart: setStart,
    setTheme: setTheme,
    setAnimation: setAnimation,

    fillDefaultIndexArray: fillDefaultIndexArray,
    fillRandomIndexArray: fillRandomIndexArray,

    startAnimation: animateElement,
    resetAnimation: resetAnimation,

    startSwitching: switching,
    startExecution: startPluginExecution
  }

  /* -----   -----------------   ----- */

  if(isFlashingContainer) {

    /* ----- default settings ----- */

    const defaultSettings = {
      speed: 150,
      duration: 2000,
      order: 'orderly',
      theme: 'color'
    }

    /* -----   -----------------   ----- */

    flashingContainer.forEach((f_c) => {
      const flashingElements = f_c.querySelectorAll('.flashing-image');
      const isElementsExist = flashingElements && flashingElements.length != 0;

      /* ----- define speed ----- */
        const speedAttribute = f_c.getAttribute('data-speed');
        const isSpeedSetted = speedAttribute && speedAttribute > 0;
        const speed = isSpeedSetted ? speedAttribute * 100 : defaultSettings.speed;

      /* ----- define duration ----- */
        const durationAttribute = f_c.getAttribute('data-duration');
        const isDurationSetted = durationAttribute && durationAttribute >= 1;
        const duration = isDurationSetted ? durationAttribute * 1000 : defaultSettings.duration;

      /* ----- define order ----- */
        const orderAttribute = f_c.getAttribute('data-order');
        const isOrderSetted = orderAttribute && (orderAttribute === 'orderly' || orderAttribute === 'random' || orderAttribute === 'absolute');
        const orderValue = isOrderSetted ? orderAttribute : defaultSettings.order;

        const isOrderly = orderValue === 'orderly';
        const isRandom = (orderValue === 'random' || orderValue === 'absolute');
        const orderType = {
          orderly: utilites.fillDefaultIndexArray(flashingElements.length),
          random: utilites.fillRandomIndexArray(flashingElements.length)
        };

        const currentOrder = isOrderly ? orderType.orderly : isRandom ? orderType.random : orderType.orderly;

      /* ----- define theme ----- */
        const theme = f_c.getAttribute('data-theme');

      /* ----- execution start ----- */
        if(isElementsExist) {
          utilites.setStart(flashingElements);
          utilites.setTheme(flashingElements, theme, defaultSettings.theme);

          const animationIndex = utilites.setAnimation(flashingElements).index;
          const animationData = utilites.setAnimation(flashingElements).data;

          utilites.startExecution(flashingElements, orderValue, currentOrder, speed, animationIndex, animationData, duration); //the very start of the execution
        }
    });
  }



  /*      =============================================      Plugin Funtions      =============================================      */

  /* ----- Set Start ----- */

  function setStart(elements) {
    elements.forEach((el) => {
      el.classList.add('hidden');
    });

    elements[0].classList.remove('hidden');
    elements[0].classList.add('shown');
  }

  /* ----- Set Theme ----- */

  function setTheme(elements, theme, def) {
    switch (theme) {
      case 'greyscale':
        elements.forEach((el) => {
          el.classList.add('greyscale')
        });
        break;
      case 'sepia':
        elements.forEach((el) => {
          el.classList.add('sepia')
        });
        break;
      case 'color':
        elements.forEach((el) => {
          el.classList.add('color')
        });
        break;
      default:
        elements.forEach((el) => {
          el.classList.add(def)
        });
    }
  }

  /* ----- Set Animation ----- */

  function setAnimation(elements) {
    const animationData = {
      index: [],
      data: []
    };

    elements.forEach((el, i) => {
      const sprite = el.querySelector('.flashing-animation');

      if(sprite) {
        const src = sprite.getAttribute("data-src");
        const amount = sprite.getAttribute("data-amount");

        const data_object = {
          src: 'sprites-circles.png',
          amount: 8
        };

        const isAllFilled = amount && src;
        const isAmountFilled = amount && !src;
        const isSrcFilled = !amount && src;

        if(isAllFilled) {
          data_object.src = src;
          data_object.amount = amount;
        } else if(isSrcFilled) {
          data_object.src = src;
        } else if(isAmountFilled) {
          data_object.amount = amount;
        }

        animationData.index.push(i);
        animationData.data.push(data_object)
      }
    });

    return animationData;
  }

  /* ----- Animation Execution ----- */

  let animationFlag;
  function animateElement(animationIndex, animationData, elements, elementIndex, duration) {
    const sprite = elements[elementIndex].querySelector('.flashing-animation');

    if(sprite) {
      let step = 0;

      const animationIndexValue = animationIndex.indexOf(elementIndex);

      sprite.style.backgroundImage = 'url(' + animationData[animationIndexValue].src + ')';

      const height = elements[elementIndex].offsetWidth;
      sprite.style.height = height + 'px';
      const shift = sprite.offsetHeight;

      animationFlag = setInterval(() => {
        step -= shift;
        sprite.style.backgroundPosition = step + 'px 0';
      }, duration / animationData[animationIndexValue].amount);
    }
  }

  /* ----- Reset Animation ----- */

  function resetAnimation(elements, flag) {
    clearInterval(flag);

    elements.forEach((el) => {
      const sprite = el.querySelector('.flashing-animation');
      if(sprite) {
        sprite.style.backgroundImage = 'none';
        sprite.style.backgroundPosition = '0 0';

        const height = el.offsetWidth;
        sprite.style.height = height + 'px';
      }
    });
  }

  /* ----- Fill Default Index Array ----- */

  function fillDefaultIndexArray(length) {
    const array = [];
    for(let i = 0; i < length; i++) {
      array.push(i);
    }

    return array;
  }

  /* ----- Fill Random Index Array ----- */

  function fillRandomIndexArray(length) {
    const array = [];
    for(let i = 0; i < 10 * length; i++) {
      const number = Math.floor(Math.random() * length)
      if(!array.includes(number)) {
        array.push(number);
      }
    }

    return array;
  }

  /* ----- Start Switching ----- */

  let intervalFlag;
  function switching(elements, order, speed, pause) {
    if(!pause) {

      const index = order;
      let currentIndex = 0;

      intervalFlag = setInterval(() => {
        if(currentIndex === elements.length - 1) {
          currentIndex = 0;
        } else {
          currentIndex++;
        }

        elements.forEach((el) => {
          el.classList.remove('shown');
          el.classList.add('hidden');
        });

        elements[index[currentIndex]].classList.remove('hidden');
        elements[index[currentIndex]].classList.add('shown');
      }, speed);
    } else {
      clearInterval(intervalFlag)
    }
  }



  /*      =============================================      Plugin Execution      =============================================      */

  function startPluginExecution(elements, orderType, orderArray, speed, animationIndex, animationData, duration) {
    let pause = false;
    let i = 0;

    const infiniteAnimation = setInterval(() => {
      utilites.startSwitching(elements, orderArray, speed, pause);

      if(pause) {
        elements.forEach((el) => {
          el.classList.remove('shown');
          el.classList.add('hidden');
        });

        elements[orderArray[i]].classList.remove('hidden');
        elements[orderArray[i]].classList.add('shown');

        utilites.startAnimation(animationIndex, animationData, elements, orderArray[i], duration);

        if(i < elements.length - 1) {
          i++
        } else {
          i = 0;

          if(orderType === 'absolute') {
            orderArray = utilites.fillRandomIndexArray(elements.length)
          }
        }
      } else {
        utilites.resetAnimation(elements, animationFlag);
      }

      pause = !pause;
    }, duration)
  }
}
