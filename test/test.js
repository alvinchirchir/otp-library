import OTPManager from "../index.js";

function test() {
	let otpManager = new OTPManager('diasf',60);
    let otp=otpManager.generateOTP();
	console.log(otp);

	console.log(otpManager.validateOTP(otp));
}
test();
