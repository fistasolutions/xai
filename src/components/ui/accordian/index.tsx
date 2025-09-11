"use client";

import ChevronUp from "@/components/icons/ChevronUp";
import { cn } from "@/utils/cn";
type AccordionpProps = {
  children: React.ReactNode;
  title: string;
  id: string;
  active: boolean;
  onToggle: () => void;
};

export default function Accordion({
  children,
  title,
  id,
  active = false,
  onToggle,
}: AccordionpProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-[30px]",
        "bg-transparent", // Remove default background since parent handles it
      )}
    >
      <h2>
        <button
          className="font-montserrat flex w-full items-center justify-between text-left text-lg font-semibold text-white focus:outline-none sm:text-xl lg:text-2xl"
          onClick={() => {
            onToggle();
          }}
          id={`accordion-title-${id}`}
          aria-expanded={active}
          aria-controls={`accordion-text-${id}`}
        >
          <span className="pr-4">{title}</span>

          <span className={cn("")}>
            <ChevronUp
              className={cn(
                "flex-shrink-0 transform text-white transition-transform duration-300 ease-in-out",
                active ? "rotate-180" : "",
              )}
            />
          </span>
        </button>
      </h2>
      <div
        id={`accordion-text-${id}`}
        role="region"
        aria-labelledby={`accordion-title-${id}`}
        className={cn(
          "font-montserrat grid overflow-hidden text-base leading-relaxed text-white transition-all duration-300 ease-in-out lg:text-xl",
          active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="mt-4 border-t border-white/20 pt-4">
            <p className="w-full">{children}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
