const express = require('express')
const route = express.Router()
const Vocabulary = require('./models/Vocabulary');

route.get('/', async (req, res) => {
    try{
        const vocabulary = await Vocabulary.find()
        if(vocabulary !== null || vocabulary.length !== 0){
            res.status(200).json({status: 200, length: vocabulary.length, vocabulary: vocabulary})
        }
    }catch(error){
        res.status(500).json({status: 500, message: error.message})
    }
})

route.post('/add', async (req, res) => {
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

route.post('/edit', async (req, res) => {
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

export default route;
