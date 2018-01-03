var paragraph;
var video_time;

name = localStorage.getItem('name');
if(name == null || name == '') {
	window.location.href="index.html";
}

volunteer_id = localStorage.getItem('volunteer_id');

var searchParams = new URLSearchParams(window.location.search.split('?')[1]); //?anything=123
var book_Id = searchParams.get("book_id");//anything
var chapter_Id = searchParams.get("chapter_id");
var paragraphOrder = searchParams.get("paragraph_order");
var flag = searchParams.get("flag");

$(document).ready(function() {

    $('#testSound').click(function(){      
        console.log('recordSound.html?paragraph_order=' + paragraphOrder);
        window.location = 'recordSound.html?book_id=' + book_Id + '&chapter_id=' + chapter_Id + '&paragraph_order=' + paragraphOrder + '&flag=' + flag;
    });
 
	$('#btn_record').on('click', function() {
		toggleRecording(this);    
	});

    $('#btn_play').on('click', function() {
        $('#audioLayerControl')[0].play();
    });

    $('#btn_pause').on('click', function() {
        $('#audioLayerControl')[0].pause();
    });

    $('#btn_stop').on('click', function() {
        $('#audioLayerControl')[0].stop();
    });

});

function addVideoToPlaylist(video_link) {

    if(flag == 1) {
        // never have this paragraph before
        value = JSON.stringify({
            volunteer_id : volunteer_id,
            book_id : book_Id,
            chapter_id : chapter_Id
        });

        console.log('add video to playlist');

        $.ajax({
            url : "php/functions.php?function=getPlaylist&param=" + value,
            success : function(playlist_link){

                playlist_link = JSON.parse(playlist_link);
                console.log(playlist_link);

                buildApiRequest('POST',
                                '/youtube/v3/playlistItems',
                                {'part': 'snippet',
                                 'onBehalfOfContentOwner': ''},
                                {'snippet.playlistId': playlist_link,
                                 'snippet.resourceId.kind': 'youtube#video',
                                 'snippet.resourceId.videoId': video_link,
                                 'snippet.position': ''
                });
                
            }

        });
    } 

    insertParagraph(video_link);
}

function insertParagraph(video_link) {
    paragraph = JSON.stringify({
        volunteer_id : volunteer_id,
        book_id : book_Id,
        chapter_id : chapter_Id,
        paragraph_order : paragraphOrder,
        video_link : video_link,
        video_time : video_time
    }); 

    $('#app-progress')[0].style['width'] = '0%';
    $('.progress').addClass('hidden');

    $.ajax({
        url : 'php/functions.php?function=insertParagraph&param=' + paragraph,
        success : function(info){
            console.log(info);
            alert("อัพโหลดสำเร็จ");
            window.location = 'createSound.html?book_id=' + book_Id + '&chapter_id=' + chapter_Id;
        }
    });
}

function setVideoTime(time) {
	this.video_time = time;
}

/////////////////////////////////////////////////////////


window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();
var audioInput = null,
    realAudioInput = null,
    inputPoint = null,
    audioRecorder = null;
var rafID = null;
var analyserContext = null;
var canvasWidth, canvasHeight;
var recIndex = 0;

/* TODO:

- offer mono option
- "Monitor input" switch
*/

function saveAudio() {
    audioRecorder.exportWAV( doneEncoding );
    // could get mono instead by saying
    // audioRecorder.exportMonoWAV( doneEncoding );
}

function gotBuffers( buffers ) {

    activeLayer(buffers);

    //----------original code----------------
    // var canvas = document.getElementById( "wavedisplay" );

    // drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );
    //---------------------------------------

}

function doneEncoding( blob ) {
    Recorder.setupDownload( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );
    recIndex++;
}

function toggleRecording( e ) {
    if (e.classList.contains("recording")) {
        // stop recording
        audioRecorder.stop();
        e.classList.remove("recording");
        audioRecorder.getBuffers( gotBuffers );

        $('.progress').removeClass('hidden');
        // $('#app-progress')[0].style['width'] = '50%';

    } else {
        // start recording
        if (!audioRecorder)
            return;
        e.classList.add("recording");
        audioRecorder.clear();
        audioRecorder.record();
    }

    timeRecord(e.classList.contains("recording"));
    toggleColor();
}

