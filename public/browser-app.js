const tasksDOM = document.querySelector('.tasks')
const loadingDOM = document.querySelector('.loading-text')
const formDOM = document.querySelector('.task-form')
const taskInputDOM = document.querySelector('.task-input')
const formAlertDOM = document.querySelector('.form-alert')
const reorderAlertDOM = document.querySelector('.reorder-alert')
let draggedTaskID = null
// Load tasks from /api/tasks
const showTasks = async () => {
  loadingDOM.style.visibility = 'visible'
  try {
    const {
      data: { tasks },
    } = await axios.get('/api/v1/tasks')
    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>'
      loadingDOM.style.visibility = 'hidden'
      return
    }
    const allTasks = tasks
      .map((task) => {
        const { completed, _id: taskID, name, priority } = task
        const taskPriority = Number.isInteger(priority) ? priority : '-'
        return `<div class="single-task ${completed && 'task-completed'}" draggable="true" data-id="${taskID}">
<h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
<div class="task-links">

    <small class="task-priority">#${taskPriority}</small>



<!-- edit link -->
<a href="task.html?id=${taskID}"  class="edit-link">
<i class="fas fa-edit"></i>
</a>
<!-- delete btn -->
<button type="button" class="delete-btn" data-id="${taskID}">
<i class="fas fa-trash"></i>
</button>
</div>
</div>`
      })
      .join('')
    tasksDOM.innerHTML = allTasks
    attachDragAndDropHandlers()
  } catch (error) {
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>'
  }
  loadingDOM.style.visibility = 'hidden'
}

showTasks()

const getDraggedOverTask = (container, y) => {
  const draggableTasks = [
    ...container.querySelectorAll('.single-task:not(.dragging)'),
  ]

  return draggableTasks.reduce(
    (closest, task) => {
      const box = task.getBoundingClientRect()
      const offset = y - box.top - box.height / 2

      if (offset < 0 && offset > closest.offset) {
        return { offset, element: task }
      }

      return closest
    },
    { offset: Number.NEGATIVE_INFINITY, element: null }
  ).element
}

const showReorderMessage = (message, isSuccess = true) => {
  if (!reorderAlertDOM) return

  reorderAlertDOM.textContent = message
  reorderAlertDOM.classList.remove('text-danger', 'text-success')
  reorderAlertDOM.classList.add(isSuccess ? 'text-success' : 'text-danger')
  reorderAlertDOM.style.visibility = 'visible'

  setTimeout(() => {
    reorderAlertDOM.style.visibility = 'hidden'
  }, 2000)
}

const persistOrder = async () => {
  const orderedTaskIds = [...tasksDOM.querySelectorAll('.single-task')].map(
    (task) => task.dataset.id
  )

  if (orderedTaskIds.length < 2) return

  try {
    await axios.patch('/api/v1/tasks/reorder', { orderedTaskIds })
    await showTasks()
    showReorderMessage('Task order updated')
  } catch (error) {
    await showTasks()
    showReorderMessage('Unable to save task order', false)
  }
}

const attachDragAndDropHandlers = () => {
  const draggableTasks = tasksDOM.querySelectorAll('.single-task')

  draggableTasks.forEach((task) => {
    task.addEventListener('dragstart', () => {
      task.classList.add('dragging')
      draggedTaskID = task.dataset.id
    })

    task.addEventListener('dragend', async () => {
      task.classList.remove('dragging')

      if (!draggedTaskID) return
      draggedTaskID = null
      await persistOrder()
    })
  })
}

tasksDOM.addEventListener('dragover', (e) => {
  e.preventDefault()

  const draggingTask = tasksDOM.querySelector('.dragging')
  if (!draggingTask) return

  const nextTask = getDraggedOverTask(tasksDOM, e.clientY)
  if (!nextTask) {
    tasksDOM.appendChild(draggingTask)
    return
  }

  tasksDOM.insertBefore(draggingTask, nextTask)
})

// delete task /api/tasks/:id

tasksDOM.addEventListener('click', async (e) => {
  const el = e.target
  if (el.parentElement.classList.contains('delete-btn')) {
    loadingDOM.style.visibility = 'visible'
    const id = el.parentElement.dataset.id
    try {
      await axios.delete(`/api/v1/tasks/${id}`)
      showTasks()
    } catch (error) {
      console.log(error)
    }
  }
  loadingDOM.style.visibility = 'hidden'
})

// form

formDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  const name = taskInputDOM.value

  try {
    await axios.post('/api/v1/tasks', { name })
    showTasks()
    taskInputDOM.value = ''
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, task added`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    formAlertDOM.style.display = 'block'
    formAlertDOM.innerHTML = `error, please try again`
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})
