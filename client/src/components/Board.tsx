import React, { useRef, useState } from 'react';
import Letter, { ILetterProps } from './Letter';
import useEventListener from '../hooks/useEventListener';
import styles from './Board.module.css';
import { putLetter } from '../API';

export interface IBoardProps {
	letterPropsArray: ILetterProps[],
	setLetterPropsArray: React.Dispatch<React.SetStateAction<ILetterProps[]>>,
	style: React.CSSProperties
}

//Move the letter to the top of the stack
const moveLetterToTop = (letterPropsArray: ILetterProps[], letterProps: ILetterProps): void => {
	const index = letterPropsArray.indexOf(letterProps);
	if(index === -1)
		throw new Error('letterProps not contained by letterPropsArray.');
	letterPropsArray.splice(index, 1);
	letterPropsArray.push(letterProps);
};

//Add a letter to the stack
const addLetter = (letterPropsArray: ILetterProps[], letterProps: ILetterProps): void => {
	const index = letterPropsArray.indexOf(letterProps);
	if(index >= 0)
		throw new Error('letterProps already added at index '+ index.toString());
	letterPropsArray.push(letterProps);
};

//Toggle the animation for the letter
const animateLetter = (letterProps: ILetterProps, doAnimation: boolean): void => {
	if(doAnimation && letterProps.classNames.indexOf(styles.swinging) === -1)
		letterProps.classNames.push(styles.swinging);
	else if(!doAnimation && letterProps.classNames.indexOf(styles.swinging) !== -1)
		letterProps.classNames.splice(letterProps.classNames.indexOf(styles.swinging), 1);
};

//Update the letter positioning
const moveLetter = (clientX: number, clientY: number, ref: React.RefObject<HTMLDivElement>, letterProps: ILetterProps): void => {
	const div = ref.current;
	if(!div || !letterProps.bounds || !letterProps.ref || !letterProps.ref.current) return;
	
	const boardBounds = div.getBoundingClientRect();
	const letterBounds = letterProps.bounds;

	const style = { ...letterProps.style };

	style.left = (clientX - boardBounds.left - (letterBounds.right - letterBounds.left)/2) +'px';
	style.top = 'calc('+ (clientY - boardBounds.top).toString() +'px - 0.25em)';

	letterProps.style = style;

	//Updating the ref directly to avoid react overhead
	letterProps.ref.current.style.left = style.left;
	letterProps.ref.current.style.top = style.top;
};

//Remove a letter by it's id
const removeLetterById = (letterPropsArray: ILetterProps[], id: number): void => {
	const letterProps = letterPropsArray.find(v => v.id === id);
	if(!letterProps)
		return;
	letterPropsArray.splice(letterPropsArray.indexOf(letterProps), 1);
}

//Update letter transform
const transformLetter = (letterProps: ILetterProps, transform: string, transformOrigin: string): void => {
	if(!letterProps.ref || !letterProps.ref.current)
		return;
	
	letterProps.style = {
		...letterProps.style,
		transform,
		transformOrigin
	};
};

//Update the highlight css class
const hightlightLetters = (letterPropsArray: ILetterProps[], letters: string[]): void => {
	letterPropsArray.forEach(letterProps => {
		const letterIndex = letters.indexOf(letterProps.value);
		const highlightIndex = letterProps.classNames.indexOf(styles.highlight);

		if(letterIndex >= 0 && highlightIndex === -1)
			letterProps.classNames.push(styles.highlight);
		else if(letterIndex === -1 && highlightIndex >= 0)
			letterProps.classNames.splice(highlightIndex, 1);
	});
};


