import { useRef, useEffect } from 'react';


export default function useEventListener<T extends EventListener>(eventName: string, listener: T, element = window) {
	// Create a ref that stores handler
	const savedHandler = useRef<T>();

	useEffect(() => {
		savedHandler.current = listener;
	}, [listener]);

	useEffect(() => {
		const isSupported = element && element.addEventListener;
		if (!isSupported) return;
		
		// Create event listener that calls handler function stored in ref
		const eventListener = (event: Event) => {
			if(savedHandler.current)
				savedHandler.current(event);
		}
		
		// Add event listener
		element.addEventListener(eventName, eventListener);
		
		// Remove event listener on cleanup
		return () => {
			element.removeEventListener(eventName, eventListener);
		};
	},
		[eventName, element] // Re-run if eventName or element changes
	);
};