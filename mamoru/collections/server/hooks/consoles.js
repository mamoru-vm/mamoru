// not testing mirror
if (!process.env.IS_MIRROR) {
   Mamoru.Collections.Consoles.before.insert(function(userId, doc){
    let newConsole = Mamoru.Utils.createConsole();
    if(newConsole.id){
      doc.msfId = newConsole.id;
      doc.prompt = newConsole.prompt;
      doc.busy = newConsole.busy;
      doc.createdAt = moment().unix();
    } else {
      console.log('ummm msf failed to create a console')
      return false
    }

   });

   Mamoru.Collections.Consoles.before.remove(function(userId,doc){
      let destroyResult = Mamoru.Utils.destroyConsole(doc.msfId);
   });

}