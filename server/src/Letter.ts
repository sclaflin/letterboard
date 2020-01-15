import * as Utils from './Utils';
import { Style, StyleProps } from './Style';

export interface LetterProps {
	id: number,
	value: string,
	style: StyleProps
}

export class Letter implements LetterProps {
	private _id!: number;
	private _value!: string;
	private _style!: Style;
	constructor(props: LetterProps) {
		this.id = props.id;
		this.value = props.value;
		this.style = props.style instanceof Style ? props.style : new Style(props.style);
	}
	get id(): number {
		return this._id;
	}
	set id(v: number) {
		Utils.validateParam(v, 'id', ['number']);

		this._id = v;
	}
	get value(): string {
		return this._value;
	}
	set value(v: string) {
		Utils.validateParam(v, 'value', ['string']);
		if(v.length !== 1) {
			throw new TypeError('value must be a single character string.');
		}

		this._value = v;
	}
	get style(): Style {
		return this._style;
	}
	set style(v: Style) {
		Utils.validateParam(v, 'style', undefined, [Style]);
		
		this._style = v;
	}
	toJSON(): LetterProps {
		return {
			id: this.id,
			value: this.value,
			style: this.style.toJSON()
		};
	}
}