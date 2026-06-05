"use client";

import ProtectedRoutes from "@/app/admin/_components/ProtectedRoutes";
import { db } from "@/firebase/config";
import { uploadImageToCloudinary } from "@/services/cloudinaryUploads";
import {
  DeleteOutlined,
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

type PartnerMember = {
  name: string;
  position: string;
  education: string;
  location: string;
  imageUrl: string;
  bio: string;
  displayOrder: number;
  isActive: boolean;
};

type PartnersFormValues = {
  badge: string;
  title: string;
  subTitle: string;
  members: PartnerMember[];
};

export default function PartnersSettingsPage() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const docRef = doc(db, "partners", "team");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          form.setFieldsValue(docSnap.data());
        } else {
          form.setFieldsValue({
            badge: "See Who We Are",
            title: "Our Partners",
            subTitle: "Meet the people behind Mass Coating",
            members: [],
          });
        }
      } catch (error) {
        console.log(error);
        message.error("Failed to load partners settings");
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [form]);

  const uploadMemberImage = async (file: File, index: number) => {
    try {
      setUploadingIndex(index);

      const imageUrl = await uploadImageToCloudinary(file);

      const members = form.getFieldValue("members") || [];

      members[index] = {
        ...members[index],
        imageUrl,
      };

      form.setFieldsValue({ members });

      message.success("Member image uploaded successfully");
    } catch (error: any) {
      console.log(error);
      message.error(error.message || "Image upload failed");
    } finally {
      setUploadingIndex(null);
    }

    return false;
  };

  const onFinish = async (values: PartnersFormValues) => {
    try {
      setSaving(true);

      const members = (values.members || [])
        .filter((member) => member?.name && member?.position)
        .map((member, index) => ({
          name: member.name || "",
          position: member.position || "",
          education: member.education || "",
          location: member.location || "",
          imageUrl: member.imageUrl || "",
          bio: member.bio || "",
          displayOrder: Number(member.displayOrder || index + 1),
          isActive: member.isActive ?? true,
        }));

      await setDoc(doc(db, "partners", "team"), {
        badge: values.badge || "See Who We Are",
        title: values.title || "Our Partners",
        subTitle: values.subTitle || "",
        members,
      });

      message.success("Partners settings updated successfully");
    } catch (error) {
      console.log(error);
      message.error("Failed to update partners settings");
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
            Partners Settings
          </Title>

          <Text className="text-slate-500">
            Manage who-we-are section members, positions, education, locations and photos.
          </Text>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Form.Item
              label="Badge"
              name="badge"
              rules={[{ required: true, message: "Badge is required" }]}
            >
              <Input size="large" placeholder="See Who We Are" />
            </Form.Item>

            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input size="large" placeholder="Our Partners" />
            </Form.Item>

            <Form.Item label="Subtitle" name="subTitle">
              <Input
                size="large"
                placeholder="Meet the people behind Mass Coating"
              />
            </Form.Item>
          </div>

          <Form.List name="members">
            {(fields, { add, remove }) => (
              <>
                <div className="mb-4 mt-4 flex items-center justify-between">
                  <Title level={4} className="!mb-0">
                    Members
                  </Title>

                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() =>
                      add({
                        name: "",
                        position: "",
                        education: "",
                        location: "",
                        imageUrl: "",
                        bio: "",
                        displayOrder: fields.length + 1,
                        isActive: true,
                      })
                    }
                  >
                    Add Member
                  </Button>
                </div>

                <div className="space-y-5">
                  {fields.map(({ key, name, ...restField }) => {
                    const imageUrl = form.getFieldValue([
                      "members",
                      name,
                      "imageUrl",
                    ]);

                    return (
                      <Card
                        key={key}
                        className="rounded-2xl border border-slate-200"
                      >
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[180px_1fr]">
                          <div>
                            <div className="mb-3 flex h-44 w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt="Member"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-sm text-slate-400">
                                  No Image
                                </span>
                              )}
                            </div>

                            <Upload
                              showUploadList={false}
                              accept="image/*"
                              beforeUpload={(file) =>
                                uploadMemberImage(file, name)
                              }
                            >
                              <Button
                                icon={<UploadOutlined />}
                                loading={uploadingIndex === name}
                                block
                              >
                                Upload Photo
                              </Button>
                            </Upload>
                          </div>

                          <div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <Form.Item
                                {...restField}
                                label="Name"
                                name={[name, "name"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Name is required",
                                  },
                                ]}
                              >
                                <Input
                                  size="large"
                                  placeholder="Shailesh Jadhav"
                                />
                              </Form.Item>

                              <Form.Item
                                {...restField}
                                label="Position"
                                name={[name, "position"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Position is required",
                                  },
                                ]}
                              >
                                <Input size="large" placeholder="Director" />
                              </Form.Item>

                              <Form.Item
                                {...restField}
                                label="Education"
                                name={[name, "education"]}
                              >
                                <Input
                                  size="large"
                                  placeholder="B.E Mechanical"
                                />
                              </Form.Item>

                              <Form.Item
                                {...restField}
                                label="Location"
                                name={[name, "location"]}
                              >
                                <Input size="large" placeholder="Pune" />
                              </Form.Item>

                              <Form.Item
                                {...restField}
                                label="Display Order"
                                name={[name, "displayOrder"]}
                              >
                                <InputNumber
                                  size="large"
                                  className="!w-full"
                                  min={1}
                                  placeholder="1"
                                />
                              </Form.Item>

                              <Form.Item
                                {...restField}
                                label="Image URL"
                                name={[name, "imageUrl"]}
                              >
                                <Input
                                  size="large"
                                  placeholder="Upload photo or paste URL"
                                />
                              </Form.Item>
                            </div>

                            <Form.Item
                              {...restField}
                              label="Bio"
                              name={[name, "bio"]}
                            >
                              <TextArea
                                rows={3}
                                placeholder="Short information about this member"
                              />
                            </Form.Item>

                            <div className="flex items-center justify-between">
                              <Form.Item
                                {...restField}
                                name={[name, "isActive"]}
                                valuePropName="checked"
                                className="!mb-0"
                              >
                                <Checkbox>Active</Checkbox>
                              </Form.Item>

                              <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => remove(name)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </Form.List>

          <Space className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SaveOutlined />}
              loading={saving}
            >
              Save Partners
            </Button>
          </Space>
        </Form>
      </Card>
    </ProtectedRoutes>
  );
}