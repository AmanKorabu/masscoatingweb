"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardOutlined,
  MenuOutlined,
  SettingOutlined,
  PictureOutlined,
  LogoutOutlined,
  TeamOutlined,
  InfoOutlined,
  RadiusSettingOutlined,
  UsergroupAddOutlined,
  ContactsOutlined,
  MessageOutlined,
  FileTextOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardOutlined />,
  },
  {
    label: "Navbar Settings",
    path: "/admin/navbar",
    icon: <MenuOutlined />,
  },
  {
    label: "Footer Settings",
    path: "/admin/footer",
    icon: <RadiusSettingOutlined />,
  },
  {
    label: "HomePage Settings",
    path: "/admin/hero",
    icon: <PictureOutlined />,
  },
  {
    label: "Customers Settings",
    path: "/admin/customers",
    icon: <TeamOutlined />,
  },
  {
    label: "About Settings",
    path: "/admin/about",
    icon: <InfoOutlined />,
  },
  {
    label: "Partners Settings",
    path: "/admin/partners",
    icon: <UsergroupAddOutlined />,
  },
  {
    label: "Services",
    path: "/admin/services",
    icon: <SettingOutlined />,
  },
  {
    label: "Gallery",
    path: "/admin/gallery",
    icon: <PictureOutlined />,
  },
  {
    label: "Contact Settings",
    path: "/admin/contact",
    icon: <ContactsOutlined />,
  },
  {
    label: "Quote Requests",
    path: "/admin/quote-requests",
    icon: <FileDoneOutlined />,
  },
  {
    label: "Contact Messages",
    path: "/admin/contact-messages",
    icon: <MessageOutlined />,
  },
  {
    label: "Quote Settings",
    path: "/admin/get-quote",
    icon: <FileTextOutlined />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/admin/login");
  };

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-slate-950 p-5 text-white">
      {/* Top Title */}
      <div className="shrink-0">
        <h2 className="mb-6 text-xl font-bold">Admin Panel</h2>
      </div>

      {/* Scrollable Menu */}
      <nav className="flex-1 space-y-2 overflow-y-auto pr-1 custom-sidebar-scroll">
        {menuItems.map((item) => {
          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${active
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-lg">
                {item.icon}
              </span>

              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Logout */}
      <div className="mt-4 shrink-0">
        <Button danger icon={<LogoutOutlined />} block onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </aside>
  );

}