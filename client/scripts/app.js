let app = {
  
  friends: [],
  rooms: [],
  messages: [],
  user: window.location.search.slice(10),
  server: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
  currentRoom: 'lobby'
  
};

$('document').ready(function() {

  app.init = function() {
    app.fetch(app.currentRoom);
    app.renderRoom();
  };


  app.send = function(message) {
    $.ajax({
      url: this.server,
      type: 'POST',
      data: message,
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        app.fetch(app.currentRoom);
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };

  app.fetch = function(room) {
    room = room || 'lobby';
    $.ajax({
      url: this.server,
      type: 'GET',
      contentType: 'application/json',
      data: {
        order: '-createdAt'
      },
      success: function (data) {
        _.each(data.results, data => {
          app.messages.push(data);
          if (!app.rooms.includes(data.roomname)) {
            app.rooms.push(data.roomname);
          }
          if (room === data.roomname) {
            app.renderMessage(data);
          }
        });
        app.renderRoom(app.rooms);
        console.log('success:', data.results);
      }
    });
  };

  app.clearMessages = function() {
    $('#chats').html('');
  };

  app.renderMessage = function(messageData, user, text) {
    messageData = messageData || {};
    
    if (app.friends.includes(messageData.username)) {
      $('#chats').
        append(
          `<div class='message'>
            <bold><span class='username'>${user || app.sanitize(messageData.username)}</span></bold>
            <span class='text'>${text || app.sanitize(messageData.text)}</span>
          </div>`);
    } else {
      $('#chats').
        append(
          `<div class='message'>
            <span class='username'>${user || app.sanitize(messageData.username)}</span>
            <span class='text'>${text || app.sanitize(messageData.text)}</span>
          </div>`);
    }
  };

  app.renderRoom = function(rooms) {
    _.each(rooms, room => {
      $('#roomSelect').append(`<span>${room}</span>`);
    });
  };

  app.handleUsernameClick = function(user) {
    app.friends.push(user.currentTarget.childNodes[0].data);
    app.clearMessages();
    app.fetch();
    console.log('username: ', user.currentTarget.childNodes[0].data);
  };

  app.handleSubmit = function(message) {
    app.send(message);
  };

  app.sanitize = function(text) {
    text = text || 'covfefe';
    return text.replace(/[<>{}``/\.()&=]/g, ' ');
  };
  
  app.createRoom = function() {
    let newRoom = prompt('What is the name of your new room?');
    app.currentRoom = newRoom;
    app.renderRoom([newRoom]);
    app.enterRoom(newRoom);
  };
  
  app.enterRoom = function(room) {
    app.clearMessages();
    _.each(app.messages, message => {
      if (message.roomname === room) {
        app.renderMessage(message);
      }
    });
    
  };



  $('#chats').on('click',
    '.username',
    {user: $('#chats .username').val()},
    app.handleUsernameClick
  );


  $(document).on('submit', '#send', () => {
    let msgText = $('input[name="message"]').val();
    let msg = {
      username: app.user,
      text: msgText,
      createdAt: new Date(),
      roomname: app.currentRoom
    };
    app.handleSubmit(JSON.stringify(msg));
  });
  
  
  

  
  $('#rooms').on('click', '#roomMaker', app.createRoom);
  
  $(document).on('click', '#roomSelect', () => {
    
    console.log(room);
    app.enterRoom.bind(room);
  });
  

  app.init();
  
});










