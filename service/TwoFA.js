//// Core modules

//// External modules

//// Modules
const trimError = require('./../helpers').trimError;

/**
 * Class for 2-Factor Authentication
 * 
 * @example 
 * // Instantiate class
 * let twoFA = new infobip.TwoFA()
 */
class TwoFA {

    /**
     * Instantiate class
     * 
     * @param {string} baseUrl Infobip personal base URL.
     * @param {number} version API version. The version is overridable on an individual method call level - useful if some methods are still using old version numbers.
     * @param {string} contentType The type of data the API returns. Values: "json" or "xml".
     */
    constructor(baseUrl = 'https://api.infobip.com', version = 2, contentType = 'json') {
        if (version < 1 || version > 2) {
            throw new Error('Invalid version number.')
        }
        if (!(contentType === 'json' || contentType === 'xml')) {
            throw new Error('Invalid content type.')
        }
        this.baseUrl = baseUrl;
        this.version = version;
        this.contentType = contentType;
        this.axios = null;
    }

    /**
     * Authorize API calls
     * 
     * @param {Auth} auth Instance of authorization class
     */
    authorize(auth) {
        this.axios = auth.axios(this.contentType)
    }

    /**
     * List all 2FA applications
     * 
     * @param {number} version The API version to use. If set to "", will use the instance version.
     * 
     * @returns {Object}
     * @throws {Error}
     * 
     * @example
     * console.log(await twoFA.getApps())
     */
    async getApps(version = 1) {
        try {
            if (!this.axios) {
                throw new Error('Unauthorized API call.')
            }
            if (!version) {
                version = this.version
            }
            let endPoint = `${this.baseUrl}/2fa/${version}/applications`

            let response = await this.axios.get(endPoint);
            return response.data;
        } catch (err) {
            throw trimError(err)
        }
    }


    /**
     * Get a 2FA application by its applicationId
     * 
     * @param {string} applicationId Unique ID of the app.
     * @param {number} version The API version to use. If set to "", will use the instance version.
     * 
     * @returns {Object}
     * @throws {Error}
     * 
     * @example
     * console.log(await twoFA.getApp('797493BB352B7B84588F108CEBAAE43E '))
     */
    async getApp(applicationId, version = 1) {
        try {
            if (!this.axios) {
                throw new Error('Unauthorized API call.')
            }
            if (!version) {
                version = this.version
            }
            if (!applicationId) {
                throw new Error('Please provide an applicationId.')
            }

            let endPoint = `${this.baseUrl}/2fa/${version}/applications/${applicationId}`

            let response = await this.axios.get(endPoint);
            return response.data;
        } catch (err) {
            throw trimError(err)
        }
    }


    /**
     * Create an application
     * 
     * @param {Object} params The app properties.
     * @param {number} version The API version to use. If set to "", will use the instance version.
     * 
     * @returns {Object}
     * @throws {Error}
     * 
     * @example
     * 
     * console.log(await twoFA.newApp({
     *  "name": "Mobile Number Verifier",
     *  "configuration": {
     *      "pinAttempts": 10,
     *      "allowMultiplePinVerifications": true,
     *      "pinTimeToLive": "15m",
     *      "verifyPinLimit": "1/3s",
     *      "sendPinPerApplicationLimit": "10000/1d",
     *      "sendPinPerPhoneNumberLimit": "3/1d"
     *  },
     *  "enabled": true
     * }))
     */
    async newApp(params, version = 1) {
        if (!this.axios) {
            throw new Error('Unauthorized API call.')
        }
        if (!version) {
            version = this.version
        }
        if (!params) {
            throw new Error('Please provide params.')
        }

        let endPoint = `${this.baseUrl}/2fa/${version}/applications`

        let response = await this.axios.post(endPoint, params);
        return response.data;
    }

    /**
     * Update an app
     * 
     * @param {string} applicationId Unique ID of the app.
     * @param {Object} params The app properties to update.
     * @param {number} version The API version to use. If set to "", will use the instance version.
     * 
     * @returns {Object}
     * @throws {Error} Unauthorized API call.
     * 
     * @example
     * 
     * console.log(await TwoFA.updateApp('0933F3BC087D2A617AC6DCB2EF5B8A61', {
     *  "name": "Mobile Number Verifier",
     *  "enabled": false
     * }))
     */
    async updateApp(applicationId, params, version = 1) {
        if (!this.axios) {
            throw new Error('Unauthorized API call.')
        }
        if (!version) {
            version = this.version
        }
        if (!applicationId) {
            throw new Error('Please provide an applicationId.')
        }
        if (!params) {
            throw new Error('Please provide params.')
        }

        let endPoint = `${this.baseUrl}/2fa/${version}/applications/${applicationId}`

        let response = await this.axios.put(endPoint, params);
        return response.data;
    }

    /**
     * List all templates
     * 
     * @param {string} applicationId Unique ID of the app.
     * @param {number} version The API version to use. If set to "", will use the instance version.
     * 
     * @returns {Object}
     * @throws {Error}
     * 
     * @example
     * console.log(await twoFA.getMessageTemplates())
     */
    async getMessageTemplates(applicationId, version = 1) {
        try {
            if (!this.axios) {
                throw new Error('Unauthorized API call.')
            }
            if (!version) {
                version = this.version
            }
            if (!applicationId) {
                throw new Error('Please provide an applicationId.')
            }
            
            let endPoint = `${this.baseUrl}/2fa/${version}/applications/${applicationId}/messages`

            let response = await this.axios.get(endPoint);
            return response.data;
        } catch (err) {
            throw trimError(err)
        }
    }

