import * as React from "react";

type SideDrawerProps = {
  isOpened: boolean;
  children: React.ReactNode;
};

const SideDrawer: React.FC<SideDrawerProps> = ({ isOpened, children }) => {
  return (
    <div className={`drawer flex-1 ${isOpened ? "drawer-open" : ""}`}>
      <input
        id="my-drawer-2"
        type="checkbox"
        className="drawer-toggle"
        hidden={true}
      />
      <div className="drawer-content flex flex-col w-full h-full">
        {children}
      </div>
      <div className={`drawer-side h-full `}>
        <ul className="menu bg-base-200 text-base-content h-full w-80 p-4">
          <li>
            <a>Sidebar Item 1</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideDrawer;
