const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newVocabulary = new Schema({
    eng: String,
    pronunciation: String,
    thai: String,
    number: String,
})
const userSchema = new Schema({
    name: String,
    newName: String,
    email: String,
    uid: String,
    emailVerified: Boolean,
    imageUrl: String,
    vocabulary: [newVocabulary]
})

const User = mongoose.model('Users', userSchema)

module.exports = User