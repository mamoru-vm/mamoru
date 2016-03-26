Template.projectNav.helpers({
  foo: function () {
    // ...
  }
});

Template.projectNav.events({
  'click .link.step': function (event) {
    var projAction = $(event.currentTarget).data('value')
    var currentProj = Session.get('currentProject');
    FlowRouter.go(`/projects/${currentProj}/${projAction}`)
  }
});

Template.discover.onCreated(function(){
  var slug = FlowRouter.getParam('projectSlug');

  this.subscribe('project-hosts', slug);
  this.subscribe('scanner-modules');

});


Template.discover.onRendered(function(){
    Mamoru.Collections.Hosts.find().observeChanges({
      changed:function(id,fields) {
        console.log(`${id} changed`);
        $('.ui.dropdown').dropdown();
      }
    });


  $('.ui.sticky')
  .sticky({
    context: '#content'
  });


});

Template.discover.events({

  'click .removeAhost':function(event){
    console.log('remove a host!');
    console.log($(event.currentTarget).parent().data('value'));
  },
  'click .enumerateHost':function(event){
    console.log($(event.currentTarget).parent().data('value'));
    $('#enumerateHostModal').modal('toggle');
   
  },

  'click .addNote':function(event){
    console.log('add a note!');
    console.log($(event.currentTarget).parent().data('value'));
  },

    'click .addService':function(event){
    console.log('add a service!');
    console.log($(event.currentTarget).parent().data('value'));
  },

  'click .hostRow': function (event) {
    event.preventDefault();
    var host = this;
    // if we are hittin the host action button, and not just selecting a row
    if (event.target.className === 'ui left pointing dropdown icon basic button hostTableAction' || event.target.className === 'tasks icon') {
      console.log("host action button!");

    // when just selecting a row, set row host to selected host
    } else {
      if(!Mamoru.Collections.Hosts.findOne(host._id)){
        Session.set('selectedHost', null);
          } else {
        Session.set('selectedHost',host._id);
        Session.set('selectedService', null);
      };
    }

  },
  'click .serviceRow':function(event){
    console.log("clicked service Row!")
      Session.set('selectedService', {port:this.port, proto:this.proto});
  }
});

Template.discover.helpers({
  isHostSelected:function(){
    if(Session.get('selectedHost')){
      return true
    } else {
      return false
    }
  },
  editableOptions:function(){
    return {substitute:'<i class="write icon"></i>', eventType:"dblclick", inputStyle:"color:green;", acceptEmpty:true}
  },
  selectedHost:function(){
    let hostId = Session.get('selectedHost')
    return Mamoru.Collections.Hosts.findOne(hostId);
  },
  enumeratingHost:function(){
    let selectedHostId = Session.get('selectedHost');
    let thisHost = Mamoru.Collections.Hosts.findOne(selectedHostId);
    if(thisHost.enumerating){
      return true
    } else {
      return false
    }
  },
  
  projectHosts: function () {
    return Mamoru.Collections.Hosts.find({}, {sort:['address','desc']});
  },
  countServices:function(array){
    if(array){
      return array.length
    } else {
      return 0
    }
  },
  hostTableSettings: function(){
     var fieldsArray = [{
                  key:'address',
                  label:'Address'
                  //headerClass:'center aligned',
                 // cellClass:'center aligned'
                  },
                  {
                    key:'name',
                    label:'Name'
                  },
                  {
                    key:'state',
                    label:'State'
                  },
                  {
                    key:'os_name',
                    label:'OS'
                    //headerClass:'center aligned',
                    //cellClass:'center aligned'
                  },
                  {
                    key:'purpose',
                    label:'Purpose'
                  },
                  {
                    key:'services',
                    label:'Service Count',
                    headerClass:'center aligned',
                    fn: function(value,obj){
                      if(value){
                        return value.length
                      } else {
                        return 0
                      }
                    },
                    cellClass:'center aligned'
                  },
                  {
                    key:'vulns',
                    label:'Vulns Count',
                    headerClass:'center aligned',
                    fn: function(value,obj){
                      if(value){
                        return value.length
                      } else {
                        return 0
                      }
                    },
                    cellClass:'center aligned'
                  },
                  {
                    key:'activeSession', 
                    label:'Active Session',
                    headerClass:'center aligned',
                    cellClass:'center aligned',
                    fn:function(){
                      return 0
                    }
                  },
                  {
                    key:'_id', 
                    label:'Host Actions',
                    headerClass:'center aligned',
                    cellClass:'center aligned',
                    tmpl: Template.actionCell
                  }
                ]


          function rowClassfn(item){
            if(item._id === Session.get('selectedHost')){
              return 'hostRow active'
            } else {
              return 'hostRow'
            }
          }

        return {fields:fieldsArray,rowsPerPage:5, noDataTmpl:Template.emptyHostsTableTemplate, rowClass:rowClassfn}
  },
  serviceTableSettings: function(){

    function rowClassfn(item){
      let selectedService = Session.get('selectedService') || {};
        if(item.port === selectedService.port && item.proto === selectedService.proto){
            return 'serviceRow active'
          } else {
            return 'serviceRow'
          }
      }

    let fields = [{key:'port',label:'Port'}, {key:'proto',label:'Protocol'}, {key:'state',label:'State'}, {key:'name', label:'Name'}]
    return {fields:fields, rowsPerPage:5, rowClass:rowClassfn}
  }
});


Template.actionCell.onRendered(function(){
    $('.hostTableAction').dropdown();
});


Template.actionCell.helpers({
  moduleId: function () {
    return this._id
  }
});