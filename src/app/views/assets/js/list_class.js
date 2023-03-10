// Turning normal table into responsive, interactive table
$(document).ready(function () {
    $('#dataTables-example').DataTable({
        "autoWidth": true,
        "lengthMenu": [[25, 50, -1], [25, 50, "All"]]
    }
    );
});

// Checking the date after input
function checkDate() {
    let start = document.getElementById('start-datepicker');
    let end = document.getElementById('end-datepicker');
    let today = new Date();
    let startDate = new Date(start.value);
    let endDate = new Date(end.value);

    if (start.value !== "") {
        // Check start date with today
        if (startDate < today) {
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
    }
    else
        if (end.value !== "")
            // Check end date with today
            if (endDate < today) {
                alert("Date must be in the future!");
                end.value = "";
            }
}


// After js file is loaded.
console.log("custom javascript is loaded!");