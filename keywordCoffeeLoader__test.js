keywordCoffeeLoader = require('./keywordCoffeeLoader')

// run in terminal: node keywordCoffeeLoader__test.js

source = `
import React, {useState} from 'react'

_ = React.createElement

baseSelectors = {}
# TODO: a quote in a comment ' is hard - For now dont use quotes in comments! extra quote to balance out '
baseSelectors.hoc1ho = (body) -> {'@media (hover: hover)': {':hover': {'& .c1:hover': body}}}

# TODO: :both below should not get transformed to {both: 1}
deepEq [expected1, expected1Norm], popsiql1.ramda.options({result: :both}) query1

# TODO: colon here dissapears
console.log 3, sf0(v).replace(/"([^"]+)":/g, '$1:')

Home = () ->
	_ 'div', {},
		_ Hello, {name: 'Victosra:12aasdasds0:12'}

export default Home


Hello = ({name}) ->
	[count, setCount] = useState 1
	test = {:a, b: {b1: 1, :b2}, :c}
	_ 'div', {},
		_ 'div', {}, "Bonjour #{:abc + name} for the #{count} th time"
		_ 'button', {onClick: () -> setCount(count + 1)}, "+"
`

console.log(keywordCoffeeLoader(source));
