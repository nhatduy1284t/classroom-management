$(document).ready(function () {
  $("#dataTables-example").DataTable({
    autoWidth: true,
    lengthMenu: [
      [10, 20, -1],
      [10, 20, "All"],
    ],
    bInfo: false,
  });
});


let tableUsers = document.querySelector('.table-users');
let form= document.querySelector('#user-info-form');
let inputUsername = form.querySelector('input.username');
let inputFirstName = form.querySelector('input.firstName');
let inputLastName = form.querySelector('input.lastName');
let inputUserId = form.querySelector('input.userId');
let selectUserType = form.querySelector('select.userType');

tableUsers.addEventListener('click',(e) => {
    let tag = e.target;
    if(tag.classList.contains('btn-show-info')) {
        inputUsername.value = tag.getAttribute('data-userName');
        inputFirstName.value = tag.getAttribute('data-firstName');
        inputLastName.value = tag.getAttribute('data-lastName');
        inputUserId.value = tag.getAttribute('data-userId');
        selectUserType.value = tag.getAttribute('data-userType');
        
    }
    
    if(tag.classList.contains('btn-delete-user')) {
        e.preventDefault();
        if(confirm("Do you want to delete this user?")) {

            let formDelete = tag.closest('form');
            formDelete.submit();
        }

    }
})