const { Schema, model } = require('mongoose');

const year = new Date().getFullYear();

const todo = new Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  name: { type: String, required: true },
  important: { type: Boolean, required: true },
  description: {type: String, required: false}
});

const schema = new Schema({
  _creator: { type: Number, ref: 'User' },
  [year]: [todo],
});

module.exports = model('Todo', schema);
