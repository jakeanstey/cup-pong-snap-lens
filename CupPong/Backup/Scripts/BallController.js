// -----JS CODE-----
var touchComponent = script.getSceneObject().getFirstComponent("Component.TouchComponent");

var transform = script.getSceneObject().getTransform();
var touchStartedEvent = script.createEvent("TouchStartEvent");
var touchMovedEvent = script.createEvent("TouchMoveEvent");
var touchEndEvent = script.createEvent("TouchEndEvent");
var isTouchingBall = false;
var originalBallPosition;
var lastTappedPosition;
var startGravity = false;

var touchStarted = function(eventData)
{
    isTouchingBall = true;
	originalBallPosition = script.getTransform();
	lastTappedPosition = eventData.getTouchPosition();
}
touchStartedEvent.bind(touchStarted);

var touchMoved = function(eventData)
{
	if(isTouchingBall == true)
	{
		var addX = eventData.getTouchPosition().x - lastTappedPosition.x;
		var addY = eventData.getTouchPosition().y - lastTappedPosition.y;
		
		var transform = script.getSceneObject().getTransform();
		
		transform.setWorldPosition(transform.getWorldPosition().add(new vec3(addX * 25, -(addY * 50), addY * 200)));
		
		lastTappedPosition = eventData.getTouchPosition();
	}
}
touchMovedEvent.bind(touchMoved);

var touchEnded = function(eventData)
{
	isTouchingBall = false;
	startGravity = true;
}
touchEndEvent.bind(touchEnded);

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function (eventData)
{
	var transform = script.getTransform();
	print(startGravity);
    if(startGravity)
	{
		if(transform.getLocalPosition().y <= -30)
		{
			startGravity = false;
			return;
		}
		
		var pos = transform.getWorldPosition();
		pos.y -= eventData.getDeltaTime() * 40.0;
		transform.setWorldPosition(pos);
	}
});