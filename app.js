const express = require('express')
const app = express()
const cors = require('cors')

const urlAllows = ['https://web-english-a03ff.web.app'];
app.use(cors({
    origin: function(origin, callback){
        if(!origin || urlAllows.includes(origin)){
            callback(null,true);
        }else{
            callback(new Error('Not allowed by CORS'));
        };
    },
}));
app.use(express.json())

const Vocabulary = require('./models/Vocabulary')
require('dotenv').config()


const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const uri = process.env.DATABASE_URI

mongoose.connect(uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('db conneted')
})
.catch(error => {
    console.log(error.message)
})

app.get('/', (req, res) => {
    res.send('Hi Start on server')
})

app.get('/vocabulary', async (req, res) => {
    try{
        const vocabulary = await Vocabulary.find()
        if(vocabulary !== null || vocabulary.length !== 0){
            res.status(200).json({status: 200, length: vocabulary.length, vocabulary: vocabulary})
        }
    }catch(error){
        res.status(500).json({status: 500, message: error.message})
    }
})

app.post('/add', async (req, res) => {
    const newVocabulary = new Vocabulary({
        eng: req.body.eng,
        pronunciation: req.body.pronunciation,
        thai: req.body.thai,
        number: req.body.number
    })
    try{
        const findEng = await Vocabulary.findOne({eng: req.body.eng})
        if(findEng === null){
            newVocabulary.save()
                .then(() => {
                    res.json({message: `${req.body.eng} ถูกเพิ่มแล้ว`, status: 200})
                })
                .catch(error => {
                    res.status(400).json({message: 'add vocabulary failed', error: error.message, status: 400})
                })
        }else{
            res.json({message: 'you have this it vocabulary', status: 404})
        }
    }catch(error){
        res.status(500).json({error: error.message, status: 500})
    }
})

app.post('/edit', async (req, res) => {
    try{
        await Vocabulary.findOneAndUpdate({number: req.body.number}, {
            eng: req.body.eng,
            pronunciation: req.body.pronunciation,
            thai: req.body.thai
        })
        res.status(200).json({status: 200, message: 'updated successfully'})
    }catch(error){
        res.status(500).json({status: 500, message: error.message})
    }
})

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log('app run on port ', port)
})
