const express = require('express');
const router = express.Router();
const db = require('../models/index');

/* GET users listing. */
router.get('/', (req, res, next) => {
  db.user.findAll().then(usrs => {
    var data = {
      title: 'Users/Index',
      content: usrs
    }
    res.render('users/index', data);
  });
});

router.get('/login', (req, res, next) => {
  var data = {
    title: 'Users/Login',
    content: '名前とパスワードを入力ください'
  }
  res.render('users/login', data);
});

router.post('/login', (req, res, next) => {
  db.user.findOne({
    where: {
      name: req.body.name,
      pass: req.body.pass,
    }
  }).then(user => {
    if(user != null) {
      req.session.login = user;
      let back = req.session.back;
      if(back == null) {
        back = '/';
      }
      console.log("デバッグ");
      console.log(back);
      res.redirect(back);
    } else {
      var data = {
        title: 'Users/Login',
        content: '名前かパスワードに問題があります。再度入力ください。'
      }
      res.render('users/login', data);
    }
  });
});

router.get('/add',(req, res, next)=> {
  var data = {
    title: 'Users/Add'
  }
  res.render('users/add', data);
});

router.post('/add',(req, res, next)=> {
  db.sequelize.sync()
    .then(() => db.user.create({
      name: req.body.name,
      pass: req.body.pass,
      mail: req.body.mail,
      age: req.body.age
    }))
    .then(usr => {
      res.redirect('/users/login');
    });
});


module.exports = router;
