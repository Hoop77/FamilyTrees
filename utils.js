var currentMessage = "";

function showMessage( msg )
{
	alert( msg );
	console.log( msg );
	currentMessage = msg;
}

function intersection( array1, array2, compareFunction )
{
	var result = [];
	var i1 = 0, i2 = 0;

	array1.sort( compareFunction );
	array2.sort( compareFunction );

	while( i1 < array1.length && i2 < array2.length )
	{
		el1 = array1[ i1 ];
		el2 = array2[ i2 ];

		if( compareFunction( el1, el2 ) < 0 )
		{
			i1++;
		}
		else if( compareFunction( el1, el2 ) > 0 )
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