export enum EHocVi {
  CU_NHAN = 'Cử nhân',
  KY_SU = 'Kỹ sư',
  DUOC_SI = 'Dược sĩ',
  BAC_SI = 'Bác sĩ',
  THAC_SI = 'Thạc sĩ',
  TIEN_SI = 'Tiến sĩ',
  TIEN_SI_KHOA_HOC = 'Tiến sĩ khoa học',
}

export enum EHocHam {
  GIAO_SU = 'Giáo sư',
  PHO_GIAO_SU = 'Phó giáo sư',
}

export const tenVietTatHocVi: Record<EHocVi, string> = {
  [EHocVi.CU_NHAN]: 'CN',
  [EHocVi.KY_SU]: 'KS',
  [EHocVi.DUOC_SI]: 'DS',
  [EHocVi.BAC_SI]: 'BS',
  [EHocVi.THAC_SI]: 'ThS',
  [EHocVi.TIEN_SI]: 'TS',
  [EHocVi.TIEN_SI_KHOA_HOC]: 'TSKH',
};

export const tenVietTatHocHam: Record<EHocHam, string> = {
  [EHocHam.GIAO_SU]: 'GS',
  [EHocHam.PHO_GIAO_SU]: 'PGS',
};