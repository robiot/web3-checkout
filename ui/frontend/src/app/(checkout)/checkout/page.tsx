"use client";

import { useQuery } from "@tanstack/react-query";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { enviroment } from "@/lib/enviroment";

const ProductsPage = () => {
  const data = useQuery({
    queryKey: ["products"],
    queryFn: () => {
      return [
        {
          id: "192h9d28du",
          name: "Product 1",
          price: 100,
          totalSales: 100,
        },
      ];
    },
  });

  return (
    <div className="flex">
      <div className="h-screen w-1/2 bg-[#F7F7F8] ">lol</div>

      <div className="p-8 ">
        <div className="text-lx">Pay with crypto</div>

        <IDKitWidget
          action="report"
          // signal="my_signal"
          app_id={enviroment.WI_APP_ID}
          onSuccess={(_result) => {
            // todo antony
            // setIsVerified(true);
            // setIDData(result);
          }}
          verification_level={VerificationLevel.Orb}
          handleVerify={(_result) => {
            console.log("you verified!!@");
          }}
        >
          {({ open }) => (
            <Button onClick={open} className="bg-black gap-3 w-fit" size="lg">
              <Sparkles />
              Verify with World ID
            </Button>
          )}
        </IDKitWidget>
      </div>
    </div>
  );
};

export default ProductsPage;
