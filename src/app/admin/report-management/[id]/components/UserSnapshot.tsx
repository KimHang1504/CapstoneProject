"use client";

import { useEffect, useState } from "react";
import { getUserById } from "@/api/admin/user/api";
import { Users } from "@/api/admin/user/type";
import { User } from "lucide-react";
import Image from "next/image";

export default function UserSnapshot({ snapshot }: any) {
  const data = snapshot.data;
  const [user, setUser] = useState<Users | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!data.UserId) return;
      try {
        setLoadingUser(true);
        const result = await getUserById(data.UserId);
        setUser(result); // Không cần .data
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [data.UserId]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">

      {/* Header with Avatar */}
      <div className="flex items-center gap-3">
        {loadingUser ? (
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
        ) : user?.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.fullName || "User"}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        )}
        <div className="flex-1">
          {loadingUser ? (
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-1" />
          ) : (
            <h3 className="font-semibold text-lg text-gray-800">
              {user?.fullName || data.FullName || "Người dùng"}
            </h3>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-600 space-y-1">
        <p><strong>Giới tính:</strong> {data.Gender}</p>
        <p><strong>Tình trạng mối quan hệ:</strong> {data.RelationshipStatus}</p>
      </div>

      {/* Bio */}
      <p className="text-gray-800 text-base italic">
        {data.Bio || "Không có bio"}
      </p>

      {/* Footer */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>Ngày tạo: {new Date(data.CreatedAt).toLocaleDateString()}</span>
        <span>
          Ghi nhận lúc: {new Date(snapshot.capturedAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}