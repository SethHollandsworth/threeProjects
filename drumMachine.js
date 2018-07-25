function init() {
    scene = new THREE.Scene();
    var stats = new Stats();
    var clock = new THREE.Clock();
    clock.start();

    document.body.appendChild(stats.dom);

    //gets rid of old animation call
    if (typeof(id) !== 'undefined') {
      cancelAnimationFrame(id);
    }
  
    //this sets up the scene, camera, renderer, and controls
    var gui = new dat.GUI();
    camera = initCamera();
    renderer = new THREE.WebGLRenderer();
    controls = initControls(camera,renderer);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    

    // set up lights
    var lightLeft = getSpotLight(1, 'rgb(255, 220, 180)');
    var lightRight = getSpotLight(1, 'rgb(255, 220, 180)');
	var lightTop = getPointLight(0.33, 'rgb(255, 220, 150)');

	lightLeft.position.x = -10;
	lightLeft.position.y = 6;
	lightLeft.position.z = -8;

	lightRight.position.x = 10;
	lightRight.position.y = 6;
	lightRight.position.z = -8;

	lightTop.position.x = 20;
	lightTop.position.y = 120;
    lightTop.position.z = 20;
    
    // dat.gui
	var folder1 = gui.addFolder('light_1');
	folder1.add(lightLeft, 'intensity', 0, 10);
	folder1.add(lightLeft.position, 'x', -5, 15);
	folder1.add(lightLeft.position, 'y', -5, 15);
	folder1.add(lightLeft.position, 'z', -5, 15);

	var folder2 = gui.addFolder('light_2');
	folder2.add(lightRight, 'intensity', 0, 10);
	folder2.add(lightRight.position, 'x', -5, 15);
	folder2.add(lightRight.position, 'y', -5, 15);
    folder2.add(lightRight.position, 'z', -5, 15);
    
    var folder3 = gui.addFolder('light_3');
    folder3.add(lightTop.position, 'x', -5, 15);
	folder3.add(lightTop.position, 'y', -5, 15);
    folder3.add(lightTop.position, 'z', -5, 15);
    
    // make object to add
    var testDrum = getDrum(5);
    testDrum.name = 'testDrum';


    //add everything in
    scene.add(camera);
    scene.add(lightLeft);
    scene.add(lightRight);
    scene.add(lightTop);
    scene.add(testDrum);
    
    //(scene);
    renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.getElementById('webgl').appendChild(renderer.domElement);
    update(renderer, scene, camera, controls, clock, stats);
}
  
function initCamera() {
    var camera = new THREE.PerspectiveCamera(
		45, // field of view
		window.innerWidth / window.innerHeight, // aspect ratio
		1, // near clipping plane
		1000 // far clipping plane
    );

    // move camera's initial position
	camera.position.x = 30;
	camera.position.y = 100;
    camera.position.z = 20;
    return camera
}
  
function initControls() {
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableKeys = false;
    return controls
}
function getPointLight(intensity, color) {
	var light = new THREE.PointLight(color, intensity);
	light.castShadow = true;

	return light;
}

function getSpotLight(intensity, color) {
	color = color === undefined ? 'rgb(255, 255, 255)' : color;
	var light = new THREE.SpotLight(color, intensity);
	light.castShadow = true;
	light.penumbra = 0.5;

	//Set up shadow properties for the light
	light.shadow.mapSize.width = 1024;  // default: 512
	light.shadow.mapSize.height = 1024; // default: 512
	light.shadow.camera.near = 0.1;       // default
	light.shadow.camera.far = 500      // default
	light.shadow.camera.fov = 30      // default
	light.shadow.bias = 0.001;

	return light;
}

function getDrum(size) {
    var geometry = new THREE.CylinderGeometry( size, size, size * 4, 32 );
    var material = new THREE.MeshPhongMaterial( {color: getRandomColor()} );
    var drum = new THREE.Mesh( geometry, material );
    return drum;
}
  
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '0x';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
  
function update(renderer, scene, camera, controls, clock, stats) {
    var testDrum = scene.getObjectByName('testDrum');
    //console.log(clock.getElapsedTime());
    if (Math.floor(clock.getElapsedTime()  % 5) === 0) {
        //console.log("test");
        testDrum.material.color.setHex(getRandomColor());
    }
    // update stats
    stats.update();
    // update controls
    controls.update();
    //animates frames
    renderer.render(scene,camera);
    id = requestAnimationFrame(function() {
      update(renderer, scene, camera, controls, clock, stats);
    });
}
  
var scene = init();