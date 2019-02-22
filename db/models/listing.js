const mongoose = require('mongoose');

var ListingSchema = new mongoose.Schema({
    listingKey: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        // validate: {
        //     // validator: (value) => {
        //     //     return validator.isEmail(value);
        //     // },
        //     validator: validator.isEmail,
        //     message: '{VALUE} is not a valid email'
        // }
    },
    webId: {
        type: String,
        require: true,
        minlength: 6
    },
    media: [{
        mediaKey: {
            type: String,
            required: true
        },
        mediaType: {
            type: String,
            required: true,
            set: v => {
                if(v === "I"){
                    return "normalPhoto";
                }
                else{
                    return "unknown";
                }
            }
        },
        mediaUrl: {
            type: String,
            required: true
        },
        sortOrder: {
            type: Number,
            required: true
        }
    }]
}, {timestamps: true});

var Listing = mongoose.model('Listing', ListingSchema);

module.exports = { Listing };