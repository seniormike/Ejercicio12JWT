const {MongoClient} = require('mongodb');
const url = "mongodb+srv://admin:admin@cluster0.wazav.mongodb.net/messages?retryWrites=true&w=majority";
const conn = MongoClient.connect(url,{useUnifiedTopology: true});
module.exports = conn;
