import React from "react";
import { InventoryTable } from "../components/tables/InventoryTable";

export const InventoryPage: React.FC = () => {
  return (
    <div className="w-full">
      <InventoryTable />
    </div>
  );
};
