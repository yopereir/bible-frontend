/** @jsx jsx */
import * as React from "react"
import { Flex, jsx, Container, Heading, Themed, useColorMode } from "theme-ui"
import { animated, useSpring, config } from "react-spring"
import BackButton from "../components/backbutton"
import ColorModeToggle from "../components/colormode-toggle"
import DropDown from "../components/dropdown"
import VerseEntry from "../components/verse-entry"
import loadingStyle from "../components/css/loading.css"
import * as ImportFunctions from "../../utils/bibleBlockchainInteraction"
import networks from "../../data/blockchain_networks.json"
import { ethers } from "ethers";

type VersesPageProps = {
  title: string
  areas: string[]
  description?: string
  date: string
}

const VersesPage = ({ title, areas, description = ``, date }: VersesPageProps) => {
  const params = new URLSearchParams(location.search);
  const [colorMode, setColorMode] = useColorMode()
  const isDark = colorMode === `dark`
  const [bibles, books] = [ImportFunctions.allBibles.map(bible=>bible.name),ImportFunctions.allBibleBooks.map(book=>book.Name)];
  const validNetworks = networks.map(network=>network.name);
  const defaultNetwork = networks.filter(network=>network.name == (params.get("network")?((validNetworks.map(network=>network.toLowerCase()).indexOf(params.get("network").toLowerCase()) != -1)?validNetworks[validNetworks.map(network=>network.toLowerCase()).indexOf(params.get("network").toLowerCase())]:validNetworks[0]):validNetworks[0]))[0];
  const defaultBible = params.get("bible")?((bibles.map(bible=>bible.toLowerCase()).indexOf(params.get("bible").toLowerCase()) != -1)?bibles[bibles.map(bible=>bible.toLowerCase()).indexOf(params.get("bible").toLowerCase())]:bibles[0]):bibles[0];
  const defaultBook = params.get("book")?((books.map(book=>book.toLowerCase()).indexOf(params.get("book").toLowerCase()) != -1)?books[books.map(book=>book.toLowerCase()).indexOf(params.get("book").toLowerCase())]:books[0]):books[0];
  const defaultChapter = (0 < parseInt(params.get("chapter")) && parseInt(params.get("chapter")) <= ImportFunctions.getNumberOfChaptersInBook(defaultBook))?parseInt(params.get("chapter")):1;
  const defaultVerse = (0 <= parseInt(params.get("verse")) && parseInt(params.get("verse")) <= ImportFunctions.getNumberOfVersesInChapterInBook(defaultChapter,defaultBook))?parseInt(params.get("verse")):0;
  const [stateVerse, setStateVerse] = React.useState({bible: defaultBible, book: defaultBook, chapter: defaultChapter, verse: defaultVerse});

  const [versesState, setVersesState] = React.useState((stateVerse.verse == 0)?Array(ImportFunctions.getNumberOfVersesInChapterInBook(stateVerse.chapter,stateVerse.book)).fill().map((v,i)=>i+1).map(verseNumber=>{return {identifier: ""+ImportFunctions.getBookNumber(stateVerse.book)+"-"+stateVerse.chapter+"-"+verseNumber+"-"+ImportFunctions.getBibleId(stateVerse.bible), blockchainQuery: {}}})
  :[{identifier: ""+ImportFunctions.getBookNumber(stateVerse.book)+"-"+stateVerse.chapter+"-"+stateVerse.verse+"-"+ImportFunctions.getBibleId(stateVerse.bible), blockchainQuery: {}}])

  const [isLoading, setLoadingState] = React.useState(true);

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

  const handleComboBoxChange = (key, value) =>{
    let tempState = {...stateVerse}
    switch(key){
      case "bible":tempState["book"]=books[0];tempState["chapter"]=1;tempState["verse"]=0;break;
      case "book":tempState["chapter"]=1;tempState["verse"]=0;break;
      case "chapter": tempState["verse"]=0;break;
    }
    tempState[key]=value;
    // Refresh page instead of keeping URL different from selection
    window.location.href = window.location.origin+window.location.pathname+"?network="+defaultNetwork.name+"&bible="+tempState["bible"]+"&book="+tempState["book"]+"&chapter="+tempState["chapter"]+"&verse="+tempState["verse"];
    // setStateVerse(tempState);
  }


  React.useEffect(()=>{(async ()=>{
    let provider;
    for (let i = 0; i < defaultNetwork.rpc.length; i++) {
      try {
        (await (new ethers.providers.JsonRpcProvider(defaultNetwork.rpc[i])).detectNetwork());
        provider = new ethers.providers.JsonRpcProvider(defaultNetwork.rpc[i]);
        break;
      } catch {
        
      }
    };
    const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ADMINS","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"BIBLE_VERSES","outputs":[{"internalType":"string","name":"BIBLE_VERSE","type":"string"},{"internalType":"bool","name":"BIBLE_VERSE_LOCKED","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SUPER_ADMIN","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newAdminAddress","type":"address"},{"internalType":"bool","name":"shouldSetAsAdmin","type":"bool"}],"name":"addNewAdmin","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"verseIdentifier","type":"string"},{"internalType":"bool","name":"shouldLockVerse","type":"bool"}],"name":"lockBibleVerse","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"verseIdentifier","type":"string"},{"internalType":"string","name":"verse","type":"string"},{"internalType":"bool","name":"shouldLockVerse","type":"bool"}],"name":"updateBibleVerse","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"nonpayable","type":"function"}]
    const Bible = new ethers.Contract(defaultNetwork.contractAddress, abi, provider);
    setLoadingState(true);
    let res = [{identifier: ""+ImportFunctions.getBookNumber(stateVerse.book)+"-"+stateVerse.chapter+"-"+stateVerse.verse+"-"+ImportFunctions.getBibleId(stateVerse.bible), blockchainQuery: (await Bible.BIBLE_VERSES(""+ImportFunctions.getBookNumber(stateVerse.book)+"-"+stateVerse.chapter+"-"+stateVerse.verse+"-"+ImportFunctions.getBibleId(stateVerse.bible)))}];
    if (stateVerse.verse == 0) {
      let tempArray = Array(ImportFunctions.getNumberOfVersesInChapterInBook(stateVerse.chapter,stateVerse.book)).fill().map((v,i)=>i+1);
      let verseArray = []
      for(let verseNumber of tempArray){
        let tempIdentifier = ""+ImportFunctions.getBookNumber(stateVerse.book)+"-"+stateVerse.chapter+"-"+verseNumber+"-"+ImportFunctions.getBibleId(stateVerse.bible);
        let tempResult = await Bible.BIBLE_VERSES(tempIdentifier);
        verseArray = verseArray.concat([{identifier: tempIdentifier, blockchainQuery: tempResult}]);
      }
      res = verseArray;
    }
    else {
      let tempIdentifier = ""+ImportFunctions.getBookNumber(stateVerse.book)+"-"+stateVerse.chapter+"-"+stateVerse.verse+"-"+ImportFunctions.getBibleId(stateVerse.bible)
      let tempResult = await Bible.BIBLE_VERSES(tempIdentifier)
      res = [{identifier: tempIdentifier, blockchainQuery: tempResult}]}
    setVersesState(res);
    setLoadingState(false);
  })()},[stateVerse]);
  return (
    <Flex as="header" variant="layout.header">
      <div style={{ top: "1rem", right: "1rem", position: "absolute", "textAlign": `right`}}><ColorModeToggle isDark={isDark} toggle={toggleColorMode} /></div>
      <Container sx={{ textAlign: `center`, my: 4, zIndex: 10 }}>
        <animated.div style={backButtonProps}>
          <BackButton backButtonText = {"Homepage"} link = {"/"}/>
        </animated.div>
        <div sx={{textAlign: "center", mt: 4, mb: [6, 6, 7] }}>
          <animated.div style={titleProps}>
            <Heading as="h1" variant="styles.h1">
              {defaultNetwork.displayName}
            </Heading>
          </animated.div>
          <animated.div style={infoProps}>
            <Themed.p sx={{ mb: 0, mt: 4 }}>{date}</Themed.p>
                  <div className="row">
                      <h4 style={{textAlign:"center"}}>Track all the bible verses that are deployed!</h4>
                  </div>
                  {(!isLoading)?
                  <React.Fragment>
                    <div style={{display: "flex", justifyContent: "space-evenly"}}>
                      <DropDown list={bibles} placeholder={stateVerse.bible} shouldSortList={true} fieldName={"bible"} onChange={handleComboBoxChange}/>
                      <DropDown list={books} placeholder={stateVerse.book} fieldName={"book"} onChange={handleComboBoxChange}/>
                      <DropDown list={Array(ImportFunctions.getNumberOfChaptersInBook(stateVerse.book)).fill().map((v,i)=>i+1+"")} placeholder={stateVerse.chapter+""} fieldName={"chapter"} onChange={handleComboBoxChange}/>
                      <DropDown list={[0+""].concat(Array(ImportFunctions.getNumberOfVersesInChapterInBook(stateVerse.chapter,stateVerse.book)).fill().map((v,i)=>i+1+""))} placeholder={stateVerse.verse+""} fieldName={"verse"} onChange={handleComboBoxChange}/>
                    </div>
                    <VerseEntry verses={versesState} blockchainNetwork={defaultNetwork}/>
                  </React.Fragment>
                  :<Themed.div className="loading" style={loadingStyle}>Loading {stateVerse.book} {stateVerse.chapter}{(stateVerse.verse>0)?":"+stateVerse.verse:""}</Themed.div>}
          </animated.div>
        </div>
      </Container>
    </Flex>
  )
}

export default VersesPage
