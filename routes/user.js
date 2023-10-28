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

app.use((req, res, next) => {
  if(req.isAuthenticated()){
    app.locals.nomeDoUsuario = req.user.nome
    app.locals.classeSelecionada = req.user.classeSelecionada

  }else{
    app.locals.nomeDoUsuario = null
    app.locals.classeSelecionada = null
  }
  next()
})

router.get('/', (req, res) => {
  res.render('alunos/principal', { nomeDoUsuario: app.locals.nomeDoUsuario, classeSelecionada: app.locals.classeSelecionada })
})

router.post('/logout', function(req, res, next){
    req.logOut(function(err) {
      if (err) { return next(err); }
      res.redirect('/entrar');
      console.log('SAIU')
    });
  });

router.get('/exercicios/todasclasses', (req, res) => {
  res.render('alunos/exercicios/todas_classes/all_ex', {nomeDoUsuario: app.locals.nomeDoUsuario, classeSelecionada: app.locals.classeSelecionada})
})

router.get('/videoaulas/todasclasses', (req, res) => {
  res.render('alunos/videoaulas/todas_classes/all_video', {nomeDoUsuario: app.locals.nomeDoUsuario, classeSelecionada: app.locals.classeSelecionada})
})

router.get('/resumos/todasclasses', (req, res) => {
  res.render('alunos/resumos/todas_classes/all_res', {nomeDoUsuario: app.locals.nomeDoUsuario, classeSelecionada: app.locals.classeSelecionada})
})

module.exports = router