import React, { createContext, useMemo, useState, useContext } from "react";
import noop from "lodash/noop";

type MenuIds = "first" | "second" | "last";
type Menu = { id: MenuIds; title: string };

type SelectedMenu = { id: MenuIds }; // Описуємо тип SelectedMenu

const MenuSelectedContext = createContext<{
  selectedMenu: SelectedMenu | null;
}>({
  selectedMenu: null,
});

type MenuAction = {
  onSelectedMenu: (selected: SelectedMenu) => void; // Описуємо  тип MenuAction
};

const MenuActionContext = createContext<MenuAction>({
  onSelectedMenu: noop,
});

type PropsProvider = {
  children: React.ReactNode; // Вказуємо тип для children
};

function MenuProvider({ children }: PropsProvider) {
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenu | null>(null);

  const menuContextAction = useMemo(
    () => ({
      onSelectedMenu: (menu: SelectedMenu) => {
        if (menu) {
          setSelectedMenu(menu);
        }
      },
    }),
    []
  );

  const menuContextSelected = useMemo(
    () => ({
      selectedMenu,
    }),
    [selectedMenu]
  );

  return (
    <MenuActionContext.Provider value={menuContextAction}>
      <MenuSelectedContext.Provider value={menuContextSelected}>
        {children}
      </MenuSelectedContext.Provider>
    </MenuActionContext.Provider>
  );
}

type PropsMenu = {
  menus: Menu[]; // Описуємо тип PropsMenu
};

function MenuComponent({ menus }: PropsMenu) {
  const { onSelectedMenu } = useContext(MenuActionContext);
  const { selectedMenu } = useContext(MenuSelectedContext);

  return (
    <>
      {menus.map((menu) => (
        <div key={menu.id} onClick={() => onSelectedMenu({ id: menu.id })}>
          {menu.title}{" "}
          {selectedMenu?.id === menu.id ? "Selected" : "Not selected"}
        </div>
      ))}
    </>
  );
}

export function ComponentApp() {
  const menus: Menu[] = [
    {
      id: "first",
      title: "first",
    },
    {
      id: "second",
      title: "second",
    },
    {
      id: "last",
      title: "last",
    },
  ];

  return (
    <MenuProvider>
      <MenuComponent menus={menus} />
    </MenuProvider>
  );
}
