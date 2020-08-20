const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const mongoURL =
	process.env.mongoURL ||
	'mongodb+srv://admin:pupkin1234@cluster0.irbym.mongodb.net/app?retryWrites=true&w=majority';

mongoose.connect(mongoURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/todoes', require('./routes/todoes/todoes.routes'));
app.use('/api/add', require('./routes/add/add.routes'));
app.use('/api/change', require('./routes/change/change.routes'));
app.use('/api/delete', require('./routes/delete/delete.routes'));
app.get('/', async (req, res) => {
	res.send(
		`App has been start ${PORT}, it's api, app: https://adiksit.github.io/todo-list/`
	);
});

app.listen(PORT, (req, res) =>
	console.log(`Server has been started port ${process.env.PORT}`)
);
