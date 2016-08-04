'use strict'

const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const dataFilePath = path.join(__dirname, '../data/contacts.json')

exports.getAll = function(cb) {
  fs.readFile(dataFilePath, (err, buffer) => {
    if(err) return cb(err);

    let contacts;

    try {
      contacts = JSON.parse(buffer);
    } catch(err) {
      cb(err);
      return;
    }
    cb(null, contacts)
  });
}

exports.create = function(contactObj, cb) {
  this.getAll(function(err, contacts) {
    if(err) return cb(err);
    //
    // let newObj = {
    //   name: contactObj.name,
    //   type: contactObj.type,
    //   color: contactObj.color,
    //   id: uuid.v4()
    //   // time: moment(),
    // };
    contactObj.id = uuid.v4();
    console.log('contacts', contacts);
    contacts.push(contactObj);
    fs.writeFile(dataFilePath, JSON.stringify(contacts), function(err) {
      cb(err);
    });
  });
}

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


exports.delete = function(id, cb) {
  readContacts((err, contacts) => {
    if (err) return cb(err);
    contacts = contacts.filter(contactObj => contactObj.id !== id);
    writeContacts(contacts, cb);
    // contacts.map(contact, index => {
    //   if(contactObj.id === contactObj) {
    //     contacts.splice(index, 1);
    //     writeContacts(contacts, cb)
    //   }
    // })
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
