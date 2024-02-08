const express = require('express')
const app = express()
const cors = require('cors')
const Vocabulary = require('./models/Vocabulary')
const User = require('./models/User')

const urlAllows = ['https://web-english-a03ff.web.app', 'http://localhost:5173'];
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

app.post('/user/add', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const uid = req.body.uid;
    const emailVerified = req.body.emailVerified;
    const newUser = new User({
        name: name,
        email: email,
        uid: uid,
        emailVerified: emailVerified,
        vocabulary: []
    })
    newUser.save()
        .then((user) => {
            if(user){
                res.status(200).json({message: 'add a user successfully', status: 200, user: user})
            }
        })
        .catch((error) => {
            const status = error.status
            res.status(status).json({message: `server error code: ${error.message}`, status: status})
        })
})

app.post('/user/vocabulary/add', (req, res) => {
    const name = req.body.name;
    const eng = req.body.eng;
    const thai = req.body.thai;
    const pronunciation = req.body.pronunciation;
    const number = req.body.number;
    User.findOne({name: name}, (err, user) => {
        if(err){
            res.status(500).json({ error: 'Internal Server Error', status: 500 })
        }
        if(user){
            user.vocabulary.addToSet({
                eng: eng,
                pronunciation: pronunciation,
                thai: thai,
                number: number
            })
            user.save()
                .then(savedUser => {
                    res.status(200).json({ message: 'User saved successfully', status: 200})
                })
                .catch(error => {
                    res.status(500).json({ error: `Error saving user code: ${error.message}`, status: 500})
                });
        }else{
            res.status(400).json({ message: 'user not found', status: 400 })
        }
    })
})

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log('app run on port ', port)
})
