import { customAlphabet } from 'nanoid';

export const generateNanoid = (length = 14) => {
    const alphabets = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    return customAlphabet(alphabets, length)();
};