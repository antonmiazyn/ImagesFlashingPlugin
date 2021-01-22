window.onload = () => {

  /*      =============================================      Define Flashing Elements      =============================================      */

  const FLASHING_CONTAINERS = document.querySelectorAll('.flashing');
  const IS_FLASHING_CONTAINER = FLASHING_CONTAINERS && FLASHING_CONTAINERS.length > 0;

  /* ----- UTILITES list ----- */

  const UTILITES = {
    setStartNodeCondition: setStartNodeCondition,
    setTheme: setTheme,
    setAnimation: setAnimation,

    fillDefaultIndexArray: fillDefaultIndexArray,
    fillRandomIndexArray: fillRandomIndexArray,

    startAnimation: animateElement,
    resetAnimation: resetAnimation,

    startSwitching: switching,
    pauseSwitching: pauseSwitching,
    startExecution: startPluginExecution
  }

  /* ----- theme settings ----- */

  const THEME_SETTINGS = ['greyscale', 'sepia', 'color'];

  /* -----   -----------------   ----- */

  if(IS_FLASHING_CONTAINER) {

    /* ----- default settings ----- */

    const defaultSettings = {
      speed: 150,
      duration: 2000,
      order: 'orderly',
      theme: 'color'
    }

    /* -----   -----------------   ----- */

    FLASHING_CONTAINERS.forEach((container) => {
      const flashingElements = container.querySelectorAll('.flashing-image');
      const isElementsExist = flashingElements && flashingElements.length !== 0;

      /* ----- define speed ----- */
        const speedAttribute = container.getAttribute('data-speed');
        const isSpeedSetted = speedAttribute && speedAttribute > 0;
        const speed = isSpeedSetted
          ? speedAttribute * 100
          : defaultSettings.speed;

      /* ----- define duration ----- */
        const durationAttribute = container.getAttribute('data-duration');
        const isDurationSetted = durationAttribute && durationAttribute >= 1;
        const duration = isDurationSetted
          ? durationAttribute * 1000
          : defaultSettings.duration;

      /* ----- define order ----- */
        const orderAttribute = container.getAttribute('data-order');
        const isOrderSetted = orderAttribute &&
          (orderAttribute === 'orderly' ||
          orderAttribute === 'random' ||
          orderAttribute === 'absolute');
        const orderValue = isOrderSetted ? orderAttribute : defaultSettings.order;

        const isOrderly = orderValue === 'orderly';
        const isRandom = orderValue === 'random' || orderValue === 'absolute';
        const orderType = {
          orderly: UTILITES.fillDefaultIndexArray(flashingElements.length),
          random: UTILITES.fillRandomIndexArray(flashingElements.length)
        };

        const orderArray = isOrderly
          ? orderType.orderly
          : isRandom
          ? orderType.random
          : orderType.orderly;

      /* ----- define theme ----- */
        const theme = container.getAttribute('data-theme');

      /* ----- execution start ----- */
        if(isElementsExist) {
          UTILITES.setStartNodeCondition(flashingElements);
          UTILITES.setTheme(flashingElements, THEME_SETTINGS, theme, defaultSettings.theme);

          const animationIndex = UTILITES.setAnimation(flashingElements).index;
          const animationData = UTILITES.setAnimation(flashingElements).data;

          const startExecutionParams = {
            elements: flashingElements,
            orderType: orderValue,
            orderArray, speed, animationIndex, animationData, duration
          }
          UTILITES.startExecution(startExecutionParams); //the very start of execution
        }
    });
  }



  /*      =============================================      Plugin Funtions      =============================================      */

  /* ----- Set Start ----- */

  function setStartNodeCondition(elements) {
    const isArrayExist = elements && elements.length > 0;

    if(isArrayExist) {
      elements.forEach((element) => {
        element.classList.add('hidden');
      });

      elements[0].classList.remove('hidden');
      elements[0].classList.add('shown');
    }
  }

  /* ----- Set Theme ----- */

  function setTheme(elements, settings, theme, def) {
    const classToAdd = settings.includes(theme)
      ? theme
      : def;

    const isArrayExist = elements && elements.length > 0;

    if(isArrayExist) {
      elements.forEach(({ classList }) => {
        classList.add(classToAdd);
      });
    }
  }

  /* ----- Set Animation ----- */

  function setAnimation(elements) {
    const animationData = {
      index: [],
      data: []
    };

    const isArrayExist = elements && elements.length > 0;

    if(isArrayExist) {
      elements.forEach((element, i) => {
        const sprite = element.querySelector('.flashing-animation');

        if(sprite) {
          const src = sprite.getAttribute("data-src");
          const amount = sprite.getAttribute("data-amount");

          const data = {
            src: 'sprites-circles.png',
            amount: 8
          };

          const isAllFilled = amount && src;
          const isOnlyAmountFilled = amount && !src;
          const isOnlySrcFilled = !amount && src;

          if(isAllFilled) {
            data.src = src;
            data.amount = amount;
          } else if(isOnlySrcFilled) {
            data.src = src;
          } else if(isOnlyAmountFilled) {
            data.amount = amount;
          }

          animationData.index.push(i);
          animationData.data.push(data)
        }
      });
    }

    return animationData;
  }

  /* ----- Animation Execution ----- */

  let ANIMATION_FLAG;
  const ANIMATE_ELEMENT_PARAMS = {
    animationIndex: 0,
    animationData: 0,
    elements: [],
    elementIndex: 0,
    duration: 1
  }
  function animateElement(ANIMATE_ELEMENT_PARAMS) {
    const sprite = elements[elementIndex].querySelector('.flashing-animation');

    if(sprite) {
      let step = 0;

      const animationIndexValue = animationIndex.indexOf(elementIndex);

      sprite.style.backgroundImage =
        'url(' + animationData[animationIndexValue].src + ')';

      const height = elements[elementIndex].offsetWidth;
      sprite.style.height = height + 'px';
      const shift = sprite.offsetHeight;

      ANIMATION_FLAG = setInterval(() => {
        step -= shift;
        sprite.style.backgroundPosition = step + 'px 0';
      }, duration / animationData[animationIndexValue].amount);
    }
  }

  /* ----- Reset Animation ----- */

  function resetAnimation(elements, flag) {
    clearInterval(flag);
    const isArrayExist = elements && elements.length > 0;

    if(isArrayExist) {
      elements.forEach((element) => {
        const sprite = element.querySelector('.flashing-animation');
        if(sprite) {
          sprite.style.backgroundImage = 'none';
          sprite.style.backgroundPosition = '0 0';

          const height = element.offsetWidth;
          sprite.style.height = height + 'px';
        }
      });
    } else {
      return;
    }
  }

  /* ----- Fill Default Index Array ----- */

  function fillDefaultIndexArray(length) {
    return Array.from(Array(length).keys());
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

  let SWITCHING_INTERVAL_FLAG;
  function switching(elements, order, speed, pause) {
    if(!pause) {
      let currentIndex = 0;

      SWITCHING_INTERVAL_FLAG = setInterval(() => {
        if(currentIndex === elements.length - 1) {
          currentIndex = 0;
        } else {
          currentIndex++;
        }

        UTILITES.pauseSwitching(elements);

        const currentElementIndex = order[currentIndex];

        elements[currentElementIndex].classList.remove('hidden');
        elements[currentElementIndex].classList.add('shown');
      }, speed);
    } else {
      clearInterval(SWITCHING_INTERVAL_FLAG);
    }
  }

  /* ----- pause switching ----- */

  function pauseSwitching(elements) {
    const isArrayExist = elements && elements.length > 0;

    if(isArrayExist) {
      elements.forEach((element) => {
        element.classList.remove('shown');
        element.classList.add('hidden');
      });
    } else {
      return;
    }
  }



  /*      =============================================      Plugin Execution      =============================================      */

  function startPluginExecution({
    elements,
    orderType,
    orderArray,
    speed,
    animationIndex,
    animationData,
    duration
  }) {
    let pause = false;
    let i = 0;

    setInterval(() => {
      UTILITES.startSwitching(elements, orderArray, speed, pause);

      if(pause) {
        UTILITES.pauseSwitching(elements);

        const orderVar = orderArray[i];
        const selectedElement = elements[orderVar];
        selectedElement.classList.remove("hidden");
        selectedElement.classList.add("shown");

        const startAnimationParams = {
          animationIndex: animationIndex,
          animationData: animationData,
          elements: elements,
          elementIndex: orderVar,
          duration: duration
        };
        UTILITES.startAnimation(startAnimationParams);

        if(i < elements.length - 1) {
          i++
        } else {
          i = 0;

          if(orderType === 'absolute') {
            orderArray = UTILITES.fillRandomIndexArray(elements.length)
          }
        }
      } else {
        UTILITES.resetAnimation(elements, ANIMATION_FLAG);
      }

      pause = !pause;
    }, duration);
  }
};
