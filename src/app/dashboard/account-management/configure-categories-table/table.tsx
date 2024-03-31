import { AddCategory } from "@/app/dashboard/account-management/configure-categories-table/add-category";
import { columns } from "@/app/dashboard/account-management/configure-categories-table/columns";
import { DataTable } from "@/components/ui/data-table";
import { api } from "@/trpc/server";

export const ConfiguresCategoriesTable = async () => {
  const data = await api.relatedCategories.get.query();

  let pagination = false;

  if (data.length >= 10) {
    pagination = true;
  }

  return (
    <>
      <AddCategory className="mb-4" />
      <DataTable
        columns={columns}
        data={data}
        searchBar={false}
        pagination={pagination}
      />
    </>
  );
};
