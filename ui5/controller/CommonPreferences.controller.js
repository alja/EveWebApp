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

            this.mgr = this.getView().getViewData().mgr;

            this.getView().setModel(model);
            var pthis = this;
            model.attachPropertyChange(function (oEvent) {
                console.log("Scale changed event ", oEvent);

                this.getView().setModel(model);
                let fd = pthis.getView().getModel().getData();
                let cont = JSON.stringify(fd);
                //let xxx = btoa(cont);
                let xxx = "test";
                let cmd = "ScaleChanged(\"" + xxx + "\")";
                console.log("BLABLA [cmd = ]", cmd)
                pthis.mgr.SendMIR(cmd, pthis.fw2gui.fElementId, "EventManager");

            }, this);


        },


        setGUIElement: function(gui) {
            console.log("Event Filter FW2GUI ", gui);
            this.fw2gui = gui;
        },
        openPrefDialog: function (wId) {
            //this.byId("prefDialog").open();
            this.byId("prefDialog").openBy(wId);
        }

    });


    return CommonPreferenceController;

});
