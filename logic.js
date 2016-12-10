var rootNodes = [];
var marryRelation = [];

var btnAddPerson = document.getElementById( "btn-add-person" );
btnAddPerson.onclick = function()
{
	var txtAddPerson = document.getElementById( "txt-add-person" );
	var person = txtAddPerson.value;

	if( checkPersonExists( person ) )
	{
		console.log( "Person: '" + person + "' already exists!" );
		return;
	}

	addPerson( person );
	console.log( "Person: '" + person + "' added." );
	
	draw();
};

var btnMarryPersons = document.getElementById( "btn-marry-persons" );
btnMarryPersons.onclick = function()
{
	var txtMarryPerson1 = document.getElementById( "txt-marry-person1" );
	var txtMarryPerson2 = document.getElementById( "txt-marry-person2" );
	var person1 = txtMarryPerson1.value;
	var person2 = txtMarryPerson2.value;

	if( person1 === person2 )
	{
		console.log( "The personNodes are equal!" );
		return;
	}

	if( !checkPersonExists( person1 ) )
	{
		console.log( "'" + person1 + "' does not exist!" );
		return;
	}

	if( !checkPersonExists( person2 ) )
	{
		console.log( "'" + person2 + "' does not exist!" );
		return;
	}

	if( isMarried( person1 ) )
	{
		console.log( "'" + person1 + "' is already married!" );
		return;
	}

	if( isMarried( person2 ) )
	{
		console.log( "'" + person2 + "' is already married!" );
		return;
	}

	if( !isIncoherent( person2 ) )
	{
		console.log( "'" + person2 + "' must be incoherent!" );
		return;
	}

	marry( person1, person2 );

	draw();
};

var btnAddParentChildRelation = document.getElementById( "btn-add-parent-child-relation" );
btnAddParentChildRelation.onclick = function()
{
	var txtParent = document.getElementById( "txt-parent" );
	var txtChild = document.getElementById( "txt-child" );
	var parent = txtParent.value;
	var child = txtChild.value;

	var parentResult = findRootAndPersonNode( parent );
	var childResult = findRootAndPersonNode( child );

	if( parentResult == null )
	{
		console.log( "'" + parent + "' does not exist!" );
		return;
	}

	if( childResult == null )
	{
		console.log( "'" + child + "' does not exist!" );
		return;
	}

	var parentRoot = parentResult.rootNode;
	var parentNode = parentResult.personNode;
	var childRoot = childResult.rootNode;
	var childNode = childResult.personNode;

	if( parentRoot != childRoot )
	{
		if( childRoot != childNode )
		{
			console.log( "A child of another tree must be be the root!" );
			return;
		}

		addParentChildRelation( parentNode, childRoot );
		setNodeLevel( childRoot, parentNode.level + 1 );
		removeRoot( childRoot );
	}
	else
	{
		var parentLevel = parentNode.level;
		var childLevel = childNode.level;
		if( childLevel != parentLevel + 1 )
		{
			console.log( "Invalid relationship!" );
			return;
		}

		addParentChildRelation( parentNode, childNode );
	}

	draw();
};

function checkPersonExists( person )
{
	var result = findRootAndPersonNode( person );
	
	if( result != null )
		return true;
	
	return false;
}

function addPerson( person )
{
	addRoot( person );
}

function getPersonNode( person )
{
	var result = findRootAndPersonNode( person );

	if( result == null )
		return null;
	
	return result.personNode;
}

// A person is incoherent if it appears as a root node with no children.
function isIncoherent( person )
{
	for( var i = 0; i < rootNodes.length; i++ )
	{
		var rootNode = rootNodes[ i ];
		if( rootNode.id === person && rootNode.children.length == 0 )
			return true;
	}

	return false;
}

function isMarried( person )
{
	for( var i = 0; i < marryRelation.length; i++ )
	{
		var from = marryRelation[ i ].from;
		var to = marryRelation[ i ].to;

		if( person === from || person === to )
		{
			return true;
		}
	}

	return false;
}

function marry( person1, person2 )
{
	// we just need one direction
	marryRelation.push( { from: person1, to: person2 } );
	makeSameLevel( person1, person2 );
}

function makeSameLevel( person1, person2 )
{
	node1 = getPersonNode( person1 );
	node2 = getPersonNode( person2 );
	node2.level = node1.level;
}

function findRootAndPersonNode( person )
{
	for( var i = 0; i < rootNodes.length; i++ )
	{
		var rootNode = rootNodes[ i ];
		var personNode = findPersonNode( rootNode, person );
		if( personNode != null )
		{
			return { rootNode: rootNode, personNode: personNode };
		}
	}

	return null;
}

function findPersonNode( node, person )
{
	// simple recursive tree traversal
	if( node.id === person )
		return node;

	for( var i = 0; i < node.children.length; i++ )
	{
		var result = findPersonNode( node.children[ i ], person );
		if( result != null )
			return result; 
	}

	return null;
}

function addRoot( person )
{
	rootNodes.push( { 
		id: person, 
		label: person, 
		level: 0,
		children: []
	} );
}

function addParentChildRelation( parentNode, childNode )
{
	parentNode.children.push( childNode );
}

function setNodeLevel( node, level )
{
	node.level = level;

	for( var i = 0; i < node.children.length; i++ )
	{
		var child = node.children[ i ];
		setNodeLevel( child, level + 1 );
	}
}

function removeRoot( rootNode )
{
	for( var i = 0; i < rootNodes.length; i++ )
	{
		if( rootNode == rootNodes[ i ] )
		{
			rootNodes.splice( i, 1 );
		}
	}
}