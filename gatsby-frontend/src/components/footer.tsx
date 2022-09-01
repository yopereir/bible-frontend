/** @jsx jsx */
import { jsx, Container, Flex, Link, useColorMode } from "theme-ui"
import useEmiliaConfig from "../hooks/use-emilia-config"
// @ts-ignore
import LinkList from "./linklist"

const links = [
    {displayName: "About Us", href: "aboutme"},
    {displayName: "Contact", href: "contact"},
    {displayName: "FAQ", href: "faq"},
    {displayName: "GitHub", href: "https://github.com/yopereir/bible-frontend/tree/master/gatsby-frontend", shouldOpenInNewTab: true}
]

const Footer = () => {
  const { showThemeAuthor } = useEmiliaConfig()
  const [colorMode, setColorMode] = useColorMode()
  const isDark = colorMode === `dark`
  const toggleColorMode = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setColorMode(isDark ? `light` : `dark`)
  }

  return (
      <Container>
        <div sx={{ display: `grid`, gridGap: 4, gridTemplateColumns: [`1fr`, `1fr`] }}>
          <Flex
            sx={{
              textAlign: [`center`],
              flexDirection: `column`,
              justifyContent: `space-between`,
            }}
          >
            <div sx={{ mt: [1, 1] }}>
              <div sx={{ a: { ml: [1, 1], mr: [1, 1] } }}>
                <LinkList links={links} />
              </div>
              <div sx={{ color: `textMuted` }}>Copyright &copy; {new Date().getFullYear()}. All rights reserved.</div>
            </div>
          </Flex>
        </div>
      {false && (
        <Container
          sx={{
            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`,
            color: `text`,
            fontWeight: `semibold`,
            a: { color: `text` },
            mt: 4,
          }}
        >
          {isDark ? (
            <img
              width="30"
              height="30"
              src="https://img.lekoarts.de/gatsby/logo_v2-light_w30.png"
              alt="LekoArts Logo"
            />
          ) : (
            <img width="30" height="30" src="https://img.lekoarts.de/gatsby/logo_v2_w30.png" alt="LekoArts Logo" />
          )}
          {` `}
          <Link
            aria-label="Link to the theme's GitHub repository"
            sx={{ ml: 2 }}
            href="https://github.com/LekoArts/gatsby-themes/tree/main/themes/gatsby-theme-emilia"
          >
            Themeeeeee
          </Link>
          <div sx={{ mx: 1 }}>by</div>
          {` `}
          <Link
            aria-label="Link to the theme author's website"
            href="https://www.lekoarts.de?utm_source=emilia&utm_medium=Theme"
          >
            LekoArts
          </Link>
        </Container>
      )}
      </Container>
  )
}

export default Footer