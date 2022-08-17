/** @jsx jsx */
import * as React from "react"
import { jsx, Themed } from "theme-ui"

type VerseEntryProps = {
  verseIdentifier: string,
  onClick: Function
}

const VerseEntry = ({verseIdentifier = "1-1-1-0", onClick = ()=>{}}: VerseEntryProps) => {
  return (
    <React.Fragment>
    <Themed.div style={{display: "flex", justifyContent: "space-evenly"}}>
      <Themed.p>{verseIdentifier}</Themed.p>
      <Themed.p>{verseIdentifier}</Themed.p>
    </Themed.div>
    </React.Fragment>
  )
}

export default VerseEntry
