import React, { useState } from "react";
import Board from './components/Board';
import { ILetterProps } from "./components/Letter";
import { getLetters, getBoard } from './API';
import useInterval from './hooks/useInterval';

import style from './App.module.css';
import { errConcat } from "./Utils";

const App: React.FC = () => {
	const [letterPropsArray, setLetterPropsArray] = useState<ILetterProps[]>([]);
	const [boardStyle, setBoardStyle] = useState<React.CSSProperties>({});
	const [initialized, setInitialized] = useState<boolean>(false);
	const [error, setError] = useState<Error>();

	if(!initialized)
		(async () => {
			try {
				setInitialized(true);
				setBoardStyle(await getBoard());
				setLetterPropsArray(await getLetters());
			}
			catch(e) {
				setError(errConcat(e, new Error('Failed to initialize.')));
			}
		})();

	// Poll the API for letter properties
	useInterval(async () => {
		try {
			if(!error)
				setLetterPropsArray(await getLetters());
		}
		catch(e) {
			setError(errConcat(e, new Error('Failed to refresh letters.')));
		}
	}, 2000);

	return (
		<>
		<p className={ style.paragraph }>
			This is an example letter board. The board and the state of it's
			letters are loaded at render time. Letters can be rearranged at
			will. Changes are visible across any other instance of the Board
			component. Use the keyboard to locate a particular letter.
		</p>
		{
			!error ?
				<Board style={boardStyle} letterPropsArray={letterPropsArray} setLetterPropsArray={setLetterPropsArray}></Board> :
				<div>{ error.message }<pre>{ error.stack }</pre></div>
		}
		</>
	);
}

export default App;
