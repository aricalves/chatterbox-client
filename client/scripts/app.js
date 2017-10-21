let app = {
  
  friends: [],
  rooms: [],
  messages: [],
  user: window.location.search.slice(10),
  server: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages'
  
};

app.init = function() {
  
  let start = function() {
    app.fetch();
  };

  
  $('document').ready(function() {

    $('.username').on('click', app.handleUsernameClick);

    $('#send .submit').submit(app.handleSubmit);
    
  });
  
  start();
  
};


app.send = function(message) {
  $.ajax({
    url: this.server,
    type: 'POST',
    data: message,
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    url: this.server,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      _.each(data.results, data => {
        app.messages.push(data);
        app.renderMessage(data);
      });
      //console.log('success', data.results);
    }
  });
};

app.clearMessages = function() {
  $('#chats').html('');
};

app.renderMessage = function(messageData, user, text) {
  messageData = messageData || {};
  $('#chats').
    append(
      `<div id='message'>
        <button class='username'>${user || messageData.username}</button>
        <p class='text'>${text || messageData.text}</p>
      </div>`);  
};

app.renderRoom = function(roomName) {
  $('#roomSelect').append(`<div>${roomName}</div>`);
};

app.handleUsernameClick = function() {
  console.log('something');
};

app.handleSubmit = function() {
  console.log('kjasdflkashdf')
  app.renderMessage(undefined, app.user, $('#message').val);
};


app.init();










