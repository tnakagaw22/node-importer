const Consumer = require('./rabbitmq/consumer');

let work = (message) => {
    console.log('consuming : ' + message);
}

let consumer = new Consumer();
// consumer.getConnection();
// consumer.consume(work);
consumer.consumePromise('hello', work);