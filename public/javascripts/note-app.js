var elem = document.querySelector('.collapsible');
var instance = M.Collapsible.init(elem);

var closeButtons = document.querySelectorAll(".close");
var editButtons = document.querySelectorAll(".edit");
var addButton = document.querySelector(".add-btn");
var formCard = document.querySelector("#form-card");
var collection = document.querySelector(".collection");

closeButtons.forEach(function(button){
	button.addEventListener("click", closeFunction);
});

addButton.addEventListener("click", function(){
	formCard.classList.toggle("hide");
})

editButtons.forEach(function(button){
	button.addEventListener("click", function(){
		var parent = this.parentElement;
		console.log(parent);
		var text = parent.children[0].innerText;
		parent.children[1].classList.toggle("hide");
	});
});

// submit.addEventListener("click", function(event){
// 	event.preventDefault()
// 	var note = task.value;
// 	if (note.length === 0){
// 		{};
// 	}
// 	else {
// 		var date = Date();
// 		var card = makeNewNote(note, date);
// 		collection.prepend(card);
// 		document.querySelector(".close").addEventListener("click", closeFunction);
// 		task.value = "";
// 	}
// });

function makeNewNote(note, date){
	var listDiv = document.createElement("li");
	listDiv.classList.add("collection-item", "note");
	listDiv.innerHTML +=  note + "<a class=\"waves-effect waves-light btn right close red\"><i class=\"material-icons\">close</i></a><a class=\"waves-effect waves-light btn right check green\"><i class=\"material-icons\">check</i></a>";
	return listDiv;
}

function closeFunction(){
	var card = this.parentElement;
	card.classList.add("animated");
	card.classList.add("fadeOut");
	setTimeout(function(){ card.outerHTML = ""; }, 650);
}