function toggleColor() {

    $('#btn_record.recording').animate({
        backgroundColor: '#ff5808'
    }, 1000).animate({
        backgroundColor: '#ff9a08'
    }, 1000, toggleColor);

}

function timeRecord(recording) {

    var limitTime = 3 * 60 * 1000;

    if(recording) {
        console.log('start record');
        recordTime = 0;
        start();
    } else {
        console.log('stop record');
        stop();
    }

    function start() {
        recordTime += 1000;
        checkTime(recordTime);
        
        timer = setTimeout(start, 1000);
    }

    function stop() {
        if(timer) {
            clearTimeout(timer);
            timer = 0;
        }
    }

    function checkTime(recordTime) {
        var time = convertMilliToTime(recordTime)

        if(recordTime >= limitTime) {
            console.log('overlimit');
            time += ' เกินเวลาแล้วจ้าาาาาาาาาาาาาาาาาาาา';

            // console.log('over limit');
            if(recordTime / 1000 % 2 == 0) {
                $('#txt').css('color', 'red');
                $('#txt_record').css('color', 'red');
            } else {    
                $('#txt').css('color', '#000');
                $('#txt_record').css('color', '#000');
            }
        } 

        $('#txt_record').html(time);
    }

}

function convertMilliToTime(milli) {
    var m =  parseInt(milli / 1000 / 60);
    var s =  milli / 1000 % 60;

    var time = (m >= 10 ? m : '0' + m) + ':' + (s >= 10 ? s : '0' + s);
    return time;
}


function convertToMono( input ) {
    var splitter = audioContext.createChannelSplitter(2);
    var merger = audioContext.createChannelMerger(2);

    input.connect( splitter );
    splitter.connect( merger, 0, 0 );
    splitter.connect( merger, 0, 1 );
    return merger;
}

function cancelAnalyserUpdates() {
    window.cancelAnimationFrame( rafID );
    rafID = null;
}

function updateAnalysers(time) {
    if (!analyserContext) {
        var canvas = document.getElementById("analyser");
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        analyserContext = canvas.getContext('2d');
    }

    // analyzer draw code here
    {
        var SPACING = 3;
        var BAR_WIDTH = 1;
        var numBars = Math.round(canvasWidth / SPACING);
        var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

        analyserNode.getByteFrequencyData(freqByteData); 

        analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
        analyserContext.fillStyle = '#F6D565';
        analyserContext.lineCap = 'round';
        var multiplier = analyserNode.frequencyBinCount / numBars;

        // Draw rectangle for each frequency bin.
        for (var i = 0; i < numBars; ++i) {
            var magnitude = 0;
            var offset = Math.floor( i * multiplier );
            // gotta sum/average the block, or we miss narrow-bandwidth spikes
            for (var j = 0; j< multiplier; j++)
                magnitude += freqByteData[offset + j];
            magnitude = magnitude / multiplier;
            var magnitude2 = freqByteData[i * multiplier];
            analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
            analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
        }
    }
    
    rafID = window.requestAnimationFrame( updateAnalysers );
}

function toggleMono() {
    if (audioInput != realAudioInput) {
        audioInput.disconnect();
        realAudioInput.disconnect();
        audioInput = realAudioInput;
    } else {
        realAudioInput.disconnect();
        audioInput = convertToMono( realAudioInput );
    }

    audioInput.connect(inputPoint);
}

function gotStream(stream) {
    inputPoint = audioContext.createGain();

    // Create an AudioNode from the stream.
    realAudioInput = audioContext.createMediaStreamSource(stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);

//    audioInput = convertToMono( input );

    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    inputPoint.connect( analyserNode );

    audioRecorder = new Recorder( inputPoint );

    zeroGain = audioContext.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect( zeroGain );
    zeroGain.connect( audioContext.destination );
    updateAnalysers();
}

function initAudio() {
        if (!navigator.getUserMedia)
            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!navigator.cancelAnimationFrame)
            navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
        if (!navigator.requestAnimationFrame)
            navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, function(e) {
            alert('Error getting audio');
            console.log(e);
        });
}

window.addEventListener('load', initAudio );
var timer = 0;
var recordTime = 0;