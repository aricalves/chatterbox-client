let app = {
  
  friends: [],
  rooms: [],
  messages: [],
  user: window.location.search.slice(10),
  server: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages'
  
};

$('document').ready(function() {

  app.init = function() {
    app.fetch();
    
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
          <span class='username'>${user || messageData.username}</span>
          <p class='text'>${text || messageData.text}</p>
        </div>`);  
  };

  app.renderRoom = function(roomName) {
    $('#roomSelect').append(`<div>${roomName}</div>`);
  };

  app.handleUsernameClick = function(user) {
    app.friends.push(user);
    console.log('username: ', user.currentTarget.childNodes["0"].data);
  };

  app.handleSubmit = function() {
    console.log('submit');
    app.renderMessage(undefined, app.user, $('#message').val);
  };


  app.init();

  $('#chats').on('click',
    '.username',
    {user: $('#chats .username').currentTarget},
    app.handleUsernameClick
  );


  $('#send .submit').submit(() => {
    app.handleSubmit;
  });
  
});










