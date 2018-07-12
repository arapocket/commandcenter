
console.log('compute.js called');

const longComputation = () => {
    let sum = 0;
    for (let i = 0; i < 1e2; i++) {
      sum += i;
    };
    console.log('logging sum');
    console.log(sum);
    return sum;
  };
  
  if (process.send) {
    process.send("Hello");
  }
  
  process.on('message', message => {
    console.log('message from parent:', message);
  });