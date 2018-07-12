
console.log('compute.js called');

const longComputation = () => {
    let sum = 0;
    for (let i = 0; i < 1e7; i++) {
      sum += i;
      console.log(sum);
    };
    return sum;
  };
  
  process.on('message', (msg) => {
    const sum = longComputation();
    process.send(sum);
  });