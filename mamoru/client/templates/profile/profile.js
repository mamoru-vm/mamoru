Template.userProfile.helpers({
  myProfile: function () {
    return Meteor.users.findOne(Meteor.userId())
  }
});

Template.userProfile.events({
  'click': function () {
    // ...
  }
});