const mongoose = require('mongoose')

const connectDB = (url = process.env.MONGO_URI) => {
  if (!url) {
    throw new Error('Missing MONGO_URI. Please add MongoDB Atlas connection string in .env')
  }

  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}

module.exports = connectDB
