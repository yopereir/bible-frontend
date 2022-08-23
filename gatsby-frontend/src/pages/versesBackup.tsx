/** @jsx jsx */
import * as React from "react"
import { Flex, jsx, Container, Heading, Themed, useColorMode } from "theme-ui"
import { animated, useSpring, config } from "react-spring"
import { useStaticQuery, graphql, Link, navigate } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import LeftArrow from "../assets/left-arrow"
import useEmiliaConfig from "../hooks/use-emilia-config"
import ColorModeToggle from "../components/colormode-toggle"
import DropDown from "../components/dropdown"
import VerseEntry from "../components/verse-entry"
import * as ImportFunctions from "../../utils/bibleBlockchainInteraction"
import { ethers } from "ethers";

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
async function getVerseStatus(network = "ethereum-goerli", verseIdentifiers = [{identifier: "1-1-1-0", isDeployed: false, isLocked: false}], setVersesState) {
  //const provider = new ethers.providers.Web3Provider(window.ethereum)
  //const provider = new ethers.providers.EtherscanProvider(ethers.providers.getNetwork("goerli"));
  //const provider = new ethers.providers.AlchemyProvider("maticmum", "APP_KEY");
  //const signer = new ethers.Wallet("WALLET_PRIVATE_KEY", provider);
  //const abi = ['function BIBLE_VERSES(string verseIdentifier) public view returns (tuple(string BIBLE_VERSE, bool BIBLE_VERSE_LOCKED) BibleVerse)'];
  //await provider.send("eth_requestAccounts", []); // connect to signer account. used only for write operations or sending ETH
  //console.log((await provider.getBalance("ethers.eth")).toString());
  //await (await provider.sendTransaction(tx)).wait();
  const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
  const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ADMINS","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"BIBLE_VERSES","outputs":[{"internalType":"string","name":"BIBLE_VERSE","type":"string"},{"internalType":"bool","name":"BIBLE_VERSE_LOCKED","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SUPER_ADMIN","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newAdminAddress","type":"address"},{"internalType":"bool","name":"shouldSetAsAdmin","type":"bool"}],"name":"addNewAdmin","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"verseIdentifier","type":"string"},{"internalType":"bool","name":"shouldLockVerse","type":"bool"}],"name":"lockBibleVerse","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"verseIdentifier","type":"string"},{"internalType":"string","name":"verse","type":"string"},{"internalType":"bool","name":"shouldLockVerse","type":"bool"}],"name":"updateBibleVerse","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"nonpayable","type":"function"}]
  const Bible = new ethers.Contract("0xfded1e73b71c1cc2f177789bcc0db3fa55912eda", abi, provider); // use signer instead of provider for write/sending ETH transactions
  setVersesState(verseIdentifiers.map(async verseIdentifier=>{let result = (await Bible.BIBLE_VERSES(verseIdentifier.identifier)).BIBLE_VERSE_LOCKED;return {identifier: verseIdentifier.identifier, isDeployed: result, isLocked: result}}));
}

