
"use strict";

$(document).ready(init);

var contacts = [];
var editing = false;

function init(){
  loadFromStorage();
  updateList();
  $("#newContact").submit(addContact);
  $("tbody").on("click", ".trashButton", deleteContact);
  $("tbody").on("click", ".edit", editContact);
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

  $.ajax( {
    url: `/contacts`,
    success: function(data) {
      console.log('data:', data);
    },
    error: function() {
      console.log('errror!');
    }
  });


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

    $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: success,
      dataType: dataType
    });



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
