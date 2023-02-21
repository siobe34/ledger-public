import React, { useState } from "react";

import { IDropdown } from "../types/IDropdown";

export const Dropdown = ({ className, children }: IDropdown) => {
    // * State to determine if dropdown menu is active or hidden
    const [dropdownDisplay, setDropdownDisplay] = useState<boolean>(false);

    return (
        <div
            className={`${className} relative flex flex-col items-center justify-center`}
            onClick={() => setDropdownDisplay(!dropdownDisplay)}
            onMouseOver={() => setDropdownDisplay(true)}
            onMouseOut={() => setDropdownDisplay(false)}
        >
            {React.Children.map(children, (child: React.ReactElement) => {
                if (children.indexOf(child) === 0) return React.cloneElement(child);
            })}
            <div
                className={`absolute top-full ${
                    dropdownDisplay ? "flex" : "hidden"
                } z-20 min-w-full flex-col rounded border border-borderBase bg-bgBase`}
            >
                {React.Children.map(children, (child: React.ReactElement) => {
                    if (children.indexOf(child) > 0) return React.cloneElement(child);
                })}
            </div>
        </div>
    );
};
