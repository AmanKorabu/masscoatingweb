"use client";

import ProtectedRoutes from "@/app/admin/_components/ProtectedRoutes";
import { uploadImageToCloudinary } from "@/services/cloudinaryUploads";
import {
  deleteService,
  getServices,
  saveService,
} from "@/services/serviceSettings";
import { ServiceData } from "@/types/service";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;
const { TextArea } = Input;

type ServiceFormValues = ServiceData & {
  documentId: string;
};

export default function AdminServicesPage() {
  const [form] = Form.useForm();

  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceData | null>(null);
  const [uploading, setUploading] = useState(false);

  const images = Form.useWatch("images", form) || [];

  const fetchServices = async () => {
    try {
      setLoading(true);
      const result = await getServices();
      setServices(result);
    } catch (error) {
      console.log(error);
      message.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);

    form.setFieldsValue({
      documentId: "",
      title: "",
      shortDescription: "",
      fullDescription: "",
      images: [],
      features: [],
      extraServices: [],
      tag: "",
      slug: "",
      displayOrder: services.length + 1,
      isActive: true,
      seoTitle: "",
      seoDescription: "",
      seoKeywords: [],
    });

    setModalOpen(true);
  };

  const openEditModal = (record: ServiceData) => {
    setEditingService(record);

    form.setFieldsValue({
      documentId: record.id,
      title: record.title,
      slug: record.slug || record.id || createSlug(record.title),
      shortDescription: record.shortDescription,
      fullDescription: record.fullDescription,
      images: record.images || [],
      features: record.features || [],
      extraServices: record.extraServices || [],
      tag: record.tag || "",
      displayOrder: record.displayOrder,
      isActive: record.isActive,

      seoTitle: record.seoTitle || record.title,
      seoDescription: record.seoDescription || record.shortDescription,
      seoKeywords: record.seoKeywords || [],
    });

    setModalOpen(true);
  };

  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleUploadImage = async (file: File) => {
    try {
      setUploading(true);

      const imageUrl = await uploadImageToCloudinary(file);

      const currentImages = form.getFieldValue("images") || [];

      form.setFieldsValue({
        images: [...currentImages, imageUrl],
      });

      message.success("Image uploaded successfully");
    } catch (error: any) {
      console.log(error);
      message.error(error.message || "Image upload failed");
    } finally {
      setUploading(false);
    }

    return false;
  };

  const removeImage = (index: number) => {
    const currentImages = form.getFieldValue("images") || [];

    const updatedImages = currentImages.filter(
      (_: string, imgIndex: number) => imgIndex !== index
    );

    form.setFieldsValue({
      images: updatedImages,
    });
  };

  const onFinish = async (values: ServiceFormValues) => {
    try {
      const serviceSlug = values.slug || createSlug(values.title);

      const id =
        values.documentId ||
        serviceSlug ||
        `service-${Date.now()}`;

      const serviceData: ServiceData = {
        title: values.title,
        slug: serviceSlug,
        shortDescription: values.shortDescription,
        fullDescription: values.fullDescription,
        images: values.images || [],
        features: (values.features || []).filter(Boolean),
        extraServices: (values.extraServices || []).filter(Boolean),
        tag: values.tag || "",
        displayOrder: Number(values.displayOrder || 1),
        isActive: values.isActive ?? true,

        seoTitle: values.seoTitle || `${values.title} Services`,
        seoDescription: values.seoDescription || values.shortDescription,
        seoKeywords: (values.seoKeywords || []).filter(Boolean),
      };
      await saveService(id, serviceData);

      message.success("Service saved successfully");

      setModalOpen(false);
      fetchServices();
    } catch (error) {
      console.log(error);
      message.error("Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;

    try {
      await deleteService(id);
      message.success("Service deleted successfully");
      fetchServices();
    } catch (error) {
      console.log(error);
      message.error("Failed to delete service");
    }
  };

  const columns: ColumnsType<ServiceData> = [
    {
      title: "Image",
      dataIndex: "images",
      width: 90,
      render: (images: string[]) =>
        images?.[0] ? (
          <img
            src={images[0]}
            alt="service"
            className="h-14 w-20 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
            No Image
          </div>
        ),
    },
    {
      title: "Service",
      dataIndex: "title",
      render: (_: string, record) => (
        <div>
          <Text strong>{record.title}</Text>
          <p className="mb-0 text-xs text-slate-500">
            {record.shortDescription}
          </p>
        </div>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      width: 180,
      render: (slug: string) => (
        <span className="text-xs text-slate-500">
          /services/{slug || "-"}
        </span>
      ),
    },
    {
      title: "Tag",
      dataIndex: "tag",
      width: 100,
      render: (tag: string) => (tag ? <Tag color="blue">{tag}</Tag> : "-"),
    },
    {
      title: "Order",
      dataIndex: "displayOrder",
      width: 80,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      width: 100,
      render: (active: boolean) =>
        active ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
    {
      title: "Action",
      width: 140,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          />

          <Popconfirm
            title="Delete service?"
            description="Are you sure you want to delete this service?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ProtectedRoutes>
      <Card className="mx-auto max-w-7xl rounded-2xl shadow-md">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Title level={3} className="!mb-1">
              Services Settings
            </Title>

            <Text className="text-slate-500">
              Manage website services, images, features, tags and status.
            </Text>
          </div>

          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            Add Service
          </Button>
        </div>

        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={services}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 900 }}
        />
      </Card>

      <Modal
        title={editingService ? "Edit Service" : "Add Service"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={900}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Document ID" name="documentId">
            <Input
              disabled={!!editingService}
              placeholder="Auto from title, e.g. shot-blasting"
            />
          </Form.Item>

          <Form.Item
            label="Service Title"
            name="title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input size="large" placeholder="Shot Blasting" />
          </Form.Item>
          <Form.Item
            label="Slug"
            name="slug"
            extra="Used for SEO URL. Example: powder-coating, shot-blasting"
            rules={[{ required: true, message: "Slug is required" }]}
          >
            <Input
              size="large"
              placeholder="powder-coating"
            />
          </Form.Item>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Form.Item label="Tag" name="tag">
              <Input size="large" placeholder="New / Popular / Featured" />
            </Form.Item>

            <Form.Item label="Display Order" name="displayOrder">
              <InputNumber min={1} size="large" className="!w-full" />
            </Form.Item>

            <Form.Item
              label="Active"
              name="isActive"
              valuePropName="checked"
            >
              <Checkbox>Show on website</Checkbox>
            </Form.Item>
          </div>

          <Form.Item
            label="Short Description"
            name="shortDescription"
            rules={[
              { required: true, message: "Short description is required" },
            ]}
          >
            <TextArea rows={3} placeholder="Short service description" />
          </Form.Item>

          <Form.Item
            label="Full Description"
            name="fullDescription"
            rules={[
              { required: true, message: "Full description is required" },
            ]}
          >
            <TextArea rows={5} placeholder="Detailed service description" />
          </Form.Item>

          <Form.Item name="images" hidden>
            <Input />
          </Form.Item>

          <Upload
            showUploadList={false}
            accept="image/*"
            beforeUpload={handleUploadImage}
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              Upload Service Image
            </Button>
          </Upload>

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {images.map((image: string, index: number) => (
                <div
                  key={`${image}-${index}`}
                  className="relative overflow-hidden rounded-xl border border-slate-200"
                >
                  <img
                    src={image}
                    alt="service"
                    className="h-28 w-full object-cover"
                  />

                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    className="!absolute right-2 top-2"
                    onClick={() => removeImage(index)}
                  />
                </div>
              ))}
            </div>
          )}

          <Form.List name="features">
            {(fields, { add, remove }) => (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <Text strong>Features</Text>
                  <Button icon={<PlusOutlined />} onClick={() => add("")}>
                    Add Feature
                  </Button>
                </div>

                <div className="space-y-3">
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} className="flex" align="baseline">
                      <Form.Item {...restField} name={name} className="!mb-0">
                        <Input
                          className="min-w-[260px] md:min-w-[560px]"
                          placeholder="Example: Rust removal"
                        />
                      </Form.Item>

                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    </Space>
                  ))}
                </div>
              </div>
            )}
          </Form.List>

          <Form.List name="extraServices">
            {(fields, { add, remove }) => (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <Text strong>Extra Services</Text>
                  <Button icon={<PlusOutlined />} onClick={() => add("")}>
                    Add Extra
                  </Button>
                </div>

                <div className="space-y-3">
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} className="flex" align="baseline">
                      <Form.Item {...restField} name={name} className="!mb-0">
                        <Input
                          className="min-w-[260px] md:min-w-[560px]"
                          placeholder="Example: Primer coating"
                        />
                      </Form.Item>

                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    </Space>
                  ))}
                </div>
              </div>
            )}
          </Form.List>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Title level={5} className="!mb-4">
              SEO Settings
            </Title>

            <Form.Item label="SEO Title" name="seoTitle">
              <Input
                size="large"
                placeholder="Powder Coating Services"
              />
            </Form.Item>

            <Form.Item label="SEO Description" name="seoDescription">
              <TextArea
                rows={3}
                placeholder="Mass Coating Company provides professional powder coating services for industrial metal parts."
              />
            </Form.Item>

            <Form.List name="seoKeywords">
              {(fields, { add, remove }) => (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <Text strong>SEO Keywords</Text>
                    <Button icon={<PlusOutlined />} onClick={() => add("")}>
                      Add Keyword
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key} className="flex" align="baseline">
                        <Form.Item {...restField} name={name} className="!mb-0">
                          <Input
                            className="min-w-[260px] md:min-w-[560px]"
                            placeholder="Example: Powder Coating Services"
                          />
                        </Form.Item>

                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        />
                      </Space>
                    ))}
                  </div>
                </div>
              )}
            </Form.List>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={saving}
            size="large"
            className="mt-6"
          >
            Save Service
          </Button>
        </Form>
      </Modal>
    </ProtectedRoutes>
  );
}