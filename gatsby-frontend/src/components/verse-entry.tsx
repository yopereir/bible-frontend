/** @jsx jsx */
import * as React from "react"
import { jsx, Themed } from "theme-ui"
import { allBibles, getVerseNumber } from "../../utils/bibleBlockchainInteraction"

type VerseEntryProps = {
  verseIdentifier: string[],
  onClick: Function
}
const tableStyle ={
  width: "80%",
  "margin": "auto",
  "text-align":"center",
  "table-layout":"fixed",
  border: "1px solid #dddddd",
  "border-collapse": "collapse"
}
const trStyle = {
  display: "flex",
  flexDirection: "column",
  flex: "1 1 1 1em"
}
const tdStyle = {
  "border-bottom": "1px solid #dddddd",
  "border-right": "1px solid #dddddd"
}

const VerseEntry = ({verseIdentifier = ["1-1-1-0"], onClick = ()=>{}}: VerseEntryProps) => {
  console.log()
  return (
    <React.Fragment>
    <Themed.table >
      <Themed.tr style={{trStyle}}>
        <Themed.th style={{"border-top": "1px solid #dddddd","border-left": "1px solid #dddddd",...tdStyle}}>Verse Identifier</Themed.th>
        <Themed.th style={{"border-top": "1px solid #dddddd",...tdStyle}}>Verse</Themed.th>
        <Themed.th style={{"border-top": "1px solid #dddddd",...tdStyle}}>Is Deployed</Themed.th>
        <Themed.th style={{"border-top": "1px solid #dddddd",...tdStyle}}>Is Locked</Themed.th>
      </Themed.tr>
      {
      verseIdentifier.map(verseIdentifier=>
      <Themed.tr style={{trStyle}}>
        <Themed.td style={{"border-left": "1px solid #dddddd",...tdStyle}}>{verseIdentifier}</Themed.td>
        <Themed.td style={tdStyle}>{allBibles[0].verses[getVerseNumber(verseIdentifier)].text}</Themed.td>
        <Themed.td style={tdStyle}>No</Themed.td>
        <Themed.td style={tdStyle}>No</Themed.td>
      </Themed.tr>)
      }
    </Themed.table>
    <Themed.div style={{display: "flex", justifyContent: "space-evenly"}}>
      <Themed.p>{verseIdentifier}</Themed.p>
      <Themed.p>{verseIdentifier}</Themed.p>
    </Themed.div>
    </React.Fragment>
  )
}

export default VerseEntry
