/**
 * Created by Yali on 2/9/17.
 */

// Updated model for calculating document weight and links, and entity weights.

// a weighting vector is applied to each dimension for creating
// Every time the weighting vector changed, changing the M and K


// Once the updated weight vector is computed, the model updates the spring strengths and document masses,
// and the layout iterates until settling again.
var Model;

(function () {

    var docs,
        modelType,
        entityWeightVector; // dictionary

    // entities
    // searches


    // init entityWeightVector;

    Model = function (x) {

        docs = x;
        initModel();

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


        // With expressive movements, users are able to inform the system that the weighting vector should be
        // updated to reflect a change in similarity between two (or more) documents.
        // For example, when placing two documents closer together, the system determines the similarity between
        // those two documents, and increases the weight on the corresponding entities.
        // As a result, a new layout is incrementally generated reflecting the new similarity weighting,
        // where those two documents (as well as others sharing similar entities) are closer together.
        model.documentOverlapping = function (docId1, docId2) {
            // Find entities
            console.log("in Document Overlapping");

            // Find shared entities

            // Update entity weights vector

            // Update model

        }


        // TODO
        model.documentMovement = function (x) {

        };

        // TODO
        model.textHighlighting = function () {

        };

        // TODO
        model.searchTerms = function () {

        };

        // TODO
        model.annotation = function () {

        };


        // TODO
        model.undo = function () {

        };

        return model;
    };


    // If the docs is loaded, init the model: entityWeightVector
    function initModel() {

    }


    // When the entities weight updated, update the mass and spring of docs.
    function updateMode() {

    }

})();

