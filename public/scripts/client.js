/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

/* Funtion to prevent XSS */
const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* Function which creates the HTML string for each tweet in the database */
const createTweetElement = function(tweet) {
  //Calculate the time difference of when the tweet was created and now
  const timeDiff = Math.ceil(((new Date().getTime()) - tweet.created_at)/86400000);
  //Create article tag and attach tweet class onto it
  let $tweet = $('<article>').addClass('tweet');
  //Create the HTML code which will go into the article tag
  const htmlCode = `
  <header>
    <img src="${tweet.user.avatars}">         
    <p>${tweet.user.name}
      <span>${tweet.user.handle}</span>
    </p>                        
  </header>
  <p>${escape(tweet.content.text)}</p>
  <footer>
    <p>${timeDiff} days ago
      <span>                
        <i class="fa fa-flag">&#160</i>
        <i class="fa fa-retweet">&#160</i>
        <i class="fa fa-heart"></i>
      </span>
    </p>                            
  </footer>
  `;
  //Attach the HTML string and return
  $tweet.append(htmlCode);
  return $tweet;
}

//Function to render array of tweets object from the database
const renderTweets = function(tweets) {
  //Empty the container first to ensure new render is not attached to old render
  $("#tweets-container").empty();
  //Reverse the array first before iteration to display tweets in chronological order
  const tweetsInChronOrder = tweets.reverse();
  for (let tweet of tweetsInChronOrder){
    $('#tweets-container').append(createTweetElement(tweet));
  }  
}

/* Function to laod tweets using ajax and jquery */
const loadTweets = function() {    
  $.ajax({
    url: "/tweets",
    dataType: "json",
    type: "GET",
    success: function(tweetDB){      
      renderTweets(tweetDB);
    },
    error: function(){
      $("#error").text("Something went wrong");
      $("#error").slideDown();
      event.preventDefault();
    }
  });  
}

//Wait until page is loaded
$(document).ready(function() {    
  //Hide error message box and compose tweet container on load as per document requirement
  $("#error").hide();
  $(".new-tweet").hide();
  //Load tweets from database 
  loadTweets();

  //Action for submitting a tweet
  $("#submit").submit(function(event) {
    //Check tweet invalidation and show error if necessary    
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
      //On valid tweet, perform ajax post method to pass new tweet object to database 
      event.preventDefault();
      $.ajax({
        url: "/tweets",
        dataType: "text",
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data: $(this).find("textarea").serialize(),
        success: function() {
          loadTweets();
          $("#error").slideUp();
        },
        error: function() {
          $("#error").text("Something went wrong");
          $("#error").slideDown();
          event.preventDefault();
        }
      });
      //Reset textarea and the counter value after submission
      $("textarea").val("");
      $(".counter").text(140);
    }       
  });
  
  //Set compose box to be hidden on page load as per document requirement
  let composeBoxHidden = true;
  //Slide new tweet container up or down based on current status
  $("#compose").on("click", function(event) {
    if (composeBoxHidden){
      $(".new-tweet").slideDown();
      $(".new-tweet").find("textarea").focus();
      composeBoxHidden = false; 
    } else {
      $(".new-tweet").slideUp();      
      composeBoxHidden = true; 
    }        
  });

  /* Implementing second button to scroll up the page
  Check if atleast 200px was scrolled down based on top of the page and show button */
  const secondButton = $("#scroll-up");
  $(window).scroll(function() {
    if ($(window).scrollTop() > 200) {
      secondButton.addClass('show');
    } else {
      secondButton.removeClass('show');
    }
  });

  /* On click, scroll the page back up to top and focus on textarea for user to create new tweet
  If combose box is currently hidden, slide the box to view first */
  secondButton.on('click', function(event) {
    $('html, body').animate({scrollTop:0});
    $(".new-tweet").slideDown();    
    $(".new-tweet").find("textarea").focus();
    composeBoxHidden = false;
  });
  
});