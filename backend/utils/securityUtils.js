const mongoose = require('mongoose');

/**
 * Deeply sanitizes an object or array to remove any keys starting with '$'.
 * This prevents NoSQL operator injection in MongoDB queries and updates.
 * 
 * @param {any} input - The input value to sanitize
 * @returns {any} - The sanitized value
 */
const sanitizeNoSQL = (input) => {
    // Basic types and null/undefined are safe
    if (!input || typeof input !== 'object') {
        return input;
    }

    // Allow mongoose ObjectIds to pass through
    if (input instanceof mongoose.Types.ObjectId) {
        return input;
    }

    // Date objects are safe
    if (input instanceof Date) {
        return input;
    }

    // Recursively sanitize arrays
    if (Array.isArray(input)) {
        return input.map(item => sanitizeNoSQL(item));
    }

    // Recursively sanitize objects
    const sanitized = {};
    for (const [key, value] of Object.entries(input)) {
        // Drop any key starting with '$'
        if (typeof key === 'string' && key.startsWith('$')) {
            continue;
        }
        sanitized[key] = sanitizeNoSQL(value);
    }

    return sanitized;
};

/**
 * Validates if a string is a valid MongoDB ObjectId.
 * 
 * @param {string} id - The ID string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id) && (new mongoose.Types.ObjectId(id).toString() === id);
};

module.exports = {
    sanitizeNoSQL,
    isValidObjectId
};
