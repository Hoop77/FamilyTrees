var network = null;
var directionInput = document.getElementById( "direction" );

function destroy() 
{
	if (network !== null) 
	{
		network.destroy();
		network = null;
	}
}

function draw() 
{
	destroy();

	var graph = familyTree.exportAsVisGraph();

	// create a network
	var container = document.getElementById('network');
	var data = {
		nodes: graph.nodes,
		edges: graph.edges
	};

	var options = {
		edges: {
			smooth: {
				type: 'cubicBezier',
				forceDirection: 'vertical',
				roundness: 0.4
			},
			arrows: { to : true }
		},
		layout: {
			hierarchical: {
				direction: 'UD'
			}
		},
		physics: true
	};
	network = new vis.Network(container, data, options);
}