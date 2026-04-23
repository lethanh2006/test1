import { tenVietTatHocHam, tenVietTatHocVi } from "@/services/ToChucNhanSu/ThongTinNhanSu/constant";

export const formatFullName = (hocHam: string, hocVi: string, hoTen: string, hienThiHocHamHocVi: boolean) => {
	const titles = [
		tenVietTatHocHam[hocHam as keyof typeof tenVietTatHocHam],
		tenVietTatHocVi[hocVi as keyof typeof tenVietTatHocVi],
	]
		.filter(Boolean)
		.join('.');

	return [hienThiHocHamHocVi ? titles : [], hoTen].filter(Boolean).join(' ');
};