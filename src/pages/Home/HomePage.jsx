import Demo from '../../components/Demo/Demo'
import HomeHero from '../../components/HomeHero/HomeHero'
import LinkedinModal from '../../components/LinkedinModal/LinkedinModal'
import ResumeForm from '../../components/ResumeForm/ResumeForm'
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs'
import './HomePage.css'
import Music from './../../components/Music/Music';
const HomePage = () => {
    return (
        <>


            {/* <HomeHero /> */}
            <div className='row m-0  '>
                <HomeHero />
                {/* <Music /> */}
                {/* <Demo /> */}
                <ResumeForm />
                <WhyChooseUs />

            </div>
            <LinkedinModal />
        </>
    )
}

export default HomePage