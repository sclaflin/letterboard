import React, { useRef, useEffect } from 'react';
import styles from './Letter.module.css';

export interface ILetterProps {
	id: number,
	value: string,
	onSelect?: LetterSelectHandler,
	onRef?: (ref: React.RefObject<HTMLDivElement>) => void,
	ref?: React.RefObject<HTMLDivElement>,
	onBoundingRect?: (boundingRect: ClientRect) => void,
	bounds?: ClientRect,
	style: React.CSSProperties,
	classNames: string[]
}

export type LetterSelectHandler = (clientX: number, clientY: number) => void;

const Letter: React.FC<ILetterProps> = (props) => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const div = ref.current;
		if(div) {
			if(props.onRef)
				props.onRef(ref);
			if(props.onBoundingRect)
				props.onBoundingRect(div.getBoundingClientRect());
		}
	});

	const classNames: string[] = props.classNames || [];
	if(classNames.indexOf(styles.letter) === -1)
		classNames.unshift(styles.letter);
	
	const onTouchStart = (e: React.TouchEvent) => {
		e.preventDefault();
		if(props.onSelect)
			props.onSelect(e.touches[0].clientX, e.touches[0].clientY);
	}

	const onMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		if(props.onSelect)
			props.onSelect(e.clientX, e.clientY);
	}

	return (
		<div ref={ ref } style={ props.style } className={ classNames.join(' ') } onMouseDown={ onMouseDown } onTouchStart={ onTouchStart }>{ props.value }</div>
	);
}

export default Letter;