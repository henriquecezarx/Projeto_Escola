require('dotenv').config();
const passport = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const UserModel = require('../Models/Usuario')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const SECRETAUTH = process.env.SECRETAUTH

module.exports = function(){
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'senha'
    }, async (username, password, done) => {
        try{
            const user = await UserModel.findOne({username: username})

            if(!user){
                return done(null, false, {message: 'Usuário e/ou Senha Inválidos'})
            }

            if(!user.senha){
                return done(null, false, {message: 'Usuário e/ou Senha Inválidos'})
            }

            const isMatch = await bcrypt.compare(password, user.senha)

            if(isMatch){
                const token_auth = jwt.sign({userId: user.id}, SECRETAUTH, {expiresIn: '5h'})
                console.log(token_auth)
                return done(null, user, {user, token_auth: token_auth})
            }else{
                return done(null, false, {message: 'Usuário e/ou Senha Inválidos'})
            }

        } catch(err){
            console.log(err)
            return done(err)
        }
    }))
    
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserModel.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
})
}
