import { CloseOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Button, Modal, type ModalProps } from 'antd';
import { useState } from 'react';
import './style.less';

const ModalExpandable = (
	props: {
		children?: ((isExpand: boolean) => React.ReactNode) | React.ReactNode;
		/** Có hiển thị full screen ko? Mặc định: Không */
		fullScreen?: boolean;
	} & ModalProps,
) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const { children, fullScreen, ...otherProps } = props;

	return (
		<Modal className={isExpanded || fullScreen ? 'modal-full' : ''} closable={false} {...otherProps}>
			{typeof children === 'function' ? children(isExpanded) : children}

			<div className='modal-buttons'>
				{!fullScreen && (
					<Button
						type='text'
						icon={isExpanded ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
						onClick={() => setIsExpanded((expand) => !expand)}
						className='button'
					/>
				)}

				<Button type='text' icon={<CloseOutlined />} onClick={otherProps.onCancel} className='button' />
			</div>
		</Modal>
	);
};

export default ModalExpandable;
