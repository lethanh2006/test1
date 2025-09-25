import { SpecialZoomLevel, Viewer, Worker, type ViewerProps } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { useEffect, useRef, useState } from 'react';

interface PDFViewerProps extends Omit<ViewerProps, 'fileUrl'> {
	/**
	 * URL của file PDF
	 */
	url?: string;
	/**
	 * Dữ liệu PDF dạng ArrayBuffer
	 */
	data?: ArrayBuffer;
	/**
	 * Dữ liệu PDF dạng Uint8Array
	 */
	uint8Array?: Uint8Array;
	/**
	 * Dữ liệu PDF dạng base64
	 */
	base64?: string;

	/**
	 * Nếu dùng trực tiếp PDFViewerV2 thì phải truyền height lên
	 */
	height?: string;
}

const PDFViewerV2 = ({
	url,
	data,
	uint8Array,
	base64,
	height: heightProps,
	plugins,
	defaultScale = SpecialZoomLevel.PageFit,
	...viewerProps
}: PDFViewerProps) => {
	const defaultLayoutPluginInstance = defaultLayoutPlugin();
	const viewerRef = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState('100%');

	let fileUrl: string | Uint8Array = '';
	if (url) {
		fileUrl = url;
	} else if (uint8Array) {
		fileUrl = uint8Array;
	} else if (data) {
		fileUrl = new Uint8Array(data);
	} else if (base64) {
		const binaryString = atob(base64);
		const len = binaryString.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		fileUrl = bytes;
	}

	useEffect(() => {
		const updateHeight = () => {
			if (viewerRef.current) {
				const parentHeight = viewerRef.current.parentElement?.offsetHeight;
				if (parentHeight) {
					setHeight(`${parentHeight}px`);
				}
			}
		};

		updateHeight();
		window.addEventListener('resize', updateHeight);

		return () => {
			window.removeEventListener('resize', updateHeight);
		};
	}, []);

	return (
		<div ref={viewerRef} style={{ height: heightProps ?? height }}>
			<Worker workerUrl='/pdf.worker.min.js'>
				<Viewer
					fileUrl={fileUrl}
					defaultScale={defaultScale}
					plugins={plugins ?? [defaultLayoutPluginInstance]}
					{...viewerProps}
				/>
			</Worker>
		</div>
	);
};

export default PDFViewerV2;
