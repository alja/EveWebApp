sap.ui.define(['rootui5/eve7/controller/Summary.controller',
               'rootui5/eve7/lib/EveManager',
               "sap/ui/model/json/JSONModel",
               "sap/m/Table",
               "sap/m/Column",
               "sap/m/Text",
	       "sap/m/ColumnListItem",
	       "sap/ui/model/Sorter",
		   "sap/ui/layout/SplitterLayoutData",
   "rootui5/eve7/controller/Ged.controller",
   "sap/ui/core/mvc/XMLView"
              ], function(SummaryController, EveManager, JSONModel, Table, Column, Text,ColumnListItem, Sorter,SplitterLayoutData, GedController, XMLView) {
   "use strict";

   return SummaryController.extend("custom.MyNewSummary", {

      onInit: function() {
         SummaryController.prototype.onInit.apply(this, arguments);
         this.expandLevel = 0;
      },

      event: function(lst) {
         SummaryController.prototype.event(lst);
         oTree.expandToLevel(0);
      },

      createModel: function() {
         // this is central method now to create summary model
         // one could select top main element which will be shown in SummaryView

         this.summaryElements = {};

         var src = this.mgr.childs[0].childs[2].childs;

		 let tgt = [];

		  for (var i = 0; i < src.length; i++) {
			  if (src[i].fName == "Collections") {
				  let x  = src[i].childs;
				  this.createSummaryModel(tgt, x, "/");
			  }
			  if (src[i].fName == "Associations") {
				  let x = src[i].childs;
				 return this.createSummaryModel(tgt, x, "/");
			  }
		  }

       //  return this.createSummaryModel([], src, "/");
      },


      showGedEditor: function(elementId) {

		var sumSplitter = this.byId("sumSplitter");

		if (!this.ged) {
		   var pthis = this;

		   XMLView.create({
			  viewName: "rootui5.eve7.view.Ged",
			  layoutData: new SplitterLayoutData("sld", {size: "30%"}),
			  height: "100%"
		   }).then(function(oView) {
			  pthis.ged = oView;
			  pthis.ged.getController().setManager(pthis.mgr);
			  pthis.ged.getController().buildFWAssociationSetter = function(el)
			  {
				this.makeBoolSetter(el.fRnrSelf, "xxx");
				this.makeStringSetter(el.fFilterExpr, "Filter", "SetFilterExpr");
			  };


			  pthis.ged.getController().showGedEditor(sumSplitter, elementId);

		   });
		} else {
		   this.ged.getController().showGedEditor(sumSplitter, elementId);
		}
	   },


	   addCollection: function (evt) {
		   if (this.acGUI) {
			   this.acGUI.open();
		   }
		   else {
			   let pthis = this;
			   XMLView.create({
				   viewName: "custom.view.AddCollection",
			   }).then(function (oView) {
				   pthis.acGUI = oView.getController().dialog;
				   pthis.acGUI.open();
			   });
		   }
	   }
   });
});
