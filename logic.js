var personNodes = [];
var marryRelation = [];

function checkPersonExists( person )
{
	for( var i = 0; i < personNodes.length; i++ )
	{
		if( personNodes[ i ].id === person )
			return true;
	}

	return false;
}

function addPerson( person )
{
	personNodes.push( { id: person, label: person, level: 0 } );
}

function getPersonNode( person )
{
	for( var i = 0; i < personNodes.length; i++ )
	{
		var node = personNodes[ i ];
		if( node.id === person )
		{
			return node;
		}
	}

	return null;
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
	marryRelation.push( { from: person1, to: person2 } );
	marryRelation.push( { from: person2, to: person1 } );
	makeSameLevel( person1, person2 );
}

function makeSameLevel( person1, person2 )
{
	node1 = getPersonNode( person1 );
	node2 = getPersonNode( person2 );
	node1.level = node2.level;
}

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

	marry( person1, person2 );

	draw();
};
