import { supabase } from '../utils/supabase-client'
import React, { useEffect } from 'react'
import { PlusCircleIcon, RefreshIcon } from '@heroicons/react/solid'
import { useState, Fragment } from 'react'
import { useUser } from '../utils/useUser'
import { Dialog, Transition, RadioGroup } from '@headlessui/react'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';

// Random danger btn <button className="ml-3 py-1 px-3 text-sm border border-red text-red rounded-md hover:bg-red hover:text-white focus:bg-red focus:text-white focus:outline-none focus:ring-0 transition-all ease-in-out">Cancel project</button>

let Ads
let Uid

async function main() {
    let { data: ads, error } = await supabase
        .from('ads')
        .select('*')
        .eq('owner', Uid)
        .then(Ads)

    if (error) {
        console.log(error)
        return
    }

    Ads = ads
    console.log(ads)
    console.log(Uid)
}

main()

function AdsList(props) {
    const { user, session } = useUser()

    Uid = user

    return (
        props.adsList?.map((adsList) =>
            <div key={adsList.id} className="bg-base rounded-md border border-accents-0 mb-4">
                <div className="p-4">
                    <div className="flex flex-row justify-between mb-2">
                        <h3 className="text-xl font-semibold mb-1">Large ad</h3>
                        <div className="flex flex-row">
                            <div className="bg-green h-3 w-3 rounded-full my-auto"></div>
                            <span className="ml-2 text-accents-7 my-auto font-semibold text-sm">Published</span>
                        </div>
                    </div>
                    <p className="text-accents-5">{adsList.title} • {adsList.description}</p>
                </div>
            </div>
        )
    )
}

export default function Profile() {
    // Here to trigger rerenders
    const [random, setRandom] = useState(Math.random());

    const reRender = () => setRandom(Math.random());

    const { user, session } = useUser()

    Uid = user

    async function main() {
        let { data: ads, error } = await supabase
            .from('ads')
            .select('*')
            .eq('owner', user?.id)
            .then(Ads)

        if (error) {
            console.log(error)
            return
        }

        Ads = ads
        console.log(ads)
        console.log(Uid)
    }

    async function create() {

    }

    main()

    return (
        <div style={{ maxWidth: '520px', paddingTop: '9rem', margin: '0 auto 25px' }}>
            <div className="w-full flex flex-row justify-between">
                <h1 className="font-semibold text-4xl">Dashboard</h1>
                <div className="flex flex-row gap-2">
                    <RefreshIcon className="opacity-50 h-5 w-5 my-auto cursor-pointer" onClick={reRender} />
                    <AddModal user={user} />
                </div>
            </div>
            <hr className="border-t border-accents-2 my-4" />
            {Ads ? <>
                <div className="max-w-xl mb-4 mt-8">
                <div className="sm:grid sm:h-32 sm:grid-flow-row sm:gap-4 sm:grid-cols-3">
                    <div className="flex flex-col justify-center px-4 py-4 rounded border border-accents-0">
                        <div>
                            <p className="text-3xl font-semibold text-center text-accents-7">43</p>
                            <p className="text-lg text-center text-gray-500">Total views</p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center px-4 py-4 mt-4 rounded border border-accents-0 sm:mt-0">
                        <div>
                            <p className="text-3xl font-semibold text-center text-gray-accents-7">43</p>
                            <p className="text-lg text-center text-gray-500">Total clicks</p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center px-4 py-4 mt-4 rounded border border-accents-0 sm:mt-0">
                        <div>
                            <p className="text-3xl font-semibold text-center text-accents-7">43</p>
                            <p className="text-lg text-center text-gray-500">Total ads</p>
                        </div>
                    </div>
                </div>
            </div>
            <AdsList adsList={Ads} />
            </> : <div className="w-full h-full flex flex-col gap-4 opacity-90">
                <svg className="h-10 w-10 mx-auto mt-8 opacity-75" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <h1 className="text-2xl text-center">Welcome</h1>
                <p className="-mt-1 opacity-50 text-center">Get started by loading up your ads</p>
                <button onClick={reRender} className="mx-auto py-1 px-3 text-sm border border-accents-6 text-white rounded-md hover:bg-white hover:text-black focus:bg-white focus:text-black focus:outline-none focus:ring-0 transition-all ease-in-out">Load ads</button>
            </div>}
        </div>
    )
}

