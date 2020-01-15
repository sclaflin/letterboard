import * as Utils from './Utils';

export interface StyleProps {
	backgroundColor?: string,
	border?: string,
	color?: string,
	fontSize?: string,
	width?: string,
	height?: string,
	position?: string,
	left?: string,
	top?: string,
	transform?: string,
	transformOrigin?: string,
	margin?: string,
	boxShadow?: string
}

export class Style implements StyleProps {
	private _backgroundColor?: string;
	private _border?: string;
	private _color?: string;
	private _fontSize?: string;
	private _width?: string;
	private _height?: string;
	private _position?: string;
	private _left?: string;
	private _top?: string;
	private _transform?: string;
	private _transformOrigin?: string;
	private _margin?: string;
	private _boxShadow?: string;
	constructor(props: StyleProps) {
		this.backgroundColor = props.backgroundColor;
		this.border = props.border;
		this.color = props.color;
		this.fontSize = props.fontSize;
		this.width = props.width;
		this.height = props.height;
		this.position = props.position;
		this.left = props.left;
		this.top = props.top;
		this.transform = props.transform;
		this.transformOrigin = props.transformOrigin;
		this.margin = props.margin;
		this.boxShadow = props.boxShadow;
	}
	get backgroundColor(): string | undefined {
		return this._backgroundColor;
	}
	set backgroundColor(v: string | undefined) {
		Utils.validateParam(v, 'backgroundColor', ['string', 'undefined']);
		
		this._backgroundColor = v;
	}
	get border(): string | undefined {
		return this._border;
	}
	set border(v: string | undefined) {
		Utils.validateParam(v, 'border', ['string', 'undefined']);

		this._border = v;
	}
	get color(): string | undefined {
		return this._color;
	}
	set color(v: string | undefined) {
		Utils.validateParam(v, 'color', ['string', 'undefined']);

		this._color = v;
	}
	get fontSize(): string | undefined {
		return this._fontSize;
	}
	set fontSize(v: string | undefined) {
		Utils.validateParam(v, 'fontSize', ['string', 'undefined']);

		this._fontSize = v;
	}
	get width(): string | undefined {
		return this._width;
	}
	set width(v: string | undefined) {
		Utils.validateParam(v, 'width', ['string', 'undefined']);

		this._width = v;
	}
	get height(): string | undefined {
		return this._height;
	}
	set height(v: string | undefined) {
		Utils.validateParam(v, 'height', ['string', 'undefined']);

		this._height = v;
	}
	get position(): string | undefined {
		return this._position;
	}
	set position(v: string | undefined) {
		Utils.validateParam(v, 'position', ['string', 'undefined']);

		this._position = v;
	}
	get left(): string | undefined {
		return this._left;
	}
	set left(v: string | undefined) {
		Utils.validateParam(v, 'left', ['string', 'undefined']);

		this._left = v;
	}
	get top(): string | undefined {
		return this._top;
	}
	set top(v: string | undefined) {
		Utils.validateParam(v, 'top', ['string', 'undefined']);

		this._top = v;
	}
	get transform(): string | undefined {
		return this._transform;
	}
	set transform(v: string | undefined) {
		Utils.validateParam(v, 'transform', ['string', 'undefined']);

		this._transform = v;
	}
	get transformOrigin(): string | undefined {
		return this._transformOrigin;
	}
	set transformOrigin(v: string | undefined) {
		Utils.validateParam(v, 'transformOrigin', ['string', 'undefined']);

		this._transformOrigin = v;
	}
	get margin(): string | undefined {
		return this._margin;
	}
	set margin(v: string | undefined) {
		Utils.validateParam(v, 'margin', ['string', 'undefined']);

		this._margin = v;
	}
	get boxShadow(): string | undefined {
		return this._boxShadow;
	}
	set boxShadow(v: string | undefined) {
		Utils.validateParam(v, 'boxShadow', ['string', 'undefined']);

		this._boxShadow = v;
	}
	toJSON(): StyleProps {
		return {
			backgroundColor: this.backgroundColor,
			border: this.border,
			color: this.color,
			fontSize: this.fontSize,
			width: this.width,
			height: this.height,
			position: this.position,
			left: this.left,
			top: this.top,
			transform: this.transform,
			transformOrigin: this.transformOrigin,
			margin: this.margin,
			boxShadow: this.boxShadow
		};
	}
}