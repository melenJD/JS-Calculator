const wrapper = document.querySelector('.wrapper');
const input = wrapper.querySelector('input');
const btns = wrapper.getElementsByTagName('button');

const NUMBER = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const SYMBOL = ['+', '-', '*', '/'];
const SPECIAL = ['C', '=', 'Enter'];

let LAST_SYMBOL = '',
  IS_POSITIVE = true;

function getType(text) {
  if(NUMBER.indexOf(text) !== -1){
    return 'NUMBER';
  }else if(SYMBOL.indexOf(text) !== -1){
    return 'SYMBOL';
  }else if(SPECIAL.indexOf(text) !== -1){
    return 'SPECIAL';
  }else{
    return 'NOTHING';
  }
}

function calc() {
  const inputText = input.value;

  IS_POSITIVE = input.value[0] === '-' ? false : true;

  const inputArray = inputText.split(LAST_SYMBOL);

  switch(LAST_SYMBOL) {
    case '+':
      if(inputArray[1] === '')
        return parseInt(inputArray[0]);
      return parseInt(inputArray[0]) + parseInt(inputArray[1]);
    case '-':
      const temp = IS_POSITIVE ? parseInt(inputArray[0]) : parseInt(inputArray[1]) * -1;
      const lastPoint = inputText.lastIndexOf('-');
      const secondPoint = inputText.indexOf('-', 2);
      if(lastPoint === secondPoint) {
        return temp - parseInt(inputArray[inputArray.length-1]);
      }else{
        return temp - parseInt(inputArray[inputArray.length-1] * -1);
      }
    case '*':
      if(inputArray[1] === '')
        return parseInt(inputArray[0]);
      return parseInt(inputArray[0]) * parseInt(inputArray[1]);
    case '/':
      if(inputArray[1] === '')
        return parseInt(inputArray[0]);
      return parseInt(inputArray[0]) / parseInt(inputArray[1]);
  }
}

function handleSpecial(event, text, keyboard) {
  if(text === 'C') {
    input.value = '';
    LAST_SYMBOL = '';
    return;
  }
  if(keyboard && text === 'Enter' && LAST_SYMBOL !== '') {
    input.value = calc();
    LAST_SYMBOL = '';
    return;
  }
  if(!keyboard && text === '=' && LAST_SYMBOL !== '') {
    input.value = calc();
    LAST_SYMBOL = '';
    return;
  }
}

function handleSymbol(event, text) {
  const inputText = input.value;
  const lastText = inputText[inputText.length - 1];
  
  if(inputText.length === 0) { 
    if(text === '-')
      input.value += text;
    return;
  }else{
    if(text === '-') {
      const point = input.value.length;
      if(point < 2) {
        input.value = inputText.slice(0, 2);
      }else if(getType(input.value[point-1]) === 'NUMBER'){

        if(LAST_SYMBOL !== '') {
          input.value = calc();
        }

        LAST_SYMBOL = text;

        input.value += text;
      }else if(getType(input.value[point-1]) === 'SYMBOL' && getType(input.value[point-2]) === 'NUMBER'){
        input.value += text;
      }
    }else{
      if(getType(lastText) === 'SYMBOL') {
        input.value = inputText.slice(0, -1);
        if(getType(input.value[input.value.length - 1]) === 'SYMBOL') {
          input.value = input.value.slice(0, -1);
        }
      }else{
        if(LAST_SYMBOL !== '') {
          input.value = calc();
        }
      }
    
      LAST_SYMBOL = text;
    
      input.value += text;
    }
  }
}

function handleNumber(event, text) {
  if(!(input.value === '' && text === '0'))
    input.value += text;
}

function handleClick(event) {
  text = event.target.innerText;
  if(getType(text) === 'NUMBER'){ return handleNumber(event, text) };
  if(getType(text) === 'SYMBOL'){ return handleSymbol(event, text) };
  if(getType(text) === 'SPECIAL'){ return handleSpecial(event, text, false) };
}

function handleKeypress(event) {
  event.preventDefault();
  text = event.key;
  if(getType(text) === 'NUMBER'){ return handleNumber(event, text) };
  if(getType(text) === 'SYMBOL'){ return handleSymbol(event, text) };
  if(getType(text) === 'SPECIAL'){ return handleSpecial(event, text, true) };
}

function handleKeyup(event) {
  text = event.key;
  if(text === 'Backspace') {
    if(input.value === '') {
      input.value = '';
      LAST_SYMBOL = '';
    }
  }
}

function init() {
  for(let i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', handleClick);
  }

  input.addEventListener('keypress', handleKeypress);
  input.addEventListener('keyup', handleKeyup);
};

init();