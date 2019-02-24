const amqp = require('amqplib');
const config = require('../config/config');

module.exports = class Consumer {
    constructor() {
        this.connection = null
    }

    async getConnection() {
        try {
            if (!this.connection) {
                this.connection = await amqp.connect(`amqp://${config.rabbitMqUser}:${config.rabbitMqPassword}@${config.rabbitMqHost}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    consumePromise(queueName, doWork) {
        amqp.connect(`amqp://${config.rabbitMqUser}:${config.rabbitMqPassword}@${config.rabbitMqHost}`)
            .then((conn) => {
                return conn.createChannel();
            })
            .then((channel) => {
                var ok = channel.assertQueue(queueName, { durable: false });

                // noAck: false -> message will be requeued if not acknowledged
                ok = ok.then(function (_qok) {
                  return channel.consume(queueName, function (msg) {
                    // console.log(" [x] Received '%s'", msg.content.toString());
            
                    // do some processing and let mq know message is ready to be deleted
                    channel.ack(msg);
                    doWork(JSON.parse(msg.content));

                  }, { noAck: false });
                });
            
                return ok.then(function (_consumeOk) {
                  console.log(' [*] Waiting for messages. To exit press CTRL+C');
                });
            
                // console.log('got channel');
                // return channel.assertQueue(queueName, { durable: false })
                //     .then((ok) => {
                //         if (ok) {
                //             console.log(ok);
                //             return channel.consume(queueName);
                //         } else {
                //             return Promise.reject('no ok');
                //         }
                //     })
                //     .then((message) => {
                //         console.log(message);
                //         // console.log(" [x] Popped '%s'", message.content.toString());
                //         // channel.ack(message);
                //         work(message);
                //     })
            })

    }

    async consume(consumeMessage) {
        await getConnection();
        let channel = await this.connection.createChannel();

        let queueName = "hello";
        var ok = await channel.assertQueue(queueName, { durable: false });
        if (ok) {
            let message = await channel.consume(queueName);
            console.log(" [x] Popped '%s'", message.content.toString());
            channel.ack(message);

            consumeMessage(message);
        }
    }
}

// const startConsumer = (startConsuming) => {
//     amqp.connect(`amqp://${config.rabbitMqUser}:${config.rabbitMqPassword}@${config.rabbitMqHost}`).then(function (err, conn) {
//         if (err) {
//             console.error("[AMQP]", err.message);
//             return setTimeout(start, 7000);
//         }
//         conn.on("error", function (err) {
//             if (err.message !== "Connection closing") {
//                 console.error("[AMQP] conn error", err.message);
//             }
//         });
//         conn.on("close", function () {
//             console.error("[AMQP] reconnecting");
//             return setTimeout(start, 7000);
//         });

//         console.log("[AMQP] connected");
//         amqpConn = conn;

//         startConsuming();
//   });
// };

// module.exports = {
//     startConsumer
// };