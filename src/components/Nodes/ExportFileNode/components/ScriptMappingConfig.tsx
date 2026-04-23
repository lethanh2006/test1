import { Card, Form } from 'antd';
import JsonEditor from '../../../JsonEditor';

export const ScriptMappingConfig = () => {
	return (
		<Card size='small' title='<> OBJECT DATA / SCRIPT MAPPING'>
			<Form.Item name='data' style={{ marginBottom: 16 }}>
				<JsonEditor
					height={300}
					options={{
						minimap: { enabled: false },
						lineNumbers: 'on',
						scrollBeyondLastLine: false,
						language: 'javascript',
					}}
				/>
			</Form.Item>
		</Card>
	);
};
