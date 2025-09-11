"use client";

import React, { useState } from "react";
import Accordion from "../ui/accordian";
import BarIcon from "@/components/icons/Bar";
import { FaArrowRight } from "react-icons/fa";
function Faqs() {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(
    "faq-1",
  );

  const faqData = [
    {
      id: "faq-1",
      question: "What is 2themoon.ai?",
      answer:
        "2themoon.AI offers a suite of vertical, agentic AI agents tailored for small businesses. These agents are designed to automate and optimize various business processes, helping you scale efficiently while maintaining quality service.",
    },
    {
      id: "faq-2",
      question: "How do the AI agents work?",
      answer:
        "Our AI agents use advanced machine learning algorithms to understand your business context and automate tasks. They can handle customer inquiries, process orders, manage schedules, and much more with minimal human intervention.",
    },
    {
      id: "faq-3",
      question: "Can I try the service before committing?",
      answer:
        "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start, and you can cancel anytime during the trial period.",
    },
    {
      id: "faq-4",
      question: "How secure is my data with 2themoon.AI?",
      answer:
        "We take data security seriously. All data is encrypted in transit and at rest, and we comply with industry-standard security protocols. Your business data is never shared with third parties without your explicit consent.",
    },
    {
      id: "faq-5",
      question: "How does the 14-day free trial work?",
      answer:
        "The 14-day free trial gives you complete access to our platform and all AI agents. You can explore features, set up automations, and see real results. No payment information is required to start your trial.",
    },
  ];

  const handleToggle = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="bg-black py-16 lg:py-24">
      <div className="main-container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-[89px]">
          {/* Left Section - Title and CTA Buttons */}
          <div className="flex max-w-[460px] flex-col gap-6 lg:col-span-2 lg:gap-8">
            {/* Title */}
            <div className="flex flex-col gap-6">
              <h2 className="font-montserrat text-4xl leading-tight font-extrabold text-white sm:text-5xl lg:text-6xl">
                Frequently asked questions
              </h2>

              {/* Gradient Bar */}
              <BarIcon className="h-3 w-24" />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 lg:gap-6">
              <button className="btn-gradient font-montserrat flex items-center justify-between rounded-3xl px-6 py-4 text-xl font-extrabold text-white lg:p-8 lg:text-2xl">
                <span>Visit FAQ center</span>
                <FaArrowRight />
              </button>

              <button className="btn-gradient font-montserrat flex items-center justify-between rounded-3xl px-6 py-4 text-xl font-extrabold text-white lg:p-8 lg:text-2xl">
                <span>Visit our blog</span>
                <FaArrowRight />
              </button>

              <button className="btn-gradient font-montserrat flex items-center justify-between rounded-3xl px-6 py-4 text-xl font-extrabold text-white lg:p-8 lg:text-2xl">
                <span>Ask for more help</span>
                <FaArrowRight />
              </button>
            </div>
          </div>

          {/* Right Section - FAQ Accordions */}
          <div className="flex flex-col gap-4 lg:col-span-3 lg:gap-8">
            {faqData.map((faq) => (
              <div
                key={faq.id}
                className={`${
                  activeAccordion === faq.id
                    ? "btn-gradient"
                    : "bg-[rgba(66,66,66,0.5)] shadow-[0px_3px_49px_9px_rgba(0,0,0,0.06)] backdrop-blur-[13.5914px]"
                } rounded-[10px] transition-all duration-300`}
              >
                <Accordion
                  id={faq.id}
                  title={faq.question}
                  active={activeAccordion === faq.id}
                  onToggle={() => handleToggle(faq.id)}
                >
                  {faq.answer}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Faqs;
