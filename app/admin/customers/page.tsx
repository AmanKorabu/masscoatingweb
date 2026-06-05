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
import type { UploadProps } from "antd";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

type CustomerItem = {
  name: string;
  logoUrl: string;
};

type CustomersFormValues = {
  title: string;
  subTitle: string;
  customers: CustomerItem[];
};

export default function CustomersSettingsPage() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const docRef = doc(db, "homepage", "customers");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          form.setFieldsValue({
            title: data.title || "Our Customers",
            subTitle: data.subTitle || "",
            customers: data.customers || [],
          });
        } else {
          form.setFieldsValue({
            title: "Our Customers",
            subTitle: "",
            customers: [],
          });
        }
      } catch (error) {
        console.log(error);
        message.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [form]);

  const uploadCustomerLogo = async (file: File, index: number) => {
    try {
      setUploadingIndex(index);

      const imageUrl = await uploadImageToCloudinary(file);

      const customers = form.getFieldValue("customers") || [];

      customers[index] = {
        ...customers[index],
        logoUrl: imageUrl,
      };

      form.setFieldsValue({ customers });

      message.success("Logo uploaded successfully");
    } catch (error: any) {
      console.log(error);
      message.error(error.message || "Logo upload failed");
    } finally {
      setUploadingIndex(null);
    }

    return false;
  };

  const onFinish = async (values: CustomersFormValues) => {
    try {
      setSaving(true);

      const customers = (values.customers || []).filter(
        (item) => item?.name && item?.logoUrl
      );

      await setDoc(doc(db, "homepage", "customers"), {
        title: values.title,
        subTitle: values.subTitle || "",
        customers,
      });

      message.success("Customers updated successfully");
    } catch (error) {
      console.log(error);
      message.error("Failed to update customers");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoutes>
        <div className="min-h-screen flex items-center justify-center">
          <Spin size="large" />
        </div>
      </ProtectedRoutes>
    );
  }

  return (
    <ProtectedRoutes>
      <Card className="mx-auto max-w-5xl shadow-md rounded-2xl">
        <div className="mb-6">
          <Title level={3} className="!mb-1">
            Customers Settings
          </Title>

          <Text className="text-slate-500">
            Add customer names and logos shown on the website.
          </Text>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Section Title"
            name="title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input size="large" placeholder="Our Customers" />
          </Form.Item>

          <Form.Item label="Section Subtitle" name="subTitle">
            <Input size="large" placeholder="Meet our global customers" />
          </Form.Item>

          <Form.List name="customers">
            {(fields, { add, remove }) => (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <Title level={4} className="!mb-0">
                    Customer Logos
                  </Title>

                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => add({ name: "", logoUrl: "" })}
                  >
                    Add Customer
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map(({ key, name, ...restField }) => {
                    const logoUrl = form.getFieldValue([
                      "customers",
                      name,
                      "logoUrl",
                    ]);

                    return (
                      <Card
                        key={key}
                        className="rounded-2xl border border-slate-200"
                      >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                          <Form.Item
                            {...restField}
                            label="Customer Name"
                            name={[name, "name"]}
                            rules={[
                              {
                                required: true,
                                message: "Customer name is required",
                              },
                            ]}
                          >
                            <Input
                              size="large"
                              placeholder="Example: JCB"
                            />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            label="Logo URL"
                            name={[name, "logoUrl"]}
                            rules={[
                              {
                                required: true,
                                message: "Logo is required",
                              },
                            ]}
                          >
                            <Input
                              size="large"
                              placeholder="Upload logo or paste URL"
                            />
                          </Form.Item>

                          <Space>
                            <Upload
                              showUploadList={false}
                              accept="image/*"
                              beforeUpload={(file) =>
                                uploadCustomerLogo(file, name)
                              }
                            >
                              <Button
                                icon={<UploadOutlined />}
                                loading={uploadingIndex === name}
                              >
                                Upload
                              </Button>
                            </Upload>

                            <Button
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => remove(name)}
                            />
                          </Space>
                        </div>

                        {logoUrl && (
                          <div className="mt-4 rounded-xl bg-slate-50 p-4">
                            <Text className="block mb-2 text-slate-500">
                              Logo Preview
                            </Text>

                            <img
                              src={logoUrl}
                              alt="Customer Logo"
                              className="h-16 max-w-[180px] object-contain"
                            />
                          </div>
                        )}
                      </Card>
                    );
                  })}
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
            Save Customers
          </Button>
        </Form>
      </Card>
    </ProtectedRoutes>
  );
}