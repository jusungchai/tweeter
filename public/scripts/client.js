/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

const createTweetElement = function(tweet) {
  let $tweet = $('<article>').addClass('tweet');
  const htmlCode = `
  <header>
    <img src="${tweet.user.avatars}">         
    <p>${tweet.user.name}
      <span>${tweet.user.handle}</span>
    </p>                        
  </header>
  <p>${escape(tweet.content.text)}</p>
  <footer>
    <p>${tweet.created_at}
      <span>                
        <i class="fa fa-flag">&#160</i>
        <i class="fa fa-retweet">&#160</i>
        <i class="fa fa-heart"></i>
      </span>
    </p>                            
  </footer>
  `;
  $tweet.append(htmlCode);
  return $tweet;
}

const renderTweets = function(tweets) {
  $("#tweets-container").empty();
  const tweetsInChronOrder = tweets.reverse();
  for (let tweet of tweetsInChronOrder){
    $('#tweets-container').append(createTweetElement(tweet));
  }  
}

$(document).ready(function() {
  const loadTweets = function() {    
    $.ajax({
      url: "/tweets",
      dataType: "json",
      type: "GET",
      success: function(tweetDB){
        console.log(tweetDB);
        renderTweets(tweetDB);
      },
      error: function(){
        $("#error").text("Something went wrong");
        $("#error").slideDown();
        event.preventDefault();
      }
    });  
  }  
  
  $("#error").hide();
  loadTweets();

  $("#submit").submit(function(event) {    
    const wordCount = $(this).find("textarea").val().length;
    if (wordCount === 0) {
      $("#error").text("Empty Tweet Message!");
      $("#error").slideDown();
      event.preventDefault();
    } else if (wordCount > 140) {
      $("#error").text("Text Exeeds 140 Characters!");
      $("#error").slideDown();
      event.preventDefault();
    } else {
      event.preventDefault();
      $.ajax({
        url: "/tweets",
        dataType: "text",
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data: $(this).find("textarea").serialize(),
        success: function() {
          loadTweets();
        },
        error: function() {
          $("#error").text("Something went wrong");
          $("#error").slideDown();
          event.preventDefault();
        }
      });
      $("textarea").val("");
      $(".counter").text(140);
    }       
  });
  
  let composeToggle = true;
  let startToggle = true;
  $("#compose").on("click", function(event) {
    if (composeToggle && startToggle){
      $(".new-tweet").find("textarea").focus();
      composeToggle = false;
      startToggle = false;
    } else if (composeToggle){
      $(".new-tweet").slideDown();      
      $(".new-tweet").find("textarea").focus();    
      composeToggle = false;  
    } else {
      $(".new-tweet").slideUp();
      composeToggle = true;
    }      
  });

  const secondButton = $("#scroll-up");
  $(window).scroll(function() {
    if ($(window).scrollTop() > 200) {
      secondButton.addClass('show');
    } else {
      secondButton.removeClass('show');
    }
  });

  secondButton.on('click', function(event) {
    $('html, body').animate({scrollTop:0});
    $(".new-tweet").find("textarea").focus();
  });
  
});