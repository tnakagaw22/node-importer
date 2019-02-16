var amqp = require('amqplib');
const config = require('./config/config');

amqp.connect(`amqp://${config.rabbitMqUser}:${config.rabbitMqPassword}@${config.rabbitMqHost}`).then(function (conn) {
  //   return conn.createChannel().then(function(ch) {
  //       console.log('connected successfully');


  //     var q = 'hello';
  //     var msg = 'Hello World!';

  //     var ok = ch.assertQueue(q, {durable: false});

  //     return ok.then(function(_qok) {
  //       // NB: `sentToQueue` and `publish` both return a boolean
  //       // indicating whether it's OK to send again straight away, or
  //       // (when `false`) that you should wait for the event `'drain'`
  //       // to fire before writing again. We're just doing the one write,
  //       // so we'll ignore it.
  //       ch.sendToQueue(q, Buffer.from(msg));
  //       console.log(" [x] Sent '%s'", msg);
  //       return ch.close();
  //     });
  //   }).finally(function() { conn.close(); });



  process.once('SIGINT', function () { conn.close(); });
  return conn.createChannel().then(function (ch) {

    var ok = ch.assertQueue('hello', { durable: false });

    // noAck: false -> message will be requeued if not acknowledged
    ok = ok.then(function (_qok) {
      return ch.consume('hello', function (msg) {
        console.log(" [x] Received '%s'", msg.content.toString());

        // do some processing and let mq know message is ready to be deleted
        ch.ack(msg);
        
      }, { noAck: false });
    });

    return ok.then(function (_consumeOk) {
      console.log(' [*] Waiting for messages. To exit press CTRL+C');
    });
  });
}).catch(console.warn);
