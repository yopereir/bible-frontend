/** @jsx jsx */
import * as React from "react"
import { Flex, jsx, Container, Heading, Themed, useColorMode } from "theme-ui"
import { animated, useSpring, config } from "react-spring"
import { useStaticQuery, graphql, Link, navigate } from "gatsby"
import useEmiliaConfig from "../hooks/use-emilia-config"
import styles from "./css/contact.css"
import fetch from 'node-fetch';
import Layout from "../components/layout"

type ContactPageProps = {
  title: string
  areas: string[]
  description?: string
  date: string
}

const allowOnlyValidCharacters = (subjectString: String) => {
  let parsedString = ""
  for (let x = 0; x < subjectString.length; x++)
  {
    parsedString = parsedString.concat(("abcdefghijklmnopqrstuvwxyz.,;:! 1234567890@".includes(subjectString.charAt(x).toLowerCase()))?subjectString.charAt(x):"")
  }
  return parsedString
}

const ContactPage = ({ title, areas, description = ``, date }: ContactPageProps) => {
  const { name } = useEmiliaConfig()
  const [colorMode, setColorMode] = useColorMode()
  const isDark = colorMode === `dark`
  const toggleColorMode = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setColorMode(isDark ? `light` : `dark`)
  }

  const titleProps = useSpring({
    config: config.slow,
    from: { opacity: 0, transform: `translate3d(0, -30px, 0)` },
    to: { opacity: 1, transform: `translate3d(0, 0, 0)` },
  })
  const backButtonProps = useSpring({
    config: config.slow,
    from: { opacity: 0, transform: `translate3d(-30px, 0, 0)` },
    to: { opacity: 1, transform: `translate3d(0, 0, 0)` },
  })
  const infoProps = useSpring({ config: config.slow, delay: 500, from: { opacity: 0 }, to: { opacity: 1 } })

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://script.google.com/macros/s/AKfycbyHyCc0zzdfJQ0MSlmTqIs3Pz22VWqOnx0sYgK5H1wpIssO9bxIvrlzUNq9YDCIYBwT/exec", {
      "headers": {"content-type": "application/x-www-form-urlencoded",},
      "body": "name="+encodeURIComponent(allowOnlyValidCharacters(e.target.name.value))
      +"&companyname="+encodeURIComponent(allowOnlyValidCharacters(e.target.companyname.value))
      +"&email="+encodeURIComponent(allowOnlyValidCharacters(e.target.email.value))
      +"&phonenumber="+encodeURIComponent(allowOnlyValidCharacters(e.target.phonenumber.value))
      +"&message="+encodeURIComponent(allowOnlyValidCharacters(e.target.message.value))
      +"&source="+window.location.origin,
      "method": "POST"
    });
    navigate("/thankyou");
  };
  return (
    <Layout>
        <div sx={{textAlign: "center", mt: 4, mb: [6, 6, 7] }}>
          <animated.div style={titleProps}>
            <Heading as="h1" variant="styles.h1">
              Contact
            </Heading>
          </animated.div>
          <animated.div style={infoProps}>
            <Themed.p sx={{ mb: 0, mt: 4 }}>{date}</Themed.p>
<form class="gform" method="POST" data-email="yohann.pereira28@gmail.com" onSubmit={handleSubmit}>
  <div class="container" style={{styles}}>
    <div class="row">
        <h4 style={{"text-align":"center"}}>We'd love to hear from you!</h4>
    </div>
    <div class="row input-container">
        <div class="col-xs-12">
          <div class="styled-input wide">
            <input id="name" name="name" type="text" required />
            <label>Name</label> 
          </div>
          <div class="styled-input wide">
            <input id="companyname" name="companyname" type="text" />
            <label>Company (optional)</label> 
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <div class="styled-input">
            <input id="email" name="email" type="email" required />
            <label>Email</label> 
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <div class="styled-input" style={{float:"right"}}>
            <input id="phonenumber" name="phonenumber" type="text" />
            <label>Phone Number (optional)</label> 
          </div>
        </div>
        <div class="col-xs-12">
          <div class="styled-input wide">
            <textarea id="message" name="message" required></textarea>
            <label>Message</label>
          </div>
        </div>
        <div class="col-xs-12">
          <input type="submit" value="Send Email" style={{"maxWidth":"25vw"}} class="btn-lrg submit-btn"/>
        </div>
    </div>
  </div>
</form>

          </animated.div>
        </div>
      </Layout>
  )
}

export default ContactPage
