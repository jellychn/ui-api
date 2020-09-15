const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const cors = require('cors')({origin: true});
const db = admin.firestore();

const express = require('express');
const app = express();

app.get('/items', (req, res) => {
    cors(req, res, () => {
        db.collection('items').get().then(data => {
            let items = [];
            data.forEach(doc => {
                items.push(doc.data());
            });
            return res.json(items);
        }).catch(err => console.error(err));
    })
});

app.get('/item/:id', (req, res) => {
    console.log(req.params)
    cors(req, res, () => {
        db.collection('items').get().then(data => {
            let item = {};
            data.forEach(doc => {
                if (doc.data().id === req.params.id) {
                    item = doc.data();
                }
                // console.log(doc.data());
            });
            return res.json(item);
        }).catch(err => console.error(err));
    })
});

exports.api = functions.https.onRequest(app);