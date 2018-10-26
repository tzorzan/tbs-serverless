var AWS = require('aws-sdk');
var _ = require('lodash');

var config = {
    "thingName": process.env.THING_NAME,
    "endpointAddress": process.env.IOT_ENDPOINT_ADDRESS
};

var IotData = new AWS.IotData({endpoint: config.endpointAddress});

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    var shadowUpdate = {};
    _.merge(shadowUpdate, setStatusFromLightSensor(event.previous.state, event.current.state)); 
    
    if(!_.isEmpty(shadowUpdate)) {
        console.log("Update shadow: " + JSON.stringify(shadowUpdate));
        try {
            var data = await IotData.updateThingShadow({
                    payload: JSON.stringify(shadowUpdate),
                    thingName: config.thingName
                }).promise();
            console.log(data);
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }
    return event;
};

function setStatusFromLightSensor(previousState, currentState) {
    var previousValue = _.find(previousState.reported.sensors, "light").light;
    var currentValue = _.find(currentState.reported.sensors, "light").light;
    
    if(previousValue != currentValue) {
        var currentStatus;
        switch (currentValue) {
            case 'ON':
                currentStatus = "OCCUPIED";
                break;
            case 'OFF':
                currentStatus = "FREE";
                break;
        }
        
        var obj = {
            "state": {
                "reported": {
                    "status": currentStatus
                }
            }
        };
    
        return obj;
    }
}
