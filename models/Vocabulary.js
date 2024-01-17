const mongoose = require('mongoose')
const Schema = mongoose.Schema

const vocabularySchema = new Schema({
    eng: String,
    pronunciation: String,
    thai: String,
    number: Number,
}, {collation: "vocabulary"})

const Vocabulary = mongoose.model("Vocabulary", vocabularySchema)

module.exports = Vocabulary