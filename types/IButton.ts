export interface IButton {
    className?: string;
    children: React.ReactNode;
    onClick?: React.MouseEventHandler;
    href?: string;
    hrefInternal?: string;
    ariaLabel?: string;
}
