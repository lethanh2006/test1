declare module Instance {
  export interface IRecord {
    _id: string;
    donQuyTrinhId: string;
    currentStep?: string;
    workflowId: string;
    trangThai: string;
    currentNodeId: string[];
    nguoiTaoSsoId: string;
    nguoiTaoHoTen: string;
    nguoiXemSsoIds: string[];
    context: Record<string, any>;
    stateNodes: Record<string, any>;
    instanceTasks: InstanceTask[];
    workflow?: Workflow.IRecord;
    createdAt?: string | Date;
    updatedAt?: string | Date;
  }

  export interface IInstanceTask {
    _id: string;
    instanceId: string;
    workflowId: string;
    nodeId?: string;
    ten?: string;
    moTa?: string;
    thanhPhanXyLy?: string;
    donViXuLy?: string;
    nguoiXuLySsoId?: string;
    nguoiXuLyHoTen?: string;
    hanXuLy?: string;
    trangThai: string;
    loai?: string;
    config?: Record<string, any>;
    userInstanceTasks?: UserInstanceTask[];
    data?: Record<string, any>;
    ghiChu?: string;
    ketQua?: Record<string, any>;
    nguoiXuLy?: any;

    createdAt?: string | Date;
    updatedAt?: string | Date;
  }

  export interface IUserInstanceTask {
    _id: string;
    instanceTaskId: string;
    ssoId: string;
    hoTen: string;
    donViId: string;
    maDonVi: string;
    capChucVu: string;
    trangThai: string;
  }

  export interface IStepTask {
    nodeId: string;
    node: INodeInfo;
    clickable: boolean;
    depth: number;
    trangThai: string;
    instanceTask?: IInstanceTask;
  }

  export interface INodeInfo {
    id?: string;
    name?: string;
    type: string;
    config?: Record<string, any>;
    next?: string[];
    position?: { x: number; y: number };
  }
}