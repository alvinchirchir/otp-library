const crypto = require("crypto");

class OTPManager {
	constructor(secretKey, timeStep) {
		this.secretKey = secretKey;
		this.timeStep = timeStep;
	}

	generateOTP() {
		const currentTime = Math.floor(Date.now() / 1000);
		const timeStep = 1;
		const counter = Math.floor(currentTime / timeStep);
		const counterBuffer = Buffer.alloc(8);
		counterBuffer.writeUIntBE(counter, 0, 6);

		const hmac = crypto.createHmac("sha1", Buffer.from(this.secretKey, "base64"));
		hmac.update(counterBuffer);
		const hmacResult = hmac.digest();

		const offset = hmacResult[hmacResult.length - 1] & 0xf;
		const otpChunk = hmacResult.readUIntBE(offset, 4) & 0x7fffffff;
		const otp = otpChunk % 1000000;

		return otp.toString().padStart(6, "0");
	}

	validateOTP(userOTP) {
		const currentTime = Math.floor(Date.now() / 1000);
		const timeStep = 1;
		const counter = Math.floor(currentTime / timeStep);
		const counterBuffer = Buffer.alloc(8);
		counterBuffer.writeUIntBE(counter, 0, 6);

		const hmac = crypto.createHmac("sha1", Buffer.from(this.secretKey, "base64"));
		hmac.update(counterBuffer);
		const hmacResult = hmac.digest();

		const offset = hmacResult[hmacResult.length - 1] & 0xf;
		const otpChunk = hmacResult.readUIntBE(offset, 4) & 0x7fffffff;
		const otp = otpChunk % 1000000;

		return otp.toString().padStart(6, "0") === userOTP;
	}
}

export default OTPManager;
