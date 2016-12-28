test();

function test()
{
	var addPersonTests = new AddPersonTests();
	var marryTests = new MarryTests();
	var addParentChildRelationTests = new AddParentChildRelationTests();
	var queryTests = new QueryTests();

	if( addPersonTests.test() && 
		marryTests.test() && 
		addParentChildRelationTests.test() &&
		queryTests.test() )
	{
		console.log( "Tests passed!" );
	}
	else
	{
		console.log( "Tests failed!" );
	}
}

// We test the requirements:
// "Füge eine erste Person zum Baum hinzu." and "Füge eine zusammenhangslose Person zu dem Baum hinzu."
function AddPersonTests()
{
	this.test = function()
	{
		return 	addFirstPerson() && 
				addExistingPerson() && 
				addPersonWithEmptyName() && 
				addPersonWithNonStringNameArgument() &&
				addPersonWithNonBooleanMaleArgument();
	}

	// Note: We only test, if this does not throw an Exception. 
	// At this point, we do not test the "existence" of that person because this is done by other tests.
	function addFirstPerson()
	{
		var tree = new FamilyTree();

		try
		{
			tree.addPerson( "Alexander", true );
			return true;
		}
		catch( err )
		{
			return false;
		}
	}
 
	function addExistingPerson()
	{
		var tree = new FamilyTree();

		try
		{
			tree.addPerson( "Alexander", true );
			tree.addPerson( "Alexander", true );
			return false;
		}
		catch( err )
		{
			if( err !== "'Alexander' existiert bereits!" )
				return false;
		}

		return true;
	}

	function addPersonWithEmptyName()
	{
		var tree = new FamilyTree();

		try
		{
			tree.addPerson( "", true );
			return false;
		}
		catch( err )
		{
			if( err !== "Ungültige Eingabe!" )
				return false;
		}

		return true;
	}

	function addPersonWithNonStringNameArgument()
	{
		var tree = new FamilyTree();

		try
		{
			tree.addPerson( 123, true );
			return false;
		}
		catch( err )
		{
			if( err !== "Ungültige Eingabe!" )
				return false;
		}

		return true;
	}

	function addPersonWithNonBooleanMaleArgument()
	{
		var tree = new FamilyTree();

		try
		{
			tree.addPerson( "Alexander", "no boolean" );
			return false;
		}
		catch( err )
		{
			if( err !== "Ungültige Eingabe!" )
				return false;
		}

		return true;
	}
}

// We test the requirement:
// “Verheirate” eine zusammenhangslose Person mit einer weiteren “unverheirateten” Person in dem Baum."
function MarryTests()
{
	this.test = function()
	{
		return 	marry() &&
				marryNotExistingPerson() &&
				marrySelf() &&
				marryWithMarriedPerson();
	}

	// Note: We only test, if this does not throw an Exception. 
	// At this point, we do not test the "existence" of that marriage relation because this is done by other tests.
	function marry()
	{
		var tree = new FamilyTree();

		try
		{
			tree.addPerson( "Alexander", true );
			tree.addPerson( "Gerda", false );
			tree.marry( "Alexander", "Gerda" );
			return true;
		}
		catch( err )
		{
			return false;
		}
	}

	function marryNotExistingPerson()
	{
		var tree = new FamilyTree();

		try
		{
			tree.addPerson( "Alexander", true );
			tree.marry( "Alexander", "Tom" );
			return false;
		}
		catch( err )
		{
			if( err !== "'Tom' existiert nicht!" )
				return false;
		}

		tree = new FamilyTree();

		try
		{
			tree.addPerson( "Alexander", true );
			tree.marry( "Tom", "Alexander" );
			return false;
		}
		catch( err )
		{
			if( err !== "'Tom' existiert nicht!" )
				return false;
		}

		return true;
	}

	function marrySelf()
	{
		var tree = new FamilyTree();

		try
		{
			tree.addPerson( "Alexander", true );
			tree.marry( "Alexander", "Alexander" );
			return false;
		}
		catch( err )
		{
			if( err !== "Die Personen müssen unterschiedlich sein!" )
				return false;
		}

		return true;
	}

	function marryWithMarriedPerson()
	{
		var tree = new FamilyTree();

		try
		{
			tree.addPerson( "Alexander", true );
			tree.addPerson( "Gerda", false );
			tree.marry( "Alexander", "Gerda" );
			tree.addPerson( "Tom", true );
			tree.marry( "Tom", "Gerda" );
			return false;
		}
		catch( err )
		{
			if( err !== "'Gerda' ist bereits verheiratet!" )
				return false;
		}

		tree = new FamilyTree();

		try
		{
			tree.addPerson( "Alexander", true );
			tree.addPerson( "Gerda", false );
			tree.marry( "Alexander", "Gerda" );
			tree.addPerson( "Tom", true );
			tree.marry( "Gerda", "Tom" );
			return false;
		}
		catch( err )
		{
			if( err !== "'Gerda' ist bereits verheiratet!" )
				return false;
		}

		return true;
	}
}

