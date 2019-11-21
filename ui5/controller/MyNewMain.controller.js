sap.ui.define(['rootui5/eve7/controller/Main.controller',
               'rootui5/eve7/lib/EveManager'
], function(MainController, EveManager) {
   "use strict";    

   return MainController.extend("custom.MyNewMain", {                    

      onInit: function() {
         console.log('MAIN CONTROLLER INIT 2');
         MainController.prototype.onInit.apply(this, arguments);
         this.mgr.handle.SetReceiver(this);
	 //this.mgr.
	 console.log("register my controller for init");
         this.mgr.RegisterController(this);
      },
      OnWebsocketMsg : function(handle, msg, offset)
      {
         if ( typeof msg == "string") {
            if ( msg.substr(0,4) == "FW2_") {
               var resp = JSON.parse(msg.substring(4));
               var fnName = "addCollectionResponse";
               this[fnName](resp);
               return;
            }
         }
         this.mgr.OnWebsocketMsg(handle, msg, offset);
      },
      
      showHelp : function(oEvent) {
         alert("=====User support: fireworks@cern.ch");
      }
   });
});
