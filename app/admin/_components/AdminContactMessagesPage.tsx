"use client";

import ProtectedRoutes from "@/app/admin/_components/ProtectedRoutes";
import {
  getContactMessages,
  updateContactMessageStatus,
} from "@/services/contactSettings";
import { ContactMessageData } from "@/types/contact";
import {
  CheckCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  ReloadOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

const { Title, Text, Paragraph } = Typography;

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] =
    useState<ContactMessageData | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const result = await getContactMessages();
      setMessages(result);
    } catch (error) {
      console.log("Failed to load contact messages:", error);
      message.error("Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const formatDate = (createdAt: ContactMessageData["createdAt"]) => {
    if (!createdAt) return "-";

    try {
      return createdAt.toDate().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  const cleanPhoneNumber = (phone: string) => {
    return phone.replace(/\s+/g, "").replace("+", "");
  };

  const handleStatusChange = async (
    id: string | undefined,
    status: "new" | "read" | "closed"
  ) => {
    if (!id) return;

    try {
      await updateContactMessageStatus(id, status);
      message.success("Status updated successfully");
      fetchMessages();
    } catch (error) {
      console.log("Failed to update status:", error);
      message.error("Failed to update status");
    }
  };

  const getStatusTag = (status: ContactMessageData["status"]) => {
    if (status === "new") return <Tag color="blue">New</Tag>;
    if (status === "read") return <Tag color="orange">Read</Tag>;
    return <Tag color="green">Closed</Tag>;
  };

  const columns: ColumnsType<ContactMessageData> = [
    {
      title: "Customer",
      dataIndex: "name",
      width: 220,
      render: (_: string, record) => (
        <div>
          <Text strong>{record.name}</Text>
          <p className="mb-0 text-xs text-slate-500">{record.phone}</p>
        </div>
      ),
    },
    {
      title: "Service",
      dataIndex: "service",
      width: 180,
      render: (service: string) =>
        service ? <Tag color="cyan">{service}</Tag> : "-",
    },
    {
      title: "Message",
      dataIndex: "message",
      render: (msg: string) => (
        <p className="mb-0 line-clamp-2 max-w-md text-sm text-slate-600">
          {msg}
        </p>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      width: 180,
      render: (createdAt) => (
        <span className="text-sm text-slate-500">{formatDate(createdAt)}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 140,
      render: (status: ContactMessageData["status"], record) => (
        <Select
          size="small"
          value={status}
          className="!w-28"
          onChange={(value) => handleStatusChange(record.id, value)}
          options={[
            { label: "New", value: "new" },
            { label: "Read", value: "read" },
            { label: "Closed", value: "closed" },
          ]}
        />
      ),
    },
    {
      title: "Action",
      width: 220,
      render: (_, record) => (
        <Space>
          <Button onClick={() => setSelectedMessage(record)}>View</Button>

          <a href={`tel:${record.phone}`}>
            <Button icon={<PhoneOutlined />} />
          </a>

          <a
            href={`https://wa.me/${cleanPhoneNumber(record.phone)}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button icon={<WhatsAppOutlined />} />
          </a>
        </Space>
      ),
    },
  ];

  const newCount = messages.filter((item) => item.status === "new").length;
  const readCount = messages.filter((item) => item.status === "read").length;
  const closedCount = messages.filter((item) => item.status === "closed").length;

  return (
    <ProtectedRoutes>
      <Card className="mx-auto max-w-7xl rounded-2xl shadow-md">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Title level={3} className="!mb-1">
              Contact Messages
            </Title>

            <Text className="text-slate-500">
              View and manage inquiries submitted from the website contact form.
            </Text>
          </div>

          <Button
            icon={<ReloadOutlined />}
            onClick={fetchMessages}
            loading={loading}
          >
            Refresh
          </Button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatusCard title="New Messages" value={newCount} color="blue" />
          <StatusCard title="Read Messages" value={readCount} color="orange" />
          <StatusCard title="Closed Messages" value={closedCount} color="green" />
        </div>

        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={messages}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        open={!!selectedMessage}
        onCancel={() => setSelectedMessage(null)}
        footer={null}
        title="Inquiry Details"
        centered
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <Text strong className="text-lg">
                {selectedMessage.name}
              </Text>

              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <p className="mb-0">
                  <PhoneOutlined /> {selectedMessage.phone}
                </p>

                {selectedMessage.email && (
                  <p className="mb-0">
                    <MailOutlined /> {selectedMessage.email}
                  </p>
                )}

                {selectedMessage.service && (
                  <p className="mb-0">
                    <CheckCircleOutlined /> {selectedMessage.service}
                  </p>
                )}

                <p className="mb-0">
                  Status: {getStatusTag(selectedMessage.status)}
                </p>

                <p className="mb-0">
                  Date: {formatDate(selectedMessage.createdAt)}
                </p>
              </div>
            </div>

            <div>
              <Text strong>Message</Text>
              <Paragraph className="mt-2 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                {selectedMessage.message}
              </Paragraph>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href={`tel:${selectedMessage.phone}`}>
                <Button type="primary" icon={<PhoneOutlined />}>
                  Call
                </Button>
              </a>

              <a
                href={`https://wa.me/${cleanPhoneNumber(selectedMessage.phone)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button icon={<WhatsAppOutlined />}>WhatsApp</Button>
              </a>

              {selectedMessage.email && (
                <a href={`mailto:${selectedMessage.email}`}>
                  <Button icon={<MailOutlined />}>Email</Button>
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </ProtectedRoutes>
  );
}

function StatusCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: "blue" | "orange" | "green";
}) {
  const colorClass =
    color === "blue"
      ? "bg-blue-50 text-blue-700 ring-blue-100"
      : color === "orange"
      ? "bg-orange-50 text-orange-700 ring-orange-100"
      : "bg-green-50 text-green-700 ring-green-100";

  return (
    <div className={`rounded-2xl p-5 ring-1 ${colorClass}`}>
      <p className="text-sm font-bold">{title}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}