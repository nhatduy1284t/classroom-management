import './assignment.validate.js'
import './users.validate.js'

class FormValidator {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    validateForm() {
        return this.strategy.validate;
    }
}

export default FormValidator