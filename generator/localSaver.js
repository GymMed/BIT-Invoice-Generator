$("#addPurchaseButton").on("click", function () {
    addPurchase();
});

$("#generate").on("click", function () {
    generate();
});

$("#clearStorage").on("click", function () {
    clearLocalStorage();
});

$(function () {
    getSavedData();
});

function generate() {
    for (const key in INFORMATION_ENUM) {
        const value = INFORMATION_ENUM[key];
        saveInformationType(value, getInformationOfTypeFromInput(value));
    }

    window.location.href = "../index.html";
    //console.log(getInformationOfTypeFromInput(INFORMATION_ENUM.purchases));
}

function clearLocalStorage() {
    for (const key in INFORMATION_ENUM) {
        const value = INFORMATION_ENUM[key];
        clearInformationOfTypeFromStorage(value);
    }

    window.location.reload();
}

function getSavedData() {
    for (const key in INFORMATION_ENUM) {
        const value = INFORMATION_ENUM[key];
        tryInsertSaveData(value, getInformationOfTypeFromStorage(value));
    }
}

function getInformationOfTypeFromInput(enumValue) {
    switch (enumValue) {
        case INFORMATION_ENUM.company:
            return getCompanyInformation();
        case INFORMATION_ENUM.bill:
            return getBillInformation();
        case INFORMATION_ENUM.ship:
            return getShipInformation();
        case INFORMATION_ENUM.purchases:
            return getPurchasesInformation();
        default:
            return null;
    }
}

function tryInsertSaveData(enumValue, data) {
    if (data === null || data === undefined) return false;
    switch (enumValue) {
        case INFORMATION_ENUM.company:
            insertCompanyValues(data);
            break;
        case INFORMATION_ENUM.bill:
            insertBillValues(data);
            break;
        case INFORMATION_ENUM.ship:
            insertShipValues(data);
            break;
        case INFORMATION_ENUM.purchases:
            insertPurchasesValues(data);
            break;
        default:
            break;
    }
}

function insertCompanyValues(data) {
    $("#company-name").val(data.companyName);
    $("#company-address").val(data.address);
    $("#company-post").val(data.postCode);
    $("#company-phone").val(data.phone);
    $("#company-email").val(data.email);
}

function insertBillValues(data) {
    $("#customer-name").val(data.contactName);
    $("#customer-company-name").val(data.companyName);
    $("#customer-address").val(data.address);
    $("#customer-phone").val(data.phone);
    $("#customer-email").val(data.email);
    $("#discount").val(data.discount);
}

function insertShipValues(data) {
    $("#ship-name").val(data.contactName);
    $("#ship-company-name").val(data.companyName);
    $("#ship-address").val(data.address);
    $("#ship-contact").val(data.phone);
}

function insertPurchasesValues(data) {
    const dataSize = data.length;

    if (dataSize > 0) insertPurchaseValue(0, data[0]);

    if (dataSize < 2) return;

    for (
        let currentPurchase = 1;
        currentPurchase < dataSize;
        currentPurchase++
    ) {
        addPurchase(
            data[currentPurchase].description,
            data[currentPurchase].qty,
            data[currentPurchase].unitPrice
        );
    }
}

function insertPurchaseValue(index, data) {
    $('input[name="purchase\\[description\\]"]')
        .eq(index)
        .val(data.description);
    $('input[name="purchase\\[qty\\[\\]\\]"]').eq(index).val(data.qty);
    $('input[name="purchase\\[unitPrice\\[\\]\\]"]')
        .eq(index)
        .val(data.unitPrice);
}

function addPurchase(description = "Item", qty = 0, unitPrice = "0.0") {
    let tbody = $(".purchases table tbody");
    let lastElement = tbody.find(".button-row");
    let row = getRowDom(description, qty, unitPrice);

    lastElement.before(row);
}

function getRowDom(description = "Item", qty = 0, unitPrice = "0.0") {
    let row = $("<tr>").addClass("purchase-item");

    let descriptionDom = getDescriptionDom(description);
    let qtyDom = getQtyDom(qty);
    let unitPriceDom = getUnitPriceDom(unitPrice);
    let deleteButtonDom = getDeleteDom();

    row.append(descriptionDom, qtyDom, unitPriceDom, deleteButtonDom);
    return row;
}

function getDeleteDom() {
    let deleteDom = $("<td>").addClass("p-2");
    let button = getDeleteButtonDom();

    deleteDom.append(button);
    return deleteDom;
}

function getDescriptionDom(value) {
    let descriptionDom = $("<td>").addClass("p-2");
    let input = getPurchaseInput("description", value);

    descriptionDom.append(input);
    return descriptionDom;
}

function getQtyDom(value) {
    let qtyDom = $("<td>").addClass("p-2");
    let input = getPurchaseInput("qty", value);

    qtyDom.append(input);
    return qtyDom;
}

function getUnitPriceDom(value) {
    let unitPriceDom = $("<td>").addClass("p-2");
    let input = getPurchaseInput("unitPrice", value);

    unitPriceDom.append(input);
    return unitPriceDom;
}

function getPurchaseInput(attribute, value = "Item") {
    let input = $("<input>");

    input.attr("type", "text");
    input.attr("name", "purchase[" + attribute + "[]]");
    input.val(value);

    input.addClass(
        "px-4 py-2 border-gray-400 rounded-md focus:border-gray-400 focus:ring focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white block w-full"
    );

    return input;
}

function getDeleteButtonDom() {
    let button = $("<button>");

    button.attr("type", "button");
    button.addClass(
        "w-full inline-flex items-center justify-center transition-colors font-medium select-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-eval-2 px-4 py-2 text-base bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:bg-blue-600 focus:ring-blue-500 rounded-md"
    );

    button.text("Delete");

    button.on("click", function () {
        $(this).closest("tr").remove();
    });

    return button;
}

function getCompanyInformation() {
    return new CompanyInformation(
        $("#company-name").val(),
        $("#company-address").val(),
        $("#company-post").val(),
        $("#company-phone").val(),
        $("#company-email").val(),
        "20230802"
    );
}

function getBillInformation() {
    return new BillInformation(
        $("#customer-name").val(),
        $("#customer-company-name").val(),
        $("#customer-address").val(),
        $("#customer-phone").val(),
        $("#customer-email").val(),
        $("#discount").val()
    );
}

function getShipInformation() {
    return new ShipInformation(
        $("#ship-name").val(),
        $("#ship-company-name").val(),
        $("#ship-address").val(),
        $("#ship-contact").val()
    );
}

function getPurchaseInformation(index) {
    return new Purchase(
        $('input[name="purchase\\[description\\[\\]\\]"]').eq(index).val(),
        $('input[name="purchase\\[qty\\[\\]\\]"]').eq(index).val(),
        $('input[name="purchase\\[unitPrice\\[\\]\\]"]').eq(index).val()
    );
}

function getPurchasesInformation() {
    const purchasesCount = $(
        'input[name="purchase\\[description\\[\\]\\]"]'
    ).length;
    let purchases = [];

    for (
        let currentPurchase = 0;
        currentPurchase < purchasesCount;
        currentPurchase++
    ) {
        purchases.push(getPurchaseInformation(currentPurchase));
    }

    return purchases;
}
