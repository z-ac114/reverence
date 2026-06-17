document.addEventListener('DOMContentLoaded', () => {
  let isEncodingMode = false;

  const rowContainer = document.createElement('div');
  rowContainer.classList.add('converter-row');
  rowContainer.style.opacity = '0';

  const inputGroup = document.createElement('div');
  inputGroup.classList.add('input-group');

  const controlGroup = document.createElement('div');
  controlGroup.classList.add('input-group');
  controlGroup.style.alignItems = 'center';
  controlGroup.style.justifyContent = 'center';

  const outputGroup = document.createElement('div');
  outputGroup.classList.add('input-group');

  const inputLabel = document.createElement('label');
  inputLabel.textContent = 'Caesar (Input)';
  inputLabel.classList.add('box-label');

  const outputLabel = document.createElement('label');
  outputLabel.textContent = 'Text (Output)';
  outputLabel.classList.add('box-label');

  const cipherInput = document.createElement('textarea');
  cipherInput.placeholder = 'Enter text to decode...';
  cipherInput.classList.add('base64-input');
  cipherInput.rows = 6;
  cipherInput.cols = 30;

  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '⇄';
  toggleBtn.classList.add('toggle-btn');
  toggleBtn.classList.add('decode-active');

  const shiftLabel = document.createElement('label');
  shiftLabel.textContent = 'Shift';
  shiftLabel.classList.add('box-label');

  const shiftInput = document.createElement('input');
  shiftInput.type = 'number';
  shiftInput.value = '3'; 
  shiftInput.min = '1';
  shiftInput.max = '25';
  shiftInput.classList.add('base64-input'); 
  shiftInput.style.width = '70px';
  shiftInput.style.height = '40px';
  shiftInput.style.textAlign = 'center';
  shiftInput.style.padding = '0';
  shiftInput.style.marginTop = '10px';

  const cipherOutput = document.createElement('textarea');
  cipherOutput.placeholder = 'Decoded output...';
  cipherOutput.classList.add('base64-output');
  cipherOutput.rows = 6;
  cipherOutput.cols = 30;
  cipherOutput.readOnly = true;

  inputGroup.appendChild(inputLabel);
  inputGroup.appendChild(cipherInput);

  controlGroup.appendChild(shiftLabel);
  controlGroup.appendChild(toggleBtn);
  controlGroup.appendChild(shiftInput);

  outputGroup.appendChild(outputLabel);
  outputGroup.appendChild(cipherOutput);

  rowContainer.appendChild(inputGroup);
  rowContainer.appendChild(controlGroup);
  rowContainer.appendChild(outputGroup);

  const headers = document.querySelectorAll('.section-header');
  let nextHeader = null;

  headers.forEach(header => {
    const heading = header.querySelector('h3');
    if (heading && heading.textContent.includes('ROT13')) {
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

  const caesarCipher = (str, shift) => {
    return str
      .split('')
      .map(char => {
        const code = char.charCodeAt(0);
        
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65);
        }
        
        if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97);
        }
        
        return char;
      })
      .join('');
  };

  const performConversion = () => {
    const rawText = cipherInput.value;
    let shiftValue = parseInt(shiftInput.value, 10) || 0;

    if (rawText.length === 0) {
      cipherOutput.value = '';
      return;
    }

    if (!isEncodingMode) {
      shiftValue = -shiftValue;
    }

    try {
      cipherOutput.value = caesarCipher(rawText, shiftValue);
    } catch (error) {
      cipherOutput.value = 'Error processing Caesar cipher.';
    }

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(cipherOutput, 
        { borderColor: "#00b4db" }, 
        { borderColor: "#0d48a164", duration: 0.4 }
      );
    }
  };

  cipherInput.addEventListener('input', performConversion);
  shiftInput.addEventListener('input', performConversion);

  toggleBtn.addEventListener('click', () => {
    isEncodingMode = !isEncodingMode; 

    if (isEncodingMode) {
      toggleBtn.classList.remove('decode-active');
      inputLabel.textContent = 'Text (Input)';
      outputLabel.textContent = 'Caesar (Output)';
      cipherInput.placeholder = 'Enter plain text to encode...';
      cipherOutput.placeholder = 'Encoded output...';
    } else {
      toggleBtn.classList.add('decode-active');
      inputLabel.textContent = 'Caesar (Input)';
      outputLabel.textContent = 'Text (Output)';
      cipherInput.placeholder = 'Enter text to decode...';
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