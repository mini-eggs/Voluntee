(function(){
  $('#currentyear').html( ( parseInt( new Date().getYear() ) - 100 + 2000 ).toString() )
})()