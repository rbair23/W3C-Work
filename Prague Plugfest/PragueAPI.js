/**
 * Source: https://github.com/w3c/wot-scripting-api/issues/82
 */

 interface WoT {
    Observable<ConsumedThing> discover(optional ThingFilter filter);
    Promise<ThingDescription> fetchTD(USVString url);
    ConsumedThing             consume(ThingDescription td); // with fetch split out, we could make it synchrounous
    ExposedThing              expose(ThingTemplate init); // I think it was only symmetry to make it return a promise
};

typedef USVString ThingDescription;

// A full ThingTemplate aligned with ThingDescription requires pure JSON serialization of TD!
dictionary ThingTemplate {
    DOMString                   name;
    sequence<SemanticType>?     semanticTypes = []; // additional @types to "Thing" -- use case?
    sequence<SemanticMetadata>? metadata = []; // metadata fields in TD root (same level as 'name')
}

dictionary SemanticType {
    DOMString name;
    USVString context;
    DOMString prefix;
};

dictionary SemanticMetadata {
    SemanticType type;
    any          value;
};

interface ConsumedThing {
    readonly attribute DOMString name;
    readonly attribute ThingDescription td;
    Promise<any> readProperty(DOMString name); // aligned with 'writable'
    Promise<void> writeProperty(DOMString name, any value); // aligned with 'writable'
    Promise<any> invokeAction(DOMString name, any parameters);
    Observable onEvent(DOMString name);  // subscribe to events
    Observable onPropertyChange(DOMString name);  // subscribe to property change
    Observable onTDChange();  // subscribe to Thing Description change
};

interface ExposedThing: ConsumedThing {
    Promise<void> start(); // useful to make async or counter-productive?
    Promise<void> stop();
    Promise<void> register(USVString url); // convenience for Thing Directory
    Promise<void> unregister(USVString url); // convenience for Thing Directory
    Promise<void> emitEvent(DOMString eventName, any payload);

    void  addProperty(ThingPropertyInit property);  // throws on error
    void  removeProperty(DOMString name);  // throws on error
    void  addAction(ThingActionInit action);  // throws on error
    void  removeAction(DOMString name);  // throws on error
    void  addEvent(ThingEventInit event);  // throws on error
    void  removeEvent(DOMString name);  // throws on error
};

typedef DOMString ValueType;  // Linked Data JSON Schema

dictionary ThingPropertyInit {
    DOMString               name;
    ValueType               type;
    any                     initValue;
    boolean?                writable = false;
    boolean?                observable = false;
    sequence<SemanticType>? semanticTypes = [];
    sequence<SemanticMetadata>? metadata = []; // metadata fields in TD root (same level as 'name')
    callback?               onRead = Promise<any> (any oldValue) = null; // programmatic value creation (Function does not work for initValue); Promise for forwarding
    callback?               onWrite = Promise<void> (any oldValue, any newValue) = null; // for applying state changes; Promise for forwarding
};

dictionary ThingActionInit {
    DOMString               name;
    ValueType               inputType;
    ValueType               outputType;
    Function                action;
    sequence<SemanticType>? semanticTypes = [];
    sequence<SemanticMetadata>? metadata = []; // metadata fields in TD root (same level as 'name')
};

dictionary ThingEventInit {
    DOMString               name;
    ValueType               type; // Linked Data JSON Schema
    sequence<SemanticType>? semanticTypes = [];
    sequence<SemanticMetadata>? metadata = []; // metadata fields in TD root (same level as 'name')
};
