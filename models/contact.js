'use strict';

const db = require('../config/db');

const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const moment = require('moment');
const squel = require('squel').useFlavour('mysql');

const dataFilePath = path.join(__dirname, '../data/contacts.json');

db.query(`create table if not exists contacts (
  id int,
  firstName varchar(500),
  lastName varchar(500),
  email varchar(500),
  phone int,
  message varchar(500)
)`, err => {
  if(err) console.log('table create err:', err);
});

exports.getAll = function(cb) {
  let sql = squel.select().from('contacts').toString();
  db.query(sql, (err, AllContacts) => {
    cb(err, AllContacts);
  });
}
exports.create = function(newContactObj, cb) {
  // newContactObj.id = uuid.v4();

  let sql = squel.insert()
  .into('contacts')
  .setFields(newContactObj)
  .set('id', uuid())
  // .toString();
  // .set('id', newContactObj.id)
  // .set('firstName', newContactObj.firstName)
  // .set('lastName', newContactObj.lastName)
  // .set('email', newContactObj.email)
  // .set('phone', newContactObj.phone)
  // .set('messages', newContactObj.messages)
  .toString();

  db.query(sql, (err) => {
    cb(err)
  });
}

// exports.create = function(contactObj, cb) {
//   this.getAll(function(err, contacts) {
//     if(err) return cb(err);
//     contactObj.createAt = moment().format('MMMM Do YYYY, h:mm:ss a');
//     contactObj.id = uuid.v4();
//     console.log('contacts', contacts);
//     contacts.push(contactObj);
//     fs.writeFile(dataFilePath, JSON.stringify(contacts), function(err) {
//       cb(err);
//     });
//   });
// }

exports.update = (id, updateObj, cb) => {
  readContacts((err, contacts) => {
    if(err) return cb(err);
    // console.log('id:',id);
    let contact = contacts.filter(contactObj => contactObj.id === id)[0];
    console.log('contact:', contact);
    for(let key in updateObj) {

      contact[key] = updateObj[key];
    }
    contacts = contacts.filter(contactObj => contactObj.id !== id);
    contacts.push(contact)
    writeContacts(contacts, cb)
  })
};
//////// Another way to do above //////////////
// exports.update = (id, updateObj, cb) => {
//   let sqlUpdate = squel.update()
//   .table("contacts")
//   .set('id', newContactObj.id)
//   .set('firstName', newContactObj.firstName)
//   .set('lastName', newContactObj.lastName)
//   .set('email', newContactObj.email)
//   .set('phone', newContactObj.phone)
//   .set('messages', newContactObj.messages)
//   .toString()
//   // .setFields({
//   //   "firstName": newContactObj.firstName,
//   //   "lastName": newContactObj.lastName,
//   //   "email": newContactObj.email,
//   //   "phone": newContactObj.phone,
//   //   "messages": newContactObj.messages,
//     db.query(sqlUpdate, (err, contacts) => {
//       console.log('contacts', contacts);
//       cb(err, contacts)
//
//   })
// }

  exports.update = (id, updateObj, cb) => {
    readContacts((err, contacts) => {
      if(err) return cb(err);
      let contact = contacts.filter(contactObj => contactObj.id === id)[0];
      if(!contact) {
        return cb({error: "Contact not found"});
      }
      let index = contacts.indexOf(contact);
      for(let key in contact) {
        contact[key] = updateObj[key] || contact[key];
      }
      contacts[index] = contact;
      writeContacts(contacts, cb)
    })
  };

  // exports.remove = function(contactId, cb) {
  //   let sqlRemove = squel.delete()
  //   .from('contacts')
  //   .where(`id = "${contactId}"`)
  //   .toString()
  //   db.query(sqlRemove, (err, contacts) => {
  //     console.log('sqlRemove:', sqlRemove);
  //     cb(err, contacts);
  //   });
  // }

  exports.remove = function(contactId, cb) {
  readContacts((err, contacts) => {
    if (err) return cb(err);
    contacts = contacts.filter(contact => contact.id !== contactId);
    writeContacts(contacts, cb);
  })
}

  function readContacts(cb) {
    // read and parse
    fs.readFile(dataFilePath, (err, buffer) => {
      if(err) return cb(err);
      try {
        var contacts = JSON.parse(buffer);
      } catch(e) {
        var contacts = [];
      }
      cb(null, contacts);
    });
  }

  function writeContacts(contacts, cb) {
    fs.writeFile(dataFilePath, JSON.stringify(contacts), cb);
  }
