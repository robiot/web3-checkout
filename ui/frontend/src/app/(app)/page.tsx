"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useAccount } from "wagmi";

import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { enviroment } from "@/lib/enviroment";

import { columns_main, DataFormat } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { ExpandCreate } from "./_components/ExpandCreate";

const ProductsPage = () => {
  const account = useAccount();

  const data = useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<DataFormat[]> => {
      const response = await fetch(`${enviroment.BACKEND_URL}/product`, {
        method: "GET",
        // headers: {
        //   "Content-Type": "application/json",
        // },
      });

      if (response.status !== 200) {
        alert("Error");

        return [];
      }

      const jsonData = (await response.json()) as {
        data: DataFormat[]; // there is more
      };

      return jsonData.data.filter(
        (it) => it.created_by.toLowerCase() === account.address?.toLowerCase(),
      );
    },
  });

  return (
    <Container>
      <div className="mb-10 mt-24 flex justify-between items-center">
        <h1 className="text-3xl font-medium">Products</h1>
        <ExpandCreate id="Create Product">
          <Button className="gap-2 rounded-xl text-background">
            <Plus />
            Create New Product
          </Button>
        </ExpandCreate>
      </div>

      <DataTable
        columns={columns_main}
        isSubTable={false}
        currentPageData={data}
        // setActivePage={() => {}}
      />
    </Container>
  );
};

export default ProductsPage;
