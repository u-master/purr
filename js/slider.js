function sliderRun({
  sliderId,
  viewNum = 1,
  animationDelay = 20,
  buttonStyles = {},
  dotStyles = {},
  activeDotStyles = {},
}) {
  // States
  let currentIndex = 0;
  let animationProcess = 'idle';

  // Default styles
  const unitedButtonStyles = {
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

  const unitedDotStyles = {
    display: 'block',
    borderRadius: '50%',
    width: '10px',
    height: '10px',
    backgroundColor: 'gray',
    margin: '0 5px',
    ...dotStyles,
  };

  const unitedActiveDotStyles = {
    ...unitedDotStyles,
    backgroundColor: 'silver',
    ...dotStyles,
  };

  // View
  const slider = document.getElementById(sliderId);
  if (slider === null) return;
  const slides = [...slider.children];
  const slidesLen = slides.length;

  const wrapper = createTopWrapper();
  const controls = createControls(unitedButtonStyles);
  const viewport = createViewport();
  const dots = createDots(slider.children.length, unitedDotStyles);
  const slidesContainer = createSlidesContainer(viewNum);

  setSliderStyles(slider);
  rebuildSlider(slider, wrapper, dots, controls, viewport, slidesContainer);
  renderSlides(slidesContainer, slides, currentIndex, viewNum);
  setDotStyles(dots, currentIndex, unitedActiveDotStyles);

  // Controller
  const animationMultiplyer = 10 / viewNum;
  const startMarginLeft = -100 / viewNum;
  const stopMarginLeft = 2 * startMarginLeft;

  controls.prevButton.addEventListener('click', function (elem) {
    elem.preventDefault();
    if (animationProcess === 'running') {
      console.log('Ease, bro! (prev)');
      return;
    }
    animationProcess = 'running';
    setTimeout(shiftSlidesContainer, animationDelay, startMarginLeft, -1);
  });

  controls.nextButton.addEventListener('click', function (elem) {
    elem.preventDefault();
    if (animationProcess === 'running') {
      console.log('Ease, bro! (next)');
      return;
    }
    animationProcess = 'running';
    setTimeout(shiftSlidesContainer, animationDelay, startMarginLeft, 1);
  });

  /** Shift effect animation */
  function shiftSlidesContainer(currentMargin, direction) {
    const marginLeft = currentMargin - direction * animationMultiplyer;
    if (marginLeft >= 0 || marginLeft <= stopMarginLeft) {
      setDotStyles(dots, currentIndex, unitedDotStyles);
      currentIndex = (currentIndex + direction + slidesLen) % slidesLen;
      renderSlides(slidesContainer, slides, currentIndex, viewNum);
      slidesContainer.style.marginLeft = `${startMarginLeft}%`;
      setDotStyles(dots, currentIndex, unitedActiveDotStyles);
      animationProcess = 'ended';
      return;
    }
    slidesContainer.style.marginLeft = `${marginLeft}%`;
    setTimeout(shiftSlidesContainer, animationDelay, marginLeft, direction);
  }

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

  /** Create controls */
  function createControls(buttonStyles) {
    const prevButton = document.createElement('a');
    Object.assign(prevButton.style, buttonStyles);
    prevButton.style.flexShrink = '0';
    prevButton.href = '#';
    const nextButton = prevButton.cloneNode(false);
    prevButton.innerText = '‹';
    prevButton.style.marginRight = '10px';
    nextButton.innerText = '›';
    nextButton.style.marginLeft = '10px';
    return { prevButton, nextButton };
  }

  /** Create viewport for slides. It hides unnecessary slides. */
  function createViewport() {
    const viewport = document.createElement('div');
    viewport.style.width = '100%';
    viewport.style.overflow = 'hidden';
    return viewport;
  }

  /** Create dots */
  function createDots(numDots, dotStyles) {
    const dotsContainer = document.createElement('div');
    const dots = [...Array(numDots)].map(() => {
      const dot = document.createElement('a');
      Object.assign(dot.style, dotStyles);
      dot.href = '#';
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
    { prevButton, nextButton },
    viewport,
    slidesContainer,
  ) {
    viewport.append(slidesContainer);
    wrapper.append(prevButton, viewport, nextButton);
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
