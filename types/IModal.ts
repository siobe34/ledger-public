export interface IModal {
    children: React.ReactNode;
    modalState: boolean;
    setModalState: React.Dispatch<React.SetStateAction<boolean>>;
}
