const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = require("../src/routes/router");

const env = dotenv.config();

const devUrl = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.zzejt.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const testUrl = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.zzejt.mongodb.net/${process.env.MONGO_DB_TEST}?retryWrites=true&w=majority`;

const hostname = process.env.HOST;
const port = process.env.PORT;

let mongoUrl;

if (process.env.NODE_ENV !== "test") {
  app.listen(port, hostname);
  mongoUrl = devUrl;
} else {
  mongoUrl = testUrl;
}

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose;
const dbConnection = db.connection;
dbConnection.on(
  "error",
  console.error.bind(console, "MongoDb connection error: ")
);

const corsOptions = {
  origin: [
    `http://${process.env.ORIGIN_HOST}:${process.env.ORIGIN_PORT}`,
    `http://${process.env.HOSTNAME}:${process.env.ORIGIN_PORT}`,
  ],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

console.log(`Server running at http://${hostname}:${port}`);

module.exports = {
  db,
  dbConnection,
};
