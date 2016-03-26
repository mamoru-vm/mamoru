Template.activityFeed.onRendered(function(){
$('.ui.sticky').sticky({context: '#nav'});
});


Template.activityFeed.helpers({
  foo: function () {
    // ...
  }
});