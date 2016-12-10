var network = null;
var directionInput = document.getElementById("direction");

function destroy() 
{
	if (network !== null) 
	{
		network.destroy();
		network = null;
	}
}

function draw() {
	destroy();

	var edges = getEdges();

	// create a network
	var container = document.getElementById('mynetwork');
	var data = {
		nodes: personNodes,
		edges: edges
	};

	var options = {
		edges: {
			smooth: {
				type: 'cubicBezier',
				forceDirection: 'vertical',
				roundness: 0.4
			}
		},
		layout: {
			hierarchical: {
				direction: 'UD'
			}
		},
		physics: false
	};
	network = new vis.Network(container, data, options);

	// add event listeners
	network.on('select', function (params) {
		document.getElementById('selection').innerHTML = 'Selection: ' + params.nodes;
	});
}

function getEdges()
{
	var edges = [];

	personNodes.forEach( function( parent )
	{
		parent.children.forEach( function( child )
		{
			edges.push( {
				from: parent.id,
				to: child.id
			} );
		} );
	} );

	marriageRelation.forEach( function( relation ) 
	{
		edges.push( relation );
	} );

	return edges;
}