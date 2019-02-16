const producer = require('./rabbitmq/producer');

console.log('starting app2');

let message = {
    body : "test body"
};

producer.publish(message);
producer.publish(message);
producer.publish(message);
producer.publish(message);
producer.publish(message);
producer.publish(message);
producer.publish(message);
producer.publish(message);
producer.publish(message);