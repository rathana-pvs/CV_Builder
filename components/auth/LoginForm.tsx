"use client";

import { Button, Form, Input, Tabs, Typography, message } from "antd";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MailOutlined, LockOutlined, UserOutlined, LoginOutlined, UserAddOutlined } from "@ant-design/icons";

type AuthValues = {
  name?: string;
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function login(values: AuthValues) {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        message.error("Invalid email or password combination.");
        return;
      }

      message.success("Successfully signed in.");
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function register(values: AuthValues) {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        message.error("Registration failed. This email may already be used.");
        return;
      }

      message.success("Account created! Logging you in...");
      await login(values);
    } catch (err) {
      message.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <Typography.Title level={2} className="!mb-1 !font-black tracking-tight text-slate-900">
          Welcome back
        </Typography.Title>
        <Typography.Paragraph className="text-slate-500 font-medium text-sm">
          Please log in or register to manage your dynamic resumes.
        </Typography.Paragraph>
      </div>

      <Tabs
        defaultActiveKey="login"
        animated={{ inkBar: true, tabPane: true }}
        className="modern-auth-tabs"
        items={[
          {
            key: "login",
            label: (
              <span className="flex items-center gap-2 font-bold px-2 py-1">
                <LoginOutlined /> Login
              </span>
            ),
            children: (
              <div className="pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Form layout="vertical" onFinish={login} disabled={loading} requiredMark={false}>
                  <Form.Item 
                    name="email" 
                    label={<span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Email Address</span>} 
                    rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
                  >
                    <Input 
                      prefix={<MailOutlined className="text-slate-400 mr-1" />} 
                      placeholder="name@company.com"
                      className="h-12 rounded-xl border-slate-200 font-medium focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1)]"
                    />
                  </Form.Item>
                  <Form.Item 
                    name="password" 
                    label={<span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Password</span>} 
                    rules={[{ required: true, message: "Password is required" }]}
                    className="mb-6"
                  >
                    <Input.Password 
                      prefix={<LockOutlined className="text-slate-400 mr-1" />} 
                      placeholder="••••••••"
                      className="h-12 rounded-xl border-slate-200 font-medium"
                    />
                  </Form.Item>
                  <Button 
                    htmlType="submit" 
                    type="primary" 
                    block 
                    loading={loading}
                    className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-[15px] shadow-lg shadow-blue-600/20 border-none"
                  >
                    Sign In
                  </Button>
                </Form>
              </div>
            ),
          },
          {
            key: "register",
            label: (
              <span className="flex items-center gap-2 font-bold px-2 py-1">
                <UserAddOutlined /> Register
              </span>
            ),
            children: (
              <div className="pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Form layout="vertical" onFinish={register} disabled={loading} requiredMark={false}>
                  <Form.Item 
                    name="name" 
                    label={<span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Full Name</span>} 
                    rules={[{ required: true, message: "Please enter your name" }]}
                  >
                    <Input 
                      prefix={<UserOutlined className="text-slate-400 mr-1" />} 
                      placeholder="Jane Doe"
                      className="h-12 rounded-xl border-slate-200 font-medium"
                    />
                  </Form.Item>
                  <Form.Item 
                    name="email" 
                    label={<span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Email Address</span>} 
                    rules={[{ required: true, type: "email", message: "Enter valid email" }]}
                  >
                    <Input 
                      prefix={<MailOutlined className="text-slate-400 mr-1" />} 
                      placeholder="name@company.com"
                      className="h-12 rounded-xl border-slate-200 font-medium"
                    />
                  </Form.Item>
                  <Form.Item 
                    name="password" 
                    label={<span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Create Password</span>} 
                    rules={[{ required: true, min: 8, message: "At least 8 characters required" }]}
                    className="mb-6"
                  >
                    <Input.Password 
                      prefix={<LockOutlined className="text-slate-400 mr-1" />} 
                      placeholder="••••••••"
                      className="h-12 rounded-xl border-slate-200 font-medium"
                    />
                  </Form.Item>
                  <Button 
                    htmlType="submit" 
                    type="primary" 
                    block 
                    loading={loading}
                    className="h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-[15px] shadow-lg shadow-indigo-600/20 border-none"
                  >
                    Create Account
                  </Button>
                </Form>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
