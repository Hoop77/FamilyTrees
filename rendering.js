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

function draw() {
	destroy();

	var graph = getGraph();

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
			}
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

function getGraph()
{
	var nodes = [];
	var edges = [];

	personNodes.forEach( function( personNode )
	{
		nodes.push( getVisNodeFromPersonNode( personNode ) );
		
		personNode.children.forEach( function( childNode )
		{
			edges.push( {
				from: personNode.name,
				to: childNode.name
			} );
		} );

		var marriagePartner = personNode.marriagePartner;
		if( marriagePartner != null )
		{
			edges.push( {
				from: personNode.name,
				to: marriagePartner.name,
				color: "#A000A0"
			} );
		}
	} );

	return { nodes, edges };
}

function getVisNodeFromPersonNode( personNode )
{
	var visNode = {
		id: personNode.name,
		label: personNode.name,
		level: personNode.generation,
	};

	if( personNode.male )
		visNode.color = "#97C2FC";
	else
		visNode.color = "#FB7E81";

	return visNode;
}