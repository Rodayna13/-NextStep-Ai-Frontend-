import HomeHero from '../../components/HomeHero/HomeHero.JSX'
import LinkedinModal from '../../components/LinkedinModal/LinkedinModal'
import ResumeForm from '../../components/ResumeForm/ResumeForm'
import './HomePage.css'
const HomePage = () => {
    return (
        <>
         

            {/* <HomeHero /> */}
            <div className='row m-0  '>
                <HomeHero />
                <ResumeForm />
             

            </div>
            <LinkedinModal />
        </>
    )
}

export default HomePage