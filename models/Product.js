const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    productCode:{
        type: Date,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    category:{
        type: String,
        require: true,
    },
    manufactureDate:{
        type: Date,
        required: true,
    }, 
    expiryDate:{
        type: Date,
        required: true,
    },
    owner:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
        default: "available"
    },
    priceChanged:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);