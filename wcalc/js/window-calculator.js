$(function() {
   
    
    $('.wc-slider-vertical').slider( {
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 100,
        value: 60,
        slide: function(event, ui) {
            
        }
    });
});