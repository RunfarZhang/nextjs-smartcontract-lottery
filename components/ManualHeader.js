import { useMoralis } from "react-moralis";
import { useEffect } from "react";

export default function ManualHeader() {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis();
    // let accountNumber = 7
    useEffect(() => {
        if (isWeb3Enabled) {
            console.log("Web3Enabled!");
            return;
        }
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3();
            }
        }
        // console.log(isWeb3Enabled);
        console.log("Web3NotEnabled!");
        enableWeb3();
    }, [isWeb3Enabled]);
    useEffect(() => {
        Moralis.onAccountChanged((newAccount) => {
            console.log(`Account changed to ${newAccount}`);
            if (newAccount == null) {
                window.localStorage.removeItem("connected");
                deactivateWeb3();
                console.log("No account found!");
            }
        });
    }, []);
    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3();
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("connected", "inject");
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    );
}
