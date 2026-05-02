// 'use client';

// import Image from 'next/image';
// import { ChevronDown, LogOut, User } from 'lucide-react';
// import { UserProfile } from '@/api/auth/type';

// type Props = {
//   title?: string;
//   userProfile: UserProfile | null;
//   onLogout: () => void;
//   onEditProfile: () => void;
// };

// export default function Header({
//   title,
//   userProfile,
//   onLogout,
//   onEditProfile,
// }: Props) {
//   return (
//     <header className="bg-white border-b px-6 py-3 flex justify-between">
//       <h1 className="text-xl font-bold">{title}</h1>

//       <div className="flex items-center gap-3">
//         <div className="text-right">
//           <p className="text-sm font-semibold">{userProfile?.fullName}</p>
//           <p className="text-xs text-gray-500">{userProfile?.role}</p>
//         </div>

//         <Image
//           src={userProfile?.avatarUrl || '/default-avatar.png'}
//           alt="avatar"
//           width={36}
//           height={36}
//           className="rounded-full"
//         />

//         <div className="relative">
//           <button className="p-2">
//             <ChevronDown />
//           </button>

//           <div className="absolute right-0 mt-2 bg-white shadow rounded-lg w-40">
//             <button
//               onClick={onEditProfile}
//               className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-100"
//             >
//               <User className="w-4 h-4" />
//               Profile
//             </button>

//             <button
//               onClick={onLogout}
//               className="w-full px-3 py-2 flex items-center gap-2 text-red-500 hover:bg-red-50"
//             >
//               <LogOut className="w-4 h-4" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }