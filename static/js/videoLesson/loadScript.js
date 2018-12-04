

const gettingScript=function(location){
  return new Promise(function(resolve, reject){
    $.ajax({
        type: "GET",
        url: location,
        crossDomain: true,
        datatype: "json",
        success: function(script){
          console.log('json get successful: ', script)
          resolve(script)


        }
      })
    })
}

export{gettingScript}
