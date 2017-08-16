/**
 * Created by Yali on 4/19/17.
 */

// could transfer file(XML, JSON, jig) into JSON (nodes and links)
// Only support jig/XML file right now


function preprocess(Data) {
    return transform(Data.documents.document);
    
}

// Transfer original json file to standard json file
function transform(originalDocs) {
    
    let docs = [];
    let entities = {};
    for (let i in originalDocs) {
        let originalDoc = originalDocs[i];
        let doc = {
            id: originalDoc.docID,
            text: originalDoc.docText,
            source: originalDoc.docSource,
            date: originalDoc.docDate,
            entities: []
        };
        
        if (originalDoc.hasOwnProperty('place')) {
            let place = originalDoc.place;
            doc.entities.push();
            if (typeof place === 'string') {
                doc.entities.push({name: place, TF_IDF: 0, type: 'place'});
            } else {
                for (let j in place) {
                    doc.entities.push({name: place[j], TF_IDF: 0, type: 'place'});
                }
            }
        }
        
        if (originalDoc.hasOwnProperty('date')) {
            let date = originalDoc.date;
            if (typeof date === 'string') {
                doc.entities.push({name: date, TF_IDF: 0, type: 'date'});
            } else {
                for (let j in date) {
                    doc.entities.push({name: date[j], TF_IDF: 0, type: 'date'});
                }
            }
        }
        
        if (originalDoc.hasOwnProperty('organization')) {
            let organization = originalDoc.organization;
            if (typeof organization === 'string') {
                doc.entities.push({name: organization, TF_IDF: 0, type: 'organization'});
            } else {
                for (let j in organization) {
                    doc.entities.push({'name': organization[j], TF_IDF: 0, type: 'organization'});
                }
            }
        }
        
        if (originalDoc.hasOwnProperty('person')) {
            let person = originalDoc.person;
            if (typeof person === 'string') {
                doc.entities.push({name: person, TF_IDF: 0, type: 'person'});
            } else {
                for (let j in person) {
                    doc.entities.push({name: person[j], TF_IDF: 0, type: 'person'});
                }
            }
        }
        
        if (originalDoc.hasOwnProperty('money')) {
            let money = originalDoc.money;
            if (typeof money === 'string') {
                doc.entities.push({name: money, TF_IDF: 0, type: 'money'});
            } else {
                for (let j in money) {
                    doc.entities.push({name: money[j], TF_IDF: 0, type: 'money'});
                }
            }
        }
        
        // entity.weight used to represent the count of documents that include this entity.
        let len = doc.entities.length;
        for (let j in doc.entities) {
            doc.entities[j].TF_IDF = 1.0 / len;
            if (!entities.hasOwnProperty(doc.entities[j].name)) {
                let entity = {name: doc.entities[j].name, type: doc.entities[j].type, weight: 1};
                entities[entity.name] = entity;
            } else {
                entities[doc.entities[j].name].weight++;
            }
        }
        
        docs.push(doc);
    }
    
    let lenDocs = docs.length;
    for (let i in docs) {
        let doc = docs[i];
        for (let j in doc.entities) {
            let entity = doc.entities[j];
            entity.TF_IDF = entity.TF_IDF * Math.log(lenDocs / (entities[entity.name].weight))
        }
    }
    
    // The default weight of each entity is 1
    for (let key in entities) {
        entities[key].weight = 1;
    }
    
    return {docs, entities};
}

export {preprocess}
