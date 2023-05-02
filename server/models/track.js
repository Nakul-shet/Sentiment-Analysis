const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
    productId : {
        type : String,
        required : true
    },
    productTitle : {
        type : String,
        required : true
    },
    productImage : {
        type : String,
        required : true
    },
    positive : Number,
    negative : Number,
    neutral : Number,
    total : Number,
    threshold : Number
})

const Track = mongoose.model("Track" , trackSchema);

module.exports = Track;