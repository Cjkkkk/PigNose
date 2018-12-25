const width = window.innerWidth;
const height = window.innerHeight;
console.log(width, height);
const constraints = {
    audio: false,
    video: {
        'width': width,
        'height': height,
        facingMode: "user" // 优先使用前置摄像头
    }
};
navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream) {
        let stream = mediaStream;
        let mediaStreamTrack = mediaStream.getVideoTracks()[0];
        let imageCapture = new ImageCapture(mediaStreamTrack);
        let video = document.querySelector('video');
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
            video.play();
        };
    })
    .catch(function(err) {
        /* 处理error */
        console.log(err.name + ": " + err.message);
    });


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer({ alpha: true });
var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
camera.position.z = 5;
keyLight.position.set(-100, 0, 100);
fillLight.position.set(100, 0, 100);
backLight.position.set(100, 0, -100).normalize();
scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);
renderer.setSize( width, height );
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

var loader = new THREE.OBJLoader();
var PigNose;
// load a resource
loader.load(
    // resource URL
    './res/models/PigNose.obj',
    // called when resource is loaded
    function ( object ) {
        PigNose = object;
        PigNose.position.x = 1;
        PigNose.position.y = 1;
        PigNose.position.z = -50;
        PigNose.rotateX(180);
        console.log(PigNose.position);
        scene.add( PigNose );
    },
    // called when loading is in progresses
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
        console.log( 'An error happened' );
    }
);
var animate = function () {
    requestAnimationFrame( animate );
    renderer.render(scene, camera);
    controls.update();
};

animate();

// var mtlLoader = new THREE.MTLLoader();
// mtlLoader.setTexturePath('/examples/3d-obj-loader/assets/');
// mtlLoader.setPath('/examples/3d-obj-loader/assets/');
// mtlLoader.load('r2-d2.mtl', function (materials) {
//     materials.preload();
//     var objLoader = new THREE.OBJLoader();
//     objLoader.setMaterials(materials);
//     objLoader.setPath('/examples/3d-obj-loader/assets/');
//     objLoader.load('r2-d2.obj', function (object) {
//         scene.add(object);
//         object.position.y -= 60;
//     });
//
// });