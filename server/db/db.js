const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connection = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://mitesh:mitesh@cluster0.hv26mi7.mongodb.net/?retryWrites=true&w=majority",{
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
