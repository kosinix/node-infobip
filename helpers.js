//// Core modules

//// External modules
const axios = require('axios');

//// Modules


/**
 * Authorize API calls
 * 
 * @private
 * @param {string} authType 
 * @param {string} tokenKeyOrUsername 
 * @param {string} password 
 * @param {string} contentType 
 * @returns {Object} Instance of axios
 * @throws {Error}
 */
function authorize(authType, tokenKeyOrUsername, password = '', contentType = 'json') {
    if (!['App', 'Basic', 'IBSSO'].includes(authType)) {
        throw new Error('Invalid authorization type.')
    }
    if (authType === 'Basic') {
        tokenKeyOrUsername = Buffer.from(`${tokenKeyOrUsername}:${password}`).toString('base64')
    }
    let accept = 'application/json'
    if (contentType === 'xml') {
        accept = 'application/xml'
    }
    return axios.create({
        headers: {
            'Authorization': `${authType} ${tokenKeyOrUsername}`,
            'Content-Type': accept,
            'Accept': accept
        }
    });
}

/**
 * Axios returns a lengthy error message. Trim it down to just the result data.
 * 
 * @private
 * @param {*} error 
 * @returns {*} 
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
    authorize: authorize,
    trimError: trimError
}