const mongoose = require('mongoose');

exports.connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then((con) => console.log(`database connected: ${con.connection.host}`))
    .catch((error) => console.log(error));
}

// {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
// }