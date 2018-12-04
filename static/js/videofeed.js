//when page ready,
console.log("hello?")

window.onload = function bringvideos(){
    console.log('page loaded')
    var setOfVideoId = $.get("http://192.168.1.104:5000/DUMMY/video_feed",function(data){
    //var setOfVideoId = $.get("videofeedtest.json",function(data){
    console.log(data.length)

    for(var i=0; i<data.length; i++){
    $("#videoSelector").append("<div id=videoNo"+i+" class=video-thumbnail-holder data-ga-videoid="+data[i]+"></div>")
    var imgurl = "https://img.youtube.com/vi/"+data[i]+"/sddefault.jpg"
console.log(imgurl)
    $("#videoNo"+i+"").append("<img id=thumbnail"+i+" src="+imgurl+" height=300 width=500>")
    document.getElementById("videoNo"+i+"").src = imgurl


    $("#videoNo"+i+"").on('click', function(){
        const id = $(this).attr("data-ga-videoid");
        console.log(id);
        var url = '../../templates/videoLesson.html?v='+id
        console.log(url)
        window.location=url
    })

    }

    })
}
