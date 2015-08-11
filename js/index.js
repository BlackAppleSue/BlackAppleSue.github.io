var app = angular.module('app',[]);

app.controller('http',function($scope,$http){

	$http.get('http://wenyu.byethost6.com/food').
	  then(function(response) {
	    // this callback will be called asynchronously
	    // when the response is available
	  }, function(response) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	  });


});


$(function(){

	$.ajax({
		url:"http://wenyu.byethost6.com/food"
	}).done(function(msg){
		console.log(msg);
	});


});