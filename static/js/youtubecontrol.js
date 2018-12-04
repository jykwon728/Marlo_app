
var url = window.location.toString()
url = new URL(url)
//var id = url.searchParams.get('v')
// var id = 'LwkZQR9zZO8'
var id = 'WyrQWgIhByg'
console.log(id)

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        width: 800,
        height: 500,
        videoId: id,
        playerVars: {
            autoplay: 0,
            color: 'white',
            controls:0,
            rel:0,
            iv_load_policy: 3,


        },
        events: {
            onReady: initialize,
            onStateChange: checkPause
        }
    });
}

function checkPause(e){
    if (e.data == 2){
        console.log(e.data)
        modalPop()
    }
    else if (e.data==1){
        modalHide()
        lessonCardHide()

    }
}

function initialize(){
gettingdata()
repeatShowScript()

}


//json file loaded for script
var loadedScript=[];
var loadedLesson=[];
function gettingdata(){
  //var location ='http://192.168.1.104:5000/captions/' + id;
  //'LwkZQR9zZO8.json'// //later change this into a function so autmatically pick right url
  // var location = '../../LwkZQR9zZO8.json';
var location = '../../newjson.json'
$.ajax({
    type: "GET",
    url: location,
    crossDomain: true,

    datatype: "json",
    success: function(script){
      loadedScript=script.caption
      loadedLesson=script.lesson_content
      console.log(loadedScript);
      console.log(loadedLesson);
    }
  });
}

var currentIndex = 0;
//input the correct object in the subtitle box
//this makes a loop through all the objects
 function findindex(){
    currentIndex = loadedScript.length - 1;
  for(i=0; i<loadedScript.length; i++) {
    if (loadedScript[i].END_AT > player.getCurrentTime()){
        currentIndex = i;
        break;
    }
  }//failsafe for when the last object in the script is reached
}



//this is the function that inputs the correct script and lesson into the corresponding div boxes
function showScriptNow(){
    findindex()
  var scriptNow = loadedScript[currentIndex];
    var sentenceNow = scriptNow["SENTENCE"]

  $("#subtitleboxEng").text(scriptNow["TRANSLATION"]);
  $("#subtitleboxKor").text(sentenceNow);

 var scriptPrev = loadedScript[currentIndex-1]; //error appears in the console till the first line passes
 var sentencePrev = scriptPrev["SENTENCE"]
 //change to sentencePrev if want to use the weird way
return sentenceNow;
}


//repeats Showscript function every 0.5 seconds
function repeatShowScript(){
  setInterval(function () {showScriptNow()
  },500)
}


function sentencePop(){

var nowindex = currentIndex
//var previndex = currentIndex-1
var scriptNow = loadedScript[currentIndex];
//var scriptNow = loadedScript[findindex()-1];
var currentwords = scriptNow.WORDS;
for(var i=0; i<currentwords.length; i++){
  console.log('sentPop is working for each words: ', currentwords)
  $("#realmainsentContainer").append("<div id=realmainsent class=real-mainsent></div>")
  $("#realmainsent").append("<button id=breakWord"+i+" number="+i+" class=realmain-words></button>");
  $("#breakWord"+i).html(currentwords[i].WORD);

}
  $(".realmain-words").on('click', function(){
    const number = $(this).attr('number');
    const scriptNow = loadedScript[nowindex];
    const currentwords = scriptNow.WORDS;

  $('#sentenceBreakdown').html(""); //this takes away the existing word breakdown box
  //$('#sentenceBreakdown').append("<div id=wordbreakdown"+number+"></div>");

  $('#sentenceBreakdown').append("<div id=wordbreakdownWord"+number+" class=wordbreakdown-Word></div>");
  $("#wordbreakdownWord"+number+"").text(currentwords[number].WORD);

  $('#sentenceBreakdown').append("<div id=wordbreakdownBaseWord"+number+" class=wordbreakdown-BaseWord></div>");
  $("#wordbreakdownWord"+number+"").text(currentwords[number].baseword);

  $('#sentenceBreakdown').append("<div id=wordbreakdownTrans"+number+" class=wordbreakdown-Trans></div>");
  $("#wordbreakdownTrans"+number+"").text(currentwords[number].TRANSLATION);

  $('#sentenceBreakdown').append("<div id=wordbreakdownPronun"+number+" class=wordbreakdown-Pronun></div>");
  $("#wordbreakdownPronun"+number+"").text(currentwords[number].PRONOUNCIATION);

  $('#sentenceBreakdown').append("<div id=wordbreakdownWordType"+number+" class=wordbreakdown-WordType></div>");
  $("#wordbreakdownWordType"+number+"").text(currentwords[number].WORD_TYPE);


  $("#showTag").on('click', function(){
    //show css for tag data
})

  });

};

//this is a function that controls the sequence of the learning experience

function learnSequence(){
console.log('learn sequence is working')

player.seekTo(loadedScript[currentIndex-1].END_AT)// for some reason, currentIndes sends the video to next index
player.playVideo()


setTimeout(function() { player.pauseVideo() }, getTimeGap())

}


