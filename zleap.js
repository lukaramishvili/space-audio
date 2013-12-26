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

function frameValid(frame) { return frame && frame.valid; }

function zLeapClass(){
    var thiz = this;
    
    // Store frame for motion functions
    var prevFrame = null;
    var currentFrame = null;
    var paused = false;
    var pauseOnGesture = false;

    // Setup Leap loop with frame callback function
    var controllerOptions = {enableGestures: true};

    this.init = function(callback){
	Leap.loop(controllerOptions, function(frame) {
	    prevFrame = currentFrame;
	    currentFrame = frame;
	    if (paused) {
		return; // Skip this update
	    }
	    callback.apply(thiz, [currentFrame, prevFrame]);
	    // Store frame for motion functions
	    if(!frameValid(prevFrame)){ prevFrame = currentFrame; }
	});
	return thiz;
    };
    return thiz;
};

function zLeap(){
    return zLeapClass.apply({}, arguments);
}