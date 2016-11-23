javascript:(function () {
    var lastIntervalId = window.setInterval(function () {}, 9999);
    while (lastIntervalId-- > 0)
        window.clearInterval(lastIntervalId);

    var commonTimer = 0,
		intervalTimer = 0,
		intervalTimerLimit = +localStorage.getItem("timer.limit") || 15, 
		spentTime,
		resultCount = 0,
		html = "\
			<a id='config' href='#' style='float:left; font-size: 24px'>&#9881; \
			<input type='number' style='display:none' id='limit' style='float:left;'></input> </a> \
			<br><br><br><span style='color:rgba(255, 255, 255, 0.5); font-size: 36px;'>TOTAL TIME: <span id='commonIntervalId' style='color:white'></span></span><br><br> \
			<span style='color:rgba(255, 255, 255, 0.5); font-size: 136px;'>TIME LEFT: <span id='timeLeftId' style='color:white'></span></span><br> \
			<div style='color: white; font-weight: bold; font-size: 14px;' id='Results'>Results</div>\
			<button id='startButtonId' style='width: 100%; height: 100px; font-size:90px; position: absolute; bottom: 10px; left: 0'>Start</button>";

    function startcommonTimer() {
		var prepareOutput = function (val) {
			return val + "(" + parseInt(val / 60) + "m " + str_pad_left(val % 60, '0', 2) + "s)";
		};
        spentTime = 0;
        document.getElementById('commonIntervalId').innerText = prepareOutput(spentTime);
        commonTimer = window.setInterval(function () {
                spentTime++;
                document.getElementById('commonIntervalId').innerText =  prepareOutput(spentTime);
            }, 1000);
    };

    function startintervalTimer() {
        var leftTime = intervalTimerLimit,
			prepareOutput = function (time){
				var positiveTime = Math.abs(time);
				return (time < 0 ? '-' : '') + str_pad_left(parseInt(positiveTime / 60), '0', 2) + ":" + str_pad_left(positiveTime % 60, '0', 2);
			},
			intervalFn = function () {
				var rate = 255 / intervalTimerLimit,
					current = intervalTimerLimit - --leftTime,
					color = "rgb(" + parseInt(rate * current + 1) + ", " + parseInt(102 - 102 / intervalTimerLimit * current + 1) + "," + parseInt(255 - rate * current + 1) + ")",
				
				spentTime = current;
				document.getElementById('timeLeftId').innerText = prepareOutput(leftTime);
				document.body.style.backgroundColor = color;
			};

        document.getElementById('timeLeftId').innerText = prepareOutput(leftTime);
        clearInterval(intervalTimer);
        document.body.style.backgroundColor = "rgb(0, 102, 255)";
        intervalTimer = window.setInterval(intervalFn, 1000);
    }
	
    function str_pad_left(string, pad, length) {
        return (new Array(length + 1).join(pad) + string).slice(-length);
    };

	document.body.style.backgroundImage = null;
    document.body.style.backgroundColor = "#0066ff";
    document.body.innerHTML = html;
							
    document.getElementById("startButtonId").onclick = function () {
        if (!commonTimer)
            startcommonTimer();
		
		if(intervalTimer){
			clearInterval(intervalTimer);
			intervalTimer = 0;
			document.getElementById("startButtonId").innerText = "Start";
			document.getElementById("Results").innerHTML += "<div>" + ++resultCount + ": " + spentTime + "</div>";
			return;
		} 
		document.getElementById("startButtonId").innerText = "Pause";
        startintervalTimer();
    };

    document.getElementById("config").onclick = function (e) {
        if (e.target != e.currentTarget)
            return;
        var el = document.getElementById('limit');

        el.style.display = el.style.display == 'none' ? 'inline-block' : 'none';
    };

    document.getElementById('limit').onchange = function (e) {
        intervalTimerLimit = +e.currentTarget.value;
        localStorage.setItem('timer.limit', intervalTimerLimit);
    };
	
	document.getElementById("startButtonId").focus();
	document.getElementById('limit').value = intervalTimerLimit;
}());
