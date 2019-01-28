import SEOwnedUpgradabilityProxy from '../contracts/SEOwnedUpgradabilityProxy.json'
import Supporteth_V0 from '../contracts/Supporteth_V0.json';

export const getAdminAccount = async (web3, networkId) => {
    const deployedNetwork = SEOwnedUpgradabilityProxy.networks[networkId];
    const contract = new web3.eth.Contract(
    SEOwnedUpgradabilityProxy.abi,
    deployedNetwork && deployedNetwork.address,
    );

    const response = await contract.methods.proxyOwner().call();
    console.log(`RS getAdmin ${response}`)
    return response

}
