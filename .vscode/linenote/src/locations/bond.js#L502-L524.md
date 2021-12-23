Following tries to set max up to max available, except it can not be used
for now because the js calculation gives different output than the contract.
Might be figured out later.

```js
													const maxAvailable = (ethers.BigNumber.from(treasuryBalance?.balances?.[0]?.balance)
														.lte(ethers.BigNumber.from(bond?.[0]?.maxPayout))) ?
														ethers.BigNumber.from(treasuryBalance?.balances?.[0]?.balance, 18) :
														ethers.BigNumber.from(bond?.[0]?.maxPayout)

													bondPayoutFor(
														String(bond?.[0]?.address).toLocaleLowerCase(),
														token0balance,
													)
														.then(n => {
															if (n.lte(maxAvailable)) {
																setInputAmount(
																	ethers.utils.formatUnits(token0balance, token0.decimals),
																)
																setValue(token0balance)
															}
															 else {
																setInputAmount(
																	ethers.utils.formatUnits(maxAvailable.mul(bondPrice), token0.decimals),
																)
																setValue(token0balance)
															}
														})
```