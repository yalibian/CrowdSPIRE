/**
 * Created by Yali on 2/9/17.
 */
// Crowdsourcing Based Update Model, Yet another way to calculate TF-IDF
// which not only include the weighted weighted but also related things.

let Model;

(function () {


  // Calculate the distance between two documents based on entity weights

// The normalization must also be weighted. For vectors u and v,
// with weight vector w, the weighted cosine is
// (sum w[i]*u[i]*v[i]) / sqrt[(sum w[i]*u[i]^2)*(sum w[i]*v[i]^2)].
// 余弦值越接近1，就表明夹角越接近0度，也就是两个向量越相似，这就叫"余弦相似性"
  function cosineSimilarity(doc1, doc2, entities) {

    let distance = 0.0;
    let len1 = 0.0;
    let len2 = 0.0;

    doc1.entities.forEach(function (e1) {

      len1 += e1.value * e1.value * entities[e1.name].weight;
      doc2.entities.forEach(function (e2) {
        len2 += e2.value * e2.value * entities[e2.name].weight;
        if (e1.name == e2.name) {
          distance += e1.value * e2.value * entities[e1.name].weight;
        }
      });

    });

    len1 = Math.sqrt(len1);
    len2 = Math.sqrt(len2);

    return distance / (len1 * len2);
  }

// Update similarity based on soft similarity
  function softSimilarity(doc1, doc2, entities, crowd) {

    let distance = 0.0;
    let len1 = 0.0;
    let len2 = 0.0;

    doc1.entities.forEach(function (e1) {
      len1 += e1.value * e1.value * entities[e1.name].weight;
      doc2.entities.forEach(function (e2) {
        len2 += e2.value * e2.value * entities[e2.name].weight;
        if (e1.name == e2.name) {
          distance += e1.value * e2.value * entities[e1.name].weight;
        } else {
          crowd.links.forEach(function (c) {
            if ((c.target == e1.name && c.source == e2.name) || (c.target == e2.name && c.source == e2.name)) {
              distance += c.votes / 275 * entities[e1.name].weight * entities[e2.name].weight * e1.value * e2.value * 125;
            }
          })
        }
      });
    });

    len1 = Math.sqrt(len1);
    len2 = Math.sqrt(len2);

    return distance / (len1 * len2);
  }


  let data,
    documents,
    edges,
    modelType,
    entities,
    crowd,
    // K = 0.05, // Constant for update entity weight
    K = 0.1, // Constant for update entity weight
    searches;

  // init entityWeightVector;

  Model = function (x) {

    data = x;
    documents = data.documents;
    edges = data.edges;
    entities = data.entities;

    let keys = Object.keys(entities);
    for (let i in keys) {
      entities[keys[i]].update = false;
    }

    initModel();
    let model = {};

    // real function used to update Mass and Spring K
    model.data = function (x) {
      if (!arguments.length) {
        return data;
      }
      data = x;
      documents = data.documents;
      edges = data.edges;
      entities = data.entities;

      return model;
    };


    // Used for Crowdsourcing update
    model.crowd = function (x) {
      if (!arguments.length) {
        return data;
      }
      crowd = x;

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

    model.entities = function (x) {
      if (!arguments.length) {
        return entities;
      }
      entities = x;
      return model;
    };

    model.documents = function (x) {
      if (!arguments.length) {
        return documents;
      }
      documents = x;
      return model;
    };

    model.edges = function (x) {
      if (!arguments.length) {
        return edges;
      }
      edges = x;
      return model;
    };


    // With expressive movements, users are able to inform the system that the weighting vector should be
    // updated to reflect a change in similarity between two (or more) documents.
    // For example, when placing two documents closer together, the system determines the similarity between
    // those two documents, and increases the weight on the corresponding entities.
    // As a result, a new layout is incrementally generated reflecting the new similarity weighting,
    // where those two documents (as well as others sharing similar entities) are closer together.
    // Update entity weight based on documents and crowd data
    model.documentOverlapping = function (docId1, docId2) {
      // Find entities

      let doc1 = documents.find(function (d) {
        return d.id == docId1;
      });

      let doc2 = documents.find(function (d) {
        return d.id == docId2;
      });

      let count = 0; // count how many entities updated
      let decK = 0.0; // count how many entities updated
      doc1.entities.forEach(function (e1) {
        doc2.entities.forEach(function (e2) {
          if (e1.name == e2.name) {
            console.log(entities[e1.name].weight);
            entities[e1.name].weight += K;
            decK += K;
            count++;
            entities[e1.name].update = true;
          } else {
            crowd.links.forEach(function (c) {
              if ((c.target == e1.name && c.source == e2.name) || (c.target == e2.name && c.source == e2.name)) {
                entities[e1.name].weight += K * c.votes / 275;
                entities[e1.name].update = true;
                entities[e2.name].weight += K * c.votes / 275;
                entities[e2.name].update = true;
                decK += K * c.votes / 275 * 2;
                count += 2;
              }
            })
          }
        });
      });

      let keys = Object.keys(entities);
      decK = decK / (keys.length - count);
      for (let i in keys) {
        let e = entities[keys[i]];
        if (e.update) {
          e.weight = Math.min(1, e.weight);
          e.update = false;
        } else {
          e.weight -= decK;
          e.weight = Math.max(0.00, e.weight);
        }
      }

      // Update whole mass and strength of spring.
      updateMode();
    };

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

    // init documents mass
    // update mass
    documents.forEach(function (d) {
      d.mass = d.entities.reduce(function (acc, e) {
        return acc + entities[e.name].weight * e.value;
      }, 0);
    });

    // init edges
    edges.forEach(function (e) {

      let d1 = documents.find(function (d) {
        return d.id == e.source;
      });

      e.strength = cosineSimilarity(documents.find(function (d) {
        return d.id == e.source;
      }), documents.find(function (d) {
        return d.id == e.target;
      }), entities);
      // edges.strength = cosineDistance(e.source, e.target, entities);
    });

  }


  // When the entities weight updated, update the mass and spring of docs.
  function updateMode() {

    // update mass:
    documents.forEach(function (d) {
      d.mass = d.entities.reduce(function (acc, e) {
        return acc + entities[e.name].weight * e.value;
      }, 0);
    });

    // weighted sum model, to calculate the similarity
    // update edges, based on Crowdsourcing
    edges.forEach(function (e) {
      // e.strength = cosineSimilarity(e.source, e.target, entities);
      e.strength = softSimilarity(e.source, e.target, entities, crowd);
      if (isNaN(e.strength)) {
        e.strength = 0.005;
        console.log(e);
      }
    });

    console.log(edges);
    console.log(entities);
  }
})();


export default Model;
