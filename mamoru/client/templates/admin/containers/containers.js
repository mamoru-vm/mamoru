Template.manageContainers.onCreated(function(){
	this.subscribe('all-containers');
	Meteor.call("checkAllContainers");
});

Template.manageContainers.onRendered(function(){
	
});

Template.manageContainers.helpers({
	allContainers: function(){
		return Mamoru.Collections.Containers.find({}).fetch()
	}
	
});

Template.manageContainers.events({

});

Template.containerTableRow.onRendered(function(){
	$('.ui.left.pointing.dropdown').dropdown();
})

Template.containerTableRow.events({
	'click .confCont':function(event,template){
		var contId = $(event.target).data("id")
		console.log(`conf container ${contId}`)

	},
	'click .createCont':function(event,template){
		var contId = $(event.target).data("id")
		var cont = Mamoru.Collections.Containers.findOne(contId)
		sAlert.success(`Creating container ${cont.name}`, {timeout:750});
		Meteor.call("createContainer", contId, function(err,res){
			if(!err){
				console.log(res);
			} else {
				sAlert.error(`Whoaa: ${err}`, {timeout:1750});
				console.log(err);
			}
		});
	},
	'click .stopCont':function(event,template){
		var contId = $(event.target).data("id")
		var cont = Mamoru.Collections.Containers.findOne(contId)
		sAlert.warning(`Stopping container ${cont.name}`, {timeout:750});
		Meteor.call("stopContainer", contId, function(err,res){
			if(!err){
				console.log(res);
			} else {
				sAlert.error(`Whoaa: ${err}`, {timeout:1750});
				console.log(err);
			}
		});
	},
	'click .restartCont':function(event,template){
		var contId = $(event.target).data("id");
		var cont = Mamoru.Collections.Containers.findOne(contId)
		sAlert.info(`Restarting container ${cont.name}`, {timeout:1250});
		console.log(`restart container ${contId}`)
		Meteor.call("restartContainer", contId, function(err,res){
			if(!err){
				console.log(res);
			} else {
				sAlert.error(`Whoaa: ${err}`, {timeout:1750});
				console.log(err);
			}
		});
	},
	'click .startCont':function(event,template){
		var contId = $(event.target).data("id");
		var cont = Mamoru.Collections.Containers.findOne(contId);
		sAlert.success(`Starting container ${cont.name}`, {timeout:1250});
		console.log(`start container ${contId}`);
		Meteor.call("startContainer", contId, function(err,res){
			if(!err){
				console.log(res);
			} else {
				sAlert.error(`Whoaa: ${err}`, {timeout:1750});
				console.log(err);
			}
		});

	},
	'click .removeCont': function(event, template){
		var contId = $(event.target).data("id");
		var cont = Mamoru.Collections.Containers.findOne(contId)
		sAlert.warning(`Removing container ${cont.name}`, {timeout:1250});
		Meteor.call("removeContainer", contId, function(err,res){
			if(!err){
				console.log(res);
			} else {
				sAlert.error(`Whoaa ${err}`, {timeout:1750});
				console.log(err);
			}
		});

	}

})
Template.containerTableRow.helpers({
	shortenId: function(id){
		return s.truncate(id, 8)
	},
	dependancyRunning:function(id){
		var thisCont = Mamoru.Collections.Containers.findOne(id);
		var depends = Mamoru.Collections.Containers.findOne({name:thisCont.depends})
		if(depends){
			return depends.up
		} else {
			return true
		}
	},
	exists: function(id){
		var thisCont = Mamoru.Collections.Containers.findOne(id);
		if(thisCont.containerId){
			return true
		} else {
			return false
		}
	}
})