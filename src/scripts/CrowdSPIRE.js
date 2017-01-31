/**
 * CrowdSPIRE: Main function for Workspace
 * More function will be added sooner.
 */


const svg = d3.select('#vis');
const WIDTH = parseInt(svg.style("width"), 10);
const HEIGHT = parseInt(svg.style("height"), 10);
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

const radius = 10;

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

    var selectedDoc = null;

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
        .on("mousedown", function () {
            d3.event.preventDefault();
        })
        .on('click', clicked)
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
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", -4)
        .attr("y", -4)
        .attr("fill", function (d) {
            return 'steelblue';
        });

    svg.on('mousedown', unfixNodes);

    // ticked
    function ticked() {

        if (selectedDoc != null) {

            link.selectAll('text')
                .attr('x', function (d) {
                    return (d.source.x + d.target.x) / 2;
                })
                .attr('y', function (d) {
                    return (d.source.y + d.target.y) / 2;
                });
                // .attr('transform', function (d) {
                //     return "translate(" +  (d.source.x + d.target.x) / 2 + "," + (d.source.y + d.target.y) / 2 + ")";
                // });

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

        node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    }


    function clicked(d) {

        if (selectedDoc != d.id) {
            unfixNodes(selectedDoc);

            d.fx = d.x;
            d.fy = d.y;
            selectedDoc = d.id;

            updateLinks();
        }
    }


    function dragStarted(d) {
        if (!d3.event.active) {
            simulation.alphaTarget(0.3).restart();
        }

        if (selectedDoc != d.id) {
            unfixNodes(selectedDoc);
            d.fx = d.x;
            d.fy = d.y;
            selectedDoc = d.id;
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

    function updateLinks() {


        link = linkG.selectAll(".link")
            .data(docs.links.filter(linkFilter))
            .enter().append("g")
            .attr("class", "link")
            .attr("source", function (d){
                return d.source.id;
            })
            .attr("target", function (d) {
                return d.target.id;
            });

        link.append('line')
            .attr('stroke', 'gray')
            .attr('stroke-width', 1)
            .attr('opacity', 0.2);

        entity = link.append('text')
            .attr('font-size', "5px")
            .attr('fill', 'black')
            .text(function (d) {
                var str = '';
                for (var i in d.entities){
                    if(i == 0){
                        str += d.entities[i];
                    } else {
                        str = str + ', ' + d.entities[i];
                    }
                }
                return str;
            });

    }

    function linkFilter(d) {
        return ((d.source.id == selectedDoc) || (d.target.id == selectedDoc)) && (d.source.id != d.target.id);
    }

    function unfixNodes() {
        docs.nodes.forEach(function (d) {
            d.fx = null;
            d.fy = null;
        });

        selectedDoc = null;
        if (link != null) {
            link.remove();
        }
    }
}


