//// This file is part of Space Audio.

//// Space Audio is free software: you can redistribute it and/or modify
//// it under the terms of the GNU Affero General Public License as published by
//// the Free Software Foundation, either version 3 of the License, or
//// (at your option) any later version.

//// Space Audio is distributed in the hope that it will be useful,
//// but WITHOUT ANY WARRANTY/ without even the implied warranty of
//// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//// GNU Affero General Public License for more details.

//// You should have received a copy of the GNU Affero General Public License
//// along with Space Audio.  If not, see <http://www.gnu.org/licenses/>.

function zAudioClass(){
    var thiz = this;

    var context;

    thiz.defaultSound = undefined;
    thiz.filters = [];
    thiz.sourceNode = undefined;

    thiz.init = function() {
	try {
	    // Fix up for prefixing
	    window.AudioContext = window.AudioContext||window.webkitAudioContext;
	    context = new AudioContext();
	}
	catch(e) {
	    alert('Web Audio API is not supported in this browser');
	}
	return thiz;
    };

    //callback should be function(buffer){}
    thiz.loadSound = function(path, callback){
	var request = new XMLHttpRequest();
	request.open("GET", path, true);
	request.responseType = "arraybuffer";
	request.onload = function() {
	  context.decodeAudioData( request.response, callback );
	}
	request.send();
	//
	return thiz;
    };

    thiz.setBuffer = function(buffer){
	thiz.sourceNode = context.createBufferSource();
	thiz.sourceNode.buffer = buffer;
	thiz.sourceNode.loop = true;
    };

    thiz.connectFilters = function(){
	if(thiz.filters.length > 0){
	    thiz.sourceNode.connect( thiz.filters[0] );
	    for(var i = 1; i < thiz.filters.length; i++){
		thiz.filters[i-1].connect(thiz.filters[i]);
	    }
	    thiz.filters[thiz.filters.length-1].connect( context.destination );
	}
    };
    
    thiz.startPlaying = function(){
	if(thiz.filters.length > 0){
	    thiz.connectFilters();
	    thiz.sourceNode.start(0);
	    thiz.defaultSound = thiz.sourceNode;
	}
    };

    thiz.stopPlaying = function() {
	if (thiz.defaultSound)
	    thiz.defaultSound.stop(0);
	thiz.defaultSound = undefined;
    };

    thiz.createFilter = function(f, q){//TODO: parameters detune, gain, type
	var filter = context.createBiquadFilter();
	filter.frequency.value = f;
	filter.Q.value = q;
	return filter;
    };

    thiz.addFilter = function(filter){
	thiz.filters.push(filter);
    };

    thiz.reloadFilters = function(){
	thiz.stopPlaying();
	thiz.connectFilters();
	thiz.StartPlaying();
    };

    //
    return thiz;
};

function zAudio(){
    return zAudioClass.apply({}, arguments);
};




















/*o1 = context.createOscillator();
o1.type = 0; // sine wave
o1.frequency.value = 100;
o1.connect(context.destination);
o1.noteOn && o1.noteOn(0);


o2 = context.createOscillator();
o2.type = 0; // sine wave
o2.frequency.value = 200;
gainNode2 = context.createGainNode(); // Create gain node 2
o2.connect(gainNode2);
gainNode2.connect(context.destination);
gainNode2.gain.value = 60;
o2.noteOn && o2.noteOn(0);
var min = -1,fluc=20;
var f = function(){o2.frequency.value += min*20;
		   min*=-1;fluc-=10;
		   setTimeout(f,10 - fluc);
}
f();*/