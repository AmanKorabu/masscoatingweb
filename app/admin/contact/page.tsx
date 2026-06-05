"use client";

import ProtectedRoutes from "@/app/admin/_components/ProtectedRoutes";
import {
  getContactSettings,
  saveContactSettings,
} from "@/services/contactSettings";
import { ContactSettingsData } from "@/types/contact";
import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Typography,
  message,
} from "antd";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;
const { TextArea } = Input;

const defaultValues: ContactSettingsData = {
  badge: "Contact Us",
  title: "Let’s Discuss Your Coating Requirement",
  subTitle:
    "Reach out for powder coating, shot blasting, industrial painting and surface finishing work.",

  phone: "+91 9876543210",
  whatsapp: "+91 9876543210",
  email: "masscoating@example.com",
  address: "Your company address here",
  workingHours: "Mon - Sat, 9:00 AM - 7:00 PM",

  mapEmbedUrl: "",
  serviceOptions: [
    "Industrial Powder Coating",
    "Shot Blasting Services",
    "Industrial Painting",
    "Surface Finishing Solutions",
  ],
  callButtonText: "Call Now",
  whatsappButtonText: "WhatsApp Us",
  formTitle: "Send Your Inquiry",
  formSubTitle: "Tell us your requirement and our team will contact you soon.",

  ctaTitle: "Need Industrial Coating Work?",
  ctaSubTitle: "Contact us today for reliable industrial finishing solutions.",
};

export default function AdminContactPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const mapEmbedUrl = Form.useWatch("mapEmbedUrl", form);

  useEffect(() => {
    const fetchContactSettings = async () => {
      try {
        setLoading(true);

        const data = await getContactSettings();

        form.setFieldsValue(data || defaultValues);
      } catch (error) {
        console.log("Failed to load contact settings:", error);
        message.error("Failed to load contact settings");
      } finally {
        setLoading(false);
      }
    };

    fetchContactSettings();
  }, [form]);

  const onFinish = async (values: ContactSettingsData) => {
    try {
      setSaving(true);

      await saveContactSettings(values);

      message.success("Contact settings saved successfully");
    } catch (error) {
      console.log("Failed to save contact settings:", error);
      message.error("Failed to save contact settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoutes>
      <Card className="mx-auto max-w-7xl rounded-2xl shadow-md">
        <div className="mb-6">
          <Title level={3} className="!mb-1">
            Contact Settings
          </Title>

          <Text className="text-slate-500">
            Manage contact page details, inquiry content, buttons and Google Map.
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={defaultValues}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              label="Badge"
              name="badge"
              rules={[{ required: true, message: "Badge is required" }]}
            >
              <Input size="large" placeholder="Contact Us" />
            </Form.Item>

            <Form.Item
              label="Working Hours"
              name="workingHours"
              rules={[
                { required: true, message: "Working hours are required" },
              ]}
            >
              <Input size="large" placeholder="Mon - Sat, 9:00 AM - 7:00 PM" />
            </Form.Item>
          </div>

          <Form.Item
            label="Main Title"
            name="title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input size="large" placeholder="Let’s Discuss Your Coating Requirement" />
          </Form.Item>

          <Form.Item
            label="Sub Title"
            name="subTitle"
            rules={[{ required: true, message: "Sub title is required" }]}
          >
            <TextArea rows={3} placeholder="Short description for contact page" />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[{ required: true, message: "Phone number is required" }]}
            >
              <Input size="large" placeholder="+91 9876543210" />
            </Form.Item>

            <Form.Item
              label="WhatsApp Number"
              name="whatsapp"
              rules={[
                { required: true, message: "WhatsApp number is required" },
              ]}
            >
              <Input size="large" placeholder="+91 9876543210" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Email is required" }]}
            >
              <Input size="large" placeholder="masscoating@example.com" />
            </Form.Item>
          </div>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Address is required" }]}
          >
            <TextArea rows={3} placeholder="Company address" />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              label="Call Button Text"
              name="callButtonText"
              rules={[
                { required: true, message: "Call button text is required" },
              ]}
            >
              <Input size="large" placeholder="Call Now" />
            </Form.Item>

            <Form.Item
              label="WhatsApp Button Text"
              name="whatsappButtonText"
              rules={[
                {
                  required: true,
                  message: "WhatsApp button text is required",
                },
              ]}
            >
              <Input size="large" placeholder="WhatsApp Us" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              label="Form Title"
              name="formTitle"
              rules={[{ required: true, message: "Form title is required" }]}
            >
              <Input size="large" placeholder="Send Your Inquiry" />
            </Form.Item>

            <Form.Item
              label="CTA Title"
              name="ctaTitle"
              rules={[{ required: true, message: "CTA title is required" }]}
            >
              <Input size="large" placeholder="Need Industrial Coating Work?" />
            </Form.Item>
          </div>

          <Form.Item
            label="Form Sub Title"
            name="formSubTitle"
            rules={[{ required: true, message: "Form sub title is required" }]}
          >
            <TextArea rows={2} placeholder="Tell us your requirement..." />
          </Form.Item>
          <Form.List name="serviceOptions">
            {(fields, { add, remove }) => (
              <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <Text strong>Contact Form Service Options</Text>
                    <p className="mb-0 text-xs text-slate-500">
                      These options will show in the Contact page service dropdown.
                    </p>
                  </div>

                  <Button icon={<PlusOutlined />} onClick={() => add("")}>
                    Add Option
                  </Button>
                </div>

                <div className="space-y-3">
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} className="flex" align="baseline">
                      <Form.Item
                        {...restField}
                        name={name}
                        rules={[{ required: true, message: "Option is required" }]}
                        className="!mb-0"
                      >
                        <Input
                          className="min-w-[240px] md:min-w-[520px]"
                          placeholder="Example: Powder Coating"
                        />
                      </Form.Item>

                      <Button
                      className="m-2"
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
          <Form.Item
            label="CTA Sub Title"
            name="ctaSubTitle"
            rules={[{ required: true, message: "CTA sub title is required" }]}
          >
            <TextArea rows={2} placeholder="Contact us today..." />
          </Form.Item>

          <Form.Item label="Google Map Embed URL" name="mapEmbedUrl">
            <TextArea
              rows={3}
              placeholder="Paste only Google Maps embed src URL here"
            />
          </Form.Item>

          {mapEmbedUrl && (
            <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <iframe
                src={mapEmbedUrl}
                className="h-[260px] w-full rounded-xl border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}

          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={saving || loading}
            size="large"
          >
            Save Contact Settings
          </Button>
        </Form>
      </Card>
    </ProtectedRoutes>
  );
}