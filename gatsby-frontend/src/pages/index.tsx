/** @jsx jsx */
import { Themed, jsx, Flex } from "theme-ui"
import Layout from "../components/layout"
import networks from "../../data/blockchain_networks.json"

const FAQPage = () => {
  const handleButtonClick = (value) => {
    const pathName = "/verses"
    window.location.href = window.location.origin+pathName+"?network="+value
  }

  return (
    <Layout showHeader={false}>
      <div className="container">
          <section>
              <Themed.h1 style={{width: "80%", margin: "auto"}}>Blockchain Networks</Themed.h1>
          </section>
          <Flex style={{alignItems: "center", minHeight: "35vh", flexDirection: "column", justifyContent: "space-around"}}>
            {networks.map((network)=>
            <button value={network.displayName} style={{ maxWidth:"25vw"}} class="btn-lrg submit-btn" onClick={(e)=>handleButtonClick(network.name)}>{network.displayName}</button>
            )}
          </Flex>
      </div>
    </Layout>
  )
}

export default FAQPage
