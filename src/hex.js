document.addEventListener('DOMContentLoaded', () => {
  let isDecodingMode = false;

  const rowContainer = document.createElement('div');
  rowContainer.classList.add('converter-row');
  rowContainer.style.opacity = '0';

  const inputGroup = document.createElement('div');
  inputGroup.classList.add('input-group');

  const controlGroup = document.createElement('div');
  controlGroup.classList.add('control-group');
  controlGroup.style.display = 'flex';
  controlGroup.style.flexDirection = 'column';
  controlGroup.style.alignItems = 'center';
  controlGroup.style.gap = '10px';

  const outputGroup = document.createElement('div');
  outputGroup.classList.add('input-group');

  const inputHeaderDiv = document.createElement('div');
  inputHeaderDiv.style.display = 'flex';
  inputHeaderDiv.style.justifyContent = 'space-between';
  inputHeaderDiv.style.alignItems = 'center';
  inputHeaderDiv.style.marginBottom = '5px';

  const inputLabel = document.createElement('label');
  inputLabel.textContent = 'Encoded (Input)';
  inputLabel.classList.add('box-label');
  inputLabel.style.margin = '0';

  const modeSelect = document.createElement('select');
  modeSelect.classList.add('format-selector');

  const optBinary = document.createElement('option');
  optBinary.value = 'binary';
  optBinary.textContent = 'Binary (Base 2)';
  
  const optHex = document.createElement('option');
  optHex.value = 'hex';
  optHex.textContent = 'Hexadecimal (Base 16)';

  modeSelect.appendChild(optBinary);
  modeSelect.appendChild(optHex);
  inputHeaderDiv.appendChild(inputLabel);
  inputHeaderDiv.appendChild(modeSelect);

  const cipherInput = document.createElement('textarea');
  cipherInput.placeholder = 'Enter space-separated binary bits (e.g., 01001000 01001001)...';
  cipherInput.classList.add('base64-input'); 
  cipherInput.rows = 6;
  cipherInput.cols = 30;

  const outputLabel = document.createElement('label');
  outputLabel.textContent = 'Text (Output)';
  outputLabel.classList.add('box-label');

  const cipherOutput = document.createElement('textarea');
  cipherOutput.placeholder = 'Decoded string output...';
  cipherOutput.classList.add('base64-output'); 
  cipherOutput.rows = 6;
  cipherOutput.cols = 30;
  cipherOutput.readOnly = true;

  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '⇄';
  toggleBtn.classList.add('toggle-btn');


  inputGroup.appendChild(inputHeaderDiv);
  inputGroup.appendChild(cipherInput);

  controlGroup.appendChild(toggleBtn);

  outputGroup.appendChild(outputLabel);
  outputGroup.appendChild(cipherOutput);

  rowContainer.appendChild(inputGroup);
  rowContainer.appendChild(controlGroup);
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

  const textToBinary = (str) => {
    return str
      .split('')
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');
  };

  const binaryToText = (binStr) => {
    const segments = binStr.trim().split(/\s+/);
    return segments
      .map(segment => {
        if (/[^01]/.test(segment)) throw new Error('Not binary');
        const code = parseInt(segment, 2);
        if (isNaN(code)) throw new Error('Parsing error');
        return String.fromCharCode(code);
      })
      .join('');
  };

  const textToHex = (str) => {
    return str
      .split('')
      .map(char => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'))
      .join(' ');
  };

  const hexToText = (hexStr) => {
    const cleanHex = hexStr.replace(/(0x|\\x)/gi, ' ');
    const segments = cleanHex.trim().split(/\s+/);
    return segments
      .map(segment => {
        if (/[^0-9A-Fa-f]/.test(segment)) throw new Error('Not hex');
        const code = parseInt(segment, 16);
        if (isNaN(code)) throw new Error('Parsing error');
        return String.fromCharCode(code);
      })
      .join('');
  };

  const performConversion = () => {
    const rawText = cipherInput.value;
    const selectedFormat = modeSelect.value;

    if (rawText.trim().length === 0) {
      cipherOutput.value = '';
      return;
    }

    try {
      if (isDecodingMode) {
        cipherOutput.value = selectedFormat === 'binary' ? textToBinary(rawText) : textToHex(rawText);
      } else {
        cipherOutput.value = selectedFormat === 'binary' ? binaryToText(rawText) : hexToText(rawText);
      }
    } catch (error) {
      cipherOutput.value = selectedFormat === 'binary' 
        ? 'Malformed data. Please output valid 8-bit strings containing only 0s and 1s separated by spaces.'
        : 'Malformed data. Please output valid hexadecimal pairs (0-9, A-F) separated by spaces.';
    }

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(cipherOutput, 
        { borderColor: "#00b4db" }, 
        { borderColor: "#0d48a164", duration: 0.4 }
      );
    }
  };

  cipherInput.addEventListener('input', performConversion);
  modeSelect.addEventListener('change', () => {
    if (!isDecodingMode) {
      cipherInput.placeholder = modeSelect.value === 'binary'
        ? 'Enter space-separated binary bits (e.g., 01001000 01001001)...'
        : 'Enter space-separated hex bytes (e.g., 48 49)...';
    }
    performConversion();
  });

  toggleBtn.addEventListener('click', () => {
    isDecodingMode = !isDecodingMode;

    if (isDecodingMode) {
      toggleBtn.classList.add('decode-active');
      inputLabel.textContent = 'Text (Input)';
      outputLabel.textContent = modeSelect.value === 'binary' ? 'Binary (Output)' : 'Hex (Output)';
      cipherInput.placeholder = 'Enter plain text letters to convert...';
      cipherOutput.placeholder = 'Numerical system track output...';
    } else {
      toggleBtn.classList.remove('decode-active');
      inputLabel.textContent = 'Encoded (Input)';
      outputLabel.textContent = 'Text (Output)';
      cipherInput.placeholder = modeSelect.value === 'binary'
        ? 'Enter space-separated binary bits (e.g., 01001000 01001001)...'
        : 'Enter space-separated hex bytes (e.g., 48 49)...';
      cipherOutput.placeholder = 'Decoded string output...';
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