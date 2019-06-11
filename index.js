//// Core modules

//// External modules
const axios = require('axios');

//// Modules

/**
 * Checking the service status
 * 
 * @example
 * let infobip = require('node-infobip');
 * let status = await infobip.status();
 * console.log(status);
 * 
 * 
 * @param {string} baseUrl Infobip personal base URL
 * @param {string} contentType The type of data the API returns. Values: "json" or "xml"
 * 
 * @returns {string} String in JSON or XML
 */
async function status(contentType = 'json', baseUrl = 'https://api.infobip.com') {
    try {
        let accept = 'application/json'
        if (contentType === 'xml') {
            accept = 'application/xml'
        }
        let response = await axios.get(`${baseUrl}/status`, {
            headers: {
                'Accept': accept
            }
        });
        return response.data;
    } catch (err) {
        throw trimError(err)
    }
}

/**
 * Infobip
 * 
 * @example 
 * // Include module
 * let infobip = require('node-infobip');
 * 
 * // Instantiate SMS module. Specify Sender ID and Base URL
 * let sms = new infobip.SMS('CompanyA', 'https://api.infobip.com');
 * 
 * // Basic authorization
 * sms.authorize('Basic', 'username', 'password');
 * 
 * // API key authorization
 * sms.authorize('App', 'public-api-key');
 * 
 * // Token authorization
 * sms.authorize('IBSSO', 'token');
 * 
 * // Send single text
 * await sms.single('631234567890', 'Hello there!');
 * 
 * // Send single text to multiple recipients
 * await sms.single(['631234567890', '631234567891'], 'Hello there!');
 * 
 */
class SMS {
    /**
     * 
     * @param {string} defaultFrom Represents a sender ID which can be alphanumeric or numeric
     * @param {string} baseUrl Infobip personal base URL
     * @param {number} version API version 1 or 2
     * @param {string} contentType The type of data the API returns. Values: "json" or "xml"
     */
    constructor(defaultFrom = 'INFO', baseUrl = 'https://api.infobip.com', version = 1, contentType = 'json') {
        if (version < 1 || version > 2) {
            throw new Error('Invalid version number.')
        }
        if (!(contentType === 'json' || contentType === 'xml')) {
            throw new Error('Invalid content type.')
        }
        this.baseUrl = baseUrl;
        this.version = version;
        this.defaultFrom = defaultFrom;
        this.contentType = contentType;
        this.axios = null;
    }

    /**
     * Get API status
     * 
     * @returns {Object} Axios response.data
     */
    async status() {
        try {
            let accept = 'application/json'
            if (this.contentType === 'xml') {
                accept = 'application/xml'
            }
            let response = await axios.get(`${this.baseUrl}/status`, {
                headers: {
                    'Accept': accept
                }
            });
            return response.data;
        } catch (err) {
            throw trimError(err)
        }
    }

    /**
     * Authorize API calls
     * 
     * @param {string} authType 
     * @param {string} tokenKeyOrUsername 
     * @param {string} password 
     */
    authorize(authType, tokenKeyOrUsername, password = '') {
        if (!['App', 'Basic', 'IBSSO'].includes(authType)) {
            throw new Error('Invalid authorization type.')
        }
        if (authType === 'Basic') {
            tokenKeyOrUsername = Buffer.from(`${tokenKeyOrUsername}:${password}`).toString('base64')
        }
        let accept = 'application/json'
        if (this.contentType === 'xml') {
            accept = 'application/xml'
        }
        this.axios = axios.create({
            headers: {
                'Authorization': `${authType} ${tokenKeyOrUsername}`,
                'Content-Type': accept,
                'Accept': accept
            }
        });
    }

    /**
     * Send single SMS. 
     * 
     * The maximum length of one message is 160 characters for the GSM7 standard or 70 characters for Unicode encoded messages.
     * 
     * @param {string|Array} to Destination addresses must be in international format (example: 41793026727)
     * @param {string} text Text of the message that will be sent.
     * @param {string} from Represents sender ID and it can be alphanumeric or numeric. Alphanumeric sender ID length should be between 3 and 11 characters (example: CompanyName). Numeric sender ID length should be between 3 and 14 characters.
     * 
     * @returns {Object} Axios response.data
     */
    async single(to, text, from = '') {
        try {
            if (!this.axios) {
                throw new Error('Unauthorized API call.')
            }
            if (!from) {
                from = this.defaultFrom;
            }
            let response = await this.axios.post(
                `${this.baseUrl}/sms/${this.version}/text/single`,
                {
                    from: from,
                    to: to,
                    text: text
                }
            );
            return response.data;
        } catch (err) {
            throw trimError(err)
        }
    }


    /**
     * Getting a report via message ID
     * 
     * @param {string} messageId The ID that uniquely identifies the message sent.
     * 
     * @returns {Object} Axios response.data
     */
    async getReportByMessageId(messageId) {
        try {
            if (!this.axios) {
                throw new Error('Unauthorized API call.')
            }
            let response = await this.axios.get(`${this.baseUrl}/sms/${this.version}/reports?messageId=${messageId}`);
            return response.data;
        } catch (err) {
            throw trimError(err)
        }
    }

}

