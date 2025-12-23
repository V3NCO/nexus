/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(value) {
	return !!value && value.length > 0;
}