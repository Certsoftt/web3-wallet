import React from 'react'
import { useShowNetwork } from './Header'

type NetworkProps = {
   onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const Network = ({onClick}: NetworkProps) => {
    const showNetwork = useShowNetwork().showNetwork
    
  return (
    <React.Fragment>
        {showNetwork &&(
            <div id="network" className="network">
                <div className="network_title">
                    <p>Networks</p>
                </div>
                <div id="network_item" className="network_list" onClick={onClick}>
                    <p className="network_item">
                        <svg
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        height="16"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                        className="input-icon"
                        >
                            <path
                            d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"
                            ></path>
                        </svg>
                        <span>Ethereum Mainnet</span>
                        <svg
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            height="16"
                            width="16"
                            xmlns="http://www.w3.org/2000/svg"
                            className="input-icon"
                        >
                            <path
                            d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"
                            ></path>
                        </svg>
                        <span>Solana DevNet</span>
                        <svg
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            height="16"
                            width="16"
                            xmlns="http://www.w3.org/2000/svg"
                            className="input-icon"
                        >
                            <path
                            d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"
                            ></path>
                        </svg>
                        <span>Bitcoin Test Network</span>
                        <svg
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            height="16"
                            width="16"
                            xmlns="http://www.w3.org/2000/svg"
                            className="input-icon"
                        >
                            <path
                            d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"
                            ></path>
                        </svg>
                        <span>BNB Test Network</span>
                        <svg
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            height="16"
                            width="16"
                            xmlns="http://www.w3.org/2000/svg"
                            className="input-icon"
                            >
                            <path
                            d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"
                            ></path>
                        </svg>
                        <span>Sepolia Test Network</span>
                    </p>
                </div>
                <button id="add_network" className="button3 addStyle">
                    Add network
                </button>
            </div>
        )}
    </React.Fragment>
  )
}

export default Network