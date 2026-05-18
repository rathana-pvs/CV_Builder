import { Drawer, FormInstance, Typography } from "antd";
import { CheckOutlined, LeftOutlined, RightOutlined, FileTextOutlined, BlockOutlined, PlusOutlined, MinusOutlined, FullscreenOutlined } from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import { ResumeTemplate } from "@/components/resume/ResumeTemplate";
import { TEMPLATES } from "@/components/resume/TemplateRegistry";
import { ResumeData, TemplateId } from "@/lib/resume-types";
import { sampleResumeData } from "@/lib/sample-resume";
import { TemplateThumbnail } from "@/components/resume/TemplateThumbnail";

interface PreviewPanelProps {
  previewData: ResumeData;
  template: TemplateId;
  form: FormInstance;
  syncPreview: () => void;
}

const colorPresets = [
  { name: "Default", hex: "" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Teal", hex: "#0d9488" },
  { name: "Emerald", hex: "#059669" },
  { name: "Indigo", hex: "#4f46e5" },
  { name: "Violet", hex: "#7c3aed" },
  { name: "Rose", hex: "#e11d48" },
  { name: "Amber", hex: "#d97706" },
];

/**
 * Helper to dynamically insert spacers before elements that cross page boundaries (1123px multiples).
 * This prevents sliced text and creates a perfect top margin on subsequent pages.
 * Iterative, single-pass implementation prevents any recursion or stack overflows.
 */
function adjustPageBreaks(container: HTMLElement | null, scale: number = 1) {
  if (!container) return;

  // 1. Remove all existing spacers to start with a clean slate
  const existingSpacers = container.querySelectorAll(".preview-page-spacer");
  existingSpacers.forEach((s) => s.remove());

  const pageHeight = 1123;
  
  // Dynamically calculate the top margin of subsequent pages to match the template's native top padding
  let pageMarginTop = 40; // Default fallback
  const referenceEl = 
    container.querySelector("main") || 
    container.querySelector("header") || 
    container.querySelector("aside") ||
    container.querySelector(".px-16") ||
    container.firstElementChild;

  if (referenceEl) {
    const computedStyle = window.getComputedStyle(referenceEl);
    pageMarginTop = parseFloat(computedStyle.paddingTop) || 40;
  }

  // 2. Query all section headings and containers, extracting target block elements
  const elements: HTMLElement[] = [];

  // Add section headings so they avoid getting sliced across page breaks
  const headings = container.querySelectorAll("section > :first-child");
  headings.forEach((heading) => {
    elements.push(heading as HTMLElement);
  });

  const containers = container.querySelectorAll("section > :nth-child(2)");
  containers.forEach((cnt) => {
    let targetContainer = cnt as HTMLElement;
    
    // Dive into single-child wrappers (like SidebarSection wrapper)
    if (
      cnt.children.length === 1 &&
      (cnt.firstElementChild?.classList.contains("grid") ||
        cnt.firstElementChild?.classList.contains("flex") ||
        cnt.firstElementChild?.tagName === "UL" ||
        cnt.firstElementChild?.tagName === "OL")
    ) {
      targetContainer = cnt.firstElementChild as HTMLElement;
    }

    const isList =
      targetContainer.classList.contains("grid") ||
      targetContainer.classList.contains("flex") ||
      targetContainer.tagName === "UL" ||
      targetContainer.tagName === "OL" ||
      targetContainer.children.length > 1;

    if (isList) {
      // Add individual list/grid/flex entries
      Array.from(targetContainer.children).forEach((child) => {
        elements.push(child as HTMLElement);
      });
    } else {
      // Add the text block or wrapper itself
      elements.push(targetContainer);
    }
  });

  // Add direct children of aside (excluding image and header if they are at the top)
  const asideChildren = container.querySelectorAll("aside > div");
  asideChildren.forEach((child) => {
    const el = child as HTMLElement;
    // Skip if it's the top profile image or header name (which never need to be pushed)
    if (el.classList.contains("mb-5") || el.classList.contains("mb-8") || el.classList.contains("mb-10")) return;
    
    elements.push(el);
  });

  if (elements.length === 0) return;

  const containerRect = container.getBoundingClientRect();

  // 3. Map elements to their original un-shifted positions (unscaling coordinates by active zoom factor)
  const elementsData = elements.map((el) => {
    const rect = el.getBoundingClientRect();
    return {
      el,
      originalTop: (rect.top - containerRect.top) / scale,
      originalHeight: rect.height / scale,
    };
  });

  // Sort elements in visual top-to-bottom order
  elementsData.sort((a, b) => a.originalTop - b.originalTop);

  // 4. Single-pass iterative shift calculation
  let cumulativeShift = 0;

  elementsData.forEach((item) => {
    // Skip if element is taller than a single page's printable area
    if (item.originalHeight > 1043) return;

    const shiftedTop = item.originalTop + cumulativeShift;
    const shiftedBottom = shiftedTop + item.originalHeight;

    const startPage = Math.floor(shiftedTop / pageHeight);
    const endPage = Math.floor(shiftedBottom / pageHeight);

    const currentPageStart = startPage * pageHeight;
    const relativeTop = shiftedTop - currentPageStart;

    let neededSpacer = 0;

    if (startPage !== endPage) {
      // Case 1: Element crosses a page boundary -> Push to next page margin
      const nextPageStart = (startPage + 1) * pageHeight;
      neededSpacer = nextPageStart + pageMarginTop - shiftedTop;
    } else if (startPage > 0 && relativeTop < pageMarginTop) {
      // Case 2: Element naturally lands too close to the top edge of a subsequent page -> Push to page margin
      neededSpacer = currentPageStart + pageMarginTop - shiftedTop;
    }

    // If a spacer is needed to satisfy A4 top margin alignment
    if (neededSpacer > 0) {
      // Determine where to insert the spacer:
      let insertBeforeEl = item.el;
      
      // Rule: If this is the first entry in a section, push the entire section heading to prevent orphans and ensure margins
      const section = item.el.closest("section");
      if (section && item.el !== section.firstElementChild) {
        // Find all targeted entries inside this section (excluding the heading itself)
        const sectionEntries = elements.filter(
          (el) => section.contains(el) && el !== section.firstElementChild
        );
        if (sectionEntries.length > 0 && item.el === sectionEntries[0]) {
          insertBeforeEl = (section.firstElementChild as HTMLElement) || section;

          // Recalculate neededSpacer based on the heading's actual visual position!
          const headingData = elementsData.find((d) => d.el === insertBeforeEl);
          if (headingData) {
            const headingShiftedTop = headingData.originalTop + cumulativeShift;
            const headingStartPage = Math.floor(headingShiftedTop / pageHeight);
            
            // Push heading to start exactly at the top margin of the next page
            const nextPageStart = (headingStartPage + 1) * pageHeight;
            neededSpacer = nextPageStart + pageMarginTop - headingShiftedTop;
          }
        }
      }
      
      // Calculate and collapse the margin-top of the element to prevent double margin at the top of subsequent pages
      let elementMarginTop = 0;
      let parentGap = 0;
      let isGrid = false;

      if (insertBeforeEl) {
        const elStyle = window.getComputedStyle(insertBeforeEl);
        elementMarginTop = parseFloat(elStyle.marginTop) || 0;

        if (insertBeforeEl.parentNode) {
          const parentEl = insertBeforeEl.parentNode as HTMLElement;
          const parentStyle = window.getComputedStyle(parentEl);
          parentGap = parseFloat(parentStyle.rowGap) || 0;
          isGrid = parentStyle.display === "grid" || parentStyle.display === "inline-grid";
        }
      }

      const finalSpacerHeight = Math.max(0, neededSpacer - elementMarginTop - parentGap);

      if (finalSpacerHeight > 0) {
        // Create a clean preview page spacer
        const spacer = document.createElement("div");
        spacer.className = "preview-page-spacer";
        spacer.style.height = `${finalSpacerHeight}px`;
        spacer.style.width = "100%";
        spacer.style.pointerEvents = "none";
        if (isGrid) {
          spacer.style.gridColumn = "1 / -1";
        }
        
        insertBeforeEl.parentNode?.insertBefore(spacer, insertBeforeEl);
      }

      // Accumulate the visual shift for subsequent elements
      cumulativeShift += neededSpacer;
    }
  });
}

export function PreviewPanel({ previewData, template, form, syncPreview }: PreviewPanelProps) {
  const [templateDrawerOpen, setTemplateDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"page" | "stacked">("stacked");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [scale, setScale] = useState(1);
  const [zoomMode, setZoomMode] = useState<"fit" | "manual">("fit");

  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // ResizeObserver to calculate dynamic scale so the A4 template fits the container perfectly
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (zoomMode !== "fit") return;

    const updateScale = () => {
      const parentWidth = container.getBoundingClientRect().width;
      const padding = 64; // Elegant padding around the page
      const availableWidth = Math.max(300, parentWidth - padding);
      const nextScale = Math.min(1, availableWidth / 794);
      setScale(nextScale);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, [zoomMode]);

  const zoomIn = () => {
    setZoomMode("manual");
    setScale((prev) => Math.min(2.0, Math.round((prev + 0.1) * 10) / 10));
  };

  const zoomOut = () => {
    setZoomMode("manual");
    setScale((prev) => Math.max(0.3, Math.round((prev - 0.1) * 10) / 10));
  };

  const handleSliderChange = (val: number) => {
    setZoomMode("manual");
    setScale(val);
  };

  // Recalculate page breaks and height based on previewData and template changes
  useEffect(() => {
    const container = measureRef.current;
    if (!container) return;

    // Reset and apply page-break spacers to the hidden measurement template (unscaled)
    adjustPageBreaks(container, 1);

    const height = container.scrollHeight || container.offsetHeight;
    // A4 page height is exactly 1123px at 794px width
    const pages = Math.max(1, Math.ceil(height / 1123));
    setTotalPages(pages);
  }, [previewData, template]);

  // Adjust page-breaks on the visible pages whenever state changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pages = container.querySelectorAll(".resume-page");
    pages.forEach((page) => {
      adjustPageBreaks(page as HTMLDivElement, scale);
    });
  }, [previewData, template, viewMode, currentPage, totalPages, scale]);

  // Keep active page within computed total pages bounds
  const activePage = Math.min(currentPage, totalPages);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white max-xl:h-auto relative">
      {/* Hidden Measurement Container to compute unconstrained height */}
      <div 
        style={{ 
          position: 'absolute', 
          top: -9999, 
          left: -9999, 
          width: 794, 
          pointerEvents: 'none', 
          visibility: 'hidden' 
        }}
        className="[&_.resume-page]:!h-auto [&_.resume-page]:!min-h-0 [&_.resume-page]:!max-h-none [&_.resume-page]:!w-[794px]"
      >
        <div ref={measureRef} className="w-[794px]">
          <ResumeTemplate data={previewData} template={template} noShadow />
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white px-3 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <Typography.Text className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Preview Style
            </Typography.Text>
            <Typography.Text className="block text-sm font-semibold text-slate-900">
              {TEMPLATES[template].name}
            </Typography.Text>
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-3">
            {/* View Mode Toggle Group */}
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setViewMode("page")}
                className={`flex items-center gap-1 rounded px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                  viewMode === "page"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                title="View page-by-page"
              >
                <FileTextOutlined className="text-[10px]" />
                <span>Page</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("stacked")}
                className={`flex items-center gap-1 rounded px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                  viewMode === "stacked"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                title="View all pages scrolling"
              >
                <BlockOutlined className="text-[10px]" />
                <span>Scroll</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setTemplateDrawerOpen(true)}
              className="flex h-9 min-w-[180px] items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 text-left text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300"
            >
              <span className="truncate">{TEMPLATES[template].name}</span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Change</span>
            </button>

            <div className="flex items-center gap-1.5">
              {colorPresets.map((preset) => {
                const isSelected = (previewData.color || "") === preset.hex;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      form.setFieldsValue({ color: preset.hex });
                      syncPreview();
                    }}
                    className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
                      isSelected
                        ? "border-slate-900 ring-2 ring-slate-200"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                    style={{
                      backgroundColor: preset.hex || "#f8fafc",
                      backgroundImage: !preset.hex
                        ? "conic-gradient(from 180deg at 50% 50%, red, yellow, green, cyan, blue, magenta, red)"
                        : "none",
                    }}
                    title={preset.name}
                  >
                    {isSelected ? <CheckOutlined className="text-[9px] text-white drop-shadow-sm" /> : null}
                  </button>
                );
              })}
              <input
                type="color"
                value={previewData.color || "#2563eb"}
                onChange={(event) => {
                  form.setFieldsValue({ color: event.target.value });
                  syncPreview();
                }}
                className="h-7 w-7 cursor-pointer overflow-hidden rounded-full border border-slate-200 bg-transparent p-0"
                title="Custom color"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Preview container */}
      <div 
        ref={containerRef}
        className="no-scrollbar flex-1 overflow-y-auto px-4 py-8 bg-slate-100 flex flex-col items-center min-h-0 relative select-none"
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      >
        {viewMode === "page" ? (
          /* SINGLE PAGE MODE */
          <div 
            className="relative transition-all duration-300 pb-16 animate-fadeIn"
            style={{ 
              width: `${794 * scale}px`,
              height: `${1123 * scale}px`,
            }}
          >
            <div 
              className="w-[794px] h-[1123px] overflow-hidden bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06),0_10px_20px_-2px_rgba(15,23,42,0.04),0_20px_40px_-4px_rgba(15,23,42,0.06)] border border-slate-200/60 relative"
              style={{ 
                transform: `scale(${scale})`,
                transformOrigin: "top left"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -(activePage - 1) * 1123,
                  left: 0,
                  width: "794px",
                  height: `${totalPages * 1123}px`,
                }}
                className="[&_.resume-page]:!h-full [&_.resume-page]:!min-h-full [&_.resume-page]:!w-[794px]"
              >
                <ResumeTemplate data={previewData} template={template} noShadow />
              </div>
            </div>
          </div>
        ) : (
          /* SCROLL VIEW (STACKED) MODE */
          <div className="flex flex-col gap-12 items-center w-full pb-16">
            {Array.from({ length: totalPages }).map((_, index) => (
              <div 
                key={index}
                className="relative transition-all duration-300"
                style={{ 
                  width: `${794 * scale}px`,
                  height: `${1123 * scale + 24}px`,
                }}
              >
                <div 
                  className="w-[794px] h-[1123px] overflow-hidden bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06),0_10px_20px_-2px_rgba(15,23,42,0.04),0_20px_40px_-4px_rgba(15,23,42,0.06)] border border-slate-200/60 relative"
                  style={{ 
                    transform: `scale(${scale})`,
                    transformOrigin: "top left"
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: -index * 1123,
                      left: 0,
                      width: "794px",
                      height: `${totalPages * 1123}px`,
                    }}
                    className="[&_.resume-page]:!h-full [&_.resume-page]:!min-h-full [&_.resume-page]:!w-[794px]"
                  >
                    <ResumeTemplate data={previewData} template={template} noShadow />
                  </div>
                </div>
                
                {/* Visual Page tag */}
                <div 
                  className="text-center text-xs font-semibold text-slate-400 mt-2 select-none"
                  style={{ transform: `scale(${Math.max(0.85, scale)})`, transformOrigin: "top center" }}
                >
                  Page {index + 1} of {totalPages}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Canva-Style Zoom Controls Capsule */}
      <div className="absolute bottom-6 right-6 z-20">
        <div className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/95 px-3.5 py-2 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all hover:shadow-[0_12px_36px_-4px_rgba(15,23,42,0.12)]">
          <button
            type="button"
            onClick={zoomOut}
            disabled={scale <= 0.3}
            className="flex h-6 w-6 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
            title="Zoom Out"
          >
            <MinusOutlined className="text-xs" />
          </button>
          
          <input
            type="range"
            min="0.3"
            max="2.0"
            step="0.05"
            value={scale}
            onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
            className="w-20 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
            title="Zoom slider"
          />
          
          <button
            type="button"
            onClick={zoomIn}
            disabled={scale >= 2.0}
            className="flex h-6 w-6 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
            title="Zoom In"
          >
            <PlusOutlined className="text-xs" />
          </button>
          
          <span className="text-xs font-bold text-slate-600 select-none min-w-[36px] text-center font-mono">
            {Math.round(scale * 100)}%
          </span>

          <div className="w-px h-4 bg-slate-200" />
          
          <button
            type="button"
            onClick={() => setZoomMode("fit")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
              zoomMode === "fit"
                ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm"
                : "text-slate-500 hover:text-slate-800 bg-slate-50 border border-slate-100 hover:border-slate-200"
            }`}
            title="Fit to screen"
          >
            <FullscreenOutlined className="text-xs" />
            <span>Fit</span>
          </button>
        </div>
      </div>

      {/* Floating page controls indicator (from the user's screenshot capsule mockup) */}
      {totalPages > 1 && viewMode === "page" && (
        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
          <div className="flex items-center gap-4 rounded-full bg-slate-900/90 px-4 py-2.5 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-slate-900 border border-slate-800">
            <button
              type="button"
              disabled={activePage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex h-6 w-6 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/60 cursor-pointer"
              title="Previous Page"
            >
              <LeftOutlined className="text-xs" />
            </button>
            
            <span className="text-xs font-semibold select-none min-w-[36px] text-center tracking-wider font-mono">
              {activePage} / {totalPages}
            </span>
            
            <button
              type="button"
              disabled={activePage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-6 w-6 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/60 cursor-pointer"
              title="Next Page"
            >
              <RightOutlined className="text-xs" />
            </button>
          </div>
        </div>
      )}

      <Drawer
        title={
          <div>
            <Typography.Text className="block text-base font-bold text-slate-900">
              Choose Template
            </Typography.Text>
            <Typography.Text className="text-xs text-slate-500">
              Browse document styles with full preview thumbnails.
            </Typography.Text>
          </div>
        }
        placement="right"
        width="min(920px, 94vw)"
        open={templateDrawerOpen}
        onClose={() => setTemplateDrawerOpen(false)}
        className="[&_.ant-drawer-body]:!bg-slate-50 [&_.ant-drawer-body]:!p-3 [&_.ant-drawer-body]:![scrollbar-width:none] [&_.ant-drawer-body::-webkit-scrollbar]:!hidden"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Object.values(TEMPLATES).map((tmpl) => {
            const isSelected = template === tmpl.id;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => {
                  form.setFieldsValue({ template: tmpl.id });
                  syncPreview();
                  setTemplateDrawerOpen(false);
                }}
                className={`group overflow-hidden rounded-xl border bg-white text-left transition-all ${
                  isSelected
                    ? "border-blue-500 shadow-[0_0_0_3px_rgba(37,99,235,0.12),0_18px_36px_rgba(15,23,42,0.10)]"
                    : "border-slate-200 shadow-sm shadow-slate-200/40 hover:border-blue-300 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
                }`}
              >
                <div className="relative h-[280px] overflow-hidden bg-white sm:h-[320px]">
                  <TemplateThumbnail
                    data={{ ...sampleResumeData, color: previewData.color }}
                    template={tmpl.id}
                  />
                  {tmpl.tag && (
                    <span className="absolute right-3 top-3 rounded-md border border-slate-100 bg-white/90 px-2 py-1 text-[9px] font-bold tracking-wider text-slate-500 backdrop-blur-sm">
                      {tmpl.tag}
                    </span>
                  )}
                  {isSelected ? (
                    <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/20">
                      <CheckOutlined className="text-xs" />
                    </span>
                  ) : null}
                </div>
                <div
                  className={`flex items-center justify-between gap-2 border-t px-3 py-2 transition-colors ${
                    isSelected
                      ? "border-blue-100 bg-blue-50/60"
                      : "border-slate-100 bg-white group-hover:bg-slate-50"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <Typography.Text className="block truncate text-[13px] font-bold text-slate-900">
                      {tmpl.name}
                    </Typography.Text>
                    {tmpl.description && (
                      <Typography.Text className="mt-1 block text-[11px] leading-relaxed text-slate-500 line-clamp-2">
                        {tmpl.description}
                      </Typography.Text>
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-semibold uppercase tracking-[0.14em] ${
                      isSelected ? "text-blue-700" : "text-slate-400 group-hover:text-blue-700"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Drawer>
    </div>
  );
}
