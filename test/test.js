import {generateOTP,validateOTP} from "../base";



// Function to run the OTP generation and validation test
async function runOTPGenerationValidationTest(counterDuration) {
	let counter = 0;
	const otp = generateOTP("JBSWY3DPEHPK3PXY", "totp");

	// Set up an interval to generate and validate OTPs
	const intervalId = setInterval(() => {
		// Generate an OTP for the current counter value

		// Validate the OTP
		const isValid = validateOTP(otp, "JBSWY3DPEHPK3PXY", "totp");

		// Log the results
		console.log(`Counter: ${counter}, OTP: ${otp}, Validation: ${isValid ? "Valid" : "Invalid"}`);

		// Increment the counter
		counter++;

		// Check if the test should end
		if (counter > counterDuration) {
			clearInterval(intervalId); // Stop the interval
			console.log("Test complete.");
		}
	}, 1000); // Run every 1 second
}

