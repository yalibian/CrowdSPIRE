/**
 * Created by Yali on 2/11/17.
 */

// Generate a JSON file 'docs.js', a object include
// docs.nodes:  Arrays includes nodes(id, text, html, mass, entities())
// docs.links:  Arrays includes links(source, target, similarity, entities)
// docs.entities:  Dictionary entities (name, weight, alias)
// Based on basic JSON file "docs.json"

var fs = require('fs');
var data = JSON.parse(fs.readFileSync('./crescent/docs.json'));

var entities = {};

var count = 0;
data.nodes.forEach(function(d){
    d.entities.forEach(function (e) {
        if(!entities.hasOwnProperty(e.name)){
            var ee = JSON.parse(JSON.stringify(e));
            ee.weight = ee.value;
            ee.weight = 1.0;
            delete ee.count;
            delete ee.value;

            delete e.alias;
            delete e.type;

            count ++;
            entities[e.name] = ee;
        }
    });
});

console.log(count);

var entityLength = Object.keys(entities).length;


for(var propertyName in entities) {
    console.log(propertyName);
    entities[propertyName].weight /= entityLength;
    console.log(entities[propertyName].weight);
}




function cosineDistance(doc1, doc2, entities) {

    var distance = 0.0;
    var len1 = 0.0;
    var len2 = 0.0;

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

    return distance/(len1 * len2);
}

// change strength based on initial tf-idf values
data.links.forEach(function (l) {

    console.log('--------Link---------');
    console.log(l.source);
    console.log(l.target);
    data.nodes.filter();
    e.strength = cosineDistance(e.source, e.target, entities);

    l.entities.forEach(function (e) {
        l.strength += entities[e].weight;
    });

});


data.nodes.forEach(function (n) {
    n.mass = n.entities.length;
    n.entities.forEach(function (e) {
        n.mass += entities[e.name].weight;
    });
});


data.documents = data.nodes;
delete data.nodes;
data.entities = entities;
data.edges = data.links;
delete data.links;

fs.writeFile('./crescent/crescent.json', JSON.stringify(data, null, 2), 'utf-8');