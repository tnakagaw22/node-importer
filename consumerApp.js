const Consumer = require('./rabbitmq/consumer');
var { mongoose } = require('./db/mongoose');
const { Listing } = require('./db/models/listing');

let work = (message) => {
    let listing = new Listing({
        listingKey: "OLRS-1358658",
        webId: "1358658",
        media: [{
            mediaKey: "OLRS-148968125",
            mediaType: "I",
            mediaUrl: "https://compass.imgix.net/37bef360b52e39aa18c518945b75d4937e2455cb.jpg?markalign=top,left&h=480&markh=33.0&markpad=16.0&w=640&mark64=d2F0ZXJtYXJrXzQucG5n",
            sortOrder: 1
        },{
            mediaKey: "OLRS-148968126",
            mediaType: "I",
            mediaUrl: "https://compass.imgix.net/c8c3a0b36ae61f636c872e55404fdc9dcec65894.jpg?markalign=top,left&h=480&markh=33.0&markpad=16.0&w=640&mark64=d2F0ZXJtYXJrXzQucG5n",
            sortOrder: 2
        }]

    });

    listing.save().then((doc) => {
        console.log("new listing created : " + doc);
    })
    console.log('consuming : ' + message);
}

let consumer = new Consumer();
// consumer.getConnection();
// consumer.consume(work);
consumer.consumePromise('hello', work);