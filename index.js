import { createHmac } from "crypto";
import QRCode from "qrcode";

class OTPManager {
	constructor(secretKey, timeStep) {
		this.secretKey = secretKey;
		this.timeStep = timeStep;
		this.otpLength = 6;
		this.otpPaddingCharacter = "0";
		this.byteLength = 16;
	}

	generateSecret() {
		// Generate random bytes
		const randomBytes = randomBytes(this.byteLength);

		// Encode the random bytes in base32
		const base32String = Buffer.from(randomBytes).toString("base32");

		// Trim to the desired length
		return base32String;
	}

	generateQrCode(inputString) {
		let finalString = `otpauth://totp/SK:sk@gmail.com?secret=${inputString}&issuer=SK`;
		QRCode.toDataURL(finalString)
			.then((url) => {
				return url;
			})
			.catch((err) => {
				console.error(err);
			});
	}

	generateOTP() {
		const currentTime = Math.floor(Date.now() / 1000);
		const counter = Math.floor(currentTime / this.timeStep);
		const counterBuffer = Buffer.alloc(8);
		counterBuffer.writeUIntBE(counter, 0, 6);

		const hmac = createHmac("sha1", Buffer.from(this.secretKey, "base64"));
		hmac.update(counterBuffer);
		const hmacResult = hmac.digest();

		const offset = hmacResult[hmacResult.length - 1] & 0xf;
		const otpChunk = hmacResult.readUIntBE(offset, 4) & 0x7fffffff;
		const otp = otpChunk % 1000000;
		console.log(otp);

		return this.customPad(otp.toString());
	}

	validateOTP(userOTP) {
		const currentTime = Math.floor(Date.now() / 1000);
		const counter = Math.floor(currentTime / this.timeStep);
		const counterBuffer = Buffer.alloc(8);
		counterBuffer.writeUIntBE(counter, 0, 6);

		const hmac = createHmac("sha1", Buffer.from(this.secretKey, "base64"));
		hmac.update(counterBuffer);
		const hmacResult = hmac.digest();

		const offset = hmacResult[hmacResult.length - 1] & 0xf;
		const otpChunk = hmacResult.readUIntBE(offset, 4) & 0x7fffffff;
		const otp = otpChunk % 1000000;

		return this.customPad(otp.toString()) == userOTP;
	}

	customPad(inputString) {
		if (inputString.length == this.otpLength) {
			return inputString;
		}
		// Truncate to otp length characters if longer
		if (inputString.length > this.otpLength) {
			return inputString.slice(0, this.otpLength);
		}
		// Concatinate with otpPaddingCharacter if shorter
		let paddedString = inputString;
		while (paddedString.length < this.otpLength) {
			paddedString = this.otpPaddingCharacter + paddedString;
		}
		return paddedString;
	}
}

// module.exports.OTPManager = OTPManager;

export default OTPManager;
