import { tienVietNam } from '@/utils/utils';
import { Empty } from 'antd';
import type { ApexOptions } from 'apexcharts';
import vi from 'apexcharts/dist/locales/vi.json';
import en from 'apexcharts/dist/locales/en.json';
import Chart from 'react-apexcharts';
import { useMediaQuery } from 'react-responsive';
import type { DataChartType } from '.';
import './style.less';
import { getLocale } from '@umijs/max';

const BarChart = (props: DataChartType) => {
	const { title, xAxis, yAxis, yLabel, height = 350, formatY, otherOptions } = props;
	const locale = getLocale();
	const defaultLocale = locale === 'vi-VN' ? 'vi' : 'en';
	if (!xAxis || !yAxis || yAxis.length === 0 || yAxis[0].length === 0) {
		return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' />;
	}

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const isDistributed = yLabel.length === 1;
	const dynamicChartHeight = isMobile ? Math.max(height, xAxis.length * 25) : Math.max(height, xAxis.length * 30);

	const options: ApexOptions = {
		chart: {
			type: 'bar',
			height: dynamicChartHeight,
			toolbar: {
				show: true,
				tools: { download: true },
				export: {
					csv: {
						filename: 'chart-data',
						columnDelimiter: ',',
						headerCategory: 'Danh mục',
						headerValue: 'Giá trị',
					},
					svg: { filename: 'chart-visual' },
					png: { filename: 'chart-visual' },
				},
			},
			defaultLocale: defaultLocale,
			locales: [vi, en],
		},
		title: { text: title },
		plotOptions: {
			bar: {
				horizontal: true,
				borderRadius: 4,
				barHeight: '65%',
				distributed: isDistributed,
			},
		},
		dataLabels: {
			enabled: true,
			formatter: (val: number) => (formatY ? formatY(val) : `${val.toLocaleString()}`).trim(),
		},
		xaxis: { categories: xAxis },
		tooltip: {
			y: { formatter: (val: number) => (formatY ? formatY(val) : tienVietNam(val)) },
			intersect: false,
			shared: true,
		},
		grid: {
			borderColor: '#e0e0e0',
			strokeDashArray: 2,
			xaxis: { lines: { show: true } },
			yaxis: { lines: { show: false } },
		},
		legend: { show: yLabel.length > 1 },
	};

	const series = yLabel.map((label, index) => ({
		name: label,
		data: yAxis[index] ?? [],
	}));

	return (
		<div
			style={{
				width: '100%',
				maxHeight: height,
				overflowY: 'auto',
			}}
		>
			<Chart
				options={{ ...options, ...otherOptions }}
				series={series}
				type='bar'
				width='100%'
				height={dynamicChartHeight}
			/>
		</div>
	);
};

export default BarChart;
