"use client";
import { walletContext } from "@/hooks/useWalletLogic";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IoMoonOutline } from "react-icons/io5";
import { PiSunLight } from "react-icons/pi";
import { GrCircleInformation } from "react-icons/gr";
import { FaRegCopy } from "react-icons/fa";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { GlowingEffect } from "@/components/ui/SeedPhraseBox";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function LandingPage() {
  const { mnemonic, seedPhrase } = walletContext();
  const { setTheme, resolvedTheme } = useTheme();
  const [themeToggle, setThemeToggle] = useState(false);
  const [showSecret, setShowSecret] = useState<boolean>(false);

  useEffect(() => {
    setThemeToggle(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const handleChange = (checker: boolean) => {
    setThemeToggle(checker);
    setTheme(checker ? "dark" : "light");
  };

  const copytext = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Copied successfully!");
  };

  const seedPhraseArray = seedPhrase.split(" ");

  return (
    <div
      className={cn(
        "relative min-h-screen w-full",
        "[background-size:40px_40px]",
        "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
        "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
      )}
    >
      <div className="w-full px-[20%]  flex content-center items-start flex-col py-6">
        <div className="w-full flex border rounded-xl border-gray-900 bg-white dark:bg-black justify-between items-center flex-row p-2 m-2  px-5">
          <div className="text-2xl py-4 ">
            <div className="text-2xl font-bold">Yūgen</div>
            <div className="text-sm">
              A mini project taht creates 5 solana wallet from scratch using the BIP39 protocol.
            </div>
          </div>
          <div className=" flex flex-row gap-2 text-xl">
            <PiSunLight className="text-xl" />
            <Switch checked={themeToggle} onCheckedChange={handleChange} />
            <IoMoonOutline className="text-xl" />
          </div>
        </div>

        {seedPhraseArray && (
          <div className=" w-full my-3 p-2 bg-white dark:bg-black border rounded-xl border-gray-900">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl">
                  Seed phrase
                </AccordionTrigger>
                <AccordionContent className="relative">
                  <div className=" flex flex-row justify-between px-2">
                    <div>
                      Refers to a human-readable set of words (typically 12 or
                      24){" "}
                    </div>
                    <div className="flex flex-row gap-4 text-xl">
                      <button onClick={() => copytext(seedPhrase)}>
                        <FaRegCopy className="cursor-pointer" />
                      </button>
                      <Tooltip>
                        <TooltipTrigger>
                          <GrCircleInformation />
                        </TooltipTrigger>
                        <TooltipContent>
                          This seedphrase is later converted into your secret
                          key under the hood, allowing access to your wallet in
                          human readable format.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {seedPhraseArray.map((item, index) => (
                      <div key={index}>
                        <div className="relative rounded-2xl border  md:rounded-3xl md:p-3 m-3 border border-gray-900 w-auto text-xl flex justify-center items-center">
                          {item}
                          <GlowingEffect
                            spread={40}
                            glow={true}
                            disabled={false}
                            proximity={64}
                            inactiveZone={0.01}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {mnemonic &&
          mnemonic.map((item, index) => (
            <div
              key={index + 1}
              className="border rounded-xl border-gray-900 w-full my-3 p-2 dark:bg-black bg-white"
            >
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-xl">
                    Wallet {index + 1}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-xl flex justify-end w-full">
                      <button onClick={() => setShowSecret(!showSecret)}>
                        {showSecret ? (
                          <FaEye className="cursor-pointer" />
                        ) : (
                          <FaEyeSlash className="cursor-pointer" />
                        )}
                      </button>
                    </div>
                    <div className="text-md px-2">Public key-</div>

                    <div className="relative rounded-2xl border md:rounded-3xl md:p-3 m-3 border border-gray-900 w-auto text-xl flex justify-center items-center cursor-pointer"
                     onClick={() => copytext(item.publicKey)}
                    >
                      <div>{item.publicKey}</div>
                      <GlowingEffect
                        spread={40}
                        glow={true}
                        disabled={false}
                        proximity={64}
                        inactiveZone={0.01}
                      />
                    </div>
                    <div className="font-mono break-words">
                      <div className="text-md px-2">Secret key-</div>
                      <div className="relative rounded-2xl border md:rounded-3xl md:p-3 m-3 border-gray-900 w-full text-xl flex justify-center items-center  cursor-pointer">
                        {showSecret ? (
                          <div
                            className=" text-sm break-words whitespace-normal text-center w-full px-2"
                            onClick={() => copytext(item.secretKey)}
                          >
                            {item.secretKey}
                          </div>
                        ) : (
                          <div
                            className="text-2xl text-center w-full"
                            onClick={() => copytext(item.secretKey)}
                          >
                            ••••••••••••••••••••••••••••••••
                          </div>
                        )}

                        <GlowingEffect
                          spread={40}
                          glow={true}
                          disabled={false}
                          proximity={64}
                          inactiveZone={0.01}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
      </div>
    </div>
  );
}
