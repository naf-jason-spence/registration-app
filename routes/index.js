const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const auth = require('http-auth');
const { body, check, validationResult } = require('express-validator/check');

const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd')
});
const router = express.Router();
const Registration = mongoose.model('Registration');

const appName = 'Simple Registration App';

// GET
router.get('/', (req, res) => {
    res.render('form', { title: `Home | ${appName}` });
});

// GET
router.get('/registrations', auth.connect(basic), (req, res) => {
    Registration.find()
        .sort({'create_date':'desc'})
        .then((registrations) => {
            res.render('index', { title: `Listing Registrations | ${appName}`, registrations });
        })
        .catch(() => {
            res.send('Sorry! Something went wrong.')
        });
});

// GET
router.get('/thank-you', (req, res) => {
    res.render('thankyou', {
        title: `Thank You | ${appName}`
    });
});

// POST
router.post('/', [
    check('name')
        .isLength({ min: 1, max: 30 })
        .withMessage('Full name format is wrong'),
    check('email')
        .isEmail()
        .withMessage('Email format is wrong')
], (req, res) => {

    const errors = validationResult(req);
    if(errors.isEmpty()) {
        const registration = new Registration(req.body);
        registration.save()
            .then(() => {
                res.render('thankyou', {
                    title: `Thank You | ${appName}`
                });
            })
            .catch(() => {
                res.send('Sorry! Something went wrong.');
            });
    } else {
        res.render('form', { 
            title: `Registration Form | ${appName}`,
            errors: errors.array(),
            data: req.body,
        });
    }

});

module.exports = router;