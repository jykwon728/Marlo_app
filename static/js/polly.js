
AWS.config.accessKeyId = 'AKIAJ7VADWG64XO7VO2A';
AWS.config.secretAccessKey = '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';
AWS.config.region = 'ap-northeast-2';




$('#hearVoice').on('click', function(){
console.log('poly function works')
var polly = new AWS.Polly();

var params = {
    OutputFormat: "mp3",
    Text: showScriptNow(),
    TextType: "text",
    VoiceId: "Seoyeon"
};
polly.synthesizeSpeech(params, function(err, data){
    if (err){
        console.log(err, err.stack);
    }
    else{
        var uInt8Array = new Uint8Array(data.AudioStream);
        var arrayBuffer = uInt8Array.buffer;
        var blob = new Blob([arrayBuffer]);

        var audio = $('audio');
        var url = URL.createObjectURL(blob);
        audio[0].src = url;
        audio[0].play();
        }
    })
})


$('.realmain-words').on('click', function(){
console.log('poly function for word works')

var polly = new AWS.Polly();

var params = {
    OutputFormat: "mp3",
    Text: showScriptNow(),
    TextType: "text",
    VoiceId: "Seoyeon"
};
polly.synthesizeSpeech(params, function(err, data){
    if (err){
        console.log(err, err.stack);
    }
    else{
        var uInt8Array = new Uint8Array(data.AudioStream);
        var arrayBuffer = uInt8Array.buffer;
        var blob = new Blob([arrayBuffer]);

        var audio = $('audio');
        var url = URL.createObjectURL(blob);
        audio[0].src = url;
        audio[0].play();


        }
    })

});
