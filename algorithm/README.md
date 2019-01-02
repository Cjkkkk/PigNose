用法：直接用chrome打开index.html，点击run()，然后选择“允许使用摄像头”，即可观看效果了！



函数功能说明：

1：async function run()

```javascript
async function run() {
   //Loading model
   await faceapi.loadTinyFaceDetectorModel('https://hpssjellis.github.io/face-api.js-for-beginners/');
   await faceapi.loadFaceLandmarkTinyModel('https://hpssjellis.github.io/face-api.js-for-beginners/');
   const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
   const videoEl = document.getElementById('inputVideo');

   videoEl.srcObject = stream
   
}
```

载入模型库：利用一个异步函数，当用户点击run()之后，会进行这个模块，在这个模块之中，会载入头部姿态的模型库TinyFaceDetectorModel和FaceLandmarkTinyMode。然后读取摄像头，把摄像头中的数据存到videoEl之中！

2：async function onPlay()

```javascript
async function onPlay() {
   const videoEl = document.getElementById('inputVideo');
   const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold : 0.3 });
   result = await faceapi.detectSingleFace(videoEl, options).withFaceLandmarks(true);

   if (result) {
       drawLandmarks(videoEl, document.getElementById('overlay'), [result], true);
       
      // Just printing the first of 68 face landmark x and y 
      document.getElementById('myDiv01').innerHTML = 'First of 68 face landmarks, x: '+ 
        Math.round(result._unshiftedLandmarks._positions[0]._x) + ', y: '+ 
        Math.round(result._unshiftedLandmarks._positions[0]._y) +'<br>'
        //console.log(thisx,thisy,dist)
   }

    setTimeout(() => onPlay())
}
```

开始处理得到的图像：利用一个主要的函数faceapi.detectSingleFace就可以得到关于这个图像的所有的特征点，但是这个特征点是unshifted，就是说这个坐标还没有平移图片中人脸所在的位置。然后通过调用drawLandmarks这个函数把图片进行平移并且把特征点显示出来。setTimeout(() => onPlay())就是说执行完 onPlay()之后再执行onPlay()这个函数。

3：function drawLandmarks(dimensions, canvas, results, withBoxes = true)

```javascript
function drawLandmarks(dimensions, canvas, results, withBoxes = true) {
  //console.log(canvas)
  const resizedResults = resizeCanvasAndResults(dimensions, canvas, results)
  if (withBoxes) {
      faceapi.drawDetection(canvas, resizedResults.map(det => det.detection))
  }
  const faceLandmarks = resizedResults.map(det => det.landmarks);

  var point3d = {
  }

  var point2d = {
  };

 
  const drawLandmarksOptions1 = { 
    lineWidth: 2, 
    drawLines: true, 
    color: 'pink' 
  };

  nose2d = vector2d(face(canvas,point3d,point2d).x,face(canvas,point3d,point2d).y);
  faceapi.drawLandmarks(canvas, faceLandmarks, drawLandmarksOptions1)
}    
```

利用drawLandmarks这个函数把图片进行平移并且把特征点显示出来，resizedResults确定一下画布的大小并且找到人脸在照片中的shifted的位置，然后根据resizedResults.map重新匹配到特征点新的位置。从68个特征点中去对应的6个特征点，分别是nosetip，chin，lefteye，righteye，leftmouth，rightmouth，其中3D模型（即世界坐标系）是提前已经固定好了的。然后2D的位置是提取出来的。drawLandmarksOptions1是用来设定一下画图的参数。

4：function face(image,point3d,point2d)

```javascript
function face(image,point3d,point2d){
     let rotation_vector = new cv.Mat();
     let translation_vector = new cv.Mat();
     let focal_length = image.width;
     let center = vector2d(image.width/2,image.height/2);
     let camera_matrix = [[focal_length,0,center.x],[0,focal_length,0,],[0,0,1]];
     let dist_coeffs = new cv.Mat.zeros(4,1,0);

     //cv.solvePnP(point3d, point2d, camera_matrix, dist_coeffs, rotation_vector, translation_vector);
     
     console.log(translation_vector);
     console.log(rotation_vector);

     nose_end_point2D = vector2d();
     nose_end_point3D = vector3d(0, 0, 1000);

     //cv.projectPoints(nose_end_point3D, rotation_vector, translation_vector, camera_matrix, dist_coeffs, nose_end_point2D)

     console.log(nose_end_point2D,nose_end_point3D);

     //cv.imshow('overlay', dst);
     return nose_end_point2D
}
```

利用face这个函数进行寻找面部的垂直向量，先设定好solvePnP函数所需要的一些参数rotation_vector啥的，然后根据opencv.js中的solvePnP算出三维中各个特征点对应的位置（但是由于opencv.js之中没有solvePnP这个函数，所以移植有点失败）然后再根据projectPoints这个函数把三维nose的坐标延长，即可得到面部的特征向量。