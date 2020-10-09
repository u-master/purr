

function sliderRun ({ sliderId, viewNum }) {
  let currentIndex = 0;
  const sizeControl = 15;
  const sizeDot = 10;

  const slider = document.getElementById(sliderId);
  if (slider === null) return;

  
  const slidesContainer = createSlidesContainer();
  const controls = createControls(sizeControl);
  const dots = createDots(sizeDot);

  setSliderStyles(slider);
  rebuildSlider(slider, slidesContainer, controls, dots);

}


/*----------------------*/

/** Tune styles for slider */
function setSliderStyles (slider) {
  slider.style.display = 'flex';
  slider.style.flexDirection = 'column';
  slider.style.justifyContent = 'flex-start';
  slider.style.alignItems = 'stretch';
}

/** Create slides container */
function createSlidesContainer () {
  const slidesContainer = document.createElement('div');
  slidesContainer.style.display = 'flex';
  slidesContainer.style.justifyContent = 'space-between';
  slidesContainer.style.alignItems = 'center';
  return slidesContainer;
}

/** Create controls */
function createControls (sizeControl) {
  const prevButton = document.createElement('a');
  prevButton.href = '#';
  prevButton.style.border = '1px solid black';
  prevButton.style.borderRadius = '50%';
  prevButton.style.color = 'black';
  prevButton.style.fontSize = `${Math.floor(sizeControl*0.75)}px`;
  prevButton.style.width = `${sizeControl}px`;
  prevButton.style.height = `${sizeControl}px`;
  prevButton.style.textDecoration = 'none';
  prevButton.style.lineHeight = `${sizeControl}px`;
  prevButton.style.textAlign = 'center';
  prevButton.style.flexShrink = '0';
  const nextButton = prevButton.cloneNode(false);
  prevButton.innerText = '‹';
  nextButton.innerText = '›';
  return { prevButton, nextButton };
}

/** Create dots */
function createDots (sizeDot) {
  const dotsContainer = document.createElement('div');
  const dots = Array(3).map(() => {
    const dot = document.createElement('a');
    dot.href = '#';
    dot.style.display = 'block';
    dot.style.borderRadius = '50%';
    dot.style.width = `${sizeDot}px`;
    dot.style.height = `${sizeDot}px`;
    dot.style.backgroundColor = 'silver';
    return dot;
  });
  dotsContainer.append(dots);
  dotsContainer.style.width = '100%';
  return dotsContainer;
}

/** Move inner slides into flex container, add to slider control buttons and dots */
function rebuildSlider(slider, slidesContainer, { prevButton, nextButton }, dots) {
  const slides = [...slider.children];
  slidesContainer.append(prevButton, ...slides, nextButton);
  slider.innerHTML = '';
  slider.append(slidesContainer, dots);
};