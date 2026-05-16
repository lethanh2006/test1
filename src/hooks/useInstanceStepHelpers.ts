import { getListTaskByInstanceId } from '@/services/Instance/task';
import { useEffect, useState } from 'react';

export const useInstanceStepHelpers = (danhSach: Instance.IRecord[]) => {
    const [instanceTasksMap, setInstanceTasksMap] = useState<Record<string, Instance.IStepTask[]>>({});

    useEffect(() => {
        danhSach.forEach((rec) => {
            if (!rec?._id) return;
            setInstanceTasksMap((prev) => {
                if (prev[rec._id!]) return prev; // check trong setter tránh stale closure
                getListTaskByInstanceId(rec._id!).then((res) => {
                    const tasks: Instance.IStepTask[] = res?.data?.data || [];
                    setInstanceTasksMap((p) => ({
                        ...p,
                        [rec._id!]: tasks.sort((a, b) => (a.depth || 0) - (b.depth || 0)),
                    }));
                });
                return prev;
            });
        });
    }, [danhSach]);

    const getClickableTasks = (tasks: Instance.IStepTask[]) => {
        const lastClickableDepth = tasks.findLast((t) => t.clickable)?.depth ?? 0;
        return tasks.filter((t) => t.clickable || t.depth > lastClickableDepth);
    };

    const getAssigneeLabel = (task: Instance.IStepTask): string => {
        const assignees = task?.node?.config?.assignee ?? [];
        if (!assignees.length) return '-';

        return assignees
            .map((item: any) => {
                if (item?.danhSachThanhVienXuLy?.length) {
                    return item.danhSachThanhVienXuLy
                        .map((m: any) => m.hoTen)
                        .filter(Boolean)
                        .join(', ');
                }
                return item.tenDonVi ?? item.type ?? '-';
            })
            .filter(Boolean)
            .join(', ') || '-';
    };

    const getStepNameFromRecord = (record: Instance.IRecord): string => {
        if (record?.currentStep) return record.currentStep.trim();

        const nodeIds = Array.isArray(record?.currentNodeId)
            ? record.currentNodeId
            : record?.currentNodeId
                ? [record.currentNodeId]
                : [];
        if (!nodeIds.length) return '';

        const tasks = record?.instanceTasks?.length
            ? record.instanceTasks
            : (instanceTasksMap[record._id!] ?? []);

        return tasks.find((t: any) => nodeIds.includes(t?.nodeId))?.node?.name?.trim() || '';
    };

    const findCurrentTask = (record: Instance.IRecord) => {
        const nodeIds = Array.isArray(record?.currentNodeId)
            ? record.currentNodeId
            : record?.currentNodeId
                ? [record.currentNodeId]
                : [];

        const tasks = record?.instanceTasks?.length
            ? record.instanceTasks
            : (instanceTasksMap[record._id!] ?? []);

        const clickable = getClickableTasks(tasks);
        const index = clickable.findIndex((t: any) =>
            nodeIds.includes(t?.nodeId) || nodeIds.includes(t?.node?.id)
        );

        return { task: clickable[index], index, total: clickable.length, hasData: tasks.length > 0 };
    };

    const getCurrentStepLabel = (record: Instance.IRecord): string => {
        const stepName = getStepNameFromRecord(record);
        if (!stepName) return '-';

        const { index, total, hasData } = findCurrentTask(record);
        if (!hasData) return stepName;

        return index >= 0 ? `${stepName} (${index + 1}/${total})` : stepName;
    };

    const getAssigneesForCurrentStep = (record: Instance.IRecord): string => {
        const stepName = getStepNameFromRecord(record);
        if (!stepName) return '-';

        const { task, hasData } = findCurrentTask(record);
        if (!hasData) return '-';

        return task ? getAssigneeLabel(task) : '-';
    };

    return { getCurrentStepLabel, getAssigneesForCurrentStep };
};
