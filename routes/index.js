var express = require('express');
var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});
console.log('inEnter');
exports.index = function(req, res){
console.log('inEnter2');
  res.render('index', { title: 'Page title'});
};

module.exports = router;
