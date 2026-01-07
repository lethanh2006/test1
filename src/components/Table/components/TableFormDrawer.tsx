import { CloseOutlined } from '@ant-design/icons';
import { Button, Drawer } from 'antd';
import React from 'react';
import { useTableContext } from './TableContext';

export const TableFormDrawer: React.FC = () => {
	const { Form, visibleForm, setVisibleForm, title, widthDrawer, maskCloseableForm, destroyModal, formProps } =
		useTableContext();

	if (!Form) return null;

	return (
		<Drawer
			className={widthDrawer === 'full' ? 'drawer-full' : ''}
			maskClosable={maskCloseableForm || false}
			width={widthDrawer !== 'full' ? widthDrawer : undefined}
			footer={false}
			styles={{ body: { padding: 0 } }}
			open={visibleForm}
			destroyOnClose={destroyModal || false}
		>
			<Form title={title ?? ''} {...formProps} />

			<div className='modal-buttons'>
				<Button type='text' icon={<CloseOutlined />} onClick={() => setVisibleForm(false)} className='button' />
			</div>
		</Drawer>
	);
};
