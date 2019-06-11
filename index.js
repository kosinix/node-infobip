//// Core modules

//// External modules
const axios = require('axios');

//// Modules

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
    }


    /**
     * Getting a report via message ID
     * 
     * @param {string} messageId The ID that uniquely identifies the message sent.
     * 
     * @returns {Object} Axios response.data
     */
    async getReportByMessageId(messageId) {
        if (!this.axios) {
            throw new Error('Unauthorized API call.')
        }
        let response = await this.axios.get(`${this.baseUrl}/sms/${this.version}/reports?messageId=${messageId}`);
        return response.data;
    }

}

module.exports = {
    SMS: SMS,
}