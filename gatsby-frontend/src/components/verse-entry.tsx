/** @jsx jsx */
import * as React from "react"
import { jsx, Themed } from "theme-ui"
import { allBibles, getVerseNumber, getVerseIdentifiers } from "../../utils/bibleBlockchainInteraction"
import CheckMark from "./checkmark"
import useSiteMetadata from "../hooks/use-site-metadata"
import styles from "./css/table.css"
import crossStyles from "./css/crossmark.css"

type VerseEntryProps = {
  verses: {
    identifier: string,
    blockchainQuery: Object
  }[],
  onClick?: Function
}
type VerseDialogProps = {
  verseIdentifier: string,
  blockchainQuery: Object,
  onBack: Function
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
const VerseDialog = ({verseIdentifier = "", blockchainQuery = {}, onBack = ()=>{}}: VerseDialogProps) => {
  return (
  <React.Fragment>
    <div style={{backgroundColor: "#0005", position: "fixed", width: "100%", height: "100%", top: 0, left: 0}} onClick={onBack}>
    <Themed.div style={{ backgroundColor: "#000f", position: "fixed", width: "50%", height: "75%", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <Themed.div onClick={onBack}>
          <span style={{...crossStyles, position: "relative", left: "45%", width: "10%", height: "10%"}} className="crosssign" alt="no">
              <div className="crosssign_stem" style={{width: "2em", height: ".2em"}}></div>
              <div className="crosssign_stem2" style={{width: ".2em", height: "2em"}}></div>
          </span>
        </Themed.div>

        <Themed.div style={{position: "relative", bottom: "0%"}}>
        {/* Heading */}
        <Themed.p>{(!blockchainQuery.BIBLE_VERSE_LOCKED)
        ?((blockchainQuery.BIBLE_VERSE == allBibles[0].verses[getVerseNumber(verseIdentifier)].text)
          ?"Verse was deployed but not locked"
          :"Verse is not deployed")
        :"Verse is locked"}</Themed.p>
        {/* Table */}
        <table style={{margin: "auto",width: "90%",...styles}}>
          <tbody>
            <tr key={verseIdentifier} style={{trStyle}}>
              <td style={{borderLeft: "1px solid #dddddd",borderTop: "1px solid #dddddd",...tdStyle}}><Themed.div>Verse Identifier</Themed.div></td>
              <td style={{borderTop: "1px solid #dddddd",...tdStyle}}><Themed.div>{verseIdentifier}</Themed.div></td>
            </tr>
            <tr key={verseIdentifier} style={{trStyle}}>
              <td style={{borderLeft: "1px solid #dddddd",...tdStyle}}><Themed.div>Reference Verse</Themed.div></td>
              <td style={tdStyle}><Themed.div>{allBibles[0].verses[getVerseNumber(verseIdentifier)].text}</Themed.div></td>
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
        {(!blockchainQuery.BIBLE_VERSE_LOCKED)?<button type="submit" value="Send Email" style={{...crossStyles, maxWidth:"25vw"}} class="btn-lrg submit-btn">Deploy</button>:<p></p>}
        {/* Support links: common for all states */}
        <Themed.p style={{margin: "0"}}>Support the project by donating:</Themed.p>
        <Themed.p style={{margin: "0"}}>ETH: {useSiteMetadata().donationAddressEth}</Themed.p>
        <Themed.p style={{margin: "0"}}>Notice an issue? Let us know or contribute by fixing it yourself on <a target="_blank" rel="noopener noreferrer" href="https://github.com/yopereir/bible-frontend/tree/master/gatsby-frontend">Github</a>.</Themed.p>
      </Themed.div>
    </Themed.div>
    </div>
  </React.Fragment>
)
}

const VerseEntry = ({verses = [{identifier: "1-1-1-0", blockchainQuery: {}}], onClick = ()=>{}}: VerseEntryProps) => {
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
        <td style={{borderLeft: "1px solid #dddddd",...tdStyle}}><Themed.div>{verse.identifier}</Themed.div></td>
        <td style={tdStyle}><Themed.div onClick={()=>handleVerseClicked(true, verse.identifier, verse.blockchainQuery)}>{allBibles[0].verses[getVerseNumber(verse.identifier)].text}</Themed.div></td>
        <td style={tdStyle}><Themed.div><CheckMark isChecked={verse.blockchainQuery.BIBLE_VERSE == allBibles[0].verses[getVerseNumber(verse.identifier)].text}/></Themed.div></td>
        <td style={tdStyle}><Themed.div><CheckMark isChecked={verse.blockchainQuery.BIBLE_VERSE_LOCKED??false}/></Themed.div></td>
      </tr>)
      }
    </tbody>
    </table>
    {selectedVerse.isSelected?<VerseDialog verseIdentifier={selectedVerse.verseIdentifier} blockchainQuery={selectedVerse.blockchainQuery} onBack={handleDialogClosed}/>:""}
    </React.Fragment>
  )
}

export default VerseEntry
