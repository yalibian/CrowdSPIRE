/**
 * Created by Yali on 1/28/17.
 */

var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('crescent.json'));

var docs = obj.documents;
var aliases = obj.aliases;

var newDocs = [];
for (var i in docs) {
    var doc = docs[i];
    var newDoc = {id: doc.docID, text: doc.docText, entities: []};

    var j;
    if (doc.hasOwnProperty('Person')) {
        var Person = doc.Person;
        newDoc.entities.push();
        if (typeof Person === 'string') {
            newDoc.entities.push({name: Person, value: 0, type: 'Person'});
        } else {
            for (j in Person) {
                newDoc.entities.push({name: Person[j], value: 0, type: 'Person'});
            }
        }
    }

    if (doc.hasOwnProperty('Location')) {
        var Location = doc.Location;
        if (typeof Location === 'string') {
            newDoc.entities.push({name: Location, value: 0, type: 'Location'});
        } else {
            for (j in Location) {
                newDoc.entities.push({name: Location[j], value: 0, type: 'Location'});
            }
        }
    }


    if (doc.hasOwnProperty('Organization')) {
        var Organization = doc.Organization;
        if (typeof Organization === 'string') {
            newDoc.entities.push({name: Organization, value: 0, type: 'Organization'});
        } else {
            for (j in Organization) {
                newDoc.entities.push({'name': Organization[j], value: 0, type: 'Organization'});
            }
        }
    }

    if (doc.hasOwnProperty('Money')) {
        var Money = doc.Person;
        if (typeof Money === 'string') {
            newDoc.entities.push({name: Money, value: 0, type: 'Money'});
        } else {
            for (j in Money) {
                newDoc.entities.push({name: Money[j], value: 0, type: 'Money'});
            }
        }
    }

    if (doc.hasOwnProperty('Misc')) {
        var Misc = doc.Misc;
        if (typeof Misc === 'string') {
            newDoc.entities.push({name: Misc, value: 0, type: 'Misc'});
        } else {
            for (j in Misc) {
                newDoc.entities.push({name: Misc[j], value: 0, type: 'Misc'});
            }
        }
    }

    if (doc.hasOwnProperty('Phone')) {
        var Phone = doc.Phone;
        if (typeof Phone === 'string') {
            newDoc.entities.push({name: Phone, value: 0, type: 'Phone'});
        } else {
            for (j in Phone) {
                newDoc.entities.push({name: Phone[j], value: 0, type: 'Phone'});
            }
        }
    }

    if (doc.hasOwnProperty('Interesting')) {
        var Interesting = doc.Interesting;
        if (typeof Interesting === 'string') {
            newDoc.entities.push({name: Interesting, value: 0, type: 'Interesting'});
        } else {
            for (j in Interesting) {
                newDoc.entities.push({'name': Interesting[j], value: 0, type: 'Interesting'});
            }
        }
    }

    if (doc.hasOwnProperty('Date')) {
        var Date = doc.Date;
        if (typeof Date === 'string') {
            newDoc.entities.push({name: Date, value: 0, type: 'Date'});
        } else {
            for (j in Date) {
                newDoc.entities.push({name: Date[j], value: 0, type: 'Date'});
            }
        }
    }
    newDocs.push(newDoc);
}

// Before the count, we insert alias into docs.
// Calculate mass, value of entities in each documents
for (i in newDocs) {
    var entities = newDocs[i].entities;
    var text = newDocs[i].text;
    for (j in entities) {
        var entity = entities[j];
        var name = entity.name;

        // insert alias
        entity.alias = [];
        for (k in aliases) {
            var alias = aliases[k];
            if (alias.name.hasOwnProperty(entity.type) && alias.name[entity.type] == name) {
                if (alias.alias instanceof Array) {
                    for (m in alias.alias) {
                        entity.alias.push(alias.alias[m][entity.type]);
                    }

                } else {
                    entity.alias.push(alias.alias[entity.type]);
                }
            }
        }

        var regExp = new RegExp(name, "gi");
        var count;
        if (entity.alias.length == 0) {
            count = (text.match(regExp) || []).length;
        } else if (entity.alias.length == 1) {
            if (entity.alias[0].includes(name)) {
                count = (text.match(name) || []).length;
            } else if (name.includes(entity.alias[0])) {
                count = (text.match(entity.alias[0]) || []).length;
            } else {
                count = (text.match(name) || []).length;
                count += (text.match(entity.alias[0]) || []).length;
            }
        } else {
            count = (text.match(name) || []).length;
            for (k in entity.alias) {
                count += (text.match(entity.alias[k]) || []).length;
            }
        }

        entity.count = count;
    }
}


for (i in newDocs) {
    var entities = newDocs[i].entities;
    var len = 0;
    for (j in entities) {
        len += entities[j].count;
    }

    for (j in entities) {
        var count = 0;
        var ii;
        for (ii in newDocs) {
            var jj;
            for (jj in newDocs[ii].entities) {
                if (newDocs[ii].entities[jj].name == entities[j].name) {
                    count++;
                }
            }
        }


        entities[j].value = (1.00 * Math.log(41 / count) * entities[j].count / len);
    }

    newDocs[i].mass = entities.length;
    // console.log(newDocs[i]);
}

// write docs into nodes
fs.writeFile('./nodes.json', JSON.stringify(newDocs, null, 2), 'utf-8');

// write relationships into links
var links = [];

for (var i = 0; i< newDocs.length; i++) {
    var doc1 = newDocs[i];
    for (j = i + 1; j < newDocs.length; j ++) {
        var doc2 = newDocs[j];
        console.log(j);
        console.log(newDocs[0]);
        // entities
        if (i != j) {
            var len1 = 0;
            var len2 = 0;
            var similarity = 0;
            var sharedEntities = [];

            // len1
            for (k in doc1.entities) {
                len1 += doc1.entities[k].value * doc1.entities[k].value;
            }

            for (k in doc2.entities) {
                len2 += doc2.entities[k].value * doc2.entities[k].value;
            }

            len1 = Math.sqrt(len1);
            len2 = Math.sqrt(len2);

            for (k1 in doc1.entities) {
                for (k2 in doc2.entities) {
                    if (doc1.entities[k1].name == doc2.entities[k2].name) {
                        similarity += doc1.entities[k1].value * doc2.entities[k2].value;
                        sharedEntities.push(doc1.entities[k1].name);
                    }
                }
            }

            similarity /= (len1 * len2);
        }
        if (similarity > 0) {

            var link = {source: doc1.id, target: doc2.id, similarity: similarity, entities: sharedEntities};
            links.push(link);
        }
    }
}

fs.writeFile('./links.json', JSON.stringify(links, null, 2), 'utf-8');
console.log(links);