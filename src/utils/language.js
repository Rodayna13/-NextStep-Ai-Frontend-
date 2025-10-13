export const detectDirection = (value) => {
    if (!value) return "ltr";
    // Arabic Unicode range: 0x0600 - 0x06FF
    const firstChar = value.trim()[0];
    const code = firstChar.charCodeAt(0);
    return code >= 0x0600 && code <= 0x06FF ? "rtl" : "ltr";
};