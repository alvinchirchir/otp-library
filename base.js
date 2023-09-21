const crypto = require("crypto");
const base32 = require("thirty-two");
const qrCode = require("qrcode");

/**
 * Generates a random Base32-encoded key with a default length of 20 bytes (160 bits).
 * @param {number} [length=20] - The length of key to be generated.
 * @returns {string} The generated Base32-encoded key.
 */
function generateKey(length = 20) {
	// Generate random bytes
	const randomBytes = crypto.randomBytes(length); // Default length is 20 bytes (160 bits)

	// Encode the random bytes in Base32
	const base32String = base32.encode(randomBytes);

	// Return the generated Base32-encoded key
	return base32String.toString();
}

/**
 * Generates data for a QR code that can be used for OTP (One-Time Password) authentication.
 *
 * @param {string} key - The secret key used for OTP generation.
 * @param {string} issuer - The issuer or service provider's name.
 * @param {string} label - The label associated with the OTP credential.
 * @param {number} [digits=6] - The number of digits in the generated OTP code (default is 6).
 * @param {string} [algorithm="SHA1"] - The hashing algorithm used for OTP generation (default is "SHA1").
 * @param {number} [period=30] - The time period in seconds for which the OTP code is valid (default is 30 seconds).
 *
 * @throws {Error} Throws an error if any of the required parameters (key, issuer, label) are missing.
 *
 * @returns {Object} An object containing the following properties:
 *   - {string} qrData - The data URL of the QR code image containing the OTP credential information.
 *   - {string} key - The formatted and encoded secret key.
 *   - {string} issuer - The formatted and encoded issuer name.
 *   - {string} label - The formatted and encoded label.
 *   - {string} algorithm - The formatted and encoded hashing algorithm.
 *   - {string} period - The formatted and encoded time period (in seconds).
 *   - {string} digits - The formatted and encoded number of digits in the OTP code.
 */
async function generateQRData(key, issuer, label, digits = 6, algorithm = "SHA1", period = 30) {
	// Check if required parameters are provided
	if (!key) {
		throw new Error("Missing required parameter: key");
	}

	if (!issuer) {
		throw new Error("Missing required parameter: issuer");
	}

	if (!label) {
		throw new Error("Missing required parameter: label");
	}

	// Encode URL components
	const formattedKey = encodeURIComponent(key);
	const formattedIssuer = encodeURIComponent(issuer);
	const formattedLabel = encodeURIComponent(label);
	const formattedAlgorithm = encodeURIComponent(algorithm);
	const formattedPeriod = encodeURIComponent(period);
	const formattedDigits = encodeURIComponent(digits);

	// Construct the final otpauth URL
	const otpauthURL = `otpauth://totp/${formattedIssuer}:${formattedLabel}?secret=${formattedKey}&issuer=${formattedIssuer}&label=${formattedLabel}&algorithm=${formattedAlgorithm}&digits=${formattedDigits}&period=${formattedPeriod}`;

	return {
		qrData: await qrCode.toDataURL(otpauthURL),
		account_name: `${formattedIssuer}:${formattedLabel}`,
		key: formattedKey,
		issuer: formattedIssuer,
		label: formattedLabel,
		algorithm: formattedAlgorithm,
		period: formattedPeriod,
		digits: formattedDigits,
	};
}

/**
 * Generates a One-Time Password (OTP) based on the specified type.
 *
 * @param {string} key - The key key used for OTP generation.
 * @param {string} type - The type of OTP to generate, "hotp" for HMAC-based OTP or "totp" for Time-based OTP.
 * @param {number} [counter=30] - For HOTP, the counter value used to generate the OTP.
 * @param {number} [codeDigits=6] - The number of digits in the generated OTP.
 * @param {string} [hmacAlgorithm="sha1"] - The HMAC algorithm used for OTP generation.
 * @returns {string} The generated OTP.
 * @throws {Error} If an invalid OTP type is provided. Use 'hotp' or 'totp'.
 * @throws {Error} If the 'key' parameter is missing, empty, or not a string.
 * @throws {Error} If the 'type' parameter is missing, empty, or not a string.
 */
