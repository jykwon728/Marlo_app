import {mainVideoId, initialize, checkPause} from '../VideoLearnMain.js'

let mainPlayer={};
var nestedPlayers=[];

function onYouTubeIframeAPIReady(loadedLesson){
  console.log('this is lodeaded lesson length: ', loadedLesson ,loadedLesson.length);



    mainPlayer = new YT.Player('mainVideoPlaceholder', {
      width: 800,
      height: 500,
      videoId: mainVideoId,
      // videoId: 'rtg6U6P9vwY',
      playerVars: {
          autoplay: 0,
          color: 'white',
          controls:0,
          rel:0,
          showinfo:0,
          ecver: 2,
          iv_load_policy: 3
      },
      events: {
          onReady: initialize,
          onStateChange: checkPause
      }
    })

    for(var i=0;i<loadedLesson.length;i++){
      const lessonOtherCase = loadedLesson[i].UsageCase.other_case
      console.log('forloop for loadedlesson is working!', lessonOtherCase);
      $('#nestedVideoGroup').append('<div id="videoLessonGroup'+i+'"></div>')

      for(var x=0;x<lessonOtherCase.length;x++){
        let vidId = lessonOtherCase[x].source.vid_id
        let timestamp = lessonOtherCase[x].source.timestamp.start
        console.log('forloop for lessonOtherCase is working!', vidId);
        $('#videoLessonGroup'+i).append('<div id="nested-video-placeholder'+i+x+'" data-vid-order='+nestedPlayers.length+' data-vidId='+vidId+' class="other-case-video video-inactive" ></div>')
//explanation on data-vid-order = nestedPlayers.length is below
//for nestedVideoCall() to know which video ifram variable to control, it needs to know the index of that video within the nestedPlayers array. the nestedPlayer.length provides the array index of that video.
         let video  = new YT.Player('nested-video-placeholder'+i+x, {
          width: 700,
          height: 400,
          videoId: vidId,
          playerVars: {
              autoplay: 0,
              color: 'white',
              controls:0,
              rel:0,
              iv_load_policy: 3
          },
          events:{
            onReady: function(){
              video.seekTo(timestamp)
              video.pauseVideo()
            }
          }

            })
            nestedPlayers.push(video)
            console.log('this is the nestedPlayer! length ',nestedPlayers.length)
      }
      }
}

export {onYouTubeIframeAPIReady, mainPlayer, nestedPlayers}
