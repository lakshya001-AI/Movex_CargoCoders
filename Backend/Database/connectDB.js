const mongoose = require("mongoose");

async function connectMongoDB() {
  await mongoose
    .connect(
      "mongodb+srv://makodelakshya101:bPhlIdN1sxa5Utne@cluster0.ui0br.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
      console.log("MongoDB Database is Connected");
    })
    .catch((error) => {
      console.log("Error connecting the Database: ", error);
    });
}

module.exports = connectMongoDB;
