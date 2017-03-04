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


const InitialState = Record({
    isFetching: false,
    data: null,
    crowd: null,
    nodes: null,
    links: null,
    isDragging: false
});

let documents, edges, entities; // real docs
let nodes, links; // data to render on force directed graph
let crowd;


// nodeSimilarity: calculate the similarity between two node (in [document, icon, keyword])
// If two documents, two could call cosineSimilarity/softSimilarity
// If two keywords, we could call crowd
// If one document and one keyword, we could calculate directly
const KEYWORD_K = 0.5;
const nodeSimilarity = function (node1, node2) {
    // In nodeSimilarity
    if (node1.type != KEYWORD && node2.type != KEYWORD) {
        // find doc1 and doc2
        const doc1 = documents.find(function (doc) {
            return doc.id == node1.id;
        });
        
        const doc2 = documents.find(function (doc) {
            return doc.id == node2.id;
        });
        // return cosineSimilarity(doc1, doc2, entities);
        return 0;
        
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
            return KEYWORD_K;
        }
        return 0;
    }
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
                links.push(link);
            }
        }
    }
    return links;
};

// Transform data into nodes and links, the nodes includes (keywords and docs, links include their links between nodes.)
const initialState = new InitialState;
export default function model(state = initialState, action) {
    switch (action.type) {
        
        case GET_DATA: {
            // Init Nodes and Links:
            // Nodes are all documents right now.
            documents = action.data.documents;
            edges = action.data.edges;
            entities = action.data.entities;
            crowd = action.crowd;
            
            // convert documents into nodes
            nodes = [];
            documents.forEach(function (d) {
                let node = {};
                node.id = d.id;
                node.type = ICON;
                node.entities = d.entities;
                node.mass = d.entities.reduce(function (acc, e) {
                    return acc + entities[e.name].weight * e.value;
                }, 0);
                
                nodes.push(node);
            });
            
            // This update function will change anyway, since we need to calculate again and again.
            // Calculate links based on updated nodes
            links = linker(nodes);
            console.log(nodes);
            console.log(links);
            
            return state.withMutations((ctx) => {
                ctx.set('isFetching', false)
                    .set('nodes', nodes)
                    .set('links', links)
                    .set('data', action.data)
                    .set('crowd', action.crowd);
            });
        }
        
        case SEARCH_TERMS: {
            
            // Add keywords into nodes, update new links
            // Use model to change the backend data
            
            // Update nodes and links
            // convert documents into nodes
            console.log(action.keywords);
            const keywords = action.keywords;
            nodes = [];
            documents.forEach(function (d) {
                
                if (d.entities.find(function (e) {
                        return keywords.find(function (key) {
                            key = e.name;
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
                node.mass = entities[word].weight;
                
                nodes.push(node);
            });
            
            // update links.
            nodeSimilarity(node1, node2);
            
            
            return state.withMutations((ctx) => {
                ctx.set('isFetching', false)
                    .set('data', action.data)
                    .set('crowd', action.crowd);
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

