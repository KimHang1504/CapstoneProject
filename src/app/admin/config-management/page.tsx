'use client';

import { useEffect, useState } from "react";
import { getConfigs, updateConfig } from "@/api/admin/api";
import { Config } from "@/api/admin/type";
import { toast } from "sonner";
import { Settings, RefreshCw, Edit2, Save, X, Percent, DollarSign, Hash, AlertTriangle, TrendingUp, BarChart3, ChevronDown } from "lucide-react";

export default function SettingsPage() {
    const [configs, setConfigs] = useState<Config[]>([]);
    const [loading, setLoading] = useState(true);

    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [value, setValue] = useState("");
    const [savingKey, setSavingKey] = useState<string | null>(null);
    const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

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
                        className="group px-4 py-2.5 cursor-pointer bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow flex items-center gap-2"
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
                            const isExpanded = expandedKeys.has(config.configKey);

                            const toggleExpand = () => {
                                setExpandedKeys(prev => {
                                    const next = new Set(prev);
                                    if (next.has(config.configKey)) {
                                        next.delete(config.configKey);
                                    } else {
                                        next.add(config.configKey);
                                    }
                                    return next;
                                });
                            };

                            return (
                                <div
                                    key={config.configKey}
                                    className="group bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200"
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-2.5 mb-3">
                                                <div className="mt-0.5 text-slate-400 group-hover:text-blue-500 transition-colors">
                                                    {getConfigIcon(config.configKey)}
                                                </div>
                                                <p className="text-sm font-medium text-slate-900 leading-relaxed flex-1">
                                                    {config.description}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3 ml-7">
                                                {/* Configuration Toggle */}
                                                <button
                                                    onClick={toggleExpand}
                                                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                                                >
                                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                                    <span className="font-medium">Cấu hình</span>
                                                </button>
                                                
                                                <div className="h-3 w-px bg-slate-200"></div>
                                                
                                                {isEditing ? (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            value={value}
                                                            onChange={(e) => setValue(e.target.value)}
                                                            className="border border-blue-300 rounded-lg px-2.5 py-1 w-20 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="0"
                                                            autoFocus
                                                        />
                                                        <span className="text-xs font-medium text-slate-600">
                                                            {getUnit(config.configKey)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold">
                                                        {config.configKey.includes("MIN_REVIEWS")
                                                            ? formatDisplayValue(config.configKey, config.configValue)
                                                            : (
                                                                <>
                                                                    {config.configValue}
                                                                    <span className="text-xs font-medium">{getUnit(config.configKey)}</span>
                                                                </>
                                                            )
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Expanded Config Key */}
                                            {isExpanded && (
                                                <div className="mt-3 ml-7 pl-5 border-l-2 border-slate-200 animate-in slide-in-from-top-2 duration-200">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-slate-500 font-medium">Key cấu hình:</span>
                                                        <code className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                                                            {config.configKey}
                                                        </code>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2 flex-shrink-0">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSave(config)}
                                                        disabled={isSaving}
                                                        className="px-3 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
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
                                                        className="p-2 cursor-pointer border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleEdit(config)}
                                                    className="px-3 py-2 cursor-pointer border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors flex items-center gap-1.5"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Sửa</span>
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
    if (key.includes("THRESHOLD")) return "%";
    if (key.includes("MONEY")) return "VND";
    if (key.includes("RADIUS_M")) return "m";
    if (key.includes("SECONDS")) return "giây";
    if (key.includes("MIN_REVIEWS")) return "đánh giá";
    return "";
}

function formatDisplayValue(key: string, value: string) {
    if (key.includes("MIN_REVIEWS")) {
        const num = Number(value);
        return `${num} đánh giá`;
    }
    return value;
}

function getConfigIcon(key: string) {
    if (key.includes("PERCENT")) return <Percent className="w-4 h-4" />;
    if (key.includes("MONEY")) return <DollarSign className="w-4 h-4" />;
    if (key.includes("THRESHOLD")) return <BarChart3 className="w-4 h-4" />;
    if (key.includes("WARNING")) return <AlertTriangle className="w-4 h-4" />;
    if (key.includes("GOOD")) return <TrendingUp className="w-4 h-4" />;
    return <Hash className="w-4 h-4" />;
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
                    <div className="flex items-start gap-2.5 mb-3">
                        <div className="w-4 h-4 bg-slate-200 rounded"></div>
                        <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                    </div>
                    <div className="flex items-center gap-3 ml-7">
                        <div className="h-3 w-32 bg-slate-200 rounded"></div>
                        <div className="h-3 w-px bg-slate-200"></div>
                        <div className="h-6 w-16 bg-slate-200 rounded-lg"></div>
                    </div>
                </div>
                <div className="h-9 w-20 bg-slate-200 rounded-lg"></div>
            </div>
        </div>
    );
}