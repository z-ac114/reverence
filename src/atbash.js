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
  inputLabel.textContent = 'Atbash (Input)';
  inputLabel.classList.add('box-label');

  const cipherInput = document.createElement('textarea');
  cipherInput.placeholder = 'Enter Atbash code to reverse...';
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

  const headers = document.querySelectorAll('.section-header');
  let nextHeader = null;

  headers.forEach(header => {
    const heading = header.querySelector('h3');
    if (heading && heading.textContent.includes('Vigenère')) {
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

  const applyAtbash = (str) => {
    return str
      .split('')
      .map(char => {
        const code = char.charCodeAt(0);
        
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(90 - (code - 65));
        }
        
        if (code >= 97 && code <= 122) {
          return String.fromCharCode(122 - (code - 97));
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
      cipherOutput.value = applyAtbash(rawText);
    } catch (error) {
      cipherOutput.value = 'Error applying Atbash.';
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
      outputLabel.textContent = 'Atbash (Output)';
      cipherInput.placeholder = 'Enter text to transform...';
      cipherOutput.placeholder = 'Atbash transformation...';
    } else {
      toggleBtn.classList.remove('decode-active');
      inputLabel.textContent = 'Atbash (Input)';
      outputLabel.textContent = 'Text (Output)';
      cipherInput.placeholder = 'Enter Atbash code to reverse...';
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