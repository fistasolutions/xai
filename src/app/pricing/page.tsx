"use client";
import React, { useState } from "react";
import PricingCard from "@/components/ui/pricing-card";
import PricingToggle from "@/components/ui/pricing-toggle";
import BarIcon from "@/components/icons/Bar";
import Faqs from "@/components/faqs";

function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  const pricingPlans = [
    {
      title: "Starter",
      subtitle: "Ideal for small projects.",
      price: "Free",
      features: [
        "AI-Powered Web Design",
        "Responsive & Mobile-Friendly",
        "Basic SEO Optimization",
        "Essential Analytics Tracking",
        "1,000 API calls per month",
        "5 Month free support",
      ],
      buttonText: "Try for free",
      isPopular: false,
      isBlueCheckmark: false,
    },
    {
      title: "Professional",
      subtitle: "For freelancers and startups.",
      price: isYearly ? "$12" : "$15",
      priceSubtext: "/per user",
      features: [
        "Everything in Starter +",
        "Custom AI-Generated Branding",
        "Advanced SEO & Performance Optimization",
        "Social Media Integration",
        "Conversion-Optimized Landing Pages",
      ],
      buttonText: "Select plan",
      isPopular: true,
      isBlueCheckmark: true,
    },
    {
      title: "Organization",
      subtitle: "For fast-growing businesses.",
      price: isYearly ? "$24" : "$30",
      priceSubtext: "/per user",
      features: [
        "Everything in Professional +",
        "Multi-Platform E-Commerce (Shopify, WooCommerce)",
        "AI-Generated Content & Marketing Assets",
        "API & Third-Party Integrations",
        "Priority Support & Dedicated Consultation",
      ],
      buttonText: "Select plan",
      isPopular: false,
      isBlueCheckmark: false,
    },
  ];

  return (
    <>
      <div className="relative w-full">
        {/* Background */}
        <div className="absolute inset-0">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: 'url("/images/pricing-bg.png")',
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center bottom",
              opacity: 1,
            }}
          />
        </div>

        {/* Content */}
        <div className="main-container relative z-10 mx-auto px-4 py-8 md:py-24">
          {/* Header */}
          <div className="mb-8 text-center md:mb-12">
            <h1 className="font-montserrat mb-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Pricing Plans
            </h1>

            {/* bar */}

            <p className="mx-auto mt-6 mb-6 max-w-[640px] px-4 text-base text-gray-300 md:mb-8 md:text-lg lg:mt-10">
              Find the perfect plan that fits your needs and start transforming
              your digital presence today.
            </p>

            <BarIcon className="mx-auto mb-6 lg:mb-10" />

            {/* Toggle */}
            <PricingToggle onToggle={setIsYearly} className="px-4" />
          </div>

          {/* Pricing Cards */}
          <div className="mx-auto flex max-w-6xl flex-col items-end justify-center gap-8 lg:flex-row">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={plan.title}
                title={plan.title}
                subtitle={plan.subtitle}
                price={plan.price}
                priceSubtext={plan.priceSubtext}
                features={plan.features}
                buttonText={plan.buttonText}
                isPopular={plan.isPopular}
                isBlueCheckmark={plan.isBlueCheckmark}
                className="h-full"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-black pt-10 lg:pt-24">
        <h2 className="font-montserrat mb-4 text-center text-3xl font-bold text-white uppercase sm:text-4xl md:text-5xl">
          Need a Custom Solution?
        </h2>
        <p className="font-montserrat mb-4 text-center text-lg text-white lg:mb-8">
          {" "}
          Let’s create something unique for your business!
        </p>

        <button className="btn-gradient font-figtree mx-auto flex flex-row items-center justify-center gap-2 rounded-full px-8 py-3 text-center text-lg leading-tight font-normal text-white sm:gap-3 sm:rounded-[40px] sm:px-12 sm:py-4 sm:text-xl sm:leading-[30px] md:gap-4 md:rounded-[50px] md:px-16 md:py-5 md:text-2xl md:leading-[35px] lg:gap-[10px] lg:rounded-[65.1971px] lg:px-[114px] lg:py-[35px] lg:text-[34.2676px] lg:leading-[41px]">
          14-Days Free Trial
        </button>
      </div>

      <Faqs />
    </>
  );
}

export default Pricing;
