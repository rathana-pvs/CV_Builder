import React from "react";
import { Typography } from "antd";
import { DndContext, closestCenter, SensorDescriptor, SensorOptions, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableLayoutItem } from "./SortableFields";

interface LayoutTabProps {
  sectionSensors: SensorDescriptor<SensorOptions>[];
  handleSectionDragEnd: (event: DragEndEvent) => void;
  sectionsOrder: string[];
  sectionConfigs: Record<string, { title: string; icon: React.ReactNode }>;
}

export function LayoutTab({
  sectionSensors,
  handleSectionDragEnd,
  sectionsOrder,
  sectionConfigs,
}: LayoutTabProps) {
  return (
    <div className="animate-in fade-in w-full duration-300">
      <div className="mb-5 rounded-xl border border-slate-200 bg-white p-5">
        <Typography.Text className="mb-1 block text-sm font-semibold text-slate-900">Section Order</Typography.Text>
        <Typography.Text className="text-xs text-slate-500">
          Drag sections to control how the document reads from top to bottom.
        </Typography.Text>
      </div>
      <DndContext
        id="layout-tab-dnd-context"
        sensors={sectionSensors}
        collisionDetection={closestCenter}
        onDragEnd={handleSectionDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={sectionsOrder} strategy={verticalListSortingStrategy}>
          {sectionsOrder.map((key) => {
            const config = sectionConfigs[key];
            if (!config) return null;
            return (
              <SortableLayoutItem
                key={key}
                id={key}
                title={config.title}
                icon={config.icon}
              />
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
}
