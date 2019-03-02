
var ros = new ROSLIB.Ros({ url : 'ws://' + location.hostname + ':9000' });
ros.on('connection', function() {console.log('websocket: connected'); });
ros.on('error', function(error) {console.log('websocket error: ', error); });
ros.on('close', function() {console.log('websocket: closed');});

var ls = new ROSLIB.Topic({
    ros : ros,
    name : '/lightsensors',
    messageType : 'pimouse_ros/LightSensorValues'
});


//距離センサの処理とカメラの処理の間に以下のコードを記述
var on = new ROSLIB.Service({
    ros : ros,
    name : '/motor_on',
    messageType : 'std_srvs/Trigger'
});

var off = new ROSLIB.Service({
    ros : ros,
    name : '/motor_off',
    messageType : 'std_srvs/Trigger'
});

on.callService(ROSLIB.ServiceRequest(),function(result){
   if(result.success){
       console.log("motor on success");
   }else{
       console.log("motor on failed");
   }
});

/**
$('#motor_off').on('click', function(e){
    off.callService(ROSLIB.ServiceRequest(),function(result){
	if(result.success){
	    $('#motor_on').attr('class','btn btn-default');
	    $('#motor_off').attr('class','btn btn-primary');
	}
    });
});
*/
var vel = new ROSLIB.Topic({
    ros : ros,
    name : '/cmd_vel',
    messageType : 'geometry_msgs/Twist'
});

/*
function pubMotorValues(){
    fw = $('#vel_fw').html();
    rot = $('#vel_rot').html();

    fw = parseInt(fw)*0.001;
    rot = 3.141592*parseInt(rot)/180;
    v = new ROSLIB.Message({linear:{x:fw,y:0,z:0}, angular:{x:0,y:0,z:rot}});
    vel.publish(v);
}

/**
$('#touchmotion').on('click', function(e){
    rect = $('#touchmotion')[0].getBoundingClientRect();
    x = e.pageX - rect.left - window.pageXOffset;
    y = e.pageY - rect.top - window.pageYOffset;

    vel_fw = (rect.height/2 - y)*3;
    vel_rot = rect.width/2 - x;
});

setInterval(pubMotorValues,100);
*/
document.getElementById('camstream').data = 'http://'                                                                                                                                          
    + location.hostname                                                                                                                                                                          
    + ':10000/stream?topic=/cv_camera_node/image_raw';                                                                                                                                           

/*
var imageNr = 0;
var finished = new Array();

function createImageLayer() {
    var img = new Image();
    img.style.position = "absolute";
    img.style.zIndex = -1;
    img.onload = imageOnload;
    img.src = "http://" + location.hostname + ":10000/stream?topic=/cv_camera_node/image_raw";
    var webcam = document.getElementById("webcam");
    webcam.insertBefore(img, webcam.firstChild);
}

function imageOnload() {
    this.style.zIndex = imageNr;
    while (1 < finished.length) {
	var del = finished.shift();
	del.parentNode.removeChild(del);
    }
    finished.push(this);
    createImageLayer();
}*/

//scrole forbitten
document.addEventListener('touchmove', function(e) {e.preventDefault();}, {passive: false});

var touchArea = document.getElementById('touchArea');
var camArea = document.getElementById('camstream');

var touchAreaRect = touchArea.getBoundingClientRect();

var touchAreaX = touchAreaRect.width;
var touchAreaY = touchAreaRect.top + touchAreaRect.height;
var MOVE_AREA_X_MAX = touchAreaX * 0.4;
var CAMERA_AREA_X_MIN = touchAreaX * 0.6;
var CAMERA_AREA_X_MIDDLE = CAMERA_AREA_X_MIN + (touchAreaX - CAMERA_AREA_X_MIN)/2;
var TOUCH_AREA_Y = touchAreaY * 0.6;
var TOUCH_AREA_MIDDLE_Y = TOUCH_AREA_Y + (touchAreaY - TOUCH_AREA_Y)/2;
var MOVE_AREA_SPEED_LOW_MIN = TOUCH_AREA_MIDDLE_Y - (TOUCH_AREA_MIDDLE_Y - TOUCH_AREA_Y)/2;
var MOVE_AREA_SPEED_LOW_MAX = touchAreaY - (touchAreaY - TOUCH_AREA_MIDDLE_Y)/2;
var CAMERA_AREA_SPEED_LOW_MIN = CAMERA_AREA_X_MIDDLE - (CAMERA_AREA_X_MIDDLE - CAMERA_AREA_X_MIN)/2;
var CAMERA_AREA_SPEED_LOW_MAX = touchAreaX - (touchAreaX - CAMERA_AREA_X_MIDDLE)/2;
var fw=0;
var rot=0;

