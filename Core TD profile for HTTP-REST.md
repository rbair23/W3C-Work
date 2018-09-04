# W3C Web of Things: A WoT Core Profile for HTTP/REST

## Introduction

The W3C WoT Thing Description (Latest Editors Draft: https://w3c.github.io/wot-thing-description) defines a very powerful format to describe myriads of very different devices, which may be connected over various protocols. 
The format is very flexible and open and puts very few normative requirements on devices that implement it. This flexibility permits an easy integration of new device types and protocols, however it risks interoperability, since there are no guarantees that two devices which are formally spec-compliant, will be able to communicate.

To increase adoption of the specification, interoperability between devices and the cloud is crucial. Even if every manufacturer is implementing the current spec in full flexibility, there is no interoperability guarantee; many choices are left to the implementations and there are very few normative requirements that a device has to fulfill.  

#### Why define a core TD profile?
During the recent WoT plug-fests there were many de-facto agreements on the use of a small subset of interaction patterns and protocol choices. These de-facto agreements select a common subset of the TD specification, based on proven interoperability among manufacturers.

The aim of this specification is to formalize these agreements by defining a **core TD profile** based on the choices that were made by the implementers of plug fest devices.
 
The *core TD profile* contains additional normative requirements that MUST be satisfied by devices to be compliant to the profile. 

Adoption of the *core TD profile* will significantly limit the implementation burden of device and cloud implementors.

The *core TD profile* makes choices on the required metadata fields as well as the supported interactions and protocol endpoints. It introduces some constraints on properties and actions that are required for resource constrained devices in real-world deployments. The format does not prevent the use of additional elements of the TD and permits vendor specific extensions, however this will impact interoperability.

#### Out-of-the-box interoperability
Devices which implement the core profile are **out-of-the-box interoperable** with other HTTP/REST core compliant devices. Furthermore, the core profile simplifies device validation and compliance testing since a corresponding conformance test suite can be defined. 

> Note: It is also a goal of the *core TD profile* to ensure that compliant files can be understood by humans - therefore descriptions, dates, and author fields are either mandatory or highly recommended.

## Terminology

This specification uses the same terminology as the WoT Thing Description specification.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL
     NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED",  "MAY", and
     "OPTIONAL" in this document are to be interpreted as described 
     in RFC 2119. (https://www.ietf.org/rfc/rfc2119.txt)

#### Additional Definitions:

| Term | Definition |
-------|--------------
| core profile | The subset of the TD specification defined by the present document
| Interface TD | Functional interface of things (a thing type)

## The WoT Core Profile
 

### Thing Types and Instances
The **core profile** distinguishes between the **type** of a thing and a concrete **thing**. The type defines a functional **interface** to multiple things. A thing **instance** describes the concrete implementation on a device, e.g. metadata information such as manufacturer, model, location, the supported protocol(s) and security mechanism(s).

This concept follows the object oriented paradigm of separating the interface from the implementation.

#### Why the separation of an interface and an instance?

The *interface* of a thing can be understood as a template or bluperint and is defined by a common **Interface Thing Description** *(Interface TD)* of a thing, which declares a functional interface of devices **across different vendors**.
This mechanism can be used with plain JSON thing descriptions and fosters standardisation of common interfaces across different manufacturers. This increases the market size for common applications, which can be created and reused for devices/things from different vendors.

The *interface* MAY include semantic annotations in JSON-LD to enable common type annotations, which allows enhanced use cases.

The *instance* is a concrete thing, which has values for metadata fields and a protocol binding. In the *core profile* the protocol binding is *HTTP/REST with JSON payloads*.  

> Note: The HTTP/REST with JSON protocol binding should be added as the **default binding** to the WoT TD specification, so it is not necessary to define it explicitly. 

If an instance offers a binding to another protocol, the instance TD MUST indicate whether this default HTTP/REST binding is also offered. 

The *core profile* also defines an **Instance Thing Description** *(instance TD)*, which contains concrete values for metadata fields (e.g. manufacturer, model number, location), protocol bindings and security information. 

A thing instance MAY implement multiple interfaces. In this case the instance TD combines multiple interface TDs.

## Interface Thing Description (IF-TD)

In the following section, there are various type identifiers, which are prefixed with "js_". This denotes that the types are defined in the ECMA-Script specification (http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf)

### Metadata Fields
To provide minimum interoperability the following metadata fields MUST be contained in an *Interface TD*:

 key     |  type         | constraints 
----------|---------------|------
 name     | js_identifier | 
id   | urn_type | a globally unique urn of the interface
description | js_string   |
created | js_date         |
lastModified | js_date    | 
version | string | Format: major.minor.subversion, 3 integer values separated by dots.

It is RECOMMENDED to include the following fields:

 key     |  type         | remarks 
----------|---------------|---------
author | uri_type | RECOMMENDED to use a mailto  
userLastModified | uri_type | 

##### Recommended practice:

If an IF-TD is used within a company, the email address of the developer SHOULD be used in this field,
if the IF-TD is provided externally, a support email address conforming to the mailto scheme (https://tools.ietf.org/html/rfc6068) SHOULD be used.

### Properties

The following property fields MUST be contained in an *Interface TD*:

 key     |  type         | constraints 
----------|---------------|------
 name     | js_identifier | unique name among all properties
description | js_string   | human readable description
type | js_string | one of "boolean", "string", "number", "integer". The type values "object", "array" or "null" SHOULD NOT be used. If they are present, they MUST be treated as strings.

A property is represented as a JSON object with the key name.

It is RECOMMENDED to include the following fields:

key     |  type         | constraints 
----------|---------------|------
 writable | js_boolean | If this key is not present, the default value is false
 unit | js_string | measurement unit of the property, such as C/F/K for temperatures, dB, lux, ...

The following fields may be included for properties of the type number and integer:

key     |  type         | constraints  
----------|---------------|------
minimum | js_number | minimum <= maximum
maximum | js_number | minimum <= maximum
 
The following fields that are defined in the DataSchema MUST NOT be included in an interface description conforming to the core profile:

key     |  type         | remarks  
----------|---------------|------
const	| anyType | not applicable for properties
enum | array of anyType | too complex to implement on resource constrained devices

#### Constraints against the TD specification

The set of properties is limited to a one-level hierarchy, i.e. sub-properties MUST NOT be used. Supported types are simple types, only boolean, string, and number are permitted. Array and Object types MUST not be used. 

> Note: This may appear as a severe limitiation, however it is motivated by integrating with multiple cloud services. Many enterprise services and applications are based on (relational) databases, where individual property values are stored. Of course databases can also store objects (e.g. encoded as a JSON string), however this will prevent processing by other enterprise applications.
> 
> If a property has a structure, such as a RGB color, the structure can be represented in the key of the property, i.e. color\_r, color\_g and color\_b.
> A similar mapping can be done for arrays and hierarchical objects.
> This constraint leads to simpler interface descriptions that can be handled by very limited devices.  

### Actions

The following fields MUST be contained in an action element of an *Interface TD*:

 key     |  type         | constraints 
----------|---------------|------
 name     | js_identifier | unique name among all actions
 input    | array of DataSchema   | only the subclasses booleanSchema, IntegerSchema, NumberSchema, StringSchema are permitted
 output   | array of DataSchema   | only the subclasses booleanSchema, IntegerSchema, NumberSchema, StringSchema are permitted

An action is represented as a JSON object with the key name.

The DataSchema subclasses ArraySchema and ObjectSchema MUST NOT be used in an Interface TD conforming to the core profile. They put a higher implementation burden on resource constrained devices (arbitrary cascaded arrays and multi-level objects) which cannot be satisifed by all devices.
 
The following fields MUST be contained in a DataSchema:

 key     |  type         | constraints  
----------|---------------|------
description |	human readable description
type | js_string | one of boolean, integer, number, string

The values "object", "array", or "null" MUST NOT be used in the type field. 
   
The following fields that are defined in the DataSchema MUST NOT be included in the core profile:

key     |  type         | remarks 
----------|---------------|------
const	| anyType | not applicable for properties
enum | array of anyType | too complex to implement on resource constrained devices

### Events

The following fields MUST be present in an event element of an *Interface TD*:

 key      |  type         | constraints 
----------|---------------|------
 name     | js_identifier | unique name among all actions
 description | js_string  | human readable description
 label    | display text for UI representation
 payload   | set of DataSchema instances in a JSON object | only the DataSchema subclasses booleanSchema, IntegerSchema, NumberSchema, StringSchema are permitted
 
An event is represented as a JSON object with the key name.

## (Instance) Thing Description

The **Instance Thing Description** describes a concrete thing - we just name it here **Instance TD** to call out the difference between the *interface* and the *implementations*.

An *Instance TD* MAY implement one or more **Interface TDs**. 

It contains metadata fields, links and security configurations of a concrete thing and a mapping of properties, actions and events to protocols.

The core profile defines a default mapping of the interaction patterns (properties, actions and events) to HTTP/REST with JSON payloads and a subset of the security schemes.

Each interaction resource (property, action) contains an additional "form" entry with the following fields:

 key      |  type         | constraints 
----------|---------------|------
href	| uri_type | URI of the endpoint 

An **Instance Thing Description** has the following structure:
  
 | Instance Thing Description   | 
 | ---------------------------- |
 | metadata fields of the thing |
 | array of thing interfaces with corresponding protocol bindings | 

Protocol bindings are specified with the *Form* 

### Metadata fields
To provide minimum interoperability the following metadata fields MUST be contained in an *Instance TD*:

 key     |  type         | remarks 
----------|---------------|------
 name  | js_string
 id    | urn_type | a globally unique urn of the thing instance
 base  | uri_type | 
manufacturer | js_string  | 
modelNumber | js_string  | 
deviceDescription |  js_string | human-readable description
deviceCreated | js_date  | 
deviceLastModified | js_date  | 
deviceUserLastModified | js_string | 
security | array of SecurityScheme

It is RECOMMENDED to use the value "Unknown" for strings, where the value cannot be determined. For unknown dates, use of the value "xxx" is RECOMMENDED.

It is RECOMMENDED to include the following fields:

 key     |  type         | remarks 
----------|---------------|---------
serialNumber | js_string  | 
hardwareRevision | js_string  | 
softwareRevision | js_string |
loc_latitude | js_number  | Text string representation of latitude as defined in annex H of ISO-6709
loc_longitude | js_number  | Text string representation of longitude as defined in annex H of ISO-6709 
loc_height | js_number  | Text string representation of height as defined in annex H of ISO-6709

If a location is provided, all three location MUST be present.

### Properties

#### HTTP Protocol Binding

The HTTP verbs GET and PUT are mapped on reading and writing a property - all other protocol verbs return an error "405 Method Not Allowed".

> Note: Since HTTP does not provide a pub/sub mechanism, the observe interaction is not supported directly. The event mechanism can be used instead to send notifications on property changes.

Multiple properties can be set/get by accessing the Properties endpoint.

### Actions

Actions can be synchronous and asynchronous. The current TD specification does not distinguish these two cases and does not yet describe a detailed mechanism. 
Once these details are defined in the TD spec, the *core profile* will define an adequate subset and HTTP/REST mapping.

#### HTTP Protocol Binding

The HTTP verb POST is mapped to invoking an action on the actions endpoint - all other protocol verbs return an error "405 Method Not Allowed".

### Events

Events are currently under discussion and not yet fully specified. 
The current WoT specs do not yet define a way to describe event payloads and different protocol bindings.
Once these details are specified, the *core profile* will define an adequate subset and mapping.
It is expected that the supported protocols include WebHooks, WebSockets, SSE and Long polling.

### Protocol Binding

All communication is using JSON playloads over HTTP/REST. 
The content type header MUST be set to "application/json".

### Links

Since the relations of a link are currently undefined, the core specification does not put additional constraints or requirements. The interpretation of a link is out of scope.

### Security

The core profile defines a subset of the security schemes that can be implemented on resource constrained devices. A security scheme MUST be defined at the thing or interface level. It is applied to an interface as a whole or to the entire thing. 

The set of required security schemes will be determined after the online plug fest. 

Candidates include:

- no security
- Basic Auth
- Digest
- Bearer Token
- PSK
- Oauth2

## External TD representations

The default representation is JSON. 
Semantic annotations based on JSON-LD MAY be present but are not required to perform all interactions with the thing instance.

## Normative references

urn_type = \<a valid URN as defined in https://tools.ietf.org/rfc/rfc2141.txt
\>

uri_type = \<a valid URI as defined by https://tools.ietf.org/rfc/rfc3986.txt
\>

js_identifier = \<a valid ECMAScript identifier name as defined in chapter 11.6 of
http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
\>

js_number = \<a valid ECMAScript number as defined in chapter 20.1 of
http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
\>

js_string = \<a valid ECMAScript string literal as defined in chapter 11.8.4 of
http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
\>

js_date = \<a valid ECMAScript date as defined in chapter '20.3.1.16 Date Time String Format' of http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
\>

(https://tools.ietf.org/html/rfc6068).

#### Open Issues

- finalize async and sync actions when TD spec is clear
- define event payload mapping once binding spec handles webhools, long poll and SSE
- Examples
