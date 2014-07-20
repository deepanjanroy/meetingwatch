var startStopFun = function () {
	var elm = document.getElementById("startStop");
	var txt = elm.textContent;
	if (txt == "START" && validateStartCondition()) {
		startTimer();
		elm.textContent = "STOP";
	} else if (txt == "STOP") {
		stopTimer();
	} else {
		throw "HALP: Invalid button value";
	}
}

var elm = document.getElementById("startStop");
elm.addEventListener("click", startStopFun);
