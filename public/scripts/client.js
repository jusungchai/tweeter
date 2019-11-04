/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Fake data taken from initial-tweets.json
const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
]

const createTweetElement = function(tweet) {
  let $tweet = $('<article>').addClass('tweet');
  const htmlCode = `
  <header>
    <img src="${tweet.user.avatars}">         
    <p>
      ${tweet.user.name}
      <span>${tweet.user.handle}</span>
    </p>                     
  </header>
  <p>${tweet.content.text}</p>
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
  for (let tweet of tweets){
    $('#tweets-container').append(createTweetElement(tweet));
  }  
}

$(document).ready(function() {
  renderTweets(data);

  $("#submit").submit(function(event) {
    event.preventDefault();    
    console.log($(this).find("textarea").serialize());   
  });    
  
});