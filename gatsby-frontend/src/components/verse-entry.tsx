/** @jsx jsx */
import * as React from "react"
import { jsx, Themed, useColorMode } from "theme-ui"
import { allBibles, getVerseNumber, getVerseIdentifiers } from "../../utils/bibleBlockchainInteraction"
import CheckMark from "./checkmark"
import useSiteMetadata from "../hooks/use-site-metadata"
import styles from "./css/table.css"
import crossStyles from "./css/crossmark.css"
import loadingStyle from "./css/loading.css"
import { ethers } from "ethers";

type VerseEntryProps = {
  verses: {
    identifier: string,
    blockchainQuery: Object
  }[],
  onClick?: Function,
  blockchainNetwork: Object
}
type VerseDialogProps = {
  verseIdentifier: string,
  blockchainQuery: Object,
  onBack: Function,
  blockchainNetwork: Object
}

const trStyle = {
  width: "100%",
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  flex: "1 1 1 1em"
}
const tdStyle = {
  borderBottom: "1px solid #dddddd",
  borderRight: "1px solid #dddddd"
}
const VerseDialog = ({verseIdentifier = "", blockchainQuery = {}, onBack = ()=>{}, blockchainNetwork = {}}: VerseDialogProps) => {
  const [colorMode, setColorMode] = useColorMode()
  const isDark = colorMode === `dark`
  const [transactionLoadingMessage, setTransactionLoadingMessage] = React.useState({state: "", hash: ""});
  const deployButtonClicked = async () => {
    //const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner((await provider.send("eth_requestAccounts", []))[0]);
    const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ADMINS","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"BIBLE_VERSES","outputs":[{"internalType":"string","name":"BIBLE_VERSE","type":"string"},{"internalType":"bool","name":"BIBLE_VERSE_LOCKED","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SUPER_ADMIN","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newAdminAddress","type":"address"},{"internalType":"bool","name":"shouldSetAsAdmin","type":"bool"}],"name":"addNewAdmin","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"verseIdentifier","type":"string"},{"internalType":"bool","name":"shouldLockVerse","type":"bool"}],"name":"lockBibleVerse","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"verseIdentifier","type":"string"},{"internalType":"string","name":"verse","type":"string"},{"internalType":"bool","name":"shouldLockVerse","type":"bool"}],"name":"updateBibleVerse","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"nonpayable","type":"function"}]
    const Bible = new ethers.Contract(blockchainNetwork.contractAddress, abi, signer);

    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
          chainId: blockchainNetwork.chainId,
          rpcUrls: blockchainNetwork.rpc,
          chainName: blockchainNetwork.chainName,
          nativeCurrency: blockchainNetwork.nativeCurrency,
          blockExplorerUrls: blockchainNetwork.blockExplorerUrls
      }]
  });
    /*
    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
          chainId: "0x89",
          rpcUrls: ["https://rpc-mainnet.matic.network/"],
          chainName: "Matic Mainnet",
          nativeCurrency: {
              name: "MATIC",
              symbol: "MATIC",
              decimals: 18
          },
          blockExplorerUrls: ["https://polygonscan.com/"]
      }]
  });
*/
    setTransactionLoadingMessage({state: "Deploying", hash: ""});
    let tx = await Bible.updateBibleVerse(verseIdentifier, allBibles[getVerseIdentifiers(verseIdentifier).bible].verses[getVerseNumber(verseIdentifier)].text, true).catch((error)=>setTransactionLoadingMessage({state: "Error", hash: ""}));
    await tx.wait();
    setTransactionLoadingMessage({state: "Deployed", hash: tx.hash});
    console.log(tx);
  }

  return (
  <React.Fragment>
    <div style={{backgroundColor: "#0005", position: "fixed", width: "100%", height: "100%", top: 0, left: 0}} onClick={onBack}>
    <Themed.div style={{ backgroundColor: isDark?"#1a202c":"#ffff", position: "fixed", width: "50%", height: "75%", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}} onClick={(e) => e.stopPropagation()}>
      {/* Close Button */}
      <Themed.div onClick={onBack}>
        <span style={{...crossStyles, position: "relative", left: "45%", width: "10%", height: "10%"}} className="crosssign" alt="no">
            <div className="crosssign_stem" style={{width: "2em", height: ".2em"}}></div>
            <div className="crosssign_stem2" style={{width: ".2em", height: "2em"}}></div>
        </span>
      </Themed.div>
      {(transactionLoadingMessage.state == "Deploying")
        ?<Themed.div className="loading" style={{position:"relative", bottom: "-30%", ...loadingStyle}}>
          Transaction has been initiated. Waiting for confirmation
        </Themed.div>
        :(transactionLoadingMessage.state == "Deployed")
          ?<Themed.div style={{position:"relative", bottom: "-30%"}}>
            <p>Transaction complete.</p>
            <p>Thank you for your contribution!</p>
            <p>You can view your transaction on the network <a href={blockchainNetwork.blockExplorerUrls[0]+"/tx/"+transactionLoadingMessage.hash}>here</a>.</p>
            <p><a href="#" onClick={()=>window.location.reload()}>Refresh</a> this page to see the verse status update.</p>
          </Themed.div>
          :<Themed.div style={{position: "relative", bottom: "0%"}}>
            {/* Heading */}
            <Themed.p>
              {(transactionLoadingMessage.state == "Error")
                ?"There was an error in the transaction"
                :(!blockchainQuery.BIBLE_VERSE_LOCKED)
                  ?((blockchainQuery.BIBLE_VERSE == allBibles[getVerseIdentifiers(verseIdentifier).bible].verses[getVerseNumber(verseIdentifier)].text)
                    ?"Verse was deployed but not locked"
                    :"Verse is not deployed")
                  :"Verse is locked"}
            </Themed.p>
            {/* Table */}
            <table style={{margin: "auto",width: "90%",...styles}}>
              <tbody>
                <tr key={verseIdentifier} style={{trStyle}}>
                  <td style={{borderLeft: "1px solid #dddddd",borderTop: "1px solid #dddddd",...tdStyle}}><Themed.div>Verse Identifier</Themed.div></td>
                  <td style={{borderTop: "1px solid #dddddd",...tdStyle}}><Themed.div>{verseIdentifier}</Themed.div></td>
                </tr>
                <tr key={verseIdentifier} style={{trStyle}}>
                  <td style={{borderLeft: "1px solid #dddddd",...tdStyle}}><Themed.div>Reference Verse</Themed.div></td>
                  <td style={tdStyle}><Themed.div>{allBibles[getVerseIdentifiers(verseIdentifier).bible].verses[getVerseNumber(verseIdentifier)].text}</Themed.div></td>
                </tr>
                <tr key={verseIdentifier} style={{trStyle}}>
                  <td style={{borderLeft: "1px solid #dddddd",...tdStyle}}><Themed.div>Verse on Blockchain</Themed.div></td>
                  <td style={tdStyle}><Themed.div>{blockchainQuery.BIBLE_VERSE}</Themed.div></td>
                </tr>
                <tr key={verseIdentifier} style={{trStyle}}>
                  <td style={{borderLeft: "1px solid #dddddd",...tdStyle}}><Themed.div>Is Locked</Themed.div></td>
                  <td style={tdStyle}><Themed.div><CheckMark isChecked={blockchainQuery.BIBLE_VERSE_LOCKED??false}/></Themed.div></td>
                </tr>
              </tbody>
            </table>
            {/* Deploy Button */}
            {(!blockchainQuery.BIBLE_VERSE_LOCKED)?<button type="submit" value="Send Email" style={{...crossStyles, maxWidth:"25vw"}} class="btn-lrg submit-btn" onClick={deployButtonClicked}>Deploy</button>:<p></p>}
            {/* Support links: common for all states */}
            <Themed.p style={{margin: "0"}}>Support the project by donating:</Themed.p>
            <Themed.p style={{margin: "0"}}>ETH: {useSiteMetadata().donationAddressEth}</Themed.p>
            <Themed.p style={{margin: "0"}}>Notice an issue? Let us know or contribute by fixing it yourself on <a target="_blank" rel="noopener noreferrer" href="https://github.com/yopereir/bible-frontend/tree/master/gatsby-frontend">Github</a>.</Themed.p>
          </Themed.div>
      }
    </Themed.div>
    </div>
  </React.Fragment>
)
}

