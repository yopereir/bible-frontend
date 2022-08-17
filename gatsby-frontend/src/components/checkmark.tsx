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
        <span style={checkStyles} class="checkmark" alt="yes">
            <div class="checkmark_circle"></div>
            <div class="checkmark_stem"></div>
            <div class="checkmark_kick"></div>
        </span>:
        <span styles={crossStyles} class="crosssign" alt="no">
            <div class="crosssign_circle"></div>
            <div class="crosssign_stem"></div>
            <div class="crosssign_stem2"></div>
        </span>
        }
    </React.Fragment>
  )
}

export default CheckMark
