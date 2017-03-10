/**
 * Created by Yali on 3/2/17.
 */


import {Record} from 'immutable';
import {softSimilarity, cosineSimilarity} from '../utilities';

import {
    GET_DATA,
    SEARCH_TERMS,
    HIGHLIGHT_TEXT,
    MOVE_DOCUMENT,
    OPEN_DOCUMENT,
    CLUSTER_DOCUMENTS,
    ANNOTATE_DOCUMENT,
    PIN_DOCUMENT,
} from '../actions/actions';


const DOC = "DOCUMENT";
const ICON = "ICON";
const KEYWORD = "KEYWORD";
import * as data from './crescent.json';
import * as crowd from './crescent_crowd.json';

// nodeSimilarity: calculate the similarity between two node (in [document, icon, keyword])
// If two documents, two could call cosineSimilarity/softSimilarity
// If two keywords, we could call crowd
// If one document and one keyword, we could calculate directly
const KEYWORD_K = 0.5;
const nodeSimilarity = function (node1, node2) {
    // In nodeSimilarity
    if ((node1.type != KEYWORD) && (node2.type != KEYWORD)) {
        const doc1 = documents.find(function (doc) {
            return doc.id == node1.id;
        });
        
        const doc2 = documents.find(function (doc) {
            return doc.id == node2.id;
        });
        return cosineSimilarity(doc1, doc2, entities);
    } else if (node1.type == KEYWORD && node2.type == KEYWORD) {
        // No example right now.
    } else {
        if (node1.type == KEYWORD) {
            let temp = node1;
            node1 = node2;
            node2 = temp;
        }
        
        const doc = documents.find(function (doc) {
            // console.log(doc);
            return doc.id == node1.id;
        });
        
        // console.log(doc);
        const keyword = node2.id;
        if (doc.entities.indexOf(keyword) > -1) {
            return KEYWORD_K;
        }
        return 0;
    }
};

// return shared entities on two nodes
const sharedEntities = function (node1, node2) {
    
    let shared = [];
    if ((node1.type != KEYWORD) && (node2.type != KEYWORD)) {
        const doc1 = documents.find(function (doc) {
            return doc.id == node1.id;
        });
        
        const doc2 = documents.find(function (doc) {
            return doc.id == node2.id;
        });
    
        doc1.entities.forEach(function(e1) {
            doc2.entities.forEach(function (e2) {
                if(e1.name == e2.name){
                    shared.push(e1.name);
                }
            });
        });
        
    } else if (node1.type == KEYWORD && node2.type == KEYWORD) {
        // No example right now.
        
    } else {
        
        if (node1.type != DOC) {
            let temp = node1;
            node1 = node2;
            node2 = temp;
        }
        const doc = documents.find(function (doc) {
            return doc.id == node1.id;
        });
        
        const keyword = node2.id;
        
        if (doc.entities.indexOf(keyword) > -1) {
            shared.push(keyword);
        }
    }
    return shared;
};

// Generate links based on input nodes
const SIMILARITY_THRESHOLD = 0.0;
const linker = function (nodes) {
    let links = [];
    // check links between all two nodes
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
};

let documents, edges, entities; // real docs
documents = data.documents;
edges = data.edges;
entities = data.entities;
let nodes, links; // data to render on force directed graph
// convert documents into nodes
nodes = [];
documents.forEach(function (d) {
    let node = {};
    node.id = d.id;
    node.type = ICON;
    node.content = d.text;
    // node.entities = d.entities;
    node.mass = d.entities.reduce(function (acc, e) {
        return acc + entities[e.name].weight * e.value;
    }, 0);

    nodes.push(node);
});

// This update function will change anyway, since we need to calculate again and again.
// Calculate links based on updated nodes
links = linker(nodes);
//
const InitialState = Record({
    isFetching: false,
    nodes: nodes,
    links: links
});
//

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
            documents.forEach(function (d) {
                
                if (d.entities.find(function (e) {
                        return keywords.find(function (key) {
                            return key == e.name;
                        });
                    })) {
                    
                    let node = {};
                    node.id = d.id;
                    node.type = ICON;
                    node.entities = d.entities;
                    node.mass = d.entities.reduce(function (acc, e) {
                        return acc + entities[e.name].weight * e.value;
                    }, 0);
                    
                    nodes.push(node);
                }
            });
            
            keywords.forEach(function (word) {
                
                let node = {};
                node.id = word;
                node.type = KEYWORD;
                if (entities.hasOwnProperty(word)) {
                    node.mass = entities[word].weight;
                } else {
                    node.mass = 1;
                }
                
                nodes.push(node);
            });
            
            let links = linker(nodes);
            console.log(nodes);
            console.log(links);
            
            return state.withMutations((ctx) => {
                ctx.set('isFetching', false)
                    .set('nodes', nodes)
                    .set('links', links);
            });
        }
        
        case HIGHLIGHT_TEXT: {
            
            // update links strength
            return state.withMutations((ctx) => {
                ctx.set('isFetching', false)
                    .set('data', action.data)
                    .set('crowd', action.crowd);
            });
        }
        
        
        case MOVE_DOCUMENT: {
            return state.withMutations((ctx) => {
                ctx.set('isFetching', false)
                    .set('data', action.data)
                    .set('crowd', action.crowd);
            });
        }
        
        case OPEN_DOCUMENT: {
            // Update links
            return state.withMutations((ctx) => {
                ctx.set('isFetching', false)
                    .set('data', action.data)
                    .set('crowd', action.crowd);
            });
        }
        
        case CLUSTER_DOCUMENTS: {
            // change distance between documents
            return state.withMutations((ctx) => {
                ctx.set('isFetching', false)
                    .set('data', action.data)
                    .set('crowd', action.crowd);
            });
        }
        
        
        case ANNOTATE_DOCUMENT: {
            
            return state.withMutations((ctx) => {
                ctx.set('isFetching', false)
                    .set('data', action.data)
                    .set('crowd', action.crowd);
            });
        }
        
        
        case PIN_DOCUMENT: {
            
            return state.withMutations((ctx) => {
                ctx.set('isFetching', false)
                    .set('data', action.data)
                    .set('crowd', action.crowd);
            });
        }
        default:
            return state;
    }
}

