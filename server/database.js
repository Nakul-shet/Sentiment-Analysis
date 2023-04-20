const mongoose = require("mongoose");
const connection = mongoose.connection;

const db_connection = () => {

    const options = {
        useNEwUrlParser : true
    }

    mongoose.connect(process.env.DATABASE , options);

    connection.once("open" , () => {
        console.log("Connected to the database")
    })

    connection.on("err" , (err) => {
        console.log(err)
    })
}

module.exports = db_connection;