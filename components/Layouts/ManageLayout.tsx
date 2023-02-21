import { Dashboard } from "./Dashboard";

export const ManageLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Dashboard>
            <div className='flex w-full flex-col gap-8'>
                <div className='flex flex-col items-center justify-start gap-4 sm:items-start'>{children}</div>
            </div>
        </Dashboard>
    );
};
