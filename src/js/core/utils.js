export function idFromResourceURI(uri) {
	return parseInt(uri.split('/')[3], 10);
}