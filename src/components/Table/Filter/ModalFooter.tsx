import { CloseOutlined, FilterFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { useIntl } from 'umi';

interface ModalFooterProps {
	onReset: () => void;
	onCancel: () => void;
}

export const ModalFooter = ({ onReset, onCancel }: ModalFooterProps) => {
	const intl = useIntl();

	return [
		<Button key='submit' htmlType='submit' type='primary' icon={<FilterFilled />} form='custom-filter-form'>
			{intl.formatMessage({ id: 'global.table.customfilter.button.apdung' })}
		</Button>,
		<Button key='reset' danger icon={<CloseOutlined />} onClick={onReset}>
			{intl.formatMessage({ id: 'global.table.customfilter.button.xoa' })}
		</Button>,
		<Button key='cancel' onClick={onCancel}>
			{intl.formatMessage({ id: 'global.table.customfilter.button.huy' })}
		</Button>,
	];
};
