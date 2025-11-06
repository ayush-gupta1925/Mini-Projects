class Calculator {
    constructor() {
        this.previousOperandElement = document.getElementById('previous-operand');
        this.currentOperandElement = document.getElementById('current-operand');
        this.clear();
        this.setupEventListeners();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.calculate();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }

        this.currentOperand = this.roundResult(computation).toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    calculatePercentage() {
        if (this.currentOperand === '') return;
        const current = parseFloat(this.currentOperand);
        this.currentOperand = (current / 100).toString();
    }

    roundResult(number) {
        return Math.round(number * 100000000) / 100000000;
    }

    getDisplayNumber(number) {
        if (number === '') return '';
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            this.previousOperandElement.textContent = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }

    setupEventListeners() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.getAttribute('data-number'));
                this.updateDisplay();
                this.addButtonPressEffect(button);
            });
        });

        // Operation buttons
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                
                switch (action) {
                    case 'clear':
                        this.clear();
                        break;
                    case 'delete':
                        this.delete();
                        break;
                    case 'percentage':
                        this.calculatePercentage();
                        break;
                    case 'calculate':
                        this.calculate();
                        break;
                    case 'add':
                    case 'subtract':
                    case 'multiply':
                    case 'divide':
                        this.chooseOperation(this.getOperationSymbol(action));
                        break;
                }
                
                this.updateDisplay();
                this.addButtonPressEffect(button);
            });
        });

        // Keyboard support
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardInput(event);
        });
    }

    getOperationSymbol(action) {
        switch (action) {
            case 'add': return '+';
            case 'subtract': return '-';
            case 'multiply': return '×';
            case 'divide': return '÷';
            default: return '';
        }
    }

    handleKeyboardInput(event) {
        if (event.key >= '0' && event.key <= '9') {
            this.appendNumber(event.key);
            this.updateDisplay();
        } else if (event.key === '.') {
            this.appendNumber('.');
            this.updateDisplay();
        } else if (event.key === '+' || event.key === '-') {
            this.chooseOperation(event.key);
            this.updateDisplay();
        } else if (event.key === '*') {
            this.chooseOperation('×');
            this.updateDisplay();
        } else if (event.key === '/') {
            event.preventDefault();
            this.chooseOperation('÷');
            this.updateDisplay();
        } else if (event.key === 'Enter' || event.key === '=') {
            this.calculate();
            this.updateDisplay();
        } else if (event.key === 'Escape' || event.key === 'Delete') {
            this.clear();
            this.updateDisplay();
        } else if (event.key === 'Backspace') {
            this.delete();
            this.updateDisplay();
        } else if (event.key === '%') {
            this.calculatePercentage();
            this.updateDisplay();
        }
    }

    addButtonPressEffect(button) {
        button.classList.add('pressed');
        setTimeout(() => {
            button.classList.remove('pressed');
        }, 100);
    }
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
    calculator.updateDisplay();
});