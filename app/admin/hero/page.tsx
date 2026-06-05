"use client";

import ProtectedRoutes from "@/app/admin/_components/ProtectedRoutes";
import { db } from "@/firebase/config";
import { uploadImageToCloudinary } from "@/services/cloudinaryUploads";
import { PlusOutlined } from "@ant-design/icons";
import {
    Button,
    Card,
    Form,
    Image,
    Input,
    Spin,
    Typography,
    Upload,
    message,
} from "antd";
import type { UploadFile, UploadProps } from "antd";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const { Title } = Typography;
const { TextArea } = Input;

type HeroFormValues = {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
};

export default function HeroSettingsPage() {
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const docRef = doc(db, "homepage", "hero");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    form.setFieldsValue({
                        title: data.title,
                        subtitle: data.subtitle,
                        buttonText: data.buttonText,
                        buttonLink: data.buttonLink,
                    });

                    if (Array.isArray(data.images)) {
                        setImageUrls(data.images);

                        setFileList(
                            data.images.map((url: string, index: number) => ({
                                uid: String(index),
                                name: `hero-${index + 1}.jpg`,
                                status: "done",
                                url,
                                thumbUrl: url,
                            }))
                        );
                    }
                }
            } catch (error) {
                console.log(error);
                message.error("Failed to load hero settings");
            } finally {
                setLoading(false);
            }
        };

        fetchHeroData();
    }, [form]);

    const handlePreview = async (file: UploadFile) => {
        setPreviewImage(file.url || "");
        setPreviewOpen(true);
    };

    const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const customUpload: UploadProps["customRequest"] = async ({
        file,
        onSuccess,
        onError,
    }) => {
        try {
            const imageUrl = await uploadImageToCloudinary(file as File);
            const uploadedFile = file as any;

            setImageUrls((prev) => {
                if (prev.includes(imageUrl)) {
                    return prev;
                }

                return [...prev, imageUrl];
            });

            setFileList((prev) =>
                prev.map((item) =>
                    item.uid === uploadedFile.uid
                        ? {
                            ...item,
                            status: "done",
                            url: imageUrl,
                            thumbUrl: imageUrl,
                        }
                        : item
                )
            );

            onSuccess?.("ok");
            message.success("Image uploaded successfully");
        } catch (error: any) {
            console.log(error);
            onError?.(error);
            message.error(error.message || "Image upload failed");
        }
    };
    const handleRemove = (file: UploadFile) => {
        const imageUrl = file.url || file.thumbUrl;

        if (imageUrl) {
            setImageUrls((prev) => prev.filter((url) => url !== imageUrl));
        }

        return true;
    };
    const onFinish = async (values: HeroFormValues) => {
        try {
            setSaving(true);

            const images = imageUrls;

            console.log("Saving Images:", images);

            const docRef = doc(db, "homepage", "hero");

            await setDoc(docRef, {
                title: values.title,
                subtitle: values.subtitle,
                buttonText: values.buttonText,
                buttonLink: values.buttonLink,
                images,
            });

            message.success("Hero section updated successfully");
        } catch (error) {
            console.log(error);
            message.error("Failed to update hero section");
        } finally {
            setSaving(false);
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

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
            <Card className="max-w-5xl mx-auto shadow-md">
                <Title level={3}>Hero Section Settings</Title>

                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Hero Title"
                        name="title"
                        rules={[{ required: true, message: "Hero title is required" }]}
                    >
                        <Input size="large" placeholder="Industrial Coating Solutions" />
                    </Form.Item>

                    <Form.Item
                        label="Hero Subtitle"
                        name="subtitle"
                        rules={[{ required: true, message: "Hero subtitle is required" }]}
                    >
                        <TextArea rows={4} placeholder="Write hero subtitle here..." />
                    </Form.Item>

                    <Form.Item
                        label="Button Text"
                        name="buttonText"
                        rules={[{ required: true, message: "Button text is required" }]}
                    >
                        <Input size="large" placeholder="Get Quote" />
                    </Form.Item>

                    <Form.Item
                        label="Button Link"
                        name="buttonLink"
                        rules={[{ required: true, message: "Button link is required" }]}
                    >
                        <Input size="large" placeholder="/contact" />
                    </Form.Item>

                    <Form.Item label="Hero Background Images">
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            onRemove={handleRemove}
                            customRequest={customUpload}
                            accept="image/*"
                        >
                            {fileList.length >= 5 ? null : uploadButton}
                        </Upload>
                    </Form.Item>

                    {previewImage && (
                        <Image
                            style={{ display: "none" }}
                            preview={{
                                open: previewOpen,
                                onOpenChange: (visible) => setPreviewOpen(visible),
                                afterOpenChange: (visible) => !visible && setPreviewImage(""),
                            }}
                            src={previewImage}
                        />
                    )}

                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={saving}
                    >
                        Save Hero Section
                    </Button>
                </Form>
            </Card>
        </ProtectedRoutes>
    );
}