function getTimeGap(){
    var timeOfNow = loadedScript[currentIndex-1].END_AT;
    var timeOfNext = loadedScript[currentIndex].END_AT;
    var timeGap = timeOfNext - timeOfNow;
    console.log('The time gap is', timeGap);
    return timeGap * 1000;
}
// function sentencePause(){




//player.playVideo()


function play(){
    player.playVideo()
}
function pause(){
    player.pauseVideo()
}
//keyboard control *change this to a toggle between play/pause
// $(document).toggle(function(event){
//  if(event.which == 32){
//   event.preventDefault()
//    player.playVideo()
//    player.pauseVideo();
//    }
//  });


//button controls
$('#play').on('click', function () {
    player.playVideo();
    $("#realmainsent").html(""); //이 객체를 #lessonbox로 설정했을때 api하고 충돌 같은 오류가 일어남! 왜이지?
    $("#sentenceBreakdown").html("");
});

$('#pause').on('click', function(){
    player.pauseVideo();
});

// $(document).toggle(function(event){
//     if(event.which == 32){
//         player.playVideo();
//         player.pauseVideo();
//     }
// })

//FUNCTION that gives the next sent to scriptNow


//var nextscript  = loadedScript.indexOf(showScriptNow())+1

$(document).keydown(function(event){
 if(event.which == 39){
   player.seekTo(loadedScript[currentIndex+1].END_AT)
$("#sentenceToLearn").text(loadedScript[currentIndex].SENTENCE)
}
});

$('#skip').on('click', function () {
    player.seekTo(loadedScript[currentIndex+1].END_AT);
});


$('#back').on('click', function () {
    player.seekTo(loadedScript[currentIndex-2].END_AT);
});
$(document).keydown(function(event){
 if(event.which == 37){
   player.seekTo(loadedScript[currentIndex-2].END_AT)}
 });

 //modal control box script
 $("#pause").on('click', function(){
     console.log(loadedScript[currentIndex].SENTENCE)
     $("#sentenceToLearn").text(loadedScript[currentIndex].SENTENCE)
 })

function modalPop(){
    console.log('modalpop works')
    var modal = $(".custom-modal")
    console.log(modal)
    modal[0].style.display = 'block' //why need [0]??
}
function modalHide(){
    var modal= $(".custom-modal")
    modal[0].style.display='none'
}
//function that displays the mainSent boxes
function lessonBoxPop(){
  let lessonbox = $("#lessonBox")
  lessonbox[0].style.display = 'block'
}
function lessonBoxHide(){
  let lessonbox = $("#lessonBox")
  lessonbox[0].style.display = 'none'
}
//lesson card funcitonality
//make lesson card icon& button appear when script.lesson_content exists

function lessonCardPop(){
  let lessonContainer = $("#lessonCard")
  lessonContainer[0].style.display = 'block'
}
function lessonCardHide(){
  let lessonContainer = $("#lessonCard")
  lessonContainer[0].style.display = 'none'
}

//load all necessary lesson card components
$("#lessonCardButton").on('click',function(){
lessonBoxHide()
lessonCardPop()
console.log('lessCardButton is working');
// $('#lessonContent').html("");
console.log(loadedLesson[0].TITLE);
$('#cardTitle').text(loadedLesson[0].TITLE)
$('#cardDescription').text(loadedLesson[0].Description)
$('#cardEquation').text('here is how to use '+loadedLesson[0].UsageCase.main_case.lesson_element+'</br>'+loadedLesson[0].Equation)
$('#cardStructure').append('<div id="leftSideElement" class="left-side-element"></div>')
$('#cardStructure').append('<div id="mainElement" class="main-element" ></div>')
$('#cardStructure').append('<div id="rightSideElement" class="right-side-element"></div>')
$('#mainElement').text(loadedLesson[0].UsageCase.main_case.lesson_element)
$('#leftSideElement').text(loadedLesson[0].UsageCase.main_case.peripheral_element.left_side_element)
$('#rightSideElement').text(loadedLesson[0].UsageCase.main_case.peripheral_element.right_side_element)

})

var currentNumber;
//function that adds one till three
function addOne(n){
  if(n===3){
      return
    }else if(n===1 || n===2){
      console.log('currenNum is now...: ', n)
      return n+1
    }else{
      return
    }
}

//controls happening inside the lesson card
$("#cardButtonNext").on('click', function(){
  let currentActive = $(".card-body div.active");
  let dataOrder = parseInt($(currentActive).attr("data-order"));
  let nextOrder = addOne(dataOrder);
  console.log('nextOrder: ', nextOrder);
  $(currentActive).removeClass('active');
  var nextActive =  $(".card-body div[data-order='"+nextOrder+"']");
  $(nextActive).addClass('active');
  console.log(nextActive);
  $(nextActive).style.display = 'block';
  console.log('new order : ', parseInt($(currentActive).attr("data-order")));
})
