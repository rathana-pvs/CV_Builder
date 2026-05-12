import React from "react";
import { SortableSectionCard } from "./SortableFields";

interface TextTabProps {
  sectionsOrder: string[];
  sectionConfigs: Record<string, { title: string; description?: string; icon: React.ReactNode; content: React.ReactNode }>;
  activeSections: string[];
  toggleSection: (key: string) => void;
}

export function TextTab({
  sectionsOrder,
  sectionConfigs,
  activeSections,
  toggleSection,
}: TextTabProps) {
  return (
    <div className="animate-in fade-in flex w-full flex-col gap-4 duration-300">
      <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
        <p className="m-0 text-sm font-semibold text-slate-900">Content</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Edit each section in place. Use the Layout tab to change document order.
        </p>
      </div>
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
            sortable={false}
          >
            {config.content}
          </SortableSectionCard>
        );
      })}
    </div>
  );
}
