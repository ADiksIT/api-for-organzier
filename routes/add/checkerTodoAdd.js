const checkerTodoAdd = (todos, {date, time}) => {
  let status = false

  todos.some(todo => {
    if (todo.date.includes(date))
      if (todo.time.includes(time))
        return status = true
  })

  return status
}

module.exports = checkerTodoAdd
