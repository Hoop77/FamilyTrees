// Example tests:

function AddPersonTests()
{
	function testEmptyString()
	{
		var name = "";	// should throw exception
		var male = true;

		var error = null;

		try
		{
			familyTree.addPerson( name, male );
		}
		catch( err )
		{
			error = err;
		}

		if( error === null )
			return false;	// failed!
		else
			return true;	// success!
	}

	// ...
}