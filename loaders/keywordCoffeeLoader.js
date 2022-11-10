// Experiment to support :keyword in CoffeeScript
// a = :myKey -> a = 'myKey'
// o = {:myKey, a: 'Hello'} -> o = {myKey: 1, a: 'Hello'}
// NOTE: this is probably not the best way to write a compiler/transpiler
module.exports = function loader(source) {
	var res = ''
	let i = 0

	const isComment = (c) => c === '#'
	const comment = () => {
		//console.log('comment');
		let ret = '#'
		i++
		while (i < source.length) {
			let c = source[i]
			ret += c
			if (/\n/.test(c)) {
				return ret
			}
			i++
		}
	}
	const isQuote = (c) => c === "'"
	const quote = () => {
		//console.log('quote');
		let ret = "'"
		i++
		while (i < source.length) {
			let c = source[i]
			ret += c
			if (c === "'" && source[i-1] !== "\\") {
				return ret
			}
			i++
		}
	}
	const isDoubleQuote = (c) => c === '"'
	const doubleQuote = () => {
		//console.log('doubleQuote');
		let ret = '"'
		i++
		while (i < source.length) {
			let c = source[i]
			if (c === '"' && source[i-1] !== "\\") {
				ret += c
				return ret
			}
			else if (c === '{' && source[i-1] === '#') {
				ret += interpolate()
			}
			else {
				ret += c
			}
			i++
		}
	}
	const isRegExpMulti = (c) => c === '/' && source[i+1] === '/' && source[i+2] === '/'
	const regExpMulti = () => {
		//console.log('regExpMulti');
		let ret = '///'
		i = i + 3
		while (i < source.length) {
			let c = source[i]

			ret += c
			if (c === '/' && source[i-1] === '/' && source[i-2] === '/') {
				return ret
			}
			i++
		}
	}
	const isRegExp = (c) => c === '/' && !/[\s]/.test(source[i+1])
	const regExp = () => {
		//console.log('regExp');
		let ret = '/'
		i++
		while (i < source.length) {
			let c = source[i]

			ret += c
			if (c === '/' && source[i-1] !== "\\") {
				return ret
			}
			i++
		}
	}
	const interpolate = () => {
		//console.log('interpolate');
		let ret = '{'
		i++
		while (i < source.length) {
			let c = source[i]

			if (c === '}') {
				ret += '}'
				return ret
			}
			else if (isComment(c)) { ret += comment() }
			else if (isQuote(c)) { ret += quote() }
			else if (isDoubleQuote(c)) { ret += doubleQuote() }
			else if (isRegExp(c)) { ret += regExp() }
			else if (isKeyword(c)) { ret += keyword() }
			else if (isBracket(c)) { ret += bracket() }
			else { ret += c }

			i++
		}
	}
	const isBracket = (c) => c === '{'
	const bracket = () => {
		//console.log('bracket');
		let ret = '{'
		i++
		while (i < source.length) {
			let c = source[i]
			if (c === '}') {
				ret += c
				return ret
			}
			else if (isQuote(c)) { ret += quote() }
			else if (isDoubleQuote(c)) { ret += doubleQuote() }
			else if (isBracket(c)) { ret += bracket() }
			else if (isKeyword(c) && !/['"\]]$/.test(ret)) {
				let type = (/:[\s]*$/.test(ret)) ? 'string' : 'object'
				ret += keyword(type)
			}
			else {
				ret += c
			}
			i++
		}
	}
	const isKeyword = (c) => c === ':' && !/[\w'"\]]/.test(source[i-1])
	const keyword = (type = 'string') => { // 'string', 'object'
		//console.log('keyword', type);
		let ret = ''
		i++
		while (i < source.length) {
			let c = source[i]
			if (!/\w/.test(c)) {
				i--
				if (type === 'object') { return `${ret}: 1` }
				else if (type === 'string') { return `'${ret}'` }
			}
			else {
				ret += c
			}
			i++
		}

	}

	while (i < source.length) {
		var c = source[i]

		if (isComment(c)) { res += comment() }
		else if (isQuote(c)) { res += quote() }
		else if (isDoubleQuote(c)) { res += doubleQuote() }
		else if (isRegExpMulti(c)) { res += regExpMulti() }
		else if (isRegExp(c)) { res += regExp() }
		else if (isKeyword(c)) { res += keyword() }
		else if (isBracket(c)) { res += bracket() }
		else { res += c }

		i++
	}
		
	// This is not nice but when testing, switch to export default
	return res 
  // return `export default ${JSON.stringify(res)}`;
}