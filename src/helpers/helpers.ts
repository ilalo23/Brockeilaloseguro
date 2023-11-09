import { randomBytes } from 'crypto';

export const generateSecureRandomNumber = (length: number): string => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;

    const randomBuffer = randomBytes(Math.ceil(length / 2));
    const randomNumber = parseInt(randomBuffer.toString('hex'), 16);

    const scaledRandomNumber = min + (randomNumber % (max - min + 1));
    return scaledRandomNumber.toString();
}