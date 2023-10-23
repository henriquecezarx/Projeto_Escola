const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const UserModel = require('../Models/Usuario')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const SECRETAUTH = process.env.SECRETAUTH
require('dotenv').config();

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
                const token = jwt.sign({userId: user.id}, SECRETAUTH, {expiresIn: 50000})
                console.log(token)
                return done(null, user, {user, token})
            }else{
                return done(null, false, {message: 'Usuário e/ou Senha Inválidos'})
            }

        } catch(err){
            console.log(err)
            return done(err)
        }
    }))
    
    passport.serializeUser((user, done) => {
       return done(null, user)
    })
    
    passport.deserializeUser(async (user, done) => {
        try{
            return done(null, user)
        }catch(err){
            console.log(err)
            return done(err)
        }
    })
}