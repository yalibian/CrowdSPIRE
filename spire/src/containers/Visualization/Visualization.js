/**
 * Created by Yali on 3/4/17.
 */

import {rectOverlap, d3, Model} from '../../utilities'
import React, {PropTypes, Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ListsActions from '../../actions/actions';
import './vis.styl';
import minusImage from '../../assets/images/minus.png';
import closeImage from '../../assets/images/close.png';

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
} from '../../actions/actions';


function mapStateToProps(state) {
    return {
        nodes: state.model.nodes,
        links: state.model.links,
        needUpdateLayout: state.model.needUpdateLayout,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ListsActions, dispatch);
}

const visStyle = {
    display: 'flex',
    minHeight: '180px',
    height: '100%'
};

const DocWidth = 250;
const DocHeight = 300;
const DocRadius = Math.sqrt(DocWidth * DocWidth + DocHeight * DocHeight) / 2.00;
const DocSide = 40;
const IconSide = 10;
const ResizingRectSide = 10;
const DocR = 6;
const IconR = 3;
const entityColor = {
    "Person": "#d9b8f1",
    "Location": "#BDC03F",
    "Organization": "#ffe543",
    "Money": "#FF9B14",
    "Misc": "#F69AC1",
    "Phone": "#8EB4FF",
    "Interesting": "#f1f1b8",
    "Date": "#67E1D8"
};

// VIS info
let svg;
let forceCollide = d3.forceCollide()
    .radius(function (d) {
        return d.radius;
    })
    .iterations(2)
    .strength(0.95);

let simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) {
        return d.id;
    }))
    .force("charge", d3.forceManyBody().strength(-60))
    .force("collide", forceCollide);
// .on("tick", ticked);

let nodes, links, movementMode, interaction;
let node, link, linkG;
let WIDTH, HEIGHT;
let clickedDoc = null;

@connect(mapStateToProps, mapDispatchToProps)
class Visualization extends Component {
    
    static propTypes = {
        nodes: PropTypes.array,
        links: PropTypes.array,
        movementMode: PropTypes.string.isRequired,
        interaction: PropTypes.string,
        
        moveDocument: PropTypes.func,
        openDocument: PropTypes.func,
        overlapDocuments: PropTypes.func,
        highlightText: PropTypes.func,
        clusterDocuments: PropTypes.func,
        annotateDocument: PropTypes.func,
        pinDocument: PropTypes.func,
    };
    
    constructor(props) {
        super(props);
        // User Interactions
        this.moveDocument = this.moveDocument.bind(this);
        this.highlightText = this.highlightText.bind(this);
        this.overlapDocuments = this.overlapDocuments.bind(this);
        this.annotateDocument = this.annotateDocument.bind(this);
        this.pinDocument = this.pinDocument.bind(this);
        
        this.updateLayout = this.updateLayout.bind(this);
        this.expressive = this.expressive.bind(this);
        
        
        this.nodeClicked = this.nodeClicked.bind(this);
        this.nodeDragStarted = this.nodeDragStarted.bind(this);
        this.nodeDragged = this.nodeDragged.bind(this);
        this.nodeDragEnded = this.nodeDragEnded.bind(this);
        this.unfixNodes = this.unfixNodes.bind(this);
        this.ticked = this.ticked.bind(this);
        
        this.nodeDoubleClicked = this.nodeDoubleClicked.bind(this);
        this.minimizeNode = this.minimizeNode.bind(this);
        this.closeNode = this.closeNode.bind(this);
        this.maximizeNode = this.maximizeNode.bind(this);
        
        this.updateLinks = this.updateLinks.bind(this);
        this.linkFilter = this.linkFilter.bind(this);
    }
    
    moveDocument(doc) {
        this.props.moveDocument(doc);
    }
    
    highlightText(text) {
        this.props.highlightText(text);
    }
    
    overlapDocuments(docList) {
        this.props.overlapDocuments(docList);
    }
    
    annotateDocument(text, doc) {
        this.props.annotateDocument(text, doc);
    }
    
