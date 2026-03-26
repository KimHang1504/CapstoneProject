'use client';

import { useEffect, useState } from "react";
import { getConfigs, updateConfig } from "@/api/admin/api";
import { Config } from "@/api/admin/type";
import { toast } from "sonner";
import { Settings, RefreshCw, Edit2, Save, X } from "lucide-react";

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
            <div className="max-w-7xl mx-auto p-6 space-y-5">
                {/* HEADER */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
                            <Settings className="w-6 h-6 text-blue-600" />
                            Cấu hình hệ thống
                        </h1>
                        <p className="text-sm text-slate-500 mt-1.5">
                            Quản lý các cấu hình ảnh hưởng đến hoạt động của hệ thống
                        </p>
                    </div>

                    <button
                        onClick={fetchConfigs}
                        disabled={loading}
                        className="group px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        <span className="text-sm font-medium">Tải lại</span>
                    </button>
                </div>

                {/* CONFIG CARDS */}
                <div className="space-y-3">
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
                                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                {config.configKey.replaceAll("_", " ")}
                                            </p>

                                            {isEditing ? (
                                                <div className="flex items-center gap-2 mt-3">
                                                    <input
                                                        value={value}
                                                        onChange={(e) => setValue(e.target.value)}
                                                        className="border border-slate-300 rounded-xl px-3 py-2.5 w-40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-slate-50 transition-all duration-200"
                                                        placeholder="Nhập giá trị..."
                                                    />

                                                    <span className="text-slate-600 text-sm font-medium">
                                                        {getUnit(config.configKey)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <p className="text-2xl font-bold text-slate-800 mt-2">
                                                    {config.configValue} <span className="text-lg text-slate-600">{getUnit(config.configKey)}</span>
                                                </p>
                                            )}

                                            <p className="text-xs text-slate-500 mt-2">
                                                {config.description}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSave(config)}
                                                        disabled={isSaving}
                                                        className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
                                                    >
                                                        {isSaving ? (
                                                            <Spinner />
                                                        ) : (
                                                            <>
                                                                <Save className="w-4 h-4" />
                                                                <span className="text-sm font-medium">Lưu</span>
                                                            </>
                                                        )}
                                                    </button>

                                                    <button
                                                        onClick={() => setEditingKey(null)}
                                                        className="px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 flex items-center gap-2"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        <span>Hủy</span>
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleEdit(config)}
                                                    className="px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 flex items-center gap-2"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    <span>Chỉnh sửa</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 animate-pulse">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="h-3 w-32 bg-slate-200 rounded mb-3"></div>
                    <div className="h-7 w-24 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 w-48 bg-slate-200 rounded"></div>
                </div>
                <div className="h-10 w-28 bg-slate-200 rounded-xl"></div>
            </div>
        </div>
    );
}