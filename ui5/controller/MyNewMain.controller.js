sap.ui.define(['rootui5/eve7/controller/Main.controller',
               'rootui5/eve7/lib/EveManager',
               'rootui5/browser/controller/FileDialog.controller'
], function(MainController, EveManager, FileDialogController) {
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
      


      showFilters: function () {
         if (!this.filterDialog)
            this.makeFilterDialog();

            let aData = [
               { id: Math.random(), name: "$Muons.@size > 4", checked: true, rating: "5", type: "Inactive" },
               { id: Math.random(), name: "$Tracks.pt() > 1", checked: true, rating: "2", type: "Inactive" },
               { id: Math.random(), name: "", checked: false, rating: "0", type: "Inactive" },
            ];
   
   
            let hltArr = [
               { id: Math.random(), trigger: "HTL", name: "HLT_mu9", checked: true, rating: "5", type: "Inactive" },
   
            ];

            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({ modelData: aData, hltData: hltArr });
this.filterDialog.setModel(oModel);
         this.filterDialog.open();
      },

      makeFilterDialog: function () {


         var aColumns = [
            new sap.m.Column({
               header: new sap.m.Label({
                  text: "Expression"
               })
            }),
            new sap.m.Column({
               hAlign: "Center",
               header: new sap.m.Label({
                  text: "Active"
               })
            }),
            new sap.m.Column({
               header: new sap.m.Label({
                  text: "Pass"
               })
            })
         ];

         var oTemplate = new sap.m.ColumnListItem({
            vAlign: "Middle",
            type: "{type}",
            cells: [
               new sap.m.Input({
                  value: "{name}",
                  wrapping: false
               }),
               new sap.m.CheckBox({
                  selected: "{checked}"
               }),
               new sap.m.Label({
                  text: "{rating}"
               })
            ]
         });

         var oTable = new sap.m.Table({
            growing: true,
            growingThreshold: 7,
            mode: sap.m.ListMode.Delete,
            growingScrollToLoad: true,
            columns: aColumns,
            "delete": function (oEvent) {
               var oItem = oEvent.getParameter("listItem");

               sap.m.MessageBox.confirm("Are you sure to delete this record?", {
                  onClose: function (sResult) {
                     if (sResult == sap.m.MessageBox.Action.CANCEL) {
                        return;
                     }

                     oTable.removeItem(oItem);
                     setTimeout(function () {
                        oTable.focus();
                     }, 0);
                  }
               });
            }
         });

       //  oTable.setModel(oModel);
         oTable.bindItems({
            path: "/modelData",
            template: oTemplate,
            key: "id"
         });

/*
         var oAddButton = new sap.m.Button({
            icon: "sap-icon://sys-add",
            press: function (oEvent) {
               let nv = { id: Math.random(), name: "", checked: true, rating: 0, type: "Inactive" }
               let data = oModel.getData();
               var aData = oModel.getProperty("/modelData");
               aData.push(nv);
               oModel.setProperty("/modelData", aData);
            }
         });*/
         /// ---------------------------------------------------------------------------------------

         var aHLTColumns = [
            new sap.m.Column({
               width: "160px",
               header: new sap.m.Label({
                  text: "Process"
               })
            }),
            new sap.m.Column({
               header: new sap.m.Label({
                  text: "Expression"
               })
            }),
            new sap.m.Column({
               header: new sap.m.Label({
                  text: "Active"
               })
            }),
            new sap.m.Column({
               width: "100px",
               header: new sap.m.Label({
                  text: "Pass"
               })
            }),
         ];


         var oHLTTemplate = new sap.m.ColumnListItem({
            type: "{type}",
            detailPress: function () {
               setTimeout(function () {
                  sap.m.MessageToast.show("detail is pressed");
               }, 10);
            },
            cells: [
               new sap.m.ComboBox({
                  width: "150px",
                  items: [
                     {
                        "key": "RECO",
                        "text": "RECO"
                     },
                     {
                        "key": "SIM",
                        "text": "SIM"
                     },
                     {
                        "key": "HLT",
                        "text": "HLT"
                     }],
                  selectedKey: "HLT"
               }),
               new sap.m.Input({
                  value: "{name}",
                  wrapping: false
               }),
               new sap.m.CheckBox({
                  selected: "{checked}"
               }),
               new sap.m.Label({
                  text: "{rating}"
               })
            ]
         });

         let oHLTTable = new sap.m.Table({
            growing: true,
            growingScrollToLoad: true,
            mode:sap.m.ListMode.Delete,
            columns: aHLTColumns,
         });

        // oHLTTable.setModel(oModel);
         oHLTTable.bindItems({
            path: "/hltData",
            mode: sap.m.ListMode.None,
            template: oHLTTemplate,
            key: "id"
         });

         /*
         var oHLTAddButton = new sap.m.Button({
            icon: "sap-icon://sys-add",
            press: function (oEvent) {
               let nv = { process: "HLT", name: "", checked: true, rating: 0, type: "Inactive" }
               let data = oModel.getData();
               var aData = oModel.getProperty("/hltData");
               aData.push(nv);
               oModel.setProperty("/hltData", aData);
            }
         });*/

         //--------------------------------------------------------
         let p1 = new sap.m.Panel( {
            headerText: "Event Filters",
            content: [
               oTable, oAddButton
            ]
         });

         let p2 = new sap.m.Panel({
            headerText: "HLT Filters",
            content: [
               oHLTTable, oHLTAddButton
            ]
         });

         let pthis = this;
         this.filterDialog = new sap.m.Dialog("filterTable", {
            beginButton: new sap.m.Button('simpleDialogAcceptButton', { text: "Apply" }),
            endButton: new sap.m.Button('simpleDialogCancelButton', { text: "Cancel", press: function () { pthis.filterDialog.close(); } }),
            content: [p1, p2]
         }
         );
         this.filterDialog.addStyleClass("sapUiSizeCompact");
      }
   });
});
