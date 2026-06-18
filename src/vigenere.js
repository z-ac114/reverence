document.addEventListener('DOMContentLoaded', () => {
  let isDecodingMode = false;

  const rowContainer = document.createElement('div');
  rowContainer.classList.add('converter-row2');
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

  const inputLabel = document.createElement('label');
  inputLabel.textContent = 'Vigenère (Input)';
  inputLabel.classList.add('box-label');

  const cipherInput = document.createElement('textarea');
  cipherInput.placeholder = 'Enter Vigenère code to decrypt...';
  cipherInput.classList.add('base64-input'); 
  cipherInput.rows = 6;
  cipherInput.cols = 25;

  const keyLabel = document.createElement('label');
  keyLabel.textContent = 'Secret Key';
  keyLabel.classList.add('box-label');
  keyLabel.style.fontSize = '0.85rem';

  const keyInput = document.createElement('input');
  keyInput.type = 'text';
  keyInput.placeholder = 'e.g. key';
  keyInput.classList.add('vigenere-key-input');
  keyInput.style.width = '80px';
  keyInput.style.height = '40px';
  keyInput.style.padding = '8px';
  keyInput.style.borderRadius = '4px';
  keyInput.style.border = '1px solid #0d48a164';
  keyInput.style.textAlign = 'center';
  keyInput.style.textTransform = 'lowercase';

  const outputLabel = document.createElement('label');
  outputLabel.textContent = 'Text (Output)';
  outputLabel.classList.add('box-label');

  const cipherOutput = document.createElement('textarea');
  cipherOutput.placeholder = 'Decoded output...';
  cipherOutput.classList.add('base64-output'); 
  cipherOutput.rows = 6;
  cipherOutput.cols = 25;
  cipherOutput.readOnly = true;

  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '⇄';
  toggleBtn.classList.add('toggle-btn');

  inputGroup.appendChild(inputLabel);
  inputGroup.appendChild(cipherInput);

  controlGroup.appendChild(toggleBtn);
  controlGroup.appendChild(keyLabel);
  controlGroup.appendChild(keyInput);

  outputGroup.appendChild(outputLabel);
  outputGroup.appendChild(cipherOutput);

  rowContainer.appendChild(inputGroup);
  rowContainer.appendChild(controlGroup);
  rowContainer.appendChild(outputGroup);

  const headers = document.querySelectorAll('.section-header');
  let nextHeader = null;

  headers.forEach(header => {
    const heading = header.querySelector('h3');
    if (heading && heading.textContent.includes('ASCII')) {
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

  const applyVigenere = (str, key, decode = false) => {
    if (!key) return str;
    let keyIndex = 0;
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    if (cleanKey.length === 0) return str;

    return str
      .split('')
      .map(char => {
        const code = char.charCodeAt(0);
        let isUpper = code >= 65 && code <= 90;
        let isLower = code >= 97 && code <= 122;

        if (isUpper || isLower) {
          const base = isUpper ? 65 : 97;
          const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
          
          const directionShift = decode ? (26 - shift) : shift;
          
          keyIndex++; 
          
          return String.fromCharCode(((code - base + directionShift) % 26) + base);
        }
        
        return char;
      })
      .join('');
  };

  const performConversion = () => {
    const rawText = cipherInput.value;
    const secretKey = keyInput.value;

    if (rawText.length === 0) {
      cipherOutput.value = '';
      return;
    }

    try {
      cipherOutput.value = applyVigenere(rawText, secretKey, isDecodingMode);
    } catch (error) {
      cipherOutput.value = 'Error applying Vigenère cipher.';
    }

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(cipherOutput, 
        { borderColor: "#00b4db" }, 
        { borderColor: "#0d48a164", duration: 0.4 }
      );
    }
  };

  cipherInput.addEventListener('input', performConversion);
  keyInput.addEventListener('input', performConversion);

  toggleBtn.addEventListener('click', () => {
    isDecodingMode = !isDecodingMode;

    if (isDecodingMode) {
      toggleBtn.classList.add('decode-active');
      inputLabel.textContent = 'Text (Input)';
      outputLabel.textContent = 'Vigenère (Output)';
      cipherInput.placeholder = 'Enter plain text to encrypt...';
      cipherOutput.placeholder = 'Vigenère encryption output...';
    } else {
      toggleBtn.classList.remove('decode-active');
      inputLabel.textContent = 'Vigenère (Input)';
      outputLabel.textContent = 'Text (Output)';
      cipherInput.placeholder = 'Enter Vigenère code to decrypt...';
      cipherOutput.placeholder = 'Decoded output...';
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