const EventEmitter = require('events');
const event = new EventEmitter();

// EVENT ADDITION AND CALL
event.addListener('visit', () => {
    console.log('Thanks to visit!');
});
event.on('terminate', () => {
    console.log('Good bye!');
});
event.on('terminate', () => {
    console.log('Please leave...');
});
event.once('special', () => {
    console.log('Special event for you :)');
});
event.emit('visit');
event.emit('terminate');
event.emit('special');
event.emit('special');

// EVENT  DELETION
// ALL
event.on('continue', () => {
    console.log('Continue???');
});
event.removeAllListeners('continue');
event.emit('continue');
// SPECIFIC
const callbackFunction = () => {
    console.log('Duplicated!');
};
event.on('duplicate', () => {
    console.log('Duplicated?');
});
event.on('duplicate', callbackFunction);
event.removeListener('duplicate', callbackFunction);
event.emit('duplicate');
console.log(event.listenerCount('duplicate'));
