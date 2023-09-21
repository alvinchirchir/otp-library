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

generateQRData(key, issuer, label, [digits = 6], [algorithm = "SHA1"], [period = 30])
Generates data for a QR code that can be used for OTP (One-Time Password) authentication.

Parameters:

key (string): The secret key used for OTP generation.
issuer (string): The issuer or service provider's name.
label (string): The label associated with the OTP credential.
digits (optional, number): The number of digits in the generated OTP code (default is 6).
algorithm (optional, string): The hashing algorithm used for OTP generation (default is "SHA1").
period (optional, number): The time period in seconds for which the OTP code is valid (default is 30 seconds).
Throws:

Error: Throws an error if any of the required parameters (key, issuer, label) are missing.
Returns:

An object containing the following properties:

qrData (string): The data URL of the QR code image containing the OTP credential information.
key (string): The formatted and encoded secret key.
issuer (string): The formatted and encoded issuer name.
label (string): The formatted and encoded label.
algorithm (string): The formatted and encoded hashing algorithm.
period (string): The formatted and encoded time period (in seconds).
digits (string): The formatted and encoded number of digits in the OTP code.

```sh

//CommonJS

const otpManager = require('otp-gen-val');
const key = otpManager.generateQRData(); //store

//ES6

import { generateQRData } from 'otp-gen-val';
const key = generateQRData();//store


```

// Generate a random Base32-encoded key (default length: 20 bytes)
// Key should be saved in storage because it will be used during validation
const otpManager = require('otp-gen-val');

const key = otpManager.generateKey();

// Generate OTP data for TOTP (Time-based OTP) and get a QR code data URL
const otpData = otpManager.generateQRData(key, "MyService", "user@example.com");

//This will return an object containing qr data
{
qrData: qrCode.toDataURL(otpauthURL),
key: formattedKey,
issuer: formattedIssuer,
label: formattedLabel,
algorithm: formattedAlgorithm,
period: formattedPeriod,
digits: formattedDigits,
}

//When otpData is generated you can render it on UI as
//<img src=`${otpData.qrData}` alt=`${otpData.label}` />

//The user can then scan the qr code

//Alternatively if the user cannot scan you prompt them to enter

// Generate an OTP based on the key and type (hotp or totp)
// This key will be same as one generated on authenticator app

const otp = otpManager.generateOTP(key, "totp");

// Validate a user-provided OTP against expected OTPs generated within a time window preset to 1

const isValid = otpManager.validateOTP(userProvidedOTP, key, "totp");

```


# Contributors

We would like to thank the following contributors for their valuable contributions to this project:

- [Contributor 1](https://github.com/contributor1).

If you would like to contribute to this project, please [fork it on GitHub](https://github.com/your-project/repository) and submit a pull request.

## License
This OTP library module is licensed under the MIT License.
```
