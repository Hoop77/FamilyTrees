var btnAddPerson = document.getElementById( "btn-add-person" );
btnAddPerson.onclick = function()
{
	var name = document.getElementById( "txt-name" ).value;
	var male = document.getElementById( "rad-male" ).checked;

	try
	{
		familyTree.addPerson( name, male );
	}
	catch( err )
	{
		showMessage( err );
	}

	draw();
}

var btnMarryPersons = document.getElementById( "btn-marry-persons" );
btnMarryPersons.onclick = function()
{
	var person1 = document.getElementById( "txt-marry-person1" ).value;
	var person2 = document.getElementById( "txt-marry-person2" ).value;

	try
	{
		familyTree.marry( person1, person2 );
	}
	catch( err )
	{
		showMessage( err );
	}

	draw();
}

var btnAddParentChildRelation = document.getElementById( "btn-add-parent-child-relation" );
btnAddParentChildRelation.onclick = function()
{
	var parent = document.getElementById( "txt-parent" ).value;
	var child = document.getElementById( "txt-child" ).value;

	try
	{
		familyTree.addParentChildRelation( parent, child );
	}
	catch( err )
	{
		showMessage( err );
	}

	draw();
}

var btnQueryPerson = document.getElementById( "btn-query-person" );
btnQueryPerson.onclick = function()
{
	clearQueryOutput();

	var name = document.getElementById( "txt-query-person" ).value;

	try
	{
		listPersons( familyTree.querySiblings( name ), "siblings" );
		listPersons( familyTree.queryCousins( name ), "cousins" );
		listPersons( familyTree.queryMaternalUnclesAndAunts( name ), "maternal-uncles-and-aunts" );
		listPersons( familyTree.queryPaternalUnclesAndAunts( name ), "paternal-uncles-and-aunts" );
		listPersons( familyTree.queryGrandparents( name ), "grandparents" );
		listPersons( familyTree.queryGrandchildren( name ), "grandchildren" );
	}
	catch( err )
	{
		showMessage( err );
	}
};

function listPersons( names, elementId )
{
	var el = document.getElementById( elementId );
	names.forEach( function( name )
	{
		addListItem( el, name );
	} );
}

function addListItem( el, content )
{
	var li = document.createElement( "li" );
	li.appendChild( document.createTextNode( content ) );
	el.appendChild( li );
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

function makeHtmlElementEmpty( el )
{
	while( el.firstChild )
		el.removeChild( el.firstChild );
}