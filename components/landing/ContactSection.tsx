import { 
  MailOutlined, 
  EnvironmentOutlined, 
  MessageOutlined,
  ArrowRightOutlined,
  FacebookOutlined
} from "@ant-design/icons";
import { Button, Input, Form, message } from "antd";

export function ContactSection() {
  const onFinish = () => {
    message.success("Message sent! We'll get back to you soon.");
  };

  return (
    <section id="contact" className="bg-slate-50 py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
              <MessageOutlined />
              Get in touch
            </div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Have questions? <br />
              <span className="text-slate-500">We're here to help.</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Whether you need help with a template, have a feature request, or just want to say hi, 
              we'd love to hear from you.
            </p>

            <div className="mt-12 space-y-8">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                  <MailOutlined className="text-xl text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Email Us</h3>
                  <p className="text-slate-600">support@resumedot.site</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                  <EnvironmentOutlined className="text-xl text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Our Location</h3>
                  <p className="text-slate-600">Remote First &bull; Global Support</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                  <FacebookOutlined className="text-xl text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Facebook</h3>
                  <a 
                    href="https://web.facebook.com/profile.php?id=61589819906598" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    ResumeDot Official
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl lg:p-12">
            <Form 
              layout="vertical" 
              onFinish={onFinish}
              requiredMark={false}
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Form.Item 
                  label={<span className="font-bold text-slate-700">First Name</span>}
                  name="firstName"
                  rules={[{ required: true, message: 'Please enter your first name' }]}
                >
                  <Input placeholder="John" className="h-12 rounded-xl" />
                </Form.Item>
                <Form.Item 
                  label={<span className="font-bold text-slate-700">Last Name</span>}
                  name="lastName"
                >
                  <Input placeholder="Doe" className="h-12 rounded-xl" />
                </Form.Item>
              </div>
              <Form.Item 
                label={<span className="font-bold text-slate-700">Email Address</span>}
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="john@example.com" className="h-12 rounded-xl" />
              </Form.Item>
              <Form.Item 
                label={<span className="font-bold text-slate-700">Message</span>}
                name="message"
                rules={[{ required: true, message: 'Please enter your message' }]}
              >
                <Input.TextArea rows={4} placeholder="How can we help you?" className="rounded-xl" />
              </Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                block 
                icon={<ArrowRightOutlined />}
                iconPosition="end"
                className="h-14 rounded-xl bg-slate-950 font-bold hover:!bg-slate-800"
              >
                Send Message
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
