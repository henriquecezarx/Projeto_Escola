require('dotenv').config();
const express = require('express')
const app = express()
const path = require('path')
const handlebars = require('express-handlebars')
const router = express.Router()

//Middleware
const authenticationMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
      const token_auth = req.user.token_auth; // Suponhamos que o token JWT esteja armazenado em req.user
      req.token_auth = token_auth; // Armazena o token no objeto de solicitação
      console.log('Usuário Autenticado. Permitindo acesso...')
      next();
  } else {
      console.log('Usuário Não Autenticado. Redirecionando...')
      res.redirect('/entrar');
  }
};

//Handlebars
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

router.get('/', authenticationMiddleware, (req, res) => {
  const nomeDoUsuario = req.user.nome
  const classeSelecionada = req.user.classe
    res.render('alunos/principal', { nomeDoUsuario, classeSelecionada })
})

router.post('/logout', (req, res) => {
  req.logOut((err) => {
    if(err){
      console.log(err)
      return next(err)
    }else{
      res.redirect('/entrar')
      console.log('SAIU')
    }
  })
})


router.get('/exercicios/todasclasses', authenticationMiddleware, (req, res) => {
  const nomeDoUsuario = req.user.nome
  const classeSelecionada = req.user.classe
  res.render('alunos/exercicios/todas_classes/all_ex', { nomeDoUsuario, classeSelecionada })
})

router.get('/videoaulas/todasclasses', authenticationMiddleware, (req, res) => {
  const nomeDoUsuario = req.user.nome
  const classeSelecionada = req.user.classe
  res.render('alunos/videoaulas/todas_classes/all_video', { nomeDoUsuario, classeSelecionada })
})

router.get('/resumos/todasclasses', authenticationMiddleware, (req, res) => {
  const nomeDoUsuario = req.user.nome
  const classeSelecionada = req.user.classe
  res.render('alunos/resumos/todas_classes/all_res', { nomeDoUsuario, classeSelecionada })
})

module.exports = router