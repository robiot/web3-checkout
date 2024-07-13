"use client";

import Image from "next/image";
import { useState } from "react";
import { useAccount } from "wagmi";

import { Container } from "@/components/common/Container";
import { Stars } from "@/components/common/Stars";
import { Button } from "@/components/ui/button";

import { ConnectPage } from "./_components/ConnectPage";
import { VerifyPage } from "./_components/VerifyPage";

const CheckoutPage = () => {
  // const data = useQuery({
  //   queryKey: ["products"],
  //   queryFn: () => {
  //     return [
  //       {
  //         id: "192h9d28du",
  //         name: "Product 1",
  //         price: 100,
  //         totalSales: 100,
  //       },
  //     ];
  //   },
  // });
  const account = useAccount();

  const [page, setPage] = useState<"connect" | "verify" | "pay">("connect");

  return (
    <div className="flex flex-col md:flex-row h-screen mx-auto">
      <div className="h-screen md:w-1/2 bg-[#F7F7F8] p-5">
        <Container className="ml-auto mr-20 max-w-[30rem]">
          <div className="">TheCompany</div>

          <div className="mt-14 text-2xl">Coolest Afterparty Ticket</div>

          <div className="flex gap-3 items-center mt-6">
            <span className="text-3xl">$9.00</span>
            <span className="text-sm text-foreground/70">+$2.0 GAS</span>
          </div>

          <Image
            src="/tmp.jpg"
            alt="Asda"
            width={651}
            height={390}
            className="rounded-xl mt-6 h-72 object-cover"
          />

          <p className="text-foreground/60 mt-8">
            Here you can talk more about the product in whatever format you
            would like, most likely in markdown sin ce that is what is
            formatted.
          </p>

          <p className="flex items-center gap-2 flex-1">
            Powered by
            <Image
              src="/logo.svg"
              alt="logo"
              height={120}
              width={450}
              className="h-3 w-fit"
            />
          </p>
        </Container>
      </div>

      <div className="h-screen md:w-1/2 p-5">
        <Container className="mr-auto md:ml-20 max-w-[30rem]">
          <div className="text-lx pt-16">Pay with crypto</div>

          <div className="border border-border p-4 rounded-xl mt-8">
            <div className="flex items-center gap-5">
              <Stars percent={80} />
              <span className="text-foreground/60">140 reviews</span>
            </div>

            <Button variant="secondary" className="w-full mt-6">
              View reviews
            </Button>
          </div>

          <div className="flex justify-between py-6">
            <span>Total</span>
            <span>9 USD</span>
          </div>

          <div className="border-t border-border w-full" />

          <div className="pt-6">
            {page == "connect" && (
              <ConnectPage
                next={() => {
                  setPage("verify");
                }}
              />
            )}

            {page == "verify" && (
              <VerifyPage
                next={() => {
                  setPage("pay");
                }}
              />
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default CheckoutPage;
