document.addEventListener('DOMContentLoaded', () => {
  let isEncodingMode = true;

  const morseAlphabet = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
    '9': '----.', '0': '-----', ' ': '/', ".": '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
  };

  const decodeAlphabet = Object.fromEntries(
    Object.entries(morseAlphabet).map(([key, value]) => [value, key])
  );

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
  outputLabel.textContent = 'Morse Code (Output)';
  outputLabel.classList.add('box-label');

  const morseInput = document.createElement('textarea');
  morseInput.placeholder = 'Enter text to encode...';
  morseInput.classList.add('base64-input');
  morseInput.rows = 6;
  morseInput.cols = 30;

  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '⇄';
  toggleBtn.classList.add('toggle-btn');

  const morseOutput = document.createElement('textarea');
  morseOutput.placeholder = 'Encoded output...';
  morseOutput.classList.add('base64-output');
  morseOutput.rows = 6;
  morseOutput.cols = 30;
  morseOutput.readOnly = true;
  
  inputGroup.appendChild(inputLabel);
  inputGroup.appendChild(morseInput);

  outputGroup.appendChild(outputLabel);
  outputGroup.appendChild(morseOutput);

  rowContainer.appendChild(inputGroup);
  rowContainer.appendChild(toggleBtn);
  rowContainer.appendChild(outputGroup);

  document.body.appendChild(rowContainer);

  const encodeMorse = (str) => {
    return str
      .toUpperCase()
      .split('')
      .map(char => morseAlphabet[char] || char)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const decodeMorse = (str) => {
    return str
      .trim()
      .split(/\s+/)
      .map(char => decodeAlphabet[char] || char)
      .join('')
      .replace(/\s*\/\s*/g, ' ');
  };

  const performConversion = () => {
    const rawText = morseInput.value;

    if (rawText.length === 0) {
      morseOutput.value = '';
      return;
    }

    try {
      if (isEncodingMode) {
        morseOutput.value = encodeMorse(rawText);
      } else {
        morseOutput.value = decodeMorse(rawText);
      }
    } catch (error) {
      morseOutput.value = 'Error processing Morse Code.';
    }
  };

  morseInput.addEventListener('input', performConversion);

  toggleBtn.addEventListener('click', () => {
    isEncodingMode = !isEncodingMode; 

    if (isEncodingMode) {
      toggleBtn.classList.remove('decode-active');
      inputLabel.textContent = 'Text (Input)';
      outputLabel.textContent = 'Morse Code (Output)';
      morseInput.placeholder = 'Enter text to encode...';
      morseOutput.placeholder = 'Encoded output...';
    } else {
      toggleBtn.classList.add('decode-active');
      inputLabel.textContent = 'Morse Code (Input)';
      outputLabel.textContent = 'Text (Output)';
      morseInput.placeholder = 'Enter Morse code to decode...';
      morseOutput.placeholder = 'Decoded output...';
    }

    performConversion();
  });
});