// -----JS CODE-----
//@input Component.WorldTracking worldTracker

if(script.getSceneObject().getComponentCount("Component.TouchComponent") > 0)
{
    script.getSceneObject().getFirstComponent("Component.TouchComponent").addTouchBlockingException("TouchTypeDoubleTap");
}

function onSurfaceReset(eventData)
{
    script.getSceneObject().getTransform().setLocalPosition(originalPosition);
    setTrackingTarget();
}
var worldTrackingResetEvent = script.createEvent("WorldTrackingResetEvent");
worldTrackingResetEvent.bind(onSurfaceReset);


function setTrackingTarget()
{
    if(script.worldTracker)
    {
        script.worldTracker.surfaceTrackingTarget = script.getSceneObject();
    }
}
setTrackingTarget();