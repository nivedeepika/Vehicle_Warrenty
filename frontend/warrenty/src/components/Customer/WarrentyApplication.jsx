import React, { useEffect, useState } from "react";
import {
  Card,
  Steps,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  message,
} from "antd";
import {
  CarOutlined,
  UserOutlined,
  FileTextOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import "./Warranty.css";

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const WarrantyApplicationForm = ({ onSuccess }) => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      title: "Vehicle & Dealer",
      icon: <CarOutlined />,
    },
    {
      title: "Personal Info",
      icon: <UserOutlined />,
    },
    {
      title: "Purchase Details",
      icon: <FileTextOutlined />,
    },
    {
      title: "Issue Description",
      icon: <AlertOutlined />,
    },
  ];

  const next = async () => {
    try {
      await form.validateFields();
      setCurrent(current + 1);
    } catch (err) {}
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      console.log("Form Data:", values);

      setTimeout(() => {
        message.success("Warranty Request Submitted Successfully!");
        setLoading(false);
        onSuccess();
      }, 1000);
    } catch (error) {}
  };

  return (
    <div className="warranty-container">
      <Card className="warranty-card">
        <h2 className="form-title">Apply for Warranty</h2>

        <Steps current={current} className="steps">
          {steps.map((item, index) => (
            <Step key={index} title={item.title} icon={item.icon} />
          ))}
        </Steps>

        <Form
          form={form}
          layout="vertical"
          className="form-section"
        >
          {/* STEP 1 */}
          {current === 0 && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Select Vehicle"
                  name="vehicle"
                  rules={[{ required: true, message: "Select vehicle" }]}
                >
                  <Select placeholder="Choose vehicle">
                    <Option value="car1">Honda City</Option>
                    <Option value="car2">Hyundai i20</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Select Dealer"
                  name="dealer"
                  rules={[{ required: true, message: "Select dealer" }]}
                >
                  <Select placeholder="Choose dealer">
                    <Option value="dealer1">ABC Motors</Option>
                    <Option value="dealer2">XYZ Autos</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* STEP 2 */}
          {current === 1 && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Full Name"
                  name="fullName"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Age" name="age">
                  <Input type="number" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Gender" name="gender">
                  <Select>
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, type: "email" }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Mobile"
                  name="mobile"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Address" name="address">
                  <TextArea rows={3} />
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* STEP 3 */}
          {current === 2 && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Invoice Number"
                  name="invoiceNumber"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Invoice Date"
                  name="invoiceDate"
                  rules={[{ required: true }]}
                >
                  <Input type="date" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Purchase Amount" name="amount">
                  <Input type="number" placeholder="0.00" />
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* STEP 4 */}
          {current === 3 && (
            <>
              <Form.Item
                label="Describe the Issue"
                name="issue"
                rules={[{ required: true }]}
              >
                <TextArea rows={5} />
              </Form.Item>
            </>
          )}

          <div className="button-group">
            {current > 0 && (
              <Button onClick={prev}>Previous</Button>
            )}

            {current < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                Next
              </Button>
            )}

            {current === steps.length - 1 && (
              <Button
                type="primary"
                loading={loading}
                onClick={handleSubmit}
              >
                Submit Request
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default WarrantyApplicationForm;