/** @jsx jsx */
import * as React from "react"
import { jsx, Themed } from "theme-ui"
import { allBibles, getVerseNumber } from "../../utils/bibleBlockchainInteraction"
import CheckMark from "./checkmark"
import styles from "./css/table.css"

type VerseEntryProps = {
  verses: {
    identifier: string,
    isDeployed: boolean,
    isLocked: boolean
  }[],
  onClick?: Function
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

const VerseEntry = ({verses = [{identifier: "1-1-1-0", isDeployed: false, isLocked: false}], onClick = ()=>{}}: VerseEntryProps) => {
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
        <td style={{borderLeft: "1px solid #dddddd",...tdStyle}}>{verse.identifier}</td>
        <td style={tdStyle}>{allBibles[0].verses[getVerseNumber(verse.identifier)].text}</td>
        <td style={tdStyle}><CheckMark isChecked={verse.isDeployed}/></td>
        <td style={tdStyle}><CheckMark isChecked={verse.isLocked}/></td>
      </tr>)
      }
    </tbody>
    </table>
    </React.Fragment>
  )
}

export default VerseEntry
