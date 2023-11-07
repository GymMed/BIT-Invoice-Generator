class Purchase {
    constructor(description, qty, unitPrice) {
        this.description = description;
        this.qty = qty;
        this.unitPrice = unitPrice;
    }

    getTotal() {
        if (
            !this.isValidNumber(this.qty) ||
            !this.isValidNumber(this.unitPrice)
        )
            return "0.00";

        return parseFloat(this.qty) * parseFloat(this.unitPrice);
    }

    isValidNumber(variable) {
        if (
            variable === undefined ||
            variable === null ||
            isNaN(parseFloat(variable))
        ) {
            return false;
        }

        return true;
    }
}
