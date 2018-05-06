var closeButtons = document.querySelectorAll(".close");
var editButtons = document.querySelectorAll(".edit");
var addButton = document.querySelector(".add-btn");
var tasks = document.querySelectorAll(".note");
var dates = document.querySelectorAll(".date");
var formCard = document.querySelector("#form-card");
var collection = document.querySelector(".collection");
var modals = document.querySelector('.modal');
var taskCard;

var flatpickrAttributes = {
	minDate: "today",
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    altInput: true,
    defaultHour: 0,
    allowInput: true
}

document.addEventListener('DOMContentLoaded', function() {
    var instances = M.Modal.init(modals);
});

flatpickr("#dateInput", flatpickrAttributes);

flatpickr("#dateEdit", flatpickrAttributes);

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
		console.log(document.URL + "/" + modals.attributes.href.value);
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
		  taskCard.children[1].innerText = moment(response.data.dateEdit).calendar();
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
			  var card = makeNewNote(note, response.data.date);	
			  card.children[1].setAttribute("date", response.data.date);
			  card.children[2].setAttribute("href", response.data._id);
			  card.children[3].setAttribute("href", response.data._id);
			  collection.prepend(card);
			  document.querySelector(".close").addEventListener("click", closeFunction);
			  document.querySelector(".edit").addEventListener("click", editFunction);
			  dates = document.querySelectorAll(".date");
			  updateDates(dates);
			  task.value = "";
			  formCard.classList.toggle("hide");
			  M.toast({html: 'Task added', classes: 'green lighten-1'});
			})
			.catch(function (error) {
			  console.log(error);
			  task.value = "";
			  M.toast({html: error, classes: 'red lighten-1'});
			});
		}
	});
};

function makeNewNote(note, date){
	var listDiv = document.createElement("li");
	listDiv.classList.add("collection-item", "note");
	listDiv.innerHTML += "<span class=\"task\">" + note + "</span> ";
	listDiv.innerHTML += "<span class=\"date\">" + moment(date).calendar() + "</span>";
	listDiv.innerHTML += "<button class=\"waves-effect waves-light btn right close red lighten-1 animated slideInRight\"><i class=\"material-icons\">close</i></button>"
	listDiv.innerHTML += "<button data-target=\"modal1\" class=\"waves-effect waves-light btn right edit yellow darken-1 animated slideInRight modal-trigger\"><i class=\"material-icons\">edit</i></button>";
	return listDiv;
}

function closeFunction(){
	var current = this;
	var card = this.parentElement;
	card.classList.add("animated");
	card.classList.add("fadeOut");
	setTimeout(function(){ 
		axios.delete(document.URL + "/" + current.attributes.href.value)
		  .then(function (response) {
		    console.log(response);
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
		card.outerHTML = ""; 
		M.toast({html: 'Task deleted', classes: 'red lighten-1'});
	}, 650);
}

function editFunction(){
	var task_id = this.attributes.href.value;
	taskCard = this.parentElement;
	var childText = taskCard.children[0].innerText;
	modals.children[0].children[1].children[0].value = childText;
	modals.children[0].children[1].children[1]._flatpickr.setDate(moment(taskCard.children[1].attributes.date.value)._d);
	modals.setAttribute("href", task_id);
}

function updateDates(dates) {
	dates.forEach(function(date){
		var fromNow = moment(date.attributes.date.value).calendar();
		console.log(date.attributes.date.value);
		date.innerText = fromNow;
	});
}