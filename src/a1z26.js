document.addEventListener('DOMContentLoaded', () => {
  let isEncodingMode = false;

  const rowContainer = document.createElement('div');
  rowContainer.classList.add('converter-row');

  const inputGroup = document.createElement('div');
  inputGroup.classList.add('input-group');

  const outputGroup = document.createElement('div');
  outputGroup.classList.add('input-group');

  const inputLabel = document.createElement('label');
  inputLabel.textContent = 'Text (Input)';
  inputLabel.classList.add('box-label');

  const outputLabel = document.createElement('label');
  outputLabel.textContent = 'Numbers (Output)';
  outputLabel.classList.add('box-label');

  const cipherInput = document.createElement('textarea');
  cipherInput.placeholder = 'Enter plain text to encode...';
  cipherInput.classList.add('base64-input');
  cipherInput.rows = 6;
  cipherInput.cols = 30;

  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '⇄';
  toggleBtn.classList.add('toggle-btn');

  const cipherOutput = document.createElement('textarea');
  cipherOutput.placeholder = 'Encoded output...';
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

  document.body.appendChild(rowContainer);

  const allHeadings = document.querySelectorAll('h3');
  let morseHeading = null;

  allHeadings.forEach(heading => {
    if (heading.textContent.includes('Morse')) {
      morseHeading = heading;
    }
  });

  if (morseHeading) {
    document.body.insertBefore(rowContainer, morseHeading);
  } else {
    document.body.appendChild(rowContainer);
  }

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

    performConversion();
  });
});