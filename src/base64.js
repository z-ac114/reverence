document.addEventListener('DOMContentLoaded', () => {
  let isEncodingMode = false;

  const rowContainer = document.createElement('div');
  rowContainer.classList.add('converter-row');

  const inputGroup = document.createElement('div');
  inputGroup.classList.add('input-group');

  const outputGroup = document.createElement('div');
  outputGroup.classList.add('input-group');

  const inputLabel = document.createElement('label');
  inputLabel.textContent = 'Base64 (Input)';
  inputLabel.classList.add('box-label');

  const outputLabel = document.createElement('label');
  outputLabel.textContent = 'Text (Output)';
  outputLabel.classList.add('box-label');

  const base64Input = document.createElement('textarea');
  base64Input.placeholder = 'Enter Base64 string to decode...';
  base64Input.classList.add('base64-input');
  base64Input.rows = 6;
  base64Input.cols = 30;

  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '⇄';
  toggleBtn.classList.add('toggle-btn');

  const base64Output = document.createElement('textarea');
  base64Output.placeholder = 'Decoded output...';
  base64Output.classList.add('base64-output');
  base64Output.rows = 6;
  base64Output.cols = 30;
  base64Output.readOnly = true;

  inputGroup.appendChild(inputLabel);
  inputGroup.appendChild(base64Input);

  outputGroup.appendChild(outputLabel);
  outputGroup.appendChild(base64Output);

  rowContainer.appendChild(inputGroup);
  rowContainer.appendChild(toggleBtn);
  rowContainer.appendChild(outputGroup);

  const headers = document.querySelectorAll('.section-header');
  let nextHeader = null;

  headers.forEach(header => {
    const heading = header.querySelector('h3');
    if (heading && heading.textContent.includes('A1Z26')) {
      nextHeader = header;
    }
  });

  if (nextHeader) {
    document.body.insertBefore(rowContainer, nextHeader);
  } else {
    document.body.appendChild(rowContainer);
  }
  const triggerIntroAnimation = () => {
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(rowContainer, 
        { y: 40, opacity: 0 },
        { duration: 0.6, y: 0, opacity: 1, ease: "power2.out", overwrite: "auto" }
      );
    } else {
      rowContainer.style.opacity = '1';
    }
  };

  const triggerExitAnimation = () => {
    if (typeof gsap !== 'undefined') {
      gsap.to(rowContainer, {
        duration: 0.4,
        y: -20,
        opacity: 0,
        ease: "power2.in",
        overwrite: "auto"
      });
    } else {
      rowContainer.style.opacity = '0';
    }
  };

  const observerOptions = {
    root: null,
    rootMargin: '-50px 0px -50px 0px', 
    threshold: 0.05 
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerIntroAnimation();
      } else {
        triggerExitAnimation();
      }
    });
  }, observerOptions);

  scrollObserver.observe(rowContainer);

  const performConversion = () => {
    const rawText = base64Input.value;

    if (rawText.length === 0) {
      base64Output.value = '';
      return;
    }

    try {
      if (isEncodingMode) {
        base64Output.value = btoa(rawText);
      } else {
        base64Output.value = atob(rawText);
      }
    } catch (error) {
      if (isEncodingMode) {
        base64Output.value = 'Error encoding text. (Contains unsupported characters)';
      } else {
        base64Output.value = 'Invalid Base64 string. Unable to decode.';
      }
    }

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(base64Output, 
        { borderColor: "#00b4db" }, 
        { borderColor: "#0d48a164", duration: 0.4 }
      );
    }
  };

  base64Input.addEventListener('input', performConversion);

  toggleBtn.addEventListener('click', () => {
    isEncodingMode = !isEncodingMode; 

    if (isEncodingMode) {
      toggleBtn.classList.remove('decode-active');
      inputLabel.textContent = 'Text (Input)';
      outputLabel.textContent = 'Base64 (Output)';
      base64Input.placeholder = 'Enter plain text to encode...';
      base64Output.placeholder = 'Encoded output...';
    } else {
      toggleBtn.classList.add('decode-active');
      inputLabel.textContent = 'Base64 (Input)';
      outputLabel.textContent = 'Text (Output)';
      base64Input.placeholder = 'Enter Base64 string to decode...';
      base64Output.placeholder = 'Decoded output...';
    }

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(toggleBtn, 
        { scale: 0.8 }, 
        { scale: 1, duration: 0.3, ease: "back.out(2)" }
      );
    }

    performConversion();
  });
});