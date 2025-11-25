import HomeHero from '../../components/HomeHero/HomeHero'
import LinkedinModal from '../../components/LinkedinModal/LinkedinModal'
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs'
import './HomePage.css'
const HomePage = () => {

    return (
        <>



            <div className='row m-0  '>
                <HomeHero />

                <WhyChooseUs />
            </div>
            <LinkedinModal />
        </>
    )
}

export default HomePage