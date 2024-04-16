require("dotenv").config();
const express = require("express");
const connectDB = require("./config/databaseConnection");
const cors = require("cors"); // Import CORS package
const mongoose = require("mongoose");

// create express app
const app = express();

connectDB();

// connect to database
const PORT = process.env.PORT || 3000;

// Allowing all origins to make a request to this beckend
app.use(
  cors({
    origin: "http://localhost:3000", // Consider specifying actual origins for better security
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cors());

// for hanlding urlencoded data, means form data
app.use(express.urlencoded({ extended: false }));
// for handling json data submission
app.use(express.json());
// settings routes
app.use("/login", require("./routes/auth"));
app.use("/getProfileDetails", require("./routes/userProfile"));
app.use("/updateCCTVIps", require("./routes/cctv"));

mongoose.connection.once("open", () => {
  console.log("Connected to MonogoDB");
  // app is listening on this port
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