// show px of x and y when iphone laid
window.addEventListener("orientationchange", function(){
    touchAreaRect = touchArea.getBoundingClientRect();
    touchAreaX = touchAreaRect.width;
    touchAreaY = touchAreaRect.top + touchAreaRect.height;
    MOVE_AREA_X_MIX = touchAreaX * 0.4;
    CAMERA_AREA_X_MIN = touchAreaX * 0.6;
    TOUCH_AREA_Y = touchAreaY * 0.6;
    TOUCH_AREA_MIDDLE_Y = TOUCH_AREA_Y + (touchAreaY - TOUCH_AREA_Y)/2;
    MOVE_AREA_SPEED_LOW_MIN = TOUCH_AREA_MIDDLE_Y - (TOUCH_AREA_MIDDLE_Y - TOUCH_AREA_Y)/2;
    MOVE_AREA_SPEED_LOW_MAX = touchAreaY - (touchAreaY - TOUCH_AREA_MIDDLE_Y)/2;
    CAMERA_AREA_X_MIDDLE = CAMERA_AREA_X_MIN + (touchAreaX - CAMERA_AREA_X_MIN)/2;
    CAMERA_AREA_SPEED_LOW_MIN = CAMERA_AREA_X_MIDDLE - (CAMERA_AREA_X_MIDDLE - CAMERA_AREA_X_MIN)/2;
    CAMERA_AREA_SPEED_LOW_MAX = touchAreaX - (touchAreaX - CAMERA_AREA_X_MIDDLE)/2;
    fw=0;
    rot=0;
    document.getElementById('testLeft').innerText = "laid,"+touchAreaX+","+touchAreaY;
});

touchArea.addEventListener('touchstart', function(event){

    for(var i=0; i<event.touches.length; i++){
	console.log(event.touches[i].pageX+","+event.touches[i].pageY);
	var x = event.touches[i].pageX;
	var y = event.touches[i].pageY;

	if(x > 0 && x < MOVE_AREA_X_MAX){
	    console.log("moveArea");
	}

	if(x > CAMERA_AREA_X_MIN && x < touchAreaX){
	    console.log("cameraArea");
	}
    }
});

touchArea.addEventListener('touchmove',function(event){
    
    for(var i=0; i<event.touches.length; i++){
	console.log(event.touches[i].pageX+","+event.touches[i].pageY);
	var x = event.touches[i].pageX;
    var y = event.touches[i].pageY;
    document.getElementById('testLeft').innerText = x+","+y+"<br>"+touchAreaX+","+touchAreaY;

    //need to think about under the max of the below
	if(x > 0 && x < MOVE_AREA_X_MAX && TOUCH_AREA_Y < y && y < touchAreaY){
	    console.log("moveAreaMoving");
        document.getElementById('testLeft').style.backgroundColor = 'red';
        
        if(MOVE_AREA_SPEED_LOW_MIN < y && y < TOUCH_AREA_MIDDLE_Y){
            fw = 30;
        }else if(TOUCH_AREA_MIDDLE_Y < y && y < MOVE_AREA_X_MAX){
            fw = -30;
        }else if(y < MOVE_AREA_X_MIX){
            fw = 50;
        }else if(MOVE_AREA_X_MAX < y){
            fw = -50;
        }

	    //fw = TOUCH_AREA_MIDDLE_Y - y;
	    //rot = MOVE_AREA_X_MAX - x;
	    console.log("raw data    fw:"+fw+" rot:"+rot);
	}

	if(x > CAMERA_AREA_X_MIN && x < touchAreaX && TOUCH_AREA_Y < y && y < touchAreaY){
        console.log("cameraAreaMoving");
        if(CAMERA_AREA_SPEED_LOW_MIN < x && x < CAMERA_AREA_X_MIDDLE){
            rot = 90;   
        }else if(CAMERA_AREA_X_MIDDLE < x && x < CAMERA_AREA_SPEED_LOW_MAX){
            rot = -90;
        }else if(x < CAMERA_AREA_SPEED_LOW_MIN){
            rot = 180;
        }else if(CAMERA_AREA_SPEED_LOW_MAX < x){
            rot = -180;
        }
	    document.getElementById('testRight').style.backgroundColor = 'green';
	}
    }
    fw = parseInt(fw)*0.01;
    rot = 3.141592*parseInt(rot)/180;

    document.getElementById('testRight').innerText = "send Data  fw:"+fw+" rot:"+rot;
    
    var v = new ROSLIB.Message({linear:{x:fw,y:0,z:0}, angular:{x:0,y:0,z:rot}});
    vel.publish(v);
});

touchArea.addEventListener('touchend',function(event){
    console.log("moveAreaTouched");
    document.getElementById('testRight').style.backgroundColor = 'white';
    document.getElementById('testLeft').style.backgroundColor = 'white';
    fw = 0;
    rot = 0;
    var v = new ROSLIB.Message({linear:{x:0,y:0,z:0}, angular:{x:0,y:0,z:0}});
    vel.publish(v);
});


camArea.addEventListener('touched', function(event){
    console.log("camera");
})
