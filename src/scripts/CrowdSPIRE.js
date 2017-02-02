/**
 * CrowdSPIRE: Main function for Workspace
 * More function will be added sooner.
 */


const svg = d3.select('#vis');
const WIDTH = parseInt(svg.style("width"), 10);
const HEIGHT = parseInt(svg.style("height"), 10);
const DocSide = 40;
const IconSide = 10;
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


var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) {
        return d.id;
    }))
    .force("charge", d3.forceManyBody().strength(-360))
    .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2))
    .on('end', function () {
        // placed = true;
    });


var q = d3.queue();
q.defer(d3.json, 'data/crescent.json');
q.await(workspace);

// draw the workspace with docs
function workspace(error, docs) {

    var clickedDoc = null;

    if (error) {
        throw error;
    }

    simulation.nodes(docs.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(docs.links)
        .strength(function (link) {
            return link.similarity;
        });

    var linkG = svg.append('g');
    var link = null;

    var node = svg.selectAll(".node")
        .data(docs.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("cursor", "move")
        .on("mousedown", function () {
            d3.event.preventDefault();
        })
        .on('click', clicked)
        .on('dblclick', doubleClicked)
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded));

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
            return IconSide;
        })
        .attr("height", function () {
            return IconSide;
        })
        .attr("x", function () {
            return -IconSide / 2.0;
        })
        .attr("y", function () {
            return -IconSide / 2.0
        })
        .attr("fill", function (d) {
            return 'steelblue';
        })
        .attr('rx', function (d) {
            return IconR;
        })
        .attr('ry', function (d) {
            return IconR;
        });

    svg.on('mousedown', unfixNodes);

    // ticked
    function ticked() {

        node.attr("transform", function (d) {
            // border constriction
            var side;
            if (d.visualDetailLevel == 'Document') {
                side = DocSide / 2.0;
            } else {
                side = IconSide / 2.0;
            }

            d.x = Math.max(side, Math.min(WIDTH - side, d.x));
            d.y = Math.max(side, Math.min(HEIGHT - side, d.y));

            return "translate(" + d.x + "," + d.y + ")";
        });


        if (clickedDoc != null) {

            console.log('In ticked changing text');

            link.selectAll('text')
                .attr('x', function (d) {
                    return (d.source.x + d.target.x) / 2;
                })
                .attr('y', function (d) {
                    return (d.source.y + d.target.y) / 2;
                })
                .attr('transform', function (d, i) {

                    var dx = 0, dy = 0;
                    if (d.target.x > d.source.x) {
                        dx = d.target.x - d.source.x;
                        dy = d.target.y - d.source.y;
                    } else {
                        dx = d.source.x - d.target.x;
                        dy = d.source.y - d.target.y;
                    }

                    var angle = Math.atan2(dy, dx) * 180 / Math.PI;
                    var bbox = this.getBBox();
                    var rx = bbox.x + bbox.width / 2;
                    var ry = bbox.y + bbox.height / 2;
                    return 'rotate(' + angle + ' ' + rx + ' ' + ry + ')';
                });


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


    function clicked(d) {

        if (clickedDoc != d.id) {
            unfixNodes();

            d.fx = d.x;
            d.fy = d.y;
            clickedDoc = d.id;

            updateLinks();
        }
    }

    function doubleClicked(d) {

        console.log(d.visualDetailLevel);
        if (d.visualDetailLevel != 'Document') {
            d.visualDetailLevel = "Document";
            updateRectangles();
        }
        if (clickedDoc != d.id) {
            unfixNodes();

            d.fx = d.x;
            d.fy = d.y;
            clickedDoc = d.id;
            updateLinks();
        }
    }


    function dragStarted(d) {
        if (!d3.event.active) {
            simulation.alphaTarget(0.3).restart();
        }

        if (clickedDoc != d.id) {
            unfixNodes();
            d.fx = d.x;
            d.fy = d.y;
            clickedDoc = d.id;
            updateLinks();
        }
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragEnded(d) {
        if (!d3.event.active) {
            simulation.alphaTarget(0);
        }
    }

    function updateRectangles() {
        // update node rectangle
        console.log("In updateRectangles");
        node.selectAll("rect")
            .attr("width", function (d) {
                if (d.visualDetailLevel == 'Document') {
                    return DocSide;
                }
                return IconSide;
            })
            .attr("height", function (d) {
                if (d.visualDetailLevel == 'Document') {
                    return DocSide;
                }
                return IconSide;
            })
            .attr("x", function (d) {
                if (d.visualDetailLevel == 'Document') {
                    return -DocSide / 2.0;
                }
                return -IconSide / 2.0;
            })
            .attr("y", function (d) {
                if (d.visualDetailLevel == 'Document') {
                    return -DocSide / 2.0;
                }
                return -IconSide / 2.0;
            })
            .attr('rx', function (d) {
                if(d.visualDetailLevel == 'Document'){
                    return DocR;
                }
                return IconR;
            })
            .attr('ry', function (d) {
                if(d.visualDetailLevel == 'Document'){
                    return DocR;
                }
                return IconR;
            });
    }

    function updateLinks() {

        link = linkG.selectAll(".link")
            .data(docs.links.filter(linkFilter))
            .enter().append("g")
            .attr("class", "link")
            .attr("source", function (d) {
                return d.source.id;
            })
            .attr("target", function (d) {
                return d.target.id;
            });

        link.append('line')
            .attr('stroke', '#ccc')
            .attr('stroke-width', 1)
            .attr('opacity', 0.2);

        entity = link.append('text')
            .attr('font-size', "10px")
            .attr("text-anchor", "middle")
            .text(function (d) {
                var str = '';
                for (var i in d.entities) {
                    if (i == 0) {
                        str += d.entities[i];
                    } else {
                        str = str + ', ' + d.entities[i];
                    }
                }
                return str;
            })
            .attr('stroke', '#aaa');

    }

    function linkFilter(d) {
        return ((d.source.id == clickedDoc) || (d.target.id == clickedDoc)) && (d.source.id != d.target.id) && (d.similarity > 0.01);
    }

    function unfixNodes() {
        docs.nodes.forEach(function (d) {
            if (d.visualDetailLevel != 'Document') {
                d.fx = null;
                d.fy = null;
            }
        });

        clickedDoc = null;
        if (link != null) {
            link.remove();
        }
    }
}


