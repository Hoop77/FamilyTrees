var personNodes = [];
var marriageRelation = [];

var btnAddPerson = document.getElementById( "btn-add-person" );
btnAddPerson.onclick = function()
{
	var txtName = document.getElementById( "txt-name" );
	var txtGeneration = document.getElementById( "txt-generation" );
	var radMale = document.getElementById( "rad-male" );

	if( !checkStringIsNotEmpty( txtName.value ) ) return;
	if( !checkStringIsInteger( txtGeneration.value ) ) return;

	var name = txtName.value;
	var level = parseInt( txtGeneration.value );
	var male = radMale.checked;

	var node = findPersonNode( name );
	if( !checkInexistence( node, name ) ) return;

	addPerson( name, level, male );
	
	draw();
};

var btnMarryPersons = document.getElementById( "btn-marry-persons" );
btnMarryPersons.onclick = function()
{
	var txtMarryPerson1 = document.getElementById( "txt-marry-person1" );
	var txtMarryPerson2 = document.getElementById( "txt-marry-person2" );

	if( !checkStringIsNotEmpty( txtMarryPerson1.value ) ) return;
	if( !checkStringIsNotEmpty( txtMarryPerson2.value ) ) return;

	var name1 = txtMarryPerson1.value;
	var name2 = txtMarryPerson2.value;

	var node1 = findPersonNode( name1 );
	var node2 = findPersonNode( name2 );

	if( !checkExistence( node1, name1 ) ) return;
	if( !checkExistence( node2, name2 ) ) return;
	if( !checkInequality( node1, node2 ) )
	if( !checkNotMarried( name1 ) ) return;
	if( !checkNotMarried( name2 ) ) return;

	marry( name1, name2 );

	draw();
};

var btnAddParentChildRelation = document.getElementById( "btn-add-parent-child-relation" );
btnAddParentChildRelation.onclick = function()
{
	var txtParent = document.getElementById( "txt-parent" );
	var txtChild = document.getElementById( "txt-child" );

	if( !checkStringIsNotEmpty( txtParent.value ) ) return;
	if( !checkStringIsNotEmpty( txtChild.value ) ) return;

	var parentName = txtParent.value;
	var childName = txtChild.value;

	var parentNode = findPersonNode( parentName );
	var childNode = findPersonNode( childName );

	if( !checkExistence( parentNode, parentName ) ) return;
	if( !checkExistence( childNode, childName ) ) return;
	if( !checkInequality( parentNode, childNode ) ) return;
	if( !checkLevel( parentNode, childNode ) ) return;
	if( !checkChildOfParent( parentNode, childNode ) ) return;
	if( !checkChildAlreadyHasParent( parentNode, childNode ) ) return;

	addParentChildRelation( parentNode, childNode );

	draw();
};

var btnQueryPerson = document.getElementById( "btn-query-person" );
btnQueryPerson.onclick = function()
{
	clearQueryOutput();

	var txtPerson = document.getElementById( "txt-query-person" );
	if( !checkStringIsNotEmpty( txtPerson.value ) ) return;

	var name = txtPerson.value;
	var node = findPersonNode( name );
	if( !checkExistence( node, name ) ) return;

	querySiblings( node );
	queryCousins( node );
	queryMaternalUnclesAndAunts( node );
	queryPaternalUnclesAndAunts( node );
	queryGrandparents( node );
	queryGrandchildren( node );
};

function checkStringIsNotEmpty( str )
{
	if( str.trim().length == 0 )
	{
		showMessage( "Ungültige Eingabe!" );
		return false;
	}

	return true;
}

function checkStringIsInteger( str )
{
	var intVal = parseInt( str );
	if( isNaN( intVal ) )
	{
		showMessage( "Ungültige Eingabe!" );
		return false;
	}

	return true;
}

function checkExistence( node, name )
{
	if( node == null )
	{
		showMessage( "'" + name + "' existiert nicht!" );
		return false;
	}

	return true;
}

function checkInexistence( node, name )
{
	if( node != null )
	{
		showMessage( "'" + name + "' existiert bereits!" );
		return false;
	}

	return true;
}

function checkInequality( node1, node2 )
{
	if( node1 == node2 )
	{
		showMessage( "Die Personen müssen unterschiedlich sein!" );
		return false;
	}

	return true;
}

function checkLevel( parentNode, childNode )
{
	if( childNode.level <= parentNode.level )
	{
		showMessage( "Die Generation des Kindes muss größer sein als die Generation des Elternteils!" );
		return false;
	}

	return true;
}

function checkChildOfParent( parentNode, childNode )
{
	if( isChildOf( childNode, parentNode ) )
	{
		showMessage( "'" + childNode + "' ist bereits ein Kind von '" + parentNode + "'!" );
		return false;
	}

	return true;
}

function checkChildAlreadyHasParent( parentNode, childNode )
{
	if( parentNode.male )
	{
		if( childNode.father != null )
		{
			showMessage( "Das Kind hat bereits einen Vater!" );
			return false;
		}
	}
	else
	{
		if( childNode.mother != null )
		{
			showMessage( "Das Kind hat bereits eine Mutter!" );
			return false;
		}
	}

	return true;
}

function checkNotMarried( personName )
{
	if( isMarried( personName ) )
	{
		showMessage( "'" + personName + "' ist bereits verheiratet!" );
		return false;
	}

	return true;
}

function addPerson( name, level, male )
{
	var newPersonNode = {
		id: name,
		label: name,
		level: level,
		male: male,
		mother: null,
		father: null,
		children: []
	}

	if( male )
		newPersonNode.color = "#97C2FC";
	else
		newPersonNode.color = "#FB7E81";

	personNodes.push( newPersonNode );
}

