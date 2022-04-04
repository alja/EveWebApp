sap.ui.define(['rootui5/eve7/controller/test.controller',
               'rootui5/eve7/lib/EveManager',
               "sap/ui/model/json/JSONModel",
               "sap/m/Table",
               "sap/m/Column",
               "sap/m/Text",
	       "sap/m/ColumnListItem",
	       "sap/ui/model/Sorter",
   "rootui5/eve7/controller/Ged.controller"
              ], function(testController, EveManager, JSONModel, Table, Column, Text,ColumnListItem, Sorter, GedController) {
   "use strict";

   return testController.extend("test", {

      onInit: function() {
          console.log("test controller");
      },

      setManager: function(mgr) {
          console.log("test controller ", mgr);
      }
    }
