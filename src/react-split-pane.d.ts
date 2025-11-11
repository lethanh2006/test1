declare module 'react-split-pane' {
	import * as React from 'react';

	export interface SplitPaneProps {
		split?: 'vertical' | 'horizontal';
		minSize?: number | string;
		maxSize?: number | string;
		defaultSize?: number | string;
		size?: number | string;
		onChange?: (size: number) => void;
		onDragFinished?: (size: number) => void;
		className?: string;
		style?: React.CSSProperties;
		allowResize?: boolean;
		primary?: 'first' | 'second';
		children?: React.ReactNode;
	}

	export default class SplitPane extends React.Component<SplitPaneProps> {}
}
