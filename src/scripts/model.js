/**
 * Created by Yali on 2/9/17.
 */

// Updated model for calculating document weight and links, and entity weights.

// a weighting vector is applied to each dimension for creating
// Every time the weighting vector changed, changing the M and K

var Model;

(function () {

    var docs,
        modelType,
        entityWeightVector;

    Model = function (x) {

        docs = x;
        // real function used to update Mass and Spring K
        function model(docs) {

        }

        model.docs = function (X) {
            if (!arguments.length) {
                return docs;
            }
            return model;
        };

        // Changing DIMENSION REDUCTION MODELS FOR SEMANTIC INTERACTION
        model.modelType = function (x) {
            if (!arguments.length) {
                return modelType;
            }
            modelType = x;
            return model;
        };

        model.entityWeightVector = function (x) {
            if (!arguments.length) {
                return entityWeightVector;
            }
            entityWeightVector = x;
            return model;
        };

        model.documentMovement = function (x) {

        };

        model.textHighlighting = function () {

        };

        model.searchTerms = function () {

        };

        model.annotation = function () {

        };

        model.undo = function () {

        };

        return model;
    };

})();

