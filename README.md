
## Time-based (TOTP) One-Time Password generator and validator.

const OTPManager = require('./otp-manager');

const secretKey = "BOOM";

const timeStep = 1; // Adjust the time step interval as needed

const otpManager = new OTPManager(secretKey, timeStep);

const generatedOTP = otpManager.generateOTP();
console.log('Generated OTP:', generatedOTP);

const isValid = otpManager.validateOTP(355459);
console.log('Is OTP Valid:', isValid);