export function AddModal({ user }) {
    const router = useRouter()
    const { session, userLoaded, subscription } = useUser();
    const handleCheckout = async (price) => {
    
        try {
          const { sessionId } = await postData({
            url: '/api/create-checkout-session',
            data: { price },
            token: session.access_token
          });
    
          const stripe = await getStripe();
          stripe.redirectToCheckout({ sessionId });
        } catch (error) {
          return alert(error.message);
        } finally {}
      };

    let [isOpen, setIsOpen] = useState(false)
    let [plan, setPlan] = useState('price_1ISq7nBs47PjhYlFIZZYinPn')
    // Steps
    let [stepOne, setStepOne] = useState(true)
    let [stepTwo, setStepTwo] = useState(false)
    // Forms
    let [nameField, setNameField] = useState('')
    let [descriptionField, setDescriptionField] = useState('')

    function next1() {
        setStepOne(false)
        setStepTwo(true)
    }

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    async function submitData() {
        handleCheckout(plan)
        setIsOpen(false)
    }

    return (
        <>
            <PlusCircleIcon onClick={openModal} className="opacity-50 h-5 w-5 my-auto cursor-pointer" />

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    open={isOpen}
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={closeModal}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
              </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <Dialog.Title
                                    as="h3"
                                    className="text-xl font-medium leading-6 text-gray-900"
                                >
                                    Create a ad
                  </Dialog.Title>
                                {stepOne ? <>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Tell us about your brand
                    </p>
                                    </div>

                                    <form className="mt-6 flex flex-col" onSubmit={next1}>
                                        <input onChange={event => setNameField(event.target.value)} type="text" name="Name" id="NameField" placeholder="What is your brands name?" className="rounded border border-accents-6 py-1 px-3 text-black mb-2 w-2/3" required />
                                        <textarea onChange={event => setDescriptionField(event.target.value)} name="Description" id="DescriptionField" placeholder="What's your brand about?" className="rounded border border-accents-6 py-1 px-3 text-black mb-2 w-2/3" required />

                                        <p className="text-sm text-gray-500">Your answers will be visible to your customers • Your ad's appearance and style may vary accross sites</p>

                                        <div className="mt-4">
                                            <button
                                                type="submit"
                                                className="mx-auto py-1 px-3 text-sm border border-accents-6 text-black rounded-md hover:bg-white hover:text-black focus:bg-white focus:text-black focus:outline-none focus:ring-0 transition-all ease-in-out"
                                            >
                                                Continue to pricing
                    </button>
                                        </div>
                                    </form>

                                </> : null}
                                {stepTwo ? <>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Choose your plan
                    </p>
                                    </div>
                                    <RadioGroup value={plan} onChange={setPlan} className="mt-6 flex flex-col">
                                        <RadioGroup.Option value='price_1ISq7nBs47PjhYlFIZZYinPn' className={({ checked }) => `${checked ? 'bg-pink font-semibold rounded-lg shadow-sm divide-y divide-accents-2 p-4 mb-2 focus:ring-0' : 'font-semibold text-accents-0 rounded-lg shadow-sm divide-y divide-accents-2 bg-accents-8 p-4 mb-2 focus:ring-0'}`}>
                                            <RadioGroup.Label as="h2" className='text-md leading-6 mb-2 border-none flex flex-row gap-2 justify-between'>
                                                Large ad
                          <p className="border-none text-xs font-normal pt-1">
                                                    50p per click
                        </p>
                                            </RadioGroup.Label>
                                        </RadioGroup.Option>
                                        <RadioGroup.Option value='price_1ISq6LBs47PjhYlFyBEnbnwz' className={({ checked }) => `${checked ? 'bg-pink font-semibold rounded-lg shadow-sm divide-y divide-accents-2 p-4 mb-2 focus:ring-0' : 'font-semibold text-accents-0 rounded-lg shadow-sm divide-y divide-accents-2 bg-accents-8 p-4 mb-2 focus:ring-0'}`}>
                                            <RadioGroup.Label as="h2" className='text-md leading-6 border-none flex flex-row gap-2 justify-between'>
                                                Small ad
                          <p className="border-none text-xs font-normal pt-1">
                                                    25p per click
                        </p>
                                            </RadioGroup.Label>
                                        </RadioGroup.Option>
                                    </RadioGroup>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="mx-auto py-1 px-3 text-sm border border-accents-6 text-black rounded-md hover:bg-white hover:text-black focus:bg-white focus:text-black focus:outline-none focus:ring-0 transition-all ease-in-out"
                                            onClick={submitData}
                                        >
                                            Continue to payment
                    </button>
                                    </div>

                                </> : null}
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

// This code works, so don't erase it in file wide refactors

export async function getServerSideProps({ req }) {
    const { user } = await supabase.auth.api.getUserByCookie(req)

    if (!user) {
        // If no user, redirect to index.
        return { props: {}, redirect: { destination: '/signin', permanent: false } }
    }

    // If there is a user, return it.
    return { props: { user } }
}