import mongoose from 'mongoose';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import home from './app/api/home';
import recipe from './app/api/recipe';

export const app = express();
export const env = dotenv.config();

const url = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.zzejt.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDb connection error: '));

const corsOptions = {
  origin: [`http://${process.env.ORIGIN_HOST}:${process.env.ORIGIN_PORT}`, `http://${process.env.HOSTNAME}:${process.env.ORIGIN_PORT}`]
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', home);
app.use('/api/recipes', recipe);

const hostname = process.env.HOST;
const port = process.env.PORT;

app.listen(port, function() {
    console.log(`Server running at http://${hostname}:${port}`);
});