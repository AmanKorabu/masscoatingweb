"use client";

import { getContactSettings, saveContactMessage } from "@/services/contactSettings";
import { ContactSettingsData } from "@/types/contact";
import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  SendOutlined,
  WhatsAppOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";

const { TextArea } = Input;

const defaultContactData: ContactSettingsData = {
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

type ContactFormValues = {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message: string;
};

export default function ContactPage() {
  const [contactData, setContactData] =
    useState<ContactSettingsData>(defaultContactData);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);

        const data = await getContactSettings();

        if (data) {
          setContactData(data);
          console.log("Contact settings loaded:", data);
        }
      } catch (error) {
        console.log("Failed to load contact settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  const cleanPhoneNumber = (phone: string) => {
    return phone.replace(/\s+/g, "").replace("+", "");
  };

  const handleSubmit = async (values: ContactFormValues) => {
    try {
      setSubmitting(true);

      await saveContactMessage({
        name: values.name,
        phone: values.phone,
        email: values.email || "",
        service: values.service || "",
        message: values.message,
      });

      message.success("Your inquiry has been sent successfully");
      form.resetFields();
    } catch (error: any) {
      console.log("Failed to send message:", error);
      message.error(error.message || "Failed to send inquiry. Please try again.");
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
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="h-[420px] animate-pulse rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200" />
            <div className="h-[520px] animate-pulse rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200" />
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
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-100 sm:text-xs">
                {contactData.badge}
              </span>
            </div>

            <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              {contactData.title}
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              {contactData.subTitle}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${contactData.phone}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                <PhoneOutlined />
                {contactData.callButtonText}
              </a>

              <a
                href={`https://wa.me/${cleanPhoneNumber(contactData.whatsapp)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/15"
              >
                <WhatsAppOutlined />
                {contactData.whatsappButtonText}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      {/* <section className="px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ContactInfoCard
            icon={<PhoneOutlined />}
            title="Call Us"
            value={contactData.phone}
          />

          <ContactInfoCard
            icon={<WhatsAppOutlined />}
            title="WhatsApp"
            value={contactData.whatsapp}
          />

          <ContactInfoCard
            icon={<MailOutlined />}
            title="Email"
            value={contactData.email}
          />


        </div>
      </section> */}

      {/* Form + Details */}
      <section className="px-4 pb-10 sm:px-6 md:pb-14 lg:px-8 pt-5">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Details */}
          <div className="rounded-[2rem] bg-[#07111f] p-6 text-white shadow-xl">
            <div className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-100">
                Company Details
              </span>
            </div>

            <h2 className="text-2xl font-black">Reach Our Team</h2>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              Contact us for industrial coating, powder coating, shot blasting
              and finishing work.
            </p>

            <div className="mt-7 space-y-4">
              <DetailRow
                icon={<PhoneOutlined />}
                label="Phone"
                value={contactData.phone}
              />

              <DetailRow
                icon={<WhatsAppOutlined />}
                label="WhatsApp"
                value={contactData.whatsapp}
              />

              <DetailRow
                icon={<MailOutlined />}
                label="Email"
                value={contactData.email}
              />

              <DetailRow
                icon={<EnvironmentOutlined />}
                label="Address"
                value={contactData.address}
              />
              <ContactInfoCard
                icon={<ClockCircleOutlined />}
                title="Working Hours"
                value={contactData.workingHours}
              />
            </div>
          </div>

          {/* Form */}
          <div className="rounded-[2rem] bg-white p-5 shadow-xl ring-1 ring-slate-200 sm:p-7">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">
                Inquiry Form
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                {contactData.formTitle}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {contactData.formSubTitle}
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

                <Form.Item
                  label="Mobile Number"
                  name="phone"

                  rules={[

                    { required: true, message: "Mobile number is required" },
                  ]}
                >
                  <Input maxLength={10} size="large" type="number" placeholder="+91 XXXXX XXXXX" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                <Form.Item label="Service Interested In" name="service">
                  <Select
                    size="large"
                    placeholder="Select service"
                    showSearch
                    optionFilterProp="label"
                    options={(contactData.serviceOptions || []).map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  />
                </Form.Item>
              </div>

              <Form.Item
                label="Message"
                name="message"
                rules={[{ required: true, message: "Message is required" }]}
              >
                <TextArea
                  rows={5}
                  placeholder="Tell us about your requirement"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SendOutlined />}
                loading={submitting}
                className="!h-12 !rounded-xl !bg-[#07111f] !px-7 !font-bold"
              >
                Send Inquiry
              </Button>
            </Form>
          </div>
        </div>
      </section>


      {/* Map */}
      < section className="px-4 pb-10 sm:px-6 md:pb-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">
              Location
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
              Find Us on Map
            </h2>
          </div>

          {contactData.mapEmbedUrl ? (
            <div className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-xl ring-1 ring-slate-200">
              <iframe
                src={contactData.mapEmbedUrl}
                className="h-[320px] w-full rounded-[1.5rem] border-0 md:h-[420px]"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-semibold text-slate-500">
                Map location is not added yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-14 sm:px-6 md:pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#07111f] p-6 text-white shadow-xl md:p-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black md:text-3xl">
                {contactData.ctaTitle}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
                {contactData.ctaSubTitle}
              </p>
            </div>

            <a
              href={`tel:${contactData.phone}`}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <PhoneOutlined />
              {contactData.callButtonText}
            </a>
          </div>
        </div>
      </section>
    </main >
  );
}

function ContactInfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
        {icon}
      </div>

      <p className="text-sm font-black text-slate-950">{title}</p>
      <p className="mt-1 break-words text-sm leading-6 text-slate-500">
        {value}
      </p>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl bg-white/10 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-200">
        {icon}
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          {label}
        </p>
        <p className="mt-1 text-sm leading-6 text-white">{value}</p>
      </div>
    </div>
  );
}