function generateOTP(key, type, counter = 30, codeDigits = 6, hmacAlgorithm = "sha1") {
	// Check if 'key' parameter is provided and non-empty string
	if (!key) {
		throw new Error("The 'key' parameter is required.");
	}

	// Check if 'type' parameter is provided and non-empty string
	if (!type) {
		throw new Error("The 'type' parameter is required.");
	}

	// Check the provided OTP type
	if (type === "hotp") {
		// Generate a HOTP and return it
		return generateHOTP(key, counter, codeDigits, hmacAlgorithm);
	} else if (type === "totp") {
		// Generate a TOTP and return it

		return generateTOTP(key, counter, codeDigits, hmacAlgorithm);
	} else {
		// Invalid OTP type
		throw new Error("Invalid OTP type. Use 'hotp' or 'totp'.");
	}
}

/**
 * Validates a user-provided OTP by comparing it to expected OTPs generated within a time window.
 *
 * @param {string} userOTP - The OTP provided by the user for validation.
 * @param {string} key - The key key used for OTP generation.
 * @param {string} type - The type of OTP to validate, "hotp" for HMAC-based OTP or "totp" for Time-based OTP.
 * @param {number} [counter=30] - For HOTP, the counter value used to generate the OTP.
 * @param {number} [codeDigits=6] - The number of digits in the generated OTP.
 * @param {string} [hmacAlgorithm="sha1"] - The HMAC algorithm used for OTP generation.
 * @param {number} [window=1] - The time window for OTP validation.
 * @returns {boolean} True if the user-provided OTP is valid, false otherwise.
 * @throws {Error} If an invalid OTP type is provided. Use 'hotp' or 'totp'.
 * @throws {Error} If the 'userOTP' parameter is missing, empty, or not a string.
 * @throws {Error} If the 'key' parameter is missing, empty, or not a string.
 * @throws {Error} If the 'type' parameter is missing, empty, or not a string.
 */
function validateOTP(userOTP, key, type='totp', counter = 30, codeDigits = 6, hmacAlgorithm = "sha1", window = 1) {
	// Check if 'userOTP' parameter is provided, is a string, and is not empty
	if (!userOTP) {
		throw new Error("The 'userOTP' parameter is required.");
	}

	// Check if 'key' parameter is provided, is a string, and is not empty
	if (!key) {
		throw new Error("The 'key' parameter is required.");
	}

	// Check if 'type' parameter is provided, is a string, and is not empty
	if (!type) {
		throw new Error("The 'type' parameter is required.");
	}

	// Iterate over the time window to validate OTPs
	for (let i = -window; i <= window; i++) {
		const expectedOTP = generateOTP(key, type, counter, codeDigits, hmacAlgorithm, counter + i);
		if (userOTP === expectedOTP) {
			return true;
		}
	}

	// No matching OTP found within the time window
	return false;
}

// Function to generate a TOTP (Time-Based One-Time Password)
function generateTOTP(key, timeStep = 30, codeDigits = 6, hmacAlgorithm = "sha1") {
	const currentUnixTime = Math.floor(Date.now() / 1000);
	const counter = Math.floor(currentUnixTime / timeStep); // Calculate time-based counter
	return generateHOTP(key, counter, codeDigits, hmacAlgorithm);
}

// Function to generate a HOTP (HMAC-Based One-Time Password)
function generateHOTP(key, counter, codeDigits = 6, hmacAlgorithm = "sha1") {
	const secretBuffer = Buffer.from(base32.decode(key));
	const counterBuffer = Buffer.alloc(8);
	counterBuffer.writeBigInt64BE(BigInt(counter), 0);
	const hmac = crypto.createHmac(hmacAlgorithm, secretBuffer);
	hmac.update(counterBuffer);
	const hash = hmac.digest();
	const offset = hash[hash.length - 1] & 0x0f;
	const binary = ((hash[offset] & 0x7f) << 24) | ((hash[offset + 1] & 0xff) << 16) | ((hash[offset + 2] & 0xff) << 8) | (hash[offset + 3] & 0xff);
	const hotp = binary % Math.pow(10, codeDigits);
	const paddedHOTP = hotp.toString().padStart(codeDigits, "0");
	return paddedHOTP;
}

module.exports = { generateKey, generateQRData, generateOTP, validateOTP };
