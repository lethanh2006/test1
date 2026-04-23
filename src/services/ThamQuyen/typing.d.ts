import { DeadlineType, ECapChucVu, PhuongThucPhanCong } from "@/services/ThamQuyen/constant";
import { Workflow } from "@/services/Workflow/typing";

declare module ThamQuyen {
  export interface IUserWorkflowNode extends Workflow.WorkflowNode {
    deadline: DeadlineConfig;
    assignee: AssigneeConfig[];
  }

  export type DeadlineConfig =
    | {
      type: DeadlineType.DEADLINE_N_NGAY;
      value: number;
    }
    | {
      type: DeadlineType.DEADLINE_THU_TRONG_TUAN;
      value: number[];
    };

  /**
   * AssigneeConfig - Cấu hình theo từng loại phương thức phân công:
   * - DON_VI_QUAN_LY: danhSachCapChucVu
   * - DON_VI_CU_THE: maDonViXuLy + danhSachThanhVienXuLy
   * - CO_VAN_HOC_TAP: chỉ cần type
   * - NGUOI_CU_THE: danhSachThanhVienXuLy (chỉ ssoId)
   */
  export interface AssigneeConfig {
    type: PhuongThucPhanCong;
    // DON_VI_CU_THE - chọn 1 đơn vị + danh sách cán bộ
    maDonViXuLy?: string | null;
    tenDonVi?: string | null;
    theoDoiToanBo?: boolean;
    tiepNhanDonViCon?: boolean;
    // Danh sách thành viên xử lý (dùng cho DON_VI_CU_THE và NGUOI_CU_THE)
    danhSachThanhVienXuLy?: DanhSachThanhVienXuLy[];
    // DON_VI_QUAN_LY
    danhSachCapChucVu?: ECapChucVu[];

    value?: string;
  }

  export interface DanhSachThanhVienXuLy {
    ssoId?: string | null;
    hoTen?: string | null;
    donViId?: string | null;
    maDonVi?: string | null;
    tenDonVi?: string | null;
    email?: string | null;
    soDienThoai?: string | null;
    hocHam?: string | null;
    hocVi?: string | null;
  }
}

