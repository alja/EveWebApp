sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Button",
    "sap/m/Input",
    "sap/m/StepInput",
    "sap/m/CheckBox",
    "sap/m/Text",
    "sap/m/ColorPalettePopover",
    "sap/ui/layout/HorizontalLayout"
 ], function (Controller, JSONModel, Button, mInput, mStepInput, mCheckBox, mText, ColorPalettePopover, HorizontalLayout) {
    "use strict";



    var CommonPreferenceController = Controller.extend("custom.controller.EventFilter", {

        onInit: function () {


            let model = new sap.ui.model.json.JSONModel(
                { plotEt: true, mode: "auto", maxH: 5, valToH: 100 }
            );


            this.getView().setModel(model);
            let pthis = this;
            model.attachPropertyChange(function (oEvent) {
                console.log("Scale changed event ", oEvent);
            }, this);

        },

        openPrefDialog: function (wId) {
            //this.byId("prefDialog").open();
            this.byId("prefDialog").openBy(wId);
        }

    });


    return CommonPreferenceController;

});
