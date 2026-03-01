import React from "react";
import { Input, Select, Radio } from "antd";
import "./StepIssueDetails.css";

const { TextArea } = Input;
const { Option } = Select;

const StepIssueDetails = ({ issue, onIssueChange }) => {
  return (
    <div className="wc-issue-container">

      {/* Problem Info */}
      <div className="wc-issue-card">
        <h3 className="wc-issue-title">Problem Information</h3>
        <p className="wc-issue-subtitle">
          Describe the warranty issue in detail
        </p>

        <div className="wc-issue-group wc-issue-two-col">

          {/* Category */}
          <div className="wc-issue-field">
            <label>Issue Category</label>
            <Select
              value={issue.category}
              onChange={(v) => onIssueChange({ category: v })}
              placeholder="Select category"
            >
              <Option value="engine">Engine</Option>
              <Option value="electrical">Electrical</Option>
              <Option value="brake">Brake</Option>
              <Option value="transmission">Transmission</Option>
              <Option value="other">Other</Option>
            </Select>
          </div>

          {/* Title */}
          <div className="wc-issue-field">
            <label>Issue Title</label>
            <Input
              value={issue.title}
              onChange={(e) =>
                onIssueChange({ title: e.target.value })
              }
              placeholder="Brief issue title"
            />
          </div>

          {/* Description */}
          <div className="wc-issue-field wc-issue-full">
            <label>Detailed Description</label>
            <TextArea
              rows={4}
              value={issue.description}
              onChange={(e) =>
                onIssueChange({ description: e.target.value })
              }
              placeholder="Explain the problem in detail..."
            />
          </div>

          {/* Date */}
          <div className="wc-issue-field">
            <label>Issue Start Date</label>
            <Input
              type="date"
              value={issue.issueStartDate}
              onChange={(e) =>
                onIssueChange({
                  issueStartDate: e.target.value,
                })
              }
            />
          </div>

          {/* Odometer */}
          <div className="wc-issue-field">
            <label>Odometer Reading (km)</label>
            <Input
              type="number"
              value={issue.odometerReading}
              onChange={(e) =>
                onIssueChange({
                  odometerReading: Number(e.target.value), // ✅ FIXED
                })
              }
              placeholder="e.g. 25000"
            />
          </div>

        </div>
      </div>

      {/* Warranty */}
      <div className="wc-issue-card">
        <h3 className="wc-issue-title">
          Warranty Confirmation
        </h3>
        <p className="wc-issue-subtitle">
          Confirm warranty & service status
        </p>

        <div className="wc-issue-group">

          {/* Warranty */}
          <div className="wc-issue-field">
            <label>Is vehicle under warranty?</label>
            <Radio.Group
              value={issue.underWarranty}
              onChange={(e) =>
                onIssueChange({
                  underWarranty: e.target.value, // already boolean
                })
              }
              className="wc-issue-radio"
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </div>

          {/* Service */}
          <div className="wc-issue-field">
            <label>Any previous service done?</label>
            <Radio.Group
              value={issue.previousService}
              onChange={(e) => {
                const isYes = e.target.value;

                onIssueChange({
                  previousService: isYes,
                  previousServiceCount: isYes ? issue.previousServiceCount : 0,
                });
              }}
              className="wc-issue-radio"
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </div>

          {/* Conditional */}
          {issue.previousService === true && (
            <div className="wc-issue-field wc-issue-animate">
              <label>How Many Times?</label>
              <Input
                type="number"
                value={issue.previousServiceCount}
                onChange={(e) =>
                  onIssueChange({
                    previousServiceCount: Number(e.target.value), // ✅ FIXED
                  })
                }
                placeholder="e.g. 3"
              />
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default StepIssueDetails;