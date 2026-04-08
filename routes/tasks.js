const express = require('express')
const router = express.Router()

const {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  reorderTasks,
} = require('../controllers/tasks')

router.route('/').get(getAllTasks).post(createTask)
router.route('/reorder').patch(reorderTasks)
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask)

module.exports = router
