import { getListTaskByInstanceId, getInforTaskNode } from '@/services/Instance/task';
import { useEffect, useState } from 'react';

export const useInstanceStepHelpers = (danhSach: Instance.IRecord[]) => {
    const [instanceTasksMap, setInstanceTasksMap] = useState<Record<string, Instance.IStepTask[]>>({});
    const [instanceNotesMap, setInstanceNotesMap] = useState<Record<string, string>>({});

    useEffect(() => {
        danhSach.forEach(async (rec) => {
            if (!rec?._id || instanceTasksMap[rec._id]) return;

            const res = await getListTaskByInstanceId(rec._id);
            const sortedTasks = (res?.data?.data || []).sort((a: any, b: any) => (a.depth || 0) - (b.depth || 0));
            setInstanceTasksMap((p) => ({ ...p, [rec._id!]: sortedTasks }));

            const currentNodeId = Array.isArray(rec.currentNodeId) ? rec.currentNodeId[0] : rec.currentNodeId;
            if (!currentNodeId) return;

            const getNote = (data: any) => data?.ketQua?.ghiChu || data?.ghiChu || data?.data?.ghiChu;
            let taskRes = await getInforTaskNode(rec._id, currentNodeId);
            let note = getNote(taskRes?.data?.data);

            if (!note) {
                const currentIndex = sortedTasks.findIndex((t: any) => t.nodeId === currentNodeId);
                if (currentIndex > 0) {
                    taskRes = await getInforTaskNode(rec._id, sortedTasks[currentIndex - 1].nodeId);
                    note = getNote(taskRes?.data?.data);
                }
            }

            if (note) setInstanceNotesMap((p) => ({ ...p, [rec._id!]: note }));
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

    const getNoteForCurrentStep = (record: Instance.IRecord): string | null => {
        return record?._id ? instanceNotesMap[record._id] : null;
    };

    return { getCurrentStepLabel, getAssigneesForCurrentStep, getNoteForCurrentStep };
};