const VerseEntry = ({verses = [{identifier: "1-1-1-0", blockchainQuery: {}}], onClick = ()=>{}, blockchainNetwork = {}}: VerseEntryProps) => {
  const [selectedVerse, setSelectedVerse] = React.useState({isSelected: false, verseIdentifier: "", blockchainQuery: {}})
  const handleVerseClicked = (isSelected, verseIdentifier, blockchainQuery) =>{
    setSelectedVerse({isSelected, verseIdentifier, blockchainQuery});
  }
  const handleDialogClosed = (e, data) =>{
    setSelectedVerse({...selectedVerse, isSelected: false});
  }

  return (
    <React.Fragment>
    <table style={{styles}}>
    <thead>
      <tr>
        <th style={{borderTop: "1px solid #dddddd",borderLeft: "1px solid #dddddd",...tdStyle}}>Verse Identifier</th>
        <th style={{borderTop: "1px solid #dddddd",...tdStyle}}>Verse</th>
        <th style={{borderTop: "1px solid #dddddd",...tdStyle}}>Is Deployed</th>
        <th style={{borderTop: "1px solid #dddddd",...tdStyle}}>Is Locked</th>
      </tr>
    </thead>
    <tbody>
      {
      verses.map(verse=>
      <tr key={verse.identifier} style={{trStyle}}>
        <td style={{borderLeft: "1px solid #dddddd",...tdStyle}}><Themed.div onClick={()=>handleVerseClicked(true, verse.identifier, verse.blockchainQuery)}>{verse.identifier}</Themed.div></td>
        <td style={tdStyle}><Themed.div onClick={()=>handleVerseClicked(true, verse.identifier, verse.blockchainQuery)}>{allBibles[getVerseIdentifiers(verse.identifier).bible].verses[getVerseNumber(verse.identifier)].text}</Themed.div></td>
        <td style={tdStyle}><Themed.div onClick={()=>handleVerseClicked(true, verse.identifier, verse.blockchainQuery)}><CheckMark isChecked={verse.blockchainQuery.BIBLE_VERSE == allBibles[getVerseIdentifiers(verse.identifier).bible].verses[getVerseNumber(verse.identifier)].text}/></Themed.div></td>
        <td style={tdStyle}><Themed.div onClick={()=>handleVerseClicked(true, verse.identifier, verse.blockchainQuery)}><CheckMark isChecked={verse.blockchainQuery.BIBLE_VERSE_LOCKED??false}/></Themed.div></td>
      </tr>)
      }
    </tbody>
    </table>
    {selectedVerse.isSelected?<VerseDialog verseIdentifier={selectedVerse.verseIdentifier} blockchainQuery={selectedVerse.blockchainQuery} onBack={handleDialogClosed} blockchainNetwork={blockchainNetwork}/>:""}
    </React.Fragment>
  )
}

export default VerseEntry
