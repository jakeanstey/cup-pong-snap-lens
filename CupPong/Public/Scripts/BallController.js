// -----JS CODE-----
var touchComponent = script.getSceneObject().getFirstComponent("Component.TouchComponent");

var transform = script.getSceneObject().getTransform();
var touchStartedEvent = script.createEvent("TouchStartEvent");
var touchMovedEvent = script.createEvent("TouchMoveEvent");
var touchEndEvent = script.createEvent("TouchEndEvent");
var isTouchingBall = false;
var originalBallPosition;
var lastTappedPosition;

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
		
		var transform = script.getSceneObject().getTransform()
		
		transform.setWorldPosition(transform.getWorldPosition().add(new vec3(addX * 25, -(addY * 50), addY * 60)));
		
		lastTappedPosition = eventData.getTouchPosition();
	}
}
touchMovedEvent.bind(touchMoved);

var touchEnded = function(eventData)
{
	isTouchingBall = false;
}