"use strict";

$(document).ready(init);
console.log('working');

var contacts = [];
var editing = false;

function init(){

  $('table').on('click', '.delete', deleteContact);


  loadFromStorage();
  updateList();
  $("#newContact").submit(addContact);
  $("tbody").on("click", ".trashButton", deleteContact);
  $("tbody").on("click", ".edit", editContact);
}


function deleteContact() {
  console.log('click');
}

function saveToStorage() {
  localStorage.contacts = JSON.stringify(contacts);
}

function loadFromStorage() {
  if(!localStorage.contacts) {
    localStorage.contacts = '[]';
  }

  let contactId = $(this).closest('tr').data('id');
  $.ajax(`/contacts`, {
    method: 'GET'
  })
  .done(() => {
    console.log('loadFromStorge!');
    renderList();
  })
  .fail(err => {
    console.log('err', err);
    // contacts = JSON.parse(localStorage.contacts);
  });
  // contacts = JSON.parse(localStorage.contacts);
}

function addContact(event){
  event.preventDefault();

  if (editing){
    return;
  }
  var types = [];
  $("input:checkbox[name=contactType]:checked").each(function(){
    types.push($(this).val());
  });

  let contact = {};
  contact["firstName"] = $('#firstName').val();
  contact["lastName"] = $('#lastName').val();
  contact["phone"] = $('#phone').val();
  contact["email"] = $('#email').val();
  contact["types"] = types;

  contacts.push(contact);
  saveToStorage();
  updateList();
  $("#newContact").trigger("reset");

}

function updateList() {
  let $tableBody = $('#contacts');
  $tableBody.children().not("#template").remove();

  let $contacts = contacts.map(function(contact) {
    let $contactRow = $("#template").clone();
    $contactRow.removeAttr("id");

    var types = contact["types"];
    for (var i = 0; i < types.length; i++){
      $contactRow.addClass(types[i]);
    }
    $contactRow.children(".firstName").text(contact["firstName"]);
    $contactRow.children(".lastName").text(contact["lastName"]);
    $contactRow.children(".phone").text(contact["phone"]);
    $contactRow.children(".email").text(contact["email"]);
    return $contactRow;

    // $.ajax({
    //   type: "POST",
    //   url: url,
    //   data: data,
    //   success: success,
    //   dataType: dataType
    // });



  });
  $tableBody.append($contacts);
}

function editContact(){
  editing = true;
  event.preventDefault();

  let index = $(this).closest("tr").index();
  let editObj = contacts[index -1];

  $('#firstName').val(editObj["firstName"]);
  $('#lastName').val(editObj["lastName"]);
  $('#phone').val(editObj["phone"]);
  $('#email').val(editObj["email"]);

  $('h2').text("Edit Contact:");
  $('#addContact').hide();
  $('#editContact').show();
  $("#editContact").click(makeEdits);

  function makeEdits(){
    editObj["firstName"] = $('#firstName').val();
    editObj["lastName"] = $('#lastName').val();
    editObj["phone"] = $('#phone').val();
    editObj["email"] = $('#email').val();
    updateList();
    saveToStorage();
    location.reload();
  }
}

function deleteContact(){
  let index = $(this).closest("tr").index();
  spliceContact(index - 1);
  updateList();
  saveToStorage();
}

function spliceContact(index){
  contacts.splice(index, 1);
}



/////////////////////////////////////////

$(() => {

  $('table').on('click', '.delete', deleteContact);
});


function deleteContact() {
  console.log('delete');

  let contactId = $(this).closest('tr').data('id');
  // console.log('contactId', contactId);

  $.ajax(`/contacts/${contactId}`, {
    method: 'DELETE'
  })
  .done(() => {
    console.log('delete success!');
    // $(this).closest('tr').remove();
    renderList();
  })
  .fail(err => {
    console.log('err', err);
  });
}

function renderList() {
  $.get('/contacts')
    .done(contacts => {

      let $trs = contacts.map(contact => {
        let $tr = $('#template').clone();
        $tr.removeAttr('id');
        $tr.find('.name').text(contact.name);
        $tr.find('.email').text(contact.email);
        $tr.find('.phone').text(contact.phone);
        $tr.find('.comments').text(contact.comments);
        $tr.data('id', contact.id)
        return $tr;
      })
      $('#contactList').empty().append($trs);
    });
}





// $(() => {
//
//   $('table').on('click', '.delete', deleteContact);
// });
//
//
// function deleteContact() {
//   console.log('delete');
//
//   let contactId = $(this).closest('tr').data('id');
//   // console.log('contactId', contactId);
//
//   $.ajax(`/contacts/${contactId}`, {
//     method: 'DELETE'
//   })
//   .done(() => {
//     console.log('delete success!');
//     // $(this).closest('tr').remove();
//     renderList();
//   })
//   .fail(err => {
//     console.log('err', err);
//   });
// }
//
// function renderList() {
//   $.get('/contacts')
//     .done(contacts => {
//
//       let $trs = contacts.map(contact => {
//         let $tr = $('#template').clone();
//         $tr.removeAttr('id');
//         $tr.find('.name').text(contact.name);
//         $tr.find('.email').text(contact.email);
//         $tr.find('.phone').text(contact.phone);
//         $tr.find('.comments').text(contact.comments);
//         $tr.data('id', contact.id)
//         return $tr;
//       })
//       $('#contactList').empty().append($trs);
//     });
// }
