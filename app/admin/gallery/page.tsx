"use client";

import ProtectedRoutes from "@/app/admin/_components/ProtectedRoutes";
import { uploadImageToCloudinary } from "@/services/cloudinaryUploads";
import {
  deleteBeforeAfterItem,
  deleteGalleryItem,
  getBeforeAfterItems,
  getGalleryItems,
  saveBeforeAfterItem,
  saveGalleryItem,
} from "@/services/gallerySettings";
import { BeforeAfterGalleryItem, GalleryItem } from "@/types/gallery";
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
  Tabs,
  Tag,
  Typography,
  Upload,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;
const { TextArea } = Input;

type GalleryFormValues = GalleryItem & {
  documentId: string;
};

type BeforeAfterFormValues = BeforeAfterGalleryItem & {
  documentId: string;
};

export default function AdminGalleryPage() {
  const [galleryForm] = Form.useForm();
  const [beforeAfterForm] = Form.useForm();

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [beforeAfterItems, setBeforeAfterItems] = useState<
    BeforeAfterGalleryItem[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [beforeAfterModalOpen, setBeforeAfterModalOpen] = useState(false);

  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(
    null
  );
  const [editingBeforeAfter, setEditingBeforeAfter] =
    useState<BeforeAfterGalleryItem | null>(null);

  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const galleryImageUrls = Form.useWatch("imageUrls", galleryForm) || [];
  const beforeImageUrl = Form.useWatch("beforeImageUrl", beforeAfterForm);
  const afterImageUrl = Form.useWatch("afterImageUrl", beforeAfterForm);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [galleryData, beforeAfterData] = await Promise.all([
        getGalleryItems(),
        getBeforeAfterItems(),
      ]);

      setGalleryItems(galleryData);
      setBeforeAfterItems(beforeAfterData);
    } catch (error) {
      console.log(error);
      message.error("Failed to load gallery data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const uploadSingleImage = async (
    file: File,
    form: any,
    fieldName: string
  ) => {
    try {
      setUploadingField(fieldName);

      const imageUrl = await uploadImageToCloudinary(file);

      form.setFieldsValue({
        [fieldName]: imageUrl,
      });

      message.success("Image uploaded successfully");
    } catch (error: any) {
      console.log(error);
      message.error(error.message || "Image upload failed");
    } finally {
      setUploadingField(null);
    }

    return false;
  };

  const uploadGalleryImage = async (file: File) => {
    try {
      setUploadingField("imageUrls");

      const imageUrl = await uploadImageToCloudinary(file);

      const currentImages = galleryForm.getFieldValue("imageUrls") || [];

      galleryForm.setFieldsValue({
        imageUrls: [...currentImages, imageUrl],
      });

      message.success("Gallery image uploaded successfully");
    } catch (error: any) {
      console.log(error);
      message.error(error.message || "Image upload failed");
    } finally {
      setUploadingField(null);
    }

    return false;
  };

  const removeGalleryImage = (index: number) => {
    const currentImages = galleryForm.getFieldValue("imageUrls") || [];

    const updatedImages = currentImages.filter(
      (_: string, imgIndex: number) => imgIndex !== index
    );

    galleryForm.setFieldsValue({
      imageUrls: updatedImages,
    });
  };

  const openAddGalleryModal = () => {
    setEditingGallery(null);

    galleryForm.setFieldsValue({
      documentId: "",
      title: "",
      category: "",
      imageUrls: [],
      description: "",
      displayOrder: galleryItems.length + 1,
      isActive: true,
    });

    setGalleryModalOpen(true);
  };

  const openEditGalleryModal = (record: GalleryItem) => {
    setEditingGallery(record);

    galleryForm.setFieldsValue({
      documentId: record.id,
      title: record.title,
      category: record.category,
      imageUrls: record.imageUrls || [],
      description: record.description,
      displayOrder: record.displayOrder,
      isActive: record.isActive,
    });

    setGalleryModalOpen(true);
  };

  const saveGallery = async (values: GalleryFormValues) => {
    try {
      setSaving(true);

      const id =
        values.documentId ||
        createSlug(values.title) ||
        `gallery-${Date.now()}`;

      const payload: GalleryItem = {
        title: values.title,
        category: values.category,
        imageUrls: values.imageUrls || [],
        description: values.description || "",
        displayOrder: Number(values.displayOrder || 1),
        isActive: values.isActive ?? true,
      };

      await saveGalleryItem(id, payload);

      message.success("Gallery item saved successfully");
      setGalleryModalOpen(false);
      fetchData();
    } catch (error) {
      console.log(error);
      message.error("Failed to save gallery item");
    } finally {
      setSaving(false);
    }
  };

  const removeGallery = async (id?: string) => {
    if (!id) return;

    try {
      await deleteGalleryItem(id);
      message.success("Gallery item deleted successfully");
      fetchData();
    } catch (error) {
      console.log(error);
      message.error("Failed to delete gallery item");
    }
  };

  const openAddBeforeAfterModal = () => {
    setEditingBeforeAfter(null);

    beforeAfterForm.setFieldsValue({
      documentId: "",
      title: "",
      category: "",
      beforeImageUrl: "",
      afterImageUrl: "",
      description: "",
      displayOrder: beforeAfterItems.length + 1,
      isActive: true,
    });

    setBeforeAfterModalOpen(true);
  };

  const openEditBeforeAfterModal = (record: BeforeAfterGalleryItem) => {
    setEditingBeforeAfter(record);

    beforeAfterForm.setFieldsValue({
      documentId: record.id,
      title: record.title,
      category: record.category,
      beforeImageUrl: record.beforeImageUrl,
      afterImageUrl: record.afterImageUrl,
      description: record.description,
      displayOrder: record.displayOrder,
      isActive: record.isActive,
    });

    setBeforeAfterModalOpen(true);
  };

  const saveBeforeAfter = async (values: BeforeAfterFormValues) => {
    try {
      setSaving(true);

      const id =
        values.documentId ||
        createSlug(values.title) ||
        `before-after-${Date.now()}`;

      const payload: BeforeAfterGalleryItem = {
        title: values.title,
        category: values.category,
        beforeImageUrl: values.beforeImageUrl || "",
        afterImageUrl: values.afterImageUrl || "",
        description: values.description || "",
        displayOrder: Number(values.displayOrder || 1),
        isActive: values.isActive ?? true,
      };

      await saveBeforeAfterItem(id, payload);

      message.success("Before/After item saved successfully");
      setBeforeAfterModalOpen(false);
      fetchData();
    } catch (error) {
      console.log(error);
      message.error("Failed to save before/after item");
    } finally {
      setSaving(false);
    }
  };

  const removeBeforeAfter = async (id?: string) => {
    if (!id) return;

    try {
      await deleteBeforeAfterItem(id);
      message.success("Before/After item deleted successfully");
      fetchData();
    } catch (error) {
      console.log(error);
      message.error("Failed to delete before/after item");
    }
  };

  const galleryColumns: ColumnsType<GalleryItem> = [
    {
      title: "Image",
      dataIndex: "imageUrls",
      width: 120,
      render: (imageUrls: string[]) =>
        imageUrls?.[0] ? (
          <div className="relative h-16 w-24 overflow-hidden rounded-lg">
            <img
              src={imageUrls[0]}
              alt="gallery"
              className="h-full w-full object-cover"
            />

            {imageUrls.length > 1 && (
              <span className="absolute bottom-1 right-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white">
                +{imageUrls.length - 1}
              </span>
            )}
          </div>
        ) : (
          <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
            No Image
          </div>
        ),
    },
    {
      title: "Gallery Item",
      dataIndex: "title",
      render: (_: string, record) => (
        <div>
          <Text strong>{record.title}</Text>
          <p className="mb-0 text-xs text-slate-500">{record.description}</p>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      width: 150,
      render: (category: string) => <Tag color="blue">{category}</Tag>,
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
            onClick={() => openEditGalleryModal(record)}
          />

          <Popconfirm
            title="Delete gallery item?"
            description="Are you sure you want to delete this item?"
            onConfirm={() => removeGallery(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const beforeAfterColumns: ColumnsType<BeforeAfterGalleryItem> = [
    {
      title: "Before / After",
      width: 180,
      render: (_, record) => (
        <div className="flex gap-2">
          {record.beforeImageUrl ? (
            <img
              src={record.beforeImageUrl}
              alt="before"
              className="h-16 w-20 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-16 w-20 items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-400">
              Before
            </div>
          )}

          {record.afterImageUrl ? (
            <img
              src={record.afterImageUrl}
              alt="after"
              className="h-16 w-20 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-16 w-20 items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-400">
              After
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Project",
      dataIndex: "title",
      render: (_: string, record) => (
        <div>
          <Text strong>{record.title}</Text>
          <p className="mb-0 text-xs text-slate-500">{record.description}</p>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      width: 150,
      render: (category: string) => <Tag color="blue">{category}</Tag>,
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
            onClick={() => openEditBeforeAfterModal(record)}
          />

          <Popconfirm
            title="Delete before/after item?"
            description="Are you sure you want to delete this item?"
            onConfirm={() => removeBeforeAfter(record.id)}
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
        <div className="mb-6">
          <Title level={3} className="!mb-1">
            Gallery Settings
          </Title>

          <Text className="text-slate-500">
            Manage project gallery and before/after transformation images.
          </Text>
        </div>

        <Tabs
          defaultActiveKey="gallery"
          items={[
            {
              key: "gallery",
              label: "Project Gallery",
              children: (
                <>
                  <div className="mb-4 flex justify-end">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={openAddGalleryModal}
                    >
                      Add Gallery Item
                    </Button>
                  </div>

                  <Table
                    rowKey="id"
                    loading={loading}
                    columns={galleryColumns}
                    dataSource={galleryItems}
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: 900 }}
                  />
                </>
              ),
            },
            {
              key: "before-after",
              label: "Before / After Gallery",
              children: (
                <>
                  <div className="mb-4 flex justify-end">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={openAddBeforeAfterModal}
                    >
                      Add Before / After
                    </Button>
                  </div>

                  <Table
                    rowKey="id"
                    loading={loading}
                    columns={beforeAfterColumns}
                    dataSource={beforeAfterItems}
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: 1000 }}
                  />
                </>
              ),
            },
          ]}
        />
      </Card>

      {/* Project Gallery Modal */}
      <Modal
        title={editingGallery ? "Edit Gallery Item" : "Add Gallery Item"}
        open={galleryModalOpen}
        onCancel={() => setGalleryModalOpen(false)}
        footer={null}
        width={800}
        destroyOnHidden
      >
        <Form form={galleryForm} layout="vertical" onFinish={saveGallery}>
          <Form.Item label="Document ID" name="documentId">
            <Input
              disabled={!!editingGallery}
              placeholder="Auto from title, e.g. powder-coating-work"
            />
          </Form.Item>

          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input size="large" placeholder="Powder Coating Work" />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Category is required" }]}
            >
              <Input size="large" placeholder="Powder Coating" />
            </Form.Item>

            <Form.Item label="Display Order" name="displayOrder">
              <InputNumber min={1} size="large" className="!w-full" />
            </Form.Item>

            <Form.Item label="Active" name="isActive" valuePropName="checked">
              <Checkbox>Show on website</Checkbox>
            </Form.Item>
          </div>

          <Form.Item label="Description" name="description">
            <TextArea rows={3} placeholder="Short gallery description" />
          </Form.Item>

          <Form.Item
            name="imageUrls"
            rules={[
              {
                validator: async (_, value) => {
                  if (!value || value.length === 0) {
                    return Promise.reject(
                      new Error("At least one image is required")
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
            hidden
          >
            <Input />
          </Form.Item>

          <div>
            <Text strong>Gallery Images</Text>

            <div className="mt-3">
              <Upload
                showUploadList={false}
                accept="image/*"
                beforeUpload={uploadGalleryImage}
              >
                <Button
                  icon={<UploadOutlined />}
                  loading={uploadingField === "imageUrls"}
                >
                  Upload Gallery Images
                </Button>
              </Upload>
            </div>
          </div>

          {galleryImageUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {galleryImageUrls.map((image: string, index: number) => (
                <div
                  key={`${image}-${index}`}
                  className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                >
                  <img
                    src={image}
                    alt={`Gallery Preview ${index + 1}`}
                    className="h-28 w-full object-cover"
                  />

                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    className="!absolute right-2 top-2"
                    onClick={() => removeGalleryImage(index)}
                  />

                  <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          )}

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            icon={<SaveOutlined />}
            loading={saving}
            className="mt-6"
          >
            Save Gallery Item
          </Button>
        </Form>
      </Modal>

      {/* Before After Modal */}
      <Modal
        title={editingBeforeAfter ? "Edit Before / After" : "Add Before / After"}
        open={beforeAfterModalOpen}
        onCancel={() => setBeforeAfterModalOpen(false)}
        footer={null}
        width={850}
        destroyOnHidden
      >
        <Form
          form={beforeAfterForm}
          layout="vertical"
          onFinish={saveBeforeAfter}
        >
          <Form.Item label="Document ID" name="documentId">
            <Input
              disabled={!!editingBeforeAfter}
              placeholder="Auto from title, e.g. rusty-part-restoration"
            />
          </Form.Item>

          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input size="large" placeholder="Rusty Part Restoration" />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Category is required" }]}
            >
              <Input size="large" placeholder="Powder Coating" />
            </Form.Item>

            <Form.Item label="Display Order" name="displayOrder">
              <InputNumber min={1} size="large" className="!w-full" />
            </Form.Item>

            <Form.Item label="Active" name="isActive" valuePropName="checked">
              <Checkbox>Show on website</Checkbox>
            </Form.Item>
          </div>

          <Form.Item label="Description" name="description">
            <TextArea rows={3} placeholder="Before/after description" />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Form.Item
                label="Before Image URL"
                name="beforeImageUrl"
                rules={[{ required: true, message: "Before image is required" }]}
              >
                <Input
                  size="large"
                  placeholder="Upload or paste before image URL"
                />
              </Form.Item>

              <Upload
                showUploadList={false}
                accept="image/*"
                beforeUpload={(file) =>
                  uploadSingleImage(file, beforeAfterForm, "beforeImageUrl")
                }
              >
                <Button
                  icon={<UploadOutlined />}
                  loading={uploadingField === "beforeImageUrl"}
                >
                  Upload Before Image
                </Button>
              </Upload>

              {beforeImageUrl && (
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                  <img
                    src={beforeImageUrl}
                    alt="Before Preview"
                    className="h-48 w-full object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <Form.Item
                label="After Image URL"
                name="afterImageUrl"
                rules={[{ required: true, message: "After image is required" }]}
              >
                <Input
                  size="large"
                  placeholder="Upload or paste after image URL"
                />
              </Form.Item>

              <Upload
                showUploadList={false}
                accept="image/*"
                beforeUpload={(file) =>
                  uploadSingleImage(file, beforeAfterForm, "afterImageUrl")
                }
              >
                <Button
                  icon={<UploadOutlined />}
                  loading={uploadingField === "afterImageUrl"}
                >
                  Upload After Image
                </Button>
              </Upload>

              {afterImageUrl && (
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                  <img
                    src={afterImageUrl}
                    alt="After Preview"
                    className="h-48 w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            icon={<SaveOutlined />}
            loading={saving}
            className="mt-6"
          >
            Save Before / After
          </Button>
        </Form>
      </Modal>
    </ProtectedRoutes>
  );
}