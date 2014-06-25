// Configure accounts package to use username instead of email.
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

Template.messages.messages = function() {
  return Messages.find();
};

Template.messages.events({
  'click .reset': function() {
    Messages.find().forEach(function(m) {
      Messages.remove(m._id);
    });
  }
});

Template.messages.helpers({
  username: function(id) {
    return Meteor.users.findOne(id).username;
  }
});

Template.friends.helpers({
  username: function(id) {
    return Meteor.users.findOne(id).username;
  }
});

Template.friends.friends = function() {
  var myId = Meteor.user()._id;

  return Friendships.find({ from: myId });
};

Template.users.users = function() {
  var myId = Meteor.user()._id;

  // Find all users except for the current one.
  return Meteor.users.find({ _id: { $not: myId } });
};

Template.friends.events({
  'click .user': function() {
    sendMessage(this.to);
  },

  'click button.add': function() {
    var myId = Meteor.user()._id;
    var input = $('input.username').val();

    // Find a user by name that isn't the current one.
    var otherUser = Meteor.users.findOne({
      _id: { $not: myId },
      username: input
    });

    if (otherUser) {
      var from = myId;
      var to = otherUser._id;

      // Establish friendship both ways.
      Friendships.insert({
        from: from,
        to: to
      });

      Friendships.insert({
        from: to,
        to: from
      });
    } else {
      console.log('Could not find user: ' + input);
    }
  }
});

var sendMessage = function(to) {
  var from = Meteor.user()._id;

  Messages.insert({
    from: from,
    to: to
  });
};
