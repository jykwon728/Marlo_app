import {gettingScript} from './videoLesson/loadScript.js'
import {onYouTubeIframeAPIReady as loadVideo, mainPlayer as player, nestedPlayers } from './videoLesson/youtubeAPI.js'

//Miseng- woori
// var mainVideoId = 'LwkZQR9zZO8'
var mainVideoId = '5Lyg0RwRZto'
// var scriptLocation = '../../newjson.json'
var scriptLocation = '../../LwkZQR9zZO8.json'

var loadedScript=[];
var loadedLesson=[];

gettingScript(scriptLocation)
  .then(function(result){
    console.log('here is the scriptloaded ', result);
    loadedScript = result.caption
    loadedLesson = result.lesson_content
    loadLessonCard(result)
    return loadedLesson
  })
  .then(function(result){
    loadVideo(result)})




//loading video to placeholder


// console.log('this is player ',player);

$('#learnButton').on('click', function(){

console.log('learnButton works')
$("#realmainsentContainer").children().remove()
$("#sentenceBreakdown").children().remove()
sentencePop();
lessonBoxPop()
learnSequence();
modalHide();

});

function initialize(){
repeatShowScript()
}


function checkPause(e){
    if (e.data == 2){
        console.log(e.data)
        modalPop()
        SentenceToLearnPause()
    }
    else if (e.data==1){
        modalHide()
        lessonCardHide()
        nestedVideoHide()
    }
}


//json file loaded for script






var currentIndex = 0;
//input the correct object in the subtitle box
//this makes a loop through all the objects
function findindex(){
    currentIndex = loadedScript.length - 1;
  for(var i=0; i<loadedScript.length; i++) {
    if (loadedScript[i].END_AT > player.getCurrentTime()){
        currentIndex = i;
        break;
    }
  }//failsafe for when the last object in the script is reached
}

//this function finds lesson content and show the lessonButton. change this to switch to lessonStop
function checkForLesson(){
  let lessonButton = $("#lessonCardButton")
  let lessonSentIndex = loadedLesson[0].SentenceIDX;
  if(currentIndex === lessonSentIndex){
    // player.pauseVideo()
  lessonButton.fadeIn("slow")
}else{
  lessonButton.fadeOut("slow")
}
}

