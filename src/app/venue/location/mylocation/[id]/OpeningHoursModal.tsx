'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { updateOpeningHours } from '@/api/venue/location/api';
import { toast } from 'sonner';
import { OpeningHour } from '@/api/venue/location/type';
import { useEffect } from 'react';

type OpeningHoursModalProps = {
  locationId: number;
  openingHours?: OpeningHour[] | null;
  onClose: () => void;
  onSuccess: () => void;
};

const DAYS = [
  { value: 2, label: 'Thứ 2' },
  { value: 3, label: 'Thứ 3' },
  { value: 4, label: 'Thứ 4' },
  { value: 5, label: 'Thứ 5' },
  { value: 6, label: 'Thứ 6' },
  { value: 7, label: 'Thứ 7' },
  { value: 8, label: 'Chủ nhật' },
];


export default function OpeningHoursModal({ locationId, openingHours, onClose, onSuccess }: OpeningHoursModalProps) {
  const [saving, setSaving] = useState(false);


  const buildSchedules = (openingHours?: OpeningHour[] | null) => {
    return DAYS.map(day => {
      const found = openingHours?.find(o => o.day === day.value);

      return {
        day: day.value,
        openTime: found?.openTime?.slice(0, 5) || '09:00',
        closeTime: found?.closeTime?.slice(0, 5) || '22:00',
        isClosed: found?.isClosed ?? false,
      };
    });
  };
  const [schedules, setSchedules] = useState(() => buildSchedules(openingHours));


  const updateDay = (day: number, field: string, value: any) => {
    setSchedules(prev =>
      prev.map(d => d.day === day ? { ...d, [field]: value } : d)
    );
  };

  const saveAll = async () => {
    try {
      setSaving(true);
      await updateOpeningHours({
        venueLocationId: locationId,
        openingHours: schedules,
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Save failed', err);
      toast.error('Không thể lưu thay đổi');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    setSchedules(buildSchedules(openingHours));
  }, [openingHours]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Giờ mở cửa trong tuần</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border rounded-xl overflow-hidden">
            <thead className="bg-gray-50 text-sm">
              <tr>
                <th className="p-3 text-left">Ngày</th>
                <th className="p-3 text-center">Mở cửa</th>
                <th className="p-3 text-center">Thời gian mở</th>
                <th className="p-3 text-center">Thời gian đóng</th>
              </tr>
            </thead>

            <tbody>
              {DAYS.map(day => {
                const schedule = schedules.find(s => s.day === day.value)!;

                return (
                  <tr key={day.value} className="border-t border-gray-300">
                    <td className="p-3 font-medium">{day.label}</td>

                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={!schedule.isClosed}
                        onChange={(e) => updateDay(day.value, 'isClosed', !e.target.checked)}
                        className="w-4 h-4 text-violet-600"
                      />
                    </td>

                    <td className="p-3 text-center">
                      <input
                        type="time"
                        disabled={schedule.isClosed}
                        value={schedule.openTime}
                        onChange={(e) => updateDay(day.value, 'openTime', e.target.value)}
                        className="border border-gray-300 rounded-lg px-2 py-1 disabled:bg-gray-100"
                      />
                    </td>

                    <td className="p-3 text-center">
                      <input
                        type="time"
                        disabled={schedule.isClosed}
                        value={schedule.closeTime}
                        onChange={(e) => updateDay(day.value, 'closeTime', e.target.value)}
                        className="border border-gray-300 rounded-lg px-2 py-1 disabled:bg-gray-100"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-gray-300 rounded-md font-semibold"
          >
            Đóng
          </button>
          <button
            onClick={saveAll}
            disabled={saving}
            className="px-6 py-2 bg-linear-to-r from-violet-500 to-purple-600 text-white rounded-md font-semibold disabled:opacity-60"
          >
            {saving ? 'Đang lưu...' : 'Lưu tất cả'}
          </button>
        </div>

      </div>
    </div>
  );
}
