document.addEventListener('DOMContentLoaded', () => {
  let isEncodingMode = false;

  const rowContainer = document.createElement('div');
  rowContainer.classList.add('converter-row');
  rowContainer.style.opacity = '0'; 
  const inputGroup = document.createElement('div');
  inputGroup.classList.add('input-group');

  const outputGroup = document.createElement('div');
  outputGroup.classList.add('input-group');

  const inputLabel = document.createElement('label');
  inputLabel.textContent = 'A1Z26 (Input)';
  inputLabel.classList.add('box-label');

  const outputLabel = document.createElement('label');
  outputLabel.textContent = 'Text (Output)';
  outputLabel.classList.add('box-label');

  const cipherInput = document.createElement('textarea');
  cipherInput.placeholder = 'Enter numbers to decode...';
  cipherInput.classList.add('base64-input');
  cipherInput.rows = 6;
  cipherInput.cols = 30;

  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '⇄';
  toggleBtn.classList.add('toggle-btn');
  toggleBtn.classList.add('decode-active');

  const cipherOutput = document.createElement('textarea');
  cipherOutput.placeholder = 'Decoded output...';
  cipherOutput.classList.add('base64-output');
  cipherOutput.rows = 6;
  cipherOutput.cols = 30;
  cipherOutput.readOnly = true;

  inputGroup.appendChild(inputLabel);
  inputGroup.appendChild(cipherInput);

  outputGroup.appendChild(outputLabel);
  outputGroup.appendChild(cipherOutput);

  rowContainer.appendChild(inputGroup);
  rowContainer.appendChild(toggleBtn);
  rowContainer.appendChild(outputGroup);

  const headers = document.querySelectorAll('.section-header');
  let nextHeader = null;

  headers.forEach(header => {
    const heading = header.querySelector('h3');
    if (heading && heading.textContent.includes('Morse Code')) {
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

  const encodeA1Z26 = (str) => {
    return str
      .toUpperCase()
      .split('')
      .map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return code - 64;
        }
        return char;
      })
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const decodeA1Z26 = (str) => {
    const tokens = str.trim().split(/\s+/);
    let result = '';
    
    for (let token of tokens) {
      const num = parseInt(token, 10);
      if (!isNaN(num) && num >= 1 && num <= 26) {
        result += String.fromCharCode(num + 64);
      } else {
        result += token;
      }
    }
    return result;
  };

  const performConversion = () => {
    const rawText = cipherInput.value;

    if (rawText.length === 0) {
      cipherOutput.value = '';
      return;
    }

    try {
      if (isEncodingMode) {
        cipherOutput.value = encodeA1Z26(rawText);
      } else {
        cipherOutput.value = decodeA1Z26(rawText);
      }
    } catch (error) {
      cipherOutput.value = 'Error processing text.';
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
    isEncodingMode = !isEncodingMode; 

    if (isEncodingMode) {
      toggleBtn.classList.remove('decode-active');
      inputLabel.textContent = 'Text (Input)';
      outputLabel.textContent = 'A1Z26 (Output)';
      cipherInput.placeholder = 'Enter plain text to encode...';
      cipherOutput.placeholder = 'Encoded output...';
    } else {
      toggleBtn.classList.add('decode-active');
      inputLabel.textContent = 'A1Z26 (Input)';
      outputLabel.textContent = 'Text (Output)';
      cipherInput.placeholder = 'Enter numbers to decode...';
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