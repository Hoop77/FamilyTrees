function PersonNode( name, male )
{
	var self = this;

	self.name = name;
	self.male = male;
	self.mother = null;
	self.father = null;
	self.marriagePartner = null;
	self.children = [];

	self.isMarried = function()
	{
		if( self.marriagePartner !== null )
			return true;
		
		return false;
	}

	self.isParentOf = function( node )
	{
		for( var i = 0; i < self.children.length; i++ )
		{
			var child = self.children[ i ];
			if( node === child )
				return true;
		}

		return false;
	}

	self.isAncestorOf = function( node )
	{
		for( var i = 0; i < self.children.length; i++ )
		{
			var child = self.children[ i ];
			if( node === child || child.isAncestorOf( node ) )
				return true;
		}

		return false;
	}

	self.getSiblings = function()
	{
		if( self.mother === null || self.father === null )
			return [];

		// A node n' is a sibling of a node n, if it they have the same father AND mother.
		// Therefor, the set of siblings of n is the intersection of the sets of child nodes from its father and mother WITHOUT n itself.
		var siblings = intersection( self.father.children, self.mother.children, self.compareFunction );
		return filterElement( siblings, self );
	}

	self.getCousins = function()
	{
		var cousins = [];

		var maternalUnclesAndAunts = self.getMaternalUnclesAndAunts();
		var paternalUnclesAndAunts = self.getPaternalUnclesAndAunts();

		maternalUnclesAndAunts.forEach( function( maternalUncleOrAunt )
		{
			maternalUncleOrAunt.children.forEach( function( cousin )
			{
				cousins.push( cousin );
			} );
		} );

		paternalUnclesAndAunts.forEach( function( paternalUncleOrAunt )
		{
			paternalUncleOrAunt.children.forEach( function( cousin )
			{
				cousins.push( cousin );
			} );
		} );

		// In case of incest: node can be a cousin of itself and its siblings will occur twice!
		return filterDuplicates( cousins );
	}

	self.getMaternalUnclesAndAunts = function()
	{
		var maternalUnclesAndAunts = [];

		if( self.mother !== null )
		{
			self.mother.getSiblings().forEach( function( sibling )
			{
				maternalUnclesAndAunts.push( sibling );
				// also add the marriage partners
				if( sibling.isMarried() )
					maternalUnclesAndAunts.push( sibling.marriagePartner );
			} );
		}

		return filterDuplicates( maternalUnclesAndAunts );
	}

	self.getPaternalUnclesAndAunts = function()
	{
		var paternalUnclesAndAunts = [];

		if( self.father !== null )
		{
			self.father.getSiblings().forEach( function( sibling )
			{
				paternalUnclesAndAunts.push( sibling );
				// also add the marriage partners
				if( sibling.isMarried() )
					paternalUnclesAndAunts.push( sibling.marriagePartner );
			} );
		}

		return filterDuplicates( paternalUnclesAndAunts );
	}

	self.getGrandparents = function()
	{
		var grandparents = [];

		if( self.mother !== null )
		{
			var maternalGrandmother = self.mother.mother;
			if( maternalGrandmother !== null )
				grandparents.push( maternalGrandmother );

			var maternalGrandfather = self.mother.father;
			if( maternalGrandfather !== null )
				grandparents.push( maternalGrandfather );
		}

		if( self.father != null )
		{
			var paternalGrandmother = self.father.mother;
			if( paternalGrandmother !== null )
				grandparents.push( paternalGrandmother );

			var paternalGrandfather = self.father.father;
			if( paternalGrandfather !== null )
				grandparents.push( paternalGrandfather );
		}

		// In case of incest we'll have duplicate grandparents.
		return filterDuplicates( grandparents );
	}

	self.getGrandchildren = function()
	{
		var grandchildren = [];

		self.children.forEach( function( child )
		{
			child.children.forEach( function( grandchild )
			{
				grandchildren.push( grandchild );
			} );
		} );

		// In case of incest we'll have duplicate grandchildren.
		return filterDuplicates( grandchildren );
	}

	self.compareFunction = function( node1, node2 )
	{
		if( node1.name < node2.name ) return -1;
		else if( node1.name > node2.name ) return 1;
		else return 0;
	}
}