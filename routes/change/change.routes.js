const {Router} = require('express')
const router = new Router()
const Todo = require("../../models/Todo");
const checkerTodoAdd = require("../add/checkerTodoAdd");
const {timeChecker} = require("../../utils/allUtils");
const {dateChecker} = require("../../utils/allUtils");

const changeFieldInTodo =  async (req, res, field) => {
  try {
    const id = req.params.id;
    const todo_id = req.params.todo_id;

    const data = req.body[field];

    const candidate = await Todo.findById(id);

    if (!candidate) {
      return res.status(500).json({ message: 'candidate is not defined', candidate });
    }


    const year = new Date().getFullYear()

    if (field === 'date') {
      if (!data.match(dateChecker())) {
        return res.status(500).json({ message: 'your date is not valid', [field] : data });
      }
    }

    if (field === 'time') {
      if (!data.match(timeChecker())) {
        return res.status(500).json({ message: 'your time is not valid', [field] : data });
      }
      let date = 0;
      candidate[year].some(todo => {
        if (todo.id === todo_id) {
          date = todo.date;
          return true
        }
      })

      if (checkerTodoAdd(candidate[year], {date, [field] : data} )) {
        return res.status(500).json({ message: 'there is already an event at this time', [field] : data });
      }
    }

    candidate[year].some(todo => {
      if (todo.id === todo_id) {
        todo[field] = data;
        return true
      }
    })

    await candidate.save();

    res.status(200).json({message: 'todo has been changes', todos: candidate})

  } catch (error) {
    res.status(500).json({message: 'Error', error})
  }
}

router.post('/:id/todo/:todo_id/important', (req, res) => changeFieldInTodo(req, res, 'important'))
router.post('/:id/todo/:todo_id/description', (req, res) => changeFieldInTodo(req, res, 'description'))
router.post('/:id/todo/:todo_id/name', (req, res) => changeFieldInTodo(req, res, 'name'))
router.post('/:id/todo/:todo_id/date', (req, res) => changeFieldInTodo(req, res, 'date'))
router.post('/:id/todo/:todo_id/time', (req, res) => changeFieldInTodo(req, res, 'time'))

module.exports = router
