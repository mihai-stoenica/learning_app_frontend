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
          <p className="font-bold">Courses</p>
          <hr />
          <li>
            <a href="/">All Courses</a>
          </li>
          <li>
            <a href="/?mine=true">My courses</a>
          </li>
          <p className="font-bold">Sectiune</p>
          <hr />
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideDrawer;
