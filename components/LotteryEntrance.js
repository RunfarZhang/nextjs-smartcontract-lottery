import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification, Button } from "web3uikit";

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const [entranceFee, setEntranceFee] = useState("0");
    const [numPlayers, setNumPlayers] = useState("0");
    const [rencentWinner, setRencentWinner] = useState("0");

    const dispatch = useNotification();

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    });

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
        // msgValue: "",
    });

    const { runContractFunction: getNumOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumOfPlayers",
        params: {},
        // msgValue: "",
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
        // msgValue: "",
    });

    async function updateUI() {
        const entraceFeeFromCall = (await getEntranceFee()).toString();
        const numPlayersFromCall = (await getNumOfPlayers()).toString();
        const rencentWinnerFromCall = (await getRecentWinner()).toString();
        setEntranceFee(entraceFeeFromCall);
        setNumPlayers(numPlayersFromCall);
        setRencentWinner(rencentWinnerFromCall);
        // console.log(`entranceFee: ${entraceFeeFromCall}`);
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    const handleSuccess = async (tx) => {
        await tx.wait(1);
        handleNewNotification(tx);
        updateUI();
    };

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        });
    };

    return (
        <div className="p-5">
            Hi, this is from LotteryEntrance!
            <br />
            {raffleAddress ? (
                <div>
                    <Button
                        theme="primary"
                        onClick={async () => {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            });
                        }}
                        text="Enter Raffle"
                        className="hover:bg-blue-400 text-white font-bold py-2 px-4 rounded ml-auto"
                        disabled={isFetching || isLoading}
                    />
                    <div>
                        <div>
                            Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH{" "}
                        </div>
                        <div>Number of Players: {numPlayers}</div>
                        <div>Recent Winner: {rencentWinner}</div>
                    </div>
                </div>
            ) : (
                <div>No Raffle Address Deteched!</div>
            )}
        </div>
    );
}
