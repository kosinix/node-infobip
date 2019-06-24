let infobip = require('../index');

let main = async () => {
    console.log(await infobip.status())

    // Authorize API calls
    let auth = new infobip.Auth('Basic', 'username', 'pass')

    // Settings service
    let settings = new infobip.Settings()
    settings.authorize(auth) // Pass authorization to settings
    // console.log(await settings.getApiKeys())
    // console.log(await settings.getApiKey('key'))
    // console.log(await settings.getApiKeyByPublicKey('public-api-key'))
    // console.log(await settings.newApiKey({
    //     "name": "Api key 1",
    //     "allowedIPs": [],
    //     "permissions": [
    //         "ALL"
    //     ]
    // }))
    // console.log(await settings.updateApiKey('abc', {
    //     "name": "Api key 2",
    //     "allowedIPs": ['127.0.0.1']
    // }))
    // console.log(await settings.getApiKeyByName('live-server'))

}

main().then((result) => {
    console.log('Test done.')
}).catch((err) => {
    if (err.response) {
        if (err.response.data) {
            console.log(err.response.data)
        } else {
            console.log(err.response)
        }
    } else if (err.data) {
        console.log(err.data)
    } else {
        console.log(err)
    }
})