    /**
     * Create a message template
     * 
     * @param {string} applicationId Unique ID of the app.
     * @param {Object} params The template properties.
     * @param {Object} version The API version to use. If set to "", uses the instance version.
     * 
     * @returns {Object}
     * @throws {Error}
     * 
     * @example
     * 
     * console.log(await twoFA.newMessageTemplate('E39FA9F9983246FEEE938A70FE0C94BD', {
     *     "pinType": "NUMERIC",
     *     "pinPlaceholder": "<pin>",
     *     "messageText": "<pin> is your Verification Code",
     *     "pinLength": 6,
     *     "senderId": "Infobip",
     *     "language": "en",
     *     "repeatDTMF": "1#",
     *     "speechRate": 1
     * }))
     */
    async newMessageTemplate(applicationId, params, version = 1) {
        if (!this.axios) {
            throw new Error('Unauthorized API call.')
        }
        if (!version) {
            version = this.version
        }
        if (!applicationId) {
            throw new Error('Please provide an applicationId.')
        }
        if (!params) {
            throw new Error('Please provide params.')
        }

        let endPoint = `${this.baseUrl}/2fa/${version}/applications/${applicationId}/messages`

        let response = await this.axios.post(endPoint, params);
        return response.data;
    }

    /**
     * Update a message template
     * 
     * @param {string} applicationId Unique ID of the app.
     * @param {Object} params The template properties.
     * @param {Object} version The API version to use. If set to "", uses the instance version.
     * 
     * @returns {Object}
     * @throws {Error} Unauthorized API call.
     * 
     * @example
     * 
     * console.log(await twoFA.updateMessageTemplate('E39FA9F9983246FEEE938A70FE0C94BD', 'B7F6CDDC480C7902D2F5DE4EB1C37E39', {
     *     "pinType": "NUMERIC",
     *     "pinPlaceholder": "<pin>",
     *     "messageText": "<pin> is your Verification Code",
     *     "pinLength": 6,
     *     "senderId": "Infobip",
     *     "language": "en",
     *     "repeatDTMF": "1#",
     *     "speechRate": 1
     * }))
     */
    async updateMessageTemplate(applicationId, messageId, params, version = 1) {
        if (!this.axios) {
            throw new Error('Unauthorized API call.')
        }
        if (!version) {
            version = this.version
        }
        if (!applicationId) {
            throw new Error('Please provide an applicationId.')
        }
        if (!messageId) {
            throw new Error('Please provide a messageId.')
        }
        if (!params) {
            throw new Error('Please provide params.')
        }

        let endPoint = `${this.baseUrl}/2fa/${version}/applications/${applicationId}/messages/${messageId}`

        let response = await this.axios.put(endPoint, params);
        return response.data;
    }

    /**
     * Send a PIN code over SMS
     * 
     * @param {Object} params The pin properties.
     * @param {Object} version The API version to use. If set to "", uses the instance version.
     * 
     * @returns {Object}
     * @throws {Error}
     * 
     * @example
     * 
     * console.log(await twoFA.sendPin({
     *  "applicationId": "E39FA9F9983246FEEE938A70FE0C94BD",
     *  "messageId": "B7F6CDDC480C7902D2F5DE4EB1C37E39",
     *  "from": "InfoSMS",
     *  "to": "41793026727"
     * }))
     */
    async sendPin(params, version = 1) {
        if (!this.axios) {
            throw new Error('Unauthorized API call.')
        }
        if (!version) {
            version = this.version
        }
        if (!params) {
            throw new Error('Please provide params.')
        }

        let endPoint = `${this.baseUrl}/2fa/${version}/pin`

        let response = await this.axios.post(endPoint, params);
        return response.data;
    }

    /**
     * Resend a PIN code over SMS
     * 
     * @param {string} pinId Unique ID of the pin.
     * @param {Object} version The API version to use. If set to "", uses the instance version.
     * 
     * @returns {Object}
     * @throws {Error}
     * 
     * @example
     * 
     * console.log(await twoFA.resendPin('C69BCA07517DFB8F850EC9751B36B54B'))
     */
    async resendPin(pinId, version = 1) {
        if (!this.axios) {
            throw new Error('Unauthorized API call.')
        }
        if (!version) {
            version = this.version
        }
        if (!pinId) {
            throw new Error('Please provide a pinId.')
        }

        let endPoint = `${this.baseUrl}/2fa/${version}/pin/${pinId}/resend`

        let response = await this.axios.post(endPoint);
        return response.data;
    }

    /**
     * Verify a PIN code
     * 
     * @param {string} pinId Unique ID of the pin.
     * @param {string} pin The pin code to verify.
     * @param {Object} version The API version to use. If set to "", uses the instance version.
     * 
     * @returns {Object}
     * @throws {Error}
     * 
     * @example
     * 
     * console.log(await twoFA.verifyPin('C69BCA07517DFB8F850EC9751B36B54B', '123456'))
     */
    async verifyPin(pinId, pin, version = 1) {
        if (!this.axios) {
            throw new Error('Unauthorized API call.')
        }
        if (!version) {
            version = this.version
        }
        if (!pinId) {
            throw new Error('Please provide a pinId.')
        }
        if (!pin) {
            throw new Error('Please provide a pin.')
        }

        let endPoint = `${this.baseUrl}/2fa/${version}/pin/${pinId}/verify`

        let response = await this.axios.post(endPoint, {
            pin: pin
        });
        return response.data;
    }
}

module.exports = TwoFA
