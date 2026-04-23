import { useIntl } from '@umijs/max';
import { Flex, Mentions, Typography } from 'antd';
import React from 'react';
import { WorkflowVariable } from '../type';

const { Text } = Typography;

interface VariableSelectorProps {
	value?: string;
	onChange?: (value: string) => void;
	availableVariables?: WorkflowVariable[];
	placeholder?: string;
	style?: React.CSSProperties;
}

export const VariableSelector: React.FC<VariableSelectorProps> = ({
	value,
	onChange,
	availableVariables = [],
	placeholder,
	style,
}) => {
	const intl = useIntl();

	const options = availableVariables.map((v) => {
		let insertValue = v.value;
		if (insertValue.startsWith('{{')) {
			insertValue = insertValue.substring(2);
		}

		if (!insertValue.endsWith('}}')) {
			insertValue = insertValue + '}}';
		}

		return {
			value: insertValue,
			label: (
				<Flex vertical style={{ padding: '4px 0' }}>
					<Text strong style={{ fontSize: 12 }}>
						{v.nodeName}
					</Text>
					<Flex justify='space-between' align='center'>
						<Text style={{ fontSize: 12 }}>{v.label}</Text>
						<Text type='secondary' style={{ fontSize: 11 }}>
							{v.type}
						</Text>
					</Flex>
				</Flex>
			),
			key: v.value,
			searchName: `${v.nodeName} ${v.label} ${v.value}`,
		};
	});

	return (
		<Mentions
			autoSize={{ minRows: 2, maxRows: 10 }}
			value={value}
			onChange={onChange}
			placeholder={placeholder ?? intl.formatMessage({ id: 'workflow.variable.placeholder' })}
			style={{ width: '100%', minWidth: 200, ...style }}
			className='resizable-mentions'
			prefix={['={{', '{{']}
			split=''
			filterOption={(inputValue, option) => {
				if (!option) return false;
				// @ts-ignore
				const searchName = option.searchName || '';
				return searchName.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1;
			}}
			options={options}
		/>
	);
};
