const express = require('express');
const app = express();
const cors = require('cors');

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
app.use(express.json());

require('dotenv').config();

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const uri = process.env.DATABASE_URI;

mongoose.connect(uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('db conneted');
})
.catch(error => {
    console.log(error.message);
});

app.get('/', (req, res) => {
    res.send('Hi Start on server');
});

app.use('/vocabulary', require('./routes/vocabularyRoute'));
app.use('/user', require('./routes/userRoute'));

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log('app run on port ', port);
});