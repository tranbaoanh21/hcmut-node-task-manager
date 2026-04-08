const Task = require('../models/Task')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')

const withFallbackPriority = (tasks) => {
  return tasks.map((task, index) => {
    const taskObject = task.toObject()
    if (Number.isInteger(taskObject.priority)) {
      return taskObject
    }

    return { ...taskObject, priority: index + 1 }
  })
}

const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({}).sort({ priority: 1, _id: 1 })
  res.status(200).json({ tasks: withFallbackPriority(tasks) })
})

const createTask = asyncWrapper(async (req, res) => {
  const lastTask = await Task.findOne({ priority: { $type: 'number' } })
    .sort({ priority: -1 })
    .select('priority')
  const nextPriority = lastTask ? lastTask.priority + 1 : 1
  const task = await Task.create({ ...req.body, priority: nextPriority })
  res.status(201).json({ task })
})

const getTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params
  const task = await Task.findOne({ _id: taskID })
  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404))
  }

  res.status(200).json({ task })
})
const deleteTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params
  const task = await Task.findOneAndDelete({ _id: taskID })
  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404))
  }
  res.status(200).json({ task })
})
const updateTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params

  const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
    new: true,
    runValidators: true,
  })

  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404))
  }

  res.status(200).json({ task })
})

const reorderTasks = asyncWrapper(async (req, res, next) => {
  const { orderedTaskIds } = req.body

  if (!Array.isArray(orderedTaskIds) || orderedTaskIds.length === 0) {
    return next(createCustomError('orderedTaskIds must be a non-empty array', 400))
  }

  const uniqueTaskIds = [...new Set(orderedTaskIds)]
  if (uniqueTaskIds.length !== orderedTaskIds.length) {
    return next(createCustomError('orderedTaskIds contains duplicate values', 400))
  }

  const existingTasks = await Task.find({ _id: { $in: orderedTaskIds } }).select('_id')
  if (existingTasks.length !== orderedTaskIds.length) {
    return next(createCustomError('Some task ids are invalid', 400))
  }

  const bulkOperations = orderedTaskIds.map((taskID, index) => ({
    updateOne: {
      filter: { _id: taskID },
      update: { priority: index + 1 },
    },
  }))

  await Task.bulkWrite(bulkOperations)
  const tasks = await Task.find({}).sort({ priority: 1, _id: 1 })

  res.status(200).json({ tasks })
})

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  reorderTasks,
}
