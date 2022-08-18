/** @jsx jsx */
import * as React from "react"
import { jsx, Themed } from "theme-ui"
import useEmiliaConfig from "../hooks/use-emilia-config"
import styles from "./css/dropdown.css"

type DropDownProps = {
  list: string[],
  placeholder: string,
  shouldSortList?: boolean,
  fieldName: string,
  onChange?: Function
}

const DropDown = ({list = [], placeholder = "", shouldSortList = false, fieldName = "", onChange = ()=>{}}: DropDownProps) => {
  return (
    <React.Fragment>
    <Themed.div className="row">
      <Themed.div className="col-sm-3">
        <select className="form-control" onChange={(e)=>onChange(fieldName,e.target.value)}>
          {list.map(listItem=>(listItem == placeholder)?<option key={listItem} value={listItem} selected>{listItem}</option>:<option key={listItem} value={listItem}>{listItem}</option>)}
        </select>
      </Themed.div>
    </Themed.div>
    </React.Fragment>
  )
}

export default DropDown

/*
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.1/css/all.css"/>
      <div id="container" style={{styles}}>
        <input id={"search"+fieldName} ref={search} onKeyUp={()=>find(search.value)} onClick={()=>find(search.value)} autocomplete="off" placeholder={placeholder}></input>
        <div id={"chev"+fieldName} ref={sel}><i class="fas fa-chevron-down"></i></div>
        <div id={"results"+fieldName} ref={dd} onClick={handleResult}></div>
      </div>
      <div class="container">
*/