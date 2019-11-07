//Function to change counter value and color
$(document).ready(function() {
  $(".new-tweet textarea").on('input', function() {    
    const remainingChar = 140 - $(this).val().length;
    const counter = $(this).closest(".new-tweet").find(".counter");
    if (remainingChar < 0){
      counter.addClass("changeCounterColor");
    } else {
      counter.removeClass("changeCounterColor");
    }    
    counter.text(remainingChar);
  });
});