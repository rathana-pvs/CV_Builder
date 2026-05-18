"use client";

import { useEffect, useRef, useState } from "react";
import { ResumeTemplate } from "./ResumeTemplate";
import { ResumeData, TemplateId } from "@/lib/resume-types";

interface TemplateThumbnailProps {
  data: ResumeData;
  template: TemplateId;
}

export function TemplateThumbnail({ data, template }: TemplateThumbnailProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateScale = () => {
      const { width, height } = frame.getBoundingClientRect();
      const contentWidth = 794;
      const contentHeight = 1123;
      // Use Max to ensure the box is FULLY filled (cover behavior)
      setScale(Math.max(width / contentWidth, height / contentHeight));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [data, template]);

  return (
    <div ref={frameRef} className="relative h-full w-full overflow-hidden bg-white">
      <div
        ref={contentRef}
        className="pointer-events-none absolute left-1/2 top-0 h-[1123px] w-[794px] origin-top"
        style={{ transform: `translateX(-50%) scale(${scale})` }}
      >
        <ResumeTemplate data={data} template={template} noShadow />
      </div>
    </div>
  );
}
