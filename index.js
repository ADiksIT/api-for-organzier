const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT;
const mongoURL = process.env.mongoURL;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/todoes', require('./routes/todoes/todoes.routes'));
app.use('/api/add', require('./routes/add/add.routes'));

const start = async () => {
  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(PORT, () =>
      console.log(`Server has been started port ${process.env.PORT}`),
    );
  } catch (e) {
    console.log('Error: ', e.message);
    process.exit(1);
  }
};

start();
