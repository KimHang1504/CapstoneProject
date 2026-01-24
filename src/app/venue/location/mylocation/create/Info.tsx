'use client';


const TYPES = ["giải trí", "ăn uống", "vui chơi", "khác"] as const
const MOOD_TAGS = ["Thư giãn", "Lãng mạn", "Thân mật", "Ấm cúng", "Năng động", "Yêu thương"] as const

export type VenueFormData = {
  // Info (step 1)
  name: string;
  description: string;
  email: string;
  type: (typeof TYPES)[number];
  mood: (typeof MOOD_TAGS)[number];

  // Contact (step 2)
  address: string;
  googleMapUrl: string;
  hotline: string;
  website: string;
  openTime: string;
  openDays: string;

  // Media (step 3)
  coverImage?: File | null;
  avatarImage?: File | null;
  interiorImages: File[];
  menuImages: File[];
  introVideo?: File | null;

  // Owner verify (step 4)
  ownerFullName: string;
  frontIdCard?: File | null;
  backIdCard?: File | null;
  businessLicense?: File | null;
};


type Props = {
  formData: VenueFormData
  setFormData: React.Dispatch<React.SetStateAction<VenueFormData>>
}


export default function Info({ formData, setFormData }: Props) {
  return (
    <div className="flex items-center justify-center ">
      <div className="w-full max-w-3xl rounded-3xl  px-6 py-10 md:px-10">
        <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">
          Thông tin địa điểm
        </h1>

        {/* Tên địa điểm */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Tên địa điểm<span className="text-pink-500"> *</span>
          </label>
          <input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên chủ địa điểm"
            className="w-full rounded-[8.33] border border-[#E4D7FF] bg-white px-4 py-3 text-sm outline-none focus:border-[#C9A7FF]"
          />
        </div>

        {/* Mô tả ngắn */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Mô tả ngắn<span className="text-pink-500"> *</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            placeholder="Mô tả ngắn gọn về địa điểm tối đa 150 kí tự"
            className="w-full rounded-[8.33] border border-[#E4D7FF] bg-white px-4 py-3 text-sm outline-none focus:border-[#C9A7FF]"
          />
        </div>

        {/* Loại hình */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Loại hình<span className="text-pink-500"> *</span>
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as (typeof TYPES)[number],
              })
            }
            className="w-full rounded-[8.33px] border border-[#E4D7FF] bg-white px-4 py-3 text-sm outline-none focus:border-[#C9A7FF]"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Thẻ tâm trạng */}
        <div className="mb-8">
          <label className="mb-2 block text-sm font-medium text-gray-800">
            Thẻ tâm trạng<span className="text-pink-500"> *</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {MOOD_TAGS.map((tag) => {
              const active = formData.mood === tag

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, mood: tag })
                  }
                  className={`rounded-2xl px-4 py-2 text-sm font-medium shadow-sm transition ${active
                    ? "bg-[#C9A7FF] text-white"
                    : "bg-white text-gray-700"
                    }`}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
