# Node Infobip
Node.js module for the [Infobip Api](https://dev.infobip.com/getting-started)

## Install

`npm install node-infobip`


## Quick Start

Sending an SMS

    // Include module
    let infobip = require('node-infobip');

    // Instantiate SMS module. Specify Sender ID and Base URL
    let sms = new infobip.SMS('CompanyA', 'https://api.infobip.com');

    // Basic authorization
    sms.authorize('Basic', 'username', 'password');

    // Send single text
    await sms.single('631234567890', 'Hello there!');

    // Override default sender ID
    await sms.single('631234567890', 'Hello there!', 'MyCompany');

    // Send single text to multiple recipients
    await sms.single(['631234567890', '631234567891'], 'Hello there!');

NOTE: If Sender ID does not work (its always "InfoSMS"), go to your [Infobip Account in the Dashboard](https://portal.infobip.com/settings/my-account) and check the Default Sender field.
## Authorization

    // Basic authorization
    sms.authorize('Basic', 'username', 'password');

    // API key authorization (RECOMMENDED)
    sms.authorize('App', 'public-api-key');

    // Token authorization
    sms.authorize('IBSSO', 'token');

### Basic vs API Key vs Token

**Basic** - it is the easiest to setup since you already have your username and password. However it is not recommended because you include your credentials on every request. Although data is transmitted over HTTPS, it still poses a risk.

**API Key** - This is the recommended method because you can assign it a limited role and add IP restrictions. However, you need to manually set this up by sending a POST request to infobip. See:  [https://dev.infobip.com/settings/create-and-manage-api-key#create-a-new-api-key](https://dev.infobip.com/settings/create-and-manage-api-key#create-a-new-api-key)

**Token** - Use this if you want an expiring token. 


## Documentation
* [API Docs](docs/api/index.html)
* [Infobip HTTP API](https://dev.infobip.com/getting-started)
