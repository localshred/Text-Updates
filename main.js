// You may alter the values of these three variables
var flickrId = "28488422@N06";
var messageLength = 10000; // 10 seconds
var imageLength = 10000; // 10 seconds

/***** You shouldn't need to edit below here ******/

var messages = new Array();
var images = null;

function fetchNewMessages()
{
  $.ajax({
    async: false,
    url: "fetch.php",
    type: "GET",
    data: {},
    dataType: "json",
    error: function(request, status, error){ alert("error in request") },
    success: function(data, textStatus){
      messages = data.messages;
      $("#num-messages").html(data.num_messages);
    }
  });
}

function nextMessage()
{
  // Fetch the new messages
  if (messages == null || messages.length <= 0)
    fetchNewMessages();
  
  // Show the next message
  if (messages.length > 0)
  {
    // message = messages[Math.floor(Math.random()*messages.length)];
    message = messages.shift();
    $("#message").fadeOut(300, function(){
      $(this).html(message.message);
      $("#sender").html(message.sender);
      $("#sent-date").html(message.ts);
    }).fadeIn(300);
  }
  
  // Call recursive
  setTimeout(nextMessage, messageLength);
}

function nextImage()
{
  if (images != null)
  {
    image = images.items[Math.floor(Math.random()*images.items.length)];
    $("#image").fadeOut(300, function(){ $(this).find("img").attr({src: image.media.m, alt: image.title})}).fadeIn(300);
    setTimeout(nextImage, imageLength);
  }
}

// Simply assign the response object to the images object for late processing
function jsonFlickrFeed(obj)
{
  images = obj;
}

$(document).ready(function(){
  // $.getScript("http://api.flickr.com/services/feeds/photos_public.gne?id="+flickrId+"&lang=en-us&format=json", function(data, status){ alert("here"); eval(data); alert("and here") });
	nextMessage();
	nextImage();
});
