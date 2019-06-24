# Node Infobip
Node.js module for the [Infobip Api](https://dev.infobip.com/getting-started)

## Install

    npm install github:kosinix/node-infobip

*Note: It currently resides on Github as node-infobip package on NPM is already taken.*

## Quick Start

#### Include the module

    let infobip = require('node-infobip');

#### Test API status

    console.log(await infobip.status())

#### Authorize API calls

    let auth = new infobip.Auth('Basic', 'username', 'pass')

*You can also use App keys or Tokens for authorization. See Authorization section.*

#### Sending an SMS

    // Instantiate SMS module. Specify Sender ID and Base URL
    let sms = new infobip.SMS('CompanyA', 'https://api.infobip.com');

    // Authorize SMS service
    sms.authorize(auth);

    // Send single text
    await sms.single('631234567890', 'Hello there!');

    // Override default sender ID
    await sms.single('631234567890', 'Hello there!', 'MyCompany');

    // Send single text to multiple recipients
    await sms.single(['631234567890', '631234567891'], 'Hello there!');

*NOTE: If Sender ID does not work (its always "InfoSMS"), go to your [Infobip Account in the Dashboard](https://portal.infobip.com/settings/my-account) and check the Default Sender field.*

## Authorization 
#### Using the [Auth Service](docs/api/Auth.html)

    // Basic authorization
    let auth = new infobip.Auth('Basic', 'username', 'pass')

    // API key authorization (RECOMMENDED)
    let auth = new infobip.Auth('App', 'public-api-key')

    // Token authorization
    let auth = new infobip.Auth('IBSSO', 'token')

Every service implements the `authorize()` method. You only need to pass the instance of `auth` to it and you're good to go:

    ...

    sms.authorize(auth)
    ...

    twoFA.authorize(auth)

#### Basic vs API Key vs Token

**Basic** - it is the easiest to setup since you already have your username and password. However it is not recommended because you include your credentials on every request. Although data is transmitted over HTTPS, it still poses a risk.

**API Key** - This is the recommended method because you can assign it a limited role and add IP restrictions. However, you need to manually set this up by sending a POST request to infobip. See:  [https://dev.infobip.com/settings/create-and-manage-api-key#create-a-new-api-key](https://dev.infobip.com/settings/create-and-manage-api-key#create-a-new-api-key)

**Token** - Use this if you want an expiring token. 

## Two-Factor Authentication
2-Factor Authentication (2FA) is a cloud messaging security solution that confirms the identity of the user and protects the system from phishing or hacking attacks.

Creating an application is the first step of the 2FA setup process:

#### Using the [TwoFA Service](docs/api/TwoFA.html)

    let twoFA = new infobip.TwoFA()

    twoFA.authorize(auth)

    console.log(await twoFA.newApp({
        "name": "Mobile Number Verifier",
        "configuration": {
            "pinAttempts": 10,
            "allowMultiplePinVerifications": true,
            "pinTimeToLive": "15m",
            "verifyPinLimit": "1/3s",
            "sendPinPerApplicationLimit": "10000/1d",
            "sendPinPerPhoneNumberLimit": "3/1d"
        },
        "enabled": true
    }))

*See https://dev.infobip.com/2fa/application-setup for the configuration parameters.*

Next, Create a template for your 2FA message:

    console.log(await twoFA.newMessageTemplate('E39FA9F9983246FEEE938A70FE0C94BD', {
        "pinType": "NUMERIC",
        "pinPlaceholder": "<pin>",
        "messageText": "<pin> is your Verification Code",
        "pinLength": 6,
        "senderId": "Infobip",
        "language": "en",
        "repeatDTMF": "1#",
        "speechRate": 1
    }))

The first parameter is the ID of the application you made with `newApp()`.

Next we need to use the [Settings Service](docs/api/Settings.html) to generate an API key for our 2FA app.

    let settings = new infobip.Settings()

    settings.authorize(auth)

    console.log(await settings.newApiKey({
        "name": "My two factor authorization API key",
        "allowedIPs": [],
        "permissions": [
            "TFA"
        ]
    }))

Next, we generate and send a PIN code over SMS:

    // Use the API key we generated for 2FA use
    let auth = new infobip.Auth('App', 'public-api-key-of-2FA')

    twoFa.authorize(auth) // Use it

    // Send pin
    console.log(await twoFA.sendPin({
        "applicationId": "E39FA9F9983246FEEE938A70FE0C94BD",
        "messageId": "B7F6CDDC480C7902D2F5DE4EB1C37E39",
        "from": "InfoSMS",
        "to": "41793026727"
    }))

And then somewehre in your web app, you verify the pin:

    console.log(await twoFA.verifyPin('C69BCA07517DFB8F850EC9751B36B54B', '123456'))


Checkout the API Docs for more.

## Documentation
* [API Docs](docs/api/index.html)
    * [Auth](docs/api/Auth.html)
    * [Settings](docs/api/Settings.html)
    * [SMS](docs/api/SMS.html)
    * [TwoFA](docs/api/TwoFA.html)

* Go to Infobip's website ->> [Infobip HTTP API](https://dev.infobip.com/getting-started)
