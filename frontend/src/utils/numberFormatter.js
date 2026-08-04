// src/utils/numberFormatter.js

export const formatIndianNumber = (num, decimals = 2) => {
    if (num === null || num === undefined || isNaN(num)) {
        return '0.00';
    }

    const value = Number(num);
    const rounded = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    
    let parts = rounded.toFixed(decimals).split('.');
    let wholePart = parts[0];
    const decimalPart = parts[1] || '00';
    
    const isNegative = wholePart.startsWith('-');
    if (isNegative) {
        wholePart = wholePart.substring(1);
    }
    
    const lastThree = wholePart.slice(-3);
    const otherNumbers = wholePart.slice(0, -3);
    
    let formattedWhole = '';
    if (otherNumbers !== '') {
        const reversed = otherNumbers.split('').reverse().join('');
        const grouped = reversed.match(/.{1,2}/g) || [];
        const result = grouped.map(g => g.split('').reverse().join('')).reverse().join(',');
        formattedWhole = result + ',' + lastThree;
    } else {
        formattedWhole = lastThree;
    }
    
    if (isNegative) {
        formattedWhole = '-' + formattedWhole;
    }
    
    return formattedWhole + '.' + decimalPart;
};

export const formatIndianCurrency = (num, decimals = 2) => {
    const formatted = formatIndianNumber(num, decimals);
    return `₹ ${formatted}`;
};