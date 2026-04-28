type Props = {
  total: number;
  approved: number;
  pending: number;
  draft: number;
  rejected: number;
};

const stats = (total: number, approved: number, pending: number, draft: number, rejected: number) => [
  {
    label: "Tổng quảng cáo",
    value: total,
    bg: "from-violet-500 to-purple-600",
    iconBg: "bg-white/20",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
  },
  {
    label: "Đã duyệt",
    value: approved,
    bg: "from-emerald-500 to-green-600",
    iconBg: "bg-white/20",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Chờ duyệt",
    value: pending,
    bg: "from-purple-500 to-indigo-600",
    iconBg: "bg-white/20",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Bản nháp",
    value: draft,
    bg: "from-slate-400 to-gray-500",
    iconBg: "bg-white/20",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    label: "Từ chối",
    value: rejected,
    bg: "from-rose-500 to-red-600",
    iconBg: "bg-white/20",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  }
];

export default function AdvertisementStats({ total, approved, pending, draft, rejected }: Props) {
  return (
    <div className="grid grid-cols-5 gap-5 mb-8">
      {stats(total, approved, pending, draft, rejected).map((s, idx) => (
        <div
          key={s.label}
          className={`relative bg-gradient-to-br ${s.bg} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group`}
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          {/* Decorative circles */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          <div className="absolute -left-2 -bottom-2 w-16 h-16 bg-white/10 rounded-full blur-xl" />
          
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
                {s.label}
              </p>
              <p className="text-4xl font-bold mb-1">{s.value}</p>
              <div className="h-1 w-12 bg-white/30 rounded-full mt-2" />
            </div>
            
            <div className={`${s.iconBg} p-3 rounded-xl backdrop-blur-sm`}>
              {s.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
