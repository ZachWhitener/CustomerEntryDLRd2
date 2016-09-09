var http = require('http');
var path = require('path');
var util = require('util');

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var router = express();
var server = http.createServer(router);

mongoose.connect('mongodb://localhost/customers');
// Express configs
router.use(bodyParser());
router.use(express.static(path.resolve(__dirname, 'public')));
router.set('view engine', 'jade');
router.set('views', process.cwd() + '/views');

// Customer model
var Customer = require('./models/Customer.js');

// home route
router.get('/', getHome);

// api routes
router.get('/api/get-customers', getCustomers);
router.post('/api/add-customer', addCustomer);
router.get('/api/delete-customer/:id', deleteCustomer);
router.post('/api/edit-customer/:id', editCustomer);


//  - router functions
// render home page
function getHome(req, res) {
  res.render('partials/customers');
}

// get all customers in DB
function getCustomers(req, res) {
  
  var seed = {
    firstname: 'Zach',
    lastname: 'Whitener',
    email: 'zachwhitener94@gmail.com',
    phone: '810-845-0528',
    address: '1300 Dusty Ln. Howell, MI'
  };
  
  Customer.find({}, function(err, customers) {
    if (err) {
      console.log('Error getting customers: '+err);
    }
    if (customers.length < 1) {
      customers = seedDb(seed);
    }
    
    console.log('Heres the customers: ');
    console.log(util.inspect(customers, false, null));
    
    res.send(customers);
  });
}

// if there are no customers, add me
function seedDb(seed) {
  var lead = new Customer(seed);
  var customer;
  
  lead.save(function(err, doc) {
    if (err) {
      throw new Error('Cant seed DB!');
      console.log('Cant seed DB!');
    }
    customer = doc;
  });
  
  return customer;
}

// Add customer to db
function addCustomer(req, res) {
  if (!req.body) {
    console.log('No information served');
  }
  
  var customerObj = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: (req.body.phone) ? req.body.phone : null,
    address: (req.body.address) ? req.body.address : null
  };
  
  var lead = new Customer(customerObj);
  
  lead.save(function(err, doc) {
    if (err) {
      throw new Error('Cant save customer!')
      console.log(err);
    }
    
    console.log('save successful');
    res.redirect('/');
  });
}

// Remove customer from db
function deleteCustomer(req, res) {
  var id = req.params.id;
  
  if (!id) {
    throw new Error('No id!'); 
    console.log('No id!');
    res.redirect('/');
  }
  
  Customer.find({ _id: id }).remove(function(err) {
    if (err) {
      throw new Error('Cant delete customer!');
      console.log('Cant delete customer!');
      res.redirect('/');
    }
    
    console.log('customer deleted!');
    res.redirect('/');
  });
  
}

// Update customer 
function editCustomer(req, res) {
  var id = req.params.id;
  if (!req.body || !id) {
    console.log('No information served!');
  }
  // function to get current customer info
  getCurrentCustomerInfo(id, function(err, customerInfo) {
    if (err) {
      console.log('Error getting current customer info');
      console.log(err);
    }
    var currentInfo = customerInfo[0];
    var newInfo = {
      firstname: (!req.body.firstname) ? currentInfo.firstname : req.body.firstname,
      lastname: (!req.body.lastname) ? currentInfo.lastname : req.body.lastname, 
      email: (!req.body.email) ? currentInfo.email : req.body.email,
      phone: (!req.body.phone) ? currentInfo.phone : req.body.phone,
      address: (!req.body.address) ? currentInfo.address : req.body.address
    }
    
    Customer.findOneAndUpdate({ _id: id }, newInfo, function(err, doc) {
      if (err) {
        throw new Error('Cant update customer!');
        console.log('Cant update customer!');
        res.redirect('/');
      }
      
      console.log('Updated doc!');
      res.redirect('/');
      
    });
    
  })
  
  
}
function getCurrentCustomerInfo(id, cb) {
  
  // get current customer information to compare with submitted information
  Customer.find({ _id: id }, function(err, client) {
    if (err) {
      console.log('Cant find customer!');
      return cb(err);
    }
    
    return cb(null, client);
  });
  
}

// Start server
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
