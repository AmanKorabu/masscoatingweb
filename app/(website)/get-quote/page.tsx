"use client";

import { uploadImageToCloudinary } from "@/services/cloudinaryUploads";
import {
  getGetQuoteSettings,
  saveQuoteRequest,
} from "@/services/getQuoteSettings";
import { GetQuoteSettingsData } from "@/types/getQuote";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  FileImageOutlined,
  PhoneOutlined,
  SendOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Upload,
  message,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const { TextArea } = Input;

const defaultQuoteData: GetQuoteSettingsData = {
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
  materialOptions: ["MS", "SS", "Aluminium", "Cast Iron", "Fabrication Part", "Other"],
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
  processSteps: ["Submit Requirement", "Review Details", "Get Estimate", "Start Work"],

  ctaTitle: "Ready to Start Your Coating Work?",
  ctaSubTitle: "Send your details and our team will contact you shortly.",
};

type QuoteFormValues = {
  name: string;
  companyName?: string;
  phone: string;
  email: string;
  service: string;
  materialType?: string;
  quantity?: string;
  dimensions?: string;
  surfaceCondition?: string;
  expectedDate?: any;
  pickupRequired?: string;
  message?: string;
};

export default function GetQuotePage() {
  const [quoteData, setQuoteData] =
    useState<GetQuoteSettingsData>(defaultQuoteData);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchQuoteSettings = async () => {
      try {
        setLoading(true);

        const data = await getGetQuoteSettings();

        if (data) {
          setQuoteData(data);
        }
      } catch (error) {
        console.log("Failed to load quote settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuoteSettings();
  }, []);

  const cleanPhoneNumber = (phone: string) => {
    return phone.replace(/\s+/g, "").replace("+", "");
  };

  const uploadQuoteImage = async (file: File) => {
    try {
      setUploading(true);

      const imageUrl = await uploadImageToCloudinary(file);

      setImageUrls((prev) => [...prev, imageUrl]);

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
    setImageUrls((prev) => prev.filter((_, imgIndex) => imgIndex !== index));
  };

  const handleSubmit = async (values: QuoteFormValues) => {
    try {
      setSubmitting(true);

      await saveQuoteRequest({
        name: values.name,
        companyName: values.companyName || "",
        phone: values.phone,
        email: values.email,
        service: values.service,
        materialType: values.materialType || "",
        quantity: values.quantity || "",
        dimensions: values.dimensions || "",
        surfaceCondition: values.surfaceCondition || "",
        expectedDate: values.expectedDate
          ? dayjs(values.expectedDate).format("YYYY-MM-DD")
          : "",
        pickupRequired: values.pickupRequired || "",
        message: values.message || "",
        imageUrls,
      });

      message.success("Quote request submitted successfully");
      form.resetFields();
      setImageUrls([]);
    } catch (error: any) {
      console.log("Failed to submit quote request:", error);
      message.error(error.message || "Failed to submit quote request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-[#f8fbff]">
        <section className="bg-[#07111f] px-4 py-14 text-white sm:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="h-6 w-44 animate-pulse rounded-full bg-white/20" />
            <div className="mt-6 h-14 max-w-2xl animate-pulse rounded-xl bg-white/20" />
            <div className="mt-4 h-5 max-w-xl animate-pulse rounded-xl bg-white/10" />
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="h-[620px] animate-pulse rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200" />
            <div className="h-[420px] animate-pulse rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#f8fbff]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#07111f] px-4 py-14 text-white sm:px-6 md:py-20 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-6 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px]" />
          <div className="absolute bottom-[-150px] right-[-120px] h-80 w-80 rounded-full bg-cyan-400/20 blur-[110px]" />
          <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:72px_72px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-100 sm:text-xs">
                  {quoteData.badge}
                </span>
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
                {quoteData.title}
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                {quoteData.subTitle}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`https://wa.me/${cleanPhoneNumber(
                    quoteData.whatsappNumber
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  <WhatsAppOutlined />
                  {quoteData.whatsappButtonText}
                </a>

                <a
                  href={`tel:${quoteData.whatsappNumber}`}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/15"
                >
                  <PhoneOutlined />
                  Call for Quote
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
              <p className="text-sm font-bold text-blue-100">
                Quote Request Includes
              </p>

              <div className="mt-4 space-y-3">
                {[
                  "Service requirement",
                  "Material & quantity details",
                  "Surface condition",
                  "Reference images",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 text-sm text-slate-200"
                  >
                    <CheckCircleOutlined className="text-cyan-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form + Process */}
      <section className="px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Quote Form */}
          <div className="rounded-[2rem] bg-white p-5 shadow-xl ring-1 ring-slate-200 sm:p-7">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">
                Quote Form
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                {quoteData.formTitle}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {quoteData.formSubTitle}
              </p>
            </div>

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: "Name is required" }]}
                >
                  <Input size="large" placeholder="Your name" />
                </Form.Item>

                <Form.Item label="Company Name" name="companyName">
                  <Input size="large" placeholder="Company name" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Form.Item
                  label="Mobile Number"
                  name="phone"
                  rules={[
                    { required: true, message: "Mobile number is required" },
                  ]}
                >
                  <Input size="large" placeholder="+91 XXXXX XXXXX" />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input size="large" placeholder="your@email.com" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Form.Item
                  label="Service Required"
                  name="service"
                  rules={[
                    { required: true, message: "Service is required" },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Select service"
                    showSearch
                    optionFilterProp="label"
                    options={(quoteData.serviceOptions || []).map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  />
                </Form.Item>

                <Form.Item label="Material Type" name="materialType">
                  <Select
                    size="large"
                    placeholder="Select material"
                    showSearch
                    optionFilterProp="label"
                    options={(quoteData.materialOptions || []).map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Form.Item label="Quantity" name="quantity">
                  <Input size="large" placeholder="Example: 100 pieces" />
                </Form.Item>

                <Form.Item label="Part Size / Dimensions" name="dimensions">
                  <Input size="large" placeholder="Example: 2ft x 4ft" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Form.Item label="Surface Condition" name="surfaceCondition">
                  <Select
                    size="large"
                    placeholder="Select condition"
                    showSearch
                    optionFilterProp="label"
                    options={(quoteData.surfaceConditionOptions || []).map(
                      (item) => ({
                        label: item,
                        value: item,
                      })
                    )}
                  />
                </Form.Item>

                <Form.Item label="Expected Date" name="expectedDate">
                  <DatePicker size="large" className="!w-full" />
                </Form.Item>
              </div>

              <Form.Item label="Pickup / Delivery Required?" name="pickupRequired">
                <Select
                  size="large"
                  placeholder="Select option"
                  options={[
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                    { label: "Not Sure", value: "Not Sure" },
                  ]}
                />
              </Form.Item>

              <Form.Item label="Message / Requirement Details" name="message">
                <TextArea
                  rows={5}
                  placeholder="Tell us about your product, coating requirement, deadline or any special note"
                />
              </Form.Item>

              {/* Upload Images */}
              <div className="mb-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="mb-1 font-bold text-slate-950">
                      Upload Reference Images
                    </p>
                    <p className="text-xs text-slate-500">
                      Upload product photos, drawings or sample images.
                    </p>
                  </div>

                  <Upload
                    showUploadList={false}
                    accept="image/*"
                    beforeUpload={uploadQuoteImage}
                  >
                    <Button
                      icon={<FileImageOutlined />}
                      loading={uploading}
                    >
                      Upload Image
                    </Button>
                  </Upload>
                </div>

                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {imageUrls.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="relative overflow-hidden rounded-xl bg-white ring-1 ring-slate-200"
                      >
                        <img
                          src={image}
                          alt={`Quote Image ${index + 1}`}
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
              </div>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SendOutlined />}
                loading={submitting}
                className="!h-12 !rounded-xl !bg-[#07111f] !px-7 !font-bold"
              >
                Submit Quote Request
              </Button>
            </Form>
          </div>

          {/* Process */}
          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-[#07111f] p-6 text-white shadow-xl">
              <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-100">
                  Process
                </span>
              </div>

              <h2 className="text-2xl font-black">{quoteData.processTitle}</h2>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                {quoteData.processSubTitle}
              </p>

              <div className="mt-7 space-y-4">
                {(quoteData.processSteps || []).map((step, index) => (
                  <div
                    key={`${step}-${index}`}
                    className="flex gap-4 rounded-2xl bg-white/10 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white">
                      {index + 1}
                    </div>

                    <div>
                      <p className="font-bold text-white">{step}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        Step {index + 1} of our quote process
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
              <h3 className="text-2xl font-black text-slate-950">
                {quoteData.ctaTitle}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                {quoteData.ctaSubTitle}
              </p>

              <a
                href={`https://wa.me/${cleanPhoneNumber(
                  quoteData.whatsappNumber
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 text-sm font-bold text-white transition hover:bg-green-700"
              >
                <WhatsAppOutlined />
                {quoteData.whatsappButtonText}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}