let display = document.querySelector('.display');
let input = '0';
let newInput = true;
let newOperation = true;
let operand1 = '';
let operand2 = '';
let operator = '';
let result = 0;


// Mapping keys to operations
const operations = {
  '+': true,
  '-': true,
  '*': true,
  '/': true,
  // 'sqrt': true,
  // '%': true,
  'C': true,
  'CE': true,
};

let prevKey = '0';
let operationCount = 0;
let operandCount = 0;
let operatorCount = 0;

// Create first operation div
let operation = document.createElement('div');
operation.classList.add('operation');
operation.id = 'operation'+operationCount;
document.querySelector('.history').prepend(operation);
appendNumber(0, operationCount, 'operand-box');

function handleKeyPress(key) {
  console.log(key)
  
  if (key instanceof KeyboardEvent) {
    if (key.key == 'Enter'){
      key = '=';
    }
    else if (key.key == 'Backspace'){
      key = 'CE';
    }
    else{
      key = key.key;
    }
    updateButtonStyle(key, true);
  }

  if (key === 'C') {
    clearAll();
  } else if (key === 'CE') {
    clearEntry();
  } else if (key === '=') {
    calculateResult();
  } else if (key === 'sqrt') {
    applySqrt();
  } else if (key === '%' && operation) {
    applyPercentage();
  } else if (operations[key]) {
    applyOperator(key);
  } else if (!isNaN(parseInt(key)) || key === '.') {
    appendToInput(key);
  }
  console.log("Operation Count: " + operationCount)
  console.log("Operand Count: " + operandCount)
  console.log("Input: " + input)
  console.log("Operand1: " + operand1)
  console.log("Operator: " + operator)
  console.log("Operand2: " + operand2)
  console.log("             ")
  prevKey = key;
}

function handleKeyRelease(key) {
  if (key instanceof KeyboardEvent) {
    key = key.key === 'Enter' ? '=' : key.key;
    updateButtonStyle(key, false);
  }
}

// Helper Functions
function checkNewOperation(){
  if (newOperation){
    // Add the final result to the history before creating a new operation
    if (operationCount > 0){
      prependNumber(result, operationCount-1);
      
      // Small text to previous operation
      let prevOperation = document.getElementById('operation' + (operationCount-1));
      prevOperation.classList.add('prev-operation');
      prevOperation.classList.add('separate')

      // Create a new operation div 
      operation = document.createElement('div');
      operation.classList.add('operation');
      operation.id = 'operation'+operationCount;
      document.querySelector('.history').prepend(operation);
      // appendNumberBox(input, operationCount);
      appendNumber(input, operationCount, 'operand-box');
      newOperation = false;
    }
    
  }
}

function appendToInput(char) {

  checkNewOperation()

  if (newInput) {
    input = char;
    newInput = false;
  }
  else{
    input += char;
  }
  console.log("operation count: " + operationCount)
  setNumber(input, operandCount, 'operand-box');
  display.textContent = input;
  
}

function applyOperator(op) {

  checkNewOperation()

  if(checkIfValid()){
    if(operand1 == ''){
      operand1 = input;
      operator = op;
      newInput = true;
      setNumberStyle(operandCount, 'operand');
      appendOperator(operator, operationCount);
      appendNumber(operand1, operationCount, 'operand-box');
    }
    else if(operand2 == ''){
      operand2 = input;
      result = eval(operand1+operator+operand2);
      setNumberStyle(operandCount, 'operand');
      appendOperator(op, operationCount);
      appendNumber(result, operationCount, 'operand-box');
      operand1 = result.toString();
      operand2 = '';
      operator = op;
      // 
      display.textContent = result;
      input = result;
      newInput = true;
    }
    
  }
  else{
    setOperator(op, operatorCount-1);
    operator = op;
  }
  
}

function calculateResult() {
  if(prevKey == '=')
    return
  if(operand1 == ''){
    operand1 = input;
    result = operand1;
  }
  else if(operand2 == ''){
    operand2 = input;
    result = eval(operand1+operator+operand2);
  }
  setNumberStyle(operandCount, 'operand');
  prependOperator('=', operationCount);
  resultEffect(operatorCount);
  operand1 = '';
  operand2 = '';
  display.textContent = result;
  input = result;
  newInput = true;
  newOperation = true;
  operationCount += 1;
}

