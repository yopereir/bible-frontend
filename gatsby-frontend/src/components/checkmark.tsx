/** @jsx jsx */
import * as React from "react"
import { jsx, Themed } from "theme-ui"
import checkStyles from "./css/checkmark.css"
import crossStyles from "./css/crossmark.css"

type CheckMarkProps = {
  isToggleable: boolean,
  isChecked: boolean,
  onChange: Function
}


const CheckMark = ({isToggleable = false, isChecked = false, onChange = ()=>{}}: CheckMarkProps) => {
  return (
    <React.Fragment>
        {isChecked?
        <span style={checkStyles} className="checkmark" alt="yes">
            <div className="checkmark_circle"></div>
            <div className="checkmark_stem"></div>
            <div className="checkmark_kick"></div>
        </span>:
        <span styles={crossStyles} className="crosssign" alt="no">
            <div className="crosssign_circle"></div>
            <div className="crosssign_stem"></div>
            <div className="crosssign_stem2"></div>
        </span>
        }
    </React.Fragment>
  )
}

export default CheckMark
