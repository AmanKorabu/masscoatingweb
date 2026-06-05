"use client";

import ProtectedRoutes from "@/app/admin/_components/ProtectedRoutes";
import {
  getGetQuoteSettings,
  saveGetQuoteSettings,
} from "@/services/getQuoteSettings";
import { GetQuoteSettingsData } from "@/types/getQuote";
import {
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
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

const defaultValues: GetQuoteSettingsData = {
  badge: "Get Quote",
  title: "Request an Industrial Coating Quote",
  subTitle:
    "Share your project details and our team will get back with an estimate.",

  formTitle: "Tell Us Your Requirement",
  formSubTitle:
    "Add product details, quantity, surface condition and images if available.",

  serviceOptions: [
    "Shot Blasting",
    "Powder Coating",
    "Industrial Painting",
    "Surface Finishing",
    "Other",
  ],

  materialOptions: [
    "MS",
    "SS",
    "Aluminium",
    "Cast Iron",
    "Fabrication Part",
    "Other",
  ],

  surfaceConditionOptions: [
    "Rusted",
    "Oily",
    "Painted",
    "Raw Material",
    "Old Coating",
    "Other",
  ],

  whatsappNumber: "+91 9876543210",
  whatsappButtonText: "WhatsApp for Quick Quote",

  processTitle: "How We Process Your Quote",
  processSubTitle:
    "Our team reviews your requirement and responds with the best solution.",

  processSteps: [
    "Submit Requirement",
    "Review Details",
    "Get Estimate",
    "Start Work",
  ],

  ctaTitle: "Ready to Start Your Coating Work?",
  ctaSubTitle: "Send your details and our team will contact you shortly.",
};

export default function AdminGetQuotePage() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchGetQuoteSettings = async () => {
      try {
        setLoading(true);

        const data = await getGetQuoteSettings();

        form.setFieldsValue(data || defaultValues);
      } catch (error) {
        console.log("Failed to load get quote settings:", error);
        message.error("Failed to load get quote settings");
      } finally {
        setLoading(false);
      }
    };

    fetchGetQuoteSettings();
  }, [form]);

  const onFinish = async (values: GetQuoteSettingsData) => {
    try {
      setSaving(true);

      const payload: GetQuoteSettingsData = {
        ...values,
        serviceOptions: (values.serviceOptions || []).filter(Boolean),
        materialOptions: (values.materialOptions || []).filter(Boolean),
        surfaceConditionOptions: (
          values.surfaceConditionOptions || []
        ).filter(Boolean),
        processSteps: (values.processSteps || []).filter(Boolean),
      };

      await saveGetQuoteSettings(payload);

      message.success("Get Quote settings saved successfully");
    } catch (error) {
      console.log("Failed to save get quote settings:", error);
      message.error("Failed to save get quote settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoutes>
      <Card className="mx-auto max-w-7xl rounded-2xl shadow-md">
        <div className="mb-6">
          <Title level={3} className="!mb-1">
            Get Quote Settings
          </Title>

          <Text className="text-slate-500">
            Manage Get Quote page content, dropdown options, process steps and
            CTA section.
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={defaultValues}
        >
          {/* Hero Section */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Title level={5} className="!mb-4">
              Hero Section
            </Title>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Form.Item
                label="Badge"
                name="badge"
                rules={[{ required: true, message: "Badge is required" }]}
              >
                <Input size="large" placeholder="Get Quote" />
              </Form.Item>

              <Form.Item
                label="WhatsApp Number"
                name="whatsappNumber"
                rules={[
                  { required: true, message: "WhatsApp number is required" },
                ]}
              >
                <Input size="large" placeholder="+91 9876543210" />
              </Form.Item>
            </div>

            <Form.Item
              label="Main Title"
              name="title"
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input
                size="large"
                placeholder="Request an Industrial Coating Quote"
              />
            </Form.Item>

            <Form.Item
              label="Sub Title"
              name="subTitle"
              rules={[{ required: true, message: "Sub title is required" }]}
            >
              <TextArea
                rows={3}
                placeholder="Share your project details and our team will get back with an estimate."
              />
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
              <Input size="large" placeholder="WhatsApp for Quick Quote" />
            </Form.Item>
          </div>

          {/* Form Section */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
            <Title level={5} className="!mb-4">
              Quote Form Text
            </Title>

            <Form.Item
              label="Form Title"
              name="formTitle"
              rules={[{ required: true, message: "Form title is required" }]}
            >
              <Input size="large" placeholder="Tell Us Your Requirement" />
            </Form.Item>

            <Form.Item
              label="Form Sub Title"
              name="formSubTitle"
              rules={[
                { required: true, message: "Form sub title is required" },
              ]}
            >
              <TextArea
                rows={3}
                placeholder="Add product details, quantity, surface condition and images if available."
              />
            </Form.Item>
          </div>

          {/* Service Options */}
          <DynamicListField
            title="Service Options"
            description="These options will show in Service Required dropdown."
            name="serviceOptions"
            placeholder="Example: Powder Coating"
          />

          {/* Material Options */}
          <DynamicListField
            title="Material Options"
            description="These options will show in Material Type dropdown."
            name="materialOptions"
            placeholder="Example: MS"
          />

          {/* Surface Condition Options */}
          <DynamicListField
            title="Surface Condition Options"
            description="These options will show in Surface Condition dropdown."
            name="surfaceConditionOptions"
            placeholder="Example: Rusted"
          />

          {/* Process Section */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Title level={5} className="!mb-4">
              Process Section
            </Title>

            <Form.Item
              label="Process Title"
              name="processTitle"
              rules={[
                { required: true, message: "Process title is required" },
              ]}
            >
              <Input size="large" placeholder="How We Process Your Quote" />
            </Form.Item>

            <Form.Item
              label="Process Sub Title"
              name="processSubTitle"
              rules={[
                {
                  required: true,
                  message: "Process sub title is required",
                },
              ]}
            >
              <TextArea
                rows={3}
                placeholder="Our team reviews your requirement and responds with the best solution."
              />
            </Form.Item>
          </div>

          <DynamicListField
            title="Process Steps"
            description="These steps will show in the process card on Get Quote page."
            name="processSteps"
            placeholder="Example: Submit Requirement"
          />

          {/* CTA Section */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
            <Title level={5} className="!mb-4">
              CTA Section
            </Title>

            <Form.Item
              label="CTA Title"
              name="ctaTitle"
              rules={[{ required: true, message: "CTA title is required" }]}
            >
              <Input
                size="large"
                placeholder="Ready to Start Your Coating Work?"
              />
            </Form.Item>

            <Form.Item
              label="CTA Sub Title"
              name="ctaSubTitle"
              rules={[
                { required: true, message: "CTA sub title is required" },
              ]}
            >
              <TextArea
                rows={3}
                placeholder="Send your details and our team will contact you shortly."
              />
            </Form.Item>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={saving || loading}
            size="large"
          >
            Save Get Quote Settings
          </Button>
        </Form>
      </Card>
    </ProtectedRoutes>
  );
}

function DynamicListField({
  title,
  description,
  name,
  placeholder,
}: {
  title: string;
  description: string;
  name:
    | "serviceOptions"
    | "materialOptions"
    | "surfaceConditionOptions"
    | "processSteps";
  placeholder: string;
}) {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Text strong>{title}</Text>
              <p className="mb-0 text-xs text-slate-500">{description}</p>
            </div>

            <Button icon={<PlusOutlined />} onClick={() => add("")}>
              Add Option
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map(({ key, name: fieldName, ...restField }) => (
              <Space key={key} className="flex" align="baseline">
                <Form.Item
                  {...restField}
                  name={fieldName}
                  rules={[
                    { required: true, message: "This field is required" },
                  ]}
                  className="!mb-0"
                >
                  <Input
                    className="min-w-[240px] md:min-w-[560px]"
                    placeholder={placeholder}
                  />
                </Form.Item>

                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => remove(fieldName)}
                />
              </Space>
            ))}
          </div>
        </div>
      )}
    </Form.List>
  );
}