"use client";

import ProtectedRoutes from "@/app/admin/_components/ProtectedRoutes";
import { auth } from "@/firebase/config";
import {
  LogoutOutlined,
  MenuOutlined,
  PictureOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Row,
  Typography,
} from "antd";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import AdminContactMessagesPage from "../_components/AdminContactMessagesPage";

const { Title, Text } = Typography;

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/admin/login");
  };

  const actions = [
    {
      title: "Navbar",
      icon: <MenuOutlined />,
      path: "/admin/navbar",
    },
    {
      title: "Services",
      icon: <SettingOutlined />,
      path: "/admin/services",
    },
    {
      title: "Gallery",
      icon: <PictureOutlined />,
      path: "/admin/gallery",
    },
  ];

  return (
    <ProtectedRoutes>
      <div>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Title level={3} className="!mb-0">
              Dashboard
            </Title>

            <Text className="text-slate-500">
              Manage your website content
            </Text>
          </div>

          <Button
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        {/* Quick Actions */}
        <Row gutter={[16, 16]}>
          {actions.map((item) => (
            <Col xs={24} sm={12} lg={8} key={item.title}>
              <Card
                hoverable
                onClick={() => router.push(item.path)}
                className="rounded-2xl border-0 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                    {item.icon}
                  </div>

                  <div>
                    <Title level={5} className="!mb-1">
                      {item.title}
                    </Title>

                    <Text className="text-slate-500">
                      Manage {item.title.toLowerCase()}
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <br />
      <AdminContactMessagesPage />
    </ProtectedRoutes>
  );
}