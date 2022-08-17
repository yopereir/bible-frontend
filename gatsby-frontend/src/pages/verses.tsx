/** @jsx jsx */
import * as React from "react"
import { Flex, jsx, Container, Heading, Themed, useColorMode } from "theme-ui"
import { animated, useSpring, config } from "react-spring"
import { useStaticQuery, graphql, Link, navigate } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import HeaderBackground from "../components/header-background"
import LeftArrow from "../assets/left-arrow"
import useEmiliaConfig from "../hooks/use-emilia-config"
import ColorModeToggle from "../components/colormode-toggle"
import DropDown from "../components/dropdown"
import VerseEntry from "../components/verse-entry"
import styles from "./css/contact.css"
import fetch from 'node-fetch';
import * as ImportFunctions from "../../utils/bibleBlockchainInteraction"

type VersesPageProps = {
  title: string
  areas: string[]
  description?: string
  date: string
}

type AvatarStaticQuery = {
  file: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData
    }
  }
}

const allowOnlyValidCharacters = (subjectString: String) => {
  let parsedString = ""
  for (let x = 0; x < subjectString.length; x++)
  {
    parsedString = parsedString.concat(("abcdefghijklmnopqrstuvwxyz.,;:! 1234567890@".includes(subjectString.charAt(x).toLowerCase()))?subjectString.charAt(x):"")
  }
  return parsedString
}

const VersesPage = ({ title, areas, description = ``, date }: VersesPageProps) => {
  const params = new URLSearchParams(location.search);
  const { name } = useEmiliaConfig()
  const [colorMode, setColorMode] = useColorMode()
  const isDark = colorMode === `dark`
  const [bibles, books] = [ImportFunctions.allBibles.map(bible=>bible.name),ImportFunctions.allBibleBooks.map(book=>book.Name)];
  const defaultNetwork = params.get("network")?params.get("network")?.toLowerCase():"polygon-mumbai";
  const defaultBible = params.get("bible")?((bibles.map(bible=>bible.toLowerCase()).indexOf(params.get("bible").toLowerCase()) != -1)?bibles[bibles.map(bible=>bible.toLowerCase()).indexOf(params.get("bible").toLowerCase())]:bibles[0]):bibles[0];
  const defaultBook = params.get("book")?((books.map(book=>book.toLowerCase()).indexOf(params.get("book").toLowerCase()) != -1)?books[books.map(book=>book.toLowerCase()).indexOf(params.get("book").toLowerCase())]:books[0]):books[0];
  const defaultChapter = (0 < parseInt(params.get("chapter")) && parseInt(params.get("chapter")) <= ImportFunctions.getNumberOfChaptersInBook(defaultBook))?parseInt(params.get("chapter")):1;
  const defaultVerse = (0 <= parseInt(params.get("verse")) && parseInt(params.get("verse")) <= ImportFunctions.getNumberOfVersesInChapterInBook(defaultChapter,defaultBook))?parseInt(params.get("verse")):0;
  const [stateVerse, setStateVerse] = React.useState({bible: defaultBible, book: defaultBook, chapter: defaultChapter, verse: defaultVerse});

  const toggleColorMode = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setColorMode(isDark ? `light` : `dark`)
  }
  const avatar = useStaticQuery<AvatarStaticQuery>(graphql`
    query {
      file(name: { eq: "avatar" }) {
        childImageSharp {
          gatsbyImageData(layout: FIXED, width: 40, height: 40, quality: 100)
        }
      }
    }
  `)

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
      +"&message="+encodeURIComponent(allowOnlyValidCharacters(e.target.message.value)),
      "method": "POST"
    });
    navigate("/thankyou");
  };
  const handleComboBoxChange = (key, value) =>{
    let tempState = {...stateVerse}
    switch(key){
      case "bible":tempState["book"]=books[0];tempState["chapter"]=1;tempState["verse"]=0;break;
      case "book":tempState["chapter"]=1;tempState["verse"]=0;break;
      case "chapter": tempState["verse"]=0;break;
    }
    tempState[key]=value;
    setStateVerse(tempState);
  }
  return (
    <Flex as="header" variant="layout.header">
      <div style={{ top: "1rem", right: "1rem", position: "absolute", "textAlign": `right`}}><ColorModeToggle isDark={isDark} toggle={toggleColorMode} /></div>
      <Container sx={{ textAlign: `center`, my: 4, zIndex: 10 }}>
        <animated.div style={backButtonProps}>
          <Link
            to="/"
            aria-label={`${name} - Back to homepage`}
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
              {avatar?.file?.childImageSharp?.gatsbyImageData && (
                <GatsbyImage image={avatar.file.childImageSharp.gatsbyImageData} alt="Avatar" />
              )}
            </div>
            <span sx={{ fontWeight: `medium` }}>{name}</span>
          </Link>
        </animated.div>
        <div sx={{textAlign: "center", mt: 4, mb: [6, 6, 7] }}>
          <animated.div style={titleProps}>
            <Heading as="h1" variant="styles.h1">
              Bible Verses
            </Heading>
          </animated.div>
          <animated.div style={infoProps}>
            <Themed.p sx={{ mb: 0, mt: 4 }}>{date}</Themed.p>
<form class="gform" method="POST" data-email="yohann.pereira28@gmail.com" onSubmit={handleSubmit}>
  <div class="container" style={{styles}}>
    <div class="row">
        <h4 style={{"text-align":"center"}}>We'd love to hear from you!</h4>
    </div>
    <div style={{display: "flex", justifyContent: "space-evenly"}}>
      <DropDown list={bibles} placeholder={stateVerse.bible} shouldSortList={true} fieldName={"bible"} onChange={handleComboBoxChange}/>
      <DropDown list={books} placeholder={stateVerse.book} fieldName={"book"} onChange={handleComboBoxChange}/>
      <DropDown list={Array(ImportFunctions.getNumberOfChaptersInBook(stateVerse.book)).fill().map((v,i)=>i+1)} placeholder={stateVerse.chapter} fieldName={"chapter"} onChange={handleComboBoxChange}/>
      <DropDown list={[0].concat(Array(ImportFunctions.getNumberOfVersesInChapterInBook(stateVerse.chapter,stateVerse.book)).fill().map((v,i)=>i+1))} placeholder={stateVerse.verse} fieldName={"verse"} onChange={handleComboBoxChange}/>
    </div>
    {(stateVerse.verse == 0)?
      <VerseEntry verseIdentifier={""+ImportFunctions.getBookNumber(stateVerse.book)+"-"+stateVerse.chapter+"-"+stateVerse.verse+"-"+ImportFunctions.getBibleId(stateVerse.bible)}/>
      :<VerseEntry verseIdentifier="weeee"/>
    }
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
      </Container>
    </Flex>
  )
}

export default VersesPage
