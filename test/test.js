let infobip = require('../index');

let main = async () => {
    console.log(await infobip.status())
}

main().then((result)=>{
    console.log('Test done.')
}).catch((err)=>{
    console.log(err)
})