function sliderRun({ sliderId, viewNum }) {
  let currentIndex = 0;
  let animationProcess = 'idle';
  const sizeControl = 15;
  const sizeDot = 10;
  const animationDelay = 20;
  const animationMultiplyer = 5;

  const slider = document.getElementById(sliderId);
  if (slider === null) return;
  const slides = [...slider.children];
  const slidesLen = slides.length;

  const wrapper = createTopWrapper();
  const controls = createControls(sizeControl);
  const viewport = createViewport();
  const dots = createDots(sizeDot, slider.children.length);
  const slidesContainer = createSlidesContainer();

  setSliderStyles(slider);
  rebuildSlider(slider, wrapper, dots, controls, viewport, slidesContainer);
  renderSlides(slidesContainer, slides, currentIndex, viewNum);

  function shiftSlidesContainer(currentMargin, direction) {
    const marginLeft = currentMargin - direction * animationMultiplyer;
    slidesContainer.style.marginLeft = `${marginLeft}%`;
    if (marginLeft >= 0 || marginLeft <= -100) {
      currentIndex = (currentIndex + direction + slidesLen) % slidesLen;
      renderSlides(slidesContainer, slides, currentIndex, viewNum);
      animationProcess = 'ended';
      return;
    }
    setTimeout(shiftSlidesContainer, animationDelay, marginLeft, direction);
  }

  controls.prevButton.addEventListener('click', function (elem) {
    elem.preventDefault();
    if (animationProcess === 'running') {
      console.log('Ease, bro! (prev)');
      return;
    }
    animationProcess = 'running';
    setTimeout(shiftSlidesContainer, animationDelay, -50, -1);
  });

  controls.nextButton.addEventListener('click', function (elem) {
    elem.preventDefault();
    if (animationProcess === 'running') {
      console.log('Ease, bro! (next)');
      return;
    }
    animationProcess = 'running';
    setTimeout(shiftSlidesContainer, animationDelay, -50, 1);
  });
}

/*----------------------*/

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
function createSlidesContainer() {
  const slidesContainer = document.createElement('div');
  slidesContainer.style.display = 'flex';
  slidesContainer.style.justifyContent = 'space-around';
  slidesContainer.style.alignItems = 'center';
  slidesContainer.style.width = '200%';
  slidesContainer.style.marginLeft = '-50%';
  return slidesContainer;
}

/** Create controls */
function createControls(sizeControl) {
  const prevButton = document.createElement('a');
  prevButton.href = '#';
  prevButton.style.border = '1px solid black';
  prevButton.style.borderRadius = '50%';
  prevButton.style.color = 'black';
  prevButton.style.fontSize = `${Math.floor(sizeControl * 0.75)}px`;
  prevButton.style.width = `${sizeControl}px`;
  prevButton.style.height = `${sizeControl}px`;
  prevButton.style.textDecoration = 'none';
  prevButton.style.lineHeight = `${sizeControl}px`;
  prevButton.style.textAlign = 'center';
  prevButton.style.flexShrink = '0';
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
function createDots(sizeDot, numDots) {
  const dotsContainer = document.createElement('div');
  const dots = [...Array(numDots)].map(() => {
    const dot = document.createElement('a');
    dot.href = '#';
    dot.style.display = 'block';
    dot.style.borderRadius = '50%';
    dot.style.width = `${sizeDot}px`;
    dot.style.height = `${sizeDot}px`;
    dot.style.backgroundColor = 'silver';
    dot.style.margin = `0 ${Math.floor(sizeDot / 2)}px`;
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
