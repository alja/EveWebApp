sap.ui.define(['rootui5/eve7/controller/Main.controller',
               'rootui5/eve7/lib/EveManager',
               'rootui5/browser/controller/FileDialog.controller',
               "sap/ui/core/mvc/XMLView"
], function(MainController, EveManager, FileDialogController, XMLView) {
   "use strict";

   return MainController.extend("custom.MyNewMain", {

      onWebsocketClosed : function() {
         var elem = this.byId("centerTitle");
         elem.setHtmlText("<strong style=\"color: red;\">Client Disconnected !</strong>");
      },

      onInit: function() {
         console.log('MAIN CONTROLLER INIT 2');
         MainController.prototype.onInit.apply(this, arguments);
         this.mgr.handle.setReceiver(this);
         //this.mgr.
         console.log("register my controller for init");
         this.mgr.RegisterController(this);
      },


      /** @brief Invoke dialog with server side code */
      onSaveAsFile: function(tab) {
         this.amtfn = "";
         console.log("on save as ");
                  FileDialogController.SaveAs({
                     websocket: this.mgr.handle,
                     filename: "testdialog",
                     title: "Select file name to save",
                     filter: "Any files",
                     filters: ["Text files (*.txt)", "C++ files (*.cxx *.cpp *.c)", "Any files (*)"],
                     onOk: fname => {
                        console.log("AMT test dialof ALL OK, chose ", fname);
                        let p = Math.max(fname.lastIndexOf("/"), fname.lastIndexOf("\\"));
                        let title = (p > 0) ? fname.substr(p+1) : fname;
                        this.amtfn = fname;
                        let cmd = "FileDialogSaveAs(\"" + fname + "\")";
                        this.mgr.SendMIR(cmd, this.fw2gui.fElementId, "EventManager");
                     },
                     onCancel: function() { },
                     onFailure: function() { console.log("DIALOF fail");}
                  });
               },
         
      onEveManagerInit: function() {
         MainController.prototype.onEveManagerInit.apply(this, arguments);
         var world = this.mgr.childs[0].childs;

         // this is a prediction that the fireworks GUI is the last element after scenes
         // could loop all the elements in top level and check for typename
         var last = world.length -1;
         console.log("init gui ", last, world);

         if (world[last]._typename == "EventManager") {
            this.fw2gui = (world[last]);

            var pthis = this;
            this.mgr.UT_refresh_event_info = function() {
               console.log("jay ", world[last]);
               pthis.showEventInfo();
            }

             pthis.showEventInfo();
         }
      },

      onWebsocketMsg : function(handle, msg, offset)
      {
         if ( typeof msg == "string") {
            if ( msg.substr(0,4) == "FW2_") {
               var resp = JSON.parse(msg.substring(4));
               var fnName = "addCollectionResponse";
               this[fnName](resp);
               return;
            }
         }
         console.log("socket msg AMT", "OnWebsocketMsg");
         this.mgr.onWebsocketMsg(handle, msg, offset);
      },

      showHelp : function(oEvent) {
         alert("=====User support: dummy@cern.ch");
      },

      showEventInfo : function() {
         document.title = "ABC: " + this.fw2gui.fname + " " + this.fw2gui.eventCnt + "/" + this.fw2gui.size;
         this.byId("runInput").setValue(this.fw2gui.run);
         this.byId("lumiInput").setValue(this.fw2gui.lumi);
         this.byId("eventInput").setValue(this.fw2gui.event);

         this.byId("dateLabel").setText(this.fw2gui.date);
      },

      nextEvent : function(oEvent) {
          this.mgr.SendMIR("NextEvent()", this.fw2gui.fElementId, "EventManager");
      },

      prevEvent : function(oEvent) {
         this.mgr.SendMIR("PreviousEvent()", this.fw2gui.fElementId, "EventManager");
      },

      toggleGedEditor: function() {
         this.byId("Summary").getController().toggleEditor();
      },

      testXML: function () {
         if (this.eventFilter){
            this.eventFilter.openFilterDialog();
         }
         else {
            let pthis = this;
            XMLView.create({
               viewName: "custom.view.EventFilter",
            }).then(function (oView) {
               pthis.eventFilter = oView.getController();
               pthis.eventFilter.setGUIElement(pthis.fw2gui);
              // console.log(oView, "filter dialog", oView.byId("filterDialog"));
               pthis.eventFilter.makeTables();
               pthis.eventFilter.openFilterDialog();
            });
         }
      }
   });
});
