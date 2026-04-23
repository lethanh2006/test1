export enum ETrangThaiInstanceTask {
	MOI_DANG_KY = 'Mới đăng ký',
	DANG_XU_LY = 'Đang xử lý',
	DA_XU_LY = 'Đã xử lý',
	CHUA_XU_LY = 'Chưa xử lý',
	LUU_NHAP = 'Lưu nháp',
	XU_LY_LAI = 'Xử lý lại',
}

export const MapTrangThaiInstanceTask: any = {
	[ETrangThaiInstanceTask.MOI_DANG_KY]: 'MapTrangThaiInstanceTask.MOI_DANG_KY',
	[ETrangThaiInstanceTask.DANG_XU_LY]: 'MapTrangThaiInstanceTask.DANG_XU_LY',
	[ETrangThaiInstanceTask.DA_XU_LY]: 'MapTrangThaiInstanceTask.DA_XU_LY',
	[ETrangThaiInstanceTask.CHUA_XU_LY]: 'MapTrangThaiInstanceTask.CHUA_XU_LY',
	[ETrangThaiInstanceTask.XU_LY_LAI]: 'MapTrangThaiInstanceTask.XU_LY_LAI',
	[ETrangThaiInstanceTask.LUU_NHAP]: 'MapTrangThaiInstanceTask.LUU_NHAP',
};

export const MapTrangThaiInstanceTaskColor: any = {
	[ETrangThaiInstanceTask.MOI_DANG_KY]: 'blue',
	[ETrangThaiInstanceTask.DANG_XU_LY]: 'orange',
	[ETrangThaiInstanceTask.DA_XU_LY]: 'green',
	[ETrangThaiInstanceTask.CHUA_XU_LY]: 'red',
	[ETrangThaiInstanceTask.XU_LY_LAI]: 'red',
	[ETrangThaiInstanceTask.LUU_NHAP]: 'gray',
};
