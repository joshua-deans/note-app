var elem = document.querySelector('.collapsible');
var instance = M.Collapsible.init(elem);

var closeButtons = document.querySelectorAll(".close");
var editButtons = document.querySelectorAll(".edit");
var doneButton = document.querySelectorAll(".check");
var addButton = document.querySelector(".add-btn");
var formCard = document.querySelector("#form-card");
var collection = document.querySelector(".collection");
var submitTask = document.querySelector("#submit-task");
var dates = document.querySelectorAll(".date");

closeButtons.forEach(function(button){
	button.addEventListener("click", closeFunction);
});

if (addButton){
	addButton.addEventListener("click", function(){
		formCard.classList.toggle("hide");
	})
};

doneButton.forEach(function(button){
	button.addEventListener("click", function(){
		var parent = this.parentElement;
		console.log(parent);
		var text = parent.children[0].innerText;
		parent.children[0].classList.toggle("crossed-out");
		parent.children[1].classList.toggle("crossed-out");
	});
});

editButtons.forEach(function(button){
	button.addEventListener("click", function(){
		var parent = this.parentElement;
		console.log(parent);
		var text = parent.children[0].innerText;
		parent.children[1].classList.toggle("hide");
	});
});

if (submitTask){
	submitTask.addEventListener("click", function(event){
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
			axios.post(document.URL, {
			      "task": task.value
			    })
			.then(function (response) {
			  card.children[2].setAttribute("href", response.data._id);
			  task.value = "";
			  formCard.classList.toggle("hide");
			})
			.catch(function (error) {
			  console.log(error);
			  task.value = "";
			});
			M.toast({html: 'Task added', classes: 'green lighten-1'});
		}
	});
};

function makeNewNote(note, date){
	var listDiv = document.createElement("li");
	listDiv.classList.add("collection-item", "note");
	listDiv.innerHTML += "<span class=\"task\">" + note + "</span> ";
	listDiv.innerHTML += "<span class=\"date\">" + date + "</span>";
	listDiv.innerHTML += "<button class=\"waves-effect waves-light btn right close red lighten-1 animated slideInRight\"><i class=\"material-icons\">close</i></button>"
	listDiv.innerHTML += "<button class=\"waves-effect waves-light btn right edit yellow darken-1 animated slideInRight\"><i class=\"material-icons\">edit</i></button>";
	listDiv.innerHTML += "<button class=\"waves-effect waves-light btn right check green lighten-1 animated slideInRight\"><i class=\"material-icons\">check</i></button>";
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