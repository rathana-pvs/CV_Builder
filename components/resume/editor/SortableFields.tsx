import React, { useState } from "react";
import { Button, Card, Col, Form, Input, Row, Select, Typography, AutoComplete, DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
import { 
  DeleteOutlined, 
  DownOutlined, 
  HolderOutlined, 
  CaretUpOutlined, 
  CaretDownOutlined, 
  PlusOutlined 
} from "@ant-design/icons";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

interface SortableFieldItemProps {
  id: string;
  name: string;
  item: any;
  index: number;
  title: string;
  subtitle: string;
  fields: string[];
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
}

export function SortableFieldItem({
  id,
  name,
  item,
  index,
  title,
  subtitle,
  fields,
  isExpanded,
  onToggle,
  onRemove,
}: SortableFieldItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
    position: "relative" as const,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-3 group/row">
      <div
        {...attributes}
        {...listeners}
        className="mt-5 opacity-30 group-hover/row:opacity-80 transition-opacity cursor-grab active:cursor-grabbing text-slate-500 flex-shrink-0"
      >
        <HolderOutlined className="text-[17px]" />
      </div>

      <div
        className={`flex-1 bg-white border rounded-xl transition-all duration-200 ${
          isExpanded 
            ? "border-blue-200 shadow-md ring-4 ring-blue-50/10" 
            : "border-slate-200 hover:border-slate-300 shadow-sm"
        }`}
      >
        <div 
          className="flex items-center justify-between px-5 py-4 cursor-pointer select-none"
          onClick={onToggle}
        >
          <div className="flex-1 overflow-hidden pr-4">
            <Typography.Text className="font-extrabold text-[13.5px] text-slate-900 block truncate leading-snug">
              {title || `New Entry`}
            </Typography.Text>
            {subtitle && (
              <Typography.Text className="text-[11px] text-slate-500 mt-0.5 block truncate font-medium">
                {subtitle}
              </Typography.Text>
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {isExpanded && (
               <Button
                 type="text"
                 danger
                 size="small"
                 icon={<DeleteOutlined />}
                 onClick={(e) => {
                   e.stopPropagation();
                   onRemove();
                 }}
                 className="hover:bg-red-50 text-sm flex items-center justify-center rounded-full w-8 h-8"
               />
            )}
            <DownOutlined 
              className={`text-slate-400 text-[11px] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} 
            />
          </div>
        </div>

        {isExpanded && (
          <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/10 rounded-b-xl">
            <Row gutter={[12, 12]}>
              {fields.map((field) => (
                <Col span={field === "description" ? 24 : 12} key={field}>
                  {(() => {
                    const isDateField = field.toLowerCase().includes("date");
                    
                    return (
                      <Form.Item
                        name={[item.name, field]}
                        label={<span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{field}</span>}
                        className="mb-0"
                        {...(isDateField ? {
                          getValueProps: (value: any) => {
                            if (!value) return { value: undefined };
                            const parsed = dayjs(value, ["MMM YYYY", "YYYY-MM", "YYYY-MM-DD"]);
                            return { value: parsed.isValid() ? parsed : undefined };
                          },
                          getValueFromEvent: (val: any) => val ? val.format("MMM YYYY") : "",
                        } : {})}
                      >
                        {field === "description" ? (
                          <Input.TextArea
                            rows={3}
                            placeholder={`Describe your details...`}
                            className="rounded-lg"
                          />
                        ) : field === "degree" && name === "education" ? (
                          <AutoComplete
                            placeholder="Enter degree..."
                            className="w-full rounded-lg"
                            popupClassName="rounded-xl"
                            options={[
                              { value: "Bachelor of Science" },
                              { value: "Bachelor of Arts" },
                              { value: "Master of Science" },
                              { value: "Master of Arts" },
                              { value: "Master of Business Administration (MBA)" },
                              { value: "Doctor of Philosophy (Ph.D.)" },
                              { value: "Associate of Science" },
                              { value: "Associate of Arts" },
                              { value: "High School Diploma" },
                            ]}
                            filterOption={(inputValue, option) =>
                              option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                          />
                        ) : isDateField ? (
                          <DatePicker
                            picker="month"
                            format="MMM YYYY"
                            placeholder={`Select ${field}...`}
                            className="w-full rounded-lg"
                          />
                        ) : (
                          <Input placeholder={`Enter ${field}...`} className="rounded-lg" />
                        )}
                      </Form.Item>
                    );
                  })()}
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </div>
  );
}

interface SortableSectionCardProps {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export function SortableSectionCard({
  id,
  title,
  description,
  icon,
  children,
  isOpen,
  onToggle
}: SortableSectionCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 40 : 1,
    position: "relative" as const,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-3 group/section mb-1">
      <div
        {...attributes}
        {...listeners}
        className="mt-4 opacity-20 group-hover/section:opacity-80 transition-opacity cursor-grab active:cursor-grabbing text-slate-400 flex-shrink-0"
      >
        <HolderOutlined className="text-[20px]" />
      </div>

      <Card
        className={`flex-1 border transition-all duration-300 rounded-2xl overflow-hidden ${
          isOpen
            ? "shadow-md border-blue-200 ring-4 ring-blue-50/20"
            : "shadow-sm border-slate-100 hover:border-slate-300 bg-white"
        }`}
        styles={{ body: { padding: 0 } }}
      >
        <div
          onClick={onToggle}
          className="flex items-start justify-between px-6 py-4 cursor-pointer select-none bg-white"
        >
          <div className="flex flex-col gap-1 pr-4 flex-1">
             <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-colors ${
                  isOpen ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {icon}
                </div>
                <Typography.Text className="font-extrabold text-slate-900 text-[16px] tracking-tight">
                  {title}
                </Typography.Text>
             </div>
             {description && (
               <Typography.Text className="text-[12px] text-slate-500 mt-1 leading-relaxed ml-11">
                 {description}
               </Typography.Text>
             )}
          </div>
          <div className="pt-1 flex items-center gap-2">
             <CaretDownOutlined 
               className={`text-slate-400 text-xs transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
             />
          </div>
        </div>

        {isOpen && (
          <div className="px-6 pb-6 pt-2 border-t border-slate-50 bg-white animate-in fade-in slide-in-from-top-1 duration-200">
            {children}
          </div>
        )}
      </Card>
    </div>
  );
}

export interface SortableLayoutItemProps {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export function SortableLayoutItem({ id, title, icon }: SortableLayoutItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
    position: "relative" as const,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 p-4 mb-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-300 group transition-all">
      <div {...attributes} {...listeners} className="opacity-40 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-slate-400 transition-opacity">
        <HolderOutlined className="text-lg" />
      </div>
      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
        {icon}
      </div>
      <div className="flex-1">
        <Typography.Text className="font-bold text-[15px] text-slate-800">{title}</Typography.Text>
      </div>
      <div className="text-slate-300 flex flex-col items-center">
        <CaretUpOutlined className="text-[10px]" />
        <CaretDownOutlined className="text-[10px] -mt-0.5" />
      </div>
    </div>
  );
}

export function FieldList({
  name,
  fields,
  icon,
  placeholderAdd,
  form,
}: {
  name: string;
  fields: string[];
  icon?: React.ReactNode;
  placeholderAdd?: string;
  form: any;
}) {
  const [expandedKey, setExpandedKey] = useState<number | string | null>(null);
  const liveData = Form.useWatch(name, form) || [];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <Form.List name={name}>
      {(items, actions) => {
        const handleDragEnd = (event: DragEndEvent) => {
          const { active, over } = event;
          if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((it) => it.key === active.id);
            const newIndex = items.findIndex((it) => it.key === over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
              actions.move(oldIndex, newIndex);
            }
          }
        };

        return (
          <div className="flex flex-col gap-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext items={items.map((item) => item.key)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-3">
                  {items.map((item, idx) => {
                    const data = liveData[idx] || {};
                    let title = `Entry #${idx + 1}`;
                    let subtitle = "";

                    if (name === "experience") {
                      title = data.role ? `${data.role}${data.company ? ` at ${data.company}` : ""}` : "Position Details";
                      subtitle = [data.startDate, data.endDate].filter(Boolean).join(" – ");
                    } else if (name === "education") {
                      title = data.degree ? `${data.degree}${data.school ? ` at ${data.school}` : ""}` : "Educational Course";
                      subtitle = [data.startDate, data.endDate].filter(Boolean).join(" – ");
                    } else if (name === "projects") {
                      title = data.name || "Project Name";
                      subtitle = data.link || "";
                    } else if (name === "certifications") {
                      title = data.name || "Certification Name";
                      subtitle = [data.issuer, data.date].filter(Boolean).join(" – ");
                    }

                    return (
                      <SortableFieldItem
                        key={item.key}
                        id={item.key as unknown as string}
                        name={name}
                        item={item}
                        index={idx}
                        title={title}
                        subtitle={subtitle}
                        fields={fields}
                        isExpanded={expandedKey === item.key}
                        onToggle={() => setExpandedKey(expandedKey === item.key ? null : item.key)}
                        onRemove={() => actions.remove(item.name)}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>

            <div className="pl-8 mt-1">
              <Button
                type="text"
                icon={icon || <PlusOutlined />}
                onClick={() => {
                  actions.add();
                }}
                className="font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 flex items-center gap-1 rounded-lg transition-all px-2"
              >
                {placeholderAdd || `Add ${name}`}
              </Button>
            </div>
          </div>
        );
      }}
    </Form.List>
  );
}

export function SkillsFieldList() {
  return (
    <Form.List name="skills">
      {(items, actions) => (
        <div className="grid gap-3">
          <Typography.Text className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
            Skills with Levels
          </Typography.Text>
          {items.map((item) => (
            <div
              key={item.key}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50/10 hover:border-slate-200 transition-all"
            >
              <Row gutter={12} align="middle">
                <Col span={12}>
                  <Form.Item
                    name={[item.name, "name"]}
                    noStyle
                    rules={[{ required: true, message: "Skill required" }]}
                  >
                    <Input placeholder="Skill (e.g. React, Python)" className="rounded-lg" />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item name={[item.name, "level"]} noStyle>
                    <Select
                      placeholder="Level (Optional)"
                      allowClear
                      className="rounded-lg w-full"
                      options={[
                        { label: "Expert", value: "Expert" },
                        { label: "Advanced", value: "Advanced" },
                        { label: "Intermediate", value: "Intermediate" },
                        { label: "Beginner", value: "Beginner" },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={2} className="text-right">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => actions.remove(item.name)}
                    className="hover:bg-red-50 flex items-center justify-center rounded-full w-8 h-8"
                  />
                </Col>
              </Row>
            </div>
          ))}
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => actions.add({})}
            className="h-10 border-blue-200 text-blue-600 hover:text-blue-700 hover:border-blue-300 rounded-xl font-bold text-xs"
          >
            Add Skill
          </Button>
        </div>
      )}
    </Form.List>
  );
}

export function LanguagesFieldList() {
  return (
    <Form.List name="languages">
      {(items, actions) => (
        <div className="grid gap-3">
          <Typography.Text className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
            Languages with Levels
          </Typography.Text>
          {items.map((item) => (
            <div
              key={item.key}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50/10 hover:border-slate-200 transition-all"
            >
              <Row gutter={12} align="middle">
                <Col span={12}>
                  <Form.Item
                    name={[item.name, "name"]}
                    noStyle
                    rules={[{ required: true, message: "Language required" }]}
                  >
                    <Input placeholder="Language (e.g. English, French)" className="rounded-lg" />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item name={[item.name, "level"]} noStyle>
                    <Select
                      placeholder="Level (Optional)"
                      allowClear
                      className="rounded-lg w-full"
                      options={[
                        { label: "Native", value: "Native" },
                        { label: "Expert", value: "Expert" },
                        { label: "Advanced", value: "Advanced" },
                        { label: "Intermediate", value: "Intermediate" },
                        { label: "Beginner", value: "Beginner" },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={2} className="text-right">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => actions.remove(item.name)}
                    className="hover:bg-red-50 flex items-center justify-center rounded-full w-8 h-8"
                  />
                </Col>
              </Row>
            </div>
          ))}
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => actions.add({})}
            className="h-10 border-blue-200 text-blue-600 hover:text-blue-700 hover:border-blue-300 rounded-xl font-bold text-xs"
          >
            Add Language
          </Button>
        </div>
      )}
    </Form.List>
  );
}
