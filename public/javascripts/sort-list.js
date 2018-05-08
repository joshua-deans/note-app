var originalSort = document.querySelector("#original-sort");
var dateSort = document.querySelector("#date-sort");
var taskSort = document.querySelector("#task-sort");
var todayShow = document.querySelector("#today-show");
var weekShow = document.querySelector("#week-show");
var allShow = document.querySelector("#all-show");

var options = {
  valueNames: [ 'task', { attr: 'date', name: 'date' }],
};

var taskList = new List("list-container", options);

todayShow.addEventListener("click", function(){
	taskList.filter(function(item) {
		if (moment(item._values.date).isBefore(moment().add(1, 'days'))){
			return true;
		}
		else{
			return false;
		}
	});
	todayShow.classList.add("selected");
	weekShow.classList.remove("selected");
	allShow.classList.remove("selected");
});
weekShow.addEventListener("click", function(){
	taskList.filter(function(item) {
		if (moment(item._values.date).isBefore(moment().add(7, 'days'))){
			return true;
		}
		else{
			return false;
		}
	});
	todayShow.classList.remove("selected");
	weekShow.classList.add("selected");
	allShow.classList.remove("selected");
});

allShow.addEventListener("click", function(){
	taskList.filter();
	todayShow.classList.remove("selected");
	weekShow.classList.remove("selected");
	allShow.classList.add("selected");
});

// originalSort.addEventListener("click", function(){
// 	taskList.sort();
// 	originalSort.classList.add("selected");
// 	dateSort.classList.remove("selected");
// 	taskSort.classList.remove("selected");
// });

dateSort.addEventListener("click", function(){
	taskList.sort('date', { alphabet: "9876543210" });
	dateSort.classList.add("selected");
	taskSort.classList.remove("selected");
});

taskSort.addEventListener("click", function(){
	dateSort.classList.remove("selected");
	taskSort.classList.add("selected");
});