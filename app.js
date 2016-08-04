'use strict'

const PORT = process.env.PORT || 3000;

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const Contact = require('./models/contact')

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static('public'));

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
    Contact.update(req.params.id, req.body, function(err) {
      if(err) return res.status(400).send(err);
      res.send();
  });
})
  .delete((req, res) => {
    Contact.delete(req.params.id, function(err) {
      if(err) return res.status(400).send(err);
      res.send();
  })
});

app.listen(PORT, err => {
  console.log(err || `Server listening on port ${PORT}`);
});
