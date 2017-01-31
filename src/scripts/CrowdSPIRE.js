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
            // return 1 / Math.min(count(link.source), count(link.target));
            return link.similarity;
        });

    // links between nodes
    var link = svg.selectAll(".link")
        .data(docs.links)
        .enter().append("g")
        .attr("class", "link");


    // label
    // text x="20" y="20" font-family="sans-serif" font-size="20px" fill="red"
    // link.append("text")
    //     .text(function(d) {
    //         return d.entities[0];
    //     })

    // line
    // link.append("line")
    //     .attr('x1', function(d){
    //         return d.x1;
    //     })
    //      .attr('y1', function(d){
    //         return d.y1;
    //     })
    //      .attr('x2', function(d){
    //         return d.x2;
    //     })
    //      .attr('y2', function(d){
    //         return d.y2;
    //     })
    //     .attr('stroke', 'gray')
    //     .attr('stroke-width', 2);

    var node = svg.selectAll(".node")
        .data(docs.nodes)
        .enter().append("g")
        .attr("class", "node")
        .on("mousedown", function() { d3.event.preventDefault(); })
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

    svg.on('mousedown', unhighlight);

    // ticked
    function ticked() {

        // link
        //     .attr("x1", function(d) { return d.source.x; })
        //     .attr("y1", function(d) { return d.source.y; })
        //     .attr("x2", function(d) { return d.target.x; })
        //     .attr("y2", function(d) { return d.target.y; });
        //
        // link.selectAll('line')
        //     .attr('x1', function (d) {
        //         return d.source.x;
        //     })
        //     .attr('y1', function (d){
        //         return d.source.y;
        //     })
        //     .attr('x2', function (d) {
        //         return d.target.x;
        //     })
        //     .attr('y2', function (d) {
        //         return d.target.y;
        //     });

        node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    }


    function clicked(d){

        if(selectedDoc != d.id){
            unhighlight(selectedDoc);
        }

        d.fx = d.x;
        d.fy = d.y;
        selectedDoc = d.id;
    }


    function dragStarted(d) {
        if (!d3.event.active) {
            simulation.alphaTarget(0.3).restart();
        }

        if(selectedDoc != d.id){
            unhighlight(selectedDoc);
        }

        d.fx = d.x;
        d.fy = d.y;
        selectedDoc = d.id;
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

    function unhighlight() {
        console.log(docs.nodes);
        docs.nodes.forEach(function(d){
            d.fx = null;
            d.fy = null;
        });
    }
}


