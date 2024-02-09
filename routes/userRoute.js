const express = require('express')
const route = express.Router()
const User = require('../models/User');

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
        res.status(500).json({error: `server error code: ${err}`, status: 500});
    };
});

route.post('/vocabulary/add', (req, res) => {
    const name = req.body.name;
    const eng = req.body.eng;
    const thai = req.body.thai;
    const pronunciation = req.body.pronunciation;
    const number = req.body.number;
    User.findOne({name: name}, (err, user) => {
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
                .then(savedUser => {
                    res.status(200).json({ message: 'User saved successfully', status: 200});
                })
                .catch(error => {
                    res.status(500).json({ error: `Error saving user code: ${error.message}`, status: 500});
                });
        }else{
            res.status(400).json({ message: 'user not found', status: 400 });
        };
    });
});

route.post('/imageUrl', async (req, res) => {
    try{
        const uid = req.body.uid;
        const findImageUrl = await User.findOne({ uid: uid });
        if(findImageUrl){
            res.status(200).json({message: 'find imageUrl successfully', status: 200, imageUrl: findImageUrl.imageUrl})
        }
    }
    catch(error){
        res.status(500).json({error: `server error code: ${error}`})
    }
});

module.exports = route;