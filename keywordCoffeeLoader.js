

// Experiment to support :keyword in CoffeeScript
// a = :myKey -> a = 'myKey'
// o = {:myKey, a: 'Hello'} -> o = {myKey: 1, a: 'Hello'}
// NOTE: this does not seem like a good way of writing a compiler :)
// For now, test by adding cases in Bonjour.coffee and do npm run dev and check the result in Bonjour.coffee in browser (need to restart npm run dev)
module.exports = function keywordCoffeeLoader(source) {
	var res = ''
	var brackCount = 0
	var quote = false
	var keyword = null
	for (var i=0; i<source.length; i++) {
		var c = source[i]

		if (quote) {
			res += c

			if (c === "'") {
				quote = false
			}
		}
		else if (c === "'") {
			quote = true
			res += c
		}
		else if (c === '{') {
			if (source[i-1] !== '#') brackCount++
			res+=c
		}
		else if (c === '}') {
			if (keyword !== null) {
				if (brackCount > 0) {
					res += keyword + ": 1"
				}
				else {
					res += "'" + keyword + "'"
				}
				keyword = null
			}
			res+=c
			brackCount--
		}
		else if (c === ':') {
			if (/[\s\n]/.test(source[i+1]) || /[\w\?]/.test(source[i-1])) {
				res+=c
			}
			else {
				keyword = ''
			}
		}
		else if (keyword !== null) {
			if (/[\W\n]/.test(c)) {
				if (brackCount > 0) {
					res += keyword + ": 1" + c
				}
				else {
					res += "'" + keyword + "'" + c
				}
				keyword = null
			}
			else {
				keyword += c
			}
		}
		else {
			res += c
		}
	}

	// console.log(111)
	// console.log(res)


	return res
}
