// Turning normal table into responsive, interactive table
$(document).ready(function () {
  $("#dataTables-example").DataTable({
    autoWidth: true,
    lengthMenu: [
      [25, 50, -1],
      [25, 50, "All"],
    ],
  });
});

// Checking the date after input
function checkDate() {
  let start = document.getElementById("start-datepicker");
  let end = document.getElementById("end-datepicker");
  let today = new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  let startDate = new Date(start.value).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });;
  let endDate = new Date(end.value);

  if (start.value !== "") {
    console.log(startDate)
    // Check start date with today
    if (startDate < today  ) {
      alert("Date must be in the future!");
      start.value = "";
    }

    // Check end date with start date
    if (end.value !== "") {
      if (endDate < startDate) {
        alert("End date must be later than the start date!");
        end.value = "";
      }
    }
  } else if (end.value !== "")
    if (endDate <= today) {
      // Check end date with today
      alert("Date must be in the future!");
      end.value = "";
    }
}

// Create button: after pressed
const createButton = document.querySelector("#create-class-btn");
const createClassForm = document.querySelector("#create-class-form");
createButton.addEventListener("click", function (event) {
  // event.preventDefault(); // prevent form submission

  // Get references to the input elements
  const courseNameInput = document.querySelector("#course-name");
  const startDateInput = document.querySelector("#start-datepicker");
  const endDateInput = document.querySelector("#end-datepicker");
  const descriptionInput = document.querySelector("#course-description");

  // Check if any input is empty
  if (!courseNameInput.value || !startDateInput.value || !endDateInput.value) {
    alert("Please fill in all fields.");
    return;
  }

  // All inputs are filled, continue with form submission
  console.log("Form submitted");
  createClassForm.submit();
});

// After js file is loaded.
console.log("custom javascript is loaded!");
