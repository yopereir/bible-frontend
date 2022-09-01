/** @jsx jsx */
import * as React from "react"
import { animated, useSpring, config } from "react-spring"
import { jsx, useColorMode } from "theme-ui"
import LeftArrow from "../assets/left-arrow"
import { Link } from "gatsby"

type BackButtonProps = {
  backButtonText: string,
  link: string
}

const BackButton = ({backButtonText = "Homepage", link = "/"}: BackButtonProps) => {
  const [colorMode, setColorMode] = useColorMode();
  const backButtonProps = useSpring({
    config: config.slow,
    from: { opacity: 0, transform: `translate3d(-30px, 0, 0)` },
    to: { opacity: 1, transform: `translate3d(0, 0, 0)` },
  })

  return (
    <React.Fragment>
    <animated.div style={backButtonProps}>
      <Link
        to={link}
        aria-label={backButtonText}
        sx={{
          display: `flex`,
          alignItems: `center`,
          color: `text`,
          width: "20%",
          textDecoration: `none`,
          svg: {
            transition: `transform 0.25s cubic-bezier(0.455, 0.03, 0.515, 0.955)`,
          },
          "&:hover, &:focus": { svg: { transform: `translateX(-6px)` } },
        }}
      >
        <LeftArrow />
        <div
          sx={{
            overflow: `hidden`,
            borderRadius: `full`,
            width: `40px`,
            height: `40px`,
            display: `inline-block`,
            boxShadow: `md`,
            mx: 2,
          }}
        >
          <svg fill={colorMode === `dark`?"#fff":"#000"} xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="90%" height="90%"><path d="M 12 2.0996094 L 1 12 L 4 12 L 4 21 L 11 21 L 11 15 L 13 15 L 13 21 L 20 21 L 20 12 L 23 12 L 12 2.0996094 z M 12 4.7910156 L 18 10.191406 L 18 11 L 18 19 L 15 19 L 15 13 L 9 13 L 9 19 L 6 19 L 6 10.191406 L 12 4.7910156 z"/></svg>
        </div>
        <span sx={{ fontWeight: `medium` }}>{backButtonText}</span>
      </Link>
    </animated.div>
    </React.Fragment>
  )
}

export default BackButton
