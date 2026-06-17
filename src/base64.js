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
  outputLabel.textContent = 'Base64 (Output)';
  outputLabel.classList.add('box-label');

  const base64Input = document.createElement('textarea');
  base64Input.placeholder = 'Enter plain text to encode...';
  base64Input.classList.add('base64-input');
  base64Input.rows = 6;
  base64Input.cols = 30;

  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '⇄';
  toggleBtn.classList.add('toggle-btn');

  const base64Output = document.createElement('textarea');
  base64Output.placeholder = 'Encoded output...';
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
  const allHeadings = document.querySelectorAll('h3');
  let a1z26Heading = null;

  allHeadings.forEach(heading => {
    if (heading.textContent.includes('A1Z26')) {
      a1z26Heading = heading;
    }
  });

  if (a1z26Heading) {
    document.body.insertBefore(rowContainer, a1z26Heading);
  } else {
    document.body.appendChild(rowContainer);
  }

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

    performConversion();
  });
});