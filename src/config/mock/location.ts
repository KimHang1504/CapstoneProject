export type WorkingDays = {
  from: number; // 2 = Thứ 2
  to: number;   // 6 = Thứ 6
};

export type WorkingHours = {
  open: string;  // "09:00"
  close: string; // "22:00"
};

export type Location = {
  id: number;
  name: string;
  address: string;
  description: string;
  mood: "romantic" | "cozy" | "elegant" | "peaceful" | "vibrant";
  status: "active" | "inactive" | "pending";
  open: boolean; // bật/tắt thủ công
  image: string;

  workingDays: WorkingDays;
  workingHours: WorkingHours;
};

export const MOCK_LOCATION: Location[] = [
  {
    id: 1,
    name: "Cơ sở 1",
    address: "123 Đường ABC, Quận 1, TP. HCM",
    description:
      "Cơ sở chính nằm ở trung tâm thành phố, thuận tiện cho khách hàng.",
    mood: "romantic",
    status: "active",
    open: true,
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1",

    workingDays: {
      from: 2, // Thứ 2
      to: 6    // Thứ 6
    },
    workingHours: {
      open: "09:00",
      close: "22:00"
    }
  },

  {
    id: 2,
    name: "Cơ sở 2",
    address: "456 Đường DEF, Quận 3, TP. HCM",
    description:
      "Cơ sở thứ hai với không gian rộng rãi và thoáng mát.",
    mood: "cozy",
    status: "inactive",
    open: false,
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",

    workingDays: {
      from: 2,
      to: 7 // Thứ 2 – Thứ 7
    },
    workingHours: {
      open: "10:00",
      close: "23:00"
    }
  },

  {
    id: 3,
    name: "Cơ sở 3",
    address: "789 Đường GHI, Quận 7, TP. HCM",
    description:
      "Chi nhánh mới với thiết kế hiện đại và sang trọng.",
    mood: "elegant",
    status: "pending",
    open: true,
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb",

    workingDays: {
      from: 3, // Thứ 3
      to: 6    // Thứ 6
    },
    workingHours: {
      open: "08:30",
      close: "21:30"
    }
  }
];
