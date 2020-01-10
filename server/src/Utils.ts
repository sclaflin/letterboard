export function errConcat(src: Error, target: Error): Error {
	target.stack += '\nCaused By:\n'+ src.stack;
	return target;
}