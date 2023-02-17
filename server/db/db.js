const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connection = async () => {
    try {
        const conn = await mongoose.connect("mongodb://0.0.0.0:27017",{
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            connectTimeoutMS : 4000
        });
  if (conn) {
    console.log("Connected With DataBase");
  } else {
    console.log("Connection UnSuccessFull");
  }
    } catch (error) {
        throw error;
    }
  
};

module.exports = connection;
