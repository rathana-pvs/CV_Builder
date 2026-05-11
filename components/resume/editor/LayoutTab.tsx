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
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100/50">
        <Typography.Text className="font-extrabold text-blue-900 block mb-1">Organize Layout</Typography.Text>
        <Typography.Text className="text-xs text-blue-700/80">Reorder elements visually. Drag each card from the left handle to rearrange your CV order.</Typography.Text>
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
