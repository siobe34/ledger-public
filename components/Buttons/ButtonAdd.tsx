import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export const ButtonAdd = ({ className, onClick, ariaLabel }: { className?: string; onClick: React.MouseEventHandler; ariaLabel: string }) => (
    <button className={`${className} rounded-full border border-borderBase px-2 hover:border-borderPrimary`} aria-label={ariaLabel} onClick={onClick}>
        <FontAwesomeIcon icon={faPlus} />
    </button>
);
