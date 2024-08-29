const express = require("express");
const User = require ("../models/user");


const saveUser = async (req, res, next) => {
    try {
        const username = await User.findOne({
            where: {
                username: req.body.username,
            },
        });

    
        const emailCheck = await User.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (username || emailCheck) {
            if (username && emailCheck) {
                return res.status(409).send({ usernameTaken: true, emailTaken: true});
            };
            if (username) {
                return res.status(409).send({ usernameTaken: true, message: "Ce pseudonyme est déjà pris."});
            };

            if (emailCheck) { 
                return res.status(409).send({ emailTaken: true, message: "cet email est déjà utilisé."})

            } ;


       
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    saveUser,
};