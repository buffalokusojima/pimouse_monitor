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

function submit(){
    var linear_x = document.getElementById('linear_x').value;
    var linear_y = document.getElementById('linear_y').value;
    var linear_z = document.getElementById('linear_z').value;

    var angular_x = document.getElementById('angular_x').value;
    var angular_y = document.getElementById('angular_y').value;
    var angular_z = document.getElementById('angular_z').value;

    linear_x = parseInt(linear_x)*0.001;
    linear_y = parseInt(linear_y)*0.001;
    linear_z = parseInt(linear_z)*0.001;

    angular_x = 3.141592*parseInt(angular_x)/180;
    angular_y = 3.141592*parseInt(angular_y)/180;
    angular_z = 3.141592*parseInt(angular_z)/180;

    var v = new ROSLIB.Message({linear:{x:linear_x,y:linear_y,z:linear_z}, angular:{x:angular_x,y:angular_y,z:angular_z}});
    vel.publish(v);
}