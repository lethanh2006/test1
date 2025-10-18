import { useMemo } from 'react';
import { useModel } from 'umi';

/**
 * Hook để kiểm tra quyền truy cập - Tích hợp trực tiếp không cần file riêng
 * Tái sử dụng được, đơn giản và hiệu quả cho React 19
 */
export const usePermissionCheck = () => {
    const { initialState } = useModel('@@initialState');

    return useMemo(() => {
        const isLoading = initialState?.permissionLoading;
        const permissions = initialState?.authorizedPermissions;
        const scopes = permissions?.map((item) => item.scopes).flat() || [];
        const isReady = !isLoading && !!permissions;

        return {
            /** Trạng thái loading permission */
            isLoading,
            /** Permission đã sẵn sàng chưa */
            isReady,
            /** Danh sách scopes hiện tại */
            scopes,
            /** Danh sách permissions đầy đủ */
            permissions,

            /**
             * Kiểm tra có quyền với một mã chức năng
             */
            hasPermission: (permission: string) => {
                if (!isReady) return false;
                return scopes.includes(permission);
            },

            /**
             * Kiểm tra có ít nhất một quyền trong danh sách
             */
            hasAnyPermission: (permissionList: string[]) => {
                if (!isReady) return false;
                return permissionList.some(permission => scopes.includes(permission));
            },

            /**
             * Kiểm tra có tất cả quyền trong danh sách
             */
            hasAllPermissions: (permissionList: string[]) => {
                if (!isReady) return false;
                return permissionList.every(permission => scopes.includes(permission));
            },

            /**
             * Kiểm tra quyền với route (tương thích với accessFilter)
             */
            checkRouteAccess: (route: { maChucNang?: string; listChucNang?: string[] }) => {
                if (!isReady) return false;

                if (route.maChucNang) {
                    return scopes.includes(route.maChucNang);
                }

                if (route.listChucNang) {
                    return route.listChucNang.some(permission => scopes.includes(permission));
                }

                return false;
            }
        };
    }, [initialState?.permissionLoading, initialState?.authorizedPermissions]);
};

export default usePermissionCheck;