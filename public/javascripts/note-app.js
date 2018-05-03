var closeButtons = document.querySelectorAll(".close");
var editButtons = document.querySelectorAll(".edit");
var addButton = document.querySelector(".add-btn");
var tasks = document.querySelectorAll(".note");
var formCard = document.querySelector("#form-card");
var collection = document.querySelector(".collection");
var dates = document.querySelectorAll(".date");
var modals = document.querySelector('.modal');
var taskCard;

document.addEventListener('DOMContentLoaded', function() {
    var instances = M.Modal.init(modals);
});


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
  			data: {"taskEdit": taskEdit.value},
  			timeout: 5000
  		})
		.then(function (response) {
		  modals.attributes.href.value = "";
		  taskCard.children[0].innerText = taskEdit.value;
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
			var date = moment(Date.now()).fromNow();
			var card = makeNewNote(note, date);
			collection.prepend(card);
			document.querySelector(".close").addEventListener("click", closeFunction);
			document.querySelector(".edit").addEventListener("click", editFunction);
			axios.post(document.URL, {
			      "task": task.value
			    })
			.then(function (response) {
			  card.children[2].setAttribute("href", response.data._id);
			  card.children[3].setAttribute("href", response.data._id);
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
	listDiv.innerHTML += "<span class=\"date\">" + date + "</span>";
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
	console.log(taskCard);
	var childText = taskCard.children[0].innerText;
	modals.setAttribute("href", task_id);
	modals.children[0].children[1].children[0].value = childText;
}