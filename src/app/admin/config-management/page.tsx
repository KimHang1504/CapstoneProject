'use client';

import { useEffect, useState } from "react";
import { getConfigs, updateConfig } from "@/api/admin/api";
import { Config } from "@/api/admin/type";
import { toast } from "sonner";

export default function SettingsPage() {
    const [configs, setConfigs] = useState<Config[]>([]);
    const [loading, setLoading] = useState(true);

    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [value, setValue] = useState("");
    const [savingKey, setSavingKey] = useState<string | null>(null);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        setLoading(true);
        try {
            const res = await getConfigs(1, 10);
            setConfigs(res.data.items);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleEdit = (config: Config) => {
        setEditingKey(config.configKey);
        setValue(config.configValue);
    };

    const handleSave = async (config: Config) => {
        if (isNaN(Number(value))) {
            toast.error("Giá trị phải là một số");
            return;
        }

        setSavingKey(config.configKey);
        if (config.configKey.includes("PERCENT") && (Number(value) < 0 || Number(value) > 100)) {
            toast.error("Giá trị phần trăm phải từ 0 đến 100");
            setSavingKey(null);
            return;
        }

        try {
            await updateConfig({
                configKey: config.configKey,
                configValue: value,
            });

            setConfigs((prev) =>
                prev.map((c) =>
                    c.configKey === config.configKey
                        ? { ...c, configValue: value }
                        : c
                )
            );

            setEditingKey(null);
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "Lỗi khi cập nhật cấu hình";
            toast.error(errorMessage);
        }

        setSavingKey(null);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f5f3ff] to-white p-8">
            <div className="max-w-4xl mx-auto mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Cấu hình hệ thống
                </h1>
                <p className="text-gray-500">
                    Quản lý các cấu hình ảnh hưởng đến hoạt động của hệ thống
                </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
                {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))
                    : configs.map((config) => {
                        const isEditing = editingKey === config.configKey;
                        const isSaving = savingKey === config.configKey;

                        return (
                            <div
                                key={config.configKey}
                                className="bg-white rounded-2xl shadow p-5 flex justify-between items-center"
                            >
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400 uppercase">
                                        {config.configKey.replaceAll("_", " ")}
                                    </p>

                                    {isEditing ? (
                                        <div className="flex items-center gap-2 mt-2">
                                            <input
                                                value={value}
                                                onChange={(e) => setValue(e.target.value)}
                                                className="border rounded-lg px-3 py-2 w-40 focus:ring-2 focus:ring-[#B388EB]"
                                            />

                                            <span className="text-gray-500 text-sm">
                                                {getUnit(config.configKey)}
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="text-2xl font-semibold text-gray-800 mt-1">
                                            {config.configValue} {getUnit(config.configKey)}
                                        </p>
                                    )}

                                    <p className="text-xs text-gray-400 mt-1">
                                        {config.description}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={() => handleSave(config)}
                                                disabled={isSaving}
                                                className="bg-[#B388EB] text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                            >
                                                {isSaving ? <Spinner /> : "Lưu"}
                                            </button>

                                            <button
                                                onClick={() => setEditingKey(null)}
                                                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                                            >
                                                Hủy
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(config)}
                                            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                                        >
                                            Chỉnh sửa
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}


function getUnit(key: string) {
    if (key.includes("PERCENT")) return "%";
    if (key.includes("MONEY")) return "VND";
    return "";
}


function Spinner() {
    return (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl shadow p-5 animate-pulse flex justify-between">
            <div>
                <div className="h-3 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-48 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
        </div>
    );
}