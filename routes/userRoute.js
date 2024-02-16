const express = require('express')
const route = express.Router()
const User = require('../models/User');
require('dotenv').config()
route.post('/add', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const uid = req.body.uid;
    const emailVerified = req.body.emailVerified;
    const imageUrl = req.body.imageUrl;
    try{
        const findUser = await User.findOne({name: name})
        if(findUser === null){
            const newUser = new User({
                name: name,
                newName: '',
                email: email,
                uid: uid,
                emailVerified: emailVerified,
                imageUrl: imageUrl,
                vocabulary: []
            });
            newUser.save()
                .then((user) => {
                    if(user){
                        res.status(200).json({message: 'add a user successfully', status: 200, user: user});
                    };
                })
                .catch((error) => {
                    const status = error.status;
                    res.status(status).json({message: `server error code: ${error.message}`, status: status});
                });
        };
    }
    catch(error){
        res.status(500).json({error: `server error code: ${error}`, status: 500});
    };
});

route.post('/vocabulary/add', (req, res) => {
    const uid = req.body.uid;
    const eng = req.body.eng;
    const thai = req.body.thai;
    const pronunciation = req.body.pronunciation;
    const number = req.body.number;
    
    User.findOne({uid: uid}, (err, user) => {
        if(err){
            res.status(500).json({ error: 'Internal Server Error', status: 500 })
        };
        if(user){
            user.vocabulary.addToSet({
                eng: eng,
                pronunciation: pronunciation,
                thai: thai,
                number: number
            })
            user.save()
                .then((saveVocabulary) => {
                    res.status(200).json({ message: 'User saved successfully', status: 200, newVocabulary: saveVocabulary});
                })
                .catch(error => {
                    res.status(500).json({ error: `Error saving user code: ${error.message}`, status: 500});
                });
        }else{
            res.status(400).json({ message: 'user not found', status: 400 });
        };
    });
});

route.post('/vocabulary/edit', async (req, res) => {
    const name = req.body.name;
    const eng = req.body.eng;
    const pronunciation = req.body.pronunciation;
    const thai = req.body.thai;
    const newEng = req.body.newEng;
    try{
        const findAndUpdateVocabulary = await User.findOneAndUpdate(
            {name: name, "vocabulary.eng": eng},
            {$set: {'vocabulary.$.eng': newEng,
                'vocabulary.$.pronunciation': pronunciation,
                'vocabulary.$.thai': thai
                }
            },
            {new: true}
        );
        if(findAndUpdateVocabulary){
            res.status(200).json({message: 'find end successully', vocabulary: findAndUpdateVocabulary.vocabulary, status: 200})
        }
    }
    catch(error){
        const code = error.code;
        res.status(500).json({error: 'server error', code: code, status: 500});
    }
})

route.post('/vocabulary/delete', async (req, res) => {
    const name = req.body.name;
    const eng = req.body.eng;
    try{
        const findAndDelete = await User.findOneAndUpdate(
            {name: name},
            {$pull: {vocabulary: {eng: eng}}},
            {new: true}
        )
        if(findAndDelete){
            res.status(200).json({message: 'delete successfully', vocabulary: findAndDelete, status: 200});
        }
    }
    catch(error){
        const code = error.code;
        res.status(500).json({error: 'server error', code: code, status: 500})
    }
})

route.post('/status', async (req, res) => {
    try{
        const email = req.body.email;
        const uid = req.body.uid;
        const emailAdmin = process.env.IS_EMAIL;
        const findUser = await User.findOne({uid: uid});
        if(findUser){
            if(email === emailAdmin){
                res.status(200).json({statusOnApp: 'Admin', status: 200, user: findUser});
            }else{
                res.status(200).json({statusOnApp: 'Client', status: 200, user: findUser});
            };
        }else{
            res.status(400).json({message: "don't find user", status: 400})
        }
    }
    catch(error){
        res.status(500).json({error: 'server error', code: error, status: 500})
    }
});

module.exports = route;