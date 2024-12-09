import bcrypt from 'bcrypt';

// Define the cost factor (the higher the salt rounds, the more secure but also slower)
const saltRounds = 10;

// Hashing a password
export async function hashPassword(password) {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

// Verifying a password
export async function verifyPassword(password, hashedPassword) {
    const match = await bcrypt.compare(password, hashedPassword);
    return match; // true if password matches the hash
}