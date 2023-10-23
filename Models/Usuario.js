const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserModel = new Schema({
    username: {
        type: String,
        require: true
    },
    nome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    senha: {
        type: String, 
        require: true
    },
    classe: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('usuarios', UserModel)