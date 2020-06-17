var express = require('express');
var router = express.Router();
var axios = require('axios');

var pfio = require('piface-node');
var sleep = require('sleep');

pfio.init();

router.get('/', function(req, res, next){
  //var macAddr = req.body.macAddr;
  //var name = req.body.name;
  var macAddr = '1A:2B:3C:4D:5E:6';
  var name = 'TEST2';

  console.log('Enter2');
  var jsonDataObj = {macAddr: macAddr, name: name};

  console.log('Enter3');

  axios.post('http://172.16.3.241:3000/macCheck',{
    macAddr: macAddr,
    name: name
  })
  .then(function(response){
    var jsonResult = response.data;    
    console.log(jsonResult.result);

    if(jsonResult.result == 'OK'){
      res.render('lidar', {title:'Mac Check'});
      setOpen();
    }
    else if(jsonResult.error){
      res.render('lidar',{title:'Error'});
    }
  })
  .catch(function(error){
    console.log(error);
  });

  console.log('Enter4');
});

module.exports = router;

function setOpen(){
   pfio.digital_write(0,1);

   sleep.sleep(3);
   
   pfio.digital_write(0,0);
}
