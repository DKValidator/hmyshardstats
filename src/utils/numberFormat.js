export function formatCurrency(value, currency) {
    if (!currency)
        currency = 'usd';
        
    if (!value)
        value = 0;
    const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol'
    }).format(value);

    return "~ " + formatted;
}

export function formatONE(value) {
    if (!value)
    value = 0;
    const formatted = new Intl.NumberFormat('en-US', {

        maximumSignificantDigits: 10

    }).format(value);

    return formatted;
}