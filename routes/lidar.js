var express = require('express');
var router = express.Router();
var pfio = require('piface-node');
var sleep = require('sleep');
var axios = require('axios');

console.log('Enter');

pfio.init();

router.get('/', function(req, res, next){
   console.log('Enter1');
   res.render('lidar', {title: 'Lidar Sensor Control'});
});

///

router.get('/:command', function(req, res, next){
   var command = req.params.command;

   //var macAddr = req.query.macAddr;
   //console.log(macAddr + "/1");
   
   if(command == 'open'){
     res.render('lidar', {title: 'Lidar Sensor Open'});
     setOpen();
   } 
});

router.post('/:command', function(req, res, next){
  console.log('Enter2');  
  var command = req.params.command;
  var macAddr = req.body.macAddr;
  var name = req.body.name;
//  var macAddr = '1A:2B:3C:4D:5E:6F';
//  var name = 'TEST2';

  //send param
  axios.post('http://172.16.3.241:3000/macCheck',{
    macAddr: macAddr,
    name: name
  })
  .then(function(response){
    var jsonResult = response.data;
    console.log(jsonResult.result);

    if(jsonResult.result == 'OK'){
      res.render('macCheck', {title:'Mac Check Ok'});
      setOpen();
    }
    else if(jsonResult.error){
      res.render('lidar',{title:'Error'});
    }
  })
  .catch(function(error){
    console.log(error);
  });    
});

///

module.exports = router;

///
function setOpen(){
  pfio.digital_write(0,1);

  sleep.sleep(3);

  pfio.digital_write(0,0);	
    
}
///
