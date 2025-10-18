declare module PhanVungDuLieu {
	export interface IRecord {
		_id: string;
		ma: string;
		name: string;
		parentCode: string;
		maMau: string;
	}

	export interface IUser {
		_id: string;
		dataPartitionCode: string;
		dataPartition?: IRecord;

		userId: string;
		userFullname: string;
		userCode: string;
		userEmail: string;
	}
}
