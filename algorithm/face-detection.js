function resizeCanvasAndResults(dimensions, canvas, results) {
    const { width, height } = dimensions instanceof HTMLVideoElement
        ? faceapi.getMediaDimensions(dimensions)
        : dimensions;
    canvas.width = width;
    canvas.height = height;
    // resize detections (and landmarks) in case displayed image is smaller than
    // original size
    return results.map(res => res.forSize(width, height))
}

function vector2d(x, y){
    return {
        vx: x,
        vy: y
    }
}

function vector3d(x, y,z){
    return {
        vx: x,
        vy: y,
        vz: z
    }
}

function drawDetections(dimensions, canvas, detections) {
    const resizedDetections = resizeCanvasAndResults(dimensions, canvas, detections)
    //faceapi.drawDetection(canvas, resizedDetections)
}

function drawLandmarks(dimensions, canvas, results, withBoxes = true) {
    const resizedResults = resizeCanvasAndResults(dimensions, canvas, results);
    const faceLandmarks = resizedResults.map(det => det.landmarks);
    const ratio = 642 / canvas.width;
    const point3d = {
        nosetip : vector3d(0.0, 0.0,0.0),
        chin : vector3d(0.0, -330.0, -65.0),
        lefteye : vector3d(-225.0, 170.0, -135.0),
        righteye : vector3d(225.0, 170.0, -135.0),
        leftmouth : vector3d(-150.0, -150.0, -125.0),
        rightmouth : vector3d(150.0, -150.0, -125.0)
    };

    const point2d = {
        nosetip : vector2d(faceLandmarks[0]._positions[30].x/ratio,faceLandmarks[0]._positions[30].y/ratio),
        chin : vector2d(faceLandmarks[0]._positions[8].x/ratio,faceLandmarks[0]._positions[8].y/ratio),
        lefteye : vector2d(faceLandmarks[0]._positions[36].x/ratio,faceLandmarks[0]._positions[36].y/ratio),
        righteye : vector2d(faceLandmarks[0]._positions[45].x/ratio,faceLandmarks[0]._positions[45].y/ratio),
        leftmouth : vector2d(faceLandmarks[0]._positions[48].x/ratio,faceLandmarks[0]._positions[48].y/ratio),
        rightmouth : vector2d(faceLandmarks[0]._positions[54].x/ratio,faceLandmarks[0]._positions[54].y/ratio)
    };

    const drawLandmarksOptions1 = {
        lineWidth: 2,
        drawLines: true,
        color: 'pink'
    };

    const nose2d = vector2d(face(canvas,point3d,point2d).x,face(canvas,point3d,point2d).y);
    let x_offset_ratio = (2 * point2d.nosetip.vx / 1200) - 1;
    let y_offset_ratio = (2 * point2d.nosetip.vy / 600) - 1;
    let y_offset = y_offset_ratio *
        Math.tan(Math.PI * camera.fov / 360) * (Math.abs(PigNose.position.z - camera.position.z));
    let x_offset = x_offset_ratio *
        Math.tan(Math.PI * camera.fov / 360) * (Math.abs(PigNose.position.z - camera.position.z)) * camera.aspect ;
    PigNose.position.x = x_offset;
    PigNose.position.y = - y_offset + 8;
    // console.log("PigNose", PigNose.position.x, x_offset_ratio, PigNose.position.y, y_offset_ratio);
    // console.log('nose', point2d.nosetip);
    //const leftEyeBbrow = faceLandmarks.getLeftEyeBrow()
    // const rightEyeBrow = faceLandmarks.getRightEyeBrow()
    faceapi.drawLandmarks(canvas, faceLandmarks, drawLandmarksOptions1)
    //var canvas1 = faceapi.resolveInput(canvas);
    //var ctx = faceapi.getContext2dOrThrow(canvas);
    //console.log(ctx)
    //faceapi.drawLines(faceLandmarks[0],faceLandmarks[1])
}



////////////////////////// The 2 Main functions ///////////////////////////////////////////
async function onPlay() {
    const videoEl = document.getElementById('video');
    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 256, scoreThreshold : 0.3 });
    let result = await faceapi.detectSingleFace(videoEl, options).withFaceLandmarks(true); //获取检测结果
    if (result) {
        drawLandmarks(videoEl, document.getElementById('landmark'), [result], true);
    }
}

async function load() {
    //Loading model
    await faceapi.loadTinyFaceDetectorModel('https://hpssjellis.github.io/face-api.js-for-beginners/');
    await faceapi.loadFaceLandmarkTinyModel('https://hpssjellis.github.io/face-api.js-for-beginners/');
}

function face(image,point3d,point2d){
    let rotation_vector = new cv.Mat();
    let translation_vector = new cv.Mat();
    let focal_length = image.width;
    let center = vector2d(image.width/2,image.height/2);
    let camera_matrix = [[focal_length,0,center.x],[0,focal_length,0,],[0,0,1]];
    let dist_coeffs = new cv.Mat.zeros(4,1,0);

    //cv.solvePnP(point3d, point2d, camera_matrix, dist_coeffs, rotation_vector, translation_vector);

    // console.log(translation_vector);
    // console.log(rotation_vector);

    nose_end_point2D = vector2d();
    nose_end_point3D = vector3d(0, 0, 1000);
    //cv.projectPoints(nose_end_point3D, rotation_vector, translation_vector, camera_matrix, dist_coeffs, nose_end_point2D)
    // console.log(nose_end_point2D,nose_end_point3D);
    //cv.imshow('overlay', dst);
    return nose_end_point2D
}

load().then(()=>{
    setInterval(onPlay, 100);
});