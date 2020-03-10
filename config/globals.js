// create a json object of global variables
module.exports = {
    'db' : 'mongodb+srv://admin:Krr-1dra3-m@georgian-7bmgv.mongodb.net/globalFood?retryWrites=true&w=majority',
    'ids': {
        'google': {
            'clientID': '429292601361-8j2is9rudmi60kqpioqrl5m8nm3ktqgg.apps.googleusercontent.com',
            'clientSecret': 'bxiDJmX26wZvr6cLEGFZ9-ec',
            'callbackURL:': 'http://localhost:3000/google/callback'
        },
        'facebook': {
            'clientID': '187260862699847',
            'clientSecret': 'bc62a9578d34884ebe64f9972d333994',
            'callbackURL:': 'http://localhost:3000/facebook/callback'
        }
    }
}
