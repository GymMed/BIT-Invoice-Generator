insertData();

function insertData() {
    let data = [];
    let optional = 0;

    for (const key in INFORMATION_ENUM) {
        const value = INFORMATION_ENUM[key];
        data = getInformationOfTypeFromStorageCaster(value);

        if (data === null || data === undefined) {
            data = getDefaultData(value);
        }

        if (value == INFORMATION_ENUM.bill) optional = data;
        setData(value, data, optional);
    }
}

function getInformationOfTypeFromStorageCaster(enumValue) {
    switch (enumValue) {
        case INFORMATION_ENUM.company:
        case INFORMATION_ENUM.ship:
            return getInformationOfTypeFromStorage(enumValue);
        case INFORMATION_ENUM.bill: {
            let data = getInformationOfTypeFromStorage(enumValue);

            if (data === null || data === undefined) return null;

            let billInformation = new BillInformation(
                data.contactName,
                data.companyName,
                data.address,
                data.phone,
                data.email,
                data.discount
            );

            return billInformation;
        }
        case INFORMATION_ENUM.purchases: {
            let data = getInformationOfTypeFromStorage(enumValue);
            let fixedCast = [];

            if (data === null || data === undefined) return null;

            data.forEach((element) => {
                let fixedElement = new Purchase(
                    element.description,
                    element.qty,
                    element.unitPrice
                );

                fixedCast.push(fixedElement);
            });

            return fixedCast;
        }
        default:
            return null;
    }
}

function setData(enumValue, data, optional) {
    switch (enumValue) {
        case INFORMATION_ENUM.company:
            {
                setCompanyInformation(
                    data.companyName,
                    data.address,
                    data.postCode,
                    data.phone,
                    data.email
                );
                showDate(data.date);
            }
            break;
        case INFORMATION_ENUM.bill:
            setBillInformation(
                data.contactName,
                data.companyName,
                data.address,
                data.getContacts()
            );
            break;
        case INFORMATION_ENUM.ship:
            setShipInformation(
                data.contactName,
                data.companyName,
                data.address,
                data.phone
            );
            break;
        case INFORMATION_ENUM.purchases:
            setDataTable(data, optional.discount);
            break;
        default:
            break;
    }
}

function getDefaultData(enumValue) {
    switch (enumValue) {
        case INFORMATION_ENUM.company:
            return getDefaultCompanyInformation();
        case INFORMATION_ENUM.bill:
            return getDefaultBillInformation();
        case INFORMATION_ENUM.ship:
            return getDefaultShipInformation();
        case INFORMATION_ENUM.purchases:
            return getDefaultPurchasesInformation();
        default:
            return [];
    }
}

function getDefaultCompanyInformation() {
    return new CompanyInformation(
        "Your Company Name",
        "123 Street Address",
        "City, State, Zip/Post Code",
        "Phone Number",
        "Email Address",
        "20231101"
    );
}

function getDefaultBillInformation() {
    return new BillInformation(
        "Contact Name",
        "Client Company Name",
        "Address",
        "Phone",
        "Email",
        "20"
    );
}

function getDefaultShipInformation() {
    return new ShipInformation(
        "Name / Dept",
        "Client Company Name",
        "Address",
        "Phone"
    );
}

function getDefaultPurchasesInformation() {
    return [
        new Purchase("Monitorius", "10", "100.99"),
        new Purchase("", "", ""),
        new Purchase("", "", ""),
        new Purchase("", "", ""),
        new Purchase("", "", ""),
        new Purchase("", "", ""),
    ];
}

function setCompanyInformation(name, address, post, phone, email) {
    $("#company-name").text(name);
    $("#company-address").text(address);
    $("#company-post").text(post);
    $("#company-phone").text(phone);
    $("#company-email").text(email);
}

function setBillInformation(name, companyName, address, contact) {
    $("#customer-name").text(name);
    $("#customer-company-name").text(companyName);
    $("#customer-address").text(address);
    $("#customer-contact").text(contact);
}

