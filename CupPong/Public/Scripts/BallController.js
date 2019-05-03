// -----JS CODE-----
// @input int ySpeed
// @input int zSpeed
// @input int gravity
// @input Component.Text scoreText
// @input SceneObject cup
// @input SceneObject moveImage
// @input SceneObject doneImage
// @input SceneObject cupCollisionBox

var touchStartedEvent = script.createEvent("TouchStartEvent");
var touchMovedEvent = script.createEvent("TouchMoveEvent");
var touchEndEvent = script.createEvent("TouchEndEvent");
var updateEvent = script.createEvent("UpdateEvent");
var turnedOnEvent = script.createEvent("TurnOnEvent");
var tapEvent = script.createEvent("TapEvent");

var ball = script.getSceneObject();
var transform = ball.getTransform();

var low;
var high;
var currentTouchX;
var currentTouchY;
var lastTouchX;
var lastTouchY;
var isThrowing;
var score = 0;
var state = 1 // 1: playing, 2: moving
var scored;

var cupRadius = 12;

var tapped = function(eventData)
{
	var pos = eventData.getTapPosition();
	print(pos.x + "," + pos.y);
	if((pos.x >= .75 && pos.x <= .95) && (pos.y >= .1 && pos.y <= .2))
	{
		setState(state == 1 ? 2 : 1);
	}
}
tapEvent.bind(tapped);

var touchStarted = function(eventData)
{
	isThrowing = false;
	low = 1;
	high = 0;
}
touchStartedEvent.bind(touchStarted);

var touchMoved = function(eventData)
{
	if(!script.ySpeed)
	{
		return;
	}
	
	var touch = eventData.getTouchPosition();
	currentTouchX = touch.x;
	currentTouchY = touch.y;
	
	if(currentTouchY > high)
	{
		high = currentTouchY;
	}
	if(currentTouchY < low)
	{
		low = currentTouchY;
	}
	
	if((lastTouchX != null && lastTouchY != null) && (currentTouchX != lastTouchX || currentTouchY != lastTouchY))
	{
		transform = ball.getTransform();
		var currentPosition = transform.getWorldPosition();
		var moveY = (currentTouchY - lastTouchY) * -script.ySpeed;
		
		transform.setWorldPosition(new vec3(currentPosition.x, currentPosition.y + moveY, currentPosition.z));
	}
	
	lastTouchX = currentTouchX;
	lastTouchY = currentTouchY;
}
touchMovedEvent.bind(touchMoved);

var touchEnded = function(eventData)
{
	if(low != 1 && high != 0)
	{
		isThrowing = true;
	}
}
touchEndEvent.bind(touchEnded);

var updatedEvent = function(eventData)
{
	if(state == 1)
	{
		if(script.doneImage.enabled)
		{
			script.doneImage.enabled = false;
		}
		if(!script.moveImage.enabled)
		{
			script.moveImage.enabled = true;
		}
	}
	else if(state == 2)
	{
		if(!script.doneImage.enabled)
		{
			script.doneImage.enabled = true;
		}
		if(script.moveImage.enabled)
		{
			script.moveImage.enabled = false;
		}
	}

	transform = ball.getTransform();
	
	if(isThrowing && script.zSpeed && script.gravity)
	{
		var zSpeed = (high - low) * -script.zSpeed;
		var currentPosition = transform.getWorldPosition();
		
		transform.setWorldPosition(new vec3(currentPosition.x, currentPosition.y - script.gravity, currentPosition.z + zSpeed));
		
		if(currentPosition.y <= 0)
		{
			reset();
		}
		
		if(!scored)
		{
			if(checkCollision())
			{
				score++;
				low = high;
				script.scoreText.text = score.toString();
				scored = true;
			}
		}
		
		if(low + .05 < high)
		{
			low += .04;
		}
	}
}
updateEvent.bind(updatedEvent);

var turnedOn = function(eventData)
{
	//transform.setWorldPosition(new vec3(0,41,200));
	script.scoreText.text = score.toString();
	setState(state);
}
turnedOnEvent.bind(turnedOn);

var checkCollision = function()
{
	if(!script.cupCollisionBox)
	{
		return;
	}
	
	var ballPosition = ball.getTransform().getWorldPosition();
	var rimPosition = script.cupCollisionBox.getTransform().getWorldPosition();
	
	var x1 = ballPosition.x;
	var y1 = ballPosition.y;
	var z1 = ballPosition.z;
	var x2 = rimPosition.x;
	var y2 = rimPosition.y;
	var z2 = rimPosition.z;
	
	if((x1 >= x2 - cupRadius) && (x1 <= x2 + cupRadius) && (z1 >= z2 - cupRadius) && (z1 <= z2 + cupRadius))
	{
		print(y1 + "," + y2);
		if((y1 <= y2 + 17) && (y1 >= y2 - 12))
		{
			return true;
		}
		else if(y1 <= y2)
		{
			low = high;
		}
	}
	return false;
}

var reset = function()
{
	ball.getTransform().setLocalPosition(new vec3(0, -19, -61));
	isThrowing = false;
	low = 1;
	high = 0;
	currentTouchX = null;
	currentTouchY = null;
	lastTouchX = null;
	lastTouchY = null;
	scored = false;
}

var setState = function(newstate)
{
	state = newstate;
	if(state == 1)
	{
		ball.getChild(0).enabled = true;
		script.cup.getFirstComponent("Component.ManipulateComponent").enabled = false;
	}
	else if(state == 2)
	{
		ball.getChild(0).enabled = false;
		script.cup.getFirstComponent("Component.ManipulateComponent").enabled = true;
	}
}