function findPersonNode( name )
{
	for( var i = 0; i < personNodes.length; i++ )
	{
		var node = personNodes[ i ];
		if( name === node.id )
			return node;
	}

	return null;
}

function findSiblingNodes( personNode )
{
	var motherNode = personNode.mother;
	var fatherNode = personNode.father;

	if( motherNode == null || fatherNode == null )
		return [];

	// A node n' is a sibling of a node n, if it they have the same father AND mother.
	// Therefor, the set of siblings of n is the intersection of the sets of child nodes from its father and mother WITHOUT n itself.
	var siblingNodes = intersection( fatherNode.children, motherNode.children );
	siblingNodes = siblingNodes.filter( function( siblingNode )
	{
		return ( siblingNode.id !== personNode.id );
	} );

	return siblingNodes;
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
	
	if( parentNode.male )
		childNode.father = parentNode;
	else
		childNode.mother = parentNode;
}

function isMarried( personName )
{
	for( var i = 0; i < marriageRelation.length; i++ )
	{
		var relation = marriageRelation[ i ];
		var from = relation.from;
		var to = relation.to;
		if( personName === from || personName === to )
			return true;
	}

	return false;
}

function marry( personName1, personName2 )
{
	// we just need one direction
	marriageRelation.push( { from: personName1, to: personName2 } );
}

function querySiblings( personNode )
{
	var el = document.getElementById( "siblings" );

	var nodes = findSiblingNodes( personNode );
	nodes.forEach( function( node )
	{
		addListItem( el, node.id );
	} );
}

function queryCousins( personNode )
{
	var motherNode = personNode.mother;
	var fatherNode = personNode.father;

	if( motherNode == null || fatherNode == null )
		return;

	var maternalSiblingNodes = findSiblingNodes( motherNode );
	var paternalSiblingNodes = findSiblingNodes( fatherNode );

	var cousinNodes = [];

	maternalSiblingNodes.forEach( function( maternalSiblingNode )
	{
		maternalSiblingNode.children.forEach( function( cousinNode ) 
		{
			cousinNodes.push( cousinNode );
		} );
	} );

	paternalSiblingNodes.forEach( function( paternalSiblingNode )
	{
		paternalSiblingNode.children.forEach( function( cousinNode )
		{
			cousinNodes.push( cousinNode );
		} );
	} );

	var el = document.getElementById( "cousins" );

	cousinNodes.forEach( function( cousinNode ) 
	{
		addListItem( el, cousinNode.id );
	} );
}

function queryMaternalUnclesAndAunts( personNode )
{
	var motherNode = personNode.mother;
	if( motherNode == null )
		return;

	var el = document.getElementById( "maternal-uncles-and-aunts" );

	var nodes = findSiblingNodes( motherNode );
	nodes.forEach( function( node )
	{
		addListItem( el, node.id );
	} );
}

function queryPaternalUnclesAndAunts( personNode )
{
	var fatherNode = personNode.father;
	if( fatherNode == null )
		return;

	var el = document.getElementById( "paternal-uncles-and-aunts" );

	var nodes = findSiblingNodes( fatherNode );
	nodes.forEach( function( node )
	{
		addListItem( el, node.id );
	} );
}

function queryGrandparents( personNode )
{
	var el = document.getElementById( "grandparents" );

	var motherNode = personNode.mother;
	if( motherNode != null )
	{
		var maternalGrandmotherNode = motherNode.mother;
		if( maternalGrandmotherNode != null )
			addListItem( el, maternalGrandmotherNode.id );

		var maternalGrandfatherNode = motherNode.father;
		if( maternalGrandfatherNode != null )
			addListItem( el, maternalGrandfatherNode.id );
	}

	var fatherNode = personNode.father;
	if( fatherNode != null )
	{
		var paternalGrandmotherNode = fatherNode.mother;
		if( paternalGrandmotherNode != null )
			addListItem( el, paternalGrandmotherNode.id );

		var paternalGrandfatherNode = fatherNode.father;
		if( paternalGrandfatherNode != null )
			addListItem( el, paternalGrandfatherNode.id );
	}
}

function queryGrandchildren( personNode )
{
	var el = document.getElementById( "grandchildren" );

	personNode.children.forEach( function( child )
	{
		child.children.forEach( function( grandchild )
		{
			addListItem( el, grandchild.id );
		} );
	} );
}

function clearQueryOutput()
{
	makeElementEmpty( document.getElementById( "siblings" ) );
	makeElementEmpty( document.getElementById( "cousins" ) );
	makeElementEmpty( document.getElementById( "maternal-uncles-and-aunts" ) );
	makeElementEmpty( document.getElementById( "paternal-uncles-and-aunts" ) );
	makeElementEmpty( document.getElementById( "grandparents" ) );
	makeElementEmpty( document.getElementById( "grandchildren" ) );	
}

function showMessage( msg )
{
	alert( msg );
	console.log( msg );
}

function intersection( array1, array2 )
{
	var result = [];
	var i1 = 0, i2 = 0;

	array1.sort();
	array2.sort();

	while( i1 < array1.length && i2 < array2.length )
	{
		el1 = array1[ i1 ];
		el2 = array2[ i2 ];

		if( el1 < el2 )
		{
			i1++;
		}
		else if( el1 > el2 )
		{
			i2++;
		}
		else
		{
			result.push( el1 );
			i1++;
			i2++;
		}
	}

	return result;
}

function addListItem( el, content )
{
	var li = document.createElement( "li" );
	li.appendChild( document.createTextNode( content ) );
	el.appendChild( li );
}

function makeElementEmpty( el )
{
	while( el.firstChild )
		el.removeChild( el.firstChild );
}