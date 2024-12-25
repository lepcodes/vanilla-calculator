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
  'sqrt': true,
  '%': true,
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
appendNumberBox(0, operationCount);

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
      prependNumber(result, operandCount++, operationCount-1);
      
      // Small text to previous operation
      let prevOperation = document.getElementById('operation' + (operationCount-1));
      prevOperation.classList.add('prev-operation');
      prevOperation.classList.add('separate')

      // Create a new operation div 
      operation = document.createElement('div');
      operation.classList.add('operation');
      operation.id = 'operation'+operationCount;
      document.querySelector('.history').prepend(operation);
      appendNumberBox(input, operationCount);
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
  changeNumberBox(input, operationCount);
  display.textContent = input;
  
}

function applyOperator(op) {

  checkNewOperation()

  if(checkIfValid()){
    if(operand1 == ''){
      operand1 = input;
      operator = op;
      newInput = true;
      removeNumberBox(operationCount);
      appendNumber(operand1, operandCount++, operationCount);
      appendOperator(operator, operatorCount++, operationCount);
      appendNumberBox(operand1, operationCount);
    }
    else if(operand2 == ''){
      operand2 = input;
      result = eval(operand1+operator+operand2);
      removeNumberBox(operationCount);
      appendNumber(operand2, operandCount++, operationCount);
      appendOperator(op, operatorCount++, operationCount);
      appendNumberBox(result, operationCount);
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
    changeOperator(op, operatorCount-1);
    operator = op;
  }
  
}

function calculateResult() {
  if(operand1 == ''){
    newInput = true;
  }
  else if(operand2 == ''){
    operand2 = input;
    result = eval(operand1+operator+operand2);
    removeNumberBox(operationCount);
    prependOperator('=', operatorCount++, operationCount);
    appendNumber(operand2, operandCount++, operationCount);
    resultEffect(operatorCount-1);
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

function appendOperator(operator, operatorNum, operationNum){
  operator = mapOperators(operator)
  let op = document.createElement('div');
  op.classList.add('operator');
  op.id = 'operator' + operatorNum;
  op.innerText = operator;
  document.getElementById('operation' + operationNum).appendChild(op);
  console.log("operator appended")
}

function appendNumber(number, operandNum, operationNum){
  let num = document.createElement('div');
  num.classList.add('operand');
  num.id = 'operand' + operandNum;
  num.innerText = number;
  document.getElementById('operation' + operationNum).appendChild(num);
}

function prependOperator(operator, operatorNum, operationNum){
  operator = mapOperators(operator)
  let op = document.createElement('div');
  op.classList.add('operator');
  op.id = 'operator' + operatorNum;
  // op.style.color = (operator == '=') ? 'green' : 'gray';
  op.innerText = operator;
  document.getElementById('operation' + operationNum).prepend(op);
}

function prependNumber(number, operandNum, operationNum){
  let num = document.createElement('div');
  num.classList.add('operand');
  num.id = 'operand' + operandNum;
  num.innerText = number;
  document.getElementById('operation' + operationNum).prepend(num);
}

function changeOperator(operator, operatorNum){
  operator = mapOperators(operator)
  document.getElementById('operator' + operatorNum).innerText = operator;
}

function appendNumberBox(number, operationNum){
  let numBox = document.createElement('div');
  numBox.classList.add('number-box');
  numBox.id = 'number-box' + operationNum;
  numBox.innerText = number;
  document.getElementById('operation' + operationNum).appendChild(numBox);
}

function changeNumberBox(number, operationNum){
  document.getElementById('number-box' + operationNum).innerText = number;
}

function removeNumberBox(operationNum){
  document.getElementById('number-box' + operationNum).remove();
}

function resultEffect(operatorCount){
  let container = document.querySelector('.container');
  console.log("Holalaaaaa"+operatorCount)
  let equal = document.getElementById('operator' + operatorCount);
  container.classList.toggle('shine-container');
  equal.classList.toggle('shine-equal');
  // container.classList.remove('shine');
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
  appendNumberBox(0, operationCount);
}

function clearEntry() {
  display.textContent = 0;
  input = '0';
  newInput = true;
  changeNumberBox(0, operationCount);
}

// Event Listeners
document.addEventListener('keydown', handleKeyRelease);
document.addEventListener('keyup', handleKeyPress);