function setShipInformation(name, companyName, address, contact) {
    $("#ship-name").text(name);
    $("#ship-company-name").text(companyName);
    $("#ship-address").text(address);
    $("#ship-contact").text(contact);
}

function showDate(date) {
    $("dash-date").text(transformDate(date));
    $("without-dash-date").text(transformDate(date));
}

function setDataTable(purchases, discount = 0) {
    if (!purchases && !Array.isArray(purchases) && !purchases.length) {
        return;
    }

    let tbody = $(".purchase tbody").eq(0);
    tbody.find(".purchase__body__row").remove();

    let firstTbodyElement = tbody.find(
        ".purchase__body__row--calculations:first"
    );
    let newDom = "";
    let subTotal = 0;

    purchases.forEach(function (element, index) {
        newDom = "";

        if (index % 2 === 0) newDom = getPositiveRowDom(element);
        else newDom = getNegativeRowDom(element);

        subTotal += parseFloat(element.getTotal());
        firstTbodyElement.before(newDom);
    });

    let totalDiscount = calculateDiscoutPercantage(subTotal, discount).toFixed(
        2
    );
    let balance = subTotal - totalDiscount;
    setCalculations(subTotal, totalDiscount, balance);
}

function setCalculations(subtotal, discountAmount, balance) {
    $("#subtotal").text(formatPrice(subtotal));
    $("#discount").text(formatPrice(discountAmount));
    $("#balance").html("&euro; " + formatPrice(balance));
}

function getPositiveRowDom(element) {
    let newRow = $("<tr>").addClass("purchase__body__row");

    var descriptionDom = $("<td>")
        .text(element.description)
        .addClass("purchase__body__row__column");
    var qtyDom = $("<td>")
        .text(element.qty)
        .addClass("purchase__body__row__column");
    var unitPriceDom = $("<td>")
        .text(element.unitPrice)
        .addClass("purchase__body__row__column");
    var totalDom = $("<td>")
        .text(formatPrice(element.getTotal()))
        .addClass("purchase__body__row__column");

    newRow.append(descriptionDom, qtyDom, unitPriceDom, totalDom);
    return newRow;
}

function getNegativeRowDom(element) {
    let newRow = $("<tr>").addClass("purchase__body__row--negative");

    var descriptionDom = $("<td>")
        .text(element.description)
        .addClass("purchase__body__row--negative__column");
    var qtyDom = $("<td>")
        .text(element.qty)
        .addClass("purchase__body__row--negative__column");
    var unitPriceDom = $("<td>")
        .text(element.unitPrice)
        .addClass("purchase__body__row--negative__column");
    var totalDom = $("<td>")
        .text(formatPrice(element.getTotal()))
        .addClass("purchase__body__row--negative__column");

    newRow.append(descriptionDom, qtyDom, unitPriceDom, totalDom);
    return newRow;
}

function calculateDiscoutPercantage(value, discountPercantege) {
    return (discountPercantege / 100) * value;
}

function transformDate(date) {
    if (date.length === 8) {
        // Input format: YYYYMMDD
        const year = date.substring(0, 4);
        const month = date.substring(4, 6);
        const day = date.substring(6, 8);
        return `${year}-${month}-${day}`;
    } else if (date.length === 10) {
        // Input format: YYYY-MM-DD
        return date;
    } else {
        // Handle invalid input
        return "Invalid date format";
    }
}

//div.main>(div.invoice-header>div.invoice-header__name{INVOICE}+div.invoice-header__logo)+(div.essentials>(div.essentials__company>div#company-name{Name}+div#company-address{lorem}+div#company-post{lorem}+div#number{Phone Number}+div#email{Email Address})+(div.essentials__date>div.essentials__date__formats#dash-date{2023-11-06}+div.essentials__date__formats#without-dash-date{20231106}))+(div.customer-information>(div.customer-information__bill-to)+(div.customer_information__ship-to))
