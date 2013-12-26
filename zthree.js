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

function zThreeClass(){
    var thiz = this;

    var camera, scene, renderer;
    thiz.objects = {};
    var loader, loadCompleted = false;

    thiz.init = function() {
    
	camera = new THREE.PerspectiveCamera( 0.2, 
		window.innerWidth / window.innerHeight, 1, 1000000 );
	camera.position.z = 5000;
	
	scene = new THREE.Scene();
	
	loader = new THREE.JSONLoader();
	loader.load("assets/models/monster12.js", function(g){
	    var geometry = g;
	    var mat = new THREE.MeshBasicMaterial( 
		{ color: 0xff0000, wireframe: false } );

	    thiz.objects["arrow"] = new THREE.Mesh( 
		// radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, 
		// segmentsAlongHeight,
		new THREE.CylinderGeometry( 0, 1, 2, 4, 4 ), 
		mat );
	    scene.add( thiz.objects["arrow"] );
	    
	    loadCompleted = true;
	});
	
	renderer = new THREE.CanvasRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );

	return thiz;
    };

    thiz.animateCallbacks = [];
    thiz.addRenderListener = function(callback) {
	if(typeof callback === 'function') {
	    thiz.animateCallbacks.push(callback);
	}
	return thiz;
    }

    thiz.animate = function() {
	// note: three.js includes requestAnimationFrame shim
	requestAnimationFrame( thiz.animate );
	if(loadCompleted){

	    for(var i in thiz.animateCallbacks){
		thiz.animateCallbacks[i].apply(thiz, []);
	    }

	    renderer.render( scene, camera );
	}
	return thiz;
    };
    return thiz;
};

function zThree(){
    return zThreeClass.apply({}, arguments);
}