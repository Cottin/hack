/**
 * @jest-environment node
 */
import compiler from './compiler.js';

describe('Inserts name andoutputs JavaScript', () => {

	it('comment', async () => {
		expect(await compile('comment')).toBe(`# :not_since_inside_comment`);
	})

	it('quote', async () => {
		expect(await compile('quote')).toBe(`':not since inside quote'`);
	})

	it('escaped quote', async () => {
		expect(await compile('quoteEscaped')).toBe(`'\\\\':not since inside quote'`);
	})

	it('double quote', async () => {
		expect(await compile('doubleQuote')).toBe(`\\\":not since inside double quote\\\"`);
	})

	it('double quote multiline', async () => {
		expect(await compile('doubleQuoteMultiline')).toBe(`\\\"multiline\\n:not\\n\\\"`)
	})

	it('double quote interpolate', async () => {
		expect(await compile('doubleQuoteInterpolate')).toBe(`\\\":no #{'yes'} #{/\\\"/g}}\\\"`)
	})

	it('alone', async () => {
		expect(await compile('alone')).toBe(`\\n'alone'`);
	})

	it('assign', async () => {
		expect(await compile('assign')).toBe(`a = 'assign'`);
	})

	it('alone object', async () => {
		expect(await compile('aloneObject')).toBe(`{a: 1, b: 1, c: 1}`);
	})

	it('mixed object', async () => {
		expect(await compile('mixedObject')).toBe(`o = {a: 1, b: {eq: 2}, c: {c1: 1, c2: 1}, d: 1, [e]: 2}`);
	})

	it('object no brackets', async () => {
		expect(await compile('objectNoBrackets')).toBe(`'a': 1\\n\\n[key]: 1`);
	})

	it('quotes in object', async () => {
		expect(await compile('quotesInObject')).toBe(`{a: ':not', b: \\\":not\\\", 'c': {\\\"d\\\": 2}}`);
	})

	it('keyword as object value', async () => {
		expect(await compile('keywordAsObjectValue')).toBe(`{a: 'not_but_too_hard_skip_for_now'}`);
	})

	it('regexp', async () => {
		expect(await compile('regexp')).toBe(`/\\\"([^\\\"]+)\\\":/g.test('hello')\\n\\na / 2\\n\\n///\\n:a\\n///`);
	})

	it.skip('notepad', async () => {
		const output = await compile('notepad')
		console.log(output);
		expect(1).toBe(1)
	})

});

const compile = async (file) => {
	const stats = await compiler(`fixtures/${file}.coffee`);
	const dirtyOutput = stats.toJson({ source: true }).modules[0].source;
	let output = dirtyOutput.replace(/^export default "/, '').replace(/[\\n]*"$/, '')
	return output
}
