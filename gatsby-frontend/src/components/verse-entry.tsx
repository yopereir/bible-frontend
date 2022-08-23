/** @jsx jsx */
import * as React from "react"
import { jsx, Themed } from "theme-ui"
import { allBibles, getVerseNumber } from "../../utils/bibleBlockchainInteraction"
import CheckMark from "./checkmark"
import useSiteMetadata from "../hooks/use-site-metadata"
import styles from "./css/table.css"
import crossStyles from "./css/crossmark.css"

type VerseEntryProps = {
  verses: {
    identifier: string,
    isDeployed: boolean,
    isLocked: boolean
  }[],
  onClick?: Function
}
type VerseDialogProps = {
  verseIdentifier: string,
  isDeployed: boolean,
  isLocked: boolean,
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
const VerseDialog = ({verseIdentifier = "", isDeployed = false, isLocked = false, onBack = ()=>{}}: VerseDialogProps) => {
  return (
  <React.Fragment>
    <div style={{backgroundColor: "#0005", position: "fixed", width: "100%", height: "100%", top: 0, left: 0}} onClick={onBack}>
    <Themed.div style={{ backgroundColor: "#000f", position: "fixed", width: "50%", height: "75%", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}} onClick={(e) => e.stopPropagation()}>
      <Themed.div onClick={onBack}>
        <span style={{...crossStyles, position: "relative", left: "45%", width: "10%", height: "10%"}} className="crosssign" alt="no">
            <div className="crosssign_stem" style={{width: "2em", height: ".2em"}}></div>
            <div className="crosssign_stem2" style={{width: ".2em", height: "2em"}}></div>
        </span>
      </Themed.div>
      <table style={{styles}}>
        <tbody>
          <tr key={verseIdentifier} style={{trStyle}}>
            <td style={{borderLeft: "1px solid #dddddd",...tdStyle}}><Themed.div>Verse Identifier</Themed.div></td>
            <td style={tdStyle}><Themed.div>{verseIdentifier}</Themed.div></td>
          </tr>
          <tr key={verseIdentifier} style={{trStyle}}>
            <td style={{borderLeft: "1px solid #dddddd",...tdStyle}}><Themed.div>Reference Verse</Themed.div></td>
            <td style={tdStyle}><Themed.div>{allBibles[0].verses[getVerseNumber(verseIdentifier)].text}</Themed.div></td>
          </tr>
          <tr key={verseIdentifier} style={{trStyle}}>
            <td style={{borderLeft: "1px solid #dddddd",...tdStyle}}><Themed.div>Verse on Blockchain</Themed.div></td>
            <td style={tdStyle}><Themed.div>{allBibles[0].verses[getVerseNumber(verseIdentifier)].text}</Themed.div></td>
          </tr>
          <tr key={verseIdentifier} style={{trStyle}}>
            <td style={{borderLeft: "1px solid #dddddd",...tdStyle}}><Themed.div>Is Locked</Themed.div></td>
            <td style={tdStyle}><Themed.div><CheckMark isChecked={isLocked}/></Themed.div></td>
          </tr>
          <tr key={verseIdentifier} style={{trStyle}}>
            <td style={{borderLeft: "1px solid #dddddd",...tdStyle}}><Themed.div>{verseIdentifier}</Themed.div></td>
            <td style={tdStyle}><Themed.div>{allBibles[0].verses[getVerseNumber(verseIdentifier)].text}</Themed.div></td>
            <td style={tdStyle}><Themed.div><CheckMark isChecked={isDeployed}/></Themed.div></td>
            <td style={tdStyle}><Themed.div><CheckMark isChecked={isLocked}/></Themed.div></td>
          </tr>
        </tbody>
      </table>
      <Themed.div style={{position: "relative", bottom: "-50%"}}>
      <button type="submit" value="Send Email" style={{...crossStyles, maxWidth:"25vw"}} class="btn-lrg submit-btn">Deploy</button>
          <Themed.p>Support the project by donating:</Themed.p>
          <Themed.p>ETH: {useSiteMetadata().donationAddressEth}</Themed.p>
          <Themed.p>Notice an issue? Let us know or contribute by fixing it yourself on <a target="_blank" rel="noopener noreferrer" href="https://github.com/yopereir/bible-frontend/tree/master/gatsby-frontend">Github</a>.</Themed.p>
      </Themed.div>
    </Themed.div>
    </div>
  </React.Fragment>
)
}

const VerseEntry = ({verses = [{identifier: "1-1-1-0", isDeployed: false, isLocked: false}], onClick = ()=>{}}: VerseEntryProps) => {
  const [selectedVerse, setSelectedVerse] = React.useState({isSelected: false, verseIdentifier: "", isDeployed: false, isLocked: false})
  const handleVerseClicked = (isSelected, verseIdentifier, isDeployed, isLocked) =>{
    setSelectedVerse({isSelected, verseIdentifier, isDeployed, isLocked});
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
        <td style={tdStyle}><Themed.div onClick={()=>handleVerseClicked(true, verse.identifier, verse.isDeployed, verse.isLocked)}>{allBibles[0].verses[getVerseNumber(verse.identifier)].text}</Themed.div></td>
        <td style={tdStyle}><Themed.div><CheckMark isChecked={verse.isDeployed}/></Themed.div></td>
        <td style={tdStyle}><Themed.div><CheckMark isChecked={verse.isLocked}/></Themed.div></td>
      </tr>)
      }
    </tbody>
    </table>
    {selectedVerse.isSelected?<VerseDialog verseIdentifier={selectedVerse.verseIdentifier} isDeployed={selectedVerse.isDeployed} isLocked={selectedVerse.isLocked} onBack={handleDialogClosed}/>:""}
    </React.Fragment>
  )
}

export default VerseEntry
