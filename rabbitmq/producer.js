const amqp = require('amqplib');
const config = require('../config/config');


let amqpConn = null;
const getConnection = () => {

    
    return amqp.connect(`amqp://${config.rabbitMqUser}:${config.rabbitMqPassword}@${config.rabbitMqHost}`)
        .then((conn) => {
            amqpConn = conn;

            console.log("connection :" + amqpConn);
            return amqpConn;
        })
        .catch((e) => console.log(e));
};

const publish = async (message) => {
    if (!amqpConn) {
        console.log('before getting connection.');
        await getConnection();
    }

    let channel = await amqpConn.createChannel();
    var q = 'hello';
    var msg = 'Hello World!';

    var ok = await channel.assertQueue(q, { durable: false });
    if (ok) {
        channel.sendToQueue(q, Buffer.from(msg));
        console.log(" [x] Sent '%s'", msg);

        channel.close();
    }

    // return amqpConn.createChannel()
    //     .then((ch) => {
    //         console.log('connected successfully');


    //         var q = 'hello';
    //         var msg = 'Hello World!';

    //         var ok = ch.assertQueue(q, { durable: false });

    //         return ok.then(function (_qok) {
    //             // NB: `sentToQueue` and `publish` both return a boolean
    //             // indicating whether it's OK to send again straight away, or
    //             // (when `false`) that you should wait for the event `'drain'`
    //             // to fire before writing again. We're just doing the one write,
    //             // so we'll ignore it.
    //             ch.sendToQueue(q, Buffer.from(msg));
    //             console.log(" [x] Sent '%s'", msg);
    //             return ch.close();
    //         });
    //     })
    //     .catch((e) => console.log(e));;
};
let whenConnected = (startPublishing) => {
    startPublishing();
};

module.exports = {
    publish
};