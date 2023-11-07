const prefix = "__";
const INFORMATION_ENUM = {
    company: 0,
    bill: 1,
    ship: 2,
    purchases: 3,
};

const informationNames = [
    "companyInformation",
    "billInformation",
    "shipInformation",
    "purchasesInformation",
];

function saveInformationType(enumValue, data) {
    localStorage.setItem(
        prefix + informationNames[enumValue],
        JSON.stringify(data)
    );
}

function getInformationOfTypeFromStorage(enumValue) {
    return JSON.parse(
        localStorage.getItem(prefix + informationNames[enumValue])
    );
}

function clearInformationOfTypeFromStorage(enumValue) {
    localStorage.removeItem(prefix + informationNames[enumValue]);
}

function formatPrice(value) {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2 });
}
