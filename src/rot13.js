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
  inputLabel.textContent = 'ROT13 (Input)';
  inputLabel.classList.add('box-label');

  const cipherInput = document.createElement('textarea');
  cipherInput.placeholder = 'Enter ROT13 code to reverse...';
  cipherInput.classList.add('base64-input'); 
  cipherInput.rows = 6;
  cipherInput.cols = 30;

  const outputLabel = document.createElement('label');
  outputLabel.textContent = 'Text (Output)';
  outputLabel.classList.add('box-label');

  const cipherOutput = document.createElement('textarea');
  cipherOutput.placeholder = 'Decoded output...';
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

  const footer = document.querySelector('.footer-container');
  if (footer) {
    document.body.insertBefore(rowContainer, footer);
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

  const applyROT13 = (str) => {
    return str
      .split('')
      .map(char => {
        const code = char.charCodeAt(0);
        
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + 13) % 26) + 65);
        }
        
        if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 + 13) % 26) + 97);
        }
        
        return char;
      })
      .join('');
  };

  const performConversion = () => {
    const rawText = cipherInput.value;

    if (rawText.length === 0) {
      cipherOutput.value = '';
      return;
    }

    try {
      cipherOutput.value = applyROT13(rawText);
    } catch (error) {
      cipherOutput.value = 'Error applying ROT13.';
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
      outputLabel.textContent = 'ROT13 (Output)';
      cipherInput.placeholder = 'Enter text to transform...';
      cipherOutput.placeholder = 'ROT13 transformation...';
    } else {
      toggleBtn.classList.remove('decode-active');
      inputLabel.textContent = 'ROT13 (Input)';
      outputLabel.textContent = 'Text (Output)';
      cipherInput.placeholder = 'Enter ROT13 code to reverse...';
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