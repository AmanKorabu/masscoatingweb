"use client";

import ProtectedRoutes from "@/app/admin/_components/ProtectedRoutes";
import { db } from "@/firebase/config";
import {
  ContactsOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  MailOutlined,
  PhoneOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Spin,
  Typography,
  message,
} from "antd";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;
const { TextArea } = Input;

type FooterFormValues = {
  companyName: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  copyright: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
};

export default function FooterSettingsPage() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const companyName = Form.useWatch("companyName", form);
  const description = Form.useWatch("description", form);
  const address = Form.useWatch("address", form);
  const phone = Form.useWatch("phone", form);
  const email = Form.useWatch("email", form);
  const copyright = Form.useWatch("copyright", form);
  const facebookUrl = Form.useWatch("facebookUrl", form);
  const instagramUrl = Form.useWatch("instagramUrl", form);
  const linkedinUrl = Form.useWatch("linkedinUrl", form);
  useEffect(() => {
    const fetchFooterSettings = async () => {
      try {
        const docRef = doc(db, "settings", "footer");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          form.setFieldsValue(docSnap.data());
        } else {
          form.setFieldsValue({
            companyName: "Mass Coating Company",
            description:
              "Professional industrial coating, shot blasting and powder coating services.",
            address: "",
            phone: "",
            email: "",
            copyright:
              "© 2026 Mass Coating Company. All rights reserved.",
            facebookUrl: "",
            instagramUrl: "",
            linkedinUrl: "",
          });
        }
      } catch (error) {
        console.log(error);
        message.error("Failed to load footer settings");
      } finally {
        setLoading(false);
      }
    };

    fetchFooterSettings();
  }, [form]);

  const onFinish = async (values: FooterFormValues) => {
    try {
      setSaving(true);

      await setDoc(doc(db, "settings", "footer"), {
        companyName: values.companyName,
        description: values.description,
        address: values.address,
        phone: values.phone,
        email: values.email,
        copyright: values.copyright,
      });

      message.success("Footer settings updated successfully");
    } catch (error) {
      console.log(error);
      message.error("Failed to update footer settings");
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
      <Card className="mx-auto max-w-6xl rounded-2xl shadow-md">
        <div className="mb-6">
          <Title level={3} className="!mb-1">
            Footer Settings
          </Title>

          <Text className="text-slate-500">
            Manage website footer contact details and company information.
          </Text>
        </div>

        {/* Live Footer Preview */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-[#07111f] text-white shadow-xl">
          <div className="grid gap-8 px-6 py-8 md:grid-cols-3">
            <div>
              <h2 className="text-xl font-bold">
                {companyName || "Mass Coating Company"}
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                {description ||
                  "Professional industrial coating and surface finishing services."}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                Quick Links
              </h3>

              <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
                <span>Home</span>
                <span>About</span>
                <span>Services</span>
                <span>Gallery</span>
                <span>Contact</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                Contact
              </h3>

              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p className="flex gap-3">
                  <EnvironmentOutlined className="mt-1 text-blue-300" />
                  <span>{address || "Company address here"}</span>
                </p>

                <p className="flex gap-3">
                  <PhoneOutlined className="mt-1 text-blue-300" />
                  <span>{phone || "+91 9876543210"}</span>
                </p>

                <p className="flex gap-3">
                  <MailOutlined className="mt-1 text-blue-300" />
                  <span>{email || "info@example.com"}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-slate-400">
            {copyright ||
              "© 2026 Mass Coating Company. All rights reserved."}
          </div>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Company Name"
            name="companyName"
            rules={[
              { required: true, message: "Company name is required" },
            ]}
          >
            <Input
              size="large"
              prefix={<ContactsOutlined />}
              placeholder="Mass Coating Company"
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Description is required" },
            ]}
          >
            <TextArea
              rows={3}
              placeholder="Professional industrial coating services..."
            />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Address is required" }]}
          >
            <TextArea
              rows={3}
              placeholder="Company full address"
            />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Phone is required" }]}
          >
            <Input
              size="large"
              prefix={<PhoneOutlined />}
              placeholder="+91 9876543210"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter valid email" },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined />}
              placeholder="info@example.com"
            />
          </Form.Item>

          <Form.Item
            label="Copyright Text"
            name="copyright"
            rules={[
              { required: true, message: "Copyright text is required" },
            ]}
          >
            <Input
              size="large"
              placeholder="© 2026 Mass Coating Company. All rights reserved."
            />
          </Form.Item>
          <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-4 text-lg font-black text-slate-950">
              Social Media Links
            </h3>

            <Form.Item label="Facebook URL" name="facebookUrl">
              
              <Input
                size="large"
                placeholder="https://facebook.com/your-page"
              />
            </Form.Item>

            <Form.Item label="Instagram URL" name="instagramUrl">
              <Input
                size="large"
                placeholder="https://instagram.com/your-page"
              />
            </Form.Item>

            <Form.Item label="LinkedIn URL" name="linkedinUrl">
              <Input
                size="large"
                placeholder="https://linkedin.com/company/your-company"
              />
            </Form.Item>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            icon={<SaveOutlined />}
            loading={saving}
          >
            Save Footer Settings
          </Button>
        </Form>
      </Card>
    </ProtectedRoutes>
  );
}