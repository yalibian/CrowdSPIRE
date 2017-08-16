/**
 * Created by Yali on 3/2/17.
 */
// Key idea is: mapping docs and entities --> nodes and links

import {Record} from 'immutable';
import {softSimilarity, cosineSimilarity} from '../utilities';
import {preprocess} from './preprocess';
import * as ATL from '../data/AtlanticStorm.json';

import {
    INIT_VIS,
    SEARCH_TERMS,
    HIGHLIGHT_TEXT,
    MOVE_DOCUMENT,
    OPEN_DOCUMENT,
    OVERLAP_DOCUMENTS,
    CLUSTER_DOCUMENTS,
    ANNOTATE_DOCUMENT,
    PIN_DOCUMENT,
    MOVEMENT_MODE,
    UPDATE_LAYOUT,
    RESET_LAYOUT,
} from '../actions/actions';



const DOC = "DOCUMENT";
const ICON = "ICON";
const KEYWORD = "KEYWORD";
const ENTITY_K = 0.1; // Constant for update entity weight
const OPEN_DOCUMENT_K = 0.0015; // Constant for update entity weight
const KEYWORD_K = 0.5;
const SIMILARITY_THRESHOLD = 0.0;
let movementMode = 'exploratory';


// docs, entities --> nodes, links: used to control force directed graph
let {docs, entities} = preprocess(ATL); // real docs

let nodes = [];
docs.forEach(function (d) {
    let node = {id: d.id, type: ICON, content: d.text};
    // node.entities = d.entities;
    node.mass = d.entities.reduce(function (acc, e) {
        return acc + entities[e.name].weight * e.TF_IDF;
    }, 0);

    nodes.push(node);
});

// Calculate links based on updated nodes
let links = linker(nodes);

const InitialState = Record({
    isFetching: false,
    nodes: nodes,
    links: links,
    interaction: INIT_VIS,
    movementMode: movementMode,
});


// Record moved documents, through document id, and current moved position(x, y).
// We only stored the moved to position, which means we calculate their relationships based on their relative positions.
// If they are in the same group or not.
let movedDocuments=[];


