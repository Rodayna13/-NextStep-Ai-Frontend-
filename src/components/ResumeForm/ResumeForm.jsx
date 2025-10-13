import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useSelector } from 'react-redux';
import ResumePreview from '../ResumePreview/ResumePreview';
import { parseStartEndDate } from './../../utils/startDateEndDate';
import ResumePages from './ResumePages';
import "./style.css";
import { useSelectedResumeOption } from '../../hooks/useSelectedResumeOption';

const ResumeForm = () => {

    const profile = useSelector(state => state.linkedin.profile);
    const { hasSelectedOption } = useSelectedResumeOption();
    const [colWidth, setColWidth] = useState('col-6')

    const methods = useForm({
        defaultValues: {
            fullName: "",
            email: "",
            headline: "",
            phone: "",
            location: "",
            about: "",
            profilePic: "",
            educations: [
                {
                    logo: "",
                    title: "",
                    caption: "",
                    startDate: "",
                    endDate: "",
                }
            ],
            experiences: [
                {
                    logo: "",
                    title: "",
                    caption: "",
                    company: "",
                    subComponents: [
                        { title: "", startDate: "", endDate: "", description: "" }
                    ]

                }
            ]
        }
    })

    const { reset } = methods;

    useEffect(() => {
        if (profile) {

            const formData = {
                fullName: profile.fullName || '',
                email: profile.email || profile.linkedinUrl || '',
                about: profile.about || '',
                location: profile.addressWithCountry || '',
                jobTitle: profile.jobTitle || '',
                summary: profile.summary || '',
                mobileNumber: profile.mobileNumber || '',
                profilePic: profile.profilePic || '',
                educations: profile.educations?.map(edu => ({
                    ...edu,
                    startDate: parseStartEndDate(edu.caption).startDate,
                    endDate: parseStartEndDate(edu.caption).endDate
                })) || [],
                experiences: profile.experiences?.map(exp => ({
                    ...exp,
                    company: exp.subComponents?.[0].title ? exp.title : null,
                    subComponents: exp.subComponents?.map((pos, idx) => ({
                        ...pos,
                        logo: idx === 0 ? exp.logo : pos.logo,
                        title: idx === 0 && pos.title ? pos.title : exp.title,
                        startDate: parseStartEndDate(pos.caption).startDate || parseStartEndDate(exp.caption).startDate,
                        endDate: parseStartEndDate(pos.caption).endDate || parseStartEndDate(exp.caption).endDate
                    }))
                })) || []
            };

            reset(formData);
        }
    }, [profile, reset])


    if (!hasSelectedOption) return null;
    return (
        <FormProvider {...methods} >
            <div className='m-2 row'>

                <div className={colWidth == 'col-6' ? 'col-6' : 'col-8 mx-auto'} style={{ minHeight: '70vh' }}>
                    <ResumePages />
                </div>


                <ResumePreview colWidth={colWidth} setColWidth={setColWidth} />
            </div>

        </FormProvider>
    )
}

export default ResumeForm


