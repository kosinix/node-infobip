//// Core modules

//// External modules
const axios = require('axios');

//// Modules
const Auth = require('./service/Auth');
const Settings = require('./service/Settings');
const SMS = require('./service/SMS');
const TwoFA = require('./service/TwoFA');

/**
 * Checking the service status
 * 
 * @example
 * let infobip = require('node-infobip');
 * let status = await infobip.status();
 * console.log(status);
 * 
 * @param {string} contentType The type of data the API returns. Values: "json" or "xml"
 * @param {string} baseUrl Infobip personal base URL
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

module.exports = {
    status: status,
    Auth: Auth,
    Settings: Settings,
    SMS: SMS,
    TwoFA: TwoFA
}