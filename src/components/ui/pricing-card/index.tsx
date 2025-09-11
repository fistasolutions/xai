import CheckMark from "@/components/icons/CheckMark";
import React from "react";

interface PricingCardProps {
  title: string;
  subtitle: string;
  price: string;
  priceSubtext?: string;
  features: string[];
  buttonText: string;
  buttonLink?: string;
  isPopular?: boolean;
  isBlueCheckmark?: boolean;
  className?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  subtitle,
  price,
  priceSubtext,
  features,
  buttonText,
  isPopular = false,
  className = "",
}) => {
  const cardClasses = isPopular
    ? ""
    : title === "Starter"
      ? "bg-gradient-to-b from-white/8 to-white/4 shadow-[0px_8px_32px_rgba(0,0,0,0.3),0px_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-[20px] rounded-3xl w-[350px] h-[441px] p-8 flex flex-col items-start gap-8 border border-white/10"
      : "bg-gradient-to-b from-white/8 to-white/4 shadow-[0px_8px_32px_rgba(0,0,0,0.3),0px_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-[20px] rounded-3xl w-[350px] h-[441px] p-8 flex flex-col items-start gap-8 border border-white/10";

  return (
    <div
      className={`${
        isPopular
          ? "flex h-[522px] w-full max-w-[400px] flex-col items-center gap-2.5 rounded-[28px] bg-[#4E8BDC] p-1 pt-2.5 pb-1 shadow-[0px_130px_52px_rgba(0,0,0,0.01),0px_73px_44px_rgba(0,0,0,0.05),0px_33px_33px_rgba(0,0,0,0.09),0px_8px_18px_rgba(0,0,0,0.1)]"
          : `relative ${cardClasses}`
      } ${className}`}
    >
      {isPopular && (
        <div className="flex h-[14px] items-center text-center text-[12px] leading-[115%] font-medium tracking-[0.08em] text-[#1A1A1A]">
          MOST POPULAR
        </div>
      )}

      <div
        className={`${
          isPopular
            ? "flex h-full w-full flex-col items-start gap-5 rounded-[26px] bg-gradient-to-b from-white/84 to-white/46 p-6 shadow-[0px_236px_95px_rgba(0,0,0,0.03),0px_133px_80px_rgba(0,0,0,0.1),0px_59px_59px_rgba(0,0,0,0.17),0px_15px_32px_rgba(0,0,0,0.2)] backdrop-blur-[19.5px]"
            : "w-full"
        }`}
      >
        <div
          className={`flex flex-col items-start text-left ${
            isPopular ? "gap-4" : "gap-3 pb-4"
          }`}
        >
          <div className={`flex flex-col items-start gap-1`}>
            <h3
              className={`font-space-grotesk text-xl leading-[110%] font-bold tracking-[-0.04em] ${
                isPopular ? "text-[#1a1a1a]" : "text-white"
              }`}
            >
              {title}
            </h3>
            <p
              className={`font-space-grotesk text-sm leading-[115%] font-normal tracking-[-0.03em] ${
                isPopular ? "text-black/80" : "text-white/80"
              }`}
            >
              {subtitle}
            </p>
          </div>
        </div>

        <div
          className={`flex flex-row flex-wrap content-start items-start text-left ${
            isPopular ? "gap-0.5" : "gap-0.5 pb-4"
          }`}
        >
          <div
            className={`font-space-grotesk flex items-center text-[32px] leading-[120%] font-bold tracking-[-0.04em] ${
              isPopular ? "font-medium text-[#1a1a1a]" : "text-white"
            }`}
          >
            {isPopular ? "$" : price}
          </div>
          {isPopular && (
            <div className="font-space-grotesk flex items-center text-[32px] leading-[120%] font-bold tracking-[-0.04em] text-[#1a1a1a]">
              15
            </div>
          )}
          {priceSubtext && (
            <div
              className={`font-space-grotesk text flex items-center leading-[130%] font-bold ${
                isPopular ? "text-black/80" : "text-white/80"
              }`}
            >
              {priceSubtext}
            </div>
          )}
        </div>

        <ul
          className={`flex flex-col items-start gap-[18px] ${
            isPopular ? "" : "pb-6"
          }`}
        >
          {features.map((feature, index) => (
            <li key={index} className="flex flex-row items-start gap-1.5">
              <div className="flex h-[18px] w-4 flex-row items-center py-px">
                <div className="relative h-4 w-4">
                  <CheckMark isBlue={isPopular} />
                </div>
              </div>
              <span
                className={`font-space-grotesk flex items-center text-[15px] leading-[120%] tracking-[-0.03em] ${
                  isPopular
                    ? "font-medium text-[#1a1a1a]"
                    : "font-normal text-white"
                }`}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <div
          className={`"flex gap-2" w-full flex-col items-center ${isPopular && "pb-8"} `}
        >
          <button
            className={`font-space-grotesk flex w-full cursor-pointer flex-row items-center justify-center rounded-full border-none px-6 py-3 text-base leading-[120%] font-[550] tracking-[-0.03em] ${
              isPopular ? "bg-[#1A1A1A] text-white" : "bg-white text-[#1a1a1a]"
            }`}
          >
            {buttonText}
          </button>
          {isPopular && (
            <p className="font-space-grotesk pt-2 text-center text-sm leading-[115%] font-normal tracking-[-0.03em] text-black/80">
              or contact sales
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
