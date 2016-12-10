var personNodes = [];
var marriageRelation = [];

var btnAddPerson = document.getElementById( "btn-add-person" );
btnAddPerson.onclick = function()
{
	var txtAddPerson = document.getElementById( "txt-add-person" );
	var txtGeneration = document.getElementById( "txt-generation" );
	var person = txtAddPerson.value;
	var level = parseInt( txtGeneration.value );

	if( level == NaN )
	{
		console.log( "Generation must be a number!" );
		return;
	}

	if( checkPersonExists( person ) )
	{
		console.log( "Person: '" + person + "' already exists!" );
		return;
	}

	addPerson( person, level );
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

	if( parent === child )
	{
		console.log( "Parent and child must be different!" );
		return;
	}

	var parentNode = findPersonNode( parent );
	var childNode = findPersonNode( child );

	if( parentNode == null )
	{
		console.log( "Parent does not exist!" );
		return;
	}

	if( childNode == null )
	{
		console.log( "Child does not exist!" );
		return;
	}

	var parentLevel = parentNode.level;
	var childLevel = childNode.level;

	if( childLevel <= parentLevel )
	{
		console.log( "The generation of child must be greater than generation of parent!" );
		return;
	}

	if( isChildOf( childNode, parentNode ) )
	{
		console.log( "'" + child + "' is already a child of '" + parent + "'!" );
		return;
	}

	if( childNode.parents.length >= 2 )
	{
		console.log( "The child already has 2 parents!" );
		return;
	}

	addParentChildRelation( parentNode, childNode );

	draw();
};

function checkPersonExists( person )
{
	if( findPersonNode( person ) == null )
		return false;

	return true;
}

function addPerson( person, level )
{
	personNodes.push( {
		id: person,
		label: person,
		level: level,
		parents: [],
		children: []
	} );
}

function findPersonNode( person )
{
	for( var i = 0; i < personNodes.length; i++ )
	{
		var node = personNodes[ i ];
		if( person === node.id )
			return node;
	}

	return null;
}

function isChildOf( node, parentNode )
{
	for( var i = 0; i < parentNode.children.length; i++ )
	{
		var childNode = parentNode.children[ i ];
		if( node == childNode )
			return true;
	}

	return false;
}

function addParentChildRelation( parentNode, childNode )
{
	parentNode.children.push( childNode );
	childNode.parents.push( parentNode );
}

function isMarried( person )
{
	for( var i = 0; i < marriageRelation.length; i++ )
	{
		var relation = marriageRelation[ i ];
		var from = relation.from;
		var to = relation.to;
		if( person === from || person === to )
			return true;
	}

	return false;
}

function marry( person1, person2 )
{
	// we just need one direction
	marriageRelation.push( { from: person1, to: person2 } );
}