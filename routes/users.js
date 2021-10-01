const express = require("express");
const router = express.Router();
const User = require('./../models/User');
const bcrypt = require('bcrypt');
const path = require('path');
const saltRounds = 10;



router.post('/register', async function(req, res){
    let newUser = req.body;
    let oldPassword = newUser.password;
    await bcrypt.hash(oldPassword, saltRounds, async function(err, hash) {
        if(err) return res.status(500).send('Error in password hashing');

        newUser.password = hash;
        try{
            await User.create(newUser);
            return res.status(201).send({msg: 'user saved successfully'});
        }catch(err){
            console.error(err);
            if(err) return res.status(500).send('Error in registering user');
        }
    });
});

router.post('/login', async function(req, res){
    let email = req.body.email;
    let password = req.body.password;
    let user = await User.findOne({email});
    if(user){
        bcrypt.compare(password, user.password, function(err, result) {
            if(result == true){
                return res.status(200).send({name: user.name, email: user.email})
            }else{
                return res.status(401).send('no user found')
            }
        });
    }else{
        return res.status(401).send('no user found with email')
    }
});

// get all users
router.get('/', async (req,res)=>{
    try{
        let users = await User.find();
        return res.send({users});
    }catch(err){
        console.error(err);
        return res.status(500).send('Error Occured');
    }
});

module.exports = router;