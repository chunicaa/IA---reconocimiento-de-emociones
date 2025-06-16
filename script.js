 video = document.getElementById('video');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('models'),
  faceapi.nets.faceExpressionNet.loadFromUri('models')
]).then(startVideo);

async function startVideo() {
	await setupCamera(); 
	video.play();
//  navigator.mediaDevices.getUserMedia({ video: {} })
//    .then(stream => video.srcObject = stream)
//    .catch(err => console.error('Error accediendo a la cámara:', err));
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(
      video, new faceapi.TinyFaceDetectorOptions()
    ).withFaceExpressions();

    const resized = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resized);
    faceapi.draw.drawFaceExpressions(canvas, resized);
  }, 100);
});

async function setupCamera() {
    // Find the video element on our HTML page
    //video = document.getElementById('video');
    
    // Request the front-facing camera of the device
    const stream = await navigator.mediaDevices.getUserMedia({
        'audio': false,
        'video': {
  //        facingMode: 'user',
  //        height: {ideal:1920},
  //        width: {ideal: 1920},
        },
      });
    video.srcObject = stream;
    
    // Handle the video stream once it loads.
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}
