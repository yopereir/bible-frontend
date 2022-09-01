/** @jsx jsx */
import * as React from "react"
import { jsx, useColorMode } from "theme-ui"
import { animated, useSpring, config } from "react-spring"
import Header from "./header"
import Footer from "./footer"
import useEmiliaConfig from "../hooks/use-emilia-config"

type LayoutProps = {
  showHeader?: boolean,
  children?: any
}

const Layout = ({children, showHeader = true}: LayoutProps) => {
  const { name } = useEmiliaConfig()
  const [colorMode, setColorMode] = useColorMode()
  const isDark = colorMode === `dark`
  const infoProps = useSpring({ config: config.slow, delay: 500, from: { opacity: 0 }, to: { opacity: 1 } })

  return (
    <React.Fragment>
      {showHeader?<Header/>:""}
      <div sx={{ textAlign: "center", mt: 4, mb: [6, 6, 7] }}>
        <animated.div style={{...infoProps}}>
          {children}
        </animated.div>
      </div>
      <div style={{margin: "auto", bottom: "0px", width: "100%", position: "relative"}}>
        <Footer/>
      </div>
    </React.Fragment>
  )
}

export default Layout
