import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";

export const ButtonDelete = ({ className, onClick, ariaLabel }: { className?: string; onClick: React.MouseEventHandler; ariaLabel: string }) => (
    <button className={`${className} rounded-full border border-borderBase px-2 hover:border-borderPrimary`} aria-label={ariaLabel} onClick={onClick}>
        <FontAwesomeIcon icon={faMinus} />
    </button>
);
