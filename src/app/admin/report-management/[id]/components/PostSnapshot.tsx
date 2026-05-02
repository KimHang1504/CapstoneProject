"use client";

import { useEffect, useState } from "react";
import { getUserById } from "@/api/admin/user/api";
import { Users } from "@/api/admin/user/type";
import { User } from "lucide-react";
import Image from "next/image";

export default function PostSnapshot({ snapshot }: any) {
  const data = snapshot.data;
  const [user, setUser] = useState<Users | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!data.AuthorId) return;
      try {
        setLoadingUser(true);
        const result = await getUserById(data.AuthorId);
        setUser(result); // Không cần .data
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [data.AuthorId]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">

      {/* User Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {loadingUser ? (
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          ) : user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.fullName || "User"}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          <div>
            {loadingUser ? (
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            ) : (
              <p className="font-semibold text-gray-900">{user?.fullName || "Người dùng"}</p>
            )}
          </div>
        </div>
        <span className="text-sm text-gray-500">{new Date(data.CreatedAt).toLocaleString()}</span>
      </div>

      {/* Content */}
      <p className="text-gray-800 text-base">{data.Content}</p>

      {/* Hashtags */}
      <div className="flex flex-wrap gap-2">
        {data.HashTags?.map((tag: string, idx: number) => (
          <span
            key={idx}
            className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Media */}
      {data.MediaPayload?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {data.MediaPayload.map((media: any, index: number) => (
            <div key={index} className="rounded-xl overflow-hidden border">
              {media.Type === "IMAGE" ? (
                <img
                  src={media.Url}
                  alt="media"
                  className="w-full h-40 object-cover"
                />
              ) : (
                <video
                  src={media.Url}
                  controls
                  className="w-full h-40 object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>Trạng thái: {data.Status == "PUBLISHED" ? "Công khai" :
          data.status == "PENDING" ? "Chưa công khai" :
            data.status == "FLAGGED" ? "Bị gắn cờ" :
              "Đã ẩn"}
        </span>
        <span>
          Ghi nhận lúc: {new Date(snapshot.capturedAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}