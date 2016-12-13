var personNodes = [];

var btnAddPerson = document.getElementById( "btn-add-person" );
btnAddPerson.onclick = function()
{
	var txtName = document.getElementById( "txt-name" );
	var txtGeneration = document.getElementById( "txt-generation" );
	var radMale = document.getElementById( "rad-male" );

	if( !checkStringIsNotEmpty( txtName.value ) ) return;
	if( !checkStringIsInteger( txtGeneration.value ) ) return;

	var name = txtName.value;
	var generation = parseInt( txtGeneration.value );
	var male = radMale.checked;

	var node = findPersonNodeByName( name );
	if( !checkInexistence( node, name ) ) return;

	addPersonNode( name, generation, male );
	
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

	var node1 = findPersonNodeByName( name1 );
	var node2 = findPersonNodeByName( name2 );

	if( !checkExistence( node1, name1 ) ) return;
	if( !checkExistence( node2, name2 ) ) return;
	if( !checkInequality( node1, node2 ) ) return;
	if( !checkNotMarried( node1 ) ) return;
	if( !checkNotMarried( node2 ) ) return;

	marry( node1, node2 );

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

	var parentNode = findPersonNodeByName( parentName );
	var childNode = findPersonNodeByName( childName );

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
	var node = findPersonNodeByName( name );
	if( !checkExistence( node, name ) ) return;

	listPersonNodes( findSiblingNodes( node ), "siblings" );
	listPersonNodes( findCousinNodes( node ), "cousins" );
	listPersonNodes( findMaternalUncleAndAuntNodes( node ), "maternal-uncles-and-aunts" );
	listPersonNodes( findPaternalUncleAndAuntNodes( node ), "paternal-uncles-and-aunts" );
	listPersonNodes( findGrandparentNodes( node ), "grandparents" );
	listPersonNodes( findGrandchildNodes( node ), "grandchildren" );
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
	if( childNode.generation <= parentNode.generation )
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
		showMessage( "'" + childNode.name + "' ist bereits ein Kind von '" + parentNode.name + "'!" );
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

function checkNotMarried( node )
{
	if( isMarried( node ) )
	{
		showMessage( "'" + node.name + "' ist bereits verheiratet!" );
		return false;
	}

	return true;
}

function addPersonNode( name, generation, male )
{
	var node = {
		name: name,
		generation: generation,
		male: male,
		mother: null,
		father: null,
		marriagePartner: null,
		children: []
	}

	personNodes.push( node );
}

function findPersonNodeByName( name )
{
	for( var i = 0; i < personNodes.length; i++ )
	{
		var node = personNodes[ i ];
		if( name === node.name )
			return node;
	}

	return null;
}

function findSiblingNodes( node )
{
	var motherNode = node.mother;
	var fatherNode = node.father;

	if( motherNode == null || fatherNode == null )
		return [];

	// A node n' is a sibling of a node n, if it they have the same father AND mother.
	// Therefor, the set of siblings of n is the intersection of the sets of child nodes from its father and mother WITHOUT n itself.
	var siblingNodes = intersection( fatherNode.children, motherNode.children );
	return filterElement( siblingNodes, node );
}

function findCousinNodes( node )
{
	var cousinNodes = [];

	var maternalUncleAndAuntNodes = findMaternalUncleAndAuntNodes( node );
	var paternalUncleAndAuntNodes = findPaternalUncleAndAuntNodes( node );

	maternalUncleAndAuntNodes.forEach( function( maternalUncleOrAuntNode )
	{
		maternalUncleOrAuntNode.children.forEach( function( cousinNode )
		{
			cousinNodes.push( cousinNode );
		} );
	} );

	paternalUncleAndAuntNodes.forEach( function( paternalUncleOrAuntNode )
	{
		paternalUncleOrAuntNode.children.forEach( function( cousinNode )
		{
			cousinNodes.push( cousinNode );
		} );
	} );

	// In case of incest: node can be a cousin of itself and its siblings will occur twice!
	// So we have to do some filtering!
	return filterDuplicates( filterElement( cousinNodes, node ) );
}

function findMaternalUncleAndAuntNodes( node )
{
	var motherNode = node.mother;
	if( motherNode == null )
		return [];

	return findSiblingNodes( motherNode );
}

function findPaternalUncleAndAuntNodes( node )
{
	var fatherNode = node.father;
	if( fatherNode == null )
		return [];

	return findSiblingNodes( fatherNode );
}

function findGrandparentNodes( node )
{
	var grandparentNodes = [];

	var motherNode = node.mother;
	if( motherNode != null )
	{
		var maternalGrandmotherNode = motherNode.mother;
		if( maternalGrandmotherNode != null )
			grandparentNodes.push( maternalGrandmotherNode );

		var maternalGrandfatherNode = motherNode.father;
		if( maternalGrandfatherNode != null )
			grandparentNodes.push( maternalGrandfatherNode );
	}

	var fatherNode = node.father;
	if( fatherNode != null )
	{
		var paternalGrandmotherNode = fatherNode.mother;
		if( paternalGrandmotherNode != null )
			grandparentNodes.push( paternalGrandmotherNode );

		var paternalGrandfatherNode = fatherNode.father;
		if( paternalGrandfatherNode != null )
			grandparentNodes.push( paternalGrandfatherNode );
	}

	// In case of incest we'll have duplicate grandparents.
	return filterDuplicates( grandparentNodes );
} 

function findGrandchildNodes( node )
{
	var grandchildNodes = [];

	node.children.forEach( function( childNode )
	{
		childNode.children.forEach( function( grandchildNode )
		{
			grandchildNodes.push( grandchildNode );
		} );
	} );

	// In case of incest we'll have duplicate grandchildren.
	return filterDuplicates( grandchildNodes );
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

function isMarried( node )
{
	if( node.marriagePartner != null )
		return true;
	
	return false;
}

function marry( node1, node2 )
{
	node1.marriagePartner = node2;
	node2.marriagePartner = node1;
}

function listPersonNodes( nodes, elementId )
{
	var el = document.getElementById( elementId );
	nodes.forEach( function( node )
	{
		addListItem( el, node.name );
	} );
}

function clearQueryOutput()
{
	makeHtmlElementEmpty( document.getElementById( "siblings" ) );
	makeHtmlElementEmpty( document.getElementById( "cousins" ) );
	makeHtmlElementEmpty( document.getElementById( "maternal-uncles-and-aunts" ) );
	makeHtmlElementEmpty( document.getElementById( "paternal-uncles-and-aunts" ) );
	makeHtmlElementEmpty( document.getElementById( "grandparents" ) );
	makeHtmlElementEmpty( document.getElementById( "grandchildren" ) );	
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

function filterElement( array, element )
{
	return array.filter( function( el )
	{
		return ( el != element );
	} );
}

function filterDuplicates( array )
{
	return array.filter( function( el, index, self )
	{
		return index == self.indexOf( el );
	} );
}

function addListItem( el, content )
{
	var li = document.createElement( "li" );
	li.appendChild( document.createTextNode( content ) );
	el.appendChild( li );
}

function makeHtmlElementEmpty( el )
{
	while( el.firstChild )
		el.removeChild( el.firstChild );
}