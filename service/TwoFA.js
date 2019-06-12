//// Core modules

//// External modules

//// Modules
const authorize = require('./../helpers').authorize;
const trimError = require('./../helpers').trimError;

/**
 * Class for 2-Factor Authentication
 * 
 * @example 
 * // Include module
 * let infobip = require('node-infobip');
 * 
 * // Instantiate class
 * let twoFA = new infobip.TwoFA()
 * 
 * // Authorize using Basic. We can swap this later with App authorization
 * twoFA.authorize('Basic', 'username', 'password')
 * 
 * // List all API keys
 * console.log(await twoFA.getApps())
 */
class TwoFA {

    /**
     * Instantiate class
     * 
     * @param {string} baseUrl Infobip personal base URL
     * @param {number} version API version 1 or 2
     * @param {string} contentType The type of data the API returns. Values: "json" or "xml"
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
     * @param {string} authType 
     * @param {string} tokenKeyOrUsername 
     * @param {string} password 
     */
    authorize(authType, tokenKeyOrUsername, password = '') {
        this.axios = authorize(authType, tokenKeyOrUsername, password, this.contentType)
    }

    /**
     * List all 2FA applications
     * 
     * @returns {Object}
     * @throws {Error}
     * 
     * @example
     * console.log(await twoFA.getApps())
     */
    async getApps() {
        try {
            if (!this.axios) {
                throw new Error('Unauthorized API call.')
            }

            let endPoint = `${this.baseUrl}/2fa/${this.version}/applications`

            let response = await this.axios.get(endPoint);
            return response.data;
        } catch (err) {
            throw trimError(err)
        }
    }


    /**
     * Get a 2FA application by its applicationId
     * 
     * @param {string} applicationId Uunique ID of the app.
     * 
     * @returns {Object}
     * @throws {Error}
     * 
     * @example
     * console.log(await twoFA.getApp('797493BB352B7B84588F108CEBAAE43E '))
     */
    async getApp(applicationId) {
        try {
            if (!this.axios) {
                throw new Error('Unauthorized API call.')
            }
            if (!applicationId) {
                throw new Error('Please provide an applicationId.')
            }

            let endPoint = `${this.baseUrl}/2fa/${this.version}/applications/${applicationId}`

            let response = await this.axios.get(endPoint);
            return response.data;
        } catch (err) {
            throw trimError(err)
        }
    }


    /**
     * Create an application
     * 
     * @param {Object} params The API key properties
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
    async newApp(params) {
        if (!this.axios) {
            throw new Error('Unauthorized API call.')
        }
        if (!params) {
            throw new Error('Please provide params.')
        }

        let endPoint = `${this.baseUrl}/2fa/${this.version}/applications`

        let response = await this.axios.post(endPoint, params);
        return response.data;
    }

    /**
     * Update an app
     * 
     * @param {string} applicationId Unique ID of the app.
     * @param {Object} params The API key properties to update
     * 
     * @returns {Object}
     * @throws {Error} Unauthorized API call
     * 
     * @example
     * 
     * console.log(await TwoFA.updateApp('0933F3BC087D2A617AC6DCB2EF5B8A61', {
     *  "name": "Mobile Number Verifier",
     *  "enabled": false
     * }))
     */
    async updateApp(applicationId, params) {
        if (!this.axios) {
            throw new Error('Unauthorized API call.')
        }
        if (!applicationId) {
            throw new Error('Please provide an applicationId.')
        }
        if (!params) {
            throw new Error('Please provide params.')
        }

        let endPoint = `${this.baseUrl}/2fa/${this.version}/applications/${applicationId}`

        let response = await this.axios.put(endPoint, params);
        return response.data;
    }
}

module.exports = TwoFA
