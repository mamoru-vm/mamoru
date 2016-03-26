Template.faveTemplate.onRendered(function(){
  $('.ui.heart.rating.fave').rating({
    maxRating: 1,
    clearable: true
   });
});

Template.faveTemplate.helpers({
  checkFave: function (modId) {
   if(Meteor.user().profile.faveMods){
    if(Meteor.user().profile.faveMods.indexOf(modId) > 0){
      return 1
    } else {
      return 0
    }
   }
    //console.log(`is this ${modId}, faved?`)
  }
});


Template.rankTemplate.onRendered(function(){
  $('.ui.rating.rank').rating({interactive:false});
});
