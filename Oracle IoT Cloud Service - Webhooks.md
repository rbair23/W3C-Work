# Oracle IoT Cloud service Event Model

The Oracle IoT Cloud service provides an event model (messaging model) with two different message types:

- regular messages
- alerts

Regular messages are sent by devices on status changes or at regular intervals, whereas alerts are sent to indicate an error condition that must be brought to the attention of a human. 
The management console and server-side applications of the IoT Cloud Service distinugish between alerts and regular messages in the UI and provide alarming mechanisms.
Devices must be registered at the IoT Cloud service (which involves the exchange of security information) before a device
can send messages. The device is an active component and decides by itself when a message or an alert is sent.

Messages are sent to the IoT Cloud Service via a REST API or by using Oracle's open source device client libraries, which are available for multiple platforms. Messages are sent as an array of JSON objects. A type field identifies the type of each message.

The REST API endpoint for sending messages is described in more detail at https://docs.oracle.com/en/cloud/paas/iot-cloud/iotrq/op-iot-api-v2-messages-post.html

A higher level of abstraction is provided by the client libraries (https://www.oracle.com/technetwork/indexes/downloads/iot-client-libraries-2705514.html)

## Exposed devices 

The Oracle IoT Cloud service provides a flexible integration mechanism for integrating with other off-the-shelf enterprise systems. Supported systems include Storage Cloud Service, Business Integration Cloud Service, Big Data Cloud Service, Mobile Cloud Service and others. 

An overview of the various integratable cloud services can be seen at:
https://docs.oracle.com/en/cloud/paas/iot-cloud/iotgs/integrating-external-services.html

The IoT Cloud service also includes a generic mechanism for integrating other cloud services via the WebHook mechanism,
which will be used by WoT compliant devices.
This mechanism establishes a client/server connection between the Oracle IoT Cloud Service (Client role) with a (HTTP) server in the target service.
An application registeres a HTTP(s) callback and receives device messages via a  POST HTTP request, with the request payload containing the device message data in JSON format.
   
This mechanism is simple and powerful: It permits to select multiple message formats (across different device models) to be transmitted over a single integration.

The message formats, that are to be transmitted are selected when the integration is transferred. The intergration persists , when the communication partner goes down and is resumed, when it is back online.

In a typical use case, an enterprise system is interested in messages from multiple devices, however it is also possible to create an integration at single device level.

https://docs.oracle.com/en/cloud/paas/iot-cloud/iotgs/integrating-enterprise-applications-oracle-iot-cloud-service.html


### Payload examples 
The payload format is plain JSON, as can be seen in the examples below. It contains message metadata, such as a message id, a client Id and a message source and timestamps and the actual payload format.

#### Environment Sensor (KETI):

```
[  
  {  
    "id": "4f659097-573a-4840-8671-01ae63a90b96",  
    "clientId": "30d16f7d-e6cb-4a85-92e6-c0adfa67edc7",  
    "source": "00569C39-5DB6-46A3-990B-D3B010164A06",  
    "destination": "",  
    "priority": "MEDIUM",  
    "reliability": "BEST_EFFORT",  
    "eventTime": 1535034285572,  
    "sender": "",  
    "type": "DATA",  
    "properties": {},  
    "direction": "FROM_DEVICE",  
    "receivedTime": 1535034287419,  
    "sentTime": 1535034287689,  
    "payload": {  
      "format": "urn:com:energyiotlab:iot:attributes",  
      "data": {  
        "$(source)_id": "00569C39-5DB6-46A3-990B-D3B010164A06",  
        "temperature": 28.76,  
        "humidity": 19.55,  
        "co2": 643,  
        "sound": 38.72,  
        "light": 115.35,  
        "voc": 406,  
        "microwave": 0  
      }  
    }  
  }  
]  
```
#### Festo Plant (Siemens)

```
  {
    "id": "7a1deb2f-a8f1-4054-a7eb-bef0987c7343",
    "clientId": "f9935ba0-d510-44d9-8253-7ee0ac1e6707",
    "source": "ECAEB49A-FD77-4D9F-950B-66EA4DE74FD7",
    "destination": "",
    "priority": "LOW",
    "reliability": "BEST_EFFORT",
    "eventTime": 1535037692571,
    "sender": "",
    "type": "DATA",
    "properties": {},
    "direction": "FROM_DEVICE",
    "receivedTime": 1535037692589,
    "sentTime": 1535037692597,
    "payload": {
      "format": "urn:com:siemens:wot:FestoPlant:attributes",
      "data": {
        "$(source)_id": "ECAEB49A-FD77-4D9F-950B-66EA4DE74FD7",
        "Tank101overflowStatus": false,
        "Tank102levelvalue": 39.74528157680635,
        "Tank102overflowStatus": false,
        "ValveStatus": false,
        "PumpStatus": false,
        "Tank101levelvalue": 60.25471842319365,
        "Tank101maximumLevelStatus": false,
        "Tank101minimumLevelStatus": true
      }
    }
  }

```



