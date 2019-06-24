//// Core modules

//// External modules

//// Modules
const trimError = require('./../helpers').trimError;

/**
 * Class for Account service use in managing API keys 
 * 
 * @example 
 * // Include module
 * let infobip = require('node-infobip');
 * 
 * // Instantiate Settings class
 * let settings = new infobip.Settings()
 * 
 * // Authorize using Basic. We can swap this later with App authorization
 * settings.authorize('Basic', 'username', 'password')
 * 
 * // List all API keys
 * console.log(await settings.getApiKeys())
 * 
 * // Get API key with property key "abc"
 * console.log(await settings.getApiKey('abc'))
 * 
 * // Get API key with property publicApiKey "abc"
 * console.log(await settings.getApiKeyByPublicKey('abc'))
 * 
 * // Get API key with property name "live-server"
 * console.log(await settings.getApiKeyByName('live-server'))
 * 
 */
class Settings {

    /**
     * Instantiate Settings class
     * 
     * @param {string} accountKey Key used to uniquely identify the account. Use _ as parameter value for your current account or account key for sub accounts.
     * @param {string} baseUrl Infobip personal base URL
     * @param {number} version API version 1 or 2
     * @param {string} contentType The type of data the API returns. Values: "json" or "xml"
     */
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
     * @param {Auth} auth 
     */
    authorize(auth) {
        this.axios = auth.axios(this.contentType)
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

    /**
     * Create an API key
     * 
     * @param {Object} params The API key properties
     * 
     * @returns {Object}
     * @throws {Error}
     * 
     * @example
     * 
     * console.log(await settings.newApiKey({
     *  "name": "Api key 1",
     *  "allowedIPs": [],
     *  "permissions": [
     *      "ALL"
     *  ]
     * }))
     */
    async newApiKey(params) {
        if (!this.axios) {
            throw new Error('Unauthorized API call.')
        }
        if (!params) {
            throw new Error('Please provide params.')
        }

        let endPoint = `${this.baseUrl}/settings/${this.version}/accounts/${this.accountKey}/api-keys`

        let response = await this.axios.post(endPoint, params);
        return response.data;
    }

    /**
     * Update an API key
     * 
     * @param {string} key Key (unique ID) of the API key.
     * @param {Object} params The API key properties to update
     * 
     * @returns {Object}
     * @throws {Error}
     * 
     * @example
     * 
     * console.log(await settings.updateApiKey('abc', {
     *  "name": "Api key 2",
     *  "allowedIPs": ['127.0.0.1']
     * }))
     */
    async updateApiKey(key, params) {
        if (!this.axios) {
            throw new Error('Unauthorized API call.')
        }
        if (!key) {
            throw new Error('Please provide a key.')
        }
        if (!params) {
            throw new Error('Please provide params.')
        }

        let endPoint = `${this.baseUrl}/settings/${this.version}/accounts/${this.accountKey}/api-keys/${key}`

        let response = await this.axios.put(endPoint, params);
        return response.data;
    }
}

module.exports = Settings
