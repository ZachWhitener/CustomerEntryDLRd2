/**
    app.js - CustomerController
**/

(function() {
    angular
        .module('customer', [])
        .controller('CustomerController', [ '$http', CustomerController ]);
        
    
    function CustomerController($http) {
        
        var self = this; 
        
        $http.get('/api/get-customers')
            .success(function(data) {
                self.customers = data;
            })
            .error(function(err){
                console.log(err);
            });
    }
    
})();