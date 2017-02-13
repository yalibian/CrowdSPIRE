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
// console.log(Object.keys(data));

var entities = {};

data.nodes.forEach(function(d){
    d.entities.forEach(function (e) {
        if(!entities.hasOwnProperty(e.name)){
            var ee = JSON.parse(JSON.stringify(e));
            ee.weight = ee.value;
            delete ee.count;
            delete ee.value;

            delete e.alias;
            delete e.type;

            entities[e.name] = ee;
        }
    });
});

// console.log(Object.getOwnPropertyNames(entities));

// change strength based on initial tf-idf values
data.links.forEach(function (l) {
    l.strength = 0;
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

console.log(data.nodes[0]);
console.log(data.links[0]);
console.log(entities);

data.documents = data.nodes;
delete data.nodes;
data.entities = entities;
data.edges = data.links;
delete data.links;

fs.writeFile('./crescent/crescent3.json', JSON.stringify(data, null, 2), 'utf-8');