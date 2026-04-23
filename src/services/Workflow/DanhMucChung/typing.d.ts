declare module DanhMucChung {
  export interface IRecord {
    _id: string;
    maDanhMuc: string;
    danhSachGiaTri: any[];
    createdAt: string;
    loaiDanhMucNckh: ELoaiDanhMucNCKH;
    maModule: ELoaiDanhMucChung;
    internalPath: string;
    sendSsoId: boolean;

    dataPartitionCode: string;
  }
}