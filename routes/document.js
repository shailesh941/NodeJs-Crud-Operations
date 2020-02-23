var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var DocumentSchema = require('../models/document')
router.use(bodyParser.json());

router.post("/add", (req, res, next) => {
    console.log(req.body)
    const saveDoc = new DocumentSchema(req.body);
    

    saveDoc.save()
        .then(item => {
            console.log(item);
            res.status(200).json(item)
        res.send("item saved to database");
    }).catch(err => {
        console.log(err);
        res.status(400).send("unable to save to database");
    });


})




module.exports = router;