"use client";

import ProtectedRoutes from "@/app/admin/_components/ProtectedRoutes";
import { db } from "@/firebase/config";
import { uploadImageToCloudinary } from "@/services/cloudinaryUploads";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Spin,
  Typography,
  Upload,
  message,
} from "antd";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;
const { TextArea } = Input;

type AboutFormValues = {
  badge: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  highlights: string[];
};

export default function AboutSettingsPage() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const imageUrl = Form.useWatch("imageUrl", form);

  useEffect(() => {
    const fetchAboutSettings = async () => {
      try {
        const docRef = doc(db, "pagesContent", "about");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          form.setFieldsValue(docSnap.data());
        } else {
          form.setFieldsValue({
            badge: "About Mass Coating",
            title: "Industrial Coating & Surface Finishing Experts",
            shortDescription:
              "We provide shot blasting, powder coating and industrial painting services with reliable quality.",
            fullDescription: "",
            imageUrl: "",
            highlights: [
              "Shot Blasting",
              "Powder Coating",
              "Industrial Painting",
              "Surface Finishing",
            ],
          });
        }
      } catch (error) {
        console.log(error);
        message.error("Failed to load about settings");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutSettings();
  }, [form]);

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);

      const uploadedUrl = await uploadImageToCloudinary(file);

      form.setFieldsValue({
        imageUrl: uploadedUrl,
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

  const onFinish = async (values: AboutFormValues) => {
    try {
      setSaving(true);

      const highlights = (values.highlights || []).filter(
        (item) => item && item.trim() !== ""
      );

      await setDoc(doc(db, "pagesContent", "about"), {
        badge: values.badge,
        title: values.title,
        shortDescription: values.shortDescription,
        fullDescription: values.fullDescription,
        imageUrl: values.imageUrl || "",
        highlights,
      });

      message.success("About settings updated successfully");
    } catch (error) {
      console.log(error);
      message.error("Failed to update about settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoutes>
        <div className="flex min-h-screen items-center justify-center">
          <Spin size="large" />
        </div>
      </ProtectedRoutes>
    );
  }

  return (
    <ProtectedRoutes>
      <Card className="mx-auto max-w-5xl rounded-2xl shadow-md">
        <div className="mb-6">
          <Title level={3} className="!mb-1">
            About Settings
          </Title>

          <Text className="text-slate-500">
            Manage homepage about preview and about page content.
          </Text>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Badge Text"
            name="badge"
            rules={[{ required: true, message: "Badge text is required" }]}
          >
            <Input size="large" placeholder="About Mass Coating" />
          </Form.Item>

          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input
              size="large"
              placeholder="Industrial Coating & Surface Finishing Experts"
            />
          </Form.Item>

          <Form.Item
            label="Short Description"
            name="shortDescription"
            rules={[
              { required: true, message: "Short description is required" },
            ]}
          >
            <TextArea
              rows={3}
              placeholder="Short content for homepage preview section"
            />
          </Form.Item>

          <Form.Item
            label="Full Description"
            name="fullDescription"
            rules={[
              { required: true, message: "Full description is required" },
            ]}
          >
            <TextArea
              rows={6}
              placeholder="Detailed company information for about section/page"
            />
          </Form.Item>

          <Form.Item label="About Image URL" name="imageUrl">
            <Input size="large" placeholder="Upload image or paste image URL" />
          </Form.Item>

          <Form.Item label="Upload About Image">
            <Upload
              beforeUpload={handleImageUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                Upload Image
              </Button>
            </Upload>
          </Form.Item>

          {imageUrl && (
            <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <Text className="mb-3 block text-slate-500">Image Preview</Text>

              <img
                src={imageUrl}
                alt="About Preview"
                className="h-56 w-full rounded-xl object-cover"
              />
            </div>
          )}

          <Form.List name="highlights">
            {(fields, { add, remove }) => (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <Title level={4} className="!mb-0">
                    Highlights
                  </Title>

                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => add("")}
                  >
                    Add Highlight
                  </Button>
                </div>

                <div className="space-y-3">
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} className="flex" align="baseline">
                      <Form.Item
                        {...restField}
                        name={name}
                        rules={[
                          {
                            required: true,
                            message: "Highlight is required",
                          },
                        ]}
                        className="w-full"
                      >
                        <Input
                          size="large"
                          placeholder="Example: Powder Coating"
                          className="min-w-[280px] md:min-w-[500px]"
                        />
                      </Form.Item>

                      <Button
                      className="!m-2"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    </Space>
                  ))}
                </div>
              </>
            )}
          </Form.List>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={saving}
            className="mt-6"
          >
            Save About Settings
          </Button>
        </Form>
      </Card>
    </ProtectedRoutes>
  );
}