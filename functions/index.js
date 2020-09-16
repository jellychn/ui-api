const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

const express = require('express');
const app = express();

const allowCrossOriginRequests = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
};
app.use(allowCrossOriginRequests);

app.post('/items', (req, res) => {
    db.collection('items').get().then(data => {
        let search = [];
        let refine = [];
        let items = [];

        data.forEach(doc => {
            if (req.body.q.length > 0) {
                if (new RegExp(`.*${req.body.q}.*`, "i").test(doc.data().name) || new RegExp(`.*${req.body.q}.*`, "i").test(doc.data().category)) {
                    search.push(doc.data());
                } else {
                    if (Object.keys(doc.data().colors).includes(req.body.q.toLowerCase())) {
                        search.push(doc.data());
                    }
                }
            } else {
                search.push(doc.data());
            }
        });

        search.forEach(doc => {
            if (req.body.category === '') {
                refine.push(doc);
            } else {
                if (req.body.category.toLowerCase() === doc.category.toLowerCase() ) {
                    refine.push(doc);
                }
            }
        });

        refine.forEach(doc => {
            if (req.body.gender === 'all') {
                items.push(doc);
            } else {
                if (req.body.gender === doc.gender) {
                    items.push(doc);
                }
            }
        });
        return res.json(items);
    }).catch(err => console.error(err));
});

app.get('/item/:id', (req, res) => {
    db.collection('items').get().then(data => {
        let item = {};
        data.forEach(doc => {
            if (doc.data().id === req.params.id) {
                item = doc.data();
            }
        });
        return res.json(item);
    }).catch(err => console.error(err));
});


exports.api = functions.https.onRequest(app);