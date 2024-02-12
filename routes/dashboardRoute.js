const express = require('express');
const route = express.Router();
const User = require('../models/User')

route.get('/:username', async (req, res) => {
    try{
        const name = req.params.username;
        const userCredential = await User.findOne({name: name});
        if(userCredential !== null){
            res.status(200).json({message: 'find user successfully', status: 200, vocabulary: userCredential.vocabulary});
        }else{
            res.status(400).json({message: 'not find user', status: 400});
        }
    }
    catch(error){
        res.status(500).json({error: 'server error find user in mongoose', code: error, status: 500});
    }
})

module.exports = route;