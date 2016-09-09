var mongoose = require('mongoose');

var CustomerSchema = mongoose.Schema({
    
    
    firstname: String,
    lastname: String,
    email: String, 
    phone: String,
    address: String
    
    
});

module.exports = mongoose.model('Customer', CustomerSchema);