var closeButtons = document.querySelectorAll(".close");
var editButtons = document.querySelectorAll(".edit");
var addButton = document.querySelector(".add-btn");
var tasks = document.querySelectorAll(".note");
var dates = document.querySelectorAll(".date");
var notes = document.querySelectorAll(".note");
var sideNav = document.querySelectorAll('.sidenav');
var formCard = document.querySelector("#form-card");
var collection = document.querySelector(".collection");
var modals = document.querySelector('.modal');
var switchToggle = document.querySelector('#switchToggle');
var dateSort = document.querySelector("#date-sort");
var taskSort = document.querySelector("#task-sort");
var taskCard;

var calendarAttributes = {
    sameDay: '[Today at] LT',
    nextDay: '[Tomorrow at] LT',
    nextWeek: 'dddd [at] LT',
    lastDay: '[Yesterday at] LT',
    lastWeek: '[Last] dddd [at] LT',
    sameElse: 'MMMM D, YYYY [at] LT'
};

var flatpickrAttributes = {
	minDate: "today",
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    altInput: true,
    defaultHour: 0
}

document.addEventListener('DOMContentLoaded', function() {
    var modalInstances = M.Modal.init(modals, {dismissible: false});
    var sideNavInstances = M.Sidenav.init(sideNav);
});

flatpickr("#dateInput", flatpickrAttributes);
flatpickr("#dateEdit", flatpickrAttributes);

makeDatesUnix(dates);
updateDates(dates);
setInterval(function(){updateDates(dates)}, 60000);

closeButtons.forEach(function(button){
	button.addEventListener("click", closeFunction);
});

if (addButton){
	addButton.addEventListener("click", function(){
		formCard.classList.toggle("hide");
	})
};

editButtons.forEach(function(button){
	button.addEventListener("click", editFunction);
});

if (modals){
	modals.addEventListener("submit", function(event){
		event.preventDefault()
		axios({
  			method:'put',
  			url: document.URL + "/" + modals.attributes.href.value, 
  			data: {
  				dateEdit: dateEdit.value,
  				taskEdit: taskEdit.value
  			},
  			timeout: 5000
  		})
		.then(function (response) {
		  modals.attributes.href.value = "";
		  taskCard.children[0].innerText = response.data.taskEdit;
		  taskCard.children[1].innerText = moment(response.data.dateEdit).calendar(null, calendarAttributes);
		  taskCard.children[1].setAttribute("date", moment(response.data.dateEdit).valueOf());
		  updateDates(dates);
		  taskEdit.value = "";
		  M.Modal.getInstance(modals).close();
		  M.toast({html: 'Task edited', classes: 'green lighten-1'});
		})
		.catch(function (error) {
		  console.log(error);
		  M.toast({html: error, classes: 'red lighten-1'});
		});
	})
}

if (formCard){
	formCard.addEventListener("submit", function(event){
		event.preventDefault()
		var note = task.value;
		if (note.length === 0){
			{};
		}
		else {
			axios.post(document.URL, {
			      date: dateInput.value,
			      task: task.value
			    })
			.then(function (response) {	
			  // Create a new task "card" and prepend it to the collection of tasks.
			  var card = makeNewNote(note, response.data.date);
			  card.children[2].setAttribute("href", response.data._id);
			  card.children[3].setAttribute("href", response.data._id);
			  collection.prepend(card);
			  document.querySelector(".close").addEventListener("click", closeFunction);
			  document.querySelector(".edit").addEventListener("click", editFunction);
			  // Functions to update the date variables
			  dates = document.querySelectorAll(".date");
			  makeDateUnix(dates[0]);
			  updateDates(dates);
			  taskList.reIndex();
			  if (dateSort.classList.contains("selected")){
			    dateSort.click();
			  }
			  else if (taskSort.classList.contains("selected")){
				taskSort.click();
			  }

			  // Empty values
			  task.value = "";
			  dateInput.value = "";
			  // Hide the form
			  formCard.classList.toggle("hide");
			  // Display success alert
			  M.toast({html: 'Task added', classes: 'green lighten-1'});
			})
			.catch(function (error) {
			  console.log(error);
			  task.value = "";
			  dateInput.value = "";
			  M.toast({html: error, classes: 'red lighten-1'});
			});
		}
	});
};

function makeNewNote(note, date){
	var listDiv = document.createElement("li");
	listDiv.classList.add("collection-item", "note");
	listDiv.innerHTML += "<span class=\"task truncate\">" + note + "</span> ";
	listDiv.innerHTML += "<span class=\"date\">" + moment(Number(date)).calendar(null, calendarAttributes) + "</span>";
	listDiv.innerHTML += "<button class=\"waves-effect waves-light btn right close red lighten-1 animated slideInRight\"><i class=\"material-icons\">close</i></button>"
	listDiv.innerHTML += "<button data-target=\"modal1\" class=\"waves-effect waves-light btn right edit yellow darken-1 animated slideInRight modal-trigger\"><i class=\"material-icons\">edit</i></button>";
	listDiv.children[1].setAttribute("date", moment(date));
	return listDiv;
}

function closeFunction(){
	var current = this;
	var card = this.parentElement;
	card.classList.add("animated");
	card.classList.add("fadeOut");
	setTimeout(function(){ 
		axios({
  			method:'delete',
  			url: document.URL + "/" + current.attributes.href.value,
  			timeout: 5000
  		})
		  .then(function (response) {
		    card.outerHTML = ""; 
			M.toast({html: 'Task deleted', classes: 'orange lighten-1'});
		})
		  .catch(function (error) {
		    card.outerHTML = ""; 
			M.toast({html: error, classes: 'red lighten-1'});
		  });
	}, 650);
}

function editFunction(){
	var task_id = this.attributes.href.value;
	taskCard = this.parentElement;
	var childText = taskCard.children[0].innerText;
	modals.children[0].children[2].children[0].value = childText;
	modals.children[0].children[2].children[1]._flatpickr.setDate(moment(Number(taskCard.children[1].attributes.date.value))._d);
	modals.setAttribute("href", task_id);
}

function makeDatesUnix(dates) {
	dates.forEach(function(date){
		makeDateUnix(date);
	});
}

function makeDateUnix(date) {
	date.setAttribute("date", moment(date.attributes.date.value).valueOf());
}

function updateDates(dates) {
	console.log("Update Dates ran");
	dates.forEach(function(date){
		if (moment(Number(date.attributes.date.value)).isBefore(Date.now())){
			date.classList.add("late");
			date.previousElementSibling.classList.add("late");
		}
		else {
			date.classList.remove("late");
			date.previousElementSibling.classList.remove("late");
		}
		var nowMoment = moment(Number(date.attributes.date.value));
		if (switchToggle.checked && 
			nowMoment.isBetween(moment(), moment().add(60, 'seconds'), null, '(]')){
			var taskText = date.previousElementSibling.innerHTML;
			displayPush(taskText, nowMoment);
		}
		var fromNow = nowMoment.calendar(null, calendarAttributes);
		date.innerText = fromNow;
	});
}

function displayPush(taskText, momentObj){
	Push.create("Task due", {
	    body: taskText + "\n" + momentObj.format("MMMM D, YYYY [at] LT"),
	    timeout: 8000,
	    onClick: function () {
	        window.focus();
	        this.close();
	    }
	});
}