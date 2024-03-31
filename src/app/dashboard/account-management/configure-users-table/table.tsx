import { AddUser } from "@/app/dashboard/account-management/configure-users-table/add-user";
import { columns } from "@/app/dashboard/account-management/configure-users-table/columns";
import { DataTable } from "@/components/ui/data-table";
import { api } from "@/trpc/server";

export const ConfigureUsersTable = async () => {
  const data = await api.relatedUsers.get.query();

  return (
    <>
      <AddUser className="mb-4" />
      <DataTable
        columns={columns}
        data={data}
        searchBar={false}
        pagination={false}
      />
    </>
  );
};
