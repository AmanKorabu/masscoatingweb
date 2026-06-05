"use client";

import ProtectedRoutes from "@/app/admin/_components/ProtectedRoutes";
import { db } from "@/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button, Card, Form, Input, Spin, Typography, Upload, message } from "antd";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { uploadImageToCloudinary } from "@/services/cloudinaryUploads";
const { Title } = Typography;

export default function NavbarSettingsPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const companyName = Form.useWatch("companyName", form);
    const logoUrl = Form.useWatch("logoUrl", form);
    const ctaText = Form.useWatch("ctaText", form);
    useEffect(() => {
        const fetchNavbarSettings = async () => {
            try {
                const docRef = doc(db, "settings", "navbar");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    form.setFieldsValue(docSnap.data());
                }
            } catch (error) {
                console.log(error);
                message.error("Failed to load navbar settings");
            } finally {
                setLoading(false);
            }
        };

        fetchNavbarSettings();
    }, [form]);
    const handleLogoUpload = async (file: File) => {
        try {
            setSaving(true);

            const imageUrl = await uploadImageToCloudinary(file);

            form.setFieldsValue({
                logoUrl: imageUrl,
            });

            message.success("Logo uploaded successfully");
        } catch (error) {
            console.log(error);
            message.error("Logo upload failed");
        } finally {
            setSaving(false);
        }

        return false;
    };
    const onFinish = async (values: { companyName: string; logoUrl: string; ctaText: string; ctaLink: string }) => {
        try {
            setSaving(true);

            const docRef = doc(db, "settings", "navbar");

            await updateDoc(docRef, {
                companyName: values.companyName,
                logoUrl: values.logoUrl || "",
                ctaText: values.ctaText,
                ctaLink: values.ctaLink,
            });

            message.success("Navbar settings updated successfully");
        } catch (error) {
            console.log(error);
            message.error("Failed to update navbar settings");
        } finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }
    return (
        <ProtectedRoutes>
            <div className="min-h-screen bg-slate-100 p-6">
                <Card className="max-w-3xl mx-auto shadow-md">
                    <Title level={3}>Navbar Settings</Title>

                    <Spin spinning={loading}>
                        <div className="mb-8">
                            <p className="text-sm font-medium text-slate-500 mb-3">
                                Live Navbar Preview
                            </p>

                            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-r from-[#0a1a2f] to-[#0d2847]">
                                <div className="px-6 lg:px-8 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden">
                                            {logoUrl ? (
                                                <img
                                                    src={logoUrl}
                                                    alt="logo"
                                                    className="w-full h-28 object-contain"
                                                />
                                            ) : (
                                                <span className="text-white text-xl font-bold">M</span>
                                            )}
                                        </div>

                                        <div>
                                            <h2 className="text-white font-bold text-xl leading-tight">
                                                {companyName || "MASS COATING"}
                                            </h2>

                                            <p className="text-xs text-blue-300 tracking-wider">
                                                INDUSTRIAL SOLUTIONS
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg"
                                    >
                                        {ctaText || "Get Quote"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <Form.Item
                                label="Company Name"
                                name="companyName"
                                rules={[{ required: true, message: "Company name is required" }]}
                            >
                                <Input size="large" placeholder="Mass Coating Company" />
                            </Form.Item>
                            <Form.Item label="Upload Logo">
                                <Upload
                                    beforeUpload={handleLogoUpload}
                                    showUploadList={false}
                                    accept="image/*"
                                >
                                    <Button icon={<UploadOutlined />} loading={saving}>
                                        Upload Logo
                                    </Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item label="Logo URL" name="logoUrl">
                                <Input size="large" placeholder="https://..." />
                            </Form.Item>

                            <Form.Item
                                label="CTA Button Text"
                                name="ctaText"
                                rules={[{ required: true, message: "CTA text is required" }]}
                            >
                                <Input size="large" placeholder="Get Quote" />
                            </Form.Item>

                            <Form.Item
                                label="CTA Button Link"
                                name="ctaLink"
                                rules={[{ required: true, message: "CTA link is required" }]}
                            >
                                <Input size="large" placeholder="/contact" />
                            </Form.Item>

                            <Button type="primary" htmlType="submit" size="large" loading={saving}>
                                Save Changes
                            </Button>
                        </Form>
                    </Spin>
                </Card>
            </div>
        </ProtectedRoutes>
    );
}