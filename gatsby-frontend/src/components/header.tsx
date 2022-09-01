/** @jsx jsx */
import * as React from "react"
import BackButton from "./backbutton"
import { jsx, Container, Flex, useColorMode } from "theme-ui"
import ColorModeToggle from "./colormode-toggle"

const Header = () => {
  const [colorMode, setColorMode] = useColorMode()
  const isDark = colorMode === `dark`
  const toggleColorMode = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setColorMode(isDark ? `light` : `dark`)
  }

  return (
      <React.Fragment>
        <Container>
          <div sx={{ display: `grid`, gridGap: 4, gridTemplateColumns: [`1fr`, `1fr`] }}>
          <Flex as="header" variant="layout.header">
            <div style={{ top: "1rem", right: "1rem", position: "absolute", "textAlign": `right`}}><ColorModeToggle isDark={isDark} toggle={toggleColorMode} /></div>
            <Container sx={{ textAlign: `center`, my: 4, zIndex: 10 }}>
              <BackButton backButtonText = {"Homepage"} link = {"/"}/>
            </Container>
          </Flex>
          </div>
        </Container>
      </React.Fragment>
  )
}

export default Header