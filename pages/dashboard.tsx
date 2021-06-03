import Link from 'next/link'
import toast from 'react-hot-toast'
import { supabase } from '../utils/initSupabase'
import Navbar from '../components/nav'
import React, { useEffect } from 'react'
import { PlusCircleIcon, RefreshIcon } from '@heroicons/react/solid'
import { useState, Fragment } from 'react'
import { useUser } from '../lib/UserContext'
import { Dialog, Transition, RadioGroup } from '@headlessui/react'
import products from '../data/products.json'
import { useShoppingCart, formatCurrencyString } from 'use-shopping-cart'
import Layout from '../components/Layout'

// Random danger btn <button className="ml-3 py-1 px-3 text-sm border border-red text-red rounded-md hover:bg-red hover:text-white focus:bg-red focus:text-white focus:outline-none focus:ring-0 transition-all ease-in-out">Cancel project</button>

let Projects
let Uid

async function main() {
  let { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('owner', Uid)
    .then(Projects)

  if (error) {
    console.log(error)
    return
  }

  Projects = projects
  console.log(projects)
  console.log(Uid)
}

main()

function ProjectsList(props) {
  const { user, session } = useUser()

  Uid = user

  return (
    props.projectsList?.map((projectsList) =>
      <div key={projectsList.id} className="bg-base rounded-md border border-accents-0 mb-4">
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-1">{projectsList.name}</h3>
          <p className="text-accents-5">{projectsList.description}</p>
          <label htmlFor="prog" className="sr-only">Progress to completion</label>
          <div className="h-2 mt-5 bg-accents-0 rounded-full">
            <div className="rounded-full h-full bg-green" style={{ width: projectsList.progress + '%' }}></div>
          </div>
        </div>
        <hr className="mt-6 w-full border-t border-accents-0" />
        <div className="p-4 flex flex-row justify-between">
          <p className="text-accents-4 text-sm my-auto">Your project is under construction.</p>
          <a href={projectsList.url} target="_blank" className={`${projectsList.url ? 'ml-3 py-1 px-3 text-sm border border-accents-6 text-white rounded-md hover:bg-white hover:text-black focus:bg-white focus:text-black focus:outline-none focus:ring-0 transition-all ease-in-out' : 'ml-3 py-1 px-3 text-sm border border-accents-6 text-white rounded-md focus:outline-none focus:ring-0 transition-all ease-in-out cursor-not-allowed'}`}>{projectsList.url ? 'See preview' : 'Preview unavailable'}</a>
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
    let { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('owner', user?.id)
      .then(Projects)

    if (error) {
      console.log(error)
      return
    }

    Projects = projects
    console.log(projects)
    console.log(Uid)
  }

  async function create() {

  }

  main()

  return (
    <Layout title="Dashboard - Desica" full={true}>
      <div style={{ maxWidth: '520px', paddingTop: '9rem', margin: '0 auto 25px' }}>
        <div className="w-full flex flex-row justify-between">
          <h1 className="font-semibold text-4xl">Dashboard</h1>
          <div className="flex flex-row gap-2">
            <RefreshIcon className="opacity-50 h-5 w-5 my-auto cursor-pointer" onClick={reRender} />
            <AddModal user={user} />
          </div>
        </div>
        <hr className="border-t border-accents-2 my-4" />
        {Projects ? <ProjectsList projectsList={Projects} /> : <div className="w-full h-full flex flex-col gap-4 opacity-90">
          <svg className="h-10 w-10 mx-auto mt-8 opacity-75" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          <h1 className="text-2xl text-center">Welcome</h1>
          <p className="-mt-1 opacity-50 text-center">Get started by loading up your projects</p>
          <button onClick={reRender} className="mx-auto py-1 px-3 text-sm border border-accents-6 text-white rounded-md hover:bg-white hover:text-black focus:bg-white focus:text-black focus:outline-none focus:ring-0 transition-all ease-in-out">Load projects</button>
        </div>}
      </div>
    </Layout>
  )
}

export function AddModal({ user }) {
  const { checkoutSingleItem } = useShoppingCart()
  let [isOpen, setIsOpen] = useState(false)
  let [plan, setPlan] = useState('price_1IVaihBs47PjhYlFIV3Z5yXZ')
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
    const { data, error } = await supabase
      .from('projects')
      .insert([
        { name: nameField, description: descriptionField, owner: user.id, is_complete: false, has_paid: false, plan: plan, progress: 0, email: user.email },
      ])
      console.log(data)
      console.log(error)
    checkoutSingleItem({ sku: plan })
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
                  Create a project
                  </Dialog.Title>
                {stepOne ? <>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Tell us about your idea
                    </p>
                  </div>

                  <form className="mt-6 flex flex-col" onSubmit={next1}>
                    <input onChange={event => setNameField(event.target.value)} type="text" name="Name" id="NameField" placeholder="What is your project's name?" className="rounded border border-accents-6 py-1 px-3 text-black mb-2 w-2/3" required />
                    <textarea onChange={event => setDescriptionField(event.target.value)} name="Description" id="DescriptionField" placeholder="What's your project about?" className="rounded border border-accents-6 py-1 px-3 text-black mb-2 w-2/3" required />

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
                    <RadioGroup.Option value='price_1IVaihBs47PjhYlFIV3Z5yXZ' className={({ checked }) => `${checked ? 'bg-pink font-semibold rounded-lg shadow-sm divide-y divide-accents-2 p-4 mb-2 focus:ring-0' : 'font-semibold text-accents-0 rounded-lg shadow-sm divide-y divide-accents-2 bg-accents-8 p-4 mb-2 focus:ring-0'}`}>
                      <RadioGroup.Label as="h2" className='text-md leading-6 mb-2 border-none flex flex-row gap-2 justify-between'>
                        Plus
                          <p className="border-none text-xs font-normal pt-1">
                          £25 per month
                        </p>
                      </RadioGroup.Label>
                      <ul className="text-sm font-normal list-inside list-disc border-none opacity-90">
                        <li>Accept payments</li>
                        <li>Customer accounts</li>
                        <li>Hosting included</li>
                        <li>Domain included</li>
                        <li>Priority support</li>
                      </ul>
                    </RadioGroup.Option>
                    <RadioGroup.Option value='price_1IVN0fBs47PjhYlFoJbrLJyk' className={({ checked }) => `${checked ? 'bg-pink font-semibold rounded-lg shadow-sm divide-y divide-accents-2 p-4 mb-2 focus:ring-0' : 'font-semibold text-accents-0 rounded-lg shadow-sm divide-y divide-accents-2 bg-accents-8 p-4 mb-2 focus:ring-0'}`}>
                      <RadioGroup.Label as="h2" className='text-md leading-6 border-none flex flex-row gap-2 justify-between'>
                        Basic
                          <p className="border-none text-xs font-normal pt-1">
                          £10 per month
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
    return { props: {}, redirect: { destination: '/auth', permanent: false } }
  }

  // If there is a user, return it.
  return { props: { user } }
}