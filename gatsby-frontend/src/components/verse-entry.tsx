/** @jsx jsx */
import * as React from "react"
import { jsx, Themed } from "theme-ui"
import { allBibles, getVerseNumber } from "../../utils/bibleBlockchainInteraction"
import CheckMark from "./checkmark"
import styles from "./css/table.css"

type VerseEntryProps = {
  verseIdentifier: string[],
  isDeployed: boolean,
  isLocked: boolean,
  onClick: Function
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

const VerseEntry = ({verseIdentifier = ["1-1-1-0"], isDeployed = false, isLocked = false, onClick = ()=>{}}: VerseEntryProps) => {
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
      verseIdentifier.map(verseIdentifier=>
      <tr key={verseIdentifier} style={{trStyle}}>
        <td style={{borderLeft: "1px solid #dddddd",...tdStyle}}>{verseIdentifier}</td>
        <td style={tdStyle}>{allBibles[0].verses[getVerseNumber(verseIdentifier)].text}</td>
        <td style={tdStyle}><CheckMark isChecked={isDeployed}/></td>
        <td style={tdStyle}><CheckMark isChecked={isLocked}/></td>
      </tr>)
      }
    </tbody>
    </table>
    </React.Fragment>
  )
}

export default VerseEntry
