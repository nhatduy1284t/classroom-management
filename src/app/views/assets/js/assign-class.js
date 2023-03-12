// Turning normal table into responsive, interactive table
$(document).ready(function () {
    $('.table').DataTable({
        // "autoWidth": true,
        // "lengthMenu": [[25, 50, -1], [25, 50, "All"]],
        "paging": false,
        "info": false,
        "ordering": false
    }
    );
});
console.log("table created");

// "Click" event for remove buttons
let removeBtns = document.querySelectorAll(".remove-btn");
removeBtns.forEach(function (btn) {
    btn.addEventListener("click", function (event) {
        event.preventDefault();
        var confirmRemove = confirm("Are you sure you want to remove?");

        // if the user confirms, remove the element
        if (confirmRemove) {
            // do something to remove the element
            console.log("Remove button clicked");
        }

        // reload the page after the confirmation
    });
});

//Reference: https://www.codinglabweb.com/2022/07/multiple-options-select-menu-javascript.html
const selectBtn = document.querySelector(".select-btn"),
    items = document.querySelectorAll(".item");

// selectBtn.addEventListener("click", () => {
//     selectBtn.classList.toggle("open");
// });

items.forEach(item => {
    item.addEventListener("click", () => {
        //Click anywhere within the list item, the item will always be checked/unchecked
        item.classList.toggle("checked");

        let item_checkbox = item.querySelector(".checkbox");
        item_checkbox.checked = !item_checkbox.checked;
        console.log(item_checkbox);
        

        // let checked = document.querySelectorAll(".checked"),
        //     btnTexts = document.querySelector(".btn-text");
        let teacherModal = document.querySelector("#teacherModal");
        let studentModal = document.querySelector("#studentModal");
        let teacherModalDisplay = window.getComputedStyle(teacherModal).getPropertyValue("display");
        if (teacherModalDisplay != "none") {
            // TEACHER MODAL
            let checked = teacherModal.querySelectorAll(".checked"),
                btnText = teacherModal.querySelector(".btn-text");

            if (checked && checked.length > 0) {
                btnText.innerText = `${checked.length} Selected`;
            } else {
                btnText.innerText = "Please select teacher to assign";
            }
        }
        else {
            // STUDENT MODAL
            let checked = studentModal.querySelectorAll(".checked"),
                btnText = studentModal.querySelector(".btn-text");

            if (checked && checked.length > 0) {
                btnText.innerText = `${checked.length} Selected`;
            } else {
                btnText.innerText = "Please select student to add";
            }
        };
    })
});


// Turn list into searchable list.
var options = {
    valueNames: ['checkbox', 'item-text']
};

var teacherList = new List('teacher-list', options);
var studentList = new List('student-list', options);

// ====NOTE====
// TO CHECK IF THE item is selected or not, check to see if the class of tag <i> has "checked" in it

let add_teachers_btn = document.querySelector("#add-teachers");
add_teachers_btn.addEventListener("click", (event) => {
    event.preventDefault();

    let teacher_form = document.querySelector("#teachers-form");
    teacher_form.submit();
});

let add_students_btn = document.querySelector("#add-students");
add_students_btn.addEventListener("click", (event) => {
    event.preventDefault();
    
    let student_form = document.querySelector("#students-form");
    student_form.submit();
});