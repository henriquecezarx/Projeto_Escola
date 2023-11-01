require('dotenv').config();
const express = require('express')
const app = express()
const path = require('path')
const handlebars = require('express-handlebars')
const router = express.Router()
const jwt = require('jsonwebtoken')
const SECRETAUTH = process.env.SECRETAUTH

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

const verifyJWT = (req, res, next) => {
  const token_auth = req.user.token_auth

  if (token_auth){
    jwt.verify(token_auth, SECRETAUTH, (err, decoded) => {
      if(err){
        console.log('Erro na Verificação do Token: ',err)
        res.redirect('/alunos')
      }else{
        req.user = decoded
        next()
      }
    })
  } else{
    console.log('Token JWT ausente. Redirecionando...')
    res.redirect('/entrar')
  }
}

//Handlebars
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

router.get('/', authenticationMiddleware, (req, res) => {
    const nomeDoUsuario = req.user.nome
    const classeSelecionada = req.user.classe
    res.render('alunos/principal', { nomeDoUsuario, classeSelecionada })
})

router.get('/exercicios/todasclasses', authenticationMiddleware, verifyJWT, (req, res) => {
  const nomeDoUsuario = req.user.nome
  const classeSelecionada = req.user.classe
  res.render('alunos/exercicios/todas_classes/all_ex', { nomeDoUsuario, classeSelecionada })
})

router.get('/videoaulas/todasclasses', verifyJWT, (req, res) => {
  const nomeDoUsuario = req.user.nome
  const classeSelecionada = req.user.classe
  res.render('alunos/videoaulas/todas_classes/all_video', { nomeDoUsuario, classeSelecionada })
})

router.get('/resumos/todasclasses', verifyJWT, (req, res) => {
  const nomeDoUsuario = req.user.nome
  const classeSelecionada = req.user.classe
  res.render('alunos/resumos/todas_classes/all_res', { nomeDoUsuario, classeSelecionada })
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

module.exports = router