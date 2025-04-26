import crypto from 'crypto';

const secret = crypto.randomBytes(64).toString('hex'); // Genera una cadena aleatoria de 64 bytes y la convierte a hexadecimal
console.log(secret);