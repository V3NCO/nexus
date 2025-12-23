/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(value) {
	// Since locations are now dynamic and stored in the database,
	// we allow any non-empty string to match and handle the
	// existence check in the route handler.
	return !!value && value.length > 0;
}