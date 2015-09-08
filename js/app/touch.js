var touch = (function() {
  var delta, now, topStart,topEnd, leftStart, leftEnd, deltaX=0, deltaY=0;
  var touchs = {}
  return function(obj, fn){

    obj.addEventListener('touchstart', function(event) {
        now = new Date().getTime();
        delta = now - (touchs.last||now);

        if (delta > 0 && delta <= 250) touchs.doubleTap = true;
        touchs.last = now;

        topStart = event.touches[0].pageY;
        leftStart = event.touches[0].pageX;
    }, false);
    obj.addEventListener('touchmove', function(event){
        topEnd = event.touches[0].pageY;
        leftEnd = event.touches[0].pageX;
        deltaX += Math.abs(leftStart - leftEnd);
        deltaY += Math.abs(topStart - topEnd);
    });
    obj.addEventListener('touchend', function(event) {

        if (Math.abs(topStart - topEnd) > 30 || Math.abs(leftStart - leftEnd) > 30) {
            touchs = {};
        } else {
            if ('last' in touchs) {
                if (deltaX < 30 && deltaY < 30) {

                    fn.call(this);
                    touchs = {};
                }
            }
        }
    deltaX = deltaY = 0;
    }, false);
  }
}());