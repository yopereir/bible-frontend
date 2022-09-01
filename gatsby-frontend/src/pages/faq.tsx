/** @jsx jsx */
import { jsx } from "theme-ui"
import Layout from "../components/layout"
import FAQ from '../components/faq'
const faqQuestions = [
  {question: "What is blockchain", answer: "Google it"},
  {question: "Will this project be useful", answer: "God knows"},
  {question: "Will this project be useful", answer: "God knows"},
  {question: "Will this project be useful", answer: "God knows"},
  {question: "Will this project be useful", answer: "God knows"},
  {question: "Will this project be useful", answer: "God knows"},
  {question: "Will this project be useful", answer: "God knows"},
  {question: "Will this project be useful", answer: "God knows"},
]

const FAQPage = () => {
  return (
  <Layout>
    <FAQ Questions={faqQuestions}/>
  </Layout>
  )
}

export default FAQPage
