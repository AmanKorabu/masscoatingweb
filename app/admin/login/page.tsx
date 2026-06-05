"use client";

import {
    browserLocalPersistence,
    onAuthStateChanged,
    setPersistence,
    signInWithEmailAndPassword,
} from "firebase/auth";

import {
    Button,
    Card,
    Form,
    Input,
    Spin,
    Typography,
    message,
} from "antd";

import {
    LockOutlined,
    MailOutlined,
} from "@ant-design/icons";

import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { Title } = Typography;

export default function AdminLoginPage() {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.replace("/admin/dashboard");
            } else {
                setChecking(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    const onFinish = async (values: { email: string; password: string }) => {
        try {
            await setPersistence(
                auth,
                browserLocalPersistence
            );

            await signInWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );

            message.success("Welcome Admin");

            router.replace("/admin/dashboard");
        } catch (error) {
            console.log(error);

            message.error("Invalid login credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <Card className="w-full max-w-md shadow-xl rounded-2xl">
                <Title level={2} className="text-center !mb-8">
                    Admin Login
                </Title>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Please enter email",
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            prefix={<MailOutlined />}
                            placeholder="Enter Email"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please enter password",
                            },
                        ]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined />}
                            placeholder="Enter Password"
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                    >
                        Login
                    </Button>
                </Form>
            </Card>
        </div>
    );
}