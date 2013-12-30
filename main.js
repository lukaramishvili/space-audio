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

var stage = zThree().init().animate().addRenderListener(function(){
    //this.objects["mesh"].rotation.y += 0.02;
});

var zOff = 500;
var zMiddle = 1000;
var zOn = 1500;

var xMin = -12;
var xMax = 12;
var yMin = 100;
var yMax = 1000;
var zMin = -4200;
var zMax = 4200;

setInterval(function(){console.log(stage.objects["arrow"].position);}, 1000);

var leap = zLeap().init(function(frame, prevFrame){
    //just animate the pyramid for the time being
    stage.objects["arrow"].rotation.x += 0.04;
    stage.objects["arrow"].rotation.y += 0.04;
    stage.objects["arrow"].rotation.z += 0.04;
    if(frame.hands.length > 0 && prevFrame.hands.length > 0){
	var h1 = frame.hands[0];
	var ph1 = prevFrame.hands[0];
	for(var i in h1.fingers){
	    //console.log(h1);
	    if(h1.fingers.length > 0 && ph1.fingers.length > 0){
		var h1f1 = h1.fingers[0];
		var ph1f1 = ph1.fingers[0];
		var xDiff = (h1f1.tipPosition[0] - ph1f1.tipPosition[0]) / 50;
		var yDiff = (h1f1.tipPosition[1] - ph1f1.tipPosition[1]) / 50;
		var zDiff = (h1f1.tipPosition[2] - ph1f1.tipPosition[2]) * 15;
		stage.objects["arrow"].position.y += yDiff;
		var xFinal = stage.objects["arrow"].position.x + xDiff;
		xFinal = Math.min( Math.max(xFinal, xMin)
					    , xMax);
		var zFinal = stage.objects["arrow"].position.z + zDiff;
		zFinal = Math.min( Math.max(zFinal, zMin)
					    , zMax);
		stage.objects["arrow"].position.x = xFinal;
		stage.objects["arrow"].position.z = zFinal;
		var factor = 1.0 - zFinal / (  (Math.abs(zMin)+Math.abs(zMax)) /*- stage.objects["arrow"].position.z*/ );
		if (factor < 0) factor = 0.0;
		if (factor > 1) factor = 1.0;
		var value = Math.pow(2, 13 * factor);
		
		mixer.filters[0].frequency.value = value;
		mixer.filters[0].Q.value = 40 * Math.min(1.0, Math.max(0.0, 
				((xFinal)/((Math.abs(xMin)+Math.abs(xMax)) - stage.objects["arrow"].position.x))));
		console.log(mixer.filters[0].Q.value);
		//
		//console.log(stage.objects["arrow"].position);
		//
		//var zPos = stage.objects["arrow"].position.z;
		/*var zPos = h1f1.tipPosition[2];
		var clickStatus = zPos < zOff ? "off"
		    : (zPos > zOn ? "on" : "middle");*/
		//
		//console.log(stage.objects["arrow"].position);
		
		//console.log(h1f1.tipPositiona);
		//console.log(clickStatus);
	    }
	}
    }
});

var mixer = zAudio().init();
mixer.loadSound("assets/samples/techno.wav", 
		function(buffer){
		    mixer.addFilter(mixer.createFilter(48000, 1000));
		    //mixer.addFilter(mixer.createFilter(48000,  10));
		    //mixer.addFilter(mixer.createFilter(1000, 20));
		    //mixer.addFilter(mixer.createFilter(4000, 40));
		    mixer.setBuffer(buffer);
		    mixer.startPlaying();
		});