// We test the requirements:
// “Verheirate” eine zusammenhangslose Person mit einer weiteren “unverheirateten” Person in dem Baum"
function AddParentChildRelationTests()
{
	this.test = function()
	{
		return  addParentChildRelation() &&
				addParentChildRelationOfNotExistingPerson() &&
				makeParentOfSelf() &&
				makeParentOfChildWhichAlreadyHasAParent() &&
				addCycle();
	}

	// Note: We only test, if this does not throw an Exception. 
	// At this point, we do not test the "existence" of that parent-child relation because this is done by other tests.
	function addParentChildRelation()
	{
		var tree = new FamilyTree();

		try
		{
			tree.addPerson( "Alexander", true );
			tree.addPerson( "Tom", true );
			tree.addParentChildRelation( "Alexander", "Tom" );
			return true;
		}
		catch( err )
		{
			return false;
		}
	}

	function addParentChildRelationOfNotExistingPerson()
	{
		var tree = new FamilyTree();

		try
		{
			tree.addPerson( "Alexander", true );
			tree.addParentChildRelation( "Alexander", "Sarah" );
			return false;
		}
		catch( err )
		{
			if( err !== "'Sarah' existiert nicht!" )
				return false;
		}

		tree = new FamilyTree();

		try
		{
			tree.addPerson( "Alexander", true );
			tree.addParentChildRelation( "Sarah", "Alexander" );
			return false;
		}
		catch( err )
		{
			if( err !== "'Sarah' existiert nicht!" )
				return false;
		}

		return true;
	}

	function makeParentOfSelf()
	{
		var tree = new FamilyTree();

		try
		{
			tree.addPerson( "Alexander", true );
			tree.addParentChildRelation( "Alexander", "Alexander" );
			return false;
		}
		catch( err )
		{
			if( err !== "Die Personen müssen unterschiedlich sein!" )
				return false;
		}

		return true;
	}

	function makeParentOfChildWhichAlreadyHasAParent()
	{
		var tree = new FamilyTree();

		try
		{
			tree.addPerson( "Alexander", true );
			tree.addPerson( "Horst", true );
			tree.addPerson( "Tom", true );
			tree.addParentChildRelation( "Alexander", "Tom" );
			tree.addParentChildRelation( "Horst", "Tom" );
			return false;
		}
		catch( err )
		{
			if( err !== "Das Kind hat bereits einen Vater!" )
				return false;
		}

		tree = new FamilyTree();

		try
		{
			tree.addPerson( "Gerda", false );
			tree.addPerson( "Sarah", false );
			tree.addPerson( "Tom", true );
			tree.addParentChildRelation( "Gerda", "Tom" );
			tree.addParentChildRelation( "Sarah", "Tom" );
			return false;
		}
		catch( err )
		{
			if( err !== "Das Kind hat bereits eine Mutter!" )
				return false;
		}

		return true;
	}

	function addCycle()
	{
		var tree = new FamilyTree();

		try
		{
			tree.addPerson( "Alexander", true );
			tree.addPerson( "Tom", true );
			tree.addParentChildRelation( "Alexander", "Tom" );
			tree.addParentChildRelation( "Tom", "Alexander" );
			return false;
		}
		catch( err )
		{
			if( err !== "Die Beziehung würde einen Zyklus entstehen lassen!" )
				return false;
		}

		return true;
	}
}

