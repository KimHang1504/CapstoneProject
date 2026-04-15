export function BasicInfoCard({ data }: any) {
  return (
    <div className="p-5 rounded-2xl shadow-md bg-white space-y-2">
      <h3 className="font-semibold text-lg">Thông tin cơ bản</h3>
      <p><b>Tiêu đề:</b> {data.title}</p>
      <p><b>Tâm trạng:</b> {data.moodTypeName}</p>
      <p><b>Loại hiển thị:</b> {data.placementType}</p>
    </div>
  );
}