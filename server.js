const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Mountain = require('./app/models/mountain');

require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

//MONGODB CONNECTION
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('MongoDB is working!');
});

//ROUTES FOR API
router.use((req, res, next) => {
    console.log('Something is going on...');
    next();
});

router.get('/', (req, res) => {
    res.json({ message: 'Hey there, buckaroo!' });
});

router.route('/mountains')
    .post((req, res) => {

        const mountain = new Mountain();
        mountain.name = req.body.name;
        mountain.height = req.body.height;

        console.log(req.body.name);

        mountain.save((err) => {
            if (err) {
                res.send(err);
            } else {
                res.json({ message: 'Mountain erected!' })
            }
        });

    })

    .get((req, res) => {

        Mountain.find((err, mountains) => {
            if (err) {
                res.send(err);
            } else {
                res.json(mountains);
            }
        })

    });

router.route('/mountains/:mountain_id')
    .get((req, res) => {

        Mountain.findById(req.params.mountain_id, (err, mountain) => {
            if (err) {
                res.send(err);
            } else {
                res.json(mountain);
            }
        });

    })

    .put((req, res) => {

        Mountain.findById(req.params.mountain_id, (err, mountain) => {
            if (err) {
                res.send(err);
            } else {
                mountain.name = req.body.name;
                mountain.height = req.body.height;
            }

            mountain.save((err) => {
                if (err) {
                    res.send(err);
                } else {
                    res.json({ message: 'Mountain updated!' });
                }
            })
        });

    })

    .delete((req, res) => {

        Mountain.remove({
            _id: req.params.mountain_id
        }, (err, mountain) => {
            if (err) {
                res.send(err);
            } else {
                res.json({ message: 'Mountain deleted!' });
            }
        });

    });

app.use('/api', router);

//SERVER SETUP
app.listen(PORT, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`We are in business on port: ${PORT}`)
    }
});