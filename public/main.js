"use strict";

$(document).ready(init);

var contacts = [];

function init(){
  $('table').on('click', '.delete', deleteContact);
  // loadFromStorage();
  getFromDatabase();
  // renderList()
  $("#newContact").submit(addContact);
  $("tbody").on("click", ".trashButton", deleteContact);
  // $("tbody").on("click", ".edit", editContact);
  $("tbody").on('click', '.editBtn', editContact);
  $(".modal").on('click', '.saveBtn', saveContact);
  // $('#myModal').on('shown.bs.modal', function () {
  // $('#myInput').focus()
  // $('#modalButton').click(editContact);


}

function saveToStorage() {
  localStorage.contacts = JSON.stringify(contacts);
}

function loadFromStorage() {
  if(!localStorage.contacts) {
    localStorage.contacts = '[]';
  }
  contacts = JSON.parse(localStorage.contacts);
}

function getFromDatabase() {
  let contactId = $(this).closest('tr').data('id');
  $.ajax(`/contacts`, {
    method: 'GET'
  })
  .done(() => {
    console.log('fromDataBase!');
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
      $tr.find('.firstName').text(contact.firstName);
      $tr.find('.lastName').text(contact.lastName);
      $tr.find('.email').text(contact.email);
      $tr.find('.phone').text(contact.phone);
      $tr.find('.messages').text(contact.messages);
      $tr.data('id', contact.id)
      $tr.data('firstName', contact.firstName)
      $tr.data('lastName', contact.lastName)
      $tr.data('email', contact.email)
      $tr.data('phone', contact.phone)
      $tr.data('messages', contact.messages)
      return $tr;
    })
    $('#contactList').empty().append($trs);
  });
}

function addContact(){

  let contact = {};
  contact.firstName = $('#firstName').val();
  contact.lastName = $('#lastName').val();
  contact.phone = $('#phone').val();
  contact.email = $('#email').val();
  contact.messages = $('#messages').val();
  $.ajax(`/contacts`, {
    method: 'POST',
    data: contact,
  })
  .done(() => {

    console.log('posted');
    getFromDatabase();
  })
  .fail(err => {
    console.log('err', err);
  });
}

  function editContact(){
    event.preventDefault();


    let id = $(this).closest('tr').data('id');
    let firstName = $(this).closest('tr').data('firstName');
    let lastName = $(this).closest('tr').data('lastName');
    let email = $(this).closest('tr').data('email');
    let phone = $(this).closest('tr').data('phone');
    let messages = $(this).closest('tr').data('messages');

    let modal = $('.mymodal').clone();
    modal.removeClass('mymodal');
    $('#editFirstName').val(firstName)
    $('#editLastName').val(lastName);
    $('#editPhone').val(email);
    $('#editEmail').val(phone);
    $('#editMesages').val(messages);
    $('.mymodal2').data('id', id)
    }

    function saveContact(){
      let contact = {};
      let id = $('.mymodal2').data('id');
      console.log('id:', id);
      contact.firstName = $('#editFirstName').val();
      contact.lastName = $('#editLastName').val();
      contact.phone = $('#editPhone').val();
      contact.email = $('#editEmail').val();
      contact.messages = $('#editMessages').val();
      console.log('contact', contact);
      $.ajax(`/contacts/${id}`, {
        method: 'PUT',
        data: contact
      })
      .done(() => {
        console.log('posted');
        getFromDatabase();
      })
      .fail(err => {
        console.log('err', err);
      });
    }

  function deleteContact(){
    let id = $(this).closest('tr').data('id');
    $.ajax(`/contacts/${id}`, {
      method: 'DELETE',
      data: {id: id}
    })
    .done(() => {
      console.log('delete');
      $(this).closest('tr').remove();
    })
    .fail(err => {
      console.log('err', err);
    });
  }


  $('#myModal').modal();
