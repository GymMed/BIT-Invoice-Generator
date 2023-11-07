class BillInformation {
    constructor(contactName, companyName, address, phone, email, discount = 0) {
        this.contactName = contactName;
        this.companyName = companyName;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.discount = discount;
    }

    getContacts() {
        if (!this.isValidString(this.phone) || !this.isValidString(this.email))
            return "Phone, Email";

        return this.phone + ", " + this.email;
    }

    isValidString(variable) {
        if (
            variable === undefined ||
            variable === null ||
            typeof variable !== "string" ||
            !variable instanceof String
        ) {
            return false;
        }

        return true;
    }
}
