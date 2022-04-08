sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Sorter",
    "sap/m/Column",
    "sap/m/Button",
    "sap/m/Text"
], function (Controller, JSONModel, Sorter, Column, Button, Text) {
    "use strict";



    var AddCollectionController = Controller.extend("custom.controller.AddCollection", {

        onInit: function () {
            let oModel = new sap.ui.model.json.JSONModel();
            // set the data for the model
            oModel.setData(this.getView().getViewData());
            this.getView().setModel(oModel);

            let cTable = this.makeTable("ctable", "/names");
           // this.getView().byId("ctab").addContent(cTable);

           let aTable = this.makeTable("atable", "/friends");
            //this.getView().byId("atab").addContent(aTable);
            this.getView().byId("atab").setCount(12);
            this.getView().setModel(oModel);

            this.dialog = this.getView().byId("acdialog");

            let pthis = this;
            let beginButton = new sap.m.Button('simpleDialogAcceptButton', { text: "AddEntry", press: function () { pthis.addCollection(); } });
            let endButton = new sap.m.Button('simpleDialogCancelButton', { text: "Cancel", press: function () { pthis.close(); } });

            this.dialog.setEndButton(endButton);
            this.dialog.setBeginButton(beginButton);

        },

        onFilterPost: function (oEvent) {
            var txt = oEvent.getParameter("query");
            let filter = new sap.ui.model.Filter([new sap.ui.model.Filter("firstName", sap.ui.model.FilterOperator.Contains, txt), new sap.ui.model.Filter("lastName", sap.ui.model.FilterOperator.Contains, txt)], false);
            this.getTable().getBinding("items").filter(filter, "Applications");
        },

        getTable: function()
        {
            let tt = this.getView().byId("ttab");
            let si = tt.key();
            let t = this.getView().byId(si);
            return t.getContent()[1];
        },

        makeTable: function (idn, dpath) {
/*
            var oTable = new sap.m.Table( {
                mode: "SingleSelect",
                columns: [
                    new sap.m.Column({ header: new Text({ text: "First Name" }) }),
                    new sap.m.Column({ header: new Text({ text: "Lasr Name" }) })
                ]
            });
*/ var oTable = this.getView().byId(idn);

            oTable.setIncludeItemInSelection(true);
            oTable.bActiveHeaders = true;

            oTable.attachEvent("columnPress", function (evt) {
                var col = evt.getParameters().column;
                let descend = false;
                let ch = this.getColumns()[col._index];
                let ar = ["firstName", "lastName"];

                // init first time ascend
                if (col.getSortIndicator() == sap.ui.core.SortOrder.Descending || col.getSortIndicator() == sap.ui.core.SortOrder.None) {
                    descend = true;
                }
                else {
                    descend = false;
                }
                // flip the state
                descend = !descend;
                var oSorter = new Sorter(ar[col._index - 1], descend);
                var oItems = this.getBinding("items");
                oItems.sort(oSorter);

                var indicator = descend ? sap.ui.core.SortOrder.Descending : sap.ui.core.SortOrder.Ascending;
                col.setSortIndicator(indicator);
            });

            oTable.bindItems({
                path: dpath,
                template: new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Text({ text: "{firstName}" }),
                        new sap.m.Text({ text: "{lastName}" })
                    ]
                })
            });
            oTable.addStyleClass("sapUiSizeCompact");
            return oTable;
        },

        addCollection: function () {
            let pt = this.getTable();
            var oSelectedItem = pt.getSelectedItems();
            var item1 = oSelectedItem[0];
            console.log("SELECT ", item1.getBindingContext().getObject());
        },

    });

    return AddCollectionController;

});
