const mongoose = require('mongoose')
mongoose.set('strictQuery', false)


// const url = process.env.MONGODB_URI
const password = "xyz"
// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
// const url =  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`
// const url = `mongodb+srv://basileu1:${password}@cluster0.kwdxku3.mongodb.net/?retryWrites=true&w=majority1`;

const url = `mongodb+srv://basileul1:${password}@azurecluster0.xomt459.mongodb.net/?retryWrites=true&w=majority`;


console.log('connecting to', url)

mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)