const Board: React.FC<IBoardProps> = (props) => {

	//Create a react ref typed for HMLDivElement
	const ref = useRef<HTMLDivElement>(null);

	//Keep track of currently active letter
	const [curLetter, setCurLetter] = useState<ILetterProps>();
	const [downKeys, setDownKeys] = useState<string[]>([]);

	useEventListener('keydown', ((event: KeyboardEvent) => {
		const char = String.fromCharCode(event.which);
		const index = downKeys.indexOf(char);
		if(index >= 0)
			return;
		downKeys.push(char);
		setDownKeys(downKeys);
		hightlightLetters(props.letterPropsArray, downKeys);

		props.setLetterPropsArray([...props.letterPropsArray]);
	}) as EventListener, window);

	useEventListener('keyup', ((event: KeyboardEvent) => {
		const index = downKeys.indexOf(String.fromCharCode(event.which));
		if(index === -1)
			return;
		downKeys.splice(index, 1);
		setDownKeys(downKeys);
		hightlightLetters(props.letterPropsArray, downKeys);
		
		props.setLetterPropsArray([...props.letterPropsArray]);
	}) as EventListener, window);

	//Ensure that the downKeys persist
	hightlightLetters(props.letterPropsArray, downKeys);

	//Ensure that the curLetter persists
	if(curLetter) {
		removeLetterById(props.letterPropsArray, curLetter.id);
		addLetter(props.letterPropsArray, curLetter);
	}
	
	return <div
		ref={ ref }
		style={ props.style }
		className={ styles.board }
		onTouchMove={(e) => {
			if(!curLetter)
				return;
			e.preventDefault();
			moveLetter(e.touches[0].clientX, e.touches[0].clientY, ref, curLetter);
		}}
		onMouseMove={(e) => {
			if(curLetter === undefined)
				return;
			e.preventDefault();
			moveLetter(e.clientX, e.clientY, ref, curLetter);
		}}
		onTouchEnd={(e) => {
			if(curLetter === undefined)
				return;
			e.preventDefault();

			//assign the current transform to the letter so it maintains rotation
			if(curLetter && curLetter.ref && curLetter.ref.current) {
				const computedStyle = window.getComputedStyle(curLetter.ref.current, null);
				transformLetter(curLetter, computedStyle.transform, computedStyle.transformOrigin);
			}
			
			putLetter(curLetter).catch(e => console.error(e));
			animateLetter(curLetter, false);
			setCurLetter(undefined);
			props.setLetterPropsArray([...props.letterPropsArray]);
		}}
		onMouseUp={(e) => {
			if(curLetter === undefined)
				return;
			
			//assign the current transform to the letter so it maintains rotation
			if(curLetter && curLetter.ref && curLetter.ref.current) {
				const computedStyle = window.getComputedStyle(curLetter.ref.current, null);
				transformLetter(curLetter, computedStyle.transform, computedStyle.transformOrigin);
			}
			
			putLetter(curLetter).catch(e => console.error(e));
			animateLetter(curLetter, false);
			setCurLetter(undefined);
			props.setLetterPropsArray([...props.letterPropsArray]);
		}}>
		{
			props.letterPropsArray.map((letterProp) => {
				return <Letter
					id={ letterProp.id }
					key={ letterProp.id }
					value={ letterProp.value }
					classNames={ letterProp.classNames }
					onRef={( ref: React.RefObject<HTMLDivElement>) => {
						letterProp.ref = ref;
					}}
					onSelect={(clientX: number, clientY: number) => {
						if(curLetter)
							return;
						
						const newLetterProps = [...props.letterPropsArray];
						animateLetter(letterProp, true);
						moveLetterToTop(newLetterProps, letterProp);
						moveLetter(clientX, clientY, ref, letterProp);
						setCurLetter(letterProp);
						
						props.setLetterPropsArray(newLetterProps);
					}}
					onBoundingRect={(boundingRect: ClientRect) => {
						//do nothing if we've already captured the bounding rect
						if(letterProp.bounds)
							return;
						//set the bounding rect
						letterProp.bounds = boundingRect;
						props.setLetterPropsArray([...props.letterPropsArray]);
					}}
					style={ letterProp.style }
				/>;
			})
		}	
	</div>
}

export default Board;