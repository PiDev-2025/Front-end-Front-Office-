import React, { useState } from 'react'
import { Fragment } from 'react'
import HeadTitle from '../Components/Pages/HeadTitle'
import { Container, Form } from 'react-bootstrap'
import { SearchIcon } from '../Components/Icon/Icon'

const Faq = () => {

  const dataAccordion = [
    {
      title: "Will someone assist me if I need help?",
      desc: "Conducting market research is crucial to understand the demand for your product or service in the target market. Identify the target audience, evaluate the competition, and assess the overall market conditions.",
      category: "Booking"
    },
    {
      title: "Can I rent a car without a credit card?",
      desc: "Conducting market research is crucial to understand the demand for your product or service in the target market. Identify the target audience, evaluate the competition, and assess the overall market conditions.",
      category: "Car"
    },
    {
      title: "What types of insurance do car rental companies offer?",
      desc: "Conducting market research is crucial to understand the demand for your product or service in the target market. Identify the target audience, evaluate the competition, and assess the overall market conditions.",
      category: "Driving"
    },
    {
      title: "Can I modify or cancel my car rental reservation?",
      desc: "Conducting market research is crucial to understand the demand for your product or service in the target market. Identify the target audience, evaluate the competition, and assess the overall market conditions.",
      category: "Charging"
    },
    {
      title: "Are there any restrictions on where I can take the rental car?",
      desc: "Conducting market research is crucial to understand the demand for your product or service in the target market. Identify the target audience, evaluate the competition, and assess the overall market conditions.",
      category: "Booking"
    },
    {
      title: "What happens if I return the rental car late?",
      desc: "Conducting market research is crucial to understand the demand for your product or service in the target market. Identify the target audience, evaluate the competition, and assess the overall market conditions.",
      category: "Car"
    },
    {
      title: "How do I refuel the rental car before returning it?",
      desc: "Conducting market research is crucial to understand the demand for your product or service in the target market. Identify the target audience, evaluate the competition, and assess the overall market conditions.",
      category: "Driving"
    },
    {
      title: "Can I rent a car with a foreign driver's license?",
      desc: "Conducting market research is crucial to understand the demand for your product or service in the target market. Identify the target audience, evaluate the competition, and assess the overall market conditions.",
      category: "Charging"
    },
    {
      title: "What documents do I need to rent a car?",
      desc: "Conducting market research is crucial to understand the demand for your product or service in the target market. Identify the target audience, evaluate the competition, and assess the overall market conditions.",
      category: "Booking"
    },
    {
      title: "Can I add an additional driver to the rental agreement?",
      desc: "Conducting market research is crucial to understand the demand for your product or service in the target market. Identify the target audience, evaluate the competition, and assess the overall market conditions.",
      category: "Car"
    },
    {
      title: "Can I rent a car one-way and drop it off at a different location?",
      desc: "Conducting market research is crucial to understand the demand for your product or service in the target market. Identify the target audience, evaluate the competition, and assess the overall market conditions.",
      category: "Driving"
    },
    {
      title: "What should I do if the rental car breaks down or has issues during the rental period?",
      desc: "Conducting market research is crucial to understand the demand for your product or service in the target market. Identify the target audience, evaluate the competition, and assess the overall market conditions.",
      category: "Charging"
    },
    {
      title: "Can I request specific car features or models when renting a car?",
      desc: "Conducting market research is crucial to understand the demand for your product or service in the target market. Identify the target audience, evaluate the competition, and assess the overall market conditions.",
      category: "Booking"
    },
    {
      title: "Are there mileage restrictions on rental cars?",
      desc: "Conducting market research is crucial to understand the demand for your product or service in the target market. Identify the target audience, evaluate the competition, and assess the overall market conditions.",
      category: "Car"
    },
    {
      title: "Can I extend my rental period after picking up the car?",
      desc: "Conducting market research is crucial to understand the demand for your product or service in the target market. Identify the target audience, evaluate the competition, and assess the overall market conditions.",
      category: "Driving"
    },
    {
      title: "What happens if the rental car gets damaged during my rental period?",
      desc: "Conducting market research is crucial to understand the demand for your product or service in the target market. Identify the target audience, evaluate the competition, and assess the overall market conditions.",
      category: "Charging"
    },

  ]

  const [ToogleTab, setToogleTab] = useState("All")
  const [Search, setSearch] = useState("")
  const [ToogleAccordion, setToogleAccordion] = useState("Will someone assist me if I need help?")

  const toogleAccFun = (e) => {
    if (ToogleAccordion == e) {
      setToogleAccordion("")
    } else {
      setToogleAccordion(e)
    }
  }

  const showData = () => {

    const filter = ToogleTab.toLocaleLowerCase() == "all" ? "" : ToogleTab.toLocaleLowerCase()

    if (ToogleTab.toLocaleLowerCase() == "all" && Search == "") {
      return dataAccordion
    }

    if (Search && ToogleTab.toLocaleLowerCase() != "all") {
      const data = dataAccordion.filter(item => item.title.toLocaleLowerCase().startsWith(Search.toLocaleLowerCase()) && item.category.toLocaleLowerCase() == filter)
      return data
    }

    if (Search != "") {
      const data = dataAccordion.filter(item => item.title.toLocaleLowerCase().startsWith(Search.toLocaleLowerCase()))
      return data
    }

    if (ToogleTab != "All") {
      const data = dataAccordion.filter(item => item.category.toLocaleLowerCase() == filter)
      return data
    }

    return dataAccordion
  }

  const AccordionWrap = (e) => {
    return <Fragment>
      <div className="w-full p-4 !pb-0 border border-solid border-[#E5E5E5]">
        <div onClick={() => toogleAccFun(e.title)} className="flex items-center justify-between cursor-pointer gap-2 pb-4">
          <h5 className='font-bold text__18'>{e.title}</h5>
          <div className={"arrowPlus relative w-[24px] h-[24px] " + (ToogleAccordion == e.title ? "active" : "")}>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className={"pb-4 w-full " + (ToogleAccordion == e.title ? "" : "hidden")}>
          <p className='text__18'>{e.desc}</p>
        </div>
      </div>
    </Fragment>
  }


  return (
    <Fragment>
      <HeadTitle title={"How much time between <br /> plane & car?"} sub={"FAQ"} />
      <section>
        <Container>

          <div className="flex flex-wrap lg:!flex-nowrap items-center justify-between mb-6 gap-y-4">

            <div className="flex items-center gap-3 w-full sm:w-auto text-center">
              <div onClick={() => setToogleTab("All")} className={'font-medium text__16 w-full sm:px-3 py-2 cursor-pointer ' + (ToogleTab == "All" ? "text-Mblue border-b border-solid border-Mblue" : "text-[#737373]")}>All</div>
              <div onClick={() => setToogleTab("Booking")} className={'font-medium text__16 w-full sm:px-3 py-2 cursor-pointer ' + (ToogleTab == "Booking" ? "text-Mblue border-b border-solid border-Mblue" : "text-[#737373]")}>Booking</div>
              <div onClick={() => setToogleTab("Car")} className={'font-medium text__16 w-full sm:px-3 py-2 cursor-pointer ' + (ToogleTab == "Car" ? "text-Mblue border-b border-solid border-Mblue" : "text-[#737373]")}>Car</div>
              <div onClick={() => setToogleTab("Driving")} className={'font-medium text__16 w-full sm:px-3 py-2 cursor-pointer ' + (ToogleTab == "Driving" ? "text-Mblue border-b border-solid border-Mblue" : "text-[#737373]")}>Driving</div>
              <div onClick={() => setToogleTab("Charging")} className={'font-medium text__16 w-full sm:px-3 py-2 cursor-pointer ' + (ToogleTab == "Charging" ? "text-Mblue border-b border-solid border-Mblue" : "text-[#737373]")}>Charging</div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <Form.Group className='mb-0 w-full'>
                <div className="flex items-center gap-2 bg-[#FAFAFA] border border-solid border-[#FAFAFA] px-3 rounded-[24px] w-full">
                  <SearchIcon width={20} height={20} color='#171717' />
                  <Form.Control onChange={(e) => setSearch(e.target.value)} value={Search} type="text" className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mblack placeholder-[#A3A3A3] h-[54px] px-0 w-full lg:w-auto sm:min-w-[300px]' placeholder="Search..." />
                </div>
              </Form.Group>
              <div className="w-[56px] h-[56px] bg-Mblue rounded-full flex items-center justify-center flex-shrink-0">
                <SearchIcon width={24} height={24} color='white' />
              </div>
            </div>

          </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-1 gap-4">

            <div className="flex flex-wrap gap-4">
              {
                showData().map((obj, i) => {
                  let half = showData().length / 2;

                  if (i < half) {
                    return (
                      AccordionWrap(obj)
                    )
                  }
                })
              }
            </div>
            <div className="flex flex-wrap gap-4">
              {
                showData().map((obj, i) => {
                  let half = showData().length / 2;

                  if (i >= half) {
                    return (
                      AccordionWrap(obj)
                    )
                  }
                })
              }
            </div>

          </div>

        </Container>
      </section>
    </Fragment>
  )
}

export default Faq
