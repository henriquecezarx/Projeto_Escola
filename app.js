require('dotenv').config();
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const path = require('path')
const usuario = require('./routes/user')
const passport = require('passport')
const { urlencoded } = require('body-parser')
const validator = require('validator')
const UserModel = require('./Models/Usuario')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET
const authConfig = require('./config/auth')

//Session
app.use(session({
    secret: "henrique12345678",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 5 * 60 * 1000,
        httpOnly: false
    }
}))

//Middlewares
app.use(passport.initialize())
app.use(passport.session())
authConfig()
app.use(flash())
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

const authenticationMiddleware = (req, res, next) => {
    if(req.isAuthenticated()){
        console.log('Usuário autenticado. Permitindo acesso...')
        next()
    }else{
        console.log('Usuário não autenticado. Redirecionando...')
        res.redirect('/entrar')
    }
}

//Body Parser
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//Handlebars
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

//Public
app.use(express.static(path.join(__dirname, "public")))

//Mongoose
mongoose.Promise = global.Promise
const MONGODB_URI = process.env.MONGODB_URI
mongoose.connect(MONGODB_URI).then(() => {
    console.log('Conectado ao MongoDB')
}).catch((err) => {
    console.log(err)
})

//Main Route
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/criar', (req, res) => {
    res.render('criar')
})

app.post('/criar', (req, res) => {

    var erros = []

    if(!req.body.username){
        erros.push({texto: 'Nome de Usuário Inválido'})
    } 
    if(req.body.username.length < 4){
        erros.push({texto: 'Mínimo de 4 Números para Usuário'})
    }
    if (!/^\d+$/.test(req.body.username)) {
        erros.push({ texto: 'Apenas Números no Usuário'});
    }
    if(!req.body.name || req.body.name.length < 3){
        erros.push()
    }
    if(!req.body.email || !validator.isEmail(req.body.email)){
        erros.push({texto: 'E-mail Inválido'})
    }
    if(!req.body.senha){
        erros.push({texto: 'Senha Inválida'})
    }
    if(req.body.senha.length < 4){
        erros.push({texto: 'Senha Muito Curta'})
    }
    
    if(!req.body.classe || req.body.classe == 'Selecione sua Classe'){
        erros.push({texto: 'Selecione sua Classe'})
    }

    if (erros.length > 0) {
        res.render('criar', { erros: [erros[0]]});
    }

    else{
        UserModel.findOne({$or: [{username: req.body.username}, {email: req.body.email}]}).lean().then((usuarioExistente) => {
            if (usuarioExistente){
                res.render('criar', {usuarioExistente: usuarioExistente})
            }else{
                bcrypt.hash(req.body.senha, 10, (err, hashedPassword) => {
                    if(err){
                        console.log(err)
                        res.render('criar')
                    }else{
                        const novoUsuario = new UserModel({
                            username: req.body.username,
                            nome: req.body.name,
                            email: req.body.email,
                            classe: req.body.classe,
                            senha: hashedPassword,
                        }).save().then(() => {
                            const nomeDoUsuario = req.body.name
                            const classeSelecionada = req.body.classe
                            const token = jwt.sign({userId: 1}, SECRET, {expiresIn: 5000})
                            const successMessage = 'Usuário Cadastrado com Sucesso'
                            res.render('entrar', {success_msg: successMessage, token, nomeDoUsuario, classeSelecionada})
                            console.log(token)
                        }).catch((err) => {
                            console.log(err)
                            res.render('criar', {err: err})
                        })
                    }
                })
            }
        })
    }
})                          

app.get('/entrar', (req, res) => {
    res.render('entrar', { message: req.flash('error')});
  });
  
app.post('/entrar', passport.authenticate('local', {
    successRedirect: '/alunos',
    failureRedirect: '/entrar',
    failureFlash: true
}))

app.get('/forgetpassword', (req, res) => {
    res.render('esquecer_senha')
})

//Routes
app.use('/alunos', authenticationMiddleware, usuario)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Conectado na URL: http://localhost:${PORT}`)
})