const express = require('express')
const app = express()
const path = require('path')
const handlebars = require('express-handlebars')
const router = express.Router()
const passport = require('passport')
require('dotenv').config();

//Handlebars
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

router.get('/exercicios',(req, res) => {
    res.render('alunos/exercicios')
})

router.get('/resumos', (req, res) => {
    res.render('alunos/resumos')
})

router.get('/', (req, res) => {
    const classeSelecionada = req.user.classe
    const nomeDoUsuario = req.user.nome
    res.render('alunos/principal', { nomeDoUsuario , classeSelecionada })
})

router.post('/logout', function(req, res, next){
    req.logOut(function(err) {
      if (err) { return next(err); }
      res.redirect('/entrar');
      console.log('SAIU')
    });
  });

module.exports = router