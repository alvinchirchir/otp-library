## Time-based (TOTP) and HMAC-based (HOTP)  One-Time Password library
A small and secure one time password (otp) generator and validator based on crypto.



## Installation

Requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
npm install otp-generator-validator --save
```

## Usage

```sh
const OTPManager = require('otp-gen-val');
const secretKey = <YOUR SECRET KEY>;
const timeStep = 30; // Adjust the time step interval as needed in seconds
const otpManager = new OTPManager(secretKey, timeStep);
const generatedOTP = otpManager.generateOTP();
console.log('Generated OTP:', generatedOTP);
const isValid = otpManager.validateOTP(generatedOTP);
console.log('Is OTP Valid:', isValid);
```


## License
MIT