//this is the function that inputs the correct script and lesson into the corresponding div boxes
function showScriptNow(){
  checkForLesson()
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

// var nowindex = currentIndex
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
    const scriptNow = loadedScript[currentIndex];
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
  $("#wordbreakdownPronun"+number+"").text('[  '+currentwords[number].PRONOUNCIATION+'  ]');

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

function SentenceToLearnPause(){
     $("#sentenceToLearn").text(loadedScript[currentIndex].SENTENCE)
 }

function modalPop(){
    console.log('modalpop works')
    var modal = $(".custom-modal")
    console.log(modal)
    modal[0].style.display = 'block' //why need [0]??
    let subtitleKor = $("#subtitleboxKor")
    let subtitleEng = $("#subtitleboxEng")
    subtitleKor.hide()
    subtitleEng.hide()

}
function modalHide(){
    var modal= $(".custom-modal")
    let subtitleKor = $("#subtitleboxKor")
    let subtitleEng = $("#subtitleboxEng")
    modal[0].style.display='none'
    subtitleKor.show()
    subtitleEng.show()
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

  let currentActive = $(".card-body div.active");
  let firstOrder =  $(".card-body div[data-order='1']");

    $(currentActive).removeClass('active');
    $(currentActive).addClass('inactive');
    $(firstOrder).removeClass('inactive');
    $(firstOrder).addClass('active');
}

//load all necessary lesson card components
$("#lessonCardButton").on('click',function(){
player.pauseVideo();
lessonBoxHide()
lessonCardPop()
console.log('lessonCardButton is working');
// $('#lessonContent').html("");



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
  let nextActive =  $(".card-body div[data-order='"+nextOrder+"']");

  if(dataOrder===2){
    $(currentActive).removeClass('active');
    $(currentActive).addClass('inactive');
    $('#cardButtonNext').hide();
    $(nextActive).removeClass('inactive');
    $(nextActive).addClass('active');

  }else{

    $(currentActive).removeClass('active');
    $(currentActive).addClass('inactive');
    $(nextActive).removeClass('inactive');
    $(nextActive).addClass('active');
    $('#cardButtonNext').show();

  }

  //add to disapear next button when reach 3;
})

function loadLessonCard(){
            for(var i=0; i<loadedLesson.length; i++){
              $('#cardBody').append('<div id="cardContent'+i+'" class="card-content"></div>')
              $('#cardContent'+i).append('<div id="cardTitle'+i+'" class="lesson-title card-title"></div>')
                                .append('<div id="cardDescription'+i+'" data-order=1 class="lesson-card-content active lesson-description card-text" style="margin: 20px;"></div>')
                                .append('<div id="cardEquation'+i+'" data-order=2 class="lesson-card-content inactive lesson-equation text-center"></div>')
                                .append('<div id="cardCase'+i+'" data-order=3 class="lesson-card-content inactive lesson-card-case text-center"></div>')

              $('#cardCase'+i).append('<div id="cardCaseSentence'+i+'" class="card-case-sentence"></div>')






              $('#cardTitle'+i).text(loadedLesson[i].TITLE)
              $('#cardDescription'+i).text(loadedLesson[i].Description)
              // $('#cardEquation'+i).text('here is how to use '+loadedLesson[i].UsageCase.main_case.lesson_element)

          //append main element div, side elements left and rigt
            $('#cardEquation'+i)
                      .append('<div id="equationElementLeft'+i+'" class="equation-left" style="display:none; font-size: 1.3em; box-sizing: border-box; border: 3.7px solid green; padding: 10px; margin: 5px; line-height: 27px; vertical-align: middle; "></div>')
                      .append('<div id="equationElementMain'+i+'" class="equation-main" style="display:inline-block; font-size: 1.3em; box-sizing: border-box; border-bottom: 3.7px solid #333; border-left: 3.7px solid #333; border-top: 3.7px solid #333; padding: 10px; margin: 5px; line-height: 27px; vertical-align: middle; "></div>')
                      .append('<div id="equationElementRight'+i+'" data-order="'+i+'" class="equation-right" style="display:inline-block; font-size: 1.3em; box-sizing: border-box; border-bottom: 3.7px solid green; border-right: 3.7px solid green; border-top: 3.7px solid green; padding: 10px; margin: 5px; line-height: 27px; vertical-align: middle; " ></div>')

                      //the equationCase sets will later replace with animation with equationElements when cliced
          //             .append('<div id="equationCaseLeft'+i+'" class="equation-left" style="display:none; font-size: 1.3em; box-sizing: border-box; border: 3.7px solid green; padding: 10px; margin: 5px; line-height: 27px; vertical-align: middle; "></div>')
          //             .append('<div id="equationCaseMain'+i+'" class="equation-main" style="display:none; font-size: 1.3em; box-sizing: border-box; border: 3.7px solid #333; padding: 10px; margin: 5px; line-height: 27px; vertical-align: middle; "></div>')
          // //testing only this for now
          //             .append('<div id="equationCaseRight'+i+'" data-order="'+i+'" class="equation-right" style="display:inline-block; font-size: 1.3em; box-sizing: border-box; border-bottom: 3.7px solid green; border-right: 3.7px solid green; border-top: 3.7px solid green; padding: 10px; margin: 5px; line-height: 27px; vertical-align: middle; " ></div>')
          //forloop 으로 usagecase 1개 othercase N개
                      .append('<div id="actualSentence'+i+'" class="actual-sentence" data-equation-order=2 style="display:none; margin: 50px; font-size: 1.3em; font-weight: bold"></div>')
                      const otherCaseArray = loadedLesson[i].UsageCase.other_case
                      for(let a=0; a<otherCaseArray.length; a++){
                        let caseSentenceOrder = a + 3;
                        let otherCaseVidId = otherCaseArray[a].source.vid_id;
                        var imgurl = "https://img.youtube.com/vi/"+otherCaseVidId+"/sddefault.jpg"

                        console.log('this is otherCaseArray!: ',otherCaseArray);
                        $('#cardEquation'+i).append('<div id="actualCaseSentence'+i+a+'" class="actual-sentence" data-equation-order='+caseSentenceOrder+' style="display:none; margin: 50px; font-size: 1.3em; font-weight: bold"></div>')
                                            .append('<img id="caseVidImage'+i+a+'" data-equation-order='+caseSentenceOrder+' vidId="'+otherCaseVidId+'" class="case-vid-image" src="'+imgurl+'"  height="170" width="250" style="display:none;"></img>')
                        $('#caseVidImage'+i+a).on('click', nestedVideoCall)
                        $('#actualCaseSentence'+i+a).text('"'+otherCaseArray[a].translation+'"')
                      }


          //equationElements
              $('#equationElementMain'+i)
                        .append('<div id="equationMainKor'+i+'" class="equation-main-kor" style="display: block; font-weight: 900; border-bottom: 1.5px solid #333; padding-left: 20px; padding-right: 20px;"></div>')
                        .append('<div id="equationMainPron'+i+'" class="equation-main-pron" style="display: block; padding-left: 20px; padding-right: 20px;"></div>')

              $('#equationElementLeft'+i)
                        .append('<div id="equationLeftType'+i+'" class="equation-right-type"></div>')
                        .append('<div id="equationLeftKor'+i+'" class="equation-left-kor" style="display: none;"></div>')
                        .append('<div id="equationLeftPron'+i+'" class="equation-left-pron" style=""></div>')

              $('#equationElementRight'+i)
                        .append('<div id="equationRightType'+i+'" data-equation-order=1 class="equation-right-type" style="color:green; font-weight:bold;"></div>')
                        .append('<div id="equationRightKor'+i+'" data-equation-order=2 class="equation-right-kor" style="display: none; border-bottom: 1.5px solid green; padding-left: 20px; padding-right: 20px;"></div>')
                        .append('<div id="equationRightPron'+i+'" data-equation-order=2 class="equation-right-pron" style="display: none;"></div>')
                        .click(switchEquationElement)


                        let caseCounter =2
                        for(let x=0;x<otherCaseArray.length;x++){
                          caseCounter++
                          $('#equationElementRight'+i).append('<div id="equationCaseRightKor'+i+x+'" data-equation-order='+caseCounter+' style="display: none; border-bottom: 1.5px solid green; padding-left: 20px; padding-right: 20px;"></div>')
                                                      .append('<div id="equationCaseRightPron'+i+x+'" data-equation-order='+caseCounter+' style="display: none;"></div>')
                          $('#equationCaseRightKor'+i+x).text(loadedLesson[i].UsageCase.other_case[x].peripheral_element.right_side_element)
                          $('#equationCaseRightPron'+i+x).text(loadedLesson[i].UsageCase.other_case[x].peripheral_element.right_side_element_pron)
                        }

          //these are the equation-other cases
              // $('#equationCaseRight')
              //           .append('<div')


          //put the main element, wordType data into equationElements
              $('#equationMainKor'+i).text(loadedLesson[i].Equation.main_element)
              $('#equationMainPron'+i).text(loadedLesson[i].Equation.main_element_pron)

              $('#equationLeftType'+i).text(loadedLesson[i].Equation.left_element)
              $('#equationLeftKor'+i).text(loadedLesson[i].Equation.left_element)
              $('#equationLeftPron'+i).text(loadedLesson[i].Equation.left_element_pron)

              $('#equationRightType'+i).text(loadedLesson[i].Equation.right_element)
              $('#equationRightKor'+i).text(loadedLesson[i].UsageCase.main_case.peripheral_element.right_side_element)
              $('#equationRightPron'+i).text(loadedLesson[i].UsageCase.main_case.peripheral_element.right_side_element_pron)

              $('#actualSentence'+i).text('"'+loadedLesson[i].UsageCase.main_case.translation+'"')

          let nextEquationOrder = 2
          function switchEquationElement(){
              const order = $(this).attr("data-order")

              console.log('switchEquationElement is working! ', nextEquationOrder);
              if(nextEquationOrder >= numOtherCase.length + 3){
                nextEquationOrder = 1

                $('[data-equation-order]').hide("fast")
                $('[data-equation-order='+nextEquationOrder+']').show("fast")
                nextEquationOrder++;
              }else{
                $('[data-equation-order]').hide("fast")
                $('[data-equation-order='+nextEquationOrder+']').show("fast")
                nextEquationOrder++;
              }

                actualSent.show("slow")
          }

              var numOtherCase = loadedLesson[i].UsageCase.other_case
              for(var x=0; x<numOtherCase.length; x++){
                console.log('loop for numOtherCase is working really: ', numOtherCase);
                let otherCaseVidId = numOtherCase[x].source.vid_id;

                $('#cardCase'+i).append('<div id="cardCaseContentWrapper'+i+x+'" class="card-case-content-wrapper case-content-inactive" style="display: none" data-index="'+i+x+'"></div>')
                  $('#cardCaseContentWrapper'+i+x).append('<div id="cardCaseStructure'+i+x+'" class="card-case-structure"></div>')
                                                .append('<div id="cardCaseTranslation'+i+x+'" class="card-case-translation"></div>')
                                                .append('<div id="cardCaseVidImage'+i+x+'" class="card-case-vid-image"></div>')
                $('#cardCaseSentence'+i).append('<div id="caseSentence'+i+x+'" class="case-sentence" data-index="'+i+x+'"  data-vidId="'+otherCaseVidId+'"></div>')
                  $('#caseSentence'+i+x).text(numOtherCase[x].sentence).click(activateCase)

                $('#cardCaseStructure'+i+x).append('<div id="caseStructure'+i+x+'" class="case-structure"></div>')
                  $('#caseStructure'+i+x).append('<div id="peripheralElement'+i+x+'" class="peripheral-element"></div>')
                    $('#peripheralElement'+i+x).append('<div id="peripheralElementMain'+i+x+'" class="peripheral-element-main"></div>')
                                                .append('<div id="peripheralElementLeft'+i+x+'" class="peripheral-element-left"></div>')
                                                .append('<div id="peripheralElementRight'+i+x+'" class="peripheral-element-right"></div>')
                      $('#peripheralElementMain'+i+x).text(numOtherCase[x].lesson_element)
                      $('#peripheralElementLeft'+i+x).text(numOtherCase[x].peripheral_element.left_side_element)
                      $('#peripheralElementRight'+i+x).text(numOtherCase[x].peripheral_element.right_side_element)

                $('#cardCaseTranslation'+i+x).append('<div id="caseTranslation'+i+x+'" class="case-translation"></div>')
                $('#caseTranslation'+i+x).text('"'+numOtherCase[x].translation+'"')

                var imgurl = "https://img.youtube.com/vi/"+otherCaseVidId+"/sddefault.jpg"
                //get corrensponding video's attribute data-vid-order


                $('#cardCaseVidImage'+i+x).append('<img id="caseVidImage'+i+x+'" vidId="'+otherCaseVidId+'" class="case-vid-image" src="'+imgurl+'"  height="170" width="250"></img>')
                $('#caseVidImage'+i+x).on('click', nestedVideoCall)


              }
            }


          var lessonCases;
          lessonCases = $("#cardStructure").find('div.lesson-structure')
          lessonCases.on('click', activateCase)
}


function activateCase(){
  let index = $(this).attr("data-index");
  //selected will activate the clicked and set animation
  // console.log('bringCaseSource Working! ', index)
  $(".case-sentence").removeClass('case-active')
  $(".case-sentence").addClass('case-inactive')
  $(".card-case-content-wrapper").removeClass('case-content-active')
  $(".card-case-content-wrapper").css('display', 'none')
  $(".card-case-content-wrapper").addClass('case-content-inactive')
  let selectedWrapper = $('.card-case-content-wrapper[data-index='+index+']')
  console.log('this is selectedWrapper object', selectedWrapper);
  selectedWrapper.css('display', 'grid')
  $(this).switchClass('case-inactive','case-active')
  let vidId = $(this).attr("data-vidId");
  console.log('here is the selected cases vidid: ', vidId);
  // nestedVideoCall(vidId)
  // nestedPlayer.seekTo(13)
  // nestedPlayer.playVideo()

  //append the source information to 'cardOtherCase'
  // $('#cardOtherCase')

}
//make a nested youtuebPlayer!

function nestedVideoCall(){
  $("#subtitleboxKor").hide()
  $("#subtitleboxEng").hide()
 console.log('nestedVideoCall is working', nestedPlayers);
 let imageVidid = $(this).attr('vidId')
 // let nestedPlayerVideoIndex = $(this).attr('data-vid-order')
 let selectedVideo =  $('.other-case-video[data-vidId="'+imageVidid+'"]')
 let allVideos = $('.other-case-video')
 allVideos.removeClass('video-active')
 selectedVideo.addClass('video-active')
  // get variable for selected nested player
  let selectedVideoOrder = selectedVideo.attr('data-vid-order')
  let startTime = loadedLesson[0].UsageCase.other_case[0].source.timestamp.start
  let endTime = loadedLesson[0].UsageCase.other_case[0].source.timestamp.end

  nestedPlayers[selectedVideoOrder].playVideo()
  setTimeout(function() { nestedPlayers[selectedVideoOrder].pauseVideo() }, getTimeSpan())

  function getTimeSpan(){
      var timeSpan = endTime - startTime;
      console.log('The time gap is', timeSpan);
      return timeSpan * 1000;
  }
}

function nestedVideoHide(){
  $('.other-case-video').removeClass('video-active')
  $("#subtitleboxKor").show()
  $("#subtitleboxEng").show()
}

// function

export {mainVideoId, initialize, checkPause}
