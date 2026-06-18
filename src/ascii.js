document.addEventListener('DOMContentLoaded', () => {
  let isDecodingMode = false;

  const rowContainer = document.createElement('div');
  rowContainer.classList.add('converter-row');
  rowContainer.style.opacity = '0';

  const inputGroup = document.createElement('div');
  inputGroup.classList.add('input-group');

  const outputGroup = document.createElement('div');
  outputGroup.classList.add('input-group');

  const inputLabel = document.createElement('label');
  inputLabel.textContent = 'ASCII Codes (Input)';
  inputLabel.classList.add('box-label');

  const cipherInput = document.createElement('textarea');
  cipherInput.placeholder = 'Enter space-separated ASCII numbers (e.g., 72 105)...';
  cipherInput.classList.add('base64-input'); 
  cipherInput.rows = 6;
  cipherInput.cols = 30;

  const outputLabel = document.createElement('label');
  outputLabel.textContent = 'Text (Output)';
  outputLabel.classList.add('box-label');

  const cipherOutput = document.createElement('textarea');
  cipherOutput.placeholder = 'Decoded text output...';
  cipherOutput.classList.add('base64-output'); 
  cipherOutput.rows = 6;
  cipherOutput.cols = 30;
  cipherOutput.readOnly = true;

  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '⇄';
  toggleBtn.classList.add('toggle-btn');

  inputGroup.appendChild(inputLabel);
  inputGroup.appendChild(cipherInput);

  outputGroup.appendChild(outputLabel);
  outputGroup.appendChild(cipherOutput);

  rowContainer.appendChild(inputGroup);
  rowContainer.appendChild(toggleBtn);
  rowContainer.appendChild(outputGroup);


  const footerElement = document.querySelector('footer');

  if (footerElement) {
    footerElement.parentNode.insertBefore(rowContainer, footerElement);
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

  const textToAscii = (text) => {
    return text
      .split('')
      .map(char => char.charCodeAt(0))
      .join(' ');
  };

  const asciiToText = (asciiStr) => {
    const tokens = asciiStr.trim().split(/\s+/);
    
    return tokens
      .map(token => {
        const code = parseInt(token, 10);
        if (isNaN(code) || code < 0 || code > 65535) {
          throw new Error('Invalid code');
        }
        return String.fromCharCode(code);
      })
      .join('');
  };

  const performConversion = () => {
    const rawText = cipherInput.value;

    if (rawText.trim().length === 0) {
      cipherOutput.value = '';
      return;
    }

    try {
      if (isDecodingMode) {
        cipherOutput.value = textToAscii(rawText);
      } else {
        cipherOutput.value = asciiToText(rawText);
      }
    } catch (error) {
      cipherOutput.value = 'Malformed numeric data. Please input valid decimal numbers separated by spaces.';
    }

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(cipherOutput, 
        { borderColor: "#00b4db" }, 
        { borderColor: "#0d48a164", duration: 0.4 }
      );
    }
  };

  cipherInput.addEventListener('input', performConversion);

  toggleBtn.addEventListener('click', () => {
    isDecodingMode = !isDecodingMode;

    if (isDecodingMode) {
      toggleBtn.classList.add('decode-active');
      inputLabel.textContent = 'Text (Input)';
      outputLabel.textContent = 'ASCII Codes (Output)';
      cipherInput.placeholder = 'Enter plain text to extract values...';
      cipherOutput.placeholder = 'Decimal character codes output...';
    } else {
      toggleBtn.classList.remove('decode-active');
      inputLabel.textContent = 'ASCII Codes (Input)';
      outputLabel.textContent = 'Text (Output)';
      cipherInput.placeholder = 'Enter space-separated ASCII numbers (e.g., 72 105)...';
      cipherOutput.placeholder = 'Decoded text output...';
    }

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(toggleBtn, 
        { scale: 0.8 }, 
        { scale: 1, duration: 0.3, ease: "back.out(2)" }
      );
    }

    const currentInput = cipherInput.value;
    const currentOutput = cipherOutput.value;
    
    if (currentInput.trim().length > 0 && !currentOutput.startsWith('Malformed')) {
      cipherInput.value = currentOutput;
    }

    performConversion();
  });
});