"use client";
import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { updateCurrency, user } from "@/app/store";

import { Switch } from "@tremor/react";

const CurrencySwitch: React.FC = () => {
  const dispatch = useDispatch();
  const userr = useSelector(user);

  const [isSwitchOn, setIsSwitchOn] = React.useState<boolean>(
    userr.prefferedCurrency !== "USD"
  );

  const handleSwitchChange = (value: boolean) => {
    setIsSwitchOn(value);
    dispatch(updateCurrency(value ? "NGN" : "USD"));
  };

  return (
    <label className=" inline-flex items-center me-5 cursor-pointer ">
      <span className="mx-3 text-sm font-medium text-gray-900 ">USD</span>
      <Switch
        id="switch"
        name="switch"
        checked={isSwitchOn}
        className="dark:invert"
        onChange={handleSwitchChange}
      />
      <span className="mx-3 text-sm font-medium text-gray-900 ">NGN</span>
    </label>
  );
};

export default CurrencySwitch;
