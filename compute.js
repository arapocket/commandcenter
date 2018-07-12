var compute = {};


compute.process = function (){
  console.log('compute.js called');

  let sum = 0;
  for (let i = 0; i < 1e8; i++) {
    sum += i;
  };
  console.log('logging sum');
  console.log(sum);

if (process.send) {
  process.send(sum);
}


process.on('message', message => {
  console.log('message from parent:', message);
});
}

module.exports = compute;

