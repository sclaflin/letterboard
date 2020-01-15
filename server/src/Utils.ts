export function errConcat(src: Error, target: Error): Error {
	target.stack += '\nCaused By:\n'+ src.stack;
	return target;
}
export function validateParam(param: any, name: string, primitives?: string[] | null, instances?: Function[] | null): void {
	if(primitives && primitives.indexOf(typeof param) === -1) {
		throw new TypeError(name +' must be a: '+ primitives.join(', '));
	}
	if(instances && instances.filter(v => param instanceof v).length === 0) {
		throw new TypeError(name +' must be an instance of: '+ instances.map(v => v.name));
	}
}