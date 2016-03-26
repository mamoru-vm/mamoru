// dont create hotkeys unless logged in
Accounts.onLogin(function(){

globalHotkeys = new Hotkeys();

var hideAndDeactivateShell = function  (){
    consolePanel.slideUp();
    msfShell.deactivate();
    consolePanel.blur();
    activateButton.fadeIn();
}

// shit + ` to access shell (~)
globalHotkeys.add({
    combo : "shift+`",
    callback : function(event){
       event.preventDefault();
       activateButton.fadeOut();
       consolePanel.slideDown();
       msfShell.activate();
       consolePanel.focus()
    }
});

// ctrl+c to close shell
globalHotkeys.add({
    combo : "ctrl+c",
    callback : function(event){
      event.preventDefault();
      hideAndDeactivateShell();
    }
});

// ctrl+d to close shell
globalHotkeys.add({
    combo : "ctrl+d",
    callback : function(event){
      event.preventDefault();
      hideAndDeactivateShell();  
    }
});





});

