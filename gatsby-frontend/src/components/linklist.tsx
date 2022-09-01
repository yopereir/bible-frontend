/** @jsx jsx */
import * as React from "react"
import { jsx, Themed } from "theme-ui"

type LinkListProps = {
  links: {
    href: string,
    displayName: string,
    shouldOpenInNewTab?: boolean
  }[]
}
const LinkList = ({links = [{href: "link", displayName:"testLink", shouldOpenInNewTab: false}]}: LinkListProps) => {

  return (
    <React.Fragment>
      <div style={{display: "flex", justifyContent: "space-around"}}>
        {links.map((link) => (
          <Themed.a key={link.displayName} href={link.href} target={link.shouldOpenInNewTab?"_blank":""} rel="noopener noreferrer">
            {link.displayName}
          </Themed.a>
        ))}
      </div>
    </React.Fragment>
  )
}

export default LinkList