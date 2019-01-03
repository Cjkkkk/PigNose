// video 初始化
const width = 896;
const height = 450;
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
let landmark = document.getElementById("landmark");
landmark.style.width = width + 'px';
landmark.style.height = height +'px';
// webgl初始化
let scene = new THREE.Scene();
// let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
let camera = new THREE.PerspectiveCamera( 75, width/height, 1, 1000 );
let renderer = new THREE.WebGLRenderer({ alpha: true });
let keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
let fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(308, 100%, 75%)'), 0.75);
let backLight = new THREE.DirectionalLight(0xffffff, 1.0);
camera.position.z = 5;
keyLight.position.set(-100, 0, 100);
fillLight.position.set(100, 0, 100);
backLight.position.set(100, 0, -100).normalize();
// scene.add(keyLight);
scene.add(fillLight);
// scene.add(backLight);
renderer.setSize( width, height );
document.body.appendChild( renderer.domElement );

let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

let geometry = new THREE.BoxGeometry( 1, 1, 1 );
let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
let cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

let loader = new THREE.OBJLoader();
let PigNose;
// load a resource
loader.load(
    // resource URL
    './res/models/PigNose.obj',
    // called when resource is loaded
    function ( object ) {
        PigNose = object;
        PigNose.position.x = 0;
        PigNose.position.y = 0;
        PigNose.position.z = -10;
        // PigNose.rotateX(180);
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
let animate = function () {
    requestAnimationFrame( animate );
    renderer.render(scene, camera);
    controls.update();
};

animate();

// let mtlLoader = new THREE.MTLLoader();
// mtlLoader.setTexturePath('/examples/3d-obj-loader/assets/');
// mtlLoader.setPath('/examples/3d-obj-loader/assets/');
// mtlLoader.load('r2-d2.mtl', function (materials) {
//     materials.preload();
//     let objLoader = new THREE.OBJLoader();
//     objLoader.setMaterials(materials);
//     objLoader.setPath('/examples/3d-obj-loader/assets/');
//     objLoader.load('r2-d2.obj', function (object) {
//         scene.add(object);
//         object.position.y -= 60;
//     });
//
// });
let _fixType = function(type) {
    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
    let r = type.match(/png|jpeg|bmp|gif/)[0];
    return 'image/' + r;
};

let saveFile = function(filename){
    //获取canvas标签里的图片内容
    let type = 'png';
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let context = canvas.getContext("2d");
    context.drawImage(video,0,0,640,480);
    let imgData = canvas.toDataURL(type);
    imgData = imgData.replace(_fixType(type),'image/octet-stream');
    let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = imgData;
    save_link.download = filename;
    // let event = document.createEvent('click');
    // event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    // save_link.dispatchEvent(event); // 强行触发事件
    save_link.click();
};

// 监听事件
let left_head = document.querySelector("#left-head");
let left_ear = document.querySelector("#left-ear");
let right_head = document.querySelector("#right-head");
let right_ear = document.querySelector("#right-ear");
let snap_shot = document.querySelector("#snapshot");
let video=document.getElementById("video");
//下面的代码是保存canvas标签里的图片并且将其按一定的规则重命名

left_head.addEventListener("click", function (e) {
    if(left_ear.style.top === '0vh')
       left_ear.style.top = '10vh';
    else left_ear.style.top = '0vh';
});
right_head.addEventListener("click", function (e) {
    // if(right_ear.style.height === '15vh')
    //     right_ear.style.height = '5vh';
    // else right_ear.style.height = '15vh';
    if(right_ear.style.top === '0vh')
        right_ear.style.top = '10vh';
    else right_ear.style.top = '0vh';
});

snap_shot.addEventListener("click", function (e) {
    let type = 'png';
    let filename = (new Date()).getTime() + '.' + type;
    saveFile(filename);
});

let color_ear = left_ear.getElementsByTagName("img");
let nose_model = right_ear.getElementsByTagName("img");
hsl_array = [
    [187/360, 0.8, 0.58],
    [281/360, 0.8, 0.58],
    [93/360, 0.8, 0.58]
];
Array.prototype.forEach.call(color_ear, (elem, index, array)=>{
    elem.addEventListener("click",function (e) {
        fillLight.color.setHSL(...hsl_array[index]);
        Array.prototype.forEach.call(array, (elem_, index_ )=>{
            if(index_ === index) elem_.setAttribute('class', 'choose');
            else elem_.setAttribute('class', 'no_choose')
        });
    });
});

Array.prototype.forEach.call(nose_model, (elem, index, array)=>{
    elem.addEventListener("click",function (e) {
        Array.prototype.forEach.call(array, (elem_, index_ )=>{
            if(index_ === index) elem_.setAttribute('class', 'choose');
            else elem_.setAttribute('class', 'no_choose')
        });
    });
});
