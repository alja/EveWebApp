sap.ui.define(['rootui5/eve7/controller/Main.controller',
               'rootui5/eve7/lib/EveManager',
               'rootui5/browser/controller/FileDialog.controller',
               "sap/ui/core/mvc/XMLView",
               'sap/ui/core/Fragment'
], function(MainController, EveManager, FileDialogController, XMLView, Fragment) {
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
      onSaveAsFile: function (tab) {
         FileDialogController.SaveAs({
            websocket: this.mgr.handle,
            filename: "testdialog",
            title: "Select FWC",
            filter: "Any files",
            working_path: "/Files system/tmp/",
            can_change_path: false,
            filters: ["Text files (*.txt)", "C++ files (*.cxx *.cpp *.c)", "Any files (*)"],
            onOk: fname => {
               let p = Math.max(fname.lastIndexOf("/"), fname.lastIndexOf("\\"));
               let title = (p > 0) ? fname.substr(p + 1) : fname;
               this.amtfn = fname;
               let cmd = "FileDialogSaveAs(\"" + fname + "\")";
               this.mgr.SendMIR(cmd, this.fw2gui.fElementId, "EventManager");
            },
            onCancel: function () { },
            onFailure: function () { console.log("DIALOG fail"); }
         });
      },
         
      onEveManagerInit: function() {
         MainController.prototype.onEveManagerInit.apply(this, arguments);
         var world = this.mgr.childs[0].childs;

         // this is a prediction that the GUI is the last element after scenes
         // could loop all the elements in top level and check for typename
         var last = world.length -1;
         if (world[last]._typename == "EventManager") {
            this.fw2gui = (world[last]);

            // add a collback on the change
            var pthis = this;
            this.mgr.UT_refresh_event_info = function() {
               console.log("located element ", world[last]);
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
         document.title = "ABC: " + this.fw2gui.fTitle;
         
         var elem = this.byId("centerTitle");
         elem.setHtmlText(this.fw2gui.fTitle);

         // AMT displabled: not connected with the EventManager streaming
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
      },

      autoplay: function (oEvent) {
         console.log("AUTO", oEvent.getParameter("selected"));
         this.mgr.SendMIR("autoplay(" + oEvent.getParameter("selected") + ")", this.fw2gui.fElementId, "EventManager");
      },

      playdelay: function (oEvent) {
         console.log("playdelay ", oEvent.getParameters());
         this.mgr.SendMIR("playdelay(" + oEvent.getParameter("value") + ")", this.fw2gui.fElementId, "EventManager");
      },

      goToEvent: function (oEvent) {
         console.log("goto event run = ", this.byId("runInput").getValue());
         let cmd = "goToRunEvent(" + this.byId("runInput").getValue() + ", " + this.byId("lumiInput").getValue() + ", " + this.byId("eventInput").getValue() + ")";
         this.mgr.SendMIR(cmd, this.fw2gui.fElementId, "EventManager");
      },

      onPressInvMass: function(oEvent)
      {

			var oButton = oEvent.getSource(),
				oView = this.getView();

			// create popover
			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					id: oView.getId(),
					name: "custom.view.Popover",
					controller: this
            }).then(function (oPopover) {
               oView.addDependent(oPopover);


               var list = new sap.m.List({
                  inset: true
               });

               var data = {
                  navigation: [{ title: "ffffff" }, { title: "fffffffff" }]
               };


               var itemTemplate = new sap.m.StandardListItem({
                  title: "{title}"
               });

               var oModel = new sap.ui.model.json.JSONModel();
               // set the data for the model
               oModel.setData(data);
               // set the model to the list
               list.setModel(oModel);

               // bind Aggregation
               list.bindAggregation("items", "/navigation", itemTemplate);

               oPopover.addContent(list);
					// oPopover.bindElement("/ProductCollection/0");
					return oPopover;
				});
			}
			this._pPopover.then(function(oPopover) {
				oPopover.openBy(oButton);
			});
      },
      handleInvMassCalcPress : function()
      {
			this.byId("myPopover").close();
			alert("Calculate mir has been sent");

      },
   
      showPreferences: function () {
         if (this.cpref){
            this.cpref.openPrefDialog(this.byId("fwedit"));
         }
         else {
            let pthis = this;
            XMLView.create({
               viewData: { "mgr": this.mgr},
               viewName: "custom.view.CommonPreferences"
            }).then(function (oView) {
               pthis.cpref = oView.getController();
               pthis.cpref.setGUIElement(pthis.fw2gui);
               pthis.cpref.openPrefDialog(pthis.byId("fwedit"));

               
            });
         }
      }
   });
});
