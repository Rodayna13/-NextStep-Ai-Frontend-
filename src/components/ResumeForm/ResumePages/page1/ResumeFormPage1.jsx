import { useFormContext } from 'react-hook-form'
import FormInput from '../../../shared/FormInput/FormInput'
import FormTextarea from '../../../shared/FormInput/FormTextarea'

const ResumeFormPage1 = ({ isVisible }) => {
    const { register } = useFormContext();
    return (
        <div className={`resume-form-page ${isVisible ? 'visible' : 'hidden'}`} >
            <h2 className='resume-form-page-title'>Personal Information</h2>


            <FormInput
                label="Full Name"
                name="fullName"
                placeholder="e.g. John Doe"
                register={register}
                autoComplete={true}
                autoCompleteSortBy='name'
                rules={{ required: 'Full name is required' }}

            />

            <FormInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="e.g. john.doe@example.com"
                register={register}
                rules={{
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
                }}
            />

            <FormInput
                label="Phone Number"
                name="mobileNumber"
                placeholder="e.g. San Francisco, CA"
                register={register}
            />


            <FormInput
                label="Location"
                name="location"
                placeholder="e.g. San Francisco, CA"
                register={register}
                autoComplete={true}
                autoCompleteSortBy='city'
            />



            <FormInput
                label="About / Summary"
                type="textarea"
                name="about"
                rows={6}
                placeholder="Briefly describe your professional background..."
                register={register}
                rules={{ maxLength: { value: 1000, message: 'Maximum 1000 characters' } }}
            />
        </div>
    )
}

export default ResumeFormPage1