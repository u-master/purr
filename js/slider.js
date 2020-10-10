function sliderRun({
  sliderId,
  viewNum = 1,
  animationDelay = 20,
  autoPlay = {}, // { enabled: true, delay: ms, playOnStart: true | false, direction: 'prev' | 'next' }
  buttonStyles = {},
  dotStyles = {},
  activeDotStyles = {},
}) {
  // States
  let currentIndex = 0;
  let animationProcess = 'idle';
  let autoPlayDirection = 'stop';
  let autoPlayTimer = 0;

  // Element styles
  const finalButtonStyles = {
    border: '1px solid black',
    borderRadius: '50%',
    color: 'black',
    fontSize: '12px',
    width: '15px',
    height: '15px',
    textDecoration: 'none',
    lineHeight: '15px',
    textAlign: 'center',
    ...buttonStyles,
  };

  const nextButtonStyles = { ...finalButtonStyles, marginLeft: '10px' };
  const prevButtonStyles = { ...finalButtonStyles, marginRight: '10px' };

  const finalDotStyles = {
    display: 'block',
    borderRadius: '50%',
    width: '10px',
    height: '10px',
    backgroundColor: 'silver',
    margin: '0 5px',
    ...dotStyles,
  };

  const finalActiveDotStyles = {
    ...finalDotStyles,
    backgroundColor: 'gray',
    ...activeDotStyles,
  };

  const autoPlaySettings = {
    enabled: false,
    delay: 3000,
    playOnStart: false,
    direction: 'next',
    ...autoPlay,
  };

  const mapDirections = {
    prev: { sign: -1, label: '‹', labelAuto: '«' },
    next: { sign: 1, label: '›', labelAuto: '»' },
    stop: { sign: 0, labelAuto: '×' },
  };

  // View
  const slider = document.getElementById(sliderId);
  if (slider === null) return;
  const slides = [...slider.children];
  const slidesLen = slides.length;

  const wrapper = createTopWrapper();
  const controls = {
    prevButton: createControl(mapDirections.prev.label, onclickShift('prev'), prevButtonStyles),
    nextButton: createControl(mapDirections.next.label, onclickShift('next'), nextButtonStyles),
    prevAutoButton: autoPlaySettings.enabled
      ? createControl(mapDirections.prev.labelAuto, onclickAutoShift('prev'), prevButtonStyles)
      : null,
    nextAutoButton: autoPlaySettings.enabled
      ? createControl(mapDirections.next.labelAuto, onclickAutoShift('next'), nextButtonStyles)
      : null,
  };
  const viewport = createViewport();
  const dots = createDots(slider.children.length, onclickDot, finalDotStyles);
  const slidesContainer = createSlidesContainer(viewNum);

  setSliderStyles(slider);
  rebuildSlider(slider, wrapper, dots, controls, viewport, slidesContainer);
  renderSlides(slidesContainer, slides, currentIndex, viewNum);
  setDotStyles(dots, currentIndex, finalActiveDotStyles); // Apply to current dot 'active' styles
  if (autoPlaySettings.playOnStart)
    executeAutoShift(
      autoPlaySettings.direction,
      controls[`${autoPlaySettings.direction}AutoButton`],
    );

  // Controller
  const animationMultiplyer = 10 / viewNum;
  const startMarginLeft = -100 / viewNum;
  const stopMarginLeft = 2 * startMarginLeft;

  function onclickShift(direction) {
    return function (elem) {
      elem.preventDefault();
      runPlay(direction);
    };
  }

  function executeAutoShift(direction, button) {
    if (autoPlayDirection === direction) {
      stopAutoPlay();
      button.innerText = mapDirections[direction].labelAuto;
    } else {
      if (autoPlayDirection === 'stop') button.innerText = mapDirections.stop.labelAuto;
      runAutoPlay(direction);
    }
  }

  function onclickAutoShift(direction) {
    return function (elem) {
      elem.preventDefault();
      executeAutoShift(direction, elem.target);
    };
  }

  function onclickDot(index) {
    return function (elem) {
      elem.preventDefault();
      const delta = index - currentIndex;
      if (delta === 0) return;
      runPlay(delta < 0 ? 'prev' : 'next', Math.abs(delta));
    };
  }

  // Shift effect animation
  function shiftSlides(currentMargin, direction, callbackEnd, iterations) {
    const dirSign = mapDirections[direction].sign;
    const marginLeft = currentMargin - dirSign * animationMultiplyer;
    if (marginLeft >= 0 || marginLeft <= stopMarginLeft) {
      setDotStyles(dots, currentIndex, finalDotStyles);
      currentIndex = (currentIndex + dirSign + slidesLen) % slidesLen;
      renderSlides(slidesContainer, slides, currentIndex, viewNum);
      slidesContainer.style.marginLeft = `${startMarginLeft}%`; // View
      setDotStyles(dots, currentIndex, finalActiveDotStyles);
      if (iterations === 1) callbackEnd();
      else
        setTimeout(
          shiftSlides,
          animationDelay,
          startMarginLeft,
          direction,
          callbackEnd,
          iterations - 1,
        );
      return;
    }
    slidesContainer.style.marginLeft = `${marginLeft}%`; // View
    setTimeout(shiftSlides, animationDelay, marginLeft, direction, callbackEnd, iterations);
  }

  // Processes controls
  function runPlay(direction, iterations = 1) {
    if (animationProcess === 'running') return;
    animationProcess = 'running';
    pauseAutoPlay();
    shiftSlides(startMarginLeft, direction, stopPlay, iterations);
  }

  function stopPlay() {
    if (animationProcess !== 'running') return;
    animationProcess = 'finished';
    resumeAutoPlay();
  }

  function runAutoPlay(direction) {
    if (autoPlayDirection !== 'stop') return;
    autoPlayDirection = direction;
    resumeAutoPlay();
  }

  function stopAutoPlay() {
    pauseAutoPlay();
    autoPlayDirection = 'stop';
  }

  function resumeAutoPlay() {
    if (autoPlayDirection !== 'stop')
      autoPlayTimer = setTimeout(runPlay, autoPlaySettings.delay, autoPlayDirection, 1);
  }

  function pauseAutoPlay() {
    clearTimeout(autoPlayTimer);
  }

  /* --- ^ ^ --- */

  /** Tune styles for slider */
  function setSliderStyles(slider) {
    slider.style.display = 'flex';
    slider.style.flexDirection = 'column';
    slider.style.justifyContent = 'flex-start';
    slider.style.alignItems = 'stretch';
  }

  /** Create top elements wrapper (contains controls and slides) */
  function createTopWrapper() {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.justifyContent = 'space-between';
    wrapper.style.alignItems = 'center';
    return wrapper;
  }

  /** Create slides container with buffer */
  function createSlidesContainer(viewNum) {
    const slidesContainer = document.createElement('div');
    slidesContainer.style.display = 'flex';
    slidesContainer.style.justifyContent = 'space-around';
    slidesContainer.style.alignItems = 'center';
    slidesContainer.style.width = `${100 + 200 / viewNum}%`;
    slidesContainer.style.marginLeft = `${-100 / viewNum}%`;
    return slidesContainer;
  }

  /** Create control */
  function createControl(content, onclickButton, buttonStyles) {
    const button = document.createElement('a');
    Object.assign(button.style, buttonStyles);
    button.style.flexShrink = '0';
    button.href = '#';
    button.innerText = content;
    button.addEventListener('click', onclickButton);
    return button;
  }

  /** Create viewport for slides. It hides unnecessary slides. */
  function createViewport() {
    const viewport = document.createElement('div');
    viewport.style.width = '100%';
    viewport.style.overflow = 'hidden';
    return viewport;
  }

  /** Create dots */
  function createDots(numDots, onclickDot, dotStyles) {
    const dotsContainer = document.createElement('div');
    const dots = [...Array(numDots)].map((_elem, index) => {
      const dot = document.createElement('a');
      Object.assign(dot.style, dotStyles);
      dot.href = '#';
      dot.addEventListener('click', onclickDot(index));
      return dot;
    });
    dotsContainer.append(...dots);
    dotsContainer.style.display = 'flex';
    dotsContainer.style.justifyContent = 'center';
    dotsContainer.style.width = '100%';
    dotsContainer.style.paddingTop = '10px';
    dotsContainer.style.flexShrink = '0';
    return dotsContainer;
  }

  /** Set dot styles (switch between active and simple dot styles) */
  function setDotStyles(dotsContainer, currentIndex, styles) {
    Object.assign(dotsContainer.children[currentIndex].style, styles);
  }

  /** Make clean slider, then add slides viewport, control buttons and dots */
  function rebuildSlider(
    slider,
    wrapper,
    dots,
    { prevButton, nextButton, prevAutoButton, nextAutoButton },
    viewport,
    slidesContainer,
  ) {
    viewport.append(slidesContainer);
    const wrapperElems = [prevAutoButton, prevButton, viewport, nextButton, nextAutoButton].filter(
      (e) => e,
    );
    wrapper.append(...wrapperElems);
    slider.innerHTML = '';
    slider.append(wrapper, dots);
  }

  /** Render slides to slidesContainer */
  function renderSlides(slidesContainer, slides, currentIndex, viewNum) {
    const slidesNum = viewNum + 2;
    const slidesToContainer = Array(slidesNum);
    const startIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    for (let i = 0; i < slidesNum; i += 1)
      slidesToContainer[i] = slides[(startIndex + i) % slides.length].cloneNode(true);
    slidesContainer.innerHTML = '';
    slidesContainer.append(...slidesToContainer);
  }
}
