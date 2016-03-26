
Template.moduleList.onCreated(function(){

  console.log("onCreated: " + FlowRouter.getParam('category'))
  this.subscribe('all-modules');

}); 

Template.moduleList.onRendered(function(){

});


Template.moduleList.events({
 'click .reactive-table tbody tr': function (event) {
    let classes = event.target.className.split(" ").concat($(event.target).parent().attr("class").split(" "))
    if(classes.indexOf("fave") >= 1){
      var toggled = $(event.target).parent('.ui.heart.rating.fave').rating("get rating");
      if(classes.indexOf("aligned") >= 1){
        console.log("do nothing");
      } else {
        if(toggled){
          console.log("favourited " + this._id);
          Meteor.users.update({_id:Meteor.userId()},{$push:{'profile.faveMods': this._id}});
        } else {
          console.log("un favourited " + this._id);
          Meteor.users.update({_id:Meteor.userId()},{$pull:{'profile.faveMods': this._id}});
        }
      }
    } else {
      FlowRouter.go(`/modules/${this._id}`);
    }
}
});

Template.moduleList.helpers({
  tableSettings: function(){
   
    const fieldsArray = [{
                  key:'cat',
                  label:'Category',
                  headerClass:'center aligned',
                  cellClass:'center aligned'
                  },
                  {
                    key:'name',
                    label:'Name'
                  },
                  {
                    key:'platform',
                    label:'Platform',
                    headerClass:'center aligned',
                    cellClass:'center aligned'
                  },
                  {
                    key:'rank',
                    label:'Rating',
                    headerClass:'center aligned',
                    tmpl: Template.rankTemplate,
                    cellClass:'center aligned'
                  },
                  {
                    key:'userfave', 
                    label:'Favourite',
                    headerClass:'center aligned',
                    cellClass:'center aligned fave',
                    tmpl: Template.faveTemplate,
                    sortable: false
                  }
                ]

        return {
                showFilter:true,
                collection: Mamoru.Collections.Modules,
                fields: fieldsArray,
                class: "ui compact selectable inverted table",
                filters: ["category-filter"],
                rowClass:"modRow"
               // noDataTmpl: Template.modsLoadingTemplate
               } 
  }
});