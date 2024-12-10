declare module 'react-input-mask' {
	import * as React from 'react';
  
	export interface InputMaskProps
	  extends React.InputHTMLAttributes<HTMLInputElement> {
	  mask: string;
	  maskChar?: string | null;
	  alwaysShowMask?: boolean;
	  formatChars?: { [key: string]: string };
	  inputRef?: React.Ref<HTMLInputElement>;
	  beforeMaskedValueChange?: (
		newState: { value: string; selection: { start: number; end: number } },
		oldState: { value: string; selection: { start: number; end: number } },
		userInput: string,
		maskOptions: { mask: string; maskChar: string; alwaysShowMask: boolean; formatChars: { [key: string]: string } }
	  ) => { value: string; selection: { start: number; end: number } };
	}
  
	const InputMask: React.ForwardRefExoticComponent<
	  InputMaskProps & React.RefAttributes<HTMLInputElement>
	>;
	export default InputMask;
}
