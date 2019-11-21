sap.ui.define(['rootui5/eve7/controller/Summary.controller',
               'rootui5/eve7/lib/EveManager'
], function(SummaryController, EveManager) {
   "use strict";    

   return SummaryController.extend("custom.MyNewSummary", {                    

      onInit: function() {
                       SummaryController.prototype.onInit.apply(this, arguments);
         this.expandLevel = 1;
      },
      event: function(lst) {
         SummaryController.prototype.event( lst);
          oTree.expandToLevel(0);
      },
      /*
      createSummaryModel: function(tgt, src) {
         if (tgt === undefined) {
            tgt = [];
            src = this.mgr.childs[0].childs[2].childs;
            console.log('original model', src);
            for (var i = 0; i < src.length; i++) {
               if (src[i].fName == "Collections") {
                  src = src[i].childs;
                  console.log("got ", src);
               }
            }
         }
         for (var n=0;n<src.length;++n) {
            var elem = src[n];

            var newelem = { fName: elem.fName, id: elem.fElementId, fHighlight: "None", fBackground: "" };

            if (this.canEdit(elem))
               newelem.fType = "DetailAndActive";
            else
               newelem.fType = "Active";

            newelem.masterid = elem.fMasterId || elem.fElementId;

            tgt.push(newelem);
            if ((elem.childs !== undefined) && this.anyVisible(elem.childs))
               newelem.childs = this.createSummaryModel([], elem.childs);
         }

         return tgt;
      },
*/
      addCollection: function (evt){
         alert("add collection");
      }
   });
});
