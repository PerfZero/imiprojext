export function generateCardNumber(userId, currency, index) {
    const seed = `${userId}-${currency}-${index}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const absHash = Math.abs(hash);
    const cardDigits = String(absHash).padStart(12, '0').slice(-12);
    const cardNumber = `0000 ${cardDigits.slice(0, 4)} ${cardDigits.slice(4, 8)} ${cardDigits.slice(8, 12)}`;
    return cardNumber;
}

export function generateExpiryDate(userId, currency, index) {
    const seed = `${userId}-${currency}-${index}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const absHash = Math.abs(hash);
    const month = (absHash % 12) + 1;
    const year = new Date().getFullYear() + 3 + (absHash % 2);
    return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
}

