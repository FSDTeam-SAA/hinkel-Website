import { useCalculatePrice } from "@/features/book-creation/hooks/usePricing";
import { Loader2 } from "lucide-react";
import { DeliveryMethodCardProps } from "../types";

interface Icon {
  width: number;
  height: number;
}

export const DeliveryMethodCard = ({
  method,
  selectedPages,
  selectedFormat,
  onSelect,
}: DeliveryMethodCardProps) => {
  const { response, isLoading } = useCalculatePrice({
    pageCount: selectedPages,
    deliveryType: method.apiType,
  });

  const totalPrice = response?.data?.totalPrice;
  const displayPrice = totalPrice !== undefined ? `$${totalPrice}` : "---";

  return (
    <button
      onClick={() => onSelect(method.id)}
      className={`relative h-[424px] rounded-[24px] flex flex-col items-center justify-center py-[40px] px-[20px] transition-all ${
        selectedFormat === method.id
          ? "border-2 border-primary bg-primary/10"
          : "border-2 border-[#e1e3e5] bg-white hover:border-primary/50"
      }`}
    >
      <div className="flex flex-col gap-[21px] items-center w-full max-w-[300px]">
        <div className="bg-primary rounded-[50px] p-[8px] flex items-center justify-center">
          <div className="w-[42px] h-[42px] flex items-center justify-center">
            <DownloadIcon width={42} height={42} />
          </div>
        </div>

        <div className="flex flex-col gap-[8px] items-center text-center">
          <h5 className="text-[24px] font-semibold font-inter text-[#0a0a0a]">
            {method.title}
          </h5>
          <p className="text-[16px] font-normal font-inter text-[#4a5565]">
            {method.subtitle}
          </p>
          {isLoading ? (
            <div className="h-[48px] flex items-center justify-center mt-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <p className="text-[32px] font-bold font-inter text-[#ff8b36] mt-4">
              {displayPrice}
            </p>
          )}
        </div>
      </div>

      {selectedFormat === method.id && (
        <div className="absolute inset-0 rounded-[24px] border-2 border-[#ff8b36] pointer-events-none" />
      )}
    </button>
  );
};

const DownloadIcon = ({ width = 42, height = 42 }: Icon) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 0.75C10.1875 0.75 1.5 9.4375 1.5 20.25C1.5 31.0625 10.1875 39.75 21 39.75C31.8125 39.75 40.5 31.0625 40.5 20.25C40.5 9.4375 31.8125 0.75 21 0.75ZM21 36.75C12.0625 36.75 4.5 29.1875 4.5 20.25C4.5 11.3125 12.0625 3.75 21 3.75C29.9375 3.75 37.5 11.3125 37.5 20.25C37.5 29.1875 29.9375 36.75 21 36.75Z"
      fill="white"
    />
    <path d="M20.25 11.25H21.75V24.75H20.25V11.25Z" fill="white" />
    <path
      d="M26.4375 19.3125L25.6875 20.0625L21 14.625L16.3125 20.0625L15.5625 19.3125L21 12.5625L26.4375 19.3125Z"
      fill="white"
    />
    <path
      d="M28.5 27.75H13.5C13.0625 27.75 12.75 27.4375 12.75 27C12.75 26.5625 13.0625 26.25 13.5 26.25H28.5C28.9375 26.25 29.25 26.5625 29.25 27C29.25 27.4375 28.9375 27.75 28.5 27.75Z"
      fill="white"
    />
  </svg>
);