// Transform data into nodes and links, the nodes includes (keywords and docs, links include their links between nodes.)
const initialState = new InitialState;
export default function model(state = initialState, action) {
    switch (action.type) {

        case SEARCH_TERMS: {

            // Add keywords into nodes, update new links
            // Use model to change the backend data

            // Update nodes and links
            // convert documents into nodes
            const keywords = action.keywords;
            nodes = [];
            docs.forEach(function (d) {

                if (d.entities.find(function (e) {
                        return keywords.find(function (key) {
                            return key === e.name;
                        });
                    })) {

                    let node = {id: d.id, type: ICON, content: d.text};
                    node.mass = d.entities.reduce(function (acc, e) {
                        return acc + entities[e.name].weight * e.value;
                    }, 0);

                    nodes.push(node);
                }
            });

            keywords.forEach(function (word) {

                let node = {id: word, type: KEYWORD};
                if (entities.hasOwnProperty(word)) {
                    node.mass = entities[word].weight;
                } else {
                    node.mass = 1;
                }

                nodes.push(node);
            });

            links = linker(nodes);

            return state.withMutations((ctx) => {
                ctx.set('nodes', nodes)
                    .set('links', links);
            });
        }

        case HIGHLIGHT_TEXT: {

            // update links strength
            return state.withMutations((ctx) => {
                ctx.set('nodes', nodes)
                    .set('links', links);
            });
        }
        case MOVEMENT_MODE: {
            return state.withMutations((ctx) => {
                ctx.set('movementMode', action.mode);
            })
        }

        case MOVE_DOCUMENT: {
            let doc = action.doc;
            console.log(doc);
            movedDocuments.push(doc);

            return state;
            // return state.withMutations((ctx) => {
            //     ctx.set('nodes', nodes)
            //         .set('links', links);
            // });
        }

        case OPEN_DOCUMENT: {
            console.log('model: OPEN_DOCUMENT');
            let docId = action.docId;
            nodes.forEach(function (n) {
                if (n.id === docId) {
                    n.type = DOC;
                }
            });

            let sharedEntities = docs.find(function (d) {
                return d.id === docId;
            }).entities;

            let decK = 0.0; // count how many entities updated
            let count = sharedEntities.length; // count how many entities updated
            sharedEntities.forEach(function (e) {
                let entity = entities[e.name];
                let d1 = entity.weight;
                entity.weight = Math.min(1, entity.weight + OPEN_DOCUMENT_K);
                entity.update = true;
                decK += entity.weight - d1;
            });

            // Update links, only links
            let keys = Object.keys(entities);
            decK = decK / count;
            for (let i in keys) {
                let e = entities[keys[i]];
                if (!sharedEntities.find(function (se) {
                        return se.name === e.name;
                    })) {
                    e.weight -= decK;
                }
            }

            // nodes mass changed too!
            nodes.forEach(function (n) {
                let d;
                if (d = docs.find(function (d) {
                        return d.id === n.id;
                    })) {
                    n.mass = d.entities.reduce(function (acc, e) {
                        return acc + entities[e.name].weight * e.value;
                    }, 0);
                }
            });

            links = linker(nodes);
            return state.withMutations((ctx) => {
                ctx.set('nodes', nodes)
                    .set('links', links);
            });
        }

        case OVERLAP_DOCUMENTS: {
            console.log("model: OVERLAP_DOCUMENTS");
            // action.docList: a list of document ids

            let docId1 = action.docList[0];
            let docId2 = action.docList[1];
            let doc1 = docs.find(function (d) {
                return d.id === docId1;
            });
            let doc2 = docs.find(function (d) {
                return d.id === docId2;
            });

            let sharedEntities = [];
            let count = 0; // count how many entities updated
            let decK = 0.0; // count how many entities updated
            doc1.entities.forEach(function (e1) {
                doc2.entities.forEach(function (e2) {
                    if (e1.name === e2.name) {
                        sharedEntities.push(e1.name);
                        entities[e1.name].weight += ENTITY_K;
                        decK += ENTITY_K;
                        count++;
                        entities[e1.name].update = true;
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


            let filteredDocs = docs.filter(function (d) {
                let hasSharedEntities = false;
                d.entities.forEach(function (e) {
                    if (sharedEntities.find(function (se) {
                            return se === e.name
                        })) {
                        hasSharedEntities = true;
                    }
                });
                return hasSharedEntities;
            });


            // Update nodes based on filteredDocs, and current nodes
            filteredDocs.forEach(function (d) {
                if (!nodes.find(function (n) {
                        return n.id === d.id;
                    })) {
                    let node = {};
                    node.id = d.id;
                    node.type = ICON;
                    node.content = d.text;
                    node.mass = d.entities.reduce(function (acc, e) {
                        return acc + entities[e.name].weight * e.value;
                    }, 0);

                    nodes.push(node);
                }
            });

            links = linker(nodes);

            return state.withMutations((ctx) => {
                ctx.set('nodes', nodes)
                    .set('links', links);
            });
        }

        case CLUSTER_DOCUMENTS: {
            // change distance between documents
            return state.withMutations((ctx) => {
                ctx.set('nodes', nodes)
                    .set('links', links);
            });
        }

        case ANNOTATE_DOCUMENT: {

            return state.withMutations((ctx) => {
                ctx.set('nodes', nodes)
                    .set('links', links);
            });
        }

        case UPDATE_LAYOUT:{
            console.log('Update Layout based on movedDocuments');
            console.log(movedDocuments);

            return state.withMutations((ctx) => {
                ctx.set('nodes', nodes)
                    .set('links', links)
                    .set('interaction', UPDATE_LAYOUT);
            });
        }
        case RESET_LAYOUT:{

            return state.withMutations((ctx) => {
                ctx.set('nodes', nodes)
                    .set('links', links)
                    .set('interaction', RESET_LAYOUT);
            });
        }

        case PIN_DOCUMENT: {

            return state.withMutations((ctx) => {
                ctx.set('nodes', nodes)
                    .set('links', links);
            });
        }
        default:
            return state;
    }
}


// nodeSimilarity: calculate the similarity between two node (in [document, icon, keyword])
// If two documents, two could call cosineSimilarity/softSimilarity
// If two keywords, we could call crowd
// If one document and one keyword, we could calculate directly
function nodeSimilarity(node1, node2) {
    // In nodeSimilarity
    if ((node1.type !== KEYWORD) && (node2.type !== KEYWORD)) {
        const doc1 = docs.find(function (doc) {
            return doc.id === node1.id;
        });

        const doc2 = docs.find(function (doc) {
            return doc.id === node2.id;
        });

        return cosineSimilarity(doc1, doc2, entities);
    } else if (node1.type === KEYWORD && node2.type === KEYWORD) {
        // No example right now.
    } else {
        if (node1.type === KEYWORD) {
            let temp = node1;
            node1 = node2;
            node2 = temp;
        }

        const doc = docs.find(function (doc) {
            return doc.id === node1.id;
        });


        const keyword = node2.id;

        if (doc.entities.find(function (e) {
                return e.name === keyword;
            })) {
            return KEYWORD_K;
        }
        return 0;
    }
}

// return shared entities on two nodes
function sharedEntities(node1, node2) {

    let shared = [];
    if ((node1.type !== KEYWORD) && (node2.type !== KEYWORD)) {
        const doc1 = docs.find(function (doc) {
            return doc.id === node1.id;
        });

        const doc2 = docs.find(function (doc) {
            return doc.id === node2.id;
        });

        doc1.entities.forEach(function (e1) {
            doc2.entities.forEach(function (e2) {
                if (e1.name === e2.name) {
                    shared.push(e1.name);
                }
            });
        });

    } else if (node1.type === KEYWORD && node2.type === KEYWORD) {
        // No example right now.

    } else {

        if (node1.type === KEYWORD) {
            let temp = node1;
            node1 = node2;
            node2 = temp;
        }
        const doc = docs.find(function (doc) {
            return doc.id === node1.id;
        });

        const keyword = node2.id;

        if (doc.entities.find(function (e) {
                return e.name === keyword;
            })) {
            shared.push(keyword);
        }
    }
    return shared;
}

// Generate links based on input nodes
function linker(nodes) {
    let links = [];
    let len = nodes.length;
    for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
            let sim = nodeSimilarity(nodes[i], nodes[j]);
            if (sim > SIMILARITY_THRESHOLD) {
                let link = {source: nodes[i].id, target: nodes[j].id};
                link.strength = sim;
                link.shared = sharedEntities(nodes[i], nodes[j]);
                links.push(link);
            }
        }
    }
    return links;
}

// When the entities weight updated, update the mass and spring of docs.
function updateMode() {

    // update mass:
    docs.forEach(function (d) {
        d.mass = d.entities.reduce(function (acc, e) {
            return acc + entities[e.name].weight * e.value;
        }, 0);
    });
}

