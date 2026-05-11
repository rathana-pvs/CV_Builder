import React from "react";
import { DndContext, closestCenter, SensorDescriptor, SensorOptions, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableSectionCard } from "./SortableFields";

interface TextTabProps {
  sectionSensors: SensorDescriptor<SensorOptions>[];
  handleSectionDragEnd: (event: DragEndEvent) => void;
  sectionsOrder: string[];
  sectionConfigs: Record<string, { title: string; description?: string; icon: React.ReactNode; content: React.ReactNode }>;
  activeSections: string[];
  toggleSection: (key: string) => void;
}

export function TextTab({
  sectionSensors,
  handleSectionDragEnd,
  sectionsOrder,
  sectionConfigs,
  activeSections,
  toggleSection,
}: TextTabProps) {
  return (
    <div className="animate-in fade-in duration-300 flex flex-col gap-4">
      {/* Dynamic Accordion Stack */}
      <DndContext
        id="text-tab-dnd-context"
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
              <SortableSectionCard
                key={key}
                id={key}
                title={config.title}
                description={config.description}
                icon={config.icon}
                isOpen={activeSections.includes(key)}
                onToggle={() => toggleSection(key)}
              >
                {config.content}
              </SortableSectionCard>
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
}
