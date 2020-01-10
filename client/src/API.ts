import { ILetterProps } from './components/Letter';
import axios from 'axios';
import { errConcat } from './Utils';

type ILetterPropsPromiseArray = () => Promise<ILetterProps[]>;
type CSSPropertiesPromise = () => Promise<React.CSSProperties>;
type ILetterPropsPromise = (letterProps: ILetterProps) => Promise<ILetterProps>;

export const getLetters: ILetterPropsPromiseArray = async () => {
	try {
		const uri = window.location.protocol +'//'+ window.location.hostname +':3001/letters';
		let res = await axios.get(uri);
		return res.data.map((v: {}) => {
			//create an object satisfying required properties
			//allow the returned object to override properties
			return {
				id: -1,
				value: '',
				style: {},
				classNames: [],
				...v,
			} as ILetterProps
		});
	}
	catch(e) {
		throw errConcat(e, new Error('Failed to retrieve letters.'));
	}
}

export const getBoard: CSSPropertiesPromise = async () => {
	try {
		const uri = window.location.protocol +'//'+ window.location.hostname +':3001/board';
		let res = await axios.get(uri);
		return res.data;
	}
	catch(e) {
		throw errConcat(e, new Error('Failed to retrieve board style.'));
	}
}

export const putLetter: ILetterPropsPromise = async (letterProps: ILetterProps) => {
	try {
		const uri = window.location.protocol +'//'+ window.location.hostname +':3001/letters';
		await axios.put(uri +'/'+ letterProps.id, {
			id: letterProps.id,
			value: letterProps.value,
			style: {
				...letterProps.style
			},
			classNames: []
		});
		return letterProps;
	}
	catch(e) {
		throw errConcat(e, new Error('Failed to update letter.'));
	}
}