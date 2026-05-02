import { getChallengeDetail } from "@/api/admin/api";
import { getVenueDetail } from "@/api/admin/location/api";
import BackButton from "@/components/BackButton";
import {
    Calendar,
    Target,
    Trophy,
    Hash,
    Image as ImageIcon,
    MapPin,
    ListChecks,
    Zap
} from "lucide-react";
import Link from "next/link";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ChallengeDetailPage({ params }: Props) {

    const { id } = await params;

    const res = await getChallengeDetail(id);

    const challenge = res.data;

    // Fetch venue names if venue_id exists in ruleData
    const venueNames: Record<number, string> = {};
    if (challenge.ruleData?.venue_id) {
        await Promise.all(
            challenge.ruleData.venue_id.map(async (venueId: number) => {
                try {
                    const venueRes = await getVenueDetail(venueId);
                    venueNames[venueId] = venueRes.data.name;
                } catch (error) {
                    console.error(`Failed to fetch venue ${venueId}:`, error);
                    venueNames[venueId] = `Địa điểm ${venueId}`;
                }
            })
        );
    }

    const formatDate = (date: string | null) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "Không giới hạn";

    const formatTriggerEvent = (event: string) => {
        const eventMap: Record<string, string> = {
            'POST': 'Đăng bài',
            'CHECKIN': 'Check-in',
            'REVIEW': 'Đánh giá',
        };
        return eventMap[event] || event;
    };

    const formatGoalMetric = (metric: string) => {
        const metricMap: Record<string, string> = {
            'COUNT': 'Số lượng',
            'UNIQUE_LIST': 'Danh sách chỉ định',
            'STREAK': 'Chuỗi liên tiếp',
        };
        return metricMap[metric] || metric;
    };

    const statusConfig =
        challenge.status === "ACTIVE"
            ? {
                label: "Đang hoạt động",
                className: "bg-emerald-100 text-emerald-700"
            }
            : challenge.status === "INACTIVE"
                ? {
                    label: "Không hoạt động",
                    className: "bg-amber-100 text-amber-700"
                }
                : {
                    label: "Đã kết thúc",
                    className: "bg-slate-100 text-slate-700"
                };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <BackButton />
            {/* HEADER */}
            <div className="bg-white rounded-2xl shadow p-6 space-y-5">

                <div className="flex items-center justify-between">

                    <h1 className="text-3xl font-bold text-gray-800">
                        {challenge.title}
                    </h1>

                    <div className="flex items-center gap-3">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusConfig.className}`}>
                            {statusConfig.label}
                        </span>

                        <div className="flex items-center gap-3 bg-[#8093F1] hover:bg-[#6f7bd9] transition rounded-3xl px-4 py-3">
                            <Link href={`/admin/challenge/${challenge.id}/edit`}
                                className="text-sm text-white font-medium"
                            >
                                Chỉnh sửa
                            </Link>
                        </div>
                    </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">

                    {/* TIME */}
                    <div className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 transition rounded-xl px-4 py-3">

                        <Calendar className="text-gray-500" size={20} />

                        <div>
                            <p className="text-gray-500 text-xs">
                                Thời gian
                            </p>

                            <p className="text-gray-700 font-medium">
                                {formatDate(challenge.startDate)} → {formatDate(challenge.endDate)}
                            </p>
                        </div>

                    </div>

                    {/* GOAL */}
                    <div className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 transition rounded-xl px-4 py-3">

                        <Target className="text-gray-500" size={20} />

                        <div>
                            <p className="text-gray-500 text-xs">
                                Mục tiêu
                            </p>

                            <p className="text-gray-700 font-medium">
                                {challenge.targetGoal}
                            </p>
                        </div>

                    </div>

                    {/* REWARD */}
                    <div className="flex items-center gap-3 bg-green-50 hover:bg-green-100 transition rounded-xl px-4 py-3">

                        <Trophy className="text-green-600" size={20} />

                        <div>
                            <p className="text-green-600 text-xs">
                                Phần thưởng
                            </p>

                            <p className="text-green-700 font-semibold">
                                {challenge.rewardPoints} điểm
                            </p>
                        </div>

                    </div>

                </div>

            </div>


            {/* DESCRIPTION */}
            <div className="bg-white rounded-2xl shadow p-6">

                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Zap size={18} />
                    Mô tả thử thách
                </h2>

                <p className="text-gray-700 leading-relaxed">
                    {challenge.description ?? "Chưa có mô tả"}
                </p>

            </div>


            {/* INFO */}
            <div className="bg-white rounded-2xl shadow p-6">

                <h2 className="text-xl font-semibold mb-5">
                    Thông tin thử thách
                </h2>

                <div className="grid sm:grid-cols-2 gap-6">

                    <div>
                        <p className="text-sm text-gray-500">
                            Sự kiện kích hoạt
                        </p>

                        <p className="font-medium text-gray-800">
                            {formatTriggerEvent(challenge.triggerEvent)}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Chỉ số mục tiêu
                        </p>

                        <p className="font-medium text-gray-800">
                            {formatGoalMetric(challenge.goalMetric)}
                        </p>
                    </div>

                </div>

            </div>


            {/* RULES */}
            {challenge.ruleData && (
                ((challenge.ruleData.hash_tags && challenge.ruleData.hash_tags.length > 0) || 
                 challenge.ruleData.has_image || 
                 (challenge.ruleData.venue_id && challenge.ruleData.venue_id.length > 0)) && (
                <div className="bg-white rounded-2xl shadow p-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Quy tắc
                    </h2>

                    <div className="flex flex-wrap gap-3">

                        {challenge.ruleData.hash_tags?.map((tag: string) => (
                            <span
                                key={tag}
                                className="flex items-center gap-1 bg-violet-50 text-violet-700 px-3 py-1 rounded-full text-xs font-medium"
                            >
                                {tag}
                            </span>
                        ))}

                        {challenge.ruleData.has_image && (
                            <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                <ImageIcon size={14} />
                                Bắt buộc có hình ảnh
                            </span>
                        )}

                        {challenge.ruleData.venue_id?.map((id: number) => (
                            <span
                                key={id}
                                className="flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-medium"
                            >
                                <MapPin size={14} />
                                {venueNames[id] || `Địa điểm ${id}`}
                            </span>
                        ))}

                    </div>

                </div>
                )
            )}


            {/* INSTRUCTIONS */}
            {challenge.instructions.length > 0 && (
                <div className="bg-white rounded-2xl shadow p-6">

                    <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                        <ListChecks size={20} />
                        Hướng dẫn thực hiện
                    </h2>

                    <div className="space-y-4">

                        {challenge.instructions
                            .filter((ins: string) => {
                                // Ẩn instruction "Phải có hashtag:" nếu không có hashtag nào
                                if (ins.includes('Phải có hashtag') || ins.includes('hashtag:')) {
                                    return challenge.ruleData?.hash_tags && challenge.ruleData.hash_tags.length > 0;
                                }
                                return true;
                            })
                            .map((ins: string, index: number) => (

                            <div
                                key={index}
                                className="flex gap-4 items-start"
                            >

                                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
                                    {index + 1}
                                </div>

                                <p className="text-gray-700">
                                    {ins}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>
            )}

        </div>
    );
}