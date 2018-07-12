const { fork } = require('child_process');
var fs = require('fs');
var path = require('path');
var sharp = require('sharp');


console.log('compute.js called');

    let sum = 0;
    for (let i = 0; i < 1e9; i++) {
      sum += i;
    };
    console.log('logging sum');
    console.log(sum);
  
  if (process.send) {
    process.send(sum);
  }

  
  process.on('message', message => {
    console.log('message from parent:', message);
  

    for (var i = 0 ; i < message.length   ; i++)
    {
      console.log(message[i]);
    }




    
  });