function applySqrt() {
  const sqrt = Math.sqrt(parseFloat(input));
  setNumber('√('+input+')', operandCount, 'operand-box');
  display.textContent = sqrt;
  input = sqrt;
  newInput = true;
}

// function applyPercentage() {
//   const result = eval(operation) / 100;
//   display.textContent = formatResult(result);
//   operation = result.toString();
//   input = '';
// }

function appendOperator(operator, operationNum){
    operator = mapOperators(operator);
    let op = document.createElement('div');
    op.classList.add('operator');
    op.id = 'operator' + (++operatorCount)
    op.innerText = operator;
    let operation = document.getElementById('operation' + operationNum);
    if (operation) {
        operation.appendChild(op);
        console.log("Operator appended");
    } else {
        console.log("Operation element not found");
    }
}

function prependOperator(operator, operationNum){
    operator = mapOperators(operator);
    let op = document.createElement('div');
    op.classList.add('operator');
    op.id = 'operator' + (++operatorCount);
    op.innerText = operator;
    let operation = document.getElementById('operation' + operationNum);
    if (operation) {
        operation.prepend(op);
    } else {
        console.log("Operation element not found");
    }
}

function setOperator(operator, operatorNum){
  operator = mapOperators(operator);
  let op = document.getElementById('operator' + operatorNum);
  if (op) {
      op.innerText = operator;
  } else {
      console.log("Operator element not found");
  }
}

function appendNumber(number, operationNum, style = 'operand'){
  let num = document.createElement('div');
  num.classList.add('operand');
  num.id = 'operand' + (++operandCount);
  num.innerText = number;
  num.classList.add(style);
  let operation = document.getElementById('operation' + operationNum);
  if (operation) {
      operation.appendChild(num);
  } else {
      console.log("Operation element not found");
  }
}

function prependNumber(number, operationNum){
    let num = document.createElement('div');
    num.classList.add('operand');
    num.id = 'operand' + (++operandCount);
    num.innerText = number;
    let operation = document.getElementById('operation' + operationNum);
    if (operation) {
        operation.prepend(num);
    } else {
        console.log("Operation element not found");
    }
}

function setNumber(number, operandNum, style = 'operand'){
  let num = document.getElementById('operand' + operandNum);
  if (num) {
      num.innerText = number;
      num.classList = style;
  } else {
      console.log("Number element not found");
  }
}

function setNumberStyle(operandNum, style){
  let num = document.getElementById('operand' + operandNum);
  if (num) {
      num.classList = style;
  } else {
      console.log("Number element not found");
  }
}

function resultEffect(operatorCount) {
    let container = document.querySelector('.container');
    let equal = document.getElementById('operator' + operatorCount);
    if (container && equal) {
        container.classList.toggle('shine-container');
        equal.classList.toggle('shine-equal');
    } else {
        console.log("Container or operator element not found");
    }
}


function checkIfValid(){
  console.log(prevKey)
  if (operations[prevKey]){
    return false
  }
  return true
}

function mapOperators(operator){
  switch(operator){
    case '*':
      return '×';
    case '/':
      return '÷';
    default:
      return operator;
  }
}

function formatResult(result, maxDigits = 8) {
    // If the number is large, use scientific notation
    if (Math.abs(result) >= Math.pow(10, maxDigits)) {
        return result.toExponential(3); // Display 3 decimal places in scientific notation
    }
    else if (Math.abs(result) <= Math.pow(10, -maxDigits+2)){
        return result.toExponential(3);
    }
    // Otherwise, limit the number to the specified digits
    result = result.toString();
    if (result.length > 7){
        return result.slice(0,9);
    }
    return result
  }

function updateButtonStyle(key, pressed) {
  const button = document.getElementById(key);
  if (button) {
    button.style.top = pressed ? '0px' : '2px';
    button.style.boxShadow = pressed ? '0px 3px 0px 0px rgba(0,0,0,0.1)' : 'none';
  }
}

function clearAll() {
  display.textContent = 0;
  input = '0';
  operand1 = '';
  operand2 = '';
  operator = '';
  newInput = true;
  console.log("Operation count: " + operationCount)
  document.getElementById('operation'+operationCount).innerHTML = '';
  appendNumber(0, operationCount, 'operand-box');
}

function clearEntry() {
  display.textContent = 0;
  input = '0';
  newInput = true;
  setNumber(0, operandCount, 'operand-box');
}

// Event Listeners
document.addEventListener('keydown', handleKeyRelease);
document.addEventListener('keyup', handleKeyPress);
