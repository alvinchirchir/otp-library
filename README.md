## One-Time Password library compatible with Authenticator apps: Google, Microsoft , Salesforce etc

A simple and secure one time password (otp) generator and validator based on crypto. It follows specifications defined in RFC4226 and RFC6238.

## Installation

Requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
npm install otp-gen-val --save
```

Kindly carefully complete the procedures below to integrate OTP into your login flow.

### Steps

1. Generate and save key
2. Generate QR data
3. Validate OTP entered

### 1. Generate and save key

You will start by generating a key that will be in base 32 (according to specifications). Make sure you store this against the user in a permanent storage i.e db.

## Usage

```sh

//CommonJS

const otpManager = require('otp-gen-val');
const key = otpManager.generateKey(); //store

//ES6

import { generateKey } from 'otp-gen-val';
const key = generateKey();//store


```

### 2. Generate QR data

Next we will generate the QR data that will be scanned or alternatively if they cannot scan they will enter data that is generated on the authenticator app.

```sh

//CommonJS

const otpManager = require('otp-gen-val');
const qrData = otpManager.generateQRData("your_generated_key","your_issuer_i.eg Google","your_account_name i.e admin@xyz.com");

//ES6

import { generateQRData } from 'otp-gen-val';
const qrObject = generateQRData("your_generated_key","your_issuer_i.eg Google","your_account_name i.e admin@xyz.com");

```

A user can now choose either to scan or enter details manually. If you want a user to scan you can extract qrData from the returned object and render it as follows:

```sh
<img src="${qrObject.qrData}" alt="${qrObject.label}" />
```

Alternatively you can tell them to enter the details manually as follows:
Under account name and key that are required by autheticator app they can enter the account name and key fields that are in the return object.

### 3. Validate generated OTP
 Finally we can proceed to validate generated OTP and if it passed we can proceed to allow the user to login/authenticate:
 
 ```sh
// CommonJS
const otp = require('otp-gen-val'); // Import the OTP library

// Validate the OTP
const userOTP = "entered_otp";
const secretKey = "generated_key";
const isValid = otp.validateOTP(userOTP, secretKey);

console.log(isValid ? "Valid OTP" : "Invalid OTP");

// ES6
import { validateOTP } from 'otp-gen-val'; // Import the OTP function

// Validate the OTP
const userOTP = "entered_otp";
const secretKey = "generated_key";
const isValid = validateOTP(userOTP, secretKey);

console.log(isValid ? "Valid OTP" : "Invalid OTP");

```


# Contributors

We would like to thank the following contributors for their valuable contributions to this project:

- [Alvin Chirchir](https://github.com/alvinchirchir)
- [Fred Mainga](https://github.com/fmainga)

If you would like to contribute to this project, please [fork it on GitHub](https://github.com/alvinchirchir/otp-library.git) and submit a pull request.

## License
This OTP library module is licensed under the MIT License.

 
 
 
