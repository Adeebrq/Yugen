"use client"
import { walletContext } from "@/hooks/useWalletLogic";
import { useContext } from "react";


export default function Home() {
  const {mnemonic, setMnemonic} = walletContext()
  console.log(mnemonic)
  return (
    <div>
      Hello
      {mnemonic && mnemonic.map((item, index)=>(
        <div>
          publickey 1- {item.publicKey}
          secretkey2- {item.secretKey}
        </div>
      ))}
    </div>
  );
}
