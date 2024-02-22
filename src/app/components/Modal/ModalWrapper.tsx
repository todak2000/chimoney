"use client";

import { RiBankFill, RiP2PFill } from "react-icons/ri";
import { MdAttachEmail } from "react-icons/md";
import { FaCirclePlay } from "react-icons/fa6";
import { FaLink } from "react-icons/fa";
import SelectModal from "@/app/components/Modal/SelectModal";

import { BiLogoMastercard } from "react-icons/bi";
import React from "react";
import { key } from "@/app/lib/uniqueKey";
import { Icon } from "@tremor/react";
import {
  AccProps,
  ModalType,
  PaymentOptionsProps,
} from "@/app/constants/types";

interface ModalWrapperProps {
  openModal: ModalType;
  setOpenModal: React.Dispatch<React.SetStateAction<ModalType>>;
  next: string;
  accountData: AccProps[] | null;
  setNext: React.Dispatch<React.SetStateAction<string>>;
}

const ModalWrapper = ({
  openModal,
  setOpenModal,
  next,
  setNext,
  accountData,
}: ModalWrapperProps) => {
  const debitOptionsArr: PaymentOptionsProps[] = [
    {
      id: key(),
      option: "(P2P) Wallet Transfer",
      icon: (
        <Icon
          icon={RiP2PFill}
          variant="shadow"
          size="sm"
          className="text-tremor-brand-primary dark:text-white text-lg"
        />
      ),
      callBack: () => setNext("p2p"),
      isPopular: false,
      description:
        "Transfer seemlessly from your Chimoney Wallet to another Chimoney Wallet",
    },
    {
      id: key(),
      option: "Email Transfer",
      icon: (
        <Icon
          icon={MdAttachEmail}
          variant="shadow"
          size="sm"
          className="text-tremor-brand-primary dark:text-white text-lg"
        />
      ),
      callBack: () => setNext("email"),
      isPopular: false,
      description:
        "Transfer seemlessly from your Chimoney Wallet to another Chimoney Wallet",
    },
    {
      id: key(),
      option: "Bank Transfer",
      icon: (
        <Icon
          icon={RiBankFill}
          variant="shadow"
          size="sm"
          className="text-tremor-brand-primary dark:text-white text-lg"
        />
      ),
      isPopular: false,
      callBack: () => setNext("bank"),
      description: "Send funds to your choice Bank account from your wallet.",
    },
    {
      id: key(),
      option: "Payout Airtime",
      icon: (
        <Icon
          icon={FaCirclePlay}
          variant="shadow"
          size="sm"
          className="text-tremor-brand-primary dark:text-white text-lg"
        />
      ),
      isPopular: true,
      callBack: () => null,
      description:
        "Recharge your choice Phone service provider network from from your Airtime Wallet.",
    },
  ];

  const creditOptionsArr: PaymentOptionsProps[] = [
    {
      id: key(),
      option: "Generate Payment Link",
      icon: (
        <Icon
          icon={FaLink}
          variant="shadow"
          size="sm"
          className="text-tremor-brand-primary dark:text-white text-lg"
        />
      ),
      callBack: () => setNext("link"),
      isPopular: false,
      description:
        "Allows you to formally request for funds from another party by initiating a payment request via Chimoney",
    },
    {
      id: key(),
      option: "Debit/Credit Card",
      icon: (
        <Icon
          icon={BiLogoMastercard}
          variant="shadow"
          size="sm"
          className="text-tremor-brand-primary dark:text-white text-lg"
        />
      ),
      callBack: () => setNext("card"),
      isPopular: false,
      description:
        "Add funds to your wallet using your credit or debit card. This is facilitated through our secure Payments API which initiates a payment request upon user action.",
    },

    {
      id: key(),
      option: "Redeem Chimoney",
      icon: (
        <Icon
          icon={FaCirclePlay}
          variant="shadow"
          size="sm"
          className="text-green-500 dark:invert text-lg"
        />
      ),
      isPopular: true,
      callBack: () => null,
      description:
        "Redeem Chimoney funds sent to you by your friends and loved ones seamlessly.",
    },
  ];

  const modalConfig: any = {
    credit: {
      header: "Top Up Your Wallet",
      options: creditOptionsArr,
      type: "credit",
      subHeader:
        "Chimoney offers you a variety of options to fund your wallets, ensuring flexibility and convenience. Please select from the available funding options.",
    },
    debit: {
      header: "Send money Now!",
      options: debitOptionsArr,
      type: "debit",
      accountData: accountData,
      subHeader:
        "Chimoney offers you a variety of options to send fund to others, ensuring flexibility and convenience. Please select from the available sending options.",
    },
  };

  const config = modalConfig[openModal];

  return (
    config && (
      <SelectModal
        open={openModal}
        header={config.header}
        setOpen={setOpenModal}
        options={config.options}
        type={config.type}
        next={next}
        setNext={setNext}
        subHeader={config.subHeader}
        accountData={config.accountData}
      />
    )
  );
};

export default ModalWrapper;
