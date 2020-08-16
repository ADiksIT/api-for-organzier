const {Router} = require('express')
const router = new Router()
const Todo = require('../../models/Todo')

router.get('/:id/todo/:todo_id', async (req, res) => {
  try {
    const id = req.params.id;
    const todo_id = req.params.todo_id;

    const candidate = await Todo.findById(id);

    const year = new Date().getFullYear()

    candidate[year].some((todo, i) => {
      if (todo.id === todo_id) {
        candidate[year].splice(i, 1);
        return true
      }
    })

    await candidate.save();

    res.status(200).json({message: 'todo has been remove from list', candidate})
  } catch (error) {
    res.status(500).json({message: 'Error', error})
  }
})

module.exports = router
