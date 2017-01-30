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
        .enter().append("line")
        .attr("class", "link");

    var node = svg.selectAll(".node")
        .data(docs.nodes)
        .enter().append("g")
        .attr("class", "node");
    // .call(force.drag);


    // label
    node.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function (d) {
            return d.id
        });

    // circle
    node.append("circle")
        .attr("r", 6)
        .attr("cx", -8)
        .attr("cy", -8)
        .attr("fill", function (d) {
            return 'steelblue';
        });

    // ticked
    function ticked() {
        // node.attr("cx", function (d) {
        //         d.x = Math.max(radius, Math.min(WIDTH - radius, d.x));
        //         return d.x;
        //     })
        //     .attr("cy", function (d) {
        //         d.y = Math.max(radius, Math.min(HEIGHT - radius, d.y));
        //         return d.y;
        //     });

        node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    }

}