    pinDocument(doc) {
        this.props.pinDocument(doc);
    }
    
    
    // Init the whole force directed graph visualization based on d3.js and (data: nodes, links).
    componentDidMount() {
        console.log("Init VISUALIZATION");
        nodes = this.props.nodes;
        links = this.props.links;
        movementMode = this.props.movementMode;
        console.log(movementMode);
        
        let overlapDocuments = this.props.overlapDocuments;
        let openDocument = this.props.openDocument;
        svg = d3.select(this.refs.vis);
        WIDTH = parseInt(svg.style("width"), 10);
        HEIGHT = parseInt(svg.style("height"), 10);
        
        simulation
            .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2))
            .nodes(nodes)
            .on("tick", this.ticked);
        
        simulation.force("link")
            .links(links)
            .strength(function (link) {
                return link.strength / 50;
            });
        
        linkG = svg.append('g');
        link = null;
        let nodeDragEnded = this.nodeDragEnded;
        
        
        let onNodeDragEnded = function (d) {
            nodeDragEnded(d, overlapDocuments);
        };
        
        let onNodeDoubleClicked = function (d) {
            console.log('onNodeDoubleClicked');
            this.nodeDoubleClicked(d, openDocument);
        };
        
        let doubleClicked = this.nodeDoubleClicked;
        let dragStarted = this.nodeDragStarted;
        let dragged = this.nodeDragged;
        let dragEnded = this.nodeDragEnded;
        let drag = d3.drag()
            .on("start", function (d) {
                dragStarted(d, this);
            })
            .on("drag", function (d) {
                dragged(d, this);
            })
            .on("end", function (d) {
                dragEnded(d, this);
            });
        
        node = svg.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .on("mousedown", function () {
                d3.event.preventDefault();
            })
            .on('click', this.nodeClicked)
            .on('dblclick', function (d) {
                doubleClicked(d, this);
            })
            .call(drag);
        
        // label
        node.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function (d) {
                return d.id
            });
        
        // rectangle
        node.append("rect")
            .attr("width", function (d) {
                d.radius = IconSide / Math.sqrt(2.00);
                d.width = IconSide;
                return IconSide;
            })
            .attr("height", function (d) {
                d.height = IconSide;
                return IconSide;
            })
            .attr("x", function (d) {
                return d.width;
            })
            .attr("y", function (d) {
                return d.height;
            })
            .attr("fill", function (d) {
                return 'steelblue';
            })
            .attr('rx', function (d) {
                return IconR;
            })
            .attr('ry', function (d) {
                return IconR;
            })
            .attr('class', 'IconRect');
        
        svg.on('mousedown', this.unfixNodes);
    }
    
    // Update the whole VIS when semantic interaction happened
    // The whole update has beend recored on nodes and links
    // We just need to update the binded data on links and nodes.
    componentDidUpdate() {
        
        console.log('Update VIS');
        nodes = this.props.nodes;
        links = this.props.links;
        movementMode = this.props.movementMode;
        interaction = this.props.interaction;
        
        // If current movement mode is 'expressive', just need to consider whether we need to update layout.
        if (movementMode === 'expressive') {
            if (interaction === UPDATE_LAYOUT) {
                this.updateLayout();
            }
            return;
        }
        
        let overlapDocuments = this.props.overlapDocuments;
        let openDocument = this.props.openDocument;
        
        let onNodeDragEnded = function (d) {
            this.nodeDragEnded(d, overlapDocuments);
        };
        
        let onNodeDoubleClicked = function (d) {
            this.nodeDoubleClicked(d, openDocument);
        };
        
        // Enter
        let newAddedNodes = svg.selectAll('.node').data(nodes)
            .enter()
            .append("g")
            .attr("class", 'node')
            .on("mousedown", function () {
                d3.event.preventDefault();
            })
            .on('click', nodeClicked)
            .on('dblclick', onNodeDoubleClicked)
            .call(d3.drag()
                .on("start", this.nodeDragStarted)
                .on("drag", this.nodeDragged)
                .on("end", onNodeDragEnded));
        
        newAddedNodes.append('text')
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function (d) {
                return d.id;
            });
        
        newAddedNodes.append("rect")
            .attr("width", function (d) {
                d.radius = IconSide / Math.sqrt(2.00);
                d.width = IconSide;
                return IconSide;
            })
            .attr("height", function (d) {
                d.height = IconSide;
                return IconSide;
            })
            .attr("x", function (d) {
                return d.width;
            })
            .attr("y", function (d) {
                return d.height;
            })
            .attr("fill", function (d) {
                if (d.type === 'KEYWORD') {
                    return 'red';
                }
                return 'steelblue';
            })
            .attr('rx', function (d) {
                return IconR;
            })
            .attr('ry', function (d) {
                return IconR;
            })
            .attr('class', 'IconRect');
        
        
        // Update
        newAddedNodes = svg.selectAll('.node').data(nodes);
        let docNodes = newAddedNodes.filter(function (d) {
            return d.type === 'DOCUMENT';
        });
        
        let iconNodes = newAddedNodes.filter(function (d) {
            return d.type !== 'DOCUMENT';
        });
        
        
        iconNodes.selectAll('foreignObject').remove();
        iconNodes.selectAll('image').remove();
        iconNodes.select('text')
            .text(function (d) {
                d.x = 0.0;
                d.y = 0.0;
                return d.id;
            });
        
        iconNodes.select('rect')
            .attr('width', function (d) {
                d.radius = IconSide / Math.sqrt(2.00);
                d.width = IconSide;
                return IconSide;
            }).attr('height', function (d) {
            d.height = IconSide;
            return IconSide;
        }).attr("x", function (d) {
            // console.log(d.id);
            // d.fx = d.width;
            return d.width;
        })
            .attr("y", function (d) {
                // d.fy = d.height;
                return d.height;
            })
            .attr("fill", function (d) {
                if (d.type === 'KEYWORD') {
                    return 'red';
                }
                return 'steelblue';
            })
            .attr('rx', function (d) {
                return IconR;
            })
            .attr('ry', function (d) {
                return IconR;
            })
            .attr('class', function (d) {
                if (d.type === 'KEYWORD') {
                    return 'EntityRect'
                }
                return 'IconRect'
            })
            .style('stroke-width', function () {
                return 0;
            });
        
        docNodes.select('rect')
            .attr('width', function (d) {
                let c = 90;
                let a = 69;
                let goldenRatio = 1.618;
                return d.width = (a + Math.sqrt(a * a + 4 * goldenRatio * c * d.content.length)) / (2 * goldenRatio);
            })
            .attr('height', function (d) {
                return d.height = 1.61803398875 * d.width;
            })
            .attr("x", function (d) {
                // console.log(d.id);
                // d.fx = d.width;
                return d.width;
            })
            .attr("y", function (d) {
                // d.fy = d.height;
                return d.height;
            })
            .attr("fill", function (d) {
                if (d.type === 'KEYWORD') {
                    return 'red';
                }
                return 'steelblue';
            })
            .attr('rx', function (d) {
                return IconR;
            })
            .attr('ry', function (d) {
                return IconR;
            })
            .attr('class', function (d) {
                return 'DocRect'
            });
        
        // Add close/delete button
        docNodes.append('image')
            .attr("xlink:href", function (d) {
                return closeImage;
                // return '../assets/images/close.png';
            })
            .attr("width", "16px")
            .attr("height", "16px")
            .attr('class', 'CloseNode')
            .attr('x', function (d) {
                return d.width / 2 - 25;
            })
            .attr('y', function (d) {
                return -d.height / 2 + 2;
            })
            .on('click', this.closeNode);
        
        // Add minimize button
        docNodes.append('image')
            .attr("xlink:href", function (d) {
                return minusImage;
                // return './img/minus.png';
            })
            .attr("width", "16px")
            .attr("height", "16px")
            .attr('class', 'MinimizeNode')
            .attr('x', function (d) {
                return d.width / 2 - 45;
            })
            .attr('y', function (d) {
                return -d.height / 2 + 2;
            })
            .on('click', this.minimizeNode);
        
        //Add document content into docNode(Document Level Node)
        let docContent = docNodes.append("foreignObject")
            .attr("class", "doc")
            .on('click', function () {
            })
            .attr("width", function (d) {
                return d.width;
            })
            .attr("height", function (d) {
                return d.height - 40;
            })
            .attr("x", function (d) {
                return -d.width / 2;
            })
            .attr("y", function (d) {
                return -d.height / 2 + 20;
            })
            .append("xhtml:body")
            .style("margin", 0)
            .style("padding", 0)
            .append("div")
            .style("max-height", function (d) {
                return d.height - 40 + 'px';
            })
            .style("height", function (d) {
                return d.height - 40 + 'px';
            });
        
        docContent.append('p')
            .attr('class', 'doc-title')
            .text(function (d) {
                return d.id;
            });
        
        docContent.append('p')
            .attr('class', 'doc-content')
            .attr('height', function (d) {
                return d.height - 50 + 'px';
            })
            .text(function (d) {
                return d.content;
            });
        
        svg.selectAll('.node')
            .data(nodes)
            .exit()
            .remove();
        
        console.log(movementMode);
        if (movementMode === 'expressive') {
            console.log("movementMode === expressive");
            svg.selectAll('.node')
                .attr("fx", function (d) {
                    return d.x;
                })
                .attr('fy', function (d) {
                    return d.y;
                });
        } else {
            // Update and restart the simulation.
            simulation.nodes(nodes);
            simulation.force("link").links(links);
            simulation.alpha(0.3).restart();
        }
    }
    
    render() {
        return (
            <svg ref="vis" style={visStyle}/>
        );
    }
    
    // Related Interactions for Vis
    expressive() {
    
    }
    
    // Find the most related layout based on dragged nodes.
    updateLayout() {
        console.log("Next Step: Update Layout based on Updated Nodes and links");
    }
    
    nodeClicked(d) {
        if (clickedDoc !== d.id) {
            this.unfixNodes();
            d.fx = d.x;
            d.fy = d.y;
            clickedDoc = d.id;
            this.updateLinks();
        }
    }
    
    ticked() {
        
        // Not change the width and height of each node.
        svg.selectAll('.node').attr("transform", function (d) {
            
            // border constriction
            d.x = Math.max(d.width / 2, Math.min(WIDTH - d.width / 2, d.x));
            d.y = Math.max(d.height / 2, Math.min(HEIGHT - d.height / 2, d.y));
            
            // Update the group position: which include the basic rectangle and Foreign object. (Drag Object too...)
            return "translate(" + d.x + "," + d.y + ")";
        });
        
        // rectangle: keep ICON rectangle at the center of Node Group
        svg.selectAll("rect")
            .attr("x", function (d) {
                return -d.width / 2;
            })
            .attr("y", function (d) {
                return -d.height / 2;
            });
        
        
        // When a node is selected(highlighted), related nodes/links should highlighted to.
        if (clickedDoc !== null) {
            
            // Show labels on each related link
            link.selectAll('text')
                .attr('x', function (d) {
                    return (d.source.x + d.target.x) / 2;
                })
                .attr('y', function (d) {
                    return (d.source.y + d.target.y) / 2;
                })
                .attr('transform', function (d, i) {
                    
                    let dx = 0, dy = 0;
                    if (d.target.x > d.source.x) {
                        dx = d.target.x - d.source.x;
                        dy = d.target.y - d.source.y;
                    } else {
                        dx = d.source.x - d.target.x;
                        dy = d.source.y - d.target.y;
                    }
                    
                    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
                    let bbox = this.getBBox();
                    let rx = bbox.x + bbox.width / 2;
                    let ry = bbox.y + bbox.height / 2;
                    return 'rotate(' + angle + ' ' + rx + ' ' + ry + ')';
                });
            
            // Show line between each related link
            link.selectAll('line')
                .attr('x1', function (d) {
                    return d.source.x;
                })
                .attr('y1', function (d) {
                    return d.source.y;
                })
                .attr('x2', function (d) {
                    return d.target.x;
                })
                .attr('y2', function (d) {
                    return d.target.y;
                });
        }
    }
    
    nodeDoubleClicked(d, openDocument) {
        
        if (d.visualDetailLevel !== 'Document') {
            openDocument(d.id);
            d.visualDetailLevel = "Document";
            d.fx = d.x;
            d.fy = d.y;
            this.maximizeNode(d);
        }
        if (clickedDoc !== d.id) {
            this.unfixNodes();
            
            d.fx = d.x;
            d.fy = d.y;
            clickedDoc = d.id;
            this.updateLinks();
        }
    }
    
    nodeDragStarted(d, that) {
        d3.select(that).moveToFront();
        if (d.visualDetailLevel === 'Document') {
        
        }
        
        if (movementMode === 'expressive') {
            
            // d3.select(that)
            //     .select('text')
            //     .style('fill', '#1DE9B6');
            
            d3.select(that)
                .select('rect')
                .style('fill', '#1DE9B6');
            
            d3.select(that)
                .append('circle')
                .attr('r', 60)
                .attr('fill', 'transparent')
                .attr('cx', 0)
                .attr('cy', 0)
                .attr("stroke", "#1DE9B6");
        }
        
        if (!d3.event.active && (movementMode === 'exploratory')) {
            simulation.alphaTarget(0.3).restart();
        }
        
        if (clickedDoc !== d.id) {
            // console.log(this.unfixNodes);
            this.unfixNodes();
            d.fx = d.x;
            d.fy = d.y;
            clickedDoc = d.id;
            this.updateLinks();
        }
    }
    
    // During node drag.
    nodeDragged(d, that) {
        
        if (movementMode === 'expressive') {
            
            let dragPoint = {};
            d3.select(that)
                .attr("transform", function (d) {
                    // border constriction
                    d.x = d3.event.x;
                    d.y = d3.event.y;
                    d.x = Math.max(d.width / 2, Math.min(WIDTH - d.width / 2, d.x));
                    d.y = Math.max(d.height / 2, Math.min(HEIGHT - d.height / 2, d.y));
                    
                    dragPoint.x = d.x;
                    dragPoint.y = d.y;
                    // Update the group position: which include the basic rectangle and Foreign object. (Drag Object too...)
                    return "translate(" + d.x + "," + d.y + ")";
                });
            
            
            
            // If the outside circle of selected node include other nodes, we should highlight those nodes
            node.filter(function (d) {
            })
                .select('rect')
                .style('fill', '#1DE9B6');
            
            node.select('rect')
                .style('fill', function(d){
                        if(Math.sqrt((dragPoint.x - d.x) * (dragPoint.x - d.x) + (dragPoint.y - d.y) * (dragPoint.y - d.y)) < 60){
                            return '#1DE9B6';
                        } else {
                            return 'steelblue';
                        }
                })
            
            
        } else {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        
        if (d.visualDetailLevel === 'Document') {
            
            // flag to record if this node has overlap with other document level node
            let hasOverlap = false;
            
            let rectA = {x: d.x - d.width / 2, y: d.y - d.height / 2, width: d.width, height: d.height};
            node.selectAll('rect')
                .style('stroke', 'yellow')
                .style('stroke-width', function (dd) {
                    if (dd.visualDetailLevel !== 'Document' || dd.id === d.id) {
                        return 0;
                    } else {
                        let rectB = {
                            x: dd.x - dd.width / 2,
                            y: dd.y - dd.height / 2,
                            width: dd.width,
                            height: dd.height
                        };
                        if (rectOverlap(rectA, rectB)) {
                            hasOverlap = true;
                            return 4;
                        } else {
                            return 0;
                        }
                    }
                });
            
            d3.select(this)
                .select('rect')
                .style('stroke', 'yellow')
                .style('stroke-width', function () {
                    if (hasOverlap) {
                        return 4;
                    } else {
                        return 0;
                    }
                });
            
        }
    }
    
    // the end of node drag.
    nodeDragEnded(d, that) {
        
        if (movementMode === 'expressive') {
            
            // Remove the outside circle
            d3.select(that)
                .select('circle')
                .remove();
    
            
            let dragPoint = {x: d.x, y: d.y, id: d.id};
            let cluster =[];
            cluster.push(d.id);
            node.each(function (d) {
                if(Math.sqrt((dragPoint.x - d.x) * (dragPoint.x - d.x) + (dragPoint.y - d.y) * (dragPoint.y - d.y)) < 60){
                    if(dragPoint.id !== d.id){
                        cluster.push(d.id);
                    }
                }
            });
            // moves a cluster to the action
            this.moveDocument(cluster);
        }
        
        if (d.visualDetailLevel === 'Document') {
            
            let hasOverlap = false;
            let overlappedDocId = null;
            let rectA = {x: d.x - d.width / 2, y: d.y - d.height / 2, width: d.width, height: d.height};
            node.selectAll('rect')
                .attr('border', function (dd) {
                    if (dd.visualDetailLevel !== 'Document' || dd.id === d.id) {
                        return '';
                    } else {
                        let rectB = {
                            x: dd.x - dd.width / 2,
                            y: dd.y - dd.height / 2,
                            width: dd.width,
                            height: dd.height
                        };
                        if (rectOverlap(rectA, rectB)) {
                            hasOverlap = true;
                            overlappedDocId = dd.id;
                            return '1px solid black';
                        } else {
                            return '';
                        }
                    }
                });
            
            
            if (hasOverlap) {
                overlapDocuments([overlappedDocId, d.id]);
                // model.documentOverlapping(overlappedDocId, d.id);
            }
        }
        
        if (!d3.event.active && (movementMode === 'exploratory')) {
            simulation.alphaTarget(0);
        }
        // forceCollide.initialize(simulation.nodes());
        
        // Update and restart the simulation.
        if (movementMode === 'exploratory') {
            simulation.nodes(nodes);
            simulation.force("link").links(links);
            simulation.alpha(0.3).restart();
        }
    }
    
    // Document-Level Node -> Icon-Level Node:
    //      When the close button is clicked on this Document-Level Node, smaller the size of background rectangle, and delete the foreign object.
    //  Details: remove text, buttons from Node, change class.
    minimizeNode(d) {
        
        d3.event.preventDefault();
        
        let selectedNode = node.filter(function (dd) {
            return dd.id === d.id;
        });
        
        selectedNode.select('rect')
            .attr("width", function (d) {
                return d.width = IconSide;
            })
            .attr("height", function (d) {
                return d.height = IconSide;
            })
            .attr("x", function (d) {
                // Radius is used for collision detection.
                return -d.width / 2;
            })
            .attr("y", function (d) {
                return -d.height / 2;
            })
            .attr('rx', function (d) {
                return IconR;
            })
            .attr('ry', function (d) {
                return IconR;
            })
            .attr('class', function (d) {
                return 'IconRect';
            });
        
        d.visualDetailLevel = 'Icon';
        selectedNode.selectAll('foreignObject').remove();
        selectedNode.selectAll('image').remove();
        d.radius = Math.sqrt(d.width * d.width + d.height * d.height) / 2;
        d.fx = null;
        d.fy = null;
        
        node.selectAll('rect')
            .style('stroke-width', function (d) {
                return 0;
            });
        
        // simulation.alpha(1).restart();
        
        // unfixNodes();
        
        svg.selectAll(".link").remove();
        // selectedNode.remove();
        
        if (!d3.event.active) {
            simulation.alpha(0.3).restart();
        }
        
        forceCollide.initialize(simulation.nodes());
    }
    
    // Delete Node from Screen:
    //      When the delete button is clicked on Document-Level Node, the background rectangle and foreign object of this node group would be deleted from the screen.
    closeNode(d) {
        // Remove node from docs.nodes and links from crescent.links
        nodes = nodes.filter(function (dd) {
            return d.id !== dd.id;
        });
        
        links = links.filter(function (dd) {
            return d.id !== dd.target.id && d.id !== dd.source.id;
        });
        
        let selectedNode = node.filter(function (dd) {
            return dd.id === d.id;
        });
        
        // Update notes and links again
        // unfixNodes();
        svg.selectAll(".link").remove();
        selectedNode.remove();
        
        // Update and restart the simulation.
        simulation.nodes(nodes);
        simulation.force("link").links(links);
        simulation.alpha(0.3).restart();
    }
    
    // Icon-Level Node -> Document-Level Node:
    // When a Icon-Level node double clicked, enlarge the size of background rectangle, and add foreign object to show contents of this node.
    maximizeNode(selectedDoc) {
        
        // Improve efficiency using node.filter (May be better)
        let docLevelNode = node.filter(function (d) {
            return d.id === selectedDoc.id;
        });
        
        docLevelNode.select('rect')
            .attr("width", function (d) {
                // Changes based on d. text: each document have different length of Text
                // Using Golden Ratio give the document level node a good looking rectangle.
                let c = 90;
                let a = 69;
                let goldenRatio = 1.618;
                return d.width = (a + Math.sqrt(a * a + 4 * goldenRatio * c * d.content.length)) / (2 * goldenRatio);
            })
            .attr("height", function (d) {
                return d.height = 1.61803398875 * d.width;
            })
            .attr("x", function (d) {
                // d.fx = d.x;
                // Radius is used for collision detection.
                d.radius = Math.sqrt(d.width * d.width + d.height * d.height) / 2;
                return -d.width / 2;
            })
            .attr("y", function (d) {
                // d.fy = f.y;
                return -d.height / 2;
            })
            .attr('rx', function (d) {
                return DocR;
            })
            .attr('ry', function (d) {
                return DocR;
            })
            .attr('class', function (d) {
                return 'DocRect';
            });
        
        // Add close/delete button
        docLevelNode.append('image')
            .attr("xlink:href", function (d) {
                return closeImage;
                // return '../assets/images/close.png';
            })
            .attr("width", "16px")
            .attr("height", "16px")
            .attr('class', 'CloseNode')
            .attr('x', function (d) {
                return d.width / 2 - 25;
            })
            .attr('y', function (d) {
                return -d.height / 2 + 2;
            })
            .on('click', this.closeNode);
        
        // Add minimize button
        docLevelNode.append('image')
            .attr("xlink:href", function (d) {
                return minusImage;
                // return './img/minus.png';
            })
            .attr("width", "16px")
            .attr("height", "16px")
            .attr('class', 'MinimizeNode')
            .attr('x', function (d) {
                return d.width / 2 - 45;
            })
            .attr('y', function (d) {
                return -d.height / 2 + 2;
            })
            .on('click', this.minimizeNode);
        
        //Add document content into docNode(Document Level Node)
        let docContent = docLevelNode.append("foreignObject")
            .attr("class", "doc")
            .on('click', function () {
            })
            .attr("width", function (d) {
                return d.width;
            })
            .attr("height", function (d) {
                return d.height - 40;
            })
            .attr("x", function (d) {
                return -d.width / 2;
            })
            .attr("y", function (d) {
                return -d.height / 2 + 20;
            })
            .append("xhtml:body")
            .style("margin", 0)
            .style("padding", 0)
            .append("div")
            .style("max-height", function (d) {
                return d.height - 40 + 'px';
            })
            .style("height", function (d) {
                return d.height - 40 + 'px';
            });
        
        docContent.append('p')
            .attr('class', 'doc-title')
            .text(function (d) {
                return d.id;
            });
        
        docContent.append('p')
            .attr('class', 'doc-content')
            .attr('height', function (d) {
                return d.height - 50 + 'px';
            })
            .text(function (d) {
                return d.content;
            });
        
        if (!d3.event.active) {
            simulation.alpha(0.3).restart();
        }
        
        forceCollide.initialize(simulation.nodes());
    }
    
    updateLinks() {
        
        link = linkG.selectAll(".link")
            .data(links.filter(this.linkFilter))
            .enter().append("g")
            .attr("class", "link")
            .attr("source", function (d) {
                return d.source.id;
            })
            .attr("target", function (d) {
                return d.target.id;
            });
        
        link.append('line');
        
        let entity = link.append('text')
            .attr('font-size', "10px")
            .attr("text-anchor", "middle")
            .text(function (d) {
                let str = '';
                for (let i in d.shared) {
                    if (i == 0) {
                        str += d.shared[i];
                    } else {
                        str = str + ', ' + d.shared[i];
                    }
                }
                return str;
            })
            .attr('stroke', '#aaa');
        
    }
    
    linkFilter(d) {
        // return ((d.source.id === clickedDoc) || (d.target.id === clickedDoc)) && (d.source.id !== d.target.id) && (d.strength > 0.003);
        return ((d.source.id === clickedDoc) || (d.target.id === clickedDoc)) && (d.source.id !== d.target.id) && (d.strength > 0.05);
        // return ((d.source.id == clickedDoc) || (d.target.id == clickedDoc)) && (d.source.id != d.target.id) && (d.similarity > 0.01);
    }
    
    unfixNodes() {
        
        if (!d3.event.active && movementMode === 'exploratory') {
            simulation.alpha(0.3).restart();
        }
        
        // svg.selectAll(".link").remove();
        nodes.forEach(function (d) {
            if (d.visualDetailLevel !== 'Document' && movementMode === 'exploratory') {
                d.fx = null;
                d.fy = null;
            }
        });
        
        clickedDoc = null;
        if (link !== null) {
            link.remove();
        }
    }
    
}

export default Visualization;




