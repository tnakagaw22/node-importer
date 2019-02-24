const fs = require('fs');
const {chain}  = require('stream-chain');

const {parser} = require('stream-json');
const {pick}   = require('stream-json/filters/Pick');
const {ignore} = require('stream-json/filters/Ignore');
const {streamValues} = require('stream-json/streamers/StreamValues');
const producer = require('./rabbitmq/producer');

const testFolder = './filesToImport/';


fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
        const pipeline = chain([
            fs.createReadStream(testFolder + file),
            // zlib.createGunzip(),
            parser(),
            // pick({filter: 'data'}),
            // ignore({filter: /\b_meta\b/i}),
            streamValues(),
            data => {
                console.log(data)
              const value = data.value;
              return value ? data : null;
            }
          ]);

          let counter = 0;
      pipeline.on('data', (data) => {
        producer.publish(data.value);
          counter = data.value.length;
        });
          pipeline.on('end', () =>
            console.log(`sent ${counter} listings.`));

        // const readStream = fs.createReadStream(testFolder + file);

        // readStream.on('data', function(chunk) {
        //     console.log(chunk.toString('utf8'));
        //   });
          
        //   readStream.on('end', function() {
        //     console.log('finished reading');
        //     // write to file here.
        //   });

        // fs.readFile(testFolder + file, 'utf8', (err, importingListings) => {
        //     console.log(importingListings);
        //     let chunkedListings = chunk(importingListings, 200);
        //     chunkedListings.forEach(listingsToSend => {
        //         producer.publish(listingsToSend);
        //     })
        // })
    });
});
// console.log('starting app2');

// let message = {
//     body : "test body"
// };

// producer.publish(message);
// producer.publish(message);
// producer.publish(message);
// producer.publish(message);
// producer.publish(message);
// producer.publish(message);
// producer.publish(message);
// producer.publish(message);
// producer.publish(message);
function chunk(array, size) {
    const chunked_arr = [];
    let index = 0;
    while (index < array.length) {
        chunked_arr.push(array.slice(index, size + index));
        index += size;
    }
    return chunked_arr;
}