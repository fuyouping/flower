
var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();

$(function () {
    // setup garden
	$loveHeart 		= 	$("#loveHeart");
	var offsetX 	= 	$loveHeart.width() / 2;
	var offsetY 	= 	$loveHeart.height() / 2 - 55;
    $garden 		= 	$("#garden");
    gardenCanvas 	= 	$garden[0];
	gardenCanvas.width 	= 	$("#loveHeart").width();
    gardenCanvas.height = 	$("#loveHeart").height()
    gardenCtx 	= 	gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";
    garden 		= 	new Garden(gardenCtx, gardenCanvas);
	
	$("#content").css("width", $loveHeart.width() + $("#code").width());
	$("#content").css("height", Math.max($loveHeart.height(), $("#code").height()));
	$("#content").css("margin-top", Math.max(($window.height() - $("#content").height()) / 2, 10));
	$("#content").css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10));

    // renderLoop
    setInterval(function () {
        garden.render();
    }, Garden.options.growSpeed);
});

$(window).resize(function() {
    var newWidth = $(window).width();
    var newHeight = $(window).height();
    if (newWidth != clientWidth && newHeight != clientHeight) {
        location.replace(location);
    }
});

//桃心位置算法
function getHeartPoint(angle) {
	var t = angle / Math.PI;
	var x = 19.5 * (16 * Math.pow(Math.sin(t), 3)) - 50;
	var y = - 20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
	return new Array(offsetX + x, offsetY + y);
}

function startHeartAnimation() {
	var interval 	= 	50;
	var angle 		= 	10;
	var heart 		= 	new Array();
	var animationTimer 	= 	setInterval(function () {
		var bloom 		= 	getHeartPoint(angle);
		var draw 		= 	true;
		for (var i = 0; i < heart.length; i++) 
		{
			var p = heart[i];
			var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
			if (distance < Garden.options.bloomRadius.max * 1.3) 
			{
				draw = false;
				break;
			}
		}
		if (draw) {
			heart.push(bloom);
			garden.createRandomBloom(bloom[0], bloom[1]);
			// clearInterval(animationTimer);
		}
		if (angle >= 30) {
			clearInterval(animationTimer);
			rightShowAnimation();
			showMessages();
		} else {
			angle += 0.2;
		}

	}, interval);
}

function getLeftPoint(angle, f) {
	if(f < 12)
	{
		var y 	=	22.5;
		var x 	=	y + f*angle;
	}
	else if(f >= 45)
	{
		var y 	=	610;
		var x 	=	22.5 + (f - 45) * angle;
	}
	else
	{
		var x 	= 	90
		var y 	= 	22.5 + angle * (f - 12);
		console.log(y);
	}
	return new Array(x, y);
}


function leftShowAnimation()
{
	var interval 	= 	50;
	var angle 		= 	10;
	var heart 		= 	new Array();
	var f 	=	0;
	var animationTimer 	= 	setInterval(function () {
		var bloom 		= 	getLeftPoint(angle, f);
		var draw 		= 	true;

		for (var i = 0; i < heart.length; i++) 
		{
			var p = heart[i];
			var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
			if (distance < Garden.options.bloomRadius.max * 1.3) 
			{
				draw = false;
				break;
			}
		}
		if (draw) {
			heart.push(bloom);
			garden.createRandomBloom(bloom[0], bloom[1]);
			// clearInterval(animationTimer);
		}
		if (angle >= 20.2) {
			clearInterval(animationTimer);
			startHeartAnimation();
			showMessages();
		} else {
			angle += 0.2;
		}
		f++;
	}, interval);
}


function getRightPoints(angle, f) 
{
	if( f < 10)
	{
		var x 	= 	980 - angle * f
		var y 	= 	22.5;
	}
	else if( f < 40 )
	{
		var x 	= 	920
		var y 	= 	22.5 + angle * (f - 10);
	}
	else if( f < 70)
	{
		var hudu 	= 	(2*Math.PI / 360) * 6 * (f - 25);
       	var x = 860 + Math.sin(hudu) * 60;
       	var y = 540 - Math.cos(hudu) * 60
	}
	else if( f < 90)
	{
		var x 	= 	800
		var y 	= 	520 - angle * (f - 71);
	}
	else
	{
		var x 	= 	880 - angle * (f - 90)
		var y 	= 	22.5;
	}
	return new Array(x, y);
}


function rightShowAnimation()
{
	var interval 	= 	50;
	var angle 		= 	10;
	var heart 		= 	new Array();
	var f 	=	0;
	var animationTimer 	= 	setInterval(function () {
		var bloom 		= 	getRightPoints(angle, f);
		var draw 		= 	true;

		for (var i = 0; i < heart.length; i++) 
		{
			var p = heart[i];
			var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
			if (distance < Garden.options.bloomRadius.max * 1.3) 
			{
				draw = false;
				break;
			}
		}
		if (draw) {
			heart.push(bloom);
			garden.createRandomBloom(bloom[0], bloom[1]);
			// clearInterval(animationTimer);
		}
		if (angle >= 28.8) {
			clearInterval(animationTimer);
			showMessages();
		} else {
			angle += 0.2;
		}
		f++;
	}, interval);
}

(function($) {
	$.fn.typewriter = function() {
		this.each(function() {
			var $ele = $(this), str = $ele.html(), progress = 0;
			$ele.html('');
			var timer = setInterval(function() {
				var current = str.substr(progress, 1);
				if (current == '<') {
					progress = str.indexOf('>', progress) + 1;
				} else {
					progress++;
				}
				$ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
				if (progress >= str.length) {
					clearInterval(timer);
				}
			}, 75);
		});
		return this;
	};
})(jQuery);

function timeElapse(date){
	var current = Date();
	var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
	var days = Math.floor(seconds / (3600 * 24));
	seconds = seconds % (3600 * 24);
	var hours = Math.floor(seconds / 3600);
	if (hours < 10) {
		hours = "0" + hours;
	}
	seconds = seconds % 3600;
	var minutes = Math.floor(seconds / 60);
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	seconds = seconds % 60;
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	var result = "<span class=\"digit\">" + days + "</span> days <span class=\"digit\">" + hours + "</span> hours <span class=\"digit\">" + minutes + "</span> minutes <span class=\"digit\">" + seconds + "</span> seconds"; 
	$("#elapseClock").html(result);
}

function showMessages() {
	adjustWordsPosition();
	$('#messages').fadeIn(5000, function() {
		showLoveU();
	});
}

function adjustWordsPosition() {
	$('#words').css("position", "absolute");
	$('#words').css("top", $("#garden").position().top + 195);
	$('#words').css("left", $("#garden").position().left + 70);
}

function adjustCodePosition() {
	$('#code').css("margin-top", ($("#garden").height() - $("#code").height()) / 2);
}

function showLoveU() {
	$('#loveu').fadeIn(3000);
}