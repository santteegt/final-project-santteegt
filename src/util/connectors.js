import { Connect } from 'uport-connect'

// export let uport = new Connect('TruffleBox')

export let uport = new Connect('Hello uPort', {
  network: "rinkeby",
  bannerImage: {"/": "/ipfs/QmXuH4EfrLQt2fafeGs1GyHjq71CdKp9E3esiq5vYQDLUM"},
})

// export const web3 = uport.getWeb3()
export const web3 = uport.getProvider()
// console.log(web3)
