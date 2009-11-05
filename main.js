// You may alter the values of these three variables
flickrApiKey = "fa737a271df001b7e1b0857d349a82fe";
photosetId = "72157622740348270";
messageLength = 10000; // 10 seconds
imageLength = 7000; // 10 seconds

/***** You shouldn't need to edit below here ******/

messages = new Array();
images = null;

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

function fetchImages()
{
  $.ajax({
    async: false,
    url: "http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&format=json&api_key="+flickrApiKey+"&photoset_id="+photosetId+"&extras=url_o&jsoncallback=?",
    type: "GET",
    data: {},
    dataType: "json",
    error: function(request, status, error){ alert("error in request") },
    success: function(data, textStatus){
      images = data.photoset.photo;
      $.each(images, function(image){
        preload = new Image(image.width_o, image.height_o); 
        preload.src = image.url_o;
      })
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

function getRandomImage()
{
  return images[Math.floor(Math.random()*images.length)];
}

function nextImage()
{
  // alert(images)
  // Fetch the new messages
  if (images == null || images.length <= 0)
  {
    fetchImages();
    setTimeout(nextImage, 1000);
  }
  else
  {
    // Make sure we don't get the same image
    do
    {
      image = getRandomImage();
    }
    while (image.url_o == $("#image img").attr("src"));
    
    $("#image").fadeOut(300, function(){ $(this).find("img").attr({src: image.url_o, alt: image.title})}).fadeIn(300);
    setTimeout(nextImage, imageLength);
  }
}

$(document).ready(function(){
  nextImage();
	nextMessage();
});
