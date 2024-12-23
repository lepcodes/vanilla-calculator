let display = document.querySelector('.display');
let input = '0';
let newInput = true;
let newOperation = true;
let operand1 = '';
let operand2 = '';
let operator = '';


// Mapping keys to operations
const operations = {
  '+': true,
  '-': true,
  '*': true,
  '/': true,
  'sqrt': true,
  '%': true,
  'C': true,
  'CE': true,
};

let prevKey = '0';
let operationCount = 0;

// Create first operation div
let operation = document.createElement('div');
operation.classList.add('operation');
operation.id = 'operation'+operationCount;
document.querySelector('.history').prepend(operation);

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
    // console.log("Hola" + input)
    if (operationCount > 0){
      displayHistory(input, '', operationCount-1); 

      // Create a new operation div 
      operation = document.createElement('div');
      operation.classList.add('operation');
      operation.id = 'operation'+operationCount;
      document.querySelector('.history').prepend(operation);
      newOperation = false;
    }
    
  }
}

function appendToInput(char) {

  checkNewOperation()

  if (newInput) {
    console.log("New input")
    input = char;
    newInput = false;
  }
  else{
    input += char;
  }
  display.textContent = input;
  
}

function applyOperator(op) {

  checkNewOperation()

  if(checkIfValid()){
    if(operand1 == ''){
      operand1 = input;
      operator = op;
      newInput = true;
      displayHistory(operand1, op, operationCount);
    }
    else if(operand2 == ''){
      operand2 = input;
      let result = eval(operand1+operator+operand2);
      displayHistory(operand2, op, operationCount);
      operand1 = result.toString();
      operand2 = '';
      operator = op;
      // 
      display.textContent = result;
      input = result;
      newInput = true;
    }
    
  }
  operator = op;
}

function calculateResult() {
  if(operand1 == ''){
    newInput = true;
  }
  else if(operand2 == ''){
    operand2 = input;
    let result = eval(operand1+operator+operand2);
    displayHistory(operand2, '=', operationCount);
    operand1 = '';
    operand2 = '';
    // 
    display.textContent = result;
    input = result;
    newInput = true;
    newOperation = true;
    operationCount += 1;
  }
}

function displayHistory(number, operator, count){
  operator = mapOperators(operator)
  let num = document.createElement('div');
  let op = document.createElement('div');
  num.classList.add('operand');
  op.classList.add('operand');
  num.innerText = number;
  op.innerText = operator;
  console.log("Operation count: " + count)
  document.getElementById('operation'+count).prepend(num);
  document.getElementById('operation'+count).prepend(op);
  document.getElementById('operation'+count).classList.add('separate');
  newInput = true;
  // if(operator == '='){
  //   let div = document.createElement('div');
  //   div.innerText = '------------------';
  //   document.getElementById('result').prepend(div);
  // }

  
}

function checkIfValid(){
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

// function applySqrt() {
//   const result = Math.sqrt(eval(operation) || 0);
//   display.textContent = formatResult(result);
//   operation = result.toString();
//   input = '';
// }

// function applyPercentage() {
//   const result = eval(operation) / 100;
//   display.textContent = formatResult(result);
//   operation = result.toString();
//   input = '';
// }

function clearAll() {
  display.textContent = 0;
  input = '0';
  operand1 = '';
  operand2 = '';
  operator = '';
  newInput = true;
  console.log("Operation count: " + operationCount)
  document.getElementById('operation'+operationCount).innerHTML = '';
}

function clearEntry() {
  display.textContent = 0;
  input = '0';
  newInput = true;
}

// Event Listeners
document.addEventListener('keydown', handleKeyRelease);
document.addEventListener('keyup', handleKeyPress);
