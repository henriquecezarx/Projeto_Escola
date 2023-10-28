require('dotenv').config();
const express = require('express')
const app = express()
const path = require('path')
const handlebars = require('express-handlebars')
const router = express.Router()

//Handlebars
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

router.get('/', (req, res) => {
  const nomeDoUsuario = req.user.nome
  const classeSelecionada = req.user.classe
    res.render('alunos/principal', { nomeDoUsuario, classeSelecionada })
})

router.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/entrar');
      console.log('SAIU')
    });
  });

router.get('/exercicios/todasclasses', (req, res) => {
  const nomeDoUsuario = req.user.nome
  const classeSelecionada = req.user.classe
  res.render('alunos/exercicios/todas_classes/all_ex', { nomeDoUsuario, classeSelecionada })
})

router.get('/videoaulas/todasclasses', (req, res) => {
  const nomeDoUsuario = req.user.nome
  const classeSelecionada = req.user.classe
  res.render('alunos/videoaulas/todas_classes/all_video', { nomeDoUsuario, classeSelecionada })
})

router.get('/resumos/todasclasses', (req, res) => {
  const nomeDoUsuario = req.user.nome
  const classeSelecionada = req.user.classe
  res.render('alunos/resumos/todas_classes/all_res', { nomeDoUsuario, classeSelecionada })
})

module.exports = router