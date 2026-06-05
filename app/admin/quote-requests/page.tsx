"use client";

import ProtectedRoutes from "@/app/admin/_components/ProtectedRoutes";
import {
  getQuoteRequests,
  updateQuoteRequestStatus,
} from "@/services/getQuoteSettings";
import { QuoteRequestData } from "@/types/getQuote";
import {
  CheckCircleOutlined,
  EyeOutlined,
  FileImageOutlined,
  MailOutlined,
  PhoneOutlined,
  ReloadOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Image,
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

export default function AdminQuoteRequestsPage() {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequestData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuote, setSelectedQuote] =
    useState<QuoteRequestData | null>(null);

  const fetchQuoteRequests = async () => {
    try {
      setLoading(true);

      const result = await getQuoteRequests();
      setQuoteRequests(result);
    } catch (error) {
      console.log("Failed to load quote requests:", error);
      message.error("Failed to load quote requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuoteRequests();
  }, []);

  const formatDate = (createdAt: QuoteRequestData["createdAt"]) => {
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
      await updateQuoteRequestStatus(id, status);
      message.success("Status updated successfully");
      fetchQuoteRequests();
    } catch (error) {
      console.log("Failed to update quote status:", error);
      message.error("Failed to update status");
    }
  };

  const getStatusTag = (status: QuoteRequestData["status"]) => {
    if (status === "new") return <Tag color="blue">New</Tag>;
    if (status === "read") return <Tag color="orange">Read</Tag>;
    return <Tag color="green">Closed</Tag>;
  };

  const columns: ColumnsType<QuoteRequestData> = [
    {
      title: "Customer",
      dataIndex: "name",
      width: 230,
      render: (_: string, record) => (
        <div>
          <Text strong>{record.name}</Text>

          {record.companyName && (
            <p className="mb-0 text-xs text-slate-500">
              {record.companyName}
            </p>
          )}

          <p className="mb-0 text-xs text-slate-500">{record.phone}</p>
        </div>
      ),
    },
    {
      title: "Service",
      dataIndex: "service",
      width: 170,
      render: (service: string) =>
        service ? <Tag color="cyan">{service}</Tag> : "-",
    },
    {
      title: "Material",
      dataIndex: "materialType",
      width: 140,
      render: (materialType: string) =>
        materialType ? <Tag color="purple">{materialType}</Tag> : "-",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: 130,
      render: (quantity: string) => quantity || "-",
    },
    {
      title: "Images",
      dataIndex: "imageUrls",
      width: 100,
      render: (imageUrls: string[]) =>
        imageUrls?.length ? (
          <Tag icon={<FileImageOutlined />} color="blue">
            {imageUrls.length}
          </Tag>
        ) : (
          "-"
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
      render: (status: QuoteRequestData["status"], record) => (
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
          <Button
            icon={<EyeOutlined />}
            onClick={() => setSelectedQuote(record)}
          >
            View
          </Button>

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

  const newCount = quoteRequests.filter((item) => item.status === "new").length;
  const readCount = quoteRequests.filter(
    (item) => item.status === "read"
  ).length;
  const closedCount = quoteRequests.filter(
    (item) => item.status === "closed"
  ).length;

  return (
    <ProtectedRoutes>
      <Card className="mx-auto max-w-7xl rounded-2xl shadow-md">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Title level={3} className="!mb-1">
              Quote Requests
            </Title>

            <Text className="text-slate-500">
              View and manage quote requests submitted from the website Get
              Quote page.
            </Text>
          </div>

          <Button
            icon={<ReloadOutlined />}
            onClick={fetchQuoteRequests}
            loading={loading}
          >
            Refresh
          </Button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatusCard title="New Requests" value={newCount} color="blue" />
          <StatusCard title="Read Requests" value={readCount} color="orange" />
          <StatusCard
            title="Closed Requests"
            value={closedCount}
            color="green"
          />
        </div>

        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={quoteRequests}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        open={!!selectedQuote}
        onCancel={() => setSelectedQuote(null)}
        footer={null}
        title="Quote Request Details"
        centered
        width={900}
      >
        {selectedQuote && (
          <div className="space-y-5">
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <Text strong className="text-lg">
                    {selectedQuote.name}
                  </Text>

                  {selectedQuote.companyName && (
                    <p className="mb-0 mt-1 text-sm text-slate-500">
                      {selectedQuote.companyName}
                    </p>
                  )}
                </div>

                {getStatusTag(selectedQuote.status)}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-600 md:grid-cols-2">
                <p className="mb-0">
                  <PhoneOutlined /> {selectedQuote.phone}
                </p>

                <p className="mb-0">
                  <MailOutlined /> {selectedQuote.email}
                </p>

                <p className="mb-0">
                  <CheckCircleOutlined /> Service:{" "}
                  {selectedQuote.service || "-"}
                </p>

                <p className="mb-0">
                  Date: {formatDate(selectedQuote.createdAt)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoBox label="Material Type" value={selectedQuote.materialType} />
              <InfoBox label="Quantity" value={selectedQuote.quantity} />
              <InfoBox label="Dimensions" value={selectedQuote.dimensions} />
              <InfoBox
                label="Surface Condition"
                value={selectedQuote.surfaceCondition}
              />
              <InfoBox label="Expected Date" value={selectedQuote.expectedDate} />
              <InfoBox
                label="Pickup / Delivery"
                value={selectedQuote.pickupRequired}
              />
            </div>

            <div>
              <Text strong>Requirement Message</Text>
              <Paragraph className="mt-2 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                {selectedQuote.message || "No message provided."}
              </Paragraph>
            </div>

            {selectedQuote.imageUrls?.length > 0 && (
              <div>
                <Text strong>Reference Images</Text>

                <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-4">
                  {selectedQuote.imageUrls.map((image, index) => (
                    <Image
                      key={`${image}-${index}`}
                      src={image}
                      alt={`Quote Reference ${index + 1}`}
                      className="!h-32 !w-full rounded-xl object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <a href={`tel:${selectedQuote.phone}`}>
                <Button type="primary" icon={<PhoneOutlined />}>
                  Call
                </Button>
              </a>

              <a
                href={`https://wa.me/${cleanPhoneNumber(selectedQuote.phone)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button icon={<WhatsAppOutlined />}>WhatsApp</Button>
              </a>

              {selectedQuote.email && (
                <a href={`mailto:${selectedQuote.email}`}>
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

function InfoBox({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-700">
        {value || "-"}
      </p>
    </div>
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