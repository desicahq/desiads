import { Popover, Transition, RadioGroup } from "@headlessui/react";
import { ChatAltIcon, CheckCircleIcon } from "@heroicons/react/solid";
import { Fragment, useState, useEffect } from "react";
import Link from 'next/link';
import { supabase } from '../utils/supabase-client'
import { useUser } from '../utils/useUser'
import useSWR from 'swr'
import Twemoji from 'react-twemoji'

const fetcher = (url, token) =>
    fetch(url, {
        method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json', token }),
        credentials: 'same-origin',
    }).then((res) => res.json())

export default function Feedback() {
    const { user, session } = useUser()
    const { data, error } = useSWR(session ? ['/api/getUser', session.access_token] : null, fetcher)
    const [authView, setAuthView] = useState('sign_in')

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') setAuthView('update_password')
            if (event === 'USER_UPDATED') setTimeout(() => setAuthView('sign_in'), 1000)
            // Send session to /api/auth route to set the auth cookie.
            // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
            fetch('/api/auth', {
                method: 'POST',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                credentials: 'same-origin',
                body: JSON.stringify({ event, session }),
            }).then((res) => res.json())
        })

        return () => {
            authListener.unsubscribe()
        }
    }, [])

    let [user_feedback, setFeedback] = useState('')
    let [emote, setEmote] = useState('')
    let [email, setEmail] = useState('')
    let [sent, setSent] = useState(false)

    async function submitForm(e) {
        e.preventDefault()
        if (!user_feedback) return
        if (!user) {
            let { data, error } = await supabase
                .from('feedback')
                .insert([{ feedback: user_feedback, email: email, emote: emote }])
            setEmote('')
            setSent(true)
            return
        }
        let { data, error } = await supabase
            .from('feedback')
            .insert([{ feedback: user_feedback, user: user.id, email: user.email, emote: emote }])
        setEmote('')
        setSent(true)
        return
    }

    return (
        <a className="ml-1 max-w-sm focus:outline-none focus:ring-0">
            <Popover className="relative">
                {({ open }) => (
                    <>
                        <Popover.Button
                            className={`
                ${open ? "" : "text-opacity-90"}
                text-white pt-3 group bg-orange-700 px-3 py-2 rounded-md inline-flex items-center text-base font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                            <ChatAltIcon
                                className={`h-5 w-5 text-orange-300 group-hover:text-opacity-80 transition ease-in-out duration-150`}
                                aria-hidden="true"
                            />
                        </Popover.Button>
                        <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel
                                static
                                className="absolute z-10 w-72 max-w-sm px-4 mt-3 transform -translate-x-56 sm:px-0 -left-5"
                            >
                                <div className="w-full">
                                    <form className={`${sent ? 'flex items-center justify-items-center' : ''} overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-3 bg-white w-full`} onSubmit={(e) => submitForm(e)}>
                                        {!sent ?
                                            <div>
                                                {!user ? <>
                                                    <label htmlFor="email" className="text-black uppercase text-xs font-semibold pl-1">Email</label>
                                                    <input name="email" className="text-black w-full p-2 rounded mt-1 border border-accents-6 text-sm mb-2" placeholder="Enter an email" onChange={event => setEmail(event.target.value)} type="email" required />
                                                </> : null}
                                                <label htmlFor="feedback" className="text-black uppercase text-xs font-semibold pl-1">Feedback</label>
                                                <textarea name="feedback" className="text-black w-full p-2 rounded mt-1 border border-accents-6 text-sm" placeholder="What do you have to say?" onChange={event => setFeedback(event.target.value)} required></textarea>
                                                <RadioGroup value={emote} onChange={setEmote} className="flex flex-row justify-between mt-2">
                                                    <Twemoji options={{ className: '' }}>
                                                        <div className="flex flex-row items-center">
                                                            <RadioGroup.Option value="😍" className={({ checked, active }) => `
                                                        ${checked ? 'border border-pink w-9 h-9' : 'border border-accents-6 w-8 h-8 hover:p-1 hover:border-accents-5 my-0.5'}
                                                        ${active ? 'ring-1 ring-pink' : ''}
                                                        rounded-full cursor-pointer transition-all p-1.5 duration-200 ease-in-out mr-2`}>😍</RadioGroup.Option>
                                                            <RadioGroup.Option value="😄" className={({ checked, active }) => `
                                                        ${checked ? 'border border-pink w-9 h-9' : 'border border-accents-6 w-8 h-8 hover:p-1 hover:border-accents-5 my-0.5'}
                                                        ${active ? 'ring-1 ring-pink' : ''}
                                                        rounded-full cursor-pointer transition-all p-1.5 duration-200 ease-in-out mr-2`}>😄</RadioGroup.Option>
                                                            <RadioGroup.Option value="😕" className={({ checked, active }) => `
                                                        ${checked ? 'border border-pink w-9 h-9' : 'border border-accents-6 w-8 h-8 hover:p-1 hover:border-accents-5 my-0.5'}
                                                        ${active ? 'ring-1 ring-pink' : ''}
                                                        rounded-full cursor-pointer transition-all p-1.5 duration-200 ease-in-out mr-2`}>😕</RadioGroup.Option>
                                                            <RadioGroup.Option value="😥" className={({ checked, active }) => `
                                                        ${checked ? 'border border-pink w-9 h-9' : 'border border-accents-6 w-8 h-8 hover:p-1 hover:border-accents-5 my-0.5'}
                                                        ${active ? 'ring-1 ring-pink' : ''}
                                                        rounded-full cursor-pointer transition-all p-1.5 duration-200 ease-in-out mr-2`}>😥</RadioGroup.Option>
                                                        </div>
                                                    </Twemoji>
                                                    <button type="submit" className="py-1 px-3 text-sm text-black rounded-md hover:bg-white hover:text-black focus:bg-white focus:text-black focus:outline-none focus:ring-0 transition-all ease-in-out border border-accents-6 focus:border-pink">Send</button>
                                                </RadioGroup>
                                            </div> : <div className="mx-auto overflow-hidden bg-white">
                                                <div className="flex items-center justify-items-center text-black">
                                                    <div className="flex flex-col gap-4 opacity-90 p-4">
                                                        <svg className="h-16 w-16 mx-auto opacity-75" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <h1 className="text-2xl text-center">Feedback sent</h1>
                                                        <p className="-mt-3 opacity-50 text-center">We are very grateful</p>
                                                    </div>
                                                </div>
                                            </div>}
                                    </form>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </a>
    );
}
