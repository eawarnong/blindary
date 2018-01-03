var worker;
var sampleImageData;
var sampleVideoData;
var outputElement;
var filesElement;
var running = false;
var isWorkerLoaded = false;
var isSupported = (function() {
  return document.querySelector && window.URL && window.Worker;
})();

function isReady() {
  // console.log('isReady ' + running + " " + isWorkerLoaded + " " + sampleImageData + " " + sampleVideoData);
  return !running && isWorkerLoaded && sampleImageData && sampleVideoData;
}
 
function startRunning() {
  // document.querySelector("#image-loader").style.visibility = "visible";
  // outputElement.className = "";
  // filesElement.innerHTML = "";
  running = true;
}
function stopRunning() {
  // document.querySelector("#image-loader").style.visibility = "hidden";
  running = false;
}

function retrieveSampleImage() {
  var oReq = new XMLHttpRequest();
  oReq.open("GET", "input.jpg", true);
  oReq.responseType = "arraybuffer";

  oReq.onload = function (oEvent) {
    var arrayBuffer = oReq.response;
    if (arrayBuffer) {
      sampleImageData = new Uint8Array(arrayBuffer);
      console.log('sampleImageData');
    }
  };

  oReq.send(null);
}

// function retrieveSampleVideo() {
//   var oReq = new XMLHttpRequest();
//   oReq.open("GET", "audio.mp3", true);
//   oReq.responseType = "arraybuffer";

//   oReq.onload = function (oEvent) {
//     var arrayBuffer = oReq.response;
//     if (arrayBuffer) {
//       sampleVideoData = new Uint8Array(arrayBuffer);
//     }
//   };

//   oReq.send(null);
// }

function retrieveAudio(arrayBuffer, time) {
  if(arrayBuffer) {
      // console.log('arraybuffer length ' + arrayBuffer.byteLength);
      sampleVideoData = new Uint8Array(arrayBuffer);
      sampleVideoData.name = "audio.mp3";

      console.log('sampleVideoData ');

      var videoTime = "00:" + time + ".000";

      runCommand("-r 1 -loop 1 -f image2 -i input.jpg -i audio.mp3 -c:v libx264 -c:a aac -strict experimental -b:a 192k -t " + videoTime + " book.flv");

      // console.log('isReady() ' + isReady());

      // initWorker();
      // runCommand("-r 1 -loop 1 -f image2 -i input.jpg -i audio.mp3 -c:v libx264 -c:a aac -strict experimental -b:a 192k -t 00:03:00.000 bigtest.mp4");
  }
}

function parseArguments(text) {
  text = text.replace(/\s+/g, ' ');
  var args = [];
  // Allow double quotes to not split args.
  text.split('"').forEach(function(t, i) {
    t = t.trim();
    if ((i % 2) === 1) {
      args.push(t);
    } else {
      args = args.concat(t.split(" "));
    }
  });
  return args;
}


function runCommand(text) {
  if (isReady()) {
    startRunning();
    var args = parseArguments(text);
    console.log(args);
    worker.postMessage({
      type: "command",
      arguments: args,
      files: [
        {
          "name": "input.jpg",
          "data": sampleImageData
        },
        {
          "name": "audio.mp3",
          "data": sampleVideoData
        }
      ]
    });
    $('#app-progress')[0].style['width'] = '60%';
  }
}


function getDownloadLink(fileData, fileName) {
  // if (fileName.match(/\.jpeg|\.gif|\.jpg|\.png/)) {
  //   var blob = new Blob([fileData]);
  //   var src = window.URL.createObjectURL(blob);
  //   var img = document.createElement('img');

  //   img.src = src;
  //   return img;
  // }
  // else {

    // defineRequest(fileData);

    // var a = document.createElement('a');
    // a.download = fileName;
    var blob = new Blob([fileData]);
    // var src = window.URL.createObjectURL(blob);
    // a.href = src;
    
    uploadVideo(blob);

    // return a;
  // }
}

function initWorker() {

  worker = new Worker("js/videoconverter/worker-asm.js");
  worker.onmessage = function (event) {
    var message = event.data;
    console.log('initWorker worker message type ' + message.type);
    if (message.type == "ready") {
      isWorkerLoaded = true;
      // runCommand("-i input.jpg -vf vflip cat.jpg");
      // runCommand("-r 1 -loop 1 -f image2 -i input.jpg -i audio.mp3 -c:v libx264 -c:a aac -strict experimental -b:a 192k -t 00:03:00.000 bigtest.mp4")
       
      worker.postMessage({
        type: "command",
        arguments: ["-help"]
      });
    } else if (message.type == "stdout") {
      // outputElement.textContent += message.data + "\n";
      // console.log(message.data);
    } else if (message.type == "start") {
      // outputElement.textContent = "Worker has received command\n";
      console.log('Worker has received command');
    } else if (message.type == "done") {
      stopRunning();
      var buffers = message.data;
      if (buffers.length) {
        // outputElement.className = "closed";
        console.log('buffers.length ' + buffers.length);
        console.log('buffers ' + JSON.stringify(buffers));
      }


      buffers.forEach(function(file) {
        // filesElement.appendChild(getDownloadLink(file.data, file.name));
        // document.getElementById("#saveei").appendChild(getDownloadLink(file.data, file.name));
        // $('#savelink').append(getDownloadLink(file.data, file.name));
        getDownloadLink(file.data, file.name);
      });

    }
  };
}

document.addEventListener("DOMContentLoaded", function() {

  retrieveSampleImage();

  initWorker();

});



  


