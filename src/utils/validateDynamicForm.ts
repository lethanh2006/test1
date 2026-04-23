/**
 * Evaluates dynamic validation expressions for Forms and Array/Table inputs.
 * @param formValues Entire form data relative to `$form` 
 * @param targetValue The value being validated relative to `$value`
 * @param thamDinhList The list of validations configured on the field
 * @returns string (First encountered validation error message) or null (If fully valid)
 */
export function validateBieuThucTuyChinh(
	formValues: Record<string, any>,
	targetValue: any,
	thamDinhList: any[],
): string | null {
	if (!thamDinhList || !Array.isArray(thamDinhList)) return null;

	for (const rule of thamDinhList) {
		if (
			rule.loaiPhepToan !== 'Biểu thức tùy chỉnh' &&
			rule.loaiPhepToan !== 'CUSTOM_SCRIPT' &&
			rule.loaiPhepToan !== 'BIEU_THUC_TUY_CHINH'
		) {
			continue;
		}

		const { dieuKienKichHoat, bieuThuc, thongBaoLoi } = rule.value || {};

		const executeExpression = (expression: string, $form: any, $value: any) => {
			if (!expression) return true;
			try {
				const executor = new Function('$form', '$value', `return ${expression};`);
				return executor($form, $value);
			} catch (error) {
				console.error('Expression evaluation error:', expression, error);
				return false;
			}
		};

		const isActivated = dieuKienKichHoat ? executeExpression(dieuKienKichHoat, formValues, targetValue) : true;

		if (isActivated && bieuThuc) {
			const isValid = executeExpression(bieuThuc, formValues, targetValue);
			if (!isValid) {
				return thongBaoLoi || 'Dữ liệu không hợp lệ.';
			}
		}
	}

	return null;
}
