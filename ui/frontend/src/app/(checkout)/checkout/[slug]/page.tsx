/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { useEnsName } from "wagmi";

import { Container } from "@/components/common/Container";
import { Stars } from "@/components/common/Stars";
import { Spinner } from "@/components/ui/spinner";
import { useProductsSingle } from "@/lib/useProductsSingle";
import { getAverageScore, useReviews } from "@/lib/useReviews";

import { ConnectPage } from "./_components/ConnectPage";
import { PayPage } from "./_components/PayPage";
import { PayWC } from "./_components/PayWC";
import { ReviewsModal } from "./_components/ReviewsModal";

interface PageProperties {
  params: {
    slug: string;
  };
}

const formatCurrency = (number_?: number) => (number_ ?? 0).toFixed(2);

function truncateAddress(address?: string) {
  if (!address) return;

  if (address.length <= 10) {
    return address; // If the address is already short, no need to truncate
  }

  const start = address.slice(0, 5);
  const end = address.slice(-5);

  return `${start}...${end}`;
}

function CheckoutPage({ params }: PageProperties) {
  const product = useProductsSingle(params.slug);
  const ens = useEnsName({ address: product.data?.created_by as any });

  const reviews = useReviews(params.slug);

  if (product.isLoading)
    return (
      <div className="flex items-center justify-center w-full h-96">
        <Spinner size="sm" className="text-background" />
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row h-screen mx-auto">
      <div className="h-screen md:w-1/2 bg-[#F7F7F8] p-5">
        <Container className="ml-auto mr-20 max-w-[30rem] flex flex-col">
          <div className="">
            {ens.data ?? truncateAddress(product.data?.created_by)}
          </div>

          <div className="mt-14 text-2xl">{product.data?.name}</div>

          <div className="flex gap-3 items-center mt-6">
            <span className="text-3xl">
              ${formatCurrency(product.data?.price)}
            </span>
            {/* <span className="text-sm text-foreground/70">+$2.0 GAS</span> */}
          </div>

          <img
            src={product.data?.media.at(0)}
            alt="Asda"
            width={651}
            height={390}
            className="rounded-xl mt-6 h-72 object-cover"
          />

          <p className="text-foreground/60 mt-8">{product.data?.description}</p>

          <p className="flex items-center gap-2 mt-auto">
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
        <Container className="mr-auto md:ml-20 max-w-[25rem]">
          <div className="text-lx pt-20">Pay with crypto</div>

          <div className="mt-8">
            <ReviewsModal id={params.slug}>
              <button className="flex items-center gap-5 cursor-pointer">
                <Stars percent={getAverageScore(reviews.data?.reviews)} />
                <span className="text-foreground/60">
                  {reviews.data?.reviews.length} reviews
                </span>
              </button>
            </ReviewsModal>

            {/* <Button variant="ghost" className="w-full mt-6">
              View reviews
            </Button> */}
          </div>

          <div className="border-t border-border w-full mt-7" />

          <div className="flex flex-col gap-2 py-4">
            <div className="flex flex-col gap-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Product</span>
                <span>{formatCurrency(product.data?.price)} USD</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee (6%)</span>
                <span>{formatCurrency(product.data?.price! * 0.06)} USD</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Total</span>
              <span>{formatCurrency(product.data?.price! * 1.06)} USD</span>
            </div>
          </div>

          <div className="border-t border-border w-full" />

          <div className="pt-6 flex flex-col gap-3">
            <ConnectPage />

            {product.data?.limitPerHuman! > 0 ? (
              <PayWC id={params.slug} price={product.data?.price!} />
            ) : (
              <PayPage id={params.slug} price={product.data?.price!} />
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}

export default CheckoutPage;
