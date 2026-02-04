"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.truncateText = exports.validateEmail = exports.generateRandomCode = exports.formatPhone = exports.slugify = void 0;
// Helper functions
const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};
exports.slugify = slugify;
const formatPhone = (phone) => {
    return phone.replace(/\D/g, '');
};
exports.formatPhone = formatPhone;
const generateRandomCode = (length = 6) => {
    const chars = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
exports.generateRandomCode = generateRandomCode;
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};
exports.validateEmail = validateEmail;
const truncateText = (text, maxLength) => {
    if (text.length <= maxLength)
        return text;
    return text.substr(0, maxLength) + '...';
};
exports.truncateText = truncateText;
const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
exports.formatDate = formatDate;