/**
 * Settings
 * 
 * @example 
 * // Include module
 * let infobip = require('node-infobip');
 * 
 * // Instantiate SMS module. Specify Sender ID and Base URL
 * let sms = new infobip.SMS('CompanyA', 'https://api.infobip.com');
 * 
 * // Basic authorization
 * sms.authorize('Basic', 'username', 'password');
 * 
 * // API key authorization
 * sms.authorize('App', 'public-api-key');
 * 
 * // Token authorization
 * sms.authorize('IBSSO', 'token');
 * 
 * // Send single text
 * await sms.single('631234567890', 'Hello there!');
 * 
 * // Send single text to multiple recipients
 * await sms.single(['631234567890', '631234567891'], 'Hello there!');
 * 
 */
class Settings {

    constructor(accountKey = '_', baseUrl = 'https://api.infobip.com', version = 1, contentType = 'json') {
        if (version < 1 || version > 2) {
            throw new Error('Invalid version number.')
        }
        if (!(contentType === 'json' || contentType === 'xml')) {
            throw new Error('Invalid content type.')
        }
        this.baseUrl = baseUrl;
        this.version = version;
        this.accountKey = accountKey;
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
        if (!['App', 'Basic', 'IBSSO'].includes(authType)) {
            throw new Error('Invalid authorization type.')
        }
        if (authType === 'Basic') {
            tokenKeyOrUsername = Buffer.from(`${tokenKeyOrUsername}:${password}`).toString('base64')
        }
        let accept = 'application/json'
        if (this.contentType === 'xml') {
            accept = 'application/xml'
        }
        this.axios = axios.create({
            headers: {
                'Authorization': `${authType} ${tokenKeyOrUsername}`,
                'Content-Type': accept,
                'Accept': accept
            }
        });
    }

    /**
     * List all API keys
     * 
     * @param {string} enabled Filter enabled keys. Values: "true" or "false".
     * 
     * @returns {Object}
     * @throws {Error}
     */
    async getApiKeys(enabled = '') {
        try {
            if (!this.axios) {
                throw new Error('Unauthorized API call.')
            }

            let endPoint = `${this.baseUrl}/settings/${this.version}/accounts/${this.accountKey}/api-keys`

            if (enabled) {
                endPoint += `?enabled=${enabled}`
            }
            let response = await this.axios.get(endPoint);
            return response.data;
        } catch (err) {
            throw trimError(err)
        }
    }


    /**
     * Get an API key by its key
     * 
     * @param {string} key Key (unique ID) of the API key.
     * 
     * @returns {Object}
     * @throws {Error}
     */
    async getApiKey(key) {
        try {
            if (!this.axios) {
                throw new Error('Unauthorized API call.')
            }
            if (!key) {
                throw new Error('Please provide a key.')
            }

            let endPoint = `${this.baseUrl}/settings/${this.version}/accounts/${this.accountKey}/api-keys/${key}`

            let response = await this.axios.get(endPoint);
            return response.data;
        } catch (err) {
            throw trimError(err)
        }
    }


    /**
     * Get an API key by its public API key
     * 
     * @param {string} key Public API key of the API key.
     * 
     * @returns {Object}
     * @throws {Error}
     */
    async getApiKeyByPublicKey(key) {
        if (!this.axios) {
            throw new Error('Unauthorized API call.')
        }
        if (!key) {
            throw new Error('Please provide a key.')
        }

        let endPoint = `${this.baseUrl}/settings/${this.version}/accounts/${this.accountKey}/api-keys?publicApiKey=${key}`

        let response = await this.axios.get(endPoint);
        return response.data;
    }

    /**
     * Get an API key by its name
     * 
     * @param {string} name Name of the API key.
     * 
     * @returns {Object}
     * @throws {Error}
     */
    async getApiKeyByName(name) {
        if (!this.axios) {
            throw new Error('Unauthorized API call.')
        }
        if (!name) {
            throw new Error('Please provide a name.')
        }

        let endPoint = `${this.baseUrl}/settings/${this.version}/accounts/${this.accountKey}/api-keys?name=${name}`

        let response = await this.axios.get(endPoint);
        return response.data;
    }

}

/**
 * Axios returns a lengthy error message. Trim it down to just the result data.
 * @param {*} error 
 */
function trimError(error) {
    let errorValue = error;
    if (error instanceof Error) {
        if (error.response) { // This is axios
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.data) {
                errorValue = error.response.data
            } else {
                errorValue = error.response
            }
        } else if (error.request) { // This is axios
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            errorValue = error.request
        } else { // Regular error
            errorValue = error;
        }
    }

    return errorValue
}
module.exports = {
    status: status,
    Settings: Settings,
    SMS: SMS,
}