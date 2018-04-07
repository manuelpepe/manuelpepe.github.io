document.addEventListener("DOMContentLoaded", function() {
	var time_on = document.getElementById("time_on"),
		time_off = document.getElementById("time_off");
	var intervalOn, intervalOff;
	var cur_step;

	var exlist = []

	// UTILITY //
	function createButton(text, onclick) {
		var btn = document.createElement("button"),
			text = document.createTextNode(text);
		btn.appendChild(text)
		btn.addEventListener("click", onclick);
		return btn;
	}
	// END-UTILITY //
	

	function rearrangeList() {
		var list = document.getElementById("ex_list");
		var nodes = list.childNodes;
		/*
		I'm throwing away the old exercises array and replacing it for 
		a new ordered one. This should be way less efficient but it will do
		for now.
		*/
		var exlist = []
		for (var i = 0; i < nodes.length; i++) { 
			exlist.push(nodes[i].title)
		}
		console.log(exlist)
	}

	Sortable.create(document.getElementById("ex_list"), {
		animation: 150,
		ghostClass: "drag_ghost",
		scroll: true,
		onEnd: rearrangeList,
	});

	function addExercise(name) {
		exlist.push(name);
		let show_text = name.length > 16 ? name.substr(0,16) + '...' : name;

		var item = document.createElement("li"),
			text = document.createTextNode(show_text),
			btn = createButton("X", function(evt) {
				var li = evt.target.parentNode;
				li.parentNode.removeChild(li);
			});
		item.title = name;
		item.appendChild(text);
		item.appendChild(btn);
		document.getElementById("ex_list").appendChild(item);
	}

	function showNextExercises() {
		var last = document.getElementById("ex_list").childNodes[cur_step - 1];
		if (last) last.style.fontWeight = "";
		var current = document.getElementById("ex_list").childNodes[cur_step];
		if (current) current.style.fontWeight = "bold";
	}

	function startTimerOn() {
		var on = time_on.value,
			box = document.getElementById("timer_box");

		clearInterval(intervalOn);

		showNextExercises();
		
		box.innerHTML = on;
		box.style.backgroundColor = "green";
		intervalOn = setInterval(function(){
			on--;
			console.log(on);
			box.innerHTML = on;

			if (on == 0){
				on = time_on;
				clearInterval(intervalOn);
				startTimerOff()
			}
		}, 1000)
	}

	function startTimerOff() {
		var off = time_off.value,
			box = document.getElementById("timer_box");

		clearInterval(intervalOff);

		box.innerHTML = off;
		box.style.backgroundColor = "red"
		intervalOff = setInterval(function(){
			off--;
			console.log(off);
			box.innerHTML = off;

			if (off == 0){ 
				cur_step++;
				off = time_off;
				clearInterval(intervalOff);
				startTimerOn()

				if (cur_step == exlist.length)
					stopTimers({finished: true});
			}
		}, 1000)
	}

	// HANDLERS (Events) // 
	function startTimers(evt) {
		cur_step = 0;
		startTimerOn();	
	}
	
	function stopTimers(evt) {
		clearInterval(intervalOn);	
		clearInterval(intervalOff);	
		document.getElementById("box_on").innerHTML = time_on.value;
		document.getElementById("box_off").innerHTML = time_off.value;
	}

	// END-HANDLERS // 

	// LISTENERS //
	document.getElementById("ex_add").addEventListener("click", function(evt){
		addExercise(document.getElementById("ex_input").value);
		document.getElementById("ex_input").value = "";
	});
	document.getElementById("ex_input").addEventListener("keydown", function(evt) {
		if (event.keyCode == 13) { // ENTER key
			document.getElementById("ex_add").click();
		}
	});
	document.getElementById("timer_start").addEventListener("click", startTimers);
	document.getElementById("timer_stop").addEventListener("click", stopTimers);
	// END-LISTENERS //

	// Workout Presets
	function setWorkout(exercises) {
		exlist = []; // reset list

		for (var i = 0; i < exercises.length; i++){
			addExercise(exercises[i]);
		}
	}

	// Load workout from get parameter
	var qstr = location.search.substr(1);
	if (qstr) {
		var param = [],
			workout;
		qstr.split("&").forEach(function(item) {
			param = item.split("=");
			if (param[0] == "workout" && WORKOUTS[param[1]])
				setWorkout(WORKOUTS[param[1]]);
		})
	}
});