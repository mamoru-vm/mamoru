Template.moduleSearchFilter.onCreated(function(){
  this.currentSearch = new ReactiveVar("")
  this.searchFilter = new ReactiveTable.Filter("search-filter", ["name", "cat", "platform"]);
});

Template.moduleSearchFilter.helpers({

});

Template.moduleSearchFilter.events({
  'click .searchMods':function(event,template){
    var searchString = $('#modSearchField').val()
    console.log("search filter!: " + searchString);
  },
  'click .clearField':function(event,template){
    console.log("clear filter!")
    $('#modSearchField').val("")
  }
});



Template.filterButtons.helpers({
  checkActive: function (filter) {
    var currentFilters = Template.instance().get('selectedFilters').get()
    if(currentFilters.indexOf(filter) > -1){
      return "active"
    }
  }
});


function handleFilter(array, item){
  var i = array.indexOf(item);
  if( i > -1){
     array.splice(i, 1);
     return array
  } else {
    array.push(item);
    return array ;
  }
}

Template.filterButtons.onCreated(function(){
  this.selectedFilters = new ReactiveVar([])
  this.categoryFilter = new ReactiveTable.Filter("category-filter", ["cat"]);
});

Template.filterButtons.events({
'click .filterButton': function(event, template){
 var clickedFilter = $(event.currentTarget).data('filter');
 var currentFilter = template.selectedFilters.get()
 
 if(clickedFilter == 'all'){
  var filter = ["exploit", "auxiliary", "post", "encoder", "nop", "payload"]
  template.categoryFilter.set({"$in": filter });
  template.selectedFilters.set(filter)
 } else if (clickedFilter == 'faves') {
    //do something...
 } else if(clickedFilter == 'clear'){
    template.categoryFilter.set("");
    template.selectedFilters.set([]);
 } else {
  var newFilter = handleFilter(currentFilter,clickedFilter)
  console.log(currentFilter)
  console.log(newFilter)
  template.categoryFilter.set({"$in": newFilter  });
  template.selectedFilters.set(newFilter)
 }
 
}

});

Template.filterButtons.onRendered(function(){
$('.filterButton').popup({
      inline   : true,
      hoverable: true,
      position : 'top left',
      delay: {
        show: 250,
        hide: 200
      }
    });

});