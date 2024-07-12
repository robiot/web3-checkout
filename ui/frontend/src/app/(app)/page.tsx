import { Container } from "@/components/common/Container";

import { columns_main } from "./_components/columns";
import { DataTable } from "./_components/data-table";

const ProductsPage = () => {
  return (
    <Container>
      <h1 className="mt-24 text-3xl font-medium">Projects</h1>

      <DataTable
        columns={columns_main}
        isSubTable
        columnFilters={[]}
        setColumnFilters={() => {}}
        currentPageData={{}}
        setActivePage={() => {}}
      />
    </Container>
  );
};

export default ProductsPage;
