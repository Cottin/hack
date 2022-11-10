module.exports = function fastCoffeeLoader(source) {
	// It seems next.js is making sure Fast Refresh works in their defaultLoaders.babel loader
	// by adding $RefreshReg$(_c, "Home"); to compiled files.
	// It seems to be looking for a pattern like var Home = function() {... to determin what is a component.
	// Problem is coffeescript outputs this:
	// var Home;
	// Home = function() 
	// And as a result the RefreshReg are not added and Fast Refresh looses the local state :(
	// I posted a "question" here to just try: https://github.com/vercel/next.js/issues/33772
	//
	// However a simple workaround might be to just add the vars back again.
	// Add this loader between coffee-loder and defaultLoaders.babel

	// Home = function() ->  var Home = function()
	var res = source.replace(/^([A-Z]\w+)\s=\sfunction/gm, 'var $1 = function');

	// export default Home = function()  ->  var Home = function() + export default Home; (at end of source)
	var exportDefault = res.match(/^export default ([A-Z]\w+)\s=\sfunction/m)
	if (exportDefault) {
		res = res.replace(/^export default ([A-Z]\w+)\s=\sfunction/m, 'var $1 = function'); 
		res += '\nexport default '+ exportDefault[1] +';'
	}

	return res
}