function QueryTests()
{
	this.test = function()
	{
		return query();
	}

	function createBaseTree()
	{
		var tree = new FamilyTree();

		tree.addPerson( "Alexander", true );
		tree.addPerson( "Bruder", true );
		tree.addPerson( "Schwester", false );
		tree.addPerson( "Vater", true );
		tree.addPerson( "Mutter", false );
		tree.addPerson( "Opa väterlicherseits", true );
		tree.addPerson( "Oma väterlicherseits", false );
		tree.addPerson( "Opa mütterlicherseits", true );
		tree.addPerson( "Oma mütterlicherseits", false );
		tree.addPerson( "Onkel väterlicherseits", true );
		tree.addPerson( "Tante väterlicherseits", false );
		tree.addPerson( "Onkel mütterlicherseits", true );
		tree.addPerson( "Tante mütterlicherseits", false );
		tree.addPerson( "Cousin väterlicherseits", true );
		tree.addPerson( "Cousine väterlicherseits", false );
		tree.addPerson( "Cousin mütterlicherseits", true );
		tree.addPerson( "Cousine mütterlicherseits", false );
		tree.addPerson( "Kind", true );
		tree.addPerson( "Enkelkind", true );

		tree.marry( "Vater", "Mutter" );
		tree.marry( "Opa väterlicherseits", "Oma väterlicherseits" );
		tree.marry( "Opa mütterlicherseits", "Oma mütterlicherseits" );
		tree.marry( "Onkel väterlicherseits", "Tante väterlicherseits" );
		tree.marry( "Onkel mütterlicherseits", "Tante mütterlicherseits" );
		
		tree.addParentChildRelation( "Vater", "Alexander" );
		tree.addParentChildRelation( "Vater", "Bruder" );
		tree.addParentChildRelation( "Vater", "Schwester" );
		tree.addParentChildRelation( "Mutter", "Alexander" );
		tree.addParentChildRelation( "Mutter", "Bruder" );
		tree.addParentChildRelation( "Mutter", "Schwester" );

		tree.addParentChildRelation( "Alexander", "Kind" );
		tree.addParentChildRelation( "Kind", "Enkelkind" );

		tree.addParentChildRelation( "Opa väterlicherseits", "Vater" );
		tree.addParentChildRelation( "Opa väterlicherseits", "Onkel väterlicherseits" );
		tree.addParentChildRelation( "Oma väterlicherseits", "Vater" );
		tree.addParentChildRelation( "Oma väterlicherseits", "Onkel väterlicherseits" );

		tree.addParentChildRelation( "Opa mütterlicherseits", "Mutter" );
		tree.addParentChildRelation( "Opa mütterlicherseits", "Tante mütterlicherseits" );
		tree.addParentChildRelation( "Oma mütterlicherseits", "Mutter" );
		tree.addParentChildRelation( "Oma mütterlicherseits", "Tante mütterlicherseits" );

		tree.addParentChildRelation( "Onkel väterlicherseits", "Cousin väterlicherseits" );
		tree.addParentChildRelation( "Onkel väterlicherseits", "Cousine väterlicherseits" );
		tree.addParentChildRelation( "Tante väterlicherseits", "Cousin väterlicherseits" );
		tree.addParentChildRelation( "Tante väterlicherseits", "Cousine väterlicherseits" );

		tree.addParentChildRelation( "Onkel mütterlicherseits", "Cousin mütterlicherseits" );
		tree.addParentChildRelation( "Onkel mütterlicherseits", "Cousine mütterlicherseits" );
		tree.addParentChildRelation( "Tante mütterlicherseits", "Cousin mütterlicherseits" );
		tree.addParentChildRelation( "Tante mütterlicherseits", "Cousine mütterlicherseits" );

		return tree;
	}

	function query()
	{
		var tree = createBaseTree();

		try
		{
			compareQueryOutput( 
				tree.querySiblings( "Alexander" ),
				[ "Bruder", "Schwester" ] 
			);

			compareQueryOutput( 
				tree.queryCousins( "Alexander" ),
				[ "Cousin mütterlicherseits", "Cousine mütterlicherseits", "Cousin väterlicherseits", "Cousine väterlicherseits" ] 
			);

			compareQueryOutput( 
				tree.queryMaternalUnclesAndAunts( "Alexander" ),
				[ "Tante mütterlicherseits", "Onkel mütterlicherseits" ] 
			);

			compareQueryOutput( 
				tree.queryPaternalUnclesAndAunts( "Alexander" ),
				[ "Onkel väterlicherseits", "Tante väterlicherseits" ] 
			);

			compareQueryOutput( 
				tree.queryGrandparents( "Alexander" ),
				[ "Oma mütterlicherseits", "Opa mütterlicherseits", "Oma väterlicherseits", "Opa väterlicherseits" ] 
			);

			compareQueryOutput( 
				tree.queryGrandchildren( "Alexander" ),
				[ "Enkelkind" ] 
			);

			return true;
		}
		catch( err )
		{
			return false;
		}
	}

	function compareQueryOutput( out1, out2 )
	{
		if( out1.length !== out2.length )
			throw "Wrong query output!";

		out1 = out1.sort();
		out2 = out2.sort();

		for( var i = 0; i < out1.length; i++ )
		{
			if( out1[ i ] !== out2[ i ] )
				throw "Wrong query output!";
		}
		
		return true;
	}
}