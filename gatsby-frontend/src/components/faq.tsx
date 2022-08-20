/** @jsx jsx */
import * as React from "react"
import { jsx, Themed } from "theme-ui"
import $ from 'jquery'

type FAQProps = {
  Questions?: {
    question: string,
    answer: string,
  }[]
}

/*
if( $(".toggle .toggle-title").hasClass('active') ){
    $(".toggle .toggle-title.active").closest('.toggle').find('.toggle-inner').show();
}
$(".toggle .toggle-title").click(function(){
    console.log("2");
    if( $(this).hasClass('active') ){
        $(this).removeClass("active").closest('.toggle').find('.toggle-inner').slideUp(200);
    }
    else{	$(this).addClass("active").closest('.toggle').find('.toggle-inner').slideDown(200);
    }
});
*/
const FAQ = ({Questions = [{question: "Question 1", answer: "Answer 1"}]}: FAQProps) => {
    React.useEffect(()=>{
        // start with all questions folded
        $(".toggle .toggle-title").removeClass("active").closest('.toggle').find('.toggle-inner').slideUp(200);
        $(".toggle .toggle-title").click(function(){
            if( $(this).hasClass('active') ){
                $(this).removeClass("active").closest('.toggle').find('.toggle-inner').slideUp(200);
            }
            else{	$(this).addClass("active").closest('.toggle').find('.toggle-inner').slideDown(200);
            }
        });
    },[])
  return (
    <React.Fragment>
        <div className="container"> 
            <section>
                <h1>FREQUENTLY ASKED QUESTION<span>S</span></h1>
            </section>
            {Questions.map((question)=>
                <div className="toggle">
                    <div className="toggle-title ">
                        <h3><i></i>
                            <span className="title-name">{question.question}</span>
                        </h3>
                    </div>
                    <div className="toggle-inner">
                        <p>{question.answer}</p>
                    </div>
                </div>
            )}
        </div>
    </React.Fragment>
  )
}

export default FAQ
