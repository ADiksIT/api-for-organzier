const {Router} = require('express')
const router = new Router()
const Todo = require("../../models/Todo");
const checkerTodoAdd = require("./checkerTodoAdd");
const {dateChecker, timeChecker} = require('../../utils/allUtils')

router.post('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const {date, time, name, important = false, description = ''} = req.body;

    const candidate = await Todo.findById(id);

    if (!candidate) {
      return res.status(500).json({ message: 'candidate is not defined', candidate });
    }

    if (!date.match(dateChecker()) || !time.match(timeChecker())) {
      return res.status(500).json({ message: 'your date and time is not valid', date, time });
    }

    const year = new Date().getFullYear()

    if (checkerTodoAdd(candidate[year], {date, time})) {
      return res.status(500).json({ message: 'there is already an event at this time', date, time });
    }

    candidate[year].push({
      name, date, important, time, description
    })

    candidate.save();
    res.status(200).json({candidate})

  } catch (error) {
    res.status(500).json({message: 'Error', error})
  }
})

module.exports = router