const VersesPage = ({ title, areas, description = ``, date }: VersesPageProps) => {
  const params = new URLSearchParams(location.search);
  const { name } = useEmiliaConfig()
  const [colorMode, setColorMode] = useColorMode()
  const isDark = colorMode === `dark`
  const [bibles, books] = [ImportFunctions.allBibles.map(bible=>bible.name),ImportFunctions.allBibleBooks.map(book=>book.Name)];
  const validNetworks = ["polygon-mumbai", "ethereum-mainnet", "ethereum-goerli"];
  const defaultNetwork = params.get("network")?((validNetworks.map(network=>network.toLowerCase()).indexOf(params.get("network").toLowerCase()) != -1)?validNetworks[validNetworks.map(network=>network.toLowerCase()).indexOf(params.get("network").toLowerCase())]:validNetworks[0]):validNetworks[0];
  const defaultBible = params.get("bible")?((bibles.map(bible=>bible.toLowerCase()).indexOf(params.get("bible").toLowerCase()) != -1)?bibles[bibles.map(bible=>bible.toLowerCase()).indexOf(params.get("bible").toLowerCase())]:bibles[0]):bibles[0];
  const defaultBook = params.get("book")?((books.map(book=>book.toLowerCase()).indexOf(params.get("book").toLowerCase()) != -1)?books[books.map(book=>book.toLowerCase()).indexOf(params.get("book").toLowerCase())]:books[0]):books[0];
  const defaultChapter = (0 < parseInt(params.get("chapter")) && parseInt(params.get("chapter")) <= ImportFunctions.getNumberOfChaptersInBook(defaultBook))?parseInt(params.get("chapter")):1;
  const defaultVerse = (0 <= parseInt(params.get("verse")) && parseInt(params.get("verse")) <= ImportFunctions.getNumberOfVersesInChapterInBook(defaultChapter,defaultBook))?parseInt(params.get("verse")):0;
  const [stateVerse, setStateVerse] = React.useState({bible: defaultBible, book: defaultBook, chapter: defaultChapter, verse: defaultVerse});

  const [versesState, setVersesState] = React.useState((stateVerse.verse == 0)?Array(ImportFunctions.getNumberOfVersesInChapterInBook(stateVerse.chapter,stateVerse.book)).fill().map((v,i)=>i+1).map(verseNumber=>{return {identifier: ""+ImportFunctions.getBookNumber(stateVerse.book)+"-"+stateVerse.chapter+"-"+verseNumber+"-"+ImportFunctions.getBibleId(stateVerse.bible), isDeployed: false, isLocked: false}})
  :[{identifier: ""+ImportFunctions.getBookNumber(stateVerse.book)+"-"+stateVerse.chapter+"-"+stateVerse.verse+"-"+ImportFunctions.getBibleId(stateVerse.bible), isDeployed: false, isLocked: false}])

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

  const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
  const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ADMINS","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"BIBLE_VERSES","outputs":[{"internalType":"string","name":"BIBLE_VERSE","type":"string"},{"internalType":"bool","name":"BIBLE_VERSE_LOCKED","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SUPER_ADMIN","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newAdminAddress","type":"address"},{"internalType":"bool","name":"shouldSetAsAdmin","type":"bool"}],"name":"addNewAdmin","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"verseIdentifier","type":"string"},{"internalType":"bool","name":"shouldLockVerse","type":"bool"}],"name":"lockBibleVerse","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"verseIdentifier","type":"string"},{"internalType":"string","name":"verse","type":"string"},{"internalType":"bool","name":"shouldLockVerse","type":"bool"}],"name":"updateBibleVerse","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"nonpayable","type":"function"}]
  const Bible = new ethers.Contract("0xfded1e73b71c1cc2f177789bcc0db3fa55912eda", abi, provider);
  React.useEffect(()=>{(async ()=>{
    let res = (stateVerse.verse == 0)
    ?Array(ImportFunctions.getNumberOfVersesInChapterInBook(stateVerse.chapter,stateVerse.book)).fill().map((v,i)=>i+1).map(verseNumber=>{let result = (async()=>(await Bible.BIBLE_VERSES(""+ImportFunctions.getBookNumber(stateVerse.book)+"-"+stateVerse.chapter+"-"+verseNumber+"-"+ImportFunctions.getBibleId(stateVerse.bible))).BIBLE_VERSE_LOCKED)();return {identifier: ""+ImportFunctions.getBookNumber(stateVerse.book)+"-"+stateVerse.chapter+"-"+verseNumber+"-"+ImportFunctions.getBibleId(stateVerse.bible), isDeployed: result, isLocked: result}})
    :[{identifier: ""+ImportFunctions.getBookNumber(stateVerse.book)+"-"+stateVerse.chapter+"-"+stateVerse.verse+"-"+ImportFunctions.getBibleId(stateVerse.bible), isDeployed: (await Bible.BIBLE_VERSES(""+ImportFunctions.getBookNumber(stateVerse.book)+"-"+stateVerse.chapter+"-"+stateVerse.verse+"-"+ImportFunctions.getBibleId(stateVerse.bible))).BIBLE_VERSE_LOCKED, isLocked: (await Bible.BIBLE_VERSES(""+ImportFunctions.getBookNumber(stateVerse.book)+"-"+stateVerse.chapter+"-"+stateVerse.verse+"-"+ImportFunctions.getBibleId(stateVerse.bible))).BIBLE_VERSE_LOCKED}]
    setVersesState(res)
    console.log(versesState);
  })()},[stateVerse]);
  
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
              {defaultNetwork}
            </Heading>
          </animated.div>
          <animated.div style={infoProps}>
            <Themed.p sx={{ mb: 0, mt: 4 }}>{date}</Themed.p>
                  <div className="row">
                      <h4 style={{textAlign:"center"}}>Track all the bible verses that are deployed!</h4>
                  </div>
                  <div style={{display: "flex", justifyContent: "space-evenly"}}>
                    <DropDown list={bibles} placeholder={stateVerse.bible} shouldSortList={true} fieldName={"bible"} onChange={handleComboBoxChange}/>
                    <DropDown list={books} placeholder={stateVerse.book} fieldName={"book"} onChange={handleComboBoxChange}/>
                    <DropDown list={Array(ImportFunctions.getNumberOfChaptersInBook(stateVerse.book)).fill().map((v,i)=>i+1+"")} placeholder={stateVerse.chapter+""} fieldName={"chapter"} onChange={handleComboBoxChange}/>
                    <DropDown list={[0+""].concat(Array(ImportFunctions.getNumberOfVersesInChapterInBook(stateVerse.chapter,stateVerse.book)).fill().map((v,i)=>i+1+""))} placeholder={stateVerse.verse+""} fieldName={"verse"} onChange={handleComboBoxChange}/>
                  </div>
                  <VerseEntry verses={versesState}/>
          </animated.div>
        </div>
      </Container>
    </Flex>
  )
}

export default VersesPage
