var network = null;
var directionInput = document.getElementById("direction");

function destroy() {
	if (network !== null) {
		network.destroy();
		network = null;
	}
}

function draw() {
	destroy(); 

/*
	// randomly create some nodes and edges
	for (var i = 0; i < 15; i++) {
		nodes.push({ id: i, label: String(i) });
	}

	nodes[ 0 ].label = "Horst";

	edges = [
		{ from: 0, to: 1 },
		{ from: 0, to: 6 },
		{ from: 0, to: 13 },
		{ from: 0, to: 11 },
		{ from: 1, to: 2 },
		{ from: 2, to: 3 },
		{ from: 2, to: 4 },
		{ from: 3, to: 5 },
		{ from: 1, to: 10 },
		{ from: 1, to: 7 },
		{ from: 2, to: 8 },
		{ from: 2, to: 9 },
		{ from: 3, to: 14 },
		{ from: 1, to: 12 },
		{ from: 1, to: 6 }
	];

	nodes[0].level = 0;
	nodes[1].level = 1;
	nodes[2].level = 3;
	nodes[3].level = 4;
	nodes[4].level = 4;
	nodes[5].level = 5;
	nodes[6].level = 1;
	nodes[7].level = 2;
	nodes[8].level = 4;
	nodes[9].level = 4;
	nodes[10].level = 2;
	nodes[11].level = 1;
	nodes[12].level = 2;
	nodes[13].level = 1;
	nodes[14].level = 5;
*/

	// create a network
	var container = document.getElementById('mynetwork');
	var data = {
		nodes: personNodes,
		edges: marryRelation
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