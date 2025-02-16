const ListenNewTxs = ({wallet, setLastUpdate}) => {
    const query = `
        subscription($address: String!) {
            address(address: $address) {
                hash
                seen
                raw
                inputs {
                    index
                    prev_hash
                    prev_index
                }
                outputs {
                    index
                    amount
                    lock {
                        address
                    }
                }
                blocks {
                    hash
                    timestamp
                    height
                }
            }
        }
        `
    const handler = async (tx) => {
        console.log(tx)
        await window.electron.saveTransactions([tx.address])
        await window.electron.generateHistory(wallet.addresses)
        if (typeof setLastUpdate === "function") {
            console.log("setting new last update: " + (new Date()).toISOString())
            setLastUpdate((new Date()).toISOString())
        }
    }
    window.electron.listenNewTxs({query, variables: {address: wallet.addresses[0]}, handler})
}

export default ListenNewTxs
