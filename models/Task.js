const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'must provide name'],
    trim: true,
    maxlength: [20, 'name can not be more than 20 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
})

module.exports = mongoose.model('Task', TaskSchema)
