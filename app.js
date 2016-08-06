'use strict';

require('dotenv').config();

const PORT = process.env.PORT || 8000;

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const Contact = require('./models/contact')

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static('public'));

app.get('/', (req, res, next) => {
  Contact.getAll(function(err, contacts) {

    res.render('index', {title: "My Contact App", contacts});
  });
});
  app.get('/', function(req, res) {
    let indexPath = path.join(__dirname, 'index.html');
    res.sendFile(indexPath);
  });

  app.route('/contacts')
  .get((req, res) => {
    Contact.getAll(function(err, contacts) {
      if(err) {
        res.status(400).send(err);
      } else {
        res.send(contacts);
      }
    });
  })
  .post((req, res) => {
    console.log('req.body', req.body);
    Contact.create(req.body, function(err) {
      if(err) {
        res.status(400).send(err);
      } else {
        res.send();
      }
    });
  })
  app.route('/contacts/:id')
  .get((req, res) => {
    Contact.get(req.params.id, function(err) {
      if(err) return res.status(400).send(err);
      res.send(contacts);
    });
  })
  .put((req, res) => {
    let contactId = req.params.id
    let updateObj = req.body
    Contact.update(contactId, updateObj, function(err, newContact) {
      // if(err) return res.status(400).send(err);
      res.status(err ? 400: 200).send(err || newContact);
      // res.send(newContact);
    });
  })
  .delete((req, res) => {
    let contactId = req.params.id;

    Contact.remove(contactId, err => {
      res.status(err ? 400: 200).send(err);
      // res.send();
    });
  });

  app.listen(PORT, err => {
    console.log(err || `Server listening on port ${PORT}`);
  });
