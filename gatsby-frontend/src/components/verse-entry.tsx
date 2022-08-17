/** @jsx jsx */
import * as React from "react"
import { jsx, Themed } from "theme-ui"
import { allBibles, getVerseNumber } from "../../utils/bibleBlockchainInteraction"
import CheckMark from "./checkmark"
import styles from "./css/table.css"
import { ethers } from "ethers";

type VerseEntryProps = {
  verseIdentifier: string[],
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
  "border-bottom": "1px solid #dddddd",
  "border-right": "1px solid #dddddd"
}

const VerseEntry = ({verseIdentifier = ["1-1-1-0"], onClick = ()=>{}}: VerseEntryProps) => {
  return (
    <React.Fragment>
    <table style={{styles}}>
      <tr>
        <th style={{"border-top": "1px solid #dddddd","border-left": "1px solid #dddddd",...tdStyle}}>Verse Identifier</th>
        <th style={{"border-top": "1px solid #dddddd",...tdStyle}}>Verse</th>
        <th style={{"border-top": "1px solid #dddddd",...tdStyle}}>Is Deployed</th>
        <th style={{"border-top": "1px solid #dddddd",...tdStyle}}>Is Locked</th>
      </tr>
      {
      verseIdentifier.map(verseIdentifier=>
      <tr style={{trStyle}}>
        <td style={{"border-left": "1px solid #dddddd",...tdStyle}}>{verseIdentifier}</td>
        <td style={tdStyle}>{allBibles[0].verses[getVerseNumber(verseIdentifier)].text}</td>
        <td style={tdStyle}><CheckMark isChecked={false}/></td>
        <td style={tdStyle}><CheckMark isChecked={false}/></td>
      </tr>)
      }
    </table>
    </React.Fragment>
  )
}

export